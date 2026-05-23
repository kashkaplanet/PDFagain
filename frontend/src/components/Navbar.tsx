"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    FileText, ChevronDown, ArrowRight,
    Combine, Scissors, Trash2, FileOutput, FileSearch, ArrowDownUp,
    FileArchive, Wrench, FileImage, Table, Globe,
    RotateCcw, PenTool, Hash, Stamp, Palette, Maximize2, Layers, EyeOff, Info,
    Menu, X, BookOpen
} from "lucide-react";

const navItems = [
    {
        name: "Organize",
        href: "/#organize-pdf",
        color: "#F472B6",
        hoverColor: "#EC4899",
        tools: [
            { name: "Merge PDF", href: "/merge-pdf", icon: Combine, desc: "Combine multiple PDFs" },
            { name: "Split PDF", href: "/split-pdf", icon: Scissors, desc: "Separate into files" },
            { name: "Remove Pages", href: "/remove-pages", icon: Trash2, desc: "Delete unwanted pages" },
            { name: "Extract Pages", href: "/extract-pages", icon: FileOutput, desc: "Save specific pages" },
            { name: "Organize PDF", href: "/organize-pdf", icon: FileSearch, desc: "Rearrange pages" },
            { name: "Reverse PDF", href: "/reverse-pdf", icon: ArrowDownUp, desc: "Reverse page order" },
        ]
    },
    {
        name: "Optimize",
        href: "/#optimize-pdf",
        color: "#FB923C",
        hoverColor: "#F97316",
        tools: [
            { name: "Compress PDF", href: "/compress-pdf", icon: FileArchive, desc: "Reduce file size" },
            { name: "Repair PDF", href: "/repair-pdf", icon: Wrench, desc: "Fix corrupted files" },
        ]
    },
    {
        name: "Convert",
        href: "/#convert-to-pdf",
        color: "#22D3EE",
        hoverColor: "#06B6D4",
        tools: [
            { name: "JPG to PDF", href: "/jpg-to-pdf", icon: FileImage, desc: "Images to PDF" },
            { name: "HTML to PDF", href: "/html-to-pdf", icon: Globe, desc: "Web pages to PDF" },
        ]
    },
    {
        name: "Edit",
        href: "/#edit-pdf",
        color: "#A78BFA",
        hoverColor: "#8B5CF6",
        tools: [
            { name: "Rotate PDF", href: "/rotate-pdf", icon: RotateCcw, desc: "Rotate pages" },
            { name: "Page Numbers", href: "/page-numbers", icon: Hash, desc: "Add numbering" },
            { name: "Watermark PDF", href: "/watermark-pdf", icon: Stamp, desc: "Add watermarks" },
            { name: "Grayscale PDF", href: "/grayscale-pdf", icon: Palette, desc: "Convert to B&W" },
            { name: "Resize PDF", href: "/resize-pdf", icon: Maximize2, desc: "Change page size" },
            { name: "Flatten PDF", href: "/flatten-pdf", icon: Layers, desc: "Merge layers" },
            { name: "Redact PDF", href: "/redact-pdf", icon: EyeOff, desc: "Remove sensitive info" },
            { name: "PDF Metadata", href: "/pdf-metadata", icon: Info, desc: "Edit properties" },
        ]
    },

];

export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

    const toggleMobileSection = (sectionName: string) => {
        setMobileExpandedSection(prev => prev === sectionName ? null : sectionName);
    };

    return (
        <nav className="w-full py-3 px-4 sticky top-0 z-50 bg-[#FFFBE6] border-b-2 border-black">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 rounded-sm transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
                        <div className="relative w-10 h-10 bg-[#FF6B6B] border-2 border-black rounded-sm flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <span className="text-2xl font-display font-black tracking-tight text-black group-hover:translate-x-[2px] transition-transform">
                        PDFagain
                    </span>
                </Link>

                {/* Desktop Nav Items with Dropdowns */}
                <div className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => (
                        <div
                            key={item.name}
                            className="relative"
                            onMouseEnter={() => setActiveDropdown(item.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button
                                className={`font-display font-bold uppercase tracking-wide text-sm relative flex items-center gap-1.5 px-5 py-2.5 transition-all duration-200 border-2 border-black ${activeDropdown === item.name
                                    ? 'text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                                    }`}
                                style={{
                                    backgroundColor: activeDropdown === item.name ? item.color : 'white'
                                }}
                            >
                                <span>{item.name}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 stroke-[3px] ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Premium Dropdown Menu */}
                            <div
                                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ease-out ${activeDropdown === item.name
                                    ? "opacity-100 visible translate-y-0 scale-100"
                                    : "opacity-0 invisible -translate-y-4 scale-95 pointer-events-none"
                                    }`}
                            >
                                {/* Dropdown Arrow */}
                                <div
                                    className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-t-2 border-black rotate-45 z-10"
                                />

                                <div className="relative bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-w-[300px] overflow-hidden">
                                    {/* Gradient Header */}
                                    <div
                                        className="px-5 py-4 border-b-2 border-black flex items-center justify-between"
                                        style={{
                                            background: `linear-gradient(135deg, ${item.color} 0%, ${item.hoverColor} 100%)`
                                        }}
                                    >
                                        <span className="font-display font-black text-base uppercase tracking-wider text-black">{item.name}</span>
                                        <span className="text-xs font-bold bg-black/10 px-2 py-1 rounded-full">{item.tools.length} tools</span>
                                    </div>

                                    {/* Tools List with Staggered Animation */}
                                    <div className="p-3">
                                        {item.tools.map((tool, index) => {
                                            const ToolIcon = tool.icon;
                                            return (
                                                <Link
                                                    key={tool.name}
                                                    href={tool.href}
                                                    className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group/tool border-2 border-transparent hover:border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
                                                    style={{
                                                        animation: activeDropdown === item.name ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none'
                                                    }}
                                                >
                                                    <div
                                                        className="p-2.5 rounded-lg border-2 border-black transition-all duration-200 group-hover/tool:scale-110 group-hover/tool:-rotate-6"
                                                        style={{ backgroundColor: item.color }}
                                                    >
                                                        <ToolIcon className="w-5 h-5 text-black" />
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        <span className="font-bold text-sm group-hover/tool:translate-x-1 transition-transform duration-200">{tool.name}</span>
                                                        <span className="text-xs text-gray-500 group-hover/tool:text-gray-700 transition-colors">{tool.desc}</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover/tool:text-black group-hover/tool:translate-x-1 transition-all duration-200" />
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Animated Footer */}
                                    <div
                                        className="px-5 py-3 border-t-2 border-black flex items-center justify-between group/footer cursor-pointer hover:bg-black transition-colors duration-200"
                                        style={{ backgroundColor: `${item.color}30` }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="text-sm font-bold text-black group-hover/footer:text-white transition-colors flex items-center gap-2"
                                        >
                                            <span>Explore all {item.name.toLowerCase()} tools</span>
                                            <ArrowRight className="w-4 h-4 group-hover/footer:translate-x-2 transition-transform duration-200" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tutorials Link (Desktop) */}
                <Link
                    href="/tools-tutorial"
                    className="hidden md:flex font-display font-bold uppercase tracking-wide text-sm items-center gap-1.5 px-5 py-2.5 transition-all duration-200 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                    <span>Tutorials</span>
                    <BookOpen className="w-4 h-4 stroke-[2.5px]" />
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all bg-white"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] bg-[#FFFBE6] flex flex-col md:hidden animate-in slide-in-from-right duration-300">
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-white">
                            <span className="text-xl font-display font-black tracking-tight text-black">
                                Menu
                            </span>
                            <button
                                className="p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all bg-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Mobile Menu Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {navItems.map((item) => (
                                <div key={item.name} className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <button
                                        className="w-full flex items-center justify-between p-4 font-display font-bold uppercase tracking-wide text-lg"
                                        style={{ backgroundColor: mobileExpandedSection === item.name ? item.color : 'white' }}
                                        onClick={() => toggleMobileSection(item.name)}
                                    >
                                        <span>{item.name}</span>
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpandedSection === item.name ? 'rotate-180' : ''}`} />
                                    </button>

                                    {mobileExpandedSection === item.name && (
                                        <div className="border-t-2 border-black">
                                            {item.tools.map((tool) => {
                                                const ToolIcon = tool.icon;
                                                return (
                                                    <Link
                                                        key={tool.name}
                                                        href={tool.href}
                                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b-2 border-dashed border-gray-200 last:border-0"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <div className="p-2 rounded-lg border-2 border-black" style={{ backgroundColor: item.color }}>
                                                            <ToolIcon className="w-4 h-4 text-black" />
                                                        </div>
                                                        <span className="font-bold text-sm">{tool.name}</span>
                                                    </Link>
                                                );
                                            })}
                                            <div className="p-3 bg-gray-50">
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center justify-center gap-2 text-sm font-bold w-full py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    View All {item.name}
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Mobile Tutorials Link */}
                            <Link
                                href="/tools-tutorial"
                                className="flex items-center justify-between p-4 font-display font-bold uppercase tracking-wide text-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span>Tutorials</span>
                                <BookOpen className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </nav>
    );
}
