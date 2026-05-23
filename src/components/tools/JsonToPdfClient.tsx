"use client";

import React, { useState, useRef, useEffect } from "react";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Braces, Download, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import html2pdf from "html2pdf.js";

const DEFAULT_JSON = `{
  "document": {
    "title": "Welcome to JSON to PDF",
    "version": 1.0,
    "features": [
      "Client-side processing",
      "Auto-formatting",
      "Clean syntax output"
    ],
    "settings": {
      "theme": "light",
      "fontSize": 14,
      "isValid": true
    }
  }
}`;

export default function JsonToPdfClient() {
    const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
    const [parsedJson, setParsedJson] = useState<string>("");
    const [isValid, setIsValid] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // Auto-format and validate JSON as they type
    useEffect(() => {
        if (!jsonInput.trim()) {
            setParsedJson("");
            setIsValid(true);
            return;
        }
        try {
            const parsed = JSON.parse(jsonInput);
            setParsedJson(JSON.stringify(parsed, null, 2));
            setIsValid(true);
        } catch (e) {
            setIsValid(false);
            // Leave parsedJson as is so the preview doesn't jump, 
            // but the user gets the error indicator.
        }
    }, [jsonInput]);

    const handleFormat = () => {
        if (isValid && parsedJson) {
            setJsonInput(parsedJson);
        }
    };

    const handleDownload = async () => {
        if (!previewRef.current || !isValid) return;
        
        setIsGenerating(true);
        try {
            const element = previewRef.current;
            const opt = {
                margin:       [15, 15, 15, 15],
                filename:     'data-export.pdf',
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
            title="JSON to PDF"
            description="Format raw JSON data into a clean, readable PDF document."
            icon={Braces}
            color="cyan"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {/* Editor Column */}
                <div className="flex flex-col space-y-4">
                    <RetroCard className="flex-1 flex flex-col h-[600px] p-0 overflow-hidden" variant="cyan">
                        <div className="bg-[#22D3EE] border-b-2 border-black p-3 font-display flex items-center justify-between">
                            <span>Raw JSON Input</span>
                            <div className="flex space-x-4">
                                <button 
                                    onClick={handleFormat}
                                    disabled={!isValid}
                                    className="text-xs hover:underline flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className="w-3 h-3 mr-1" /> Format
                                </button>
                                <button 
                                    onClick={() => setJsonInput("")}
                                    className="text-xs hover:underline flex items-center"
                                >
                                    <FileXIcon className="w-3 h-3 mr-1" /> Clear
                                </button>
                            </div>
                        </div>
                        <textarea
                            className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm bg-[#1E293B] text-green-400"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            spellCheck={false}
                            placeholder="Paste your JSON here..."
                        />
                        <div className={`p-2 border-t-2 border-black font-sans text-sm flex items-center \${isValid ? 'bg-[#A3E635]' : 'bg-[#F87171] text-white'}`}>
                            {isValid ? (
                                <><CheckCircle className="w-4 h-4 mr-2" /> Valid JSON</>
                            ) : (
                                <><AlertTriangle className="w-4 h-4 mr-2" /> Invalid JSON Format</>
                            )}
                        </div>
                    </RetroCard>
                    <RetroActionButton
                        label="Download PDF"
                        isProcessing={isGenerating}
                        processingText="Generating PDF..."
                        onClick={handleDownload}
                        disabled={!isValid || !jsonInput.trim()}
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
                            className="bg-white p-8 border border-gray-200 shadow-sm min-h-full"
                        >
                            <pre className="font-mono text-sm whitespace-pre-wrap break-words text-gray-800">
                                {parsedJson || "{}"}
                            </pre>
                        </div>
                    </div>
                </RetroCard>
            </div>
        </ToolPageWrapper>
    );
}

// Inline component just for the clear button to avoid extra imports if missed
function FileXIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="m9.5 12.5 5 5" />
            <path d="m14.5 12.5-5 5" />
        </svg>
    )
}
