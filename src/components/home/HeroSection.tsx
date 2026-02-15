import React from "react";
import { MessageSquare, History } from "lucide-react";
import { RetroButton } from "@/components/RetroButton";
import { features, sections, Tool } from "@/config/tools";
import { RETRO_COLORS } from "@/config/design";
import { SearchBar } from "./SearchBar";

interface HeroSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    totalResults: number;
    placeholderText: string;
    searchRef: React.RefObject<HTMLInputElement | null>;
    recentTools: (Tool & { sectionColor?: string })[];
    clearRecentTools: () => void;
    handleToolClick: (href: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
    searchQuery,
    setSearchQuery,
    totalResults,
    placeholderText,
    searchRef,
    recentTools,
    clearRecentTools,
    handleToolClick
}) => {
    return (
        <section className="text-center space-y-10 relative z-10">
            <div className="relative">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display tracking-tight relative w-full mx-auto leading-none">
                    100% Free AI-Powered PDF Tools
                </h1>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
                {features.map((feature) => (
                    <div key={feature.text} className={`${feature.color} px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 font-display text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 cursor-default`}>
                        <feature.icon className="w-4 h-4" />
                        {feature.text}
                    </div>
                ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
                <RetroButton label="Try PDFagain" variant="pink" href="#organize-pdf" className="text-xl px-8 py-4" />
                <RetroButton
                    label="Chat with PDF"
                    variant="cyan"
                    href="/chat"
                    icon={MessageSquare}
                    className="text-xl px-8 py-4"
                />
            </div>

            {/* Search Bar (inline) */}
            <div>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    totalResults={totalResults}
                    placeholderText={placeholderText}
                    searchRef={searchRef}
                />
            </div>

            {/* Recently Used */}
            {
                !searchQuery && recentTools.length > 0 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 max-w-3xl mx-auto">
                        <span className="flex items-center gap-1 text-xs font-display text-gray-400 mr-1">
                            <History className="w-3 h-3" /> Recent:
                            <button
                                onClick={clearRecentTools}
                                className="ml-1 hover:text-red-500 transition-colors"
                                aria-label="Clear recent tools"
                                title="Clear recent"
                            >
                                (Clear)
                            </button>
                        </span>
                        {recentTools.map((tool) => {
                            const colors = RETRO_COLORS[tool.sectionColor as keyof typeof RETRO_COLORS] || RETRO_COLORS.default;
                            return (
                                <a key={tool.href} href={tool.href} onClick={() => handleToolClick(tool.href)}
                                    className={`px-3 py-1 text-xs font-display border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                               hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]
                                               transition-all duration-150 ${colors.bg}`}>
                                    {tool.name}
                                </a>
                            );
                        })}
                    </div>
                )
            }

            {/* Quick Navigation Pills */}
            {
                !searchQuery && (
                    <nav aria-label="Tool categories" className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                        {sections.map((section) => {
                            const activeCount = section.tools.filter(t => !t.disabled).length;
                            return (
                                <a key={section.title} href={`#${section.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                                    className="px-4 py-2 bg-white border-2 border-black font-display text-sm tracking-wide 
                                               shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                               hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-2 duration-200">
                                    <section.icon className="w-4 h-4" />
                                    {section.title}
                                    <span className="text-xs bg-gray-100 border border-black px-1.5 py-0.5 font-mono">{activeCount}</span>
                                </a>
                            );
                        })}
                    </nav>
                )
            }
        </section>
    );
};
