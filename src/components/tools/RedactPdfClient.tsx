"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
import { PDFDocument } from "pdf-lib";
// import * as pdfjsLib from "pdfjs-dist";
import { Download, EyeOff, ChevronLeft, ChevronRight, Square, Loader2 } from "lucide-react";

// if (typeof window !== "undefined") {
//    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
// }

interface RedactArea {
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
}

export default function RedactPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const { pdfProxy, pageCount, loading } = usePDF(file);
    const [currentPage, setCurrentPage] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [redactAreas, setRedactAreas] = useState<RedactArea[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setCurrentPage(1);
            setRedactAreas([]);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const drawRedactAreas = useCallback(() => {
        if (!overlayRef.current) return;
        const ctx = overlayRef.current.getContext("2d")!;
        ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

        redactAreas
            .filter(area => area.page === currentPage)
            .forEach(area => {
                ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
                ctx.fillRect(area.x, area.y, area.width, area.height);
            });
    }, [redactAreas, currentPage]);

    const renderTaskRef = useRef<any>(null);

    useEffect(() => {
        let isActive = true;
        if (!pdfProxy || !canvasRef.current) return;

        const renderPage = async () => {
            // Cancel pending task
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                } catch { }
            }

            try {
                const page = await pdfProxy.getPage(currentPage);

                if (!isActive) return;

                const canvas = canvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext("2d");
                if (!context) return;

                const containerWidth = containerRef.current?.clientWidth || 600;
                const viewport = page.getViewport({ scale: 1 });
                const newScale = (containerWidth - 40) / viewport.width;
                if (isActive) setScale(newScale);

                const scaledViewport = page.getViewport({ scale: newScale });
                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;

                // Double check cancellation
                if (renderTaskRef.current) {
                    try {
                        renderTaskRef.current.cancel();
                    } catch { }
                }

                const renderTask = page.render({
                    canvasContext: context,
                    viewport: scaledViewport,
                } as any);
                renderTaskRef.current = renderTask;

                await renderTask.promise;

                if (isActive) {
                    renderTaskRef.current = null;

                    if (overlayRef.current) {
                        overlayRef.current.width = canvas.width;
                        overlayRef.current.height = canvas.height;
                        drawRedactAreas();
                    }
                }
            } catch (error: any) {
                if (error.name !== 'RenderingCancelledException') {
                    console.error("Error rendering page:", error);
                }
            }
        };

        renderPage();

        return () => {
            isActive = false;
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                } catch { }
            }
        };
    }, [pdfProxy, currentPage, drawRedactAreas]);



    useEffect(() => {
        drawRedactAreas();
    }, [drawRedactAreas]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        setStartPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsDrawing(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const ctx = overlayRef.current.getContext("2d")!;
        ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

        redactAreas
            .filter(area => area.page === currentPage)
            .forEach(area => {
                ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
                ctx.fillRect(area.x, area.y, area.width, area.height);
            });

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(startPos.x, startPos.y, currentX - startPos.x, currentY - startPos.y);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDrawing || !overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const width = Math.abs(endX - startPos.x);
        const height = Math.abs(endY - startPos.y);

        if (width > 10 && height > 10) {
            setRedactAreas(prev => [...prev, {
                x: Math.min(startPos.x, endX),
                y: Math.min(startPos.y, endY),
                width,
                height,
                page: currentPage
            }]);
        }

        setIsDrawing(false);
    };

    const handleApplyRedactions = async () => {
        if (!file || redactAreas.length === 0) return;

        setIsProcessing(true);
        setError(null);
        try {
            const pdfDoc = await PDFDocument.create();

            for (let i = 1; i <= pageCount; i++) {
                const page = await pdfProxy!.getPage(i);
                const viewport = page.getViewport({ scale: 2 });

                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = viewport.width;
                tempCanvas.height = viewport.height;
                const ctx = tempCanvas.getContext("2d")!;

                await page.render({
                    canvasContext: ctx,
                    viewport
                } as any).promise;

                const pageAreas = redactAreas.filter(area => area.page === i);
                ctx.fillStyle = "black";
                pageAreas.forEach(area => {
                    const scaleFactor = 2 / scale;
                    ctx.fillRect(
                        area.x * scaleFactor,
                        area.y * scaleFactor,
                        area.width * scaleFactor,
                        area.height * scaleFactor
                    );
                });

                const imgData = tempCanvas.toDataURL("image/png");
                const imgBytes = await fetch(imgData).then(r => r.arrayBuffer());
                const img = await pdfDoc.embedPng(new Uint8Array(imgBytes));

                const newPage = pdfDoc.addPage([viewport.width / 2, viewport.height / 2]);
                newPage.drawImage(img, {
                    x: 0, y: 0,
                    width: viewport.width / 2,
                    height: viewport.height / 2
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `redacted_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to apply redactions:", err);
            setError("Failed to apply redactions. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title="Redact PDF"
            description="Black out sensitive information in your PDF."
            icon={EyeOff}
            color="purple"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        accept={{ "application/pdf": [".pdf"] }}
                        title="Select PDF to Redact"
                        description="Drag & drop or click to browse"
                        variant="purple"
                    />
                </RetroCard>
            ) : (
                <div ref={containerRef}>
                    <RetroCard>
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4 bg-[#A78BFA]/10 border-2 border-black gap-4">
                            <div className="flex items-center gap-2 border-2 border-black">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 bg-white hover:bg-gray-100 disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm font-display px-2 min-w-[100px] text-center">
                                    Page {currentPage} of {pageCount}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                                    disabled={currentPage >= pageCount}
                                    className="p-2 bg-white hover:bg-gray-100 disabled:opacity-30"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#A78BFA]/10 border-2 border-[#A78BFA]">
                                    <Square className="w-4 h-4 fill-[#A78BFA] text-[#A78BFA]" />
                                    <span className="text-sm font-display">
                                        {redactAreas.length} {redactAreas.length === 1 ? "area" : "areas"}
                                    </span>
                                </div>
                                {redactAreas.length > 0 && (
                                    <button
                                        onClick={() => setRedactAreas([])}
                                        className="text-sm font-display text-[#F87171] hover:underline"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => setFile(null)}
                                className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                            >
                                Change File
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-sans">
                                {error}
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="mb-6 p-4 bg-[#A78BFA]/10 border-2 border-[#A78BFA] flex items-start gap-3">
                            <Square className="w-5 h-5 text-[#A78BFA] mt-0.5" />
                            <div className="text-sm font-sans">
                                <span className="font-display">How to redact:</span> Click and drag on the document to draw black rectangles over sensitive content.
                            </div>
                        </div>

                        {/* Canvas Container */}
                        <div className="relative flex justify-center mb-6 border-2 border-black overflow-hidden bg-gray-100 min-h-[400px]">
                            {loading ? (
                                <div className="flex items-center justify-center w-full h-full py-20">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : (
                                <div className="relative py-8">
                                    <canvas ref={canvasRef} className="shadow-xl" />
                                    <canvas
                                        ref={overlayRef}
                                        className="absolute top-8 left-0 cursor-crosshair"
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={() => setIsDrawing(false)}
                                    />
                                </div>
                            )}
                        </div>

                        <RetroActionButton
                            label="Apply Redactions & Download"
                            isProcessing={isProcessing}
                            processingText="Applying Redactions..."
                            onClick={handleApplyRedactions}
                            disabled={redactAreas.length === 0}
                            color="purple"
                            icon={<Download className="w-5 h-5" />}
                        />
                    </RetroCard>
                </div>
            )}
        </ToolPageWrapper>
    );
}
