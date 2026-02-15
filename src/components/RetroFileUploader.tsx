"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import clsx from "clsx";

import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";

import { RETRO_COLORS, RetroVariant } from '@/config/design';

interface RetroFileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    accept?: Record<string, string[]>;
    multiple?: boolean;
    className?: string;
    title?: string;
    description?: string;
    variant?: RetroVariant;
}


export function RetroFileUploader({
    onFilesSelected,
    accept = { "application/pdf": [".pdf"] },
    multiple = true,
    className,
    title = "Select PDF files",
    description = "or drop files here",
    variant = 'pink',
    compact = false,
}: RetroFileUploaderProps & { compact?: boolean }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFilesSelected(acceptedFiles);
            }
        },
        accept,
        multiple,
    });

    useGlobalFileDrop({
        onFilesSelected,
        accept,
    });





    const colors = RETRO_COLORS[variant];

    if (compact) {
        return (
            <div
                {...getRootProps()}
                className={clsx(
                    "group relative flex items-center justify-center w-full h-full border-2 border-dashed border-black cursor-pointer transition-all duration-200 bg-white p-4",
                    isDragActive
                        ? `${colors.lightBg} border-solid shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                        : "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]",
                    className
                )}
            >
                <input {...getInputProps()} />
                <div className="flex items-center gap-4">
                    <div className={clsx(
                        "p-2 border-2 border-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                        isDragActive
                            ? colors.activeBg
                            : `${colors.bg} group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-0.5`
                    )}>
                        {isDragActive ? (
                            <Upload className="w-5 h-5 animate-bounce" />
                        ) : (
                            <FileText className="w-5 h-5" />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="font-display text-black text-sm">
                            {isDragActive ? "Drop files" : title}
                        </p>
                        <p className="text-xs text-gray-600 font-sans">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={clsx(
                "group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-black cursor-pointer transition-all duration-200 bg-white",
                isDragActive
                    ? `${colors.lightBg} border-solid shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                    : "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]",
                className
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-4 text-center p-6">
                <div className={clsx(
                    "p-4 border-2 border-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                    isDragActive
                        ? colors.activeBg
                        : `${colors.bg} group-hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1`
                )}>
                    {isDragActive ? (
                        <Upload className="w-8 h-8 animate-bounce" />
                    ) : (
                        <FileText className="w-8 h-8" />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-xl font-display text-black">
                        {isDragActive ? "Drop files here" : title}
                    </p>
                    <p className="text-sm text-gray-600 font-sans">
                        {description}
                    </p>
                </div>
                {!isDragActive && (
                    <div className={`mt-2 px-4 py-2 border-2 border-black font-display text-sm ${colors.bg} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all`}>
                        Click to Browse
                    </div>
                )}
            </div>
        </div>
    );
}
