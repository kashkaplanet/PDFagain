"use client";

import React, { useState } from "react";
import { BookOpen, Search, ArrowRight } from "lucide-react";
import { TutorialCard } from "@/components/TutorialCard";
import { allTools, sections, type Section } from "@/config/tools";
import { RETRO_COLORS } from "@/config/design";

export default function ToolsTutorialPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter tools based on search query
    const filteredTools = allTools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isSearching = searchQuery.trim().length > 0;

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto gap-12 pt-8 pb-20">
            {/* Hero Section */}
            <div className="w-full text-center space-y-8 px-4 relative z-10">
                <div className="inline-flex p-5 border-2 border-black bg-[#FF6B6B] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:rotate-3 transition-transform duration-300 mb-2">
                    <BookOpen className="w-12 h-12 text-white" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase relative inline-block">
                        Tools Tutorials

                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto font-sans leading-relaxed">
                        Step-by-step guides to master every PDF tool. <br className="hidden md:block" />
                        Simple, fast, and free.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-2xl mx-auto mt-8 relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                        <Search className="h-6 w-6 text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a tutorial (e.g. 'Merge', 'Compress')..."
                        className="w-full pl-14 pr-4 py-5 bg-white border-2 border-black font-display text-xl 
                                 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
                                 focus:-translate-y-1 focus:outline-none transition-all placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Quick Jump Pills (Only visible when not searching) */}
                {!isSearching && (
                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mt-4">
                        {sections.map((section) => (
                            <button
                                key={section.title}
                                onClick={() => scrollToSection(section.title)}
                                className="px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white 
                                         font-display font-bold uppercase text-sm tracking-wide transition-all
                                         hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
                            >
                                {section.title.replace(' PDF', '')}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="w-full px-4 space-y-20">
                {isSearching ? (
                    /* Search Results View */
                    filteredTools.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTools.map((tool) => (
                                <TutorialCard
                                    key={tool.href}
                                    title={`How to ${tool.name}`}
                                    description={tool.description}
                                    href={`/tools-tutorial${tool.href}`}
                                    color={(tool as any).sectionColor as keyof typeof RETRO_COLORS || 'default'}
                                    icon={tool.icon}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 bg-gray-50/50">
                            <Search className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-2xl font-display font-bold text-gray-400">No tutorials found</h3>
                            <p className="text-gray-500 mb-6 font-sans">We couldn't find any guides matching "{searchQuery}"</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-6 py-2 bg-white border-2 border-black font-display font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                Clear Search
                            </button>
                        </div>
                    )
                ) : (
                    /* Categorized View */
                    sections.map((section) => {
                        // Only show sections that have active tools
                        const activeTools = section.tools.filter(t => !t.disabled);
                        if (activeTools.length === 0) return null;

                        const colors = RETRO_COLORS[section.color as keyof typeof RETRO_COLORS] || RETRO_COLORS.default;
                        const SectionIcon = section.icon;

                        return (
                            <section key={section.title} id={section.title} className="scroll-mt-24">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`p-3 border-2 border-black ${colors.bg} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                                        <SectionIcon className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-wide">
                                            {section.title}
                                        </h2>
                                        <p className="text-gray-600 font-sans text-lg">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {activeTools.map((tool) => (
                                        <TutorialCard
                                            key={tool.href}
                                            title={`How to ${tool.name}`}
                                            description={tool.description}
                                            href={`/tools-tutorial${tool.href}`}
                                            color={section.color as keyof typeof RETRO_COLORS}
                                            icon={tool.icon}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })
                )}
            </div>

            {/* Help/Footer Section */}
            {/* Help/Footer Section */}
            {!isSearching && (
                <div className="w-full max-w-4xl px-4 mt-8 mb-16">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5"></div>
                        <div className="relative bg-[#FFFBE6] border-4 border-black p-8 md:p-12 text-center">

                            <h2 className="text-3xl md:text-4xl font-display font-black mb-6 uppercase tracking-tight">
                                Still have questions?
                            </h2>

                            <p className="text-xl text-gray-800 mb-10 max-w-2xl mx-auto font-sans font-medium leading-relaxed">
                                Our tools are designed to be intuitive, but if you need specific help,
                                try exploring our tool categories to find exactly what you need.
                            </p>

                            <a
                                href="/"
                                className="inline-flex items-center justify-center px-10 py-4 font-display font-black text-xl uppercase tracking-widest bg-[#FACC15] border-3 border-black hover:bg-[#FFD700] hover:-translate-y-1 transition-all"
                            >
                                Explore All Tools
                                <ArrowRight className="ml-3 w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
