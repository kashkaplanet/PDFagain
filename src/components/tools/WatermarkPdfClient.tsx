"use client";


import React, { useState, useEffect, useRef } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Download, Droplets, Eye } from "lucide-react";
import clsx from "clsx";
import { usePDF } from "@/hooks/usePDF";

type WatermarkPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'diagonal';

export default function WatermarkPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
    const [position, setPosition] = useState<WatermarkPosition>('diagonal');
    const [opacity, setOpacity] = useState(0.3);
    const [fontSize, setFontSize] = useState(48);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Preview hooks
    const { pdfProxy } = usePDF(file);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Preview Effect
    useEffect(() => {
        if (!pdfProxy || !canvasRef.current || !file) return;

        let isCancelled = false;

        const renderPreview = async () => {
            try {
                const page = await pdfProxy.getPage(1);
                if (isCancelled) return;

                const viewport = page.getViewport({ scale: 1 });
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Render PDF Page
                await page.render({
                    canvasContext: ctx,
                    viewport
                }).promise;

                if (isCancelled) return;

                // Draw Watermark
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.font = `bold ${fontSize}px Helvetica, sans-serif`;
                ctx.fillStyle = "gray"; // Approximate rgb(0.5, 0.5, 0.5)

                const { width, height } = viewport;

                if (position === 'diagonal') {
                    ctx.translate(width / 2, height / 2);
                    ctx.rotate(-45 * Math.PI / 180);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(watermarkText, 0, 0);
                } else if (position === 'center') {
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(watermarkText, width / 2, height / 2);
                } else {
                    // Corner positions
                    const margin = 50;
                    ctx.textAlign = position.includes('right') ? 'right' : 'left';
                    ctx.textBaseline = position.includes('bottom') ? 'bottom' : 'top';

                    const x = position.includes('left') ? margin : width - margin;
                    const y = position.includes('top') ? margin : height - margin;

                    ctx.fillText(watermarkText, x, y);
                }

                ctx.restore();

            } catch (err) {
                console.error("Preview render error:", err);
            }
        };

        renderPreview();

        return () => {
            isCancelled = true;
        };
    }, [pdfProxy, file, watermarkText, position, opacity, fontSize]);


    const handleAddWatermark = async () => {
        if (!file || !watermarkText.trim()) return;

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const pages = pdfDoc.getPages();

            for (const page of pages) {
                const { width, height } = page.getSize();
                const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
                const textHeight = fontSize;

                let x = 0, y = 0, rotate = 0;

                switch (position) {
                    case 'center':
                        x = (width - textWidth) / 2;
                        y = (height - textHeight) / 2;
                        break;
                    case 'top-left':
                        x = 50;
                        y = height - 50 - textHeight;
                        break;
                    case 'top-right':
                        x = width - textWidth - 50;
                        y = height - 50 - textHeight;
                        break;
                    case 'bottom-left':
                        x = 50;
                        y = 50;
                        break;
                    case 'bottom-right':
                        x = width - textWidth - 50;
                        y = 50;
                        break;
                    case 'diagonal':
                        x = width / 2;
                        y = height / 2;
                        rotate = -45;
                        break;
                }

                if (position === 'diagonal') {
                    page.drawText(watermarkText, {
                        x: x - textWidth / 2,
                        y: y,
                        size: fontSize,
                        font,
                        color: rgb(0.5, 0.5, 0.5),
                        opacity,
                        rotate: { type: 'degrees', angle: rotate } as any,
                    });
                } else {
                    page.drawText(watermarkText, {
                        x,
                        y,
                        size: fontSize,
                        font,
                        color: rgb(0.5, 0.5, 0.5),
                        opacity,
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `watermarked_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to add watermark:", err);
            setError("Failed to add watermark to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const positions: { value: WatermarkPosition; label: string }[] = [
        { value: 'diagonal', label: 'Diagonal' },
        { value: 'center', label: 'Center' },
        { value: 'top-left', label: 'Top Left' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'bottom-right', label: 'Bottom Right' },
    ];

    return (
        <ToolPageWrapper
            title="Add Watermark"
            description="Add text watermarks to all pages of your PDF."
            icon={Droplets}
            color="purple"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF to Watermark"
                        description="Drag & drop or click to browse"
                        variant="purple"
                    />
                </RetroCard>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls Column (2/3) */}
                    <div className="lg:col-span-2">
                        <RetroCard>
                            {/* File Info */}
                            <div className="flex items-center space-x-4 mb-8 p-4 bg-[#A78BFA]/10 border-2 border-black">
                                <div className="p-3 bg-[#A78BFA] border-2 border-black">
                                    <Droplets className="w-6 h-6" />
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
                                {/* Watermark Text */}
                                <div>
                                    <label className="block text-sm font-display mb-2">
                                        Watermark Text
                                    </label>
                                    <input
                                        type="text"
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                        placeholder="Enter watermark text"
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
                                        min="12"
                                        max="120"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 appearance-none cursor-pointer accent-[#A78BFA]"
                                    />
                                </div>

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
                                                    "px-3 py-2 text-xs font-display border-2 border-black transition-all",
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

                                {/* Opacity */}
                                <div>
                                    <label className="block text-sm font-display mb-2">
                                        Opacity: {Math.round(opacity * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.1"
                                        value={opacity}
                                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
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
                                    label="Add Watermark & Download"
                                    isProcessing={isProcessing}
                                    processingText="Adding Watermark..."
                                    onClick={handleAddWatermark}
                                    disabled={!watermarkText.trim()}
                                    color="purple"
                                    icon={<Download className="w-5 h-5" />}
                                />
                            </div>
                        </RetroCard>
                    </div>

                    {/* Preview Column (1/3) */}
                    <div className="lg:col-span-1">
                        <RetroCard className="sticky top-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Eye className="w-5 h-5 text-[#A78BFA]" />
                                <h3 className="font-display">Live Preview</h3>
                            </div>
                            <div className="w-full bg-gray-100 border-2 border-black min-h-[300px] flex items-center justify-center overflow-hidden relative">
                                {!pdfProxy ? (
                                    <div className="text-gray-400 font-sans text-sm p-4 text-center">
                                        Loading preview...
                                    </div>
                                ) : (
                                    <canvas
                                        ref={canvasRef}
                                        className="max-w-full h-auto shadow-sm object-contain"
                                    />
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-sans text-center">
                                Preview showing 1st page only
                            </p>
                        </RetroCard>
                    </div>
                </div>
            )
            }
        </ToolPageWrapper >
    );
}
