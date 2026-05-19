import React from "react";
import { Search, X } from "lucide-react";
import { RetroButton } from "@/components/RetroButton";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    totalResults: number;
    placeholderText: string;
    searchRef?: React.RefObject<HTMLInputElement | null>;
}


export const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    setSearchQuery,
    totalResults,
    placeholderText,
    searchRef
}) => {
    // We need to handle the updateSearch logic here or pass it down.
    // In HomePage it was: updateSearch(value).
    // Let's just use setSearchQuery for now, or maybe passing updateSearch is better if it does URL sync.
    // Actually, the parent handles URL sync in updateSearch.

    return (
        <div className="max-w-lg mx-auto group relative z-20">
            <div className="relative flex items-center bg-white border-3 border-black 
                            shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
                            transition-all duration-300 focus-within:translate-x-[2px] focus-within:translate-y-[2px] 
                            focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">

                <div className="pl-5 flex items-center pointer-events-none">
                    <Search className={`w-6 h-6 transition-colors duration-300 ${searchQuery ? "text-black" : "text-gray-400"}`} strokeWidth={3} />
                </div>

                <input
                    ref={searchRef}
                    type="text"
                    placeholder={placeholderText}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search PDF tools"
                    role="searchbox"
                    className="w-full px-4 py-3 font-display font-bold text-lg placeholder:text-gray-300 text-black bg-transparent border-none focus:outline-none focus:ring-0 uppercase tracking-wide"
                />

                <div className="pr-2 flex items-center gap-2">
                    {searchQuery ? (
                        <>
                            <span className="hidden sm:inline-block font-mono text-xs font-bold bg-[#A3E635] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {totalResults} FOUND
                            </span>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 rounded-sm"
                                aria-label="Clear search"
                            >
                                <X className="w-5 h-5 text-black" strokeWidth={3} />
                            </button>
                        </>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2 pr-2">
                            <RetroButton
                                label="SEARCH"
                                className="!px-4 !py-1 !text-sm pointer-events-none"
                                variant="pink"
                                tabIndex={-1}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
