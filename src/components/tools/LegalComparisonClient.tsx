"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
// import * as pdfjsLib from "pdfjs-dist";
import { Scale, FileText, AlertTriangle, CheckCircle2, MinusCircle } from "lucide-react";

// if (typeof window !== "undefined") {
//    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
// }

interface Difference {
    type: "added" | "removed" | "modified";
    lineNumber: number;
    content: string;
    originalContent?: string;
}

interface ComparisonResult {
    totalDifferences: number;
    addedLines: number;
    removedLines: number;
    modifiedLines: number;
    differences: Difference[];
    similarity: number;
}

export default function LegalComparisonClient() {
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const pdf1 = usePDF(file1);
    const pdf2 = usePDF(file2);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<ComparisonResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFile1Selected = (files: File[]) => {
        if (files.length > 0) {
            setFile1(files[0]);
            setResult(null);
            setError(null);
        }
    };

    const handleFile2Selected = (files: File[]) => {
        if (files.length > 0) {
            setFile2(files[0]);
            setResult(null);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: (files) => {
            if (files.length === 1) {
                if (!file1) setFile1(files[0]);
                else setFile2(files[0]);
            } else if (files.length >= 2) {
                setFile1(files[0]);
                setFile2(files[1]);
            }
            setResult(null);
            setError(null);
        },
        accept: { "application/pdf": [".pdf"] },
    });

    const extractText = async (pdfProxy: any, pageCount: number): Promise<string[]> => {
        const lines: string[] = [];

        for (let i = 1; i <= pageCount; i++) {
            const page = await pdfProxy.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");

            pageText.split(/[.!?]\s+/).forEach((sentence: string) => {
                const cleaned = sentence.trim();
                if (cleaned.length > 10) {
                    lines.push(cleaned);
                }
            });
        }

        return lines;
    };

    const compareDocs = (lines1: string[], lines2: string[]): ComparisonResult => {
        const differences: Difference[] = [];
        let addedLines = 0;
        let removedLines = 0;
        let modifiedLines = 0;

        const set1 = new Set(lines1.map(l => l.toLowerCase().trim()));
        const set2 = new Set(lines2.map(l => l.toLowerCase().trim()));

        lines1.forEach((line, i) => {
            const normalized = line.toLowerCase().trim();
            if (!set2.has(normalized)) {
                const similar = lines2.find(l2 => {
                    const sim = calculateSimilarity(normalized, l2.toLowerCase().trim());
                    return sim > 0.6 && sim < 1;
                });

                if (similar) {
                    differences.push({
                        type: "modified",
                        lineNumber: i + 1,
                        content: similar,
                        originalContent: line
                    });
                    modifiedLines++;
                } else {
                    differences.push({
                        type: "removed",
                        lineNumber: i + 1,
                        content: line
                    });
                    removedLines++;
                }
            }
        });

        lines2.forEach((line, i) => {
            const normalized = line.toLowerCase().trim();
            if (!set1.has(normalized)) {
                const isModified = differences.some(d =>
                    d.type === "modified" && d.content.toLowerCase().trim() === normalized
                );

                if (!isModified) {
                    differences.push({
                        type: "added",
                        lineNumber: i + 1,
                        content: line
                    });
                    addedLines++;
                }
            }
        });

        const totalLines = Math.max(lines1.length, lines2.length);
        const changedLines = addedLines + removedLines + modifiedLines;
        const similarity = totalLines > 0 ? Math.round((1 - changedLines / totalLines) * 100) : 100;

        return {
            totalDifferences: differences.length,
            addedLines,
            removedLines,
            modifiedLines,
            differences: differences.slice(0, 100),
            similarity
        };
    };

    const calculateSimilarity = (str1: string, str2: string): number => {
        const words1 = str1.split(/\s+/);
        const words2 = str2.split(/\s+/);
        const set1 = new Set(words1);
        const set2 = new Set(words2);

        let common = 0;
        set1.forEach(word => {
            if (set2.has(word)) common++;
        });

        return common / Math.max(set1.size, set2.size);
    };

    const handleCompare = async () => {
        if (!pdf1.pdfProxy || !pdf2.pdfProxy) return;

        setIsProcessing(true);
        setError(null);
        try {
            const [lines1, lines2] = await Promise.all([
                extractText(pdf1.pdfProxy, pdf1.pageCount),
                extractText(pdf2.pdfProxy, pdf2.pageCount)
            ]);

            const comparison = compareDocs(lines1, lines2);
            setResult(comparison);
        } catch (err) {
            console.error("Failed to compare documents:", err);
            setError("Failed to compare documents. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const bothFilesSelected = file1 && file2;
    const bothLoaded = pdf1.pdfProxy && pdf2.pdfProxy;

    return (
        <ToolPageWrapper
            title="Legal Document Comparison"
            description="Compare two legal documents to find differences and changes."
            icon={Scale}
            color="lime"
        >
            {!result ? (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* File Upload Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RetroCard>
                            <h3 className="font-display mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-[#A3E635]" />
                                Original Document
                            </h3>
                            {!file1 ? (
                                <RetroFileUploader
                                    onFilesSelected={handleFile1Selected}
                                    multiple={false}
                                    accept={{ "application/pdf": [".pdf"] }}
                                    variant="lime"
                                    title="Select Original PDF"
                                    description="Drag & drop or click"
                                />
                            ) : (
                                <div className="flex items-center p-4 bg-[#A3E635]/10 border-2 border-black">
                                    <FileText className="w-8 h-8 text-[#A3E635] mr-3" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-display truncate">{file1.name}</div>
                                        <div className="text-sm text-gray-600 font-sans">{pdf1.pageCount} pages</div>
                                    </div>
                                    <button
                                        onClick={() => setFile1(null)}
                                        className="px-3 py-1 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </RetroCard>

                        <RetroCard>
                            <h3 className="font-display mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-[#A3E635]" />
                                Revised Document
                            </h3>
                            {!file2 ? (
                                <RetroFileUploader
                                    onFilesSelected={handleFile2Selected}
                                    multiple={false}
                                    accept={{ "application/pdf": [".pdf"] }}
                                    variant="lime"
                                    title="Select Revised PDF"
                                    description="Drag & drop or click"
                                />
                            ) : (
                                <div className="flex items-center p-4 bg-[#A3E635]/10 border-2 border-black">
                                    <FileText className="w-8 h-8 text-[#A3E635] mr-3" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-display truncate">{file2.name}</div>
                                        <div className="text-sm text-gray-600 font-sans">{pdf2.pageCount} pages</div>
                                    </div>
                                    <button
                                        onClick={() => setFile2(null)}
                                        className="px-3 py-1 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </RetroCard>
                    </div>

                    {/* Compare Button */}
                    {bothFilesSelected && (
                        <RetroActionButton
                            label="Compare Documents"
                            isProcessing={isProcessing}
                            processingText="Comparing Documents..."
                            onClick={handleCompare}
                            disabled={!bothLoaded}
                            color="lime"
                            icon={<Scale className="w-5 h-5" />}
                        />
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-sans">
                            {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-5 border-2 border-black bg-white text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className={`text-3xl font-display ${result.similarity >= 80 ? "text-green-600" : result.similarity >= 50 ? "text-amber-600" : "text-red-600"}`}>
                                {result.similarity}%
                            </div>
                            <div className="text-sm text-gray-600 font-sans mt-1">Similarity</div>
                        </div>
                        <div className="p-5 border-2 border-black bg-white text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="text-3xl font-display text-green-600">{result.addedLines}</div>
                            <div className="text-sm text-gray-600 font-sans mt-1">Added</div>
                        </div>
                        <div className="p-5 border-2 border-black bg-white text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="text-3xl font-display text-red-600">{result.removedLines}</div>
                            <div className="text-sm text-gray-600 font-sans mt-1">Removed</div>
                        </div>
                        <div className="p-5 border-2 border-black bg-white text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="text-3xl font-display text-amber-600">{result.modifiedLines}</div>
                            <div className="text-sm text-gray-600 font-sans mt-1">Modified</div>
                        </div>
                    </div>

                    {/* Differences List */}
                    <RetroCard>
                        <div className="p-4 border-b-2 border-black -mx-6 -mt-6 mb-4 bg-gray-100">
                            <h3 className="font-display">
                                Differences ({result.totalDifferences})
                            </h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto -mx-6 px-6">
                            {result.differences.length === 0 ? (
                                <div className="py-8 text-center text-gray-500">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                    No differences found. Documents are identical.
                                </div>
                            ) : (
                                result.differences.map((diff, i) => (
                                    <div key={i} className="p-4 border-2 border-black mb-2">
                                        <div className="flex items-start gap-3">
                                            {diff.type === "added" && (
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            )}
                                            {diff.type === "removed" && (
                                                <MinusCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            )}
                                            {diff.type === "modified" && (
                                                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-display text-gray-500 mb-1">
                                                    Line {diff.lineNumber} • {diff.type.charAt(0).toUpperCase() + diff.type.slice(1)}
                                                </div>
                                                {diff.type === "modified" && diff.originalContent && (
                                                    <div className="text-sm text-red-600 line-through mb-1 font-sans">
                                                        {diff.originalContent}
                                                    </div>
                                                )}
                                                <div className={`text-sm font-sans ${diff.type === "added" ? "text-green-700" :
                                                    diff.type === "removed" ? "text-red-700" :
                                                        "text-amber-700"
                                                    }`}>
                                                    {diff.content}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </RetroCard>

                    <button
                        onClick={() => { setFile1(null); setFile2(null); setResult(null); }}
                        className="w-full py-3 border-2 border-black bg-white hover:bg-gray-100 font-display transition-colors"
                    >
                        Compare Different Documents
                    </button>
                </div>
            )}
        </ToolPageWrapper>
    );
}
