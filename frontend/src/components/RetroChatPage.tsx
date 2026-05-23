"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDropzone } from "react-dropzone";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import {
    MessageSquare, Upload, FileText, Send, Bot, User,
    Trash2, Download, Sparkles, Mic, StopCircle,
    BookOpen, ListChecks, HelpCircle, RotateCcw
} from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
    { icon: BookOpen, text: "Summarize this document", color: "bg-[#22D3EE]" },
    { icon: ListChecks, text: "List the key points", color: "bg-[#A78BFA]" },
    { icon: HelpCircle, text: "What is this about?", color: "bg-[#F472B6]" },
    { icon: Sparkles, text: "Main topics covered", color: "bg-[#A3E635]" },
];

const SK = "retro-pdf-chat-history";

export default function RetroChatPage() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfText, setPdfText] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [extracting, setExtracting] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [speakingId, setSpeakingId] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [tab, setTab] = useState<"chat" | "info">("chat");
    const endRef = useRef<HTMLDivElement>(null);

    /* ── PDF ─────────────────────────────────────────── */
    const extract = useCallback(async (file: File) => {
        setExtracting(true);
        try {
            const m: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
            const lib = m.default || m;
            if (typeof window !== "undefined") lib.GlobalWorkerOptions.workerSrc = window.location.origin + "/workers/pdf.worker.min.mjs";
            const pdf = await lib.getDocument(await file.arrayBuffer()).promise;
            setPageCount(pdf.numPages);
            let t = "";
            for (let i = 1; i <= pdf.numPages; i++) { const p = await pdf.getPage(i); const c = await p.getTextContent(); t += `\n--- Page ${i} ---\n${c.items.map((x: any) => x.str).join(" ")}`; }
            setPdfText(t);
        } catch { setError("Failed to read PDF."); } finally { setExtracting(false); }
    }, []);

    const onDrop = useCallback((f: File[]) => { if (f[0]) { setPdfFile(f[0]); setMessages([]); setError(null); extract(f[0]); } }, [extract]);

    useGlobalFileDrop({
        onFilesSelected: onDrop,
        accept: { "application/pdf": [".pdf"] },
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "application/pdf": [".pdf"] }, multiple: false });
    const reset = () => { setPdfFile(null); setPdfText(""); setPageCount(0); setMessages([]); setError(null); localStorage.removeItem(SK); };

    /* ── Chat ────────────────────────────────────────── */
    useEffect(() => { try { const s = localStorage.getItem(SK); if (s) setMessages(JSON.parse(s)); } catch { } }, []);
    useEffect(() => { if (messages.length) localStorage.setItem(SK, JSON.stringify(messages)); }, [messages]);
    useEffect(() => {
        const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        scrollToBottom();
        // Double check to handle any layout shifts or slow renders
        const t = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(t);
    }, [messages, isLoading]);

    const send = async (text: string) => {
        const u: Message = { id: Date.now().toString(), role: "user", content: text };
        const upd = [...messages, u]; setMessages(upd); setIsLoading(true); setError(null);
        try {
            const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: upd, context: pdfText }) });
            if (!r.ok) { let m = `Error ${r.status}`; try { const d = await r.json(); if (d.error) m = d.error; } catch { } throw new Error(m); }
            const d = await r.json();
            setMessages([...upd, { id: (Date.now() + 1).toString(), role: "assistant", content: d.content }]);
        } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
    };

    const onSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!input.trim() || isLoading) return; send(input); setInput(""); };

    /* ── Utils ───────────────────────────────────────── */
    const copy = async (t: string, id: string) => { await navigator.clipboard.writeText(t); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
    const speak = (t: string, id: string) => { if (speakingId === id) { speechSynthesis.cancel(); setSpeakingId(null); return; } speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.onend = () => setSpeakingId(null); setSpeakingId(id); speechSynthesis.speak(u); };
    const listen = () => { const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition; if (!SR) return; const r = new SR(); r.lang = "en-US"; r.onstart = () => setIsListening(true); r.onresult = (e: any) => { setInput(p => p + (p ? " " : "") + e.results[0][0].transcript); setIsListening(false); }; r.onerror = r.onend = () => setIsListening(false); r.start(); };
    const exprt = () => { const b = new Blob([messages.map(m => `${m.role === "user" ? "You" : "AI"}: ${m.content}`).join("\n\n---\n\n")], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `chat-${pdfFile?.name}.txt`; a.click(); };
    const clear = () => { setMessages([]); localStorage.removeItem(SK); };
    const fmtSize = (b: number) => b < 1024 ? b + "B" : b < 1048576 ? (b / 1024).toFixed(1) + "KB" : (b / 1048576).toFixed(1) + "MB";

    /* ═══════════════════════════════════════════════════
       UPLOAD — Bauhaus Poster
       ═══════════════════════════════════════════════════ */
    if (!pdfFile) return (
        <div className="w-full max-w-5xl mx-auto py-8 px-4">
            <div className="grid grid-cols-12 gap-0 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                {/* Left — Title Block */}
                <div className="col-span-12 md:col-span-5 bg-black text-white p-8 md:p-10 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-black min-h-[200px] md:min-h-[420px]">
                    <div>
                        <div className="flex gap-1.5 mb-6">
                            <span className="w-3 h-3 bg-[#22D3EE]" />
                            <span className="w-3 h-3 bg-[#A78BFA]" />
                            <span className="w-3 h-3 bg-[#F472B6]" />
                            <span className="w-3 h-3 bg-[#A3E635]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tighter leading-[0.9]">
                            Chat<br />with<br />PDF
                        </h1>
                    </div>
                    <div className="mt-8 space-y-2">
                        <p className="font-sans text-xs text-gray-400">Ask questions about any document using AI.</p>
                        <div className="flex gap-2 flex-wrap">
                            {["Private", "Free", "Instant"].map(t => (
                                <span key={t} className="px-2 py-0.5 border border-gray-600 text-[10px] font-display uppercase tracking-widest text-gray-400">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — Upload Zone */}
                <div className="col-span-12 md:col-span-7 bg-white flex flex-col">
                    {/* Color stripe */}
                    <div className="h-2 flex">
                        <div className="flex-1 bg-[#22D3EE]" />
                        <div className="flex-1 bg-[#A78BFA]" />
                        <div className="flex-1 bg-[#F472B6]" />
                        <div className="flex-1 bg-[#A3E635]" />
                    </div>

                    {/* Drop area */}
                    <div
                        {...getRootProps()}
                        className="flex-1 flex items-center justify-center p-10 cursor-pointer group"
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className={`relative p-6 border-2 border-black transition-all duration-300 ${isDragActive
                                ? "bg-[#A3E635] rotate-6 scale-110 shadow-none"
                                : "bg-[#FFFBE6] group-hover:bg-[#22D3EE] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-3"
                                }`}>
                                {isDragActive
                                    ? <Upload className="w-10 h-10 animate-bounce" />
                                    : <FileText className="w-10 h-10" />
                                }
                            </div>
                            <div>
                                <p className="font-display text-2xl uppercase tracking-tight">
                                    {isDragActive ? "Release to Upload" : "Select Your PDF"}
                                </p>
                                <p className="font-sans text-sm text-gray-400 mt-1">
                                    Drag & drop or click · Max 50MB
                                </p>
                            </div>

                            {/* Feature chips */}
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                {[
                                    { label: "Summarize", color: "bg-[#22D3EE]" },
                                    { label: "Key Points", color: "bg-[#A78BFA]" },
                                    { label: "Ask Q&A", color: "bg-[#F472B6]" },
                                    { label: "Analyze", color: "bg-[#A3E635]" },
                                ].map(c => (
                                    <span key={c.label} className={`${c.color} px-3 py-1 border-2 border-black text-[10px] font-display uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                                        {c.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ═══════════════════════════════════════════════════
       EXTRACTING
       ═══════════════════════════════════════════════════ */
    if (extracting) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="p-8 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <FileText className="w-14 h-14 text-[#22D3EE] animate-pulse" />
            </div>
            <h2 className="font-display text-3xl uppercase tracking-tight">Parsing...</h2>
            <p className="font-sans text-sm text-gray-400">{pdfFile.name}</p>
            <div className="flex gap-2">{["#22D3EE", "#A78BFA", "#F472B6", "#A3E635"].map((c, i) => <span key={i} className="w-3 h-3 border-2 border-black animate-bounce" style={{ background: c, animationDelay: `${i * 120}ms` }} />)}</div>
        </div>
    );

    /* ═══════════════════════════════════════════════════
       CHAT — Tabbed Full-Page
       ═══════════════════════════════════════════════════ */
    return (
        <div className="w-full max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">

            {/* ── Tab Header ──────────────────────────────── */}
            <div className="flex border-2 border-black bg-[#FFFBE6] shrink-0">
                <button onClick={() => setTab("chat")} className={`flex-1 flex items-center justify-center gap-2 py-3 font-display text-sm uppercase tracking-widest border-r-2 border-black transition-colors ${tab === "chat" ? "bg-[#22D3EE]" : "bg-[#FFFBE6] hover:bg-gray-100"}`}>
                    <MessageSquare className="w-4 h-4" /> Chat
                </button>
                <button onClick={() => setTab("info")} className={`flex-1 flex items-center justify-center gap-2 py-3 font-display text-sm uppercase tracking-widest transition-colors ${tab === "info" ? "bg-[#A78BFA]" : "bg-[#FFFBE6] hover:bg-gray-100"}`}>
                    <FileText className="w-4 h-4" /> Document
                </button>
            </div>

            {/* ── Tab: Document Info ──────────────────────── */}
            {tab === "info" && (
                <div className="flex-1 overflow-y-auto border-2 border-t-0 border-black bg-white p-8 space-y-6">
                    <div className="p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#FFFBE6]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-[#22D3EE] border-2 border-black"><FileText className="w-6 h-6" /></div>
                            <div>
                                <p className="font-display text-lg uppercase truncate max-w-sm">{pdfFile.name}</p>
                                <p className="text-xs text-gray-400 font-sans">{pageCount} pages · {fmtSize(pdfFile.size)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-white border-2 border-black text-center">
                                <p className="font-display text-3xl">{pageCount}</p>
                                <p className="text-[9px] font-display uppercase tracking-widest text-gray-400">Pages</p>
                            </div>
                            <div className="p-4 bg-white border-2 border-black text-center">
                                <p className="font-display text-3xl">{fmtSize(pdfFile.size)}</p>
                                <p className="text-[9px] font-display uppercase tracking-widest text-gray-400">File Size</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="font-display text-xs uppercase tracking-widest text-gray-400">Quick Actions</p>
                        <div className="grid grid-cols-2 gap-3">
                            {SUGGESTIONS.map(q => (
                                <button key={q.text} onClick={() => { send(q.text); setTab("chat"); }} disabled={isLoading}
                                    className={`flex items-center gap-3 p-4 border-2 border-black bg-white hover:${q.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-left disabled:opacity-50`}>
                                    <div className={`p-1.5 ${q.color} border-2 border-black shrink-0`}><q.icon className="w-4 h-4" /></div>
                                    <span className="font-sans text-xs">{q.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={exprt} className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-black bg-[#22D3EE] hover:brightness-105 font-display text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"><Download className="w-3.5 h-3.5" /> Export</button>
                        <button onClick={clear} className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-black bg-[#F472B6] hover:brightness-105 font-display text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"><Trash2 className="w-3.5 h-3.5" /> Clear</button>
                        <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-black bg-[#A78BFA] hover:brightness-105 font-display text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"><RotateCcw className="w-3.5 h-3.5" /> New PDF</button>
                    </div>
                </div>
            )}

            {/* ── Tab: Chat ──────────────────────────────── */}
            {tab === "chat" && (
                <div className="flex-1 flex flex-col border-2 border-t-0 border-black bg-white min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FFFBE6]/30 min-h-0">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center gap-6">
                                <div className="text-center space-y-3">
                                    <div className="mx-auto w-14 h-14 bg-[#A78BFA]/20 border-2 border-dashed border-black flex items-center justify-center">
                                        <Bot className="w-7 h-7 text-[#A78BFA]" />
                                    </div>
                                    <p className="font-display text-xl uppercase tracking-tight">Ready</p>
                                    <p className="font-sans text-sm text-gray-400 max-w-xs mx-auto">All {pageCount} pages loaded. Type below or pick a quick action.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                                    {SUGGESTIONS.map(q => (
                                        <button key={q.text} onClick={() => send(q.text)}
                                            className="flex items-center gap-2 p-3 border-2 border-black bg-white hover:bg-[#22D3EE]/10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-left">
                                            <div className={`p-1 ${q.color} border border-black shrink-0`}><q.icon className="w-3 h-3" /></div>
                                            <span className="font-sans text-xs">{q.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map(m => (
                            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                                <div className={`w-9 h-9 border-2 border-black shrink-0 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${m.role === "user" ? "bg-[#22D3EE]" : "bg-[#A78BFA]"}`}>
                                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`flex flex-col gap-1.5 max-w-[80%] ${m.role === "user" ? "items-end" : ""}`}>
                                    <div className={`px-4 py-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${m.role === "user" ? "bg-[#22D3EE]" : "bg-white"}`}>
                                        {m.role === "assistant" ? (
                                            <div className="prose prose-sm max-w-none text-black font-sans leading-relaxed prose-p:my-1.5 prose-ul:my-1.5 prose-headings:text-black prose-headings:font-display prose-strong:text-black">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                                            </div>
                                        ) : <p className="font-sans text-sm">{m.content}</p>}
                                    </div>
                                    {m.role === "assistant" && (
                                        <div className="flex gap-1">
                                            <button onClick={() => copy(m.content, m.id)} className="px-2 py-0.5 text-[9px] font-display border border-black bg-white hover:bg-[#A3E635] transition-colors uppercase tracking-widest">{copiedId === m.id ? "Done" : "Copy"}</button>
                                            <button onClick={() => speak(m.content, m.id)} className={`px-2 py-0.5 text-[9px] font-display border border-black uppercase tracking-widest transition-colors ${speakingId === m.id ? "bg-[#F472B6]" : "bg-white hover:bg-[#A78BFA]"}`}>{speakingId === m.id ? "Stop" : "Read"}</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {error && <div className="p-3 bg-[#F87171]/20 border-2 border-[#F87171] text-sm font-sans">⚠️ {error}</div>}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-9 h-9 border-2 border-black bg-[#A78BFA] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Bot className="w-4 h-4" /></div>
                                <div className="px-4 py-3 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                                    {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 bg-[#22D3EE] border border-black animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                                    <span className="text-xs text-gray-400 font-display ml-1">Thinking</span>
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    <form onSubmit={onSubmit} className="p-4 border-t-2 border-black bg-white flex gap-3 shrink-0">
                        <div className="flex-1 relative">
                            <input value={input} onChange={e => setInput(e.target.value)} placeholder={isListening ? "Listening..." : "Ask about your PDF..."} disabled={isLoading}
                                className={`w-full bg-[#FFFBE6] border-2 border-black px-4 py-3 pr-11 font-sans text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] outline-none transition-all placeholder-gray-300 ${isListening ? "border-[#F87171]" : ""}`} />
                            <button type="button" onClick={listen} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 border border-black ${isListening ? "bg-[#F87171] animate-pulse" : "bg-white hover:bg-[#A78BFA]"}`}>
                                {isListening ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                        </div>
                        <button type="submit" disabled={isLoading || !input.trim()} className="px-5 py-3 bg-[#22D3EE] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50 shrink-0">
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
