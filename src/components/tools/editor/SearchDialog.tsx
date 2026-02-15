import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronUp, ChevronDown, X, Loader2 } from 'lucide-react';
import type { PDFDocumentProxy } from "pdfjs-dist";

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    pdfProxy: PDFDocumentProxy | null;
    onNavigate: (pageIndex: number) => void;
}

interface SearchResult {
    pageIndex: number;
    text: string;
    // We strictly can't get exact coordinates without complex layout analysis again, 
    // so we'll just jump to the page for now.
}

export function SearchDialog({ isOpen, onClose, pdfProxy, onNavigate }: SearchDialogProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSearch = async () => {
        if (!query.trim() || !pdfProxy) return;

        setIsSearching(true);
        setResults([]);
        setCurrentResultIndex(-1);

        try {
            const found: SearchResult[] = [];
            const numPages = pdfProxy.numPages;

            // Search through all pages
            // Optimally we should chunk this or use a worker, but for < 50 pages it's fine
            for (let i = 1; i <= numPages; i++) {
                const page = await pdfProxy.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');

                if (pageText.toLowerCase().includes(query.toLowerCase())) {
                    found.push({
                        pageIndex: i - 1,
                        text: pageText.substring(0, 100) + "..." // Preview
                    });
                }
            }

            setResults(found);
            if (found.length > 0) {
                setCurrentResultIndex(0);
                onNavigate(found[0].pageIndex);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const nextResult = () => {
        if (results.length === 0) return;
        const newIndex = (currentResultIndex + 1) % results.length;
        setCurrentResultIndex(newIndex);
        onNavigate(results[newIndex].pageIndex);
    };

    const prevResult = () => {
        if (results.length === 0) return;
        const newIndex = (currentResultIndex - 1 + results.length) % results.length;
        setCurrentResultIndex(newIndex);
        onNavigate(results[newIndex].pageIndex);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-20 right-8 z-[90] w-80 bg-[#252526] border border-white/10 rounded-xl shadow-2xl p-4 animate-in slide-in-from-right-10 fade-in duration-200">
            <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-200">Find in Document</span>
                <button onClick={onClose} className="ml-auto text-zinc-500 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search text..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button
                    onClick={handleSearch}
                    disabled={isSearching || !query.trim()}
                    className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find'}
                </button>
            </div>

            {results.length > 0 && (
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                        {currentResultIndex + 1} of {results.length} matches
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={prevResult}
                            className="p-1 hover:bg-white/10 rounded-md text-zinc-300 transition-colors"
                            title="Previous Match"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextResult}
                            className="p-1 hover:bg-white/10 rounded-md text-zinc-300 transition-colors"
                            title="Next Match"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {results.length === 0 && query && !isSearching && (
                <div className="mt-3 text-xs text-zinc-500 text-center">
                    No matches found
                </div>
            )}
        </div>
    );
}
