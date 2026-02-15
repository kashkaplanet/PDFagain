"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Download, FileText } from "lucide-react";


export default function RtfToPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/rtf": [".rtf"], "text/rtf": [".rtf"] },
    });



    const handleConvert = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/convert/rtf-to-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Conversion failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            console.error("Conversion failed:", err);
            setError(err.message || "Failed to convert RTF to PDF. Ensure the server has Microsoft Word installed.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title="RTF to PDF"
            description="Convert Rich Text Format files to PDF documents."
            icon={FileText}
            color="cyan"
        >
            <RetroCard className="max-w-2xl mx-auto">
                {!file ? (
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        accept={{ "application/rtf": [".rtf"], "text/rtf": [".rtf"] }}
                        multiple={false}
                        title="Select RTF File"
                        description="Upload a .rtf file to convert"
                        variant="cyan"
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 p-4 bg-[#22D3EE]/10 border-2 border-black">
                            <div className="p-3 bg-[#22D3EE] border-2 border-black">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-display truncate">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                            >
                                Change
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans">
                                {error}
                            </div>
                        )}

                        <RetroActionButton
                            label="Convert to PDF"
                            isProcessing={isProcessing}
                            processingText="Converting..."
                            onClick={handleConvert}
                            color="cyan"
                            icon={<Download className="w-5 h-5" />}
                        />
                    </div>
                )}
            </RetroCard>

            <div className="mt-6 text-center text-sm text-gray-600 font-sans">
                <p>Extracts text content from RTF and converts to PDF.</p>
                <p>Supports basic RTF formatting and special characters.</p>
            </div>
        </ToolPageWrapper>
    );
}
