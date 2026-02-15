"use client";

import React, { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, X, MoveUp, MoveDown, Image, ChevronDown } from "lucide-react";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";

const PAGE_SIZES: Record<string, { label: string; width: number; height: number } | { label: string }> = {
    original: { label: "Original (Image Size)" },
    a4: { label: "A4 (210 × 297 mm)", width: 595.28, height: 841.89 },
    letter: { label: "US Letter (8.5 × 11 in)", width: 612, height: 792 },
    legal: { label: "US Legal (8.5 × 14 in)", width: 612, height: 1008 },
    a3: { label: "A3 (297 × 420 mm)", width: 841.89, height: 1190.55 },
    a5: { label: "A5 (148 × 210 mm)", width: 419.53, height: 595.28 },
    tabloid: { label: "Tabloid (11 × 17 in)", width: 792, height: 1224 },
};

interface ImageFile {
    file: File;
    preview: string;
}

interface JpgToPdfClientProps {
    title?: string;
    description?: string;
    accept?: Record<string, string[]>;
    variant?: "pink" | "orange" | "cyan" | "purple" | "green" | "lime" | "red" | "blue" | "yellow" | "default";
}

export default function JpgToPdfClient({
    title = "JPG to PDF",
    description = "Convert JPG, PNG, or WEBP images to a single PDF document.",
    accept = {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
    },
    variant = "cyan"
}: JpgToPdfClientProps) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<string>("a4");

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        const newImages = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages(prev => [...prev, ...newImages]);
    }, []);

    useGlobalFileDrop({
        onFilesSelected: onDrop,
        accept: accept,
    });

    const removeImage = (index: number) => {
        setError(null);
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === images.length - 1)) return;

        setImages(prev => {
            const newImages = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
            return newImages;
        });
    };

    const convertWebpToPng = async (file: File): Promise<Uint8Array> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (!blob) { reject(new Error('PNG conversion failed')); return; }
                    blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf))).catch(reject);
                }, 'image/png');
            };
            img.onerror = () => reject(new Error('Failed to load WEBP image'));
            img.src = URL.createObjectURL(file);
        });
    };

    const convertToPDF = async () => {
        if (images.length === 0) return;

        setIsProcessing(true);
        setError(null);
        try {
            const pdfDoc = await PDFDocument.create();

            for (const img of images) {
                const arrayBuffer = await img.file.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);

                let pdfImage;
                const fileType = img.file.type;

                if (fileType === 'image/webp' || img.file.name.toLowerCase().endsWith('.webp')) {
                    const pngBytes = await convertWebpToPng(img.file);
                    pdfImage = await pdfDoc.embedPng(pngBytes);
                } else if (fileType === 'image/png') {
                    pdfImage = await pdfDoc.embedPng(uint8Array);
                } else {
                    pdfImage = await pdfDoc.embedJpg(uint8Array);
                }

                const sizeConfig = PAGE_SIZES[pageSize];

                if (pageSize === 'original' || !('width' in sizeConfig)) {
                    // Original: page matches image size
                    const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
                    page.drawImage(pdfImage, {
                        x: 0,
                        y: 0,
                        width: pdfImage.width,
                        height: pdfImage.height,
                    });
                } else {
                    // Fixed page size with margins, centered
                    const pageWidth = sizeConfig.width;
                    const pageHeight = sizeConfig.height;
                    const margin = 40;
                    const maxW = pageWidth - margin * 2;
                    const maxH = pageHeight - margin * 2;

                    const scale = Math.min(maxW / pdfImage.width, maxH / pdfImage.height, 1);
                    const drawW = pdfImage.width * scale;
                    const drawH = pdfImage.height * scale;

                    const page = pdfDoc.addPage([pageWidth, pageHeight]);
                    page.drawImage(pdfImage, {
                        x: (pageWidth - drawW) / 2,
                        y: (pageHeight - drawH) / 2,
                        width: drawW,
                        height: drawH,
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "images_converted.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Conversion failed:", err);
            setError("Failed to convert images to PDF. Make sure images are valid.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title={title}
            description={description}
            icon={Image}
            color={variant}
        >
            <RetroCard>
                <RetroFileUploader
                    onFilesSelected={onDrop}
                    accept={accept}
                    multiple={true}
                    title="Select Images"
                    description="Support JPG, PNG, WEBP"
                    variant={variant}
                />

                {images.length > 0 && (
                    <>
                        {/* Page Size Selector */}
                        <div className="mt-6 mb-4">
                            <label className="block text-sm font-display font-bold mb-2 uppercase tracking-wide">Page Size</label>
                            <div className="relative">
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(e.target.value)}
                                    className="w-full appearance-none bg-white border-2 border-black px-4 py-3 pr-10 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                                >
                                    {Object.entries(PAGE_SIZES).map(([key, val]) => (
                                        <option key={key} value={key}>{val.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 mb-6">
                            {images.map((img, index) => (
                                <div key={img.preview} className="relative group">
                                    <img
                                        src={img.preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover border-2 border-black"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => moveImage(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1.5 bg-white border-2 border-black disabled:opacity-30"
                                        >
                                            <MoveUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => moveImage(index, 'down')}
                                            disabled={index === images.length - 1}
                                            className="p-1.5 bg-white border-2 border-black disabled:opacity-30"
                                        >
                                            <MoveDown className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="p-1.5 bg-[#F87171] border-2 border-black"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-center mt-1 text-sm font-display">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center">
                            <RetroActionButton
                                label="Convert to PDF"
                                isProcessing={isProcessing}
                                processingText="Creating PDF..."
                                onClick={convertToPDF}
                                color={variant}
                                icon={<Download className="w-5 h-5" />}
                            />
                        </div>
                    </>
                )}
            </RetroCard>
        </ToolPageWrapper>
    );
}
