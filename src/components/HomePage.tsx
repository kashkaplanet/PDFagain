import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Star, Heart } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { sections, popularTools, type Tool } from "@/config/tools";
import { HeroSection } from "@/components/home/HeroSection";
import { ToolGrid } from "@/components/home/ToolGrid";

// LocalStorage keys
const RECENT_KEY = "pdfagain_recent_tools";
const FAVORITES_KEY = "pdfagain_favorite_tools";
const MAX_RECENT = 5;
const PLACEHOLDERS = [
    "Search tools...",
    "Try 'Merge PDF'...",
    "Search 'Compress'...",
    "Find 'Converter'...",
    "Try 'Split PDF'...",
    "Search 'OCR'..."
];

export default function HomePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    // Use custom hook for persistent state
    const [recentHrefs, setRecentHrefs] = useLocalStorage<string[]>(RECENT_KEY, []);
    const [favoriteHrefs, setFavoriteHrefs] = useLocalStorage<string[]>(FAVORITES_KEY, []);

    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [placeholderText, setPlaceholderText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    // Typewriter effect
    useEffect(() => {
        const handleTyping = () => {
            const current = PLACEHOLDERS[placeholderIndex];
            const isFull = !isDeleting && placeholderText === current;
            const isEmpty = isDeleting && placeholderText === "";

            if (isFull) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isEmpty) {
                setIsDeleting(false);
                setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
            } else {
                setPlaceholderText(current.substring(0, placeholderText.length + (isDeleting ? -1 : 1)));
                setTypingSpeed(isDeleting ? 50 : 100);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [placeholderText, isDeleting, placeholderIndex, typingSpeed]);




    // Keyboard shortcut: / or Ctrl+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                searchRef.current?.focus();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    // Handle hash scrolling on load with robust polling
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.substring(1);
            if (!id) return;

            const startTime = Date.now();
            const maxDuration = 2000; // 2 seconds timeout to find the element

            // Offset for sticky header/search bar
            const SCROLL_OFFSET = 140;

            const checkAndScroll = () => {
                const element = document.getElementById(id);
                if (element) {
                    // Element found! Wait a tick to ensure layout is stable
                    setTimeout(() => {
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - SCROLL_OFFSET;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });


                    }, 100);
                } else if (Date.now() - startTime < maxDuration) {
                    // Not found yet, keep polling
                    requestAnimationFrame(checkAndScroll);
                }
            };

            // Start polling
            checkAndScroll();
        }
    }, []);

    // URL sync
    const updateSearch = useCallback((value: string) => {
        setSearchQuery(value);
        const params = new URLSearchParams(window.location.search);
        if (value.trim()) params.set("q", value); else params.delete("q");
        router.replace(params.toString() ? `?${params.toString()}` : "/", { scroll: false });
    }, [router]);

    const activeSections = useMemo(() => sections.map(section => ({
        ...section,
        tools: section.tools.filter(tool => !tool.disabled)
    })).filter(section => section.tools.length > 0), []);

    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return activeSections;
        const q = searchQuery.toLowerCase();
        return activeSections
            .map(section => ({
                ...section,
                tools: section.tools.filter(
                    tool => tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)
                )
            }))
            .filter(section => section.tools.length > 0);
    }, [searchQuery, activeSections]);

    const totalResults = filteredSections.reduce((sum, s) => sum + s.tools.length, 0);

    // Resolve hrefs to tool objects
    const allToolsFlat = useMemo(() => activeSections.flatMap(s => s.tools.map(t => ({ ...t, sectionColor: s.color }))), [activeSections]);
    const recentTools = useMemo(() => recentHrefs.map(h => allToolsFlat.find(t => t.href === h)).filter(Boolean) as typeof allToolsFlat, [recentHrefs, allToolsFlat]);
    const favoriteTools = useMemo(() => favoriteHrefs.map(h => allToolsFlat.find(t => t.href === h)).filter(Boolean) as typeof allToolsFlat, [favoriteHrefs, allToolsFlat]);

    const handleToolClick = useCallback((href: string) => {
        // Update the current history entry with the tool's hash ID
        // This ensures that when the user clicks "Back", they return to this specific spot
        const toolId = href.replace(/^\//, "");
        window.history.replaceState(null, "", `#${toolId}`);

        setRecentHrefs(prev => {
            const recent = prev.filter(h => h !== href);
            recent.unshift(href);
            return recent.slice(0, MAX_RECENT);
        });
    }, [setRecentHrefs]);

    const handleToggleFav = useCallback((e: React.MouseEvent, href: string) => {
        e.preventDefault();
        e.stopPropagation();
        setFavoriteHrefs(prev => {
            const favs = [...prev];
            const idx = favs.indexOf(href);
            if (idx >= 0) {
                favs.splice(idx, 1);
            } else {
                favs.push(href);
            }
            return favs;
        });
    }, [setFavoriteHrefs]);

    const toggleCollapse = (title: string) => {
        setCollapsedSections(prev => {
            const next = new Set(prev);
            if (next.has(title)) next.delete(title); else next.add(title);
            return next;
        });
    };

    // Keyboard grid navigation - Stable callback
    const handleGridKeyDown = useCallback((e: React.KeyboardEvent, tools: Tool[], index: number) => {
        const cols = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        let next = -1;
        if (e.key === "ArrowRight") next = Math.min(index + 1, tools.length - 1);
        if (e.key === "ArrowLeft") next = Math.max(index - 1, 0);
        if (e.key === "ArrowDown") next = Math.min(index + cols, tools.length - 1);
        if (e.key === "ArrowUp") next = Math.max(index - cols, 0);
        if (next >= 0 && next !== index) {
            e.preventDefault();
            const grid = (e.currentTarget as HTMLElement).closest("[data-grid]");
            const cards = grid?.querySelectorAll<HTMLElement>("[data-tool-card]");
            cards?.[next]?.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto gap-20 pt-4 relative">



            {/* Hero Section */}
            <div ref={heroRef} className="w-full">
                <HeroSection
                    searchQuery={searchQuery}
                    setSearchQuery={updateSearch}
                    totalResults={totalResults}
                    placeholderText={placeholderText}
                    searchRef={searchRef}
                    recentTools={recentTools}
                    clearRecentTools={() => setRecentHrefs([])}
                    handleToolClick={handleToolClick}
                />
            </div>

            {/* Divider */}
            <div className="w-full flex items-center gap-4" aria-hidden="true">
                <div className="flex-1 h-1 bg-black" />
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-[#F472B6] border-2 border-black" />
                    <div className="w-3 h-3 bg-[#22D3EE] border-2 border-black" />
                    <div className="w-3 h-3 bg-[#A3E635] border-2 border-black" />
                </div>
                <div className="flex-1 h-1 bg-black" />
            </div>

            {/* My Favorites */}
            {
                !searchQuery && favoriteTools.length > 0 && (
                    <section className="w-full space-y-8" aria-label="Favorite tools">
                        <div className="flex items-center gap-4">
                            <div className="p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#F472B6] hover:rotate-6 hover:scale-110 transition-transform duration-300">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wide">MY FAVORITES</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-grid>
                            {favoriteTools.map((tool, i) => (
                                <ToolCard
                                    key={tool.href}
                                    tool={tool}
                                    isFav={true}
                                    onToggleFav={handleToggleFav}
                                    onToolClick={handleToolClick}
                                    variant="favorite"
                                    gridTools={favoriteTools}
                                    gridIndex={i}
                                    onGridKeyDown={handleGridKeyDown}
                                    sectionColor={tool.sectionColor}
                                />
                            ))}
                        </div>
                    </section>
                )
            }

            {/* Most Popular */}
            {
                !searchQuery && (
                    <section className="w-full space-y-8" aria-label="Most popular tools">
                        <div className="flex items-center gap-4">
                            <div className="p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#FBBF24] hover:rotate-6 hover:scale-110 transition-transform duration-300">
                                <Star className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wide">MOST POPULAR</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-grid>
                            {popularTools.map((tool, i) => (
                                <ToolCard
                                    key={tool.name}
                                    tool={tool}
                                    isFav={favoriteHrefs.includes(tool.href)}
                                    onToggleFav={handleToggleFav}
                                    onToolClick={handleToolClick}
                                    variant="popular"
                                    gridTools={popularTools as Tool[]}
                                    gridIndex={i}
                                    onGridKeyDown={handleGridKeyDown}
                                    sectionColor={allToolsFlat.find(t => t.href === tool.href)?.sectionColor}
                                />
                            ))}
                        </div>
                    </section>
                )
            }

            {/* Empty State */}
            {
                searchQuery && totalResults === 0 && (
                    <div className="w-full text-center py-16 space-y-4" role="status" aria-live="polite">
                        <div className="inline-flex p-4 border-2 border-dashed border-gray-300 mb-2">
                            <Search className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-display text-gray-400">No tools found</h3>
                        <p className="text-gray-500 font-sans">
                            No results for &ldquo;<span className="font-bold text-black">{searchQuery}</span>&rdquo;
                        </p>
                        <button onClick={() => updateSearch("")}
                            className="mt-2 px-4 py-2 bg-white border-2 border-black font-display text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                   hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
                            Clear Search
                        </button>
                    </div>
                )
            }

            {/* Tool Sections */}
            <ToolGrid
                filteredSections={filteredSections}
                collapsedSections={collapsedSections}
                toggleCollapse={toggleCollapse}
                favoriteHrefs={favoriteHrefs}
                handleToggleFav={handleToggleFav}
                handleToolClick={handleToolClick}
                handleGridKeyDown={handleGridKeyDown}
            />
        </div >
    );
}
