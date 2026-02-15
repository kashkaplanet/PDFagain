"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { PDFDocument } from "pdf-lib";
import { Download, Maximize2 } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZES = {
    "A4": { width: 595.28, height: 841.89, label: "A4 (210 × 297 mm)" },
    "Letter": { width: 612, height: 792, label: "Letter (8.5 × 11 in)" },
    "Legal": { width: 612, height: 1008, label: "Legal (8.5 × 14 in)" },
    "A3": { width: 841.89, height: 1190.55, label: "A3 (297 × 420 mm)" },
    "A5": { width: 419.53, height: 595.28, label: "A5 (148 × 210 mm)" },
    "Tabloid": { width: 792, height: 1224, label: "Tabloid (11 × 17 in)" },
};

type PageSizeKey = keyof typeof PAGE_SIZES;

export default function ResizePdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedSize, setSelectedSize] = useState<PageSizeKey>("A4");
    const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleResize = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const pageSize = PAGE_SIZES[selectedSize];
            let targetWidth = pageSize.width;
            let targetHeight = pageSize.height;

            if (orientation === "landscape") {
                [targetWidth, targetHeight] = [targetHeight, targetWidth];
            }

            const pages = pdfDoc.getPages();

            for (const page of pages) {
                const { width: origWidth, height: origHeight } = page.getSize();

                const scaleX = targetWidth / origWidth;
                const scaleY = targetHeight / origHeight;
                const scale = Math.min(scaleX, scaleY);

                const offsetX = (targetWidth - origWidth * scale) / 2;
                const offsetY = (targetHeight - origHeight * scale) / 2;

                page.setSize(targetWidth, targetHeight);
                page.scaleContent(scale, scale);
                page.translateContent(offsetX / scale, offsetY / scale);
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `resized_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to resize PDF:", err);
            setError("Failed to resize PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title="Resize PDF"
            description="Change the page size of your PDF document."
            icon={Maximize2}
            color="purple"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF to Resize"
                        description="Drag & drop or click to browse"
                        variant="purple"
                    />
                </RetroCard>
            ) : (
                <RetroCard className="max-w-3xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center justify-between mb-8 p-4 bg-[#A78BFA]/10 border-2 border-black">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#A78BFA] border-2 border-black">
                                <Maximize2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-display truncate max-w-[200px] sm:max-w-md">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-display mb-4">
                            Target Page Size
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.entries(PAGE_SIZES).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedSize(key as PageSizeKey)}
                                    className={clsx(
                                        "p-4 text-left border-2 border-black transition-all",
                                        selectedSize === key
                                            ? "bg-[#A78BFA] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                            : "bg-white hover:bg-gray-100"
                                    )}
                                >
                                    <div className="font-display mb-1">{key}</div>
                                    <div className="text-xs text-gray-600 font-sans">{value.label.split(" ")[1]}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orientation */}
                    <div className="mb-8">
                        <label className="block text-sm font-display mb-4">
                            Orientation
                        </label>
                        <div className="flex border-2 border-black">
                            <button
                                onClick={() => setOrientation("portrait")}
                                className={clsx(
                                    "flex-1 py-3 px-4 font-display transition-all",
                                    orientation === "portrait"
                                        ? "bg-[#A78BFA]"
                                        : "bg-white hover:bg-gray-100"
                                )}
                            >
                                Portrait
                            </button>
                            <button
                                onClick={() => setOrientation("landscape")}
                                className={clsx(
                                    "flex-1 py-3 px-4 font-display border-l-2 border-black transition-all",
                                    orientation === "landscape"
                                        ? "bg-[#A78BFA]"
                                        : "bg-white hover:bg-gray-100"
                                )}
                            >
                                Landscape
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6">
                            {error}
                        </div>
                    )}

                    <RetroActionButton
                        label="Resize & Download"
                        isProcessing={isProcessing}
                        processingText="Resizing PDF..."
                        onClick={handleResize}
                        color="purple"
                        icon={<Download className="w-5 h-5" />}
                    />
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
