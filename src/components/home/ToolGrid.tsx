import React from "react";
import { ChevronDown } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Section, Tool } from "@/config/tools";
import { RETRO_COLORS } from "@/config/design";

interface ToolGridProps {
    filteredSections: Section[];
    collapsedSections: Set<string>;
    toggleCollapse: (title: string) => void;
    favoriteHrefs: string[];
    handleToggleFav: (e: React.MouseEvent, href: string) => void;
    handleToolClick: (href: string) => void;
    handleGridKeyDown: (e: React.KeyboardEvent, tools: Tool[], index: number) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
    filteredSections,
    collapsedSections,
    toggleCollapse,
    favoriteHrefs,
    handleToggleFav,
    handleToolClick,
    handleGridKeyDown
}) => {
    return (
        <div className="w-full space-y-12">
            {filteredSections.map((section) => {
                const SectionIcon = section.icon;
                const colors = RETRO_COLORS[section.color as keyof typeof RETRO_COLORS] || RETRO_COLORS.default;
                const isCollapsed = collapsedSections.has(section.title);
                const activeTools = section.tools.filter(t => !t.disabled);

                return (
                    <React.Fragment key={section.title}>
                        <section
                            id={section.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}
                            className="space-y-8"
                            aria-label={`${section.title} — ${activeTools.length} tools`}
                        >
                            {/* Section Header — clickable to collapse on mobile */}
                            <button
                                onClick={() => toggleCollapse(section.title)}
                                className="flex items-center gap-4 w-full text-left group md:cursor-default"
                                aria-expanded={!isCollapsed}
                                aria-controls={`grid-${section.title}`}
                            >
                                <div className={`p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:rotate-6 hover:scale-110 transition-transform duration-300 ${colors.bg}`}>
                                    <SectionIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wide">{section.title}</h2>
                                </div>
                                <ChevronDown
                                    className={`w-6 h-6 text-gray-400 md:hidden transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}
                                    aria-hidden="true"
                                />
                            </button>

                            {/* Tools Grid — collapsible on mobile */}
                            <div
                                id={`grid-${section.title}`}
                                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-all duration-300 overflow-hidden p-2 -mx-2
                                           ${isCollapsed ? "max-h-0 opacity-0 md:max-h-none md:opacity-100" : "max-h-[5000px] opacity-100"}`}
                                data-grid
                            >
                                {section.tools.map((tool) => (
                                    <ToolCard
                                        key={tool.href}
                                        tool={tool}
                                        isFav={favoriteHrefs.includes(tool.href)}
                                        onToggleFav={handleToggleFav}
                                        onToolClick={handleToolClick}
                                        gridTools={activeTools}
                                        gridIndex={activeTools.findIndex(t => t.href === tool.href)}
                                        onGridKeyDown={handleGridKeyDown}
                                        sectionColor={section.color}
                                    />
                                ))}
                            </div>
                        </section>
                    </React.Fragment>
                );
            })}
        </div>
    );
};
