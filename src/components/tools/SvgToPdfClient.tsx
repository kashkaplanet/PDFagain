"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { PenTool, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function SvgToPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError(null);
            setDownloadUrl(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "image/svg+xml": [".svg"] },
    });

    const handleConvert = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            // Render SVG to Canvas to get a PNG representation
            const svgUrl = URL.createObjectURL(file);
            const img = new Image();
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = svgUrl;
            });

            // Default dimensions if SVG is not explicit
            const width = img.width || 800;
            const height = img.height || 600;

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not create canvas context");

            // Draw white background
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            
            // Draw SVG
            ctx.drawImage(img, 0, 0, width, height);

            const pngBlob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, "image/png", 1.0);
            });

            if (!pngBlob) throw new Error("Could not convert SVG to PNG");

            const pngArrayBuffer = await pngBlob.arrayBuffer();

            // Create PDF and embed PNG
            const pdfDoc = await PDFDocument.create();
            const pngImage = await pdfDoc.embedPng(pngArrayBuffer);
            
            const page = pdfDoc.addPage([width, height]);
            page.drawImage(pngImage, {
                x: 0,
                y: 0,
                width: width,
                height: height,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            
            setDownloadUrl(url);
            URL.revokeObjectURL(svgUrl);
        } catch (err: any) {
            console.error("Failed to convert SVG:", err);
            setError(err.message || "Failed to process the SVG file.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!downloadUrl || !file) return;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = file.name.replace(/\.svg$/i, ".pdf");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <ToolPageWrapper
            title="SVG to PDF"
            description="Convert scalable vector graphics into high-quality PDF documents."
            icon={PenTool}
            color="cyan"
        >
            <RetroCard className="max-w-2xl mx-auto py-8" variant="default">
                {!file ? (
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        accept={{ "image/svg+xml": [".svg"] }}
                        multiple={false}
                        title="Upload SVG"
                        description="Select an .svg file to convert"
                        variant="cyan"
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center space-x-4 p-4 bg-[#22D3EE]/10 border-2 border-black">
                            <div className="p-3 bg-[#22D3EE] border-2 border-black">
                                <PenTool className="w-6 h-6" />
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

                        {error && (
                            <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans">
                                {error}
                            </div>
                        )}

                        {!downloadUrl ? (
                            <RetroActionButton
                                label="Convert to PDF"
                                isProcessing={isProcessing}
                                processingText="Converting..."
                                onClick={handleConvert}
                                color="cyan"
                                icon={<PenTool className="w-5 h-5" />}
                            />
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-[#22D3EE]/20 border-2 border-black text-center">
                                    <p className="font-display">
                                        ✓ Document converted successfully!
                                    </p>
                                </div>
                                <RetroActionButton
                                    label="Download PDF"
                                    onClick={handleDownload}
                                    color="cyan"
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
