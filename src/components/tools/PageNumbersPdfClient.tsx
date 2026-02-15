"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Download, Hash } from "lucide-react";
import clsx from "clsx";

type NumberPosition = 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right';
type NumberFormat = 'simple' | 'page-of' | 'dash';

export default function PageNumbersPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [position, setPosition] = useState<NumberPosition>('bottom-center');
    const [format, setFormat] = useState<NumberFormat>('simple');
    const [startNumber, setStartNumber] = useState(1);
    const [fontSize, setFontSize] = useState(12);
    const [isProcessing, setIsProcessing] = useState(false);
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

    const formatPageNumber = (current: number, total: number): string => {
        switch (format) {
            case 'simple':
                return `${current}`;
            case 'page-of':
                return `Page ${current} of ${total}`;
            case 'dash':
                return `- ${current} -`;
            default:
                return `${current}`;
        }
    };

    const handleAddPageNumbers = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            const totalPages = pages.length;

            pages.forEach((page, index) => {
                const { width, height } = page.getSize();
                const pageNumber = startNumber + index;
                const text = formatPageNumber(pageNumber, totalPages + startNumber - 1);
                const textWidth = font.widthOfTextAtSize(text, fontSize);

                let x = 0, y = 0;
                const margin = 40;

                switch (position) {
                    case 'bottom-center':
                        x = (width - textWidth) / 2;
                        y = margin;
                        break;
                    case 'bottom-left':
                        x = margin;
                        y = margin;
                        break;
                    case 'bottom-right':
                        x = width - textWidth - margin;
                        y = margin;
                        break;
                    case 'top-center':
                        x = (width - textWidth) / 2;
                        y = height - margin;
                        break;
                    case 'top-left':
                        x = margin;
                        y = height - margin;
                        break;
                    case 'top-right':
                        x = width - textWidth - margin;
                        y = height - margin;
                        break;
                }

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0.2, 0.2, 0.2),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `numbered_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to add page numbers:", err);
            setError("Failed to add page numbers to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const positions: { value: NumberPosition; label: string }[] = [
        { value: 'bottom-center', label: 'Bottom Center' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'bottom-right', label: 'Bottom Right' },
        { value: 'top-center', label: 'Top Center' },
        { value: 'top-left', label: 'Top Left' },
        { value: 'top-right', label: 'Top Right' },
    ];

    const formats: { value: NumberFormat; label: string; example: string }[] = [
        { value: 'simple', label: 'Simple', example: '1, 2, 3...' },
        { value: 'page-of', label: 'Page X of Y', example: 'Page 1 of 10' },
        { value: 'dash', label: 'Dashed', example: '- 1 -' },
    ];

    return (
        <ToolPageWrapper
            title="Add Page Numbers"
            description="Add page numbers to all pages of your PDF."
            icon={Hash}
            color="purple"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF File"
                        description="Drag & drop or click to browse"
                        variant="purple"
                    />
                </RetroCard>
            ) : (
                <RetroCard>
                    {/* File Info */}
                    <div className="flex items-center space-x-4 mb-8 p-4 bg-[#A78BFA]/10 border-2 border-black">
                        <div className="p-3 bg-[#A78BFA] border-2 border-black">
                            <Hash className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-display truncate">
                                {file.name}
                            </h2>
                            <p className="text-sm text-gray-600 font-sans">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Position */}
                        <div>
                            <label className="block text-sm font-display mb-2">
                                Position
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {positions.map((pos) => (
                                    <button
                                        key={pos.value}
                                        onClick={() => setPosition(pos.value)}
                                        className={clsx(
                                            "px-2 py-2 text-xs font-display border-2 border-black transition-all",
                                            position === pos.value
                                                ? "bg-[#A78BFA] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                                : "bg-white hover:bg-gray-100"
                                        )}
                                    >
                                        {pos.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Format */}
                        <div>
                            <label className="block text-sm font-display mb-2">
                                Number Format
                            </label>
                            <div className="space-y-2">
                                {formats.map((fmt) => (
                                    <button
                                        key={fmt.value}
                                        onClick={() => setFormat(fmt.value)}
                                        className={clsx(
                                            "w-full px-4 py-2 text-left text-sm border-2 border-black transition-all",
                                            format === fmt.value
                                                ? "bg-[#A78BFA] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                                : "bg-white hover:bg-gray-100"
                                        )}
                                    >
                                        <span className="font-display">{fmt.label}</span>
                                        <span className="text-gray-500 ml-2 font-sans">({fmt.example})</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Number */}
                        <div>
                            <label className="block text-sm font-display mb-2">
                                Start from page number
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={startNumber}
                                onChange={(e) => setStartNumber(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-[#A78BFA] outline-none font-sans"
                            />
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="block text-sm font-display mb-2">
                                Font Size: {fontSize}px
                            </label>
                            <input
                                type="range"
                                min="8"
                                max="24"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 appearance-none cursor-pointer accent-[#A78BFA]"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <RetroActionButton
                            label="Add Page Numbers & Download"
                            isProcessing={isProcessing}
                            processingText="Adding Numbers..."
                            onClick={handleAddPageNumbers}
                            color="purple"
                            icon={<Download className="w-5 h-5" />}
                        />
                    </div>
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
