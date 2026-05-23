"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { FileX, Download } from "lucide-react";
import { usePDF } from "@/hooks/usePDF";
import { PDFDocument } from "pdf-lib";

export default function RemoveEmptyPagesClient() {
    const [file, setFile] = useState<File | null>(null);
    const { pdfProxy, pageCount, loading: pdfLoading } = usePDF(file);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [removedCount, setRemovedCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setDownloadUrl(null);
            setRemovedCount(0);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleRemoveEmpty = async () => {
        if (!pdfProxy || !file) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);

        try {
            const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
            const { OPS } = pdfjsLib;
            
            // Operators that actually draw visible content
            const drawingOps = new Set([
                OPS.paintImageXObject,
                OPS.paintInlineImageXObject,
                OPS.paintFormXObject,
                OPS.fill, OPS.eoFill, OPS.fillStroke, OPS.eoFillStroke,
                OPS.stroke,
                OPS.showText, OPS.showSpacedText
            ]);

            const blankPageIndices: number[] = [];

            // Phase 1: Analyze pages using pdfjs-dist
            for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
                const page = await pdfProxy.getPage(pageNum);
                const operatorList = await page.getOperatorList();
                
                let hasVisibleContent = false;
                for (let i = 0; i < operatorList.fnArray.length; i++) {
                    if (drawingOps.has(operatorList.fnArray[i])) {
                        hasVisibleContent = true;
                        break;
                    }
                }

                if (!hasVisibleContent) {
                    // Double check with text content just to be absolutely sure
                    const textContent = await page.getTextContent();
                    if (textContent.items.length === 0) {
                        // 0-indexed for pdf-lib
                        blankPageIndices.push(pageNum - 1);
                    }
                }
                setProgress(Math.round((pageNum / pageCount) * 50));
            }

            if (blankPageIndices.length === 0) {
                setError("No completely empty pages were found in this document.");
                setIsProcessing(false);
                return;
            }

            // Phase 2: Remove pages using pdf-lib
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Remove from the end to the beginning to avoid index shifting
            for (let i = blankPageIndices.length - 1; i >= 0; i--) {
                pdfDoc.removePage(blankPageIndices[i]);
            }
            
            setProgress(80);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            
            setRemovedCount(blankPageIndices.length);
            setDownloadUrl(url);
            setProgress(100);
        } catch (err) {
            console.error("Failed to remove empty pages:", err);
            setError("An error occurred. The PDF might be corrupted or protected.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!downloadUrl || !file) return;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = file.name.replace(".pdf", "_cleaned.pdf");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <ToolPageWrapper
            title="Remove Empty Pages"
            description="Automatically detect and delete blank pages from your PDF documents."
            icon={FileX}
            color="pink"
        >
            {!file ? (
                <RetroCard className="max-w-2xl mx-auto">
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF File"
                        description="Upload a PDF to scan for blank pages"
                        variant="pink"
                    />
                </RetroCard>
            ) : (
                <RetroCard className="max-w-xl mx-auto">
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-[#F472B6]/10 border-2 border-black">
                        <div className="p-3 bg-[#F472B6] border-2 border-black">
                            <FileX className="w-6 h-6 text-white" />
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
                            onClick={() => { setFile(null); setDownloadUrl(null); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-sans">
                            {error}
                        </div>
                    )}

                    {isProcessing && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between text-sm font-display mb-2">
                                <span>Scanning and cleaning document...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-3 border-2 border-black bg-white overflow-hidden">
                                <div
                                    className="h-full bg-[#F472B6] transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {!downloadUrl && !isProcessing && (
                        <RetroActionButton
                            label="Scan and Remove Empty Pages"
                            isProcessing={isProcessing}
                            processingText="Processing..."
                            onClick={handleRemoveEmpty}
                            disabled={pdfLoading || !pdfProxy}
                            color="pink"
                            icon={<FileX className="w-5 h-5" />}
                        />
                    )}

                    {downloadUrl && (
                        <div className="space-y-4">
                            <div className="p-4 bg-[#A3E635]/10 border-2 border-[#A3E635] text-center">
                                <p className="font-display text-lg">
                                    ✓ Document cleaned successfully!
                                </p>
                                <p className="font-sans text-gray-700">
                                    Removed {removedCount} blank {removedCount === 1 ? 'page' : 'pages'}.
                                </p>
                            </div>
                            <RetroActionButton
                                label="Download Clean PDF"
                                onClick={handleDownload}
                                color="pink"
                                icon={<Download className="w-5 h-5" />}
                                isProcessing={false}
                                processingText=""
                            />
                        </div>
                    )}
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
