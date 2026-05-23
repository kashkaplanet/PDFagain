"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Maximize, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function AddMarginsClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    // Margins in inches
    const [marginTop, setMarginTop] = useState(1);
    const [marginBottom, setMarginBottom] = useState(1);
    const [marginLeft, setMarginLeft] = useState(1);
    const [marginRight, setMarginRight] = useState(1);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError(null);
            setDownloadUrl(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleApplyMargins = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            
            const pages = pdfDoc.getPages();
            
            // 72 points per inch
            const PPI = 72;
            const topPts = marginTop * PPI;
            const bottomPts = marginBottom * PPI;
            const leftPts = marginLeft * PPI;
            const rightPts = marginRight * PPI;

            for (const page of pages) {
                const { width, height } = page.getSize();
                
                // Increase page size by the margin amounts
                page.setSize(width + leftPts + rightPts, height + topPts + bottomPts);
                
                // Translate the existing content to its new centered/shifted position
                page.translateContent(leftPts, bottomPts);
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            
            setDownloadUrl(url);
        } catch (err) {
            console.error("Failed to add margins:", err);
            setError("Failed to process the PDF. Ensure it's not encrypted.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!downloadUrl || !file) return;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = file.name.replace(".pdf", "_margins.pdf");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <ToolPageWrapper
            title="Add Margins to PDF"
            description="Add white space or padding around the edges of your PDF pages."
            icon={Maximize}
            color="purple"
        >
            <RetroCard className="max-w-2xl mx-auto py-8" variant="default">
                {!file ? (
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        multiple={false}
                        title="Upload PDF"
                        description="Select a .pdf file to adjust"
                        variant="purple"
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center space-x-4 p-4 bg-[#C084FC]/10 border-2 border-black">
                            <div className="p-3 bg-[#C084FC] border-2 border-black">
                                <Maximize className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-display truncate">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setDownloadUrl(null); }}
                                className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                            >
                                Change
                            </button>
                        </div>

                        {!downloadUrl && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-display text-sm mb-1">Top Margin (Inches)</label>
                                    <input 
                                        type="number" 
                                        min="0" step="0.1" 
                                        value={marginTop}
                                        onChange={(e) => setMarginTop(Number(e.target.value))}
                                        className="w-full border-2 border-black p-2 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-display text-sm mb-1">Bottom Margin (Inches)</label>
                                    <input 
                                        type="number" 
                                        min="0" step="0.1" 
                                        value={marginBottom}
                                        onChange={(e) => setMarginBottom(Number(e.target.value))}
                                        className="w-full border-2 border-black p-2 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-display text-sm mb-1">Left Margin (Inches)</label>
                                    <input 
                                        type="number" 
                                        min="0" step="0.1" 
                                        value={marginLeft}
                                        onChange={(e) => setMarginLeft(Number(e.target.value))}
                                        className="w-full border-2 border-black p-2 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-display text-sm mb-1">Right Margin (Inches)</label>
                                    <input 
                                        type="number" 
                                        min="0" step="0.1" 
                                        value={marginRight}
                                        onChange={(e) => setMarginRight(Number(e.target.value))}
                                        className="w-full border-2 border-black p-2 font-mono"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans">
                                {error}
                            </div>
                        )}

                        {!downloadUrl ? (
                            <RetroActionButton
                                label="Apply Margins"
                                isProcessing={isProcessing}
                                processingText="Applying..."
                                onClick={handleApplyMargins}
                                color="purple"
                                icon={<Maximize className="w-5 h-5" />}
                            />
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-[#C084FC]/20 border-2 border-black text-center">
                                    <p className="font-display">
                                        ✓ Margins applied successfully!
                                    </p>
                                </div>
                                <RetroActionButton
                                    label="Download Adjusted PDF"
                                    onClick={handleDownload}
                                    color="purple"
                                    icon={<Download className="w-5 h-5" />}
                                    isProcessing={false}
                                    processingText=""
                                />
                            </div>
                        )}
                    </div>
                )}
            </RetroCard>
        </ToolPageWrapper>
    );
}
