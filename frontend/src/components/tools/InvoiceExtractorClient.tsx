"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
import { Receipt, Copy, Download, CheckCircle2 } from "lucide-react";



interface InvoiceData {
    invoiceNumber: string | null;
    date: string | null;
    dueDate: string | null;
    vendor: string | null;
    total: string | null;
    subtotal: string | null;
    tax: string | null;
    lineItems: Array<{ description: string; amount: string }>;
    rawText: string;
}

export default function InvoiceExtractorClient() {
    const [file, setFile] = useState<File | null>(null);
    const { pdfProxy, pageCount, loading } = usePDF(file);
    const [isProcessing, setIsProcessing] = useState(false);
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [copied, setCopied] = useState(false);
    const [useOCR, setUseOCR] = useState(false);
    const [ocrProgress, setOcrProgress] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setInvoiceData(null);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const extractInvoiceData = (text: string): InvoiceData => {
        const lines = text.split("\n").map(l => l.trim()).filter(l => l);

        const invoiceNumMatch = text.match(/invoice\s*#?\s*:?\s*([A-Z0-9\-]+)/i) ||
            text.match(/inv\s*#?\s*:?\s*([A-Z0-9\-]+)/i) ||
            text.match(/#\s*([A-Z0-9\-]+)/i);

        const datePatterns = [
            /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
            /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,
            /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s*\d{4})/gi
        ];

        const dates: string[] = [];
        datePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) dates.push(...matches);
        });

        const amountPattern = /\$?\s*([\d]+(?:[\s,]*\d{3})*(?:[\s]*\.[\s]*\d{0,2})?)/g;
        const amounts: number[] = [];
        let match;
        while ((match = amountPattern.exec(text)) !== null) {
            const clearNum = match[1].replace(/[\s,]/g, "");
            const val = parseFloat(clearNum);
            if (!isNaN(val) && val > 0) amounts.push(val);
        }

        const totalLabelMatch = text.match(/\b(?:total|balance\s+due|amount\s+due|grand\s+total)\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i);
        let total = null;

        if (totalLabelMatch) {
            const val = parseFloat(totalLabelMatch[1].replace(/,/g, ""));
            if (!isNaN(val)) {
                total = `$${val.toFixed(2)}`;
            }
        }

        if (!total) {
            const sortedAmounts = [...amounts].sort((a, b) => b - a);
            total = sortedAmounts[0] ? `$${sortedAmounts[0].toFixed(2)}` : null;
        }

        const vendorLine = lines.slice(0, 5).find(l =>
            l.length > 3 &&
            l.length < 50 &&
            !l.match(/invoice|date|bill|total|amount/i)
        );

        const lineItems: Array<{ description: string; amount: string }> = [];
        lines.forEach(line => {
            const lineMatch = line.match(/(.+?)\s+\$?([\d\s,]+\.?[\d\s]{0,2})$/);
            if (lineMatch && lineMatch[1].length > 3) {
                const rawAmount = lineMatch[2];
                const cleanAmountStr = rawAmount.replace(/[\s,]/g, "");
                const val = parseFloat(cleanAmountStr);

                if (!isNaN(val)) {
                    lineItems.push({
                        description: lineMatch[1].trim(),
                        amount: `$${val.toFixed(2)}`
                    });
                }
            }
        });

        const taxMatch = text.match(/tax\s*:?\s*\$?([\d,]+\.?\d{0,2})/i) ||
            text.match(/vat\s*:?\s*\$?([\d,]+\.?\d{0,2})/i);

        const subtotalMatch = text.match(/subtotal\s*:?\s*\$?([\d,]+\.?\d{0,2})/i);

        return {
            invoiceNumber: invoiceNumMatch ? invoiceNumMatch[1] : null,
            date: dates[0] || null,
            dueDate: dates[1] || null,
            vendor: vendorLine || null,
            total,
            subtotal: subtotalMatch ? `$${parseFloat(subtotalMatch[1].replace(/,/g, "")).toFixed(2)}` : null,
            tax: taxMatch ? `$${parseFloat(taxMatch[1].replace(/,/g, "")).toFixed(2)}` : null,
            lineItems: lineItems.slice(0, 20),
            rawText: text
        };
    };

    const performOCR = async (): Promise<string> => {
        if (!pdfProxy) return "";
        let fullText = "";

        try {
            setOcrProgress("Initializing OCR engine...");
            const { createWorker } = await import("tesseract.js");
            const worker = await createWorker("eng");

            for (let i = 1; i <= pageCount; i++) {
                setOcrProgress(`Processing page ${i} of ${pageCount}...`);
                const page = await pdfProxy.getPage(i);

                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({
                        canvasContext: context,
                        viewport: viewport,

                    } as any).promise;

                    const imageUrl = canvas.toDataURL("image/png");
                    const { data: { text } } = await worker.recognize(imageUrl);
                    fullText += text + "\n";
                }
            }

            await worker.terminate();
        } catch (err) {
            console.error("OCR Error:", err);
            throw err;
        }

        return fullText;
    };

    const handleExtract = async () => {
        if (!pdfProxy) return;

        setIsProcessing(true);
        setOcrProgress("");
        setError(null);
        try {
            let fullText = "";

            if (useOCR) {
                fullText = await performOCR();
            } else {
                for (let i = 1; i <= pageCount; i++) {
                    const page = await pdfProxy.getPage(i);
                    const textContent = await page.getTextContent();

                    const items = textContent.items as any[];
                    const rows: { y: number; items: any[] }[] = [];

                    items.forEach((item) => {
                        if (!item.str.trim()) return;

                        const y = item.transform[5];
                        let row = rows.find(r => Math.abs(r.y - y) < 5);

                        if (!row) {
                            row = { y, items: [] };
                            rows.push(row);
                        }

                        row.items.push(item);
                    });

                    rows.sort((a, b) => b.y - a.y);

                    const pageText = rows.map(row => {
                        row.items.sort((a, b) => a.transform[4] - b.transform[4]);

                        let rowText = "";
                        let lastX = -1;
                        let lastWidth = 0;

                        row.items.forEach(item => {
                            const x = item.transform[4];
                            const text = item.str;
                            let width = item.width;
                            if (!width || width === 0) {
                                const fontSize = item.transform[0];
                                width = text.length * (fontSize * 0.4);
                            }

                            if (lastX >= 0) {
                                const gap = x - (lastX + lastWidth);
                                const threshold = Math.max(2, item.transform[0] * 0.2);

                                if (gap > threshold && item.str.trim().length > 0) {
                                    rowText += " ";
                                }
                            }

                            rowText += text;
                            lastX = x;
                            lastWidth = width;
                        });

                        return rowText;
                    }).join("\n");

                    fullText += pageText + "\n";
                }
            }

            const data = extractInvoiceData(fullText);
            setInvoiceData(data);
        } catch (err) {
            console.error("Failed to extract invoice data:", err);
            setError("Failed to extract invoice data. Please try again.");
        } finally {
            setIsProcessing(false);
            setOcrProgress("");
        }
    };

    const handleCopy = () => {
        if (!invoiceData) return;
        const json = JSON.stringify(invoiceData, null, 2);
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadCSV = () => {
        if (!invoiceData) return;

        let csv = "Field,Value\n";
        csv += `Invoice Number,${invoiceData.invoiceNumber || ""}\n`;
        csv += `Vendor,${invoiceData.vendor || ""}\n`;
        csv += `Date,${invoiceData.date || ""}\n`;
        csv += `Due Date,${invoiceData.dueDate || ""}\n`;
        csv += `Subtotal,${invoiceData.subtotal || ""}\n`;
        csv += `Tax,${invoiceData.tax || ""}\n`;
        csv += `Total,${invoiceData.total || ""}\n`;
        csv += "\nLine Items\n";
        csv += "Description,Amount\n";
        invoiceData.lineItems.forEach(item => {
            csv += `"${item.description}",${item.amount}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice_data_${file?.name.replace(".pdf", "")}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ToolPageWrapper
            title="Invoice Extractor"
            description="Extract key data from invoice PDFs automatically."
            icon={Receipt}
            color="green"
        >
            {!file ? (
                <RetroCard className="max-w-2xl mx-auto">
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select Invoice PDF"
                        description="Drag & drop or click to browse"
                        variant="green"
                    />
                </RetroCard>
            ) : !invoiceData ? (
                <RetroCard className="max-w-xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-[#A3E635]/10 border-2 border-black">
                        <div className="p-3 bg-[#A3E635] border-2 border-black">
                            <Receipt className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-display truncate">
                                {file.name}
                            </h2>
                            <p className="text-sm text-gray-600 font-sans">
                                {pageCount} pages • {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {/* OCR Option */}
                    <label className="flex items-center space-x-2 mb-6 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={useOCR}
                            onChange={(e) => setUseOCR(e.target.checked)}
                            className="w-5 h-5 border-2 border-black accent-[#A3E635]"
                        />
                        <span className="font-sans text-sm">
                            Enable OCR (for scanned invoices) - Slower
                        </span>
                    </label>

                    <RetroActionButton
                        label="Extract Invoice Data"
                        isProcessing={isProcessing}
                        processingText={useOCR && ocrProgress ? ocrProgress : "Extracting..."}
                        onClick={handleExtract}
                        disabled={loading}
                        color="green"
                        icon={<Receipt className="w-5 h-5" />}
                    />

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-sans">
                            {error}
                        </div>
                    )}
                </RetroCard>
            ) : (
                <RetroCard>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display">Extracted Data</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex items-center px-4 py-2 text-sm font-display border-2 border-black bg-white hover:bg-gray-100 transition-colors"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                {copied ? "Copied!" : "Copy JSON"}
                            </button>
                            <button
                                onClick={handleDownloadCSV}
                                className="flex items-center px-4 py-2 text-sm font-display border-2 border-black bg-[#A3E635] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                <Download className="w-4 h-4 mr-1" />
                                Download CSV
                            </button>
                        </div>
                    </div>

                    {/* Data Fields */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <DataField label="Invoice #" value={invoiceData.invoiceNumber} />
                        <DataField label="Vendor" value={invoiceData.vendor} />
                        <DataField label="Date" value={invoiceData.date} />
                        <DataField label="Due Date" value={invoiceData.dueDate} />
                        <DataField label="Subtotal" value={invoiceData.subtotal} />
                        <DataField label="Tax" value={invoiceData.tax} />
                        <DataField label="Total" value={invoiceData.total} highlight />
                    </div>

                    {/* Line Items */}
                    {invoiceData.lineItems.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-display mb-3">Line Items</h3>
                            <div className="border-2 border-black overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-left px-4 py-2 font-display border-b-2 border-black">Description</th>
                                            <th className="text-right px-4 py-2 font-display border-b-2 border-black">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceData.lineItems.map((item, i) => (
                                            <tr key={i} className="border-b border-gray-200 last:border-b-0">
                                                <td className="px-4 py-2 font-sans">{item.description}</td>
                                                <td className="px-4 py-2 text-right font-display">{item.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Raw Text */}
                    <details className="mb-6">
                        <summary className="text-gray-500 cursor-pointer hover:text-black text-sm font-display">View Raw Extracted Text</summary>
                        <pre className="mt-4 p-4 bg-gray-100 border-2 border-black text-xs overflow-auto whitespace-pre-wrap font-mono h-64">
                            {invoiceData.rawText}
                        </pre>
                    </details>

                    <button
                        onClick={() => { setFile(null); setInvoiceData(null); }}
                        className="w-full py-3 border-2 border-black bg-white hover:bg-gray-100 font-display transition-colors"
                    >
                        Extract Another Invoice
                    </button>
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}

function DataField({ label, value, highlight = false }: { label: string; value: string | null; highlight?: boolean }) {
    return (
        <div className={`p-3 border-2 border-black ${highlight ? "bg-[#A3E635]/20" : "bg-white"}`}>
            <div className="text-xs text-gray-500 font-sans mb-1">{label}</div>
            <div className={`font-display ${highlight ? "text-lg" : ""}`}>
                {value || "Not found"}
            </div>
        </div>
    );
}
