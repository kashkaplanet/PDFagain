"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
import { PDFDocument } from "pdf-lib";
// import * as pdfjsLib from "pdfjs-dist";
import { Download, PenTool, Eraser, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// if (typeof window !== "undefined") {
//    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
// }

interface SignatureData {
    pageIndex: number;
    dataUrl: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function SignPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const { pdfProxy, pageCount, loading } = usePDF(file);
    const [currentPage, setCurrentPage] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [signaturePosition, setSignaturePosition] = useState<SignatureData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
    const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setCurrentPage(0);
            setSignature(null);
            setSignaturePosition(null);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const renderTaskRef = useRef<any>(null);

    useEffect(() => {
        let isActive = true;
        if (!pdfProxy || !pdfCanvasRef.current) return;

        const renderPage = async () => {
            // Cancel pending task
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                } catch { }
            }

            try {
                const page = await pdfProxy.getPage(currentPage + 1);

                if (!isActive) return;

                const canvas = pdfCanvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext("2d");
                if (!context) return;

                const containerWidth = containerRef.current?.clientWidth || 600;
                const viewport = page.getViewport({ scale: 1 });
                const scale = Math.min(containerWidth / viewport.width, 1.5);
                const scaledViewport = page.getViewport({ scale });

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
    }, [pdfProxy, currentPage]);

    useEffect(() => {
        const canvas = signatureCanvasRef.current;
        if (!canvas) return;

        canvas.width = 400;
        canvas.height = 150;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [file]);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = signatureCanvasRef.current;
        if (!canvas) return;

        setIsDrawing(true);
        const ctx = canvas.getContext("2d")!;
        const { x, y } = getCoordinates(e.nativeEvent, canvas);

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = signatureCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        const { x, y } = getCoordinates(e.nativeEvent, canvas);

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = signatureCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setSignature(null);
        setSignaturePosition(null);
    };

    const saveSignature = () => {
        const canvas = signatureCanvasRef.current;
        if (!canvas) return;

        setSignature(canvas.toDataURL("image/png"));
    };

    const handlePdfClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!signature) return;

        const canvas = pdfCanvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setSignaturePosition({
            pageIndex: currentPage,
            dataUrl: signature,
            x,
            y,
            width: 20,
            height: 8,
        });
    };

    const handleSave = async () => {
        if (!file || !signaturePosition) return;

        setIsProcessing(true);
        setError(null);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const signatureBytes = await fetch(signaturePosition.dataUrl).then(res => res.arrayBuffer());
            const signatureImage = await pdfDoc.embedPng(new Uint8Array(signatureBytes));

            const page = pdfDoc.getPages()[signaturePosition.pageIndex];
            const { width, height } = page.getSize();

            const sigWidth = (signaturePosition.width / 100) * width;
            const sigHeight = (signaturePosition.height / 100) * height;
            const sigX = (signaturePosition.x / 100) * width - sigWidth / 2;
            const sigY = height - (signaturePosition.y / 100) * height - sigHeight / 2;

            page.drawImage(signatureImage, {
                x: sigX,
                y: sigY,
                width: sigWidth,
                height: sigHeight,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `signed_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to sign PDF:", err);
            setError("Failed to add signature to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title="Sign PDF"
            description="Draw your signature and place it on your PDF."
            icon={PenTool}
            color="green"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF to Sign"
                        description="Drag & drop or click to browse"
                        variant="green"
                    />
                </RetroCard>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* PDF Preview */}
                    <RetroCard className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className="p-2 border-2 border-black bg-white hover:bg-gray-100 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-display">
                                Page {currentPage + 1} of {pageCount}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))}
                                disabled={currentPage >= pageCount - 1}
                                className="p-2 border-2 border-black bg-white hover:bg-gray-100 disabled:opacity-30"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div
                            ref={containerRef}
                            className="relative border-2 border-black overflow-hidden bg-gray-100"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center h-[500px]">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <canvas
                                        ref={pdfCanvasRef}
                                        onClick={handlePdfClick}
                                        className={signature ? "cursor-crosshair w-full" : "w-full"}
                                    />
                                    {signaturePosition && signaturePosition.pageIndex === currentPage && (
                                        <img
                                            src={signaturePosition.dataUrl}
                                            alt="Signature"
                                            style={{
                                                position: 'absolute',
                                                left: `${signaturePosition.x}%`,
                                                top: `${signaturePosition.y}%`,
                                                transform: 'translate(-50%, -50%)',
                                                width: `${signaturePosition.width}%`,
                                                pointerEvents: 'none',
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        {signature && (
                            <p className="text-xs text-gray-600 font-sans mt-2 text-center">
                                Click on the PDF to place your signature
                            </p>
                        )}
                    </RetroCard>

                    {/* Signature Panel */}
                    <RetroCard className="h-fit">
                        <h3 className="font-display mb-4 flex items-center">
                            <PenTool className="w-5 h-5 mr-2" />
                            Draw Signature
                        </h3>

                        <div className="border-2 border-dashed border-black p-2 mb-4">
                            <canvas
                                ref={signatureCanvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="cursor-crosshair w-full bg-white"
                                style={{ touchAction: 'none' }}
                            />
                        </div>

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={clearSignature}
                                className="flex-1 flex items-center justify-center px-3 py-2 border-2 border-black bg-white hover:bg-gray-100 font-display text-sm"
                            >
                                <Eraser className="w-4 h-4 mr-1" />
                                Clear
                            </button>
                            <button
                                onClick={saveSignature}
                                className="flex-1 flex items-center justify-center px-3 py-2 border-2 border-black bg-[#34D399] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display text-sm"
                            >
                                <PenTool className="w-4 h-4 mr-1" />
                                Use Signature
                            </button>
                        </div>

                        {signature && (
                            <div className="mb-4 p-3 bg-[#34D399]/10 border-2 border-[#34D399] text-sm text-center font-sans">
                                ✓ Signature ready! Click on PDF to place it.
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6">
                                {error}
                            </div>
                        )}

                        <RetroActionButton
                            label="Save Signed PDF"
                            isProcessing={isProcessing}
                            processingText="Saving..."
                            onClick={handleSave}
                            disabled={!signaturePosition}
                            color="green"
                            icon={<Download className="w-5 h-5" />}
                        />

                        <button
                            onClick={() => setFile(null)}
                            className="w-full mt-3 h-10 text-sm border-2 border-black bg-white hover:bg-[#F87171] font-display transition-colors"
                        >
                            Change File
                        </button>
                    </RetroCard>
                </div>
            )}
        </ToolPageWrapper>
    );
}
