"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { PDFDocument } from "pdf-lib";
import { Wrench, CheckCircle } from "lucide-react";

export default function RepairPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [repairResult, setRepairResult] = useState<{
        success: boolean;
        message: string;
        pageCount?: number;
    } | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setRepairResult(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleRepair = async () => {
        if (!file) return;

        setIsProcessing(true);
        setRepairResult(null);

        try {
            const arrayBuffer = await file.arrayBuffer();

            const pdfDoc = await PDFDocument.load(arrayBuffer, {
                ignoreEncryption: true,
                updateMetadata: false,
            });

            const pageCount = pdfDoc.getPageCount();

            const pdfBytes = await pdfDoc.save({
                useObjectStreams: false,
            });

            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `repaired_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setRepairResult({
                success: true,
                message: "PDF repaired successfully!",
                pageCount,
            });

        } catch (err) {
            console.error("Failed to repair PDF:", err);
            setRepairResult({
                success: false,
                message: "Could not repair PDF. The file may be severely corrupted or use unsupported features.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title="Repair PDF"
            description="Fix corrupted or damaged PDF files."
            icon={Wrench}
            color="orange"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF to Repair"
                        description="Drag & drop or click to browse"
                        variant="orange"
                    />
                </RetroCard>
            ) : (
                <RetroCard className="max-w-xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-[#FB923C]/10 border-2 border-black">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#FB923C] border-2 border-black">
                                <Wrench className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-display truncate max-w-[200px]">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setFile(null); setRepairResult(null); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mb-6 p-4 bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-sm font-sans">
                        <strong>Repair attempts to:</strong>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                            <li>Fix broken internal references</li>
                            <li>Rebuild the PDF structure</li>
                            <li>Remove corrupted elements</li>
                            <li>Create a clean, readable copy</li>
                        </ul>
                    </div>

                    {repairResult && (
                        <div className={`mb-6 p-4 text-sm font-sans border-2 ${repairResult.success
                            ? "bg-[#34D399]/10 border-[#34D399]"
                            : "bg-[#F87171]/10 border-[#F87171]"
                            }`}>
                            <div className="flex items-center">
                                {repairResult.success && <CheckCircle className="w-5 h-5 mr-2" />}
                                <strong>{repairResult.message}</strong>
                            </div>
                            {repairResult.pageCount && (
                                <p className="mt-1">Recovered {repairResult.pageCount} pages.</p>
                            )}
                        </div>
                    )}

                    <RetroActionButton
                        label="Repair PDF"
                        isProcessing={isProcessing}
                        processingText="Repairing..."
                        onClick={handleRepair}
                        color="orange"
                        icon={<Wrench className="w-5 h-5" />}
                    />
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
