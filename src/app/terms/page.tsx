"use client";

import Link from "next/link";
import { Scale, AlertOctagon, ArrowLeft, ChevronRight, Shield, Eye, Ban, Copyright, AlertTriangle } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const sections = [
    { id: "agreement", label: "Agreement", num: "01" },
    { id: "permitted-use", label: "Permitted Use", num: "02" },
    { id: "prohibited", label: "Prohibited Activities", num: "03" },
    { id: "ip", label: "Intellectual Property", num: "04" },
    { id: "disclaimer", label: "Disclaimer", num: "05" },
];

const permittedItems = [
    "Limited, non-exclusive license for personal & commercial use.",
    "Unlimited processing of files (subject to your hardware).",
    "Full ownership of your output files.",
];

const prohibitedItems = [
    "Processing illegal content or promoting violence/exploitation.",
    "Attempting to reverse engineer proprietary application logic.",
    "Disrupting service availability (e.g., DDoS attacks).",
    "Misrepresenting affiliation with PDFagain.",
];

export default function TermsPage() {
    const [activeSection, setActiveSection] = useState("agreement");
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted) return;
        const sectionEls = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
        if (!sectionEls.length) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) setActiveSection(visible[0].target.id);
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        );
        sectionEls.forEach(el => observerRef.current!.observe(el));
        return () => observerRef.current?.disconnect();
    }, [mounted]);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Link href="/" className="hover:text-black transition-colors flex items-center gap-1 group">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-black">Terms & Conditions</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-0">

                    {/* Hero Banner */}
                    <div className="relative border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-10">
                        <div className="h-2 bg-gradient-to-r from-[#A78BFA] via-[#F472B6] to-[#A78BFA]" />

                        <div className="p-8 md:p-12">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                <div className="bg-[#A78BFA] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 text-xs font-display uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                                    <Scale className="w-3.5 h-3.5" /> Fair Use
                                </div>
                                <div className="bg-[#A3E635] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 text-xs font-display uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                                    <Copyright className="w-3.5 h-3.5" /> Your Content = Yours
                                </div>
                                <div className="bg-[#FBBF24] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 text-xs font-display uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                                    <Shield className="w-3.5 h-3.5" /> MIT Licensed
                                </div>
                            </div>

                            {/* Icon + Title */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className="w-20 h-20 bg-[#A78BFA] border-4 border-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:rotate-6 hover:scale-110 transition-transform duration-300">
                                    <Scale className="w-10 h-10 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tighter leading-[0.9]">
                                        Terms &<br />Conditions
                                    </h1>
                                </div>
                            </div>

                            <p className="text-lg font-medium text-gray-600 max-w-xl leading-relaxed">
                                The rules of the road. Please read these terms carefully before using our free PDF tools.
                            </p>
                        </div>

                        <div className="h-1 bg-gradient-to-r from-[#A78BFA] via-[#FBBF24] to-[#A3E635]" />
                    </div>

                    {/* Sections */}
                    <div className="space-y-12">

                        {/* 01 — Agreement */}
                        <section id="agreement" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#A78BFA]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#A78BFA] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">01</span>
                                Agreement
                            </h2>
                            <p className="font-medium text-gray-700 leading-relaxed mb-6 pl-4">
                                These Terms constitute a legally binding agreement between you (&quot;User&quot;) and PDFagain. By accessing or using the PDFagain website, you agree to these Terms.
                            </p>
                            <div className="p-5 border-2 border-black bg-[#FBBF24]/20 flex items-center gap-4 ml-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <AlertOctagon className="w-6 h-6 shrink-0 text-black" />
                                <p className="text-xs font-bold uppercase tracking-wide">
                                    Warning: If you do not agree, you must discontinue use immediately.
                                </p>
                            </div>
                        </section>

                        {/* 02 — Permitted Use */}
                        <section id="permitted-use" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#A3E635]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#A3E635] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">02</span>
                                Permitted Use
                            </h2>
                            <div className="space-y-3 pl-4">
                                {permittedItems.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 border-2 border-black p-4 hover:bg-[#A3E635]/10 transition-colors group">
                                        <span className="bg-[#A3E635] border-2 border-black px-2 py-0.5 text-[10px] font-bold shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-0.5 transition-all font-display uppercase">ALLOWED</span>
                                        <span className="text-sm font-medium text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 03 — Prohibited */}
                        <section id="prohibited" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6B6B]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#FF6B6B] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">03</span>
                                Prohibited Activities
                            </h2>
                            <div className="space-y-3 pl-4">
                                {prohibitedItems.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 border-2 border-black p-4 hover:bg-[#FF6B6B]/10 transition-colors group">
                                        <span className="bg-[#FF6B6B] border-2 border-black px-2 py-0.5 text-[10px] font-bold shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-0.5 transition-all font-display uppercase flex items-center gap-1">
                                            <Ban className="w-3 h-3" /> BLOCKED
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 04 — Intellectual Property */}
                        <section id="ip" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#22D3EE]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#22D3EE] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">04</span>
                                Intellectual Property
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4 pl-4">
                                <div className="border-2 border-black p-5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group bg-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-[#A3E635] border-l-2 border-b-2 border-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">Yours</div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-[#A3E635] w-8 h-8 border-2 border-black flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                            <Copyright className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-bold font-display uppercase tracking-wide text-sm">Your Content</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                        You retain full ownership of all documents. We claim no rights over your files.
                                    </p>
                                </div>
                                <div className="border-2 border-black p-5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group bg-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-[#22D3EE] border-l-2 border-b-2 border-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">Ours</div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-[#22D3EE] w-8 h-8 border-2 border-black flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                            <Scale className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-bold font-display uppercase tracking-wide text-sm">Our Content</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                        Visual interfaces and branding are property of PDFagain. Code is under MIT License.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 05 — Disclaimer */}
                        <section id="disclaimer" className="scroll-mt-24 border-4 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FBBF24]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#FBBF24] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">05</span>
                                Disclaimer
                            </h2>
                            <div className="border-2 border-black p-6 bg-[#FBBF24]/15 ml-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative">
                                <div className="absolute -top-3 -left-3 bg-black text-white px-3 py-1 text-[10px] font-display uppercase tracking-widest flex items-center gap-1.5">
                                    <AlertTriangle className="w-3 h-3" /> As-Is Service
                                </div>
                                <p className="font-medium text-gray-700 leading-relaxed text-sm mt-2">
                                    THE SITE IS PROVIDED ON AN &quot;AS-IS&quot; BASIS. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. WE DO NOT WARRANT ACCURACY.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-8 mt-10 border-t-4 border-black flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                            Updated: Feb 13, 2026
                        </p>
                        <p className="font-display uppercase tracking-widest text-sm bg-black text-white px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(167,139,250,1)]">
                            Ver: 3.5 (Redesigned)
                        </p>
                    </div>

                    {/* Cross-page Navigation */}
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        <Link href="/security" className="group border-3 border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#22D3EE] border-2 border-black flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Read Also</span>
                                <span className="font-display uppercase tracking-tight text-lg">Security</span>
                            </div>
                        </Link>
                        <Link href="/privacy" className="group border-3 border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#F472B6] border-2 border-black flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                                <Eye className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Read Also</span>
                                <span className="font-display uppercase tracking-tight text-lg">Privacy Policy</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="border-4 border-black bg-white p-6 sticky top-24 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-bold border-b-2 border-black pb-3 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#A78BFA] border border-black" />
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
                                            ? "bg-[#A78BFA] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5 font-bold"
                                            : "text-gray-500 border-transparent hover:bg-[#A78BFA]/20 hover:text-black hover:border-black/20"
                                        }`}
                                >
                                    <span className="text-[10px] font-mono opacity-50">{link.num}</span>
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-8 pt-6 border-t-2 border-black">
                            <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-gray-400">Related Pages</h3>
                            <div className="space-y-2">
                                <Link href="/security" className="flex items-center justify-between p-3 border-2 border-black bg-[#FFFBE6] hover:bg-[#22D3EE] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-sm font-bold group">
                                    Security <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/privacy" className="flex items-center justify-between p-3 border-2 border-black bg-[#FFFBE6] hover:bg-[#F472B6] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-sm font-bold group">
                                    Privacy Policy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
