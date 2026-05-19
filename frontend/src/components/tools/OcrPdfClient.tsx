"use client";

import React, { useState, useRef } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { ScanText, Copy, Check, Download, AlertCircle } from "lucide-react";

export default function OcrPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setExtractedText("");
            setError(null);
            setProgress(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsProcessing(false);
            setError("Processing cancelled.");
        }
    };

    const handleOCR = async () => {
        if (!file) return;

        setIsProcessing(true);
        setExtractedText("");
        setError(null);
        setProgress(null);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("lang", "eng"); // Default to English for now

            const response = await fetch("/api/ocr-pdf", {
                method: "POST",
                body: formData,
                signal: abortController.signal,
            });

            if (!response.ok || !response.body) {
                if (response.status === 429) {
                    throw new Error("Too many requests. Please try again in a minute.");
                }
                throw new Error(response.statusText || "Failed to start OCR processing");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split("\n");
                // Keep the last part in the buffer as it might be incomplete
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const json = JSON.parse(line);

                        if (json.type === "meta") {
                            setProgress({ current: 0, total: json.totalPages });
                        } else if (json.type === "page" || !json.type) { // Handle legacy/new format

                            // Update progress
                            if (json.page) {
                                setProgress(prev => {
                                    if (!prev) return { current: 1, total: 0 }; // Should be set by meta, but fallback
                                    return { ...prev, current: prev.current + 1 };
                                });
                            }

                            if (json.error) {
                                setExtractedText((prev) => prev + `\n[Page ${json.page} Error: ${json.error}]\n`);
                            } else {
                                setExtractedText((prev) => prev + (json.text || "") + "\n");
                            }
                        } else if (json.error) {
                            // Top level error
                            if (json.error === "Too many requests. Please try again later.") {
                                throw new Error(json.error);
                            }
                            setExtractedText((prev) => prev + `\n[Error: ${json.error}]\n`);
                        }
                    } catch {
                        console.warn("Failed to parse chunk:", line);
                    }
                }
            }

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                console.log("OCR cancelled");
                return; // Handled in handleCancel
            }
            console.error("OCR failed:", err);
            setError(err instanceof Error ? err.message : "OCR processing failed. Please try again.");
        } finally {
            if (abortControllerRef.current === abortController) {
                setIsProcessing(false);
                abortControllerRef.current = null;
            }
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(extractedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const downloadText = () => {
        const blob = new Blob([extractedText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ocr_${file?.name.replace(".pdf", ".txt") || "output.txt"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ToolPageWrapper
            title="OCR PDF"
            description="Extract text from scanned PDFs using optical character recognition."
            icon={ScanText}
            color="orange"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select Scanned PDF"
                        description="Drag & drop or click to browse"
                        variant="orange"
                    />
                </RetroCard>
            ) : (
                <RetroCard>
                    {/* File Info */}
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-[#FB923C]/10 border-2 border-black">
                        <div className="p-3 bg-[#FB923C] border-2 border-black">
                            <ScanText className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-display truncate">
                                {file.name}
                            </h2>
                            <p className="text-sm text-gray-600 font-sans">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={() => { setFile(null); setExtractedText(""); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {!extractedText && !isProcessing && (
                        <div className="mb-6 p-4 bg-[#FB923C]/10 border-2 border-[#FB923C] text-sm font-sans">
                            <strong>Note:</strong> Processing happens on our high-speed servers. Large files may take a moment to start streaming.
                        </div>
                    )}

                    {isProcessing && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-display animate-pulse">
                                    {progress
                                        ? `Processing Page ${progress.current} of ${progress.total}`
                                        : "Initializing..."}
                                </span>
                                <button
                                    onClick={handleCancel}
                                    className="text-xs text-red-500 hover:text-red-700 font-display underline"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="w-full bg-gray-200 h-2 border-2 border-black overflow-hidden relative">
                                {progress && progress.total > 0 ? (
                                    <div
                                        className="h-full bg-[#FB923C] transition-all duration-300 ease-out"
                                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                    />
                                ) : (
                                    <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FB923C] animate-[slide_1.5s_ease-in-out_infinite]" />
                                )}
                            </div>
                            <style jsx>{`
                                @keyframes slide {
                                    0% { left: -33%; }
                                    100% { left: 100%; }
                                }
                            `}</style>
                        </div>
                    )}

                    {extractedText && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-display">
                                    Extracted Text
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center px-3 py-1.5 text-sm border-2 border-black bg-white hover:bg-gray-100 font-display"
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                    <button
                                        onClick={downloadText}
                                        className="flex items-center px-3 py-1.5 text-sm border-2 border-black bg-[#FB923C] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display"
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        Download .txt
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={extractedText}
                                readOnly
                                className="w-full h-[500px] p-4 border-2 border-black font-mono text-sm bg-white resize-none focus:outline-none"
                            />
                        </div>
                    )}

                    {!extractedText && (
                        <div className="flex justify-center">
                            <RetroActionButton
                                label="Start Server OCR"
                                isProcessing={isProcessing}
                                processingText="Connecting..."
                                onClick={handleOCR}
                                disabled={isProcessing}
                                color="orange"
                                icon={<ScanText className="w-5 h-5" />}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-[#F87171] shrink-0 mt-0.5" />
                            <div>
                                <strong className="block font-display mb-1">Error</strong>
                                {error}
                            </div>
                        </div>
                    )}
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
