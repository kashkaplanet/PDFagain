"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroSelect, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { compressPDF } from "@/core/pdf";
import { Download, FileArchive, ArrowRight } from "lucide-react";

type CompressionLevel = 'extreme' | 'recommended' | 'less';

export default function CompressPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
    const [compressedFile, setCompressedFile] = useState<{ blob: Blob; url: string; size: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setCompressedFile(null);
            setError(null);
            setProgress(0);
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
        setProgress(0);
        try {
            const blob = await compressPDF(file, compressionLevel, (percent) => {
                setProgress(percent);
            });

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

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    };

    const getReductionColor = (percent: number) => {
        if (percent >= 50) return '#22C55E'; // green — great reduction
        if (percent >= 30) return '#FB923C'; // orange — decent
        return '#F87171'; // red — minimal
    };

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
                            onClick={() => { setFile(null); setCompressedFile(null); setProgress(0); }}
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
                                { value: 'extreme', label: 'Extreme', description: 'Max compression, lower quality (~70-80% smaller)' },
                                { value: 'recommended', label: 'Recommended', description: 'Balanced quality & size (~40-60% smaller)' },
                                { value: 'less', label: 'Light', description: 'Best quality, less compression (~20-30% smaller)' },
                            ]}
                            value={compressionLevel}
                            onChange={(v) => setCompressionLevel(v as CompressionLevel)}
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
                                {(() => {
                                    const percent = Math.round(((file.size - compressedFile.size) / file.size) * 100);
                                    return (
                                        <span
                                            className="text-black text-sm px-3 py-1 border-2 border-black font-display"
                                            style={{ backgroundColor: getReductionColor(percent) }}
                                        >
                                            {percent > 0 ? `-${percent}%` : `+${Math.abs(percent)}%`}
                                        </span>
                                    );
                                })()}
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
                            {/* Progress Bar */}
                            {isProcessing && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-display">Compressing pages...</span>
                                        <span className="text-sm text-gray-600 font-sans">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-4 border-2 border-black">
                                        <div
                                            className="bg-[#FB923C] h-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

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
