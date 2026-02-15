"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

import { usePDF } from "@/hooks/usePDF";
// import * as pdfjsLib from "pdfjs-dist";
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Eye, Plus, X, FileText } from "lucide-react";

// if (typeof window !== "undefined") {
//    pdfjsLib.GlobalWorkerOptions.workerSrc = `/workers/pdf.worker.min.mjs`;
// }

export default function ViewPdfClient() {
    const [files, setFiles] = useState<File[]>([]);
    const [activeFileIndex, setActiveFileIndex] = useState<number>(0);


    const activeFile = files[activeFileIndex] || null;
    const { pdfProxy, pageCount, loading } = usePDF(activeFile);

    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.5);


    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const renderTaskRef = useRef<any>(null);

    const handleFilesSelected = async (newFiles: File[]) => {
        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles]);
            if (files.length === 0) {
                setActiveFileIndex(0);
                setCurrentPage(1);
                setScale(1.5);
            }
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFilesSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const removeFile = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        if (index === activeFileIndex) {
            setActiveFileIndex(0);
        } else if (index < activeFileIndex) {
            setActiveFileIndex(activeFileIndex - 1);
        }
    };

    useEffect(() => {
        let isActive = true;

        if (!pdfProxy || !canvasRef.current) return;

        const renderPage = async () => {
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                } catch { }
                // We don't set null here immediately if we want to be super safe, 
                // but usually cancel() is synchronous in signaling, 
                // though the promise rejection is async. 
                // Anyhow, the important part is guarding the *start* of the new render.
            }

            try {
                const page = await pdfProxy.getPage(currentPage);

                if (!isActive) return;

                const canvas = canvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext("2d");
                if (!context) return;

                const viewport = page.getViewport({ scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderContext = {
                    canvasContext: context,
                    viewport,
                };

                // Double check cancellation of any task that might have sneaked in
                // (though logical single-thread JS means mostly sequential)
                if (renderTaskRef.current) {
                    try {
                        renderTaskRef.current.cancel();
                    } catch { }
                }

                const renderTask = page.render(renderContext);
                renderTaskRef.current = renderTask;

                await renderTask.promise;
                if (isActive) {
                    renderTaskRef.current = null;
                }
            } catch (error: unknown) {
                // Check if error is a RenderingCancelledException
                const isCancelled = error instanceof Object && (error as any).name === 'RenderingCancelledException';
                if (!isCancelled) {
                    console.error("Render error:", error);
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
    }, [pdfProxy, currentPage, scale]);



    return (
        <ToolPageWrapper
            title="PDF Viewer"
            description="View and preview PDF documents directly in your browser."
            icon={Eye}
            color="lime"
        >
            {/* File Tabs */}
            {files.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    {files.map((file, idx) => (
                        <div
                            key={idx}
                            onClick={() => { setActiveFileIndex(idx); setCurrentPage(1); }}
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-2 border-black transition-all ${idx === activeFileIndex
                                ? "bg-[#A3E635] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-display truncate max-w-[150px]">{file.name}</span>
                            <button
                                onClick={(e) => removeFile(idx, e)}
                                className="p-0.5 hover:bg-black/10 rounded"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Add File Button */}
                    <label className="flex items-center gap-1 px-3 py-2 cursor-pointer bg-[#A3E635] border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-display">Add PDF</span>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                                if (e.target.files?.length) {
                                    handleFilesSelected(Array.from(e.target.files));
                                }
                            }}
                            className="hidden"
                            multiple
                        />
                    </label>
                </div>
            )}

            {!activeFile ? (
                <RetroCard className="max-w-2xl mx-auto text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#A3E635] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <Eye className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-display mb-3">Upload PDF to View</h2>
                    <p className="text-gray-600 font-sans mb-8 max-w-md mx-auto">
                        Securely view and preview PDF documents directly in your browser.
                    </p>
                    <div className="max-w-md mx-auto">
                        <RetroFileUploader
                            onFilesSelected={handleFilesSelected}
                            multiple={true}
                            accept={{ "application/pdf": [".pdf"] }}
                            title="Select PDF Files"
                            description="Drag & drop or click to browse"
                            variant="lime"
                        />
                    </div>
                </RetroCard>
            ) : (
                <>
                    {/* Toolbar */}
                    <div className="sticky top-4 z-10 mx-auto max-w-3xl mb-6">
                        <div className="bg-[#FFFBEB] border-2 border-black p-2 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] gap-4">
                            {/* Page Navigation */}
                            <div className="flex items-center gap-1 border-2 border-black bg-white">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center px-1">
                                    <input
                                        type="number"
                                        min={1}
                                        max={pageCount}
                                        value={currentPage}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (val >= 1 && val <= pageCount) {
                                                setCurrentPage(val);
                                            }
                                        }}
                                        className="w-12 py-1 text-center bg-transparent font-display focus:outline-none appearance-none"
                                    />
                                    <span className="text-gray-500 text-sm">/ {pageCount}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                                    disabled={currentPage >= pageCount}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-30"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 border-2 border-black bg-white">
                                <button
                                    onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                                    disabled={scale <= 0.5}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-30"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-display w-12 text-center select-none">
                                    {Math.round(scale * 100)}%
                                </span>
                                <button
                                    onClick={() => setScale(s => Math.min(3, s + 0.25))}
                                    disabled={scale >= 3}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-30"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                            </div>


                        </div>
                    </div>

                    {/* Canvas Container */}
                    <div
                        ref={containerRef}
                        className="relative flex justify-center overflow-auto min-h-[600px] pb-20"
                        style={{ maxHeight: 'calc(100vh - 140px)' }}
                    >
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center w-full h-full py-20">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        )}
                        <canvas
                            ref={canvasRef}
                            className={`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-white ${loading ? 'invisible' : ''}`}
                        />
                    </div>
                </>
            )}

        </ToolPageWrapper>
    );
}
