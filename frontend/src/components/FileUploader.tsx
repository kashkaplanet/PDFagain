"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import clsx from "clsx";

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    accept?: Record<string, string[]>;
    multiple?: boolean;
    className?: string;
    title?: string;
    description?: string;
    variant?: 'blue' | 'red' | 'orange' | 'green' | 'indigo' | 'violet' | 'rose' | 'emerald' | 'cyan' | 'teal';
}

export function FileUploader({
    onFilesSelected,
    accept = { "application/pdf": [".pdf"] },
    multiple = true,
    className,
    title = "Select PDF files",
    description = "or drop files here",
    variant = 'blue',
}: FileUploaderProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFilesSelected(acceptedFiles);
            }
        },
        [onFilesSelected]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
    });

    const variants = {
        blue: {
            activeBorder: "border-blue-500",
            activeBg: "bg-blue-500/10",
            baseBorder: "border-blue-500/20",
            baseBg: "bg-blue-500/5",
            hoverBorder: "hover:border-blue-500/50",
            iconBgActive: "bg-blue-500",
            hoverFrom: "group-hover:from-blue-600",
            hoverTo: "group-hover:to-blue-500",
            hoverShadow: "group-hover:shadow-blue-500/25",
            ambientFrom: "from-blue-500/5",
            ambientTo: "to-purple-500/5"
        },
        red: {
            activeBorder: "border-red-500",
            activeBg: "bg-red-500/10",
            baseBorder: "border-red-500/20",
            baseBg: "bg-red-500/5",
            hoverBorder: "hover:border-red-500/50",
            iconBgActive: "bg-red-500",
            hoverFrom: "group-hover:from-red-600",
            hoverTo: "group-hover:to-red-500",
            hoverShadow: "group-hover:shadow-red-500/25",
            ambientFrom: "from-red-500/5",
            ambientTo: "to-orange-500/5"
        },
        orange: {
            activeBorder: "border-orange-500",
            activeBg: "bg-orange-500/10",
            baseBorder: "border-orange-500/20",
            baseBg: "bg-orange-500/5",
            hoverBorder: "hover:border-orange-500/50",
            iconBgActive: "bg-orange-500",
            hoverFrom: "group-hover:from-orange-600",
            hoverTo: "group-hover:to-orange-500",
            hoverShadow: "group-hover:shadow-orange-500/25",
            ambientFrom: "from-orange-500/5",
            ambientTo: "to-red-500/5"
        },
        green: {
            activeBorder: "border-green-500",
            activeBg: "bg-green-500/10",
            baseBorder: "border-green-500/20",
            baseBg: "bg-green-500/5",
            hoverBorder: "hover:border-green-500/50",
            iconBgActive: "bg-green-500",
            hoverFrom: "group-hover:from-green-600",
            hoverTo: "group-hover:to-green-500",
            hoverShadow: "group-hover:shadow-green-500/25",
            ambientFrom: "from-green-500/5",
            ambientTo: "to-emerald-500/5"
        },
        indigo: {
            activeBorder: "border-indigo-500",
            activeBg: "bg-indigo-500/10",
            baseBorder: "border-indigo-500/20",
            baseBg: "bg-indigo-500/5",
            hoverBorder: "hover:border-indigo-500/50",
            iconBgActive: "bg-indigo-500",
            hoverFrom: "group-hover:from-indigo-600",
            hoverTo: "group-hover:to-indigo-500",
            hoverShadow: "group-hover:shadow-indigo-500/25",
            ambientFrom: "from-indigo-500/5",
            ambientTo: "to-purple-500/5"
        },
        violet: {
            activeBorder: "border-violet-500",
            activeBg: "bg-violet-500/10",
            baseBorder: "border-violet-500/20",
            baseBg: "bg-violet-500/5",
            hoverBorder: "hover:border-violet-500/50",
            iconBgActive: "bg-violet-500",
            hoverFrom: "group-hover:from-violet-600",
            hoverTo: "group-hover:to-violet-500",
            hoverShadow: "group-hover:shadow-violet-500/25",
            ambientFrom: "from-violet-500/5",
            ambientTo: "to-fuchsia-500/5"
        },
        rose: {
            activeBorder: "border-[#E11D48]",
            activeBg: "bg-[#E11D48]/10",
            baseBorder: "border-[#E11D48]/20",
            baseBg: "bg-[#E11D48]/5",
            hoverBorder: "hover:border-[#E11D48]/50",
            iconBgActive: "bg-[#E11D48]",
            hoverFrom: "group-hover:from-[#E11D48]",
            hoverTo: "group-hover:to-[#be123c]", // darker rose
            hoverShadow: "group-hover:shadow-[#E11D48]/25",
            ambientFrom: "from-[#E11D48]/5",
            ambientTo: "to-[#be123c]/5"
        },
        emerald: {
            activeBorder: "border-[#10B981]",
            activeBg: "bg-[#10B981]/10",
            baseBorder: "border-[#10B981]/20",
            baseBg: "bg-[#10B981]/5",
            hoverBorder: "hover:border-[#10B981]/50",
            iconBgActive: "bg-[#10B981]",
            hoverFrom: "group-hover:from-[#10B981]",
            hoverTo: "group-hover:to-[#059669]", // darker emerald
            hoverShadow: "group-hover:shadow-[#10B981]/25",
            ambientFrom: "from-[#10B981]/5",
            ambientTo: "to-[#059669]/5"
        },
        cyan: {
            activeBorder: "border-[#06B6D4]",
            activeBg: "bg-[#06B6D4]/10",
            baseBorder: "border-[#06B6D4]/20",
            baseBg: "bg-[#06B6D4]/5",
            hoverBorder: "hover:border-[#06B6D4]/50",
            iconBgActive: "bg-[#06B6D4]",
            hoverFrom: "group-hover:from-[#06B6D4]",
            hoverTo: "group-hover:to-[#0891b2]", // darker cyan
            hoverShadow: "group-hover:shadow-[#06B6D4]/25",
            ambientFrom: "from-[#06B6D4]/5",
            ambientTo: "to-[#0891b2]/5"
        },
        teal: {
            activeBorder: "border-[#14B8A6]",
            activeBg: "bg-[#14B8A6]/10",
            baseBorder: "border-[#14B8A6]/20",
            baseBg: "bg-[#14B8A6]/5",
            hoverBorder: "hover:border-[#14B8A6]/50",
            iconBgActive: "bg-[#14B8A6]",
            hoverFrom: "group-hover:from-[#14B8A6]",
            hoverTo: "group-hover:to-[#0d9488]", // darker teal
            hoverShadow: "group-hover:shadow-[#14B8A6]/25",
            ambientFrom: "from-[#14B8A6]/5",
            ambientTo: "to-[#0d9488]/5"
        }
    };

    const currentVariant = variants[variant] || variants.blue;

    return (
        <div
            {...getRootProps()}
            className={clsx(
                "group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ease-in-out overflow-hidden",
                isDragActive
                    ? `${currentVariant.activeBorder} ${currentVariant.activeBg} scale-[1.02]`
                    : `${currentVariant.baseBorder} ${currentVariant.baseBg} ${currentVariant.hoverBorder} hover:bg-white/10 hover:scale-[1.01]`,
                className
            )}
        >
            <input {...getInputProps()} />

            {/* Ambient Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentVariant.ambientFrom} ${currentVariant.ambientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10 flex flex-col items-center space-y-4 text-center p-6">
                <div className={clsx(
                    "p-4 rounded-full transition-all duration-300 shadow-lg",
                    isDragActive
                        ? `${currentVariant.iconBgActive} text-white translate-y-[-4px]`
                        : `bg-white border-2 border-black text-black ${currentVariant.hoverFrom} ${currentVariant.hoverTo} group-hover:text-white ${currentVariant.hoverShadow} group-hover:translate-y-[-4px]`
                )}>
                    {isDragActive ? (
                        <Upload className="w-8 h-8 animate-bounce" />
                    ) : (
                        <FileText className="w-8 h-8" />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-xl font-semibold text-black group-hover:text-black transition-colors">
                        {isDragActive ? "Drop files here" : title}
                    </p>
                    <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        {description}
                    </p>
                </div>
                {!isDragActive && (
                    <div className="mt-4 px-4 py-1.5 border-2 border-black bg-white text-xs font-display font-medium text-black opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Click to browse
                    </div>
                )}
            </div>
        </div>
    );
}
