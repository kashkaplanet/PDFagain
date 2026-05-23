"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Crop, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function CropPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    // Crop in inches
    const [cropTop, setCropTop] = useState(0.5);
    const [cropBottom, setCropBottom] = useState(0.5);
    const [cropLeft, setCropLeft] = useState(0.5);
    const [cropRight, setCropRight] = useState(0.5);

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

    const handleCrop = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            
            const pages = pdfDoc.getPages();
            
            // 72 points per inch
            const PPI = 72;
            const topPts = cropTop * PPI;
            const bottomPts = cropBottom * PPI;
            const leftPts = cropLeft * PPI;
            const rightPts = cropRight * PPI;

            for (const page of pages) {
                // Get the current crop box or media box
                const { x, y, width, height } = page.getCropBox() || page.getMediaBox();
                
                // Ensure we don't crop more than the page's dimensions
                if (leftPts + rightPts >= width || topPts + bottomPts >= height) {
                    throw new Error("Crop margins are larger than the page dimensions.");
                }

                // In PDF coordinate system, origin (0,0) is usually the bottom-left corner.
                const newX = x + leftPts;
                const newY = y + bottomPts;
                const newWidth = width - leftPts - rightPts;
                const newHeight = height - topPts - bottomPts;

                page.setCropBox(newX, newY, newWidth, newHeight);
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            
            setDownloadUrl(url);
        } catch (err: any) {
            console.error("Failed to crop PDF:", err);
            setError(err.message || "Failed to process the PDF. Ensure it's not encrypted.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!downloadUrl || !file) return;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = file.name.replace(".pdf", "_cropped.pdf");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <ToolPageWrapper
            title="Crop PDF"
            description="Trim the visible area or margins of your PDF pages."
            icon={Crop}
            color="purple"
        >
            <RetroCard className="max-w-2xl mx-auto py-8" variant="default">
                {!file ? (
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        multiple={false}
                        title="Upload PDF"
                        description="Select a .pdf file to crop"
                        variant="purple"
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center space-x-4 p-4 bg-[#C084FC]/10 border-2 border-black">
                            <div className="p-3 bg-[#C084FC] border-2 border-black">
                                <Crop className="w-6 h-6" />
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
                                    <label className="block font-display text-sm mb-1">Crop Top (Inches)</label>
                                    <input 
                                        type="number" 
                                        min="0" step="0.1" 
                                        value={cropTop}
                                        onChange={(e) => setCropTop(Number(e.target.value))}
                                        className="w-full border-2 border-black p-2 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-display text-sm mb-1">Crop Bottom (Inches)</label>
                                    <input 
                                        type="number" 
                                        min="0" step="0.1" 
                                        value={cropBottom}
                                        onChange={(e) => setCropBottom(Number(e.target.value))}
                                        className="w-full border-2 border-black p-2 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-display text-sm mb-1">Crop Left (Inches)</label>
                                    <input 
                                        type="number" 
                                        min="0" step="0.1" 
                                        value={cropLeft}
                                        onChange={(e) => setCropLeft(Number(e.target.value))}
                                        className="w-full border-2 border-black p-2 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-display text-sm mb-1">Crop Right (Inches)</label>
                                    <input 
                                        type="number" 
                                        min="0" step="0.1" 
                                        value={cropRight}
                                        onChange={(e) => setCropRight(Number(e.target.value))}
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
                                label="Crop Document"
                                isProcessing={isProcessing}
                                processingText="Cropping..."
                                onClick={handleCrop}
                                color="purple"
                                icon={<Crop className="w-5 h-5" />}
                            />
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-[#C084FC]/20 border-2 border-black text-center">
                                    <p className="font-display">
                                        ✓ Document cropped successfully!
                                    </p>
                                </div>
                                <RetroActionButton
                                    label="Download Cropped PDF"
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
