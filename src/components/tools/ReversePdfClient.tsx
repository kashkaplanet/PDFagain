"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { PDFDocument } from "pdf-lib";
import { Download, ArrowDownUp } from "lucide-react";

export default function ReversePdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = async (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError(null);
            try {
                const arrayBuffer = await files[0].arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                setPageCount(pdfDoc.getPageCount());
            } catch (err) {
                console.error("Failed to load PDF:", err);
            }
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleReverse = async () => {
        if (!file) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);

        // Simulate progress since pdf-lib is synchronous but save() can take time
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return prev;
                return prev + 5;
            });
        }, 100);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);
            const newDoc = await PDFDocument.create();

            const pages = srcDoc.getPages();

            for (let i = pages.length - 1; i >= 0; i--) {
                const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
                newDoc.addPage(copiedPage);
            }

            const pdfBytes = await newDoc.save();

            clearInterval(interval);
            setProgress(100);

            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `reversed_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to reverse PDF:", err);
            setError("Failed to reverse PDF.");
        } finally {
            clearInterval(interval);
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <ToolPageWrapper
            title="Reverse PDF"
            description="Reverse the order of pages in your PDF document."
            icon={ArrowDownUp}
            color="pink"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        accept={{
                            "application/pdf": [".pdf"],
                            "application/x-pdf": [".pdf"],
                            "application/acrobat": [".pdf"],
                            "application/nappdf": [".pdf"],
                            "application/x-force-download": [".pdf"]
                        }}
                        title="Select PDF to Reverse"
                        description="Drag & drop or click to browse"
                        variant="pink"
                    />
                </RetroCard>
            ) : (
                <RetroCard className="max-w-3xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center justify-between mb-8 p-4 bg-[#F472B6]/10 border-2 border-black">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#F472B6] border-2 border-black">
                                <ArrowDownUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-display truncate max-w-[200px]">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    {pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change File
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="mb-8 p-6 bg-white border-2 border-black">
                        <h3 className="text-sm font-display mb-4 uppercase tracking-wider text-center">Page Order Preview</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
                            <div className="text-center">
                                <div className="text-gray-600 text-xs mb-3 font-display uppercase tracking-wide">Original Order</div>
                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
                                        <div key={i} className="w-10 h-14 bg-gray-100 border-2 border-black text-xs flex items-center justify-center font-display">
                                            {i + 1}
                                        </div>
                                    ))}
                                    {pageCount > 5 && <span className="text-gray-600 self-end mb-2">...</span>}
                                </div>
                            </div>

                            <div className="p-2 bg-[#F472B6] border-2 border-black">
                                <ArrowDownUp className="w-6 h-6" />
                            </div>

                            <div className="text-center">
                                <div className="text-gray-600 text-xs mb-3 font-display uppercase tracking-wide">Reversed Order</div>
                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
                                        <div key={i} className="w-10 h-14 bg-[#F472B6]/20 border-2 border-[#F472B6] text-xs flex items-center justify-center font-display font-bold">
                                            {pageCount - i}
                                        </div>
                                    ))}
                                    {pageCount > 5 && <span className="text-gray-600 self-end mb-2">...</span>}
                                </div>
                            </div>

                        </div>
                    </div>



                    {isProcessing && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between text-sm font-display mb-2">
                                <span>Reversing PDF...</span>
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

                    {error && (
                        <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6">
                            {error}
                        </div>
                    )}

                    <RetroActionButton
                        label="Reverse & Download"
                        isProcessing={isProcessing}
                        processingText="Processing PDF..."
                        onClick={handleReverse}
                        color="pink"
                        icon={<Download className="w-5 h-5" />}
                    />
                </RetroCard>
            )
            }
        </ToolPageWrapper >
    );
}
