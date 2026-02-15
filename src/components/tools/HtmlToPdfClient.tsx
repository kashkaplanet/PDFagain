"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroCard } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Globe, ExternalLink, Loader2 } from "lucide-react";

export default function HtmlToPdfClient() {
    const [url, setUrl] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (!url.trim()) return;

        setIsProcessing(true);
        try {
            // const html2pdf = (await import('html2pdf.js')).default;
            throw new Error("HTML to PDF conversion is currently disabled.");

            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.width = '1200px';
            iframe.style.height = '800px';
            document.body.appendChild(iframe);

            try {
                const response = await fetch(url.startsWith('http') ? url : `https://${url}`);
                const html = await response.text();

                const container = document.createElement('div');
                container.innerHTML = html;
                container.style.width = '800px';
                container.style.padding = '20px';
                container.style.background = 'white';
                document.body.appendChild(container);

                // const opt = {
                //     margin: 10,
                //     filename: 'webpage.pdf',
                //     image: { type: 'jpeg' as const, quality: 0.98 },
                //     html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
                // };

                // await html2pdf().set(opt as any).from(container).save();

                document.body.removeChild(container);
            } catch {
                setError("Unable to fetch this URL. Due to browser security restrictions, some websites cannot be converted.");
            }

            document.body.removeChild(iframe);

        } catch (err) {
            console.error("Failed to convert HTML to PDF:", err);
            setError("Failed to convert webpage to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFilesSelected = async (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === "text/html" || file.name.endsWith(".html") || file.name.endsWith(".htm")) {
                const text = await file.text();
                processHtml(text);
            }
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFilesSelected,
        accept: { "text/html": [".html", ".htm"] },
    });

    const processHtml = async (html: string) => {
        if (!html) return;

        setIsProcessing(true);
        try {
            // const html2pdf = (await import('html2pdf.js')).default;
            throw new Error("HTML to PDF conversion is currently disabled.");

            const container = document.createElement('div');
            container.innerHTML = html || "";
            container.style.width = '800px';
            if (container.style) {
                container.style.padding = '20px';
                container.style.background = 'white';
            }
            document.body.appendChild(container);

            // const opt = {
            //     margin: 10,
            //     filename: 'html-content.pdf',
            //     image: { type: 'jpeg' as const, quality: 0.98 },
            //     html2canvas: { scale: 2, useCORS: true },
            //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            // };

            // await html2pdf().set(opt as any).from(container).save();

            document.body.removeChild(container);
        } catch (err) {
            console.error("Failed to convert HTML to PDF:", err);
            setError("Failed to convert HTML to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePasteHtml = async () => {
        const html = prompt("Paste your HTML content here:");
        if (!html) return;
        processHtml(html);
    };

    return (
        <ToolPageWrapper
            title="HTML to PDF"
            description="Convert web pages or HTML content to PDF format."
            icon={Globe}
            color="cyan"
        >
            <RetroCard className="max-w-xl mx-auto">
                <div className="flex items-center space-x-4 mb-6 p-4 bg-[#22D3EE]/10 border-2 border-black">
                    <div className="p-3 bg-[#22D3EE] border-2 border-black">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-display">
                            Enter URL or paste HTML
                        </h2>
                        <p className="text-sm text-gray-600 font-sans">
                            Convert any webpage or HTML content
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-display mb-2">
                        Website URL
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 px-4 py-3 border-2 border-black focus:ring-2 focus:ring-[#22D3EE] outline-none font-sans"
                        />
                        <button
                            onClick={handleConvert}
                            disabled={isProcessing || !url.trim()}
                            className="px-4 py-3 bg-[#22D3EE] border-2 border-black font-display transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <ExternalLink className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-black"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white font-display">or</span>
                    </div>
                </div>

                <button
                    onClick={handlePasteHtml}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center h-12 bg-white border-2 border-black hover:bg-gray-100 font-display transition-all disabled:opacity-50"
                >
                    Paste HTML Content
                </button>

                <div className="mt-6 p-4 bg-[#FB923C]/10 border-2 border-[#FB923C] text-sm font-sans">
                    <strong>Note:</strong> Due to browser security restrictions (CORS), some websites cannot be directly converted. For best results, use the &quot;Paste HTML&quot; option.
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans">
                        {error}
                    </div>
                )}
            </RetroCard>
        </ToolPageWrapper>
    );
}
