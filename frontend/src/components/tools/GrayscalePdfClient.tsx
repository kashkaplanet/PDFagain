"use client";

import React, { useState, useRef } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
import { PDFDocument } from "pdf-lib";
// import * as pdfjsLib from "pdfjs-dist";
import { Download, Palette } from "lucide-react";

// if (typeof window !== "undefined") {
//    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
// }

export default function GrayscalePdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const { pdfProxy, pageCount, loading } = usePDF(file);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setProgress(0);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleConvert = async () => {
        if (!pdfProxy || !file) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);

        try {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext("2d")!;

            const newPdfDoc = await PDFDocument.create();

            for (let i = 1; i <= pageCount; i++) {
                setProgress(Math.round((i / pageCount) * 100));

                const page = await pdfProxy.getPage(i);
                const viewport = page.getViewport({ scale: 2 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport,
                } as any).promise;

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let j = 0; j < data.length; j += 4) {
                    const avg = (data[j] + data[j + 1] + data[j + 2]) / 3;
                    data[j] = avg;
                    data[j + 1] = avg;
                    data[j + 2] = avg;
                }

                context.putImageData(imageData, 0, 0);

                const imageDataUrl = canvas.toDataURL("image/png");
                const imageBytes = await fetch(imageDataUrl).then(res => res.arrayBuffer());
                const image = await newPdfDoc.embedPng(new Uint8Array(imageBytes));

                const newPage = newPdfDoc.addPage([viewport.width / 2, viewport.height / 2]);
                newPage.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: viewport.width / 2,
                    height: viewport.height / 2,
                });
            }

            const pdfBytes = await newPdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `grayscale_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to convert to grayscale:", err);
            setError("Failed to convert PDF to grayscale.");
        } finally {
            setIsProcessing(false);
            setProgress(100);
        }
    };

    return (
        <ToolPageWrapper
            title="Grayscale PDF"
            description="Convert your color PDF to black and white."
            icon={Palette}
            color="purple"
        >
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF to Convert"
                        description="Drag & drop or click to browse"
                        variant="purple"
                    />
                </RetroCard>
            ) : (
                <RetroCard className="max-w-xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-[#A78BFA]/10 border-2 border-black">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#A78BFA] border-2 border-black">
                                <Palette className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-display truncate max-w-[200px]">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    {loading ? "Loading..." : `${pageCount} pages`}
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

                    {/* Info */}
                    <div className="mb-6 p-4 bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-sm font-sans">
                        <strong>Why convert to grayscale?</strong>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                            <li>Reduce file size</li>
                            <li>Save on printing costs</li>
                            <li>Better readability for some documents</li>
                        </ul>
                    </div>

                    {isProcessing && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-display">Converting...</span>
                                <span className="text-sm text-gray-600 font-sans">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-4 border-2 border-black">
                                <div
                                    className="bg-[#A78BFA] h-full transition-all duration-300"
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
                        label="Convert & Download"
                        isProcessing={isProcessing}
                        processingText="Converting to Grayscale..."
                        onClick={handleConvert}
                        disabled={loading}
                        color="purple"
                        icon={<Download className="w-5 h-5" />}
                    />
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
