"use client";

import Link from "next/link";
import { Shield, ArrowLeft, ChevronRight, Lock, Eye, Scale, Cpu, Layers, Trash2, Mail, ExternalLink, EyeOff } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const sections = [
    { id: "core-principle", label: "Core Principle", num: "01" },
    { id: "technical", label: "Technical Implementation", num: "02" },
    { id: "privacy", label: "Privacy by Design", num: "03" },
    { id: "reporting", label: "Vulnerability Reporting", num: "04" },
];

const techItems = [
    { title: "WebAssembly (Wasm)", desc: "High-performance C++ libraries compiled to run locally in your browser at near-native speed.", icon: Cpu, color: "bg-[#22D3EE]" },
    { title: "Web Workers", desc: "Processing in background threads keeps the UI responsive and fully isolated.", icon: Layers, color: "bg-[#A3E635]" },
    { title: "Sandboxed Execution", desc: "Strict browser-level code isolation prevents any access to your file system.", icon: Lock, color: "bg-[#F472B6]" },
    { title: "Ephemeral Memory", desc: "Data exists only in RAM. Closing the tab instantly and permanently wipes it.", icon: Trash2, color: "bg-[#FBBF24]" },
];

const privacyItems = [
    { title: "GDPR & CCPA Compliant", desc: "Since no personal data or files are collected, we automatically meet strict data sovereignty requirements." },
    { title: 'No "Big Brother"', desc: "No user accounts, no login tracking, and no way to tie specific file activity to an individual." },
    { title: "Corporate Safe", desc: "Employees can safely use PDFagian for internal documents because files never cross the firewall." },
];

const trustBadges = [
    { label: "Zero Upload", icon: Shield, color: "bg-[#22D3EE]" },
    { label: "100% Client-Side", icon: Lock, color: "bg-[#A3E635]" },
];

export default function SecurityPage() {
    const [activeSection, setActiveSection] = useState("core-principle");
    const observerRefs = useRef<IntersectionObserver | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Scroll-spy via IntersectionObserver
    useEffect(() => {
        if (!mounted) return;
        const sectionEls = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
        if (!sectionEls.length) return;

        observerRefs.current = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) setActiveSection(visible[0].target.id);
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        );
        sectionEls.forEach(el => observerRefs.current!.observe(el));
        return () => observerRefs.current?.disconnect();
    }, [mounted]);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Link href="/" className="hover:text-black transition-colors flex items-center gap-1 group">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-black">Security</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-0">

                    {/* Hero Banner */}
                    <div className="relative border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-10">
                        {/* Gradient strip */}
                        <div className="h-2 bg-gradient-to-r from-[#22D3EE] via-[#A3E635] to-[#22D3EE]" />

                        <div className="p-8 md:p-12">
                            {/* Trust Badges */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                {trustBadges.map(badge => (
                                    <div key={badge.label} className={`${badge.color} px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 text-xs font-display uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default`}>
                                        <badge.icon className="w-3.5 h-3.5" />
                                        {badge.label}
                                    </div>
                                ))}
                            </div>

                            {/* Icon + Title */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className="w-20 h-20 bg-[#22D3EE] border-4 border-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:rotate-6 hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-10 h-10 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tighter leading-[0.9]">
                                        Security<br />Architecture
                                    </h1>
                                </div>
                            </div>

                            <p className="text-lg font-medium text-gray-600 max-w-xl leading-relaxed">
                                How PDFagian protects your data through complete isolation and client-side processing.
                            </p>
                        </div>

                        {/* Bottom gradient strip */}
                        <div className="h-1 bg-gradient-to-r from-[#22D3EE] via-[#A78BFA] to-[#F472B6]" />
                    </div>

                    {/* Sections */}
                    <div className="space-y-12">

                        {/* 01 — Core Principle */}
                        <section id="core-principle" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#22D3EE]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#22D3EE] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">01</span>
                                Core Principle
                            </h2>
                            <div className="bg-[#FFFBE6] border-2 border-black p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative ml-4">
                                <div className="absolute -top-3 -left-3 bg-black text-white px-3 py-1 text-[10px] font-display uppercase tracking-widest">Key Promise</div>
                                <p className="text-xl font-display uppercase tracking-tight mb-4 mt-2">&quot;Your Data Never Leaves Your Device&quot;</p>
                                <p className="font-medium text-gray-700 leading-relaxed text-sm md:text-base">
                                    Unlike traditional PDF services that require uploading files to a remote server for processing, PDFagian operates <strong>entirely within your web browser</strong>. The PDF manipulation code downloads once to your device and runs locally. This means there is no &quot;cloud&quot; component that sees your files at all.
                                </p>
                            </div>
                        </section>

                        {/* 02 — Technical Implementation */}
                        <section id="technical" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#A3E635]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-4 flex items-center gap-3 pl-4">
                                <span className="bg-[#A3E635] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">02</span>
                                Technical Implementation
                            </h2>
                            <p className="font-medium text-gray-600 leading-relaxed mb-6 pl-4 text-sm">
                                We utilize advanced browser technologies to deliver native-application performance in a secure web environment:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4 pl-4">
                                {techItems.map(item => (
                                    <div key={item.title} className="border-2 border-black p-5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group bg-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`${item.color} w-8 h-8 border-2 border-black flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-bold font-display uppercase tracking-wider text-sm">{item.title}</h3>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 03 — Privacy by Design */}
                        <section id="privacy" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F472B6]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#F472B6] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">03</span>
                                Privacy by Design
                            </h2>
                            <div className="space-y-4 pl-4">
                                {privacyItems.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 border-2 border-black p-4 hover:bg-[#F472B6]/10 transition-colors group">
                                        <div className="mt-0.5 shrink-0">
                                            <EyeOff className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                                        </div>
                                        <div>
                                            <strong className="font-display uppercase tracking-wide text-sm block mb-1">{item.title}</strong>
                                            <span className="text-sm text-gray-600 font-medium">{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 04 — Vulnerability Reporting */}
                        <section id="reporting" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FBBF24]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-4 flex items-center gap-3 pl-4">
                                <span className="bg-[#FBBF24] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">04</span>
                                Vulnerability Reporting
                            </h2>
                            <p className="font-medium text-gray-600 leading-relaxed mb-6 pl-4 text-sm">
                                If you discover a vulnerability in our application logic, please report it immediately.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pl-4">
                                <a href="mailto:support@pdfagain.com" className="flex-1 p-5 border-2 border-black bg-[#FFFBE6] font-mono text-base flex items-center justify-center gap-3 hover:bg-[#22D3EE] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    support@pdfagain.com
                                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <div className="flex-1 p-4 border-2 border-black bg-[#FF6B6B]/10 text-xs text-gray-600 flex items-center font-medium">
                                    <span>⚠️ Please exclude browser-level security model issues from reports.</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-8 mt-10 border-t-4 border-black flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                            Updated: Feb 13, 2026
                        </p>
                        <p className="font-display uppercase tracking-widest text-sm bg-black text-white px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(34,211,238,1)]">
                            Ver: 3.0 (Redesigned)
                        </p>
                    </div>

                    {/* Cross-page Navigation */}
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        <Link href="/privacy" className="group border-3 border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#F472B6] border-2 border-black flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                                <Eye className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Read Next</span>
                                <span className="font-display uppercase tracking-tight text-lg">Privacy Policy</span>
                            </div>
                        </Link>
                        <Link href="/terms" className="group border-3 border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#A78BFA] border-2 border-black flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Read Next</span>
                                <span className="font-display uppercase tracking-tight text-lg">Terms & Conditions</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="border-4 border-black bg-white p-6 sticky top-24 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-bold border-b-2 border-black pb-3 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#22D3EE] border border-black" />
                            Contents
                        </h3>
                        <nav className="space-y-1">
                            {sections.map(link => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className={`block py-2.5 px-3 text-sm font-medium transition-all duration-200 border-2 flex items-center gap-2
                                        ${activeSection === link.id
                                            ? "bg-[#22D3EE] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5 font-bold"
                                            : "text-gray-500 border-transparent hover:bg-[#22D3EE]/20 hover:text-black hover:border-black/20"
                                        }`}
                                >
                                    <span className="text-[10px] font-mono opacity-50">{link.num}</span>
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        {/* Related Pages */}
                        <div className="mt-8 pt-6 border-t-2 border-black">
                            <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-gray-400">Related Pages</h3>
                            <div className="space-y-2">
                                <Link href="/privacy" className="flex items-center justify-between p-3 border-2 border-black bg-[#FFFBE6] hover:bg-[#F472B6] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-sm font-bold group">
                                    Privacy Policy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/terms" className="flex items-center justify-between p-3 border-2 border-black bg-[#FFFBE6] hover:bg-[#A78BFA] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-sm font-bold group">
                                    Terms of Service <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
