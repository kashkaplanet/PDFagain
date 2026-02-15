"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton, RetroFileItem } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Table, ArrowRight, Download, AlertTriangle } from "lucide-react";

export default function CsvToExcelClient() {
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
        accept: { "text/csv": [".csv"] },
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
            const response = await fetch("/api/convert/csv-to-excel", {
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
            a.download = file.name.replace(/\.csv$/i, "") + ".xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(convertedUrl);
        }
    };

    return (
        <ToolPageWrapper
            title="CSV to Excel"
            description="Convert CSV files to Excel spreadsheet format."
            icon={Table}
            color="yellow"
        >
            <RetroCard className="max-w-2xl mx-auto py-12" variant="default">
                <div className="mb-8">
                    {!file ? (
                        <RetroFileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ "text/csv": [".csv"] }}
                            multiple={false}
                            title="Upload CSV File"
                            description="Select a .csv file to convert to Excel"
                            variant="yellow"
                        />
                    ) : (
                        <RetroFileItem
                            name={file.name}
                            size={(file.size / 1024).toFixed(1) + " KB"}
                            index={0}
                            onRemove={handleRemoveFile}
                            color="yellow"
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
                                label="Download Excel"
                                isProcessing={false}
                                processingText=""
                                onClick={handleDownload}
                                color="yellow"
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
                            label="Convert to Excel"
                            isProcessing={isConverting}
                            processingText="Converting..."
                            onClick={handleConvert}
                            disabled={!file}
                            color="yellow"
                            icon={<ArrowRight className="w-5 h-5" />}
                        />
                    )}
                </div>
            </RetroCard>
        </ToolPageWrapper>
    );
}
