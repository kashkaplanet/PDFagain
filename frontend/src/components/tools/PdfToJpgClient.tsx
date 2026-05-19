"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton, RetroFileItem } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { FileImage, ArrowRight, Download, AlertTriangle } from "lucide-react";
import { RetroVariant } from "@/config/design";

interface PdfToJpgClientProps {
    title?: string;
    description?: string;
    outputFormat?: string;
    variant?: RetroVariant;
}

export default function PdfToJpgClient({
    title = "PDF to JPG",
    description = "Convert PDF pages to high-quality JPEG images.",
    outputFormat = "jpg",
    variant = "blue",
}: PdfToJpgClientProps) {
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
        accept: { "application/pdf": [".pdf"] },
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
        formData.append("format", "images");
        formData.append("image_format", outputFormat);

        // Use dedicated API routes for each format
        const apiUrl = outputFormat === "webp" ? "/api/pdf-to-webp" 
            : outputFormat === "png" ? "/api/pdf-to-png" 
            : "/api/pdf-to-jpg";

        try {
            const response = await fetch(apiUrl, {
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
            a.download = file.name.replace(/\.[^/.]+$/, "") + `_${outputFormat}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <ToolPageWrapper
            title={title}
            description={description}
            icon={FileImage}
            color={variant}
        >
            <RetroCard className="max-w-xl mx-auto py-12" variant="default">
                <div className="mb-8">
                    {!file ? (
                        <RetroFileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ "application/pdf": [".pdf"] }}
                            multiple={false}
                            title="Upload PDF"
                            description="Select a .pdf file to convert"
                            variant={variant}
                        />
                    ) : (
                        <RetroFileItem
                            name={file.name}
                            size={(file.size / 1024).toFixed(1) + " KB"}
                            index={0}
                            onRemove={handleRemoveFile}
                            color={variant}
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
                                label={`Download ${outputFormat.toUpperCase()} (.zip)`}
                                isProcessing={false}
                                processingText=""
                                onClick={handleDownload}
                                color={variant}
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
                            label={`Convert to ${outputFormat.toUpperCase()}`}
                            isProcessing={isConverting}
                            processingText="Converting..."
                            onClick={handleConvert}
                            disabled={!file}
                            color={variant}
                            icon={<ArrowRight className="w-5 h-5" />}
                        />
                    )}
                </div>
            </RetroCard>
        </ToolPageWrapper>
    );
}
