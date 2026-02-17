
import React, { memo, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Star, Clock } from "lucide-react";
import { RETRO_COLORS } from "@/config/design";
import { type Tool } from "@/config/tools";

// Global set to track which cards have already animated in this session
const animatedCards = new Set<string>();

export interface ToolCardProps {
    tool: Tool;
    isFav: boolean;
    onToggleFav: (e: React.MouseEvent, href: string) => void;
    onToolClick: (href: string) => void;
    variant?: "default" | "favorite" | "popular";
    className?: string; // For additional styling if needed
    tabIndex?: number;
    // Navigation props
    onGridKeyDown?: (e: React.KeyboardEvent, tools: Tool[], index: number) => void;
    gridTools?: Tool[];
    gridIndex?: number;
    sectionColor?: string;
    id?: string;
}

export const ToolCard = memo(({ tool, isFav, onToggleFav, onToolClick, onGridKeyDown, gridTools, gridIndex, variant = "default", tabIndex, sectionColor, id }: ToolCardProps) => {
    const ToolIcon = tool.icon;
    // Fallback to tool.sectionColor if prop is not provided
    const colorKey = (sectionColor || (tool as any).sectionColor) as keyof typeof RETRO_COLORS;
    const colors = RETRO_COLORS[colorKey] || RETRO_COLORS.default;
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isVisible] = useState(true); // Always visible

    // Check if this card is the target of the hash and scroll to it
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const hashId = window.location.hash.substring(1);
            // Match against the ID we use (which is tool.href stripped of leading /)
            const myId = tool.href.replace(/^\//, "");

            if (hashId === myId && cardRef.current) {
                // We are the target!
                setTimeout(() => {
                    const element = document.getElementById(myId) || cardRef.current;
                    if (!element) return;

                    const SCROLL_OFFSET = 140;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - SCROLL_OFFSET;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }, 300); // Slight delay to allow layout to settle
            }
        }
    }, [tool.href]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (onGridKeyDown && gridTools && typeof gridIndex === 'number') {
            onGridKeyDown(e, gridTools, gridIndex);
        }
    };

    if (tool.disabled) {
        return (
            <div className="h-full" aria-disabled="true">
                <div className="group flex flex-col gap-2 p-4 bg-gray-50 border-2 border-dashed border-gray-300 h-full opacity-60 cursor-not-allowed text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2 border-2 border-gray-300 bg-gray-100 shrink-0">
                            <ToolIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-display text-lg tracking-wide text-gray-500">{tool.name}</span>
                        <span className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-yellow-100 border border-yellow-400 text-yellow-700 text-xs font-display shrink-0" role="status">
                            <Clock className="w-3 h-3" /> Coming Soon
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 font-sans leading-relaxed">{tool.description}</p>
                </div>
            </div>
        );
    }

    let favBtnClass = "p-1 hover:scale-125 transition-transform";
    // For default variant: button is hidden (opacity-0) until hover, UNLESS it's a favorite.
    if (variant === "default") {
        favBtnClass += " opacity-0 group-hover:opacity-100 focus:opacity-100";
        if (isFav) {
            favBtnClass += " !opacity-100";
        }
    }

    return (
        <div id={id} className="h-full relative hover:z-10 isolate">
            <div
                className={`group flex flex-col gap-3 p-6 bg-white border-2 border-black h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                           hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-[box-shadow,translate,opacity] duration-200 cursor-pointer text-left`}
            >
                {/* Main Link Overlay */}
                <Link
                    ref={cardRef}
                    href={tool.href}
                    onClick={() => {
                        onToolClick(tool.href);
                    }}
                    data-tool-card
                    tabIndex={tabIndex}
                    onKeyDown={handleKeyDown}
                    className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                    aria-label={tool.name}
                >
                    <span className="sr-only">Go to {tool.name}</span>
                </Link>

                {/* Content - pointer-events-none to let clicks pass to the link */}
                <div className="flex items-center gap-3 relative z-10 pointer-events-none">
                    <div className={`p-2 border-2 border-black transition-colors shrink-0 ${colors.bg}`}>
                        <ToolIcon className="w-5 h-5" />
                    </div>
                    <span className="font-display text-lg tracking-wide group-hover:translate-x-1 transition-transform">{tool.name}</span>

                    <div className="ml-auto flex items-center gap-1 shrink-0 relative z-20 pointer-events-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFav(e, tool.href);
                            }}
                            className={`${favBtnClass} relative z-30 cursor-pointer`}
                            aria-label={`${isFav ? "Remove from" : "Add to"} favorites`}
                        >
                            <Heart className={`w-4 h-4 ${isFav ? "text-pink-500 fill-pink-500" : "text-gray-300 hover:text-pink-400"}`} />
                        </button>

                        {variant === "popular" && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" aria-label="Popular" />
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-600 font-sans leading-relaxed group-hover:text-black transition-colors relative z-10 pointer-events-none">{tool.description}</p>
            </div>
        </div>
    );
});

ToolCard.displayName = "ToolCard";
