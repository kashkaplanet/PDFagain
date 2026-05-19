import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import type { PDFDocumentProxy } from "pdfjs-dist";
import clsx from 'clsx';

interface PageThumbnailsProps {
    pdfProxy: PDFDocumentProxy | null;
    pageCount: number;
    currentPage: number;
    onPageSelect: (pageIndex: number) => void;
    collapsed: boolean;
    onToggle: () => void;
}

export function PageThumbnails({ pdfProxy, pageCount, currentPage, onPageSelect, collapsed, onToggle }: PageThumbnailsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    // Local state removed, controlled by parent

    return (
        <div className={clsx(
            "flex-shrink-0 bg-[#FFFBE6] border-r-2 border-black flex flex-col h-full overflow-hidden transition-all duration-300",
            collapsed ? "w-12" : "w-44"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b-2 border-black bg-[#A855F7]">
                {!collapsed && (
                    <div className="flex items-center gap-2 text-white">
                        <Layers className="w-4 h-4" />
                        <span className="text-xs font-display uppercase tracking-wide">Pages</span>
                    </div>
                )}
                <button
                    onClick={onToggle}
                    className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Collapsed View - Just page indicators */}
            {collapsed ? (
                <div className="flex-1 overflow-y-auto py-2">
                    {Array.from({ length: pageCount }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => onPageSelect(index)}
                            className={clsx(
                                "w-full py-2 text-xs font-display transition-colors",
                                currentPage === index
                                    ? "bg-[#A855F7] text-white"
                                    : "hover:bg-gray-200"
                            )}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            ) : (
                /* Expanded View - Thumbnails */
                <div className="flex-1 overflow-y-auto p-2 space-y-2" ref={containerRef}>
                    {Array.from({ length: pageCount }).map((_, index) => (
                        <ThumbnailItem
                            key={index}
                            pageIndex={index}
                            pdfProxy={pdfProxy}
                            isActive={currentPage === index}
                            onClick={() => onPageSelect(index)}
                        />
                    ))}
                </div>
            )}

            {/* Footer - Page count */}
            {!collapsed && (
                <div className="p-2 border-t-2 border-black bg-white text-center">
                    <span className="text-xs font-mono text-gray-600">
                        {currentPage + 1} / {pageCount}
                    </span>
                </div>
            )}
        </div>
    );
}

function ThumbnailItem({ pageIndex, pdfProxy, isActive, onClick }: {
    pageIndex: number;
    pdfProxy: PDFDocumentProxy | null;
    isActive: boolean;
    onClick: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!pdfProxy || !canvasRef.current || loaded) return;

        let isCancelled = false;

        const renderPage = async () => {
            try {
                const page = await pdfProxy.getPage(pageIndex + 1);
                if (isCancelled) return;

                const viewport = page.getViewport({ scale: 0.2 });
                const canvas = canvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext('2d');
                if (!context) return;

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                } as any).promise;

                if (!isCancelled) setLoaded(true);
            } catch (err) {
                console.error("Error rendering thumbnail", err);
            }
        };

        renderPage();
        return () => { isCancelled = true; };
    }, [pdfProxy, pageIndex, loaded]);

    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full flex items-center gap-2 p-1.5 border-2 border-black transition-all duration-150 text-left",
                isActive
                    ? "bg-[#A855F7] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white hover:bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
            )}
        >
            {/* Thumbnail */}
            <div className="w-10 h-14 bg-white border border-black overflow-hidden flex-shrink-0 relative">
                <canvas ref={canvasRef} className="w-full h-full object-contain" />
                {!loaded && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-black border-t-[#A855F7] animate-spin" />
                    </div>
                )}
            </div>

            {/* Page Number */}
            <span className={clsx(
                "text-xs font-display",
                isActive ? "text-white" : "text-black"
            )}>
                Page {pageIndex + 1}
            </span>
        </button>
    );
}
