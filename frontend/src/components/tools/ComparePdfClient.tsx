"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
// import * as pdfjsLib from "pdfjs-dist";
import { Loader2, ChevronLeft, ChevronRight, GitCompare, ArrowLeft } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";

// if (typeof window !== "undefined") {
//    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
// }

export default function ComparePdfClient() {
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const { pdfProxy: pdf1, pageCount: pageCount1, loading: loading1 } = usePDF(file1);
    const { pdfProxy: pdf2, pageCount: pageCount2, loading: loading2 } = usePDF(file2);
    const [currentPage, setCurrentPage] = useState(1);
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);

    const maxPages = Math.max(pageCount1 || 0, pageCount2 || 0);

    const renderTask1Ref = useRef<any>(null);
    const renderTask2Ref = useRef<any>(null);

    useEffect(() => {
        let isActive = true;

        const renderPage = async (
            pdf: PDFDocumentProxy,
            pageNum: number,
            canvas: HTMLCanvasElement | null,
            taskRef: React.MutableRefObject<any>
        ) => {
            if (!pdf || !canvas) return;

            // Cancel any pending render task for this canvas
            if (taskRef.current) {
                try {
                    taskRef.current.cancel();
                } catch { }
            }

            if (pageNum > pdf.numPages) {
                const ctx = canvas.getContext("2d")!;
                canvas.width = 400;
                canvas.height = 550;
                ctx.fillStyle = "#f9fafb";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#6b7280";
                ctx.font = "16px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("No page at this position", canvas.width / 2, canvas.height / 2);
                return;
            }

            try {
                const page = await pdf.getPage(pageNum);

                if (!isActive) return;

                const ctx = canvas.getContext("2d")!;
                const viewport = page.getViewport({ scale: 1 });
                const scale = 400 / viewport.width;
                const scaledViewport = page.getViewport({ scale });

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;

                // Double check cancellation
                if (taskRef.current) {
                    try {
                        taskRef.current.cancel();
                    } catch { }
                }

                const renderContext = {
                    canvasContext: ctx,
                    viewport: scaledViewport,
                    canvas,
                };

                const renderTask = page.render(renderContext);
                taskRef.current = renderTask;

                await renderTask.promise;

                if (isActive) {
                    taskRef.current = null;
                }
            } catch (error: any) {
                if (error.name !== 'RenderingCancelledException') {
                    console.error("Error rendering page:", error);
                }
            }
        };

        if (pdf1 && canvas1Ref.current) {
            renderPage(pdf1, currentPage, canvas1Ref.current, renderTask1Ref);
        }
        if (pdf2 && canvas2Ref.current) {
            renderPage(pdf2, currentPage, canvas2Ref.current, renderTask2Ref);
        }

        const currentRenderTask1Ref = renderTask1Ref;
        const currentRenderTask2Ref = renderTask2Ref;

        return () => {
            isActive = false;
            // Cancel both tasks
            if (currentRenderTask1Ref.current) {
                try { currentRenderTask1Ref.current.cancel(); } catch { }
            }
            if (currentRenderTask2Ref.current) {
                try { currentRenderTask2Ref.current.cancel(); } catch { }
            }
        };

    }, [pdf1, pdf2, currentPage]);

    const handleFile1Selected = (files: File[]) => {
        if (files.length > 0) {
            setFile1(files[0]);
            setCurrentPage(1);
        }
    };

    const handleFile2Selected = (files: File[]) => {
        if (files.length > 0) {
            setFile2(files[0]);
            setCurrentPage(1);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: (files) => {
            if (files.length === 1) {
                if (!file1) setFile1(files[0]);
                else setFile2(files[0]);
            } else if (files.length >= 2) {
                setFile1(files[0]);
                setFile2(files[1]);
            }
            setCurrentPage(1);
        },
        accept: { "application/pdf": [".pdf"] },
    });

    const reset = () => {
        setFile1(null);
        setFile2(null);
        setCurrentPage(1);
    };

    return (
        <ToolPageWrapper
            title="Compare PDF"
            description="Compare two PDF documents side by side."
            icon={GitCompare}
            color="lime"
        >
            {!file1 || !file2 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <RetroCard>
                        <h3 className="text-lg font-display mb-4">
                            First PDF {file1 && <span className="text-[#A3E635]">✓</span>}
                        </h3>
                        {file1 ? (
                            <div className="p-4 bg-[#A3E635]/10 border-2 border-[#A3E635]">
                                <p className="font-display truncate">{file1.name}</p>
                                <button
                                    onClick={() => setFile1(null)}
                                    className="text-sm font-display text-[#A3E635] hover:underline mt-1"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <RetroFileUploader
                                onFilesSelected={handleFile1Selected}
                                multiple={false}
                                accept={{ "application/pdf": [".pdf"] }}
                                title="Select First PDF"
                                description="Drag & drop or click"
                                variant="lime"
                            />
                        )}
                    </RetroCard>

                    <RetroCard>
                        <h3 className="text-lg font-display mb-4">
                            Second PDF {file2 && <span className="text-[#A3E635]">✓</span>}
                        </h3>
                        {file2 ? (
                            <div className="p-4 bg-[#A3E635]/10 border-2 border-[#A3E635]">
                                <p className="font-display truncate">{file2.name}</p>
                                <button
                                    onClick={() => setFile2(null)}
                                    className="text-sm font-display text-[#A3E635] hover:underline mt-1"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <RetroFileUploader
                                onFilesSelected={handleFile2Selected}
                                multiple={false}
                                accept={{ "application/pdf": [".pdf"] }}
                                title="Select Second PDF"
                                description="Drag & drop or click"
                                variant="lime"
                            />
                        )}
                    </RetroCard>
                </div>
            ) : (
                <RetroCard>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-[#A3E635]/10 border-2 border-black">
                        <button
                            onClick={reset}
                            className="flex items-center font-display text-sm hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Choose different files
                        </button>

                        {/* Page Navigation */}
                        <div className="flex items-center gap-2 border-2 border-black">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 bg-white hover:bg-gray-100 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-display px-2 min-w-[100px] text-center">
                                Page {currentPage} of {maxPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(maxPages, p + 1))}
                                disabled={currentPage >= maxPages}
                                className="p-2 bg-white hover:bg-gray-100 disabled:opacity-30"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Comparison View */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-black overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b-2 border-black">
                                <h4 className="font-display truncate">{file1?.name}</h4>
                                <p className="text-xs text-gray-600 font-sans">{pageCount1 || 0} pages</p>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white min-h-[550px]">
                                {loading1 ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <canvas ref={canvas1Ref} className="max-w-full shadow-lg border-2 border-black" />
                                )}
                            </div>
                        </div>

                        <div className="border-2 border-black overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b-2 border-black">
                                <h4 className="font-display truncate">{file2?.name}</h4>
                                <p className="text-xs text-gray-600 font-sans">{pageCount2 || 0} pages</p>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white min-h-[550px]">
                                {loading2 ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <canvas ref={canvas2Ref} className="max-w-full shadow-lg border-2 border-black" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="mt-4 p-4 bg-[#A3E635]/10 border-2 border-[#A3E635] text-sm font-sans">
                        <span className="font-display">Tip:</span> Use the page navigation to compare corresponding pages in both documents.
                    </div>
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
