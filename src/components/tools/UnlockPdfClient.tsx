"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Unlock, KeyRound, Eye, EyeOff } from "lucide-react";
import { unlockPdf } from "@/lib/pdf-unlocker";

export default function UnlockPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
        accept: { "application/pdf": [".pdf"] },
    });

    const handleUnlock = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const blob = await unlockPdf(file, password);
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `unlocked_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error("Failed to unlock PDF:", err);
            setError(err.message || "Failed to process PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title="Unlock PDF"
            description="Remove password protection from your PDF files."
            icon={Unlock}
            color="green"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select Protected PDF"
                        description="Drag & drop or click to browse"
                        variant="green"
                    />
                </RetroCard>
            ) : (
                <RetroCard className="max-w-xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center justify-between mb-8 p-4 bg-[#34D399]/10 border-2 border-black">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#34D399] border-2 border-black">
                                <Unlock className="w-6 h-6" />
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
                            onClick={() => { setFile(null); setPassword(""); setError(null); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-display mb-2">
                            <KeyRound className="w-4 h-4 inline mr-2" />
                            PDF Password (if any)
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password to unlock"
                                className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-[#34D399] outline-none font-sans pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 font-sans">
                            Leave empty if the PDF only has restrictions (no open password).
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans">
                            {error}
                        </div>
                    )}

                    <RetroActionButton
                        label="Unlock & Download PDF"
                        isProcessing={isProcessing}
                        processingText="Unlocking..."
                        onClick={handleUnlock}
                        color="green"
                        icon={<Unlock className="w-5 h-5" />}
                    />
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
