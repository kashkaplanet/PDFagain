"use client";

import React, { useState, useRef } from "react";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { FileCode, Download, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";

const DEFAULT_MARKDOWN = `# Welcome to Markdown to PDF

This is a simple tool to convert your **Markdown** into a beautifully styled PDF document.

## Features

- **Live Preview:** See your changes instantly on the right.
- **Client-Side Processing:** Your data never leaves your browser.
- **GitHub Flavored Markdown:** Supports tables, task lists, and more!

### Example Table

| Feature | Supported |
|---------|-----------|
| Tables | ✅ |
| Bold | ✅ |
| Lists | ✅ |

### Task List
- [x] Write some Markdown
- [x] Click "Download PDF"
- [ ] Enjoy your new document!

> "Markdown is a text-to-HTML conversion tool for web writers."
> — John Gruber
`;

export default function MarkdownToPdfClient() {
    const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
    const [isGenerating, setIsGenerating] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!previewRef.current) return;
        
        setIsGenerating(true);
        try {
            const element = previewRef.current;
            const opt = {
                margin:       [15, 15, 15, 15],
                filename:     'document.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <ToolPageWrapper
            title="Markdown to PDF"
            description="Write or paste Markdown text and export it as a styled PDF."
            icon={FileCode}
            color="cyan"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {/* Editor Column */}
                <div className="flex flex-col space-y-4">
                    <RetroCard className="flex-1 flex flex-col h-[600px] p-0 overflow-hidden" variant="cyan">
                        <div className="bg-[#22D3EE] border-b-2 border-black p-3 font-display flex items-center justify-between">
                            <span>Markdown Editor</span>
                            <button 
                                onClick={() => setMarkdown("")}
                                className="text-xs hover:underline flex items-center"
                            >
                                <RefreshCw className="w-3 h-3 mr-1" /> Clear
                            </button>
                        </div>
                        <textarea
                            className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm bg-white"
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="Type your markdown here..."
                        />
                    </RetroCard>
                    <RetroActionButton
                        label="Download PDF"
                        isProcessing={isGenerating}
                        processingText="Generating PDF..."
                        onClick={handleDownload}
                        color="cyan"
                        icon={<Download className="w-5 h-5" />}
                    />
                </div>

                {/* Preview Column */}
                <RetroCard className="flex-1 flex flex-col h-[600px] p-0 overflow-hidden" variant="default">
                    <div className="bg-[#E5E7EB] border-b-2 border-black p-3 font-display">
                        PDF Preview
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                        {/* The wrapper that will be converted to PDF */}
                        <div 
                            ref={previewRef}
                            className="prose prose-sm md:prose-base max-w-none bg-white p-8 border border-gray-200 shadow-sm min-h-full"
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                </RetroCard>
            </div>
        </ToolPageWrapper>
    );
}
