"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { PDFDocument } from "pdf-lib";
import { Save, Info, Loader2 } from "lucide-react";

interface PDFMetadata {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
    creationDate: string;
    modificationDate: string;
    pageCount: number;
}

export default function MetadataPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState<PDFMetadata | null>(null);
    const [editableMetadata, setEditableMetadata] = useState({
        title: "",
        author: "",
        subject: "",
        keywords: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = async (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setIsLoading(true);
            setError(null);
            try {
                const arrayBuffer = await files[0].arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);

                const title = pdfDoc.getTitle() || "";
                const author = pdfDoc.getAuthor() || "";
                const subject = pdfDoc.getSubject() || "";
                const keywords = pdfDoc.getKeywords() || "";
                const creator = pdfDoc.getCreator() || "";
                const producer = pdfDoc.getProducer() || "";
                const creationDate = pdfDoc.getCreationDate()?.toISOString() || "";
                const modificationDate = pdfDoc.getModificationDate()?.toISOString() || "";

                setMetadata({
                    title, author, subject, keywords,
                    creator, producer, creationDate, modificationDate,
                    pageCount: pdfDoc.getPageCount()
                });

                setEditableMetadata({ title, author, subject, keywords });
            } catch (err) {
                console.error("Failed to read metadata:", err);
                setError("Failed to read PDF metadata.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleSaveMetadata = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            pdfDoc.setTitle(editableMetadata.title);
            pdfDoc.setAuthor(editableMetadata.author);
            pdfDoc.setSubject(editableMetadata.subject);
            pdfDoc.setKeywords([editableMetadata.keywords]);
            pdfDoc.setModificationDate(new Date());

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `metadata_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Failed to save metadata:", err);
            setError("Failed to save metadata.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleString();
        } catch {
            return dateStr;
        }
    };

    return (
        <ToolPageWrapper
            title="PDF Metadata"
            description="View and edit metadata properties of your PDF."
            icon={Info}
            color="purple"
        >
            {!file ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF File"
                        description="Drag & drop or click to browse"
                        variant="purple"
                    />
                </RetroCard>
            ) : isLoading ? (
                <RetroCard>
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>
                </RetroCard>
            ) : metadata && (
                <RetroCard>
                    {/* File Info */}
                    <div className="flex items-center justify-between mb-8 p-4 bg-[#A78BFA]/10 border-2 border-black">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#A78BFA] border-2 border-black">
                                <Info className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-display truncate max-w-[200px] sm:max-w-md">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    {metadata.pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setFile(null); setMetadata(null); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Read-only metadata */}
                        <div>
                            <h3 className="text-sm font-display mb-4">Document Information</h3>
                            <div className="space-y-3 p-4 border-2 border-black bg-white">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-display uppercase">Creator</span>
                                    <span className="text-sm font-sans truncate">{metadata.creator || "N/A"}</span>
                                </div>
                                <div className="w-full h-px bg-black" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-display uppercase">Producer</span>
                                    <span className="text-sm font-sans truncate">{metadata.producer || "N/A"}</span>
                                </div>
                                <div className="w-full h-px bg-black" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-display uppercase">Created At</span>
                                    <span className="text-sm font-sans">{formatDate(metadata.creationDate)}</span>
                                </div>
                                <div className="w-full h-px bg-black" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-display uppercase">Modified At</span>
                                    <span className="text-sm font-sans">{formatDate(metadata.modificationDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Editable metadata */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-display mb-4">Editable Properties</h3>

                            <div>
                                <label className="block text-xs font-display mb-1.5 uppercase">Title</label>
                                <input
                                    type="text"
                                    value={editableMetadata.title}
                                    onChange={(e) => setEditableMetadata(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-[#A78BFA] outline-none font-sans"
                                    placeholder="Document title"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-display mb-1.5 uppercase">Author</label>
                                <input
                                    type="text"
                                    value={editableMetadata.author}
                                    onChange={(e) => setEditableMetadata(prev => ({ ...prev, author: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-[#A78BFA] outline-none font-sans"
                                    placeholder="Document author"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-display mb-1.5 uppercase">Subject</label>
                                <input
                                    type="text"
                                    value={editableMetadata.subject}
                                    onChange={(e) => setEditableMetadata(prev => ({ ...prev, subject: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-[#A78BFA] outline-none font-sans"
                                    placeholder="Document subject"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-display mb-1.5 uppercase">Keywords</label>
                                <input
                                    type="text"
                                    value={editableMetadata.keywords}
                                    onChange={(e) => setEditableMetadata(prev => ({ ...prev, keywords: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-[#A78BFA] outline-none font-sans"
                                    placeholder="Keywords (comma-separated)"
                                />
                            </div>
                        </div>
                    </div>

                    <RetroActionButton
                        label="Save Metadata & Download"
                        isProcessing={isProcessing}
                        processingText="Saving Metadata..."
                        onClick={handleSaveMetadata}
                        color="purple"
                        icon={<Save className="w-5 h-5" />}
                    />
                </RetroCard>
            )}
        </ToolPageWrapper >
    );
}
