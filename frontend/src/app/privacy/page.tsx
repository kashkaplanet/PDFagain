"use client";

import Link from "next/link";
import { Eye, Cookie, Server, ArrowLeft, ChevronRight, Shield, Scale, XCircle, Database, UserX, BarChart3, FileText } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const sections = [
    { id: "promise", label: "Our Promise", num: "01" },
    { id: "no-collection", label: "Zero Data Collection", num: "02" },
    { id: "interactions", label: "Limited Interactions", num: "03" },
    { id: "third-party", label: "Third-Party Services", num: "04" },
];

const noCollectionItems = [
    { icon: FileText, title: "Document Content", desc: "We never see the text, images, or data inside your PDFs." },
    { icon: Database, title: "Document Metadata", desc: "We do not track file names, sizes, authors, or creation dates." },
    { icon: UserX, title: "Personal Identity", desc: "We do not collect names, email addresses, phone numbers, or physical addresses." },
    { icon: BarChart3, title: "Usage Profiling", desc: "We do not build profiles of your usage habits or document types." },
];

export default function PrivacyPage() {
    const [activeSection, setActiveSection] = useState("promise");
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
                <span className="text-black">Privacy Policy</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-0">

                    {/* Hero Banner */}
                    <div className="relative border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-10">
                        <div className="h-2 bg-gradient-to-r from-[#F472B6] via-[#A78BFA] to-[#F472B6]" />

                        <div className="p-8 md:p-12">
                            {/* "Zero Data" Badge */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                <div className="bg-[#F472B6] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 text-xs font-display uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                                    <Eye className="w-3.5 h-3.5" /> Zero Collection
                                </div>
                                <div className="bg-[#A3E635] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 text-xs font-display uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                                    <XCircle className="w-3.5 h-3.5" /> No Tracking
                                </div>
                                <div className="bg-[#22D3EE] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 text-xs font-display uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                                    <Shield className="w-3.5 h-3.5" /> GDPR Ready
                                </div>
                            </div>

                            {/* Icon + Title */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className="w-20 h-20 bg-[#F472B6] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:rotate-6 hover:scale-110 transition-transform duration-300">
                                    <Eye className="w-10 h-10 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tighter leading-[0.9]">
                                        Privacy<br />Policy
                                    </h1>
                                </div>
                            </div>

                            <p className="text-lg font-medium text-gray-600 max-w-xl leading-relaxed">
                                We believe privacy is a human right. Our architecture guarantees that your documents remain yours alone.
                            </p>
                        </div>

                        <div className="h-1 bg-gradient-to-r from-[#F472B6] via-[#22D3EE] to-[#A3E635]" />
                    </div>

                    {/* Sections */}
                    <div className="space-y-12">

                        {/* 01 — Our Promise */}
                        <section id="promise" className="scroll-mt-24 border-2 border-black bg-white p-6 md:p-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F472B6]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#F472B6] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">01</span>
                                Our Promise
                            </h2>
                            <p className="font-medium text-gray-700 leading-relaxed mb-6 pl-4">
                                At PDFagain, we have fundamentally architected our service to avoid knowing anything about you or your files. We do not want your data. We do not sell your data. We do not store your data.
                            </p>
                            <div className="bg-[#FFFBE6] border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative ml-4">
                                <div className="absolute -top-3 -left-3 bg-black text-white px-3 py-1 text-[10px] font-display uppercase tracking-widest">No-Server Rule</div>
                                <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">
                                    When you &quot;upload&quot; a file to PDFagain, you are actually just loading it into your own browser&apos;s memory. It never travels over the internet to our servers. Therefore, we literally <strong>cannot</strong> have a privacy breach regarding your files, because we never possess them.
                                </p>
                            </div>
                        </section>

                        {/* 02 — Zero Collection */}
                        <section id="no-collection" className="scroll-mt-24 border-2 border-black bg-white p-6 md:p-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6B6B]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#FF6B6B] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">02</span>
                                Zero Data Collection
                            </h2>
                            <div className="space-y-0 border-2 border-black overflow-hidden ml-4">
                                {noCollectionItems.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 border-b-2 border-black last:border-0 p-5 hover:bg-[#FF6B6B]/5 transition-colors group">
                                        <div className="mt-0.5 shrink-0 flex items-center gap-3">
                                            <span className="text-[#FF6B6B] font-black text-lg leading-none group-hover:scale-125 transition-transform">✕</span>
                                            <div className="w-8 h-8 border-2 border-black bg-gray-50 flex items-center justify-center group-hover:bg-[#FF6B6B]/10 transition-colors">
                                                <item.icon className="w-4 h-4 text-gray-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <strong className="font-display uppercase tracking-wide text-sm block mb-1">{item.title}</strong>
                                            <span className="text-sm text-gray-600 font-medium">{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 03 — Limited Interactions */}
                        <section id="interactions" className="scroll-mt-24 border-2 border-black bg-white p-6 md:p-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FBBF24]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-4 flex items-center gap-3 pl-4">
                                <span className="bg-[#FBBF24] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">03</span>
                                Limited Interactions
                            </h2>
                            <p className="font-medium text-gray-600 leading-relaxed mb-6 pl-4 text-sm">
                                While we strive for zero data, the nature of the internet requires minimal technical interactions:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4 pl-4">
                                <div className="border-2 border-black p-5 bg-gray-50 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-[#FBBF24] w-8 h-8 border-2 border-black flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                            <Server className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-bold text-sm font-display uppercase tracking-wider">Server Logs</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                        Like all websites, our hosting provider processes IP addresses for security (DDoS protection) and debugging. These logs are rotated out automatically.
                                    </p>
                                </div>
                                <div className="border-2 border-black p-5 bg-gray-50 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-[#A78BFA] w-8 h-8 border-2 border-black flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                            <Cookie className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-bold text-sm font-display uppercase tracking-wider">Local Preferences</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                        We use &quot;Local Storage&quot; for simple settings (theme, last tool). This data lives 100% on your device and is never sent to us.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 04 — Third Parties */}
                        <section id="third-party" className="scroll-mt-24 border-2 border-black bg-white p-6 md:p-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#A3E635]" />
                            <h2 className="text-2xl font-display uppercase tracking-tight mb-6 flex items-center gap-3 pl-4">
                                <span className="bg-[#A3E635] text-black w-9 h-9 flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">04</span>
                                Third-Party Services
                            </h2>
                            <div className="bg-[#A3E635]/20 border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ml-4">
                                <p className="font-medium text-gray-800 mb-4 text-sm leading-relaxed">
                                    We minimize dependencies. Our only third-party providers are infrastructure-related (Hosting, DNS, CDN) to deliver the application to you.
                                </p>
                                <p className="font-bold text-xs uppercase tracking-widest text-black/60 border-t-2 border-black/20 pt-4">
                                    They deliver the code, they don&apos;t see your data.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-8 mt-10 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                            Updated: Feb 13, 2026
                        </p>

                    </div>

                    {/* Cross-page Navigation */}
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        <Link href="/security" className="group border-2 border-black p-5 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#22D3EE] border-2 border-black flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Read Also</span>
                                <span className="font-display uppercase tracking-tight text-lg">Security</span>
                            </div>
                        </Link>
                        <Link href="/terms" className="group border-2 border-black p-5 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
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
                    <div className="border-2 border-black bg-white p-6 sticky top-24 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-bold border-b-2 border-black pb-3 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#F472B6] border border-black" />
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
                                            ? "bg-[#F472B6] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5 font-bold"
                                            : "text-gray-500 border-transparent hover:bg-[#F472B6]/20 hover:text-black hover:border-black/20"
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
