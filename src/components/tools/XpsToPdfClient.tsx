"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Download, FileText } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import JSZip from "jszip";

export default function XpsToPdfClient() {
    const [file, setFile] = useState<File | null>(null);
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
        accept: { "application/vnd.ms-xpsdocument": [".xps"], "application/oxps": [".oxps"] },
    });

    const extractTextFromXps = async (arrayBuffer: ArrayBuffer): Promise<string[]> => {
        const zip = await JSZip.loadAsync(arrayBuffer);
        const pages: string[] = [];

        // XPS files contain .fpage files in Documents/1/Pages/
        const pageFiles: string[] = [];
        zip.forEach((path) => {
            if (path.endsWith('.fpage')) {
                pageFiles.push(path);
            }
        });

        pageFiles.sort();

        const parser = new DOMParser();

        for (const pagePath of pageFiles) {
            const content = await zip.file(pagePath)?.async("string");
            if (!content) continue;

            const xmlDoc = parser.parseFromString(content, "application/xml");
            let pageText = '';

            // Extract text from Glyphs elements (XPS stores text in Glyphs)
            const glyphElements = xmlDoc.getElementsByTagName('Glyphs');
            for (let i = 0; i < glyphElements.length; i++) {
                const glyph = glyphElements[i];
                const unicodeString = glyph.getAttribute('UnicodeString');
                if (unicodeString) {
                    pageText += unicodeString + ' ';
                }
            }

            // Fallback: try to get any text content
            if (!pageText.trim()) {
                const extractText = (node: Node): string => {
                    let text = '';
                    if (node.nodeType === Node.TEXT_NODE) {
                        text += node.textContent || '';
                    }
                    for (const child of Array.from(node.childNodes)) {
                        text += extractText(child);
                    }
                    return text;
                };
                pageText = extractText(xmlDoc.documentElement);
            }

            if (pageText.trim()) {
                pages.push(pageText.trim());
            }
        }

        return pages;
    };

    const handleConvert = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pages = await extractTextFromXps(arrayBuffer);

            if (pages.length === 0) {
                setError("Could not extract text from XPS file. The file may contain only images or use unsupported features.");
                return;
            }

            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

            const fontSize = 11;
            const lineHeight = 15;
            const margin = 50;
            const pageWidth = 612;
            const pageHeight = 792;
            const maxLineWidth = pageWidth - margin * 2;

            for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
                const text = pages[pageIdx];

                // Word-wrap text
                const words = text.split(/\s+/).filter(w => w);
                const wrappedLines: string[] = [];
                let currentLine = '';

                for (const word of words) {
                    const testLine = currentLine ? currentLine + ' ' + word : word;
                    const textWidth = font.widthOfTextAtSize(testLine, fontSize);
                    if (textWidth > maxLineWidth && currentLine) {
                        wrappedLines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                }
                if (currentLine) wrappedLines.push(currentLine);

                let page = pdfDoc.addPage([pageWidth, pageHeight]);
                let y = pageHeight - margin;

                if (pageIdx === 0) {
                    page.drawText(file.name.replace(/\.xps$/i, ''), {
                        x: margin,
                        y,
                        size: 16,
                        font: boldFont,
                        color: rgb(0.2, 0.2, 0.2),
                    });
                    y -= 30;
                }

                for (const line of wrappedLines) {
                    if (y < margin) {
                        page = pdfDoc.addPage([pageWidth, pageHeight]);
                        y = pageHeight - margin;
                    }

                    page.drawText(line, {
                        x: margin,
                        y,
                        size: fontSize,
                        font,
                        color: rgb(0.1, 0.1, 0.1),
                        maxWidth: maxLineWidth,
                    });

                    y -= lineHeight;
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = file.name.replace(/\.xps$/i, ".pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Conversion failed:", err);
            setError("Failed to convert XPS to PDF. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title="XPS to PDF"
            description="Convert XPS (XML Paper Specification) files to PDF."
            icon={FileText}
            color="blue"
        >
            <RetroCard className="max-w-2xl mx-auto">
                {!file ? (
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        accept={{ "application/vnd.ms-xpsdocument": [".xps"], "application/oxps": [".oxps"] }}
                        multiple={false}
                        title="Select XPS File"
                        description="Upload a .xps or .oxps file to convert"
                        variant="blue"
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 p-4 bg-[#60A5FA]/10 border-2 border-black">
                            <div className="p-3 bg-[#60A5FA] border-2 border-black">
                                <FileText className="w-6 h-6" />
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
                                onClick={() => setFile(null)}
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

                        <RetroActionButton
                            label="Convert to PDF"
                            isProcessing={isProcessing}
                            processingText="Converting..."
                            onClick={handleConvert}
                            color="blue"
                            icon={<Download className="w-5 h-5" />}
                        />
                    </div>
                )}
            </RetroCard>

            <div className="mt-6 text-center text-sm text-gray-600 font-sans">
                <p>Supports XPS and OXPS files.</p>
                <p>Extracts text from each page and converts to PDF.</p>
            </div>
        </ToolPageWrapper>
    );
}
