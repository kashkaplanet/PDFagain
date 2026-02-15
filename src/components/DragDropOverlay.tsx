"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Upload, FileText, Image as ImageIcon, FileSpreadsheet } from "lucide-react";
import { useFileContext } from "@/context/FileContext";


export const DragDropOverlay = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);
    const { setFiles } = useFileContext();
    const router = useRouter();
    const pathname = usePathname();

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => prev + 1);
        if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => prev - 1);
        if (dragCounter <= 1) {
            setIsDragging(false);
        }
    }, [dragCounter]);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setDragCounter(0);

        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            setFiles(droppedFiles);

            // Logic to redirect based on first file type
            const firstFile = droppedFiles[0];
            const fileType = firstFile.type;
            const fileName = firstFile.name.toLowerCase();
            const currentPath = window.location.pathname;



            // Heuristic for file types
            let targetRoute = "/";

            if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
                // typeGroup = "pdf";
                targetRoute = droppedFiles.length > 1 ? "/merge-pdf" : "/organize-pdf";

                // If we are already on ANY pdf tool, we might want to stay? 
                // Mostly true, except maybe if dropping multiple PDFs on a single-file tool.
                // But RetroFileUploader logic now handles "stealing" the file if it matches.
                // So if we are on /compress-pdf, and we drop a PDF, we should STAY.
                if (currentPath !== "/" && !currentPath.includes("/home")) {
                    return; // Trust the tool to handle it via RetroFileUploader
                }

            } else if (
                fileType.startsWith("image/") ||
                fileName.endsWith(".jpg") ||
                fileName.endsWith(".jpeg") ||
                fileName.endsWith(".png") ||
                fileName.endsWith(".webp")
            ) {
                // typeGroup = "image";
                targetRoute = "/jpg-to-pdf";
            } else if (
                fileName.endsWith(".doc") ||
                fileName.endsWith(".docx")
            ) {
                // typeGroup = "word";
                targetRoute = "/word-to-pdf";
            } else if (
                fileName.endsWith(".ppt") ||
                fileName.endsWith(".pptx")
            ) {
                // typeGroup = "ppt";
                targetRoute = "/ppt-to-pdf";
            } else if (
                fileName.endsWith(".xls") ||
                fileName.endsWith(".xlsx") ||
                fileName.endsWith(".csv")
            ) {
                // typeGroup = "excel";
                targetRoute = "/excel-to-pdf";
            } else if (fileName.endsWith(".txt")) {
                // typeGroup = "txt";
                targetRoute = "/txt-to-pdf";
            } else if (fileName.endsWith(".rtf")) {
                // typeGroup = "rtf";
                targetRoute = "/rtf-to-pdf";
            } else if (fileName.endsWith(".odt")) {
                // typeGroup = "odt";
                targetRoute = "/odt-to-pdf";
            } else if (fileName.endsWith(".html") || fileName.endsWith(".htm")) {
                // typeGroup = "html";
                targetRoute = "/html-to-pdf";
            }

            // If we found a target route:
            if (targetRoute !== "/") {
                // If we are already on a tool page, assume the tool handles it (via RetroFileUploader)
                // UNLESS the file type is completely different from what the tool expects?
                // E.g. on PDF merger, and I drop a MSG file? 
                // But for now, "Stay on current tool if it's not home" is a safe bet, 
                // because RetroFileUploader will pick it up if it wants it.
                // The only risk is if I drop a PPT on PDF Merger, PDF Merger ignores it, 
                // and nothing happens. The user might be confused.
                // IDEALLY: The tool should handle "invalid" files or we redirect if the tool *ignores* it.
                // But we can't know if the tool ignores it easily here efficiently.

                // Let's stick to: If on Home or generic page, Redirect. 
                // If on a specific tool page, STAY (and hope tool handles or ignores).
                // But if the type is radically different (e.g. Image on PDF tool), maybe redirect?
                // Just keeping it simple: If path is root or home, redirect.

                if (currentPath === "/" || currentPath === "/home") {
                    router.push(targetRoute);
                } else {
                    // We are on some other page.
                    // If the component picks it up, great.
                    // If not, the user sees the drop overlay disappear and nothing happens. 
                    // This is acceptable for now vs forced navigation losing state.
                }
            } else {
                // Unknown file type.
                // If on home, maybe go to valid tool?
                // Or just do nothing and let context handle it?
            }
        }
    }, [router, setFiles]);

    useEffect(() => {
        // Disable on landing page
        if (pathname === "/" || pathname === "/home") return;

        window.addEventListener("dragenter", handleDragEnter);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragenter", handleDragEnter);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("drop", handleDrop);
        };
    }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, pathname]);

    if (!isDragging) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-center">
                    <div className="p-6 bg-[#A3E635] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                        <Upload className="w-16 h-16 text-black" strokeWidth={2.5} />
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl sm:text-5xl font-display uppercase tracking-tight">
                        Drop files to begin
                    </h2>
                    <p className="text-xl font-medium text-gray-600">
                        We&apos;ll automatically detect the file type and suggest tools.
                    </p>
                </div>

                <div className="flex justify-center gap-8 pt-4 opacity-50">
                    <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8" />
                        <span className="font-display text-xs">PDF</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8" />
                        <span className="font-display text-xs">IMAGES</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <FileSpreadsheet className="w-8 h-8" />
                        <span className="font-display text-xs">OFFICE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
