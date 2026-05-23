"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
// import * as pdfjsLib from "pdfjs-dist";
import { Presentation, Download } from "lucide-react";

// if (typeof window !== "undefined") {
//    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
// }

export default function PdfToPptClient() {
    const [file, setFile] = useState<File | null>(null);
    const { pdfProxy, pageCount, loading } = usePDF(file);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadReady, setDownloadReady] = useState(false);
    const [pageData, setPageData] = useState<{ dataUrl: string; width: number; height: number }[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setDownloadReady(false);
            setPageData([]);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleConvert = async () => {
        if (!pdfProxy) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);

        try {
            const pages: { dataUrl: string; width: number; height: number }[] = [];

            for (let i = 1; i <= pageCount; i++) {
                const page = await pdfProxy.getPage(i);
                const viewport = page.getViewport({ scale: 2 });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context!,
                    viewport
                } as any).promise;

                const dataUrl = canvas.toDataURL("image/png");
                const pdfWidthInches = (viewport.width / 2) / 72;
                const pdfHeightInches = (viewport.height / 2) / 72;
                pages.push({ dataUrl, width: pdfWidthInches, height: pdfHeightInches });

                setProgress(Math.round((i / pageCount) * 100));
            }

            setPageData(pages);
            setDownloadReady(true);
        } catch (err) {
            console.error("Failed to convert PDF:", err);
            setError("Failed to convert PDF to PowerPoint. Please try another file.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (pageData.length === 0) return;

        const PptxGenJS = (await import("pptxgenjs")).default;
        const pptx = new PptxGenJS();

        pptx.author = "PDF Tools";
        pptx.title = file?.name.replace(".pdf", "") || "Converted Presentation";
        pptx.subject = "Converted from PDF";

        const firstPage = pageData[0];
        pptx.defineLayout({ name: "PDF_LAYOUT", width: firstPage.width, height: firstPage.height });
        pptx.layout = "PDF_LAYOUT";

        for (const page of pageData) {
            const slide = pptx.addSlide();
            slide.addImage({
                data: page.dataUrl,
                x: 0,
                y: 0,
                w: firstPage.width,
                h: firstPage.height,
                sizing: { type: "cover", w: firstPage.width, h: firstPage.height }
            });
        }

        const fileName = file?.name.replace(".pdf", ".pptx") || "presentation.pptx";
        await pptx.writeFile({ fileName });
    };

    return (
        <ToolPageWrapper
            title="PDF to PowerPoint"
            description="Convert your PDF documents to PowerPoint presentations."
            icon={Presentation}
            color="blue"
        >
            {!file ? (
                <RetroCard className="max-w-2xl mx-auto">
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF File"
                        description="Drag & drop or click to browse"
                        variant="blue"
                    />
                </RetroCard>
            ) : (
                <RetroCard className="max-w-xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-[#60A5FA]/10 border-2 border-black">
                        <div className="p-3 bg-[#60A5FA] border-2 border-black">
                            <Presentation className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-display truncate">
                                {file.name}
                            </h2>
                            <p className="text-sm text-gray-600 font-sans">
                                {pageCount} pages • {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={() => { setFile(null); setDownloadReady(false); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-sans">
                            {error}
                        </div>
                    )}

                    {isProcessing && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between text-sm font-display mb-2">
                                <span>Converting pages...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-3 border-2 border-black bg-white overflow-hidden">
                                <div
                                    className="h-full bg-[#60A5FA] transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {!downloadReady ? (
                        <RetroActionButton
                            label="Convert to PowerPoint"
                            isProcessing={isProcessing}
                            processingText="Converting..."
                            onClick={handleConvert}
                            disabled={loading}
                            color="blue"
                            icon={<Presentation className="w-5 h-5" />}
                        />
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-[#A3E635]/10 border-2 border-[#A3E635] text-center">
                                <p className="font-display">
                                    ✓ Conversion complete! {pageData.length} slides ready.
                                </p>
                            </div>
                            <RetroActionButton
                                label="Download PowerPoint"
                                onClick={handleDownload}
                                color="blue"
                                icon={<Download className="w-5 h-5" />}
                                isProcessing={false}
                                processingText=""
                            />
                        </div>
                    )}

                    <p className="text-xs text-gray-500 text-center mt-4 font-sans">
                        Each PDF page will become a slide with the page as an image.
                    </p>
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
