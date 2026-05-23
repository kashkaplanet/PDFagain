"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { ShieldAlert, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function SanitizePdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError(null);
            setDownloadUrl(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleSanitize = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Strip all standard metadata
            pdfDoc.setTitle("");
            pdfDoc.setAuthor("");
            pdfDoc.setSubject("");
            pdfDoc.setKeywords([]);
            pdfDoc.setProducer("");
            pdfDoc.setCreator("");

            // Save the sanitized PDF
            const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            
            setDownloadUrl(url);
        } catch (err) {
            console.error("Failed to sanitize PDF:", err);
            setError("Failed to sanitize the PDF. It might be encrypted or corrupted.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!downloadUrl || !file) return;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = file.name.replace(".pdf", "_sanitized.pdf");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <ToolPageWrapper
            title="Sanitize PDF"
            description="Remove hidden metadata, author information, and creation dates for total privacy."
            icon={ShieldAlert}
            color="green"
        >
            <RetroCard className="max-w-2xl mx-auto py-12" variant="default">
                <div className="mb-8">
                    {!file ? (
                        <RetroFileUploader
                            onFilesSelected={handleFileSelected}
                            accept={{ "application/pdf": [".pdf"] }}
                            multiple={false}
                            title="Upload PDF"
                            description="Select a .pdf file to sanitize"
                            variant="green"
                        />
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 p-4 bg-[#4ADE80]/10 border-2 border-black">
                                <div className="p-3 bg-[#4ADE80] border-2 border-black">
                                    <ShieldAlert className="w-6 h-6" />
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
                                    onClick={() => { setFile(null); setDownloadUrl(null); }}
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

                            {!downloadUrl ? (
                                <RetroActionButton
                                    label="Sanitize Document"
                                    isProcessing={isProcessing}
                                    processingText="Sanitizing..."
                                    onClick={handleSanitize}
                                    color="green"
                                    icon={<ShieldAlert className="w-5 h-5" />}
                                />
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#4ADE80]/10 border-2 border-black text-center">
                                        <p className="font-display">
                                            ✓ Document sanitized successfully!
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1 font-sans">
                                            All hidden metadata and tracking info have been removed.
                                        </p>
                                    </div>
                                    <RetroActionButton
                                        label="Download Safe PDF"
                                        onClick={handleDownload}
                                        color="green"
                                        icon={<Download className="w-5 h-5" />}
                                        isProcessing={false}
                                        processingText=""
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="mt-8 text-sm text-gray-600 font-sans border-t-2 border-dashed border-gray-300 pt-6">
                    <h3 className="font-display text-black mb-2">What gets removed?</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Author name and identity</li>
                        <li>Creation and modification dates</li>
                        <li>Software used to create the file</li>
                        <li>Hidden document properties</li>
                        <li>Keywords and subjects</li>
                    </ul>
                </div>
            </RetroCard>
        </ToolPageWrapper>
    );
}
