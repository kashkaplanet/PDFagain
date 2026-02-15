"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton, RetroFileItem } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { FileText, ArrowRight, Download, AlertTriangle } from "lucide-react";

export default function WordToPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError(null);
            setConvertedUrl(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFilesSelected,
        accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    });

    const handleRemoveFile = () => {
        setFile(null);
        setConvertedUrl(null);
        setError(null);
    };

    const handleConvert = async () => {
        if (!file) return;

        setIsConverting(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/convert/word", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Conversion failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setConvertedUrl(url);
        } catch (err: any) {
            setError(err.message || "An error occurred during conversion.");
        } finally {
            setIsConverting(false);
        }
    };

    const handleDownload = () => {
        if (convertedUrl && file) {
            const a = document.createElement("a");
            a.href = convertedUrl;
            a.download = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <ToolPageWrapper
            title="Word to PDF"
            description="Convert DOCX files to PDF using native Word automation."
            icon={FileText}
            color="cyan"
        >
            <RetroCard className="max-w-2xl mx-auto py-12" variant="default">
                <div className="mb-8">
                    {!file ? (
                        <RetroFileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }}
                            multiple={false}
                            title="Upload Word Document"
                            description="Select a .docx file to convert"
                            variant="cyan"
                        />
                    ) : (
                        <RetroFileItem
                            name={file.name}
                            size={(file.size / 1024).toFixed(1) + " KB"}
                            index={0}
                            onRemove={handleRemoveFile}
                            color="cyan"
                        />
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 border-2 border-black bg-red-100 text-red-800 font-display flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <div className="mt-8 flex gap-4">
                    {convertedUrl ? (
                        <>
                            <RetroActionButton
                                label="Download PDF"
                                isProcessing={false}
                                processingText=""
                                onClick={handleDownload}
                                color="cyan"
                                icon={<Download className="w-5 h-5" />}
                            />
                            <RetroActionButton
                                label="Convert Another"
                                isProcessing={false}
                                processingText=""
                                onClick={handleRemoveFile}
                                color="default"
                                icon={<ArrowRight className="w-5 h-5" />}
                            />
                        </>
                    ) : (
                        <RetroActionButton
                            label="Convert to PDF"
                            isProcessing={isConverting}
                            processingText="Converting..."
                            onClick={handleConvert}
                            disabled={!file}
                            color="cyan"
                            icon={<ArrowRight className="w-5 h-5" />}
                        />
                    )}
                </div>
            </RetroCard>
        </ToolPageWrapper>
    );
}
