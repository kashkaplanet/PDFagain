"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroSelect, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { compressPDF } from "@/core/pdf";
import { Download, FileArchive, ArrowRight } from "lucide-react";

export default function CompressPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressionLevel, setCompressionLevel] = useState<'recommended' | 'extreme'>('recommended');
    const [compressedFile, setCompressedFile] = useState<{ blob: Blob; url: string; size: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setCompressedFile(null);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleCompress = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        try {
            const quality = compressionLevel === 'extreme' ? 'extreme' : 'recommended';
            const blob = await compressPDF(file, quality);

            const url = URL.createObjectURL(blob);
            setCompressedFile({
                blob,
                url,
                size: blob.size
            });
        } catch (error) {
            console.error("Failed to compress PDF", error);
            setError("Failed to compress PDF. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatSize = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + " MB";

    return (
        <ToolPageWrapper
            title="Compress PDF"
            description="Reduce file size while optimizing for maximal PDF quality."
            icon={FileArchive}
            color="orange"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        accept={{ "application/pdf": [".pdf"] }}
                        title="Select PDF to Compress"
                        description="Drag & drop or click to browse"
                        variant="orange"
                    />
                </RetroCard>
            ) : (
                <RetroCard>
                    {/* File Info */}
                    <div className="flex items-center justify-between mb-8 p-4 bg-[#FB923C]/10 border-2 border-black">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#FB923C] border-2 border-black">
                                <FileArchive className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-display truncate max-w-[300px]">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    Original size: {formatSize(file.size)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setFile(null); setCompressedFile(null); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change File
                        </button>
                    </div>

                    {/* Compression Options */}
                    <div className="mb-8">
                        <h3 className="font-display text-lg mb-4">Compression Level</h3>
                        <RetroSelect
                            options={[
                                { value: 'extreme', label: 'Extreme', description: 'Less quality, high compression' },
                                { value: 'recommended', label: 'Recommended', description: 'Good quality, good compression' },
                            ]}
                            value={compressionLevel}
                            onChange={(v) => setCompressionLevel(v as 'recommended' | 'extreme')}
                            color="orange"
                        />
                    </div>

                    {compressedFile ? (
                        <div className="text-center p-6 bg-[#FB923C]/10 border-2 border-[#FB923C]">
                            <h3 className="text-xl font-display mb-4">PDF Compressed!</h3>
                            <div className="flex justify-center items-center gap-4 text-black mb-6">
                                <span className="line-through opacity-60 font-sans">{formatSize(file.size)}</span>
                                <ArrowRight className="w-4 h-4" />
                                <span className="font-display text-lg">{formatSize(compressedFile.size)}</span>
                                <span className="bg-[#FB923C] text-black text-sm px-3 py-1 border-2 border-black font-display">
                                    -{Math.round(((file.size - compressedFile.size) / file.size) * 100)}%
                                </span>
                            </div>

                            <a
                                href={compressedFile.url}
                                download={`compressed_${file.name}`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FB923C] hover:bg-[#F97316] text-black font-display text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Download Compressed PDF
                                <Download className="w-6 h-6" />
                            </a>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6">
                                    {error}
                                </div>
                            )}

                            <RetroActionButton
                                label="Compress PDF"
                                isProcessing={isProcessing}
                                processingText="Compressing..."
                                onClick={handleCompress}
                                color="orange"
                            />
                        </>
                    )}
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
