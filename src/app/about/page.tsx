import type { Metadata } from "next";
import Link from "next/link";
import { Users, Heart, Zap, Shield, Globe, ArrowLeft, Github, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us | PDFagian",
    description: "Learn about the mission and values behind PDFagian - the privacy-first, client-side PDF tool suite.",
};

const sections = [
    { id: "mission", title: "Our Mission", icon: Heart },
    { id: "why", title: "Why PDFagian?", icon: Zap },
    { id: "privacy-first", title: "Privacy First", icon: Shield },
    { id: "team", title: "The Team", icon: Users },
];

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-wider group hover:text-[#A78BFA] transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>

            {/* Hero */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#A78BFA] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <Users className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight mb-4">
                    About PDFagian
                </h1>
                <p className="text-lg font-medium text-gray-600 max-w-2xl mx-auto">
                    We&apos;re building the web&apos;s most private, fast, and easy-to-use PDF tools.
                </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-16 p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 border-2 border-black inline-block px-3 py-1 bg-[#A78BFA] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Table of Contents
                </h2>
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {sections.map((section, i) => {
                        const SectionIcon = section.icon;
                        return (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="flex items-center gap-3 px-4 py-3 border-2 border-black bg-[#FFFBE6] hover:bg-[#A78BFA] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all duration-200 group font-medium"
                            >
                                <span className="flex items-center justify-center w-7 h-7 bg-black text-white text-xs font-bold flex-shrink-0">
                                    {i + 1}
                                </span>
                                <SectionIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm group-hover:translate-x-1 transition-transform">{section.title}</span>
                            </a>
                        );
                    })}
                </nav>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
                {/* 1. Our Mission */}
                <section id="mission" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-10 h-10 bg-[#A78BFA] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-black">1</span>
                        <h2 className="text-2xl md:text-3xl font-display font-black">Our Mission</h2>
                    </div>
                    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
                        <p className="leading-relaxed">
                            The internet is full of &quot;free&quot; PDF tools that come with a hidden cost: your privacy. Most online PDF converters upload your files to remote servers, often storing them for hours or days. We believe there&apos;s a better way.
                        </p>
                        <p className="leading-relaxed">
                            <strong>PDFagian&apos;s mission is simple:</strong> to provide powerful, professional-grade PDF tools that run 100% in your browser. No uploads, no waiting, and absolutely no privacy compromises.
                        </p>
                    </div>
                </section>

                {/* 2. Why PDFagian? */}
                <section id="why" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-10 h-10 bg-[#A78BFA] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-black">2</span>
                        <h2 className="text-2xl md:text-3xl font-display font-black">Why PDFagian?</h2>
                    </div>
                    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#FFFBE6] border-2 border-black p-4">
                                <Zap className="w-8 h-8 text-[#FB923C] mb-3" />
                                <h3 className="font-bold text-lg mb-2">Blazing Fast</h3>
                                <p className="text-sm text-gray-700">Since we process files on your device using WebAssembly, there&apos;s no upload or download time. It feels instant.</p>
                            </div>
                            <div className="bg-[#FFFBE6] border-2 border-black p-4">
                                <Shield className="w-8 h-8 text-[#22D3EE] mb-3" />
                                <h3 className="font-bold text-lg mb-2">Secure by Design</h3>
                                <p className="text-sm text-gray-700">Your files never leave your computer. We physically cannot see your documents even if we wanted to.</p>
                            </div>
                            <div className="bg-[#FFFBE6] border-2 border-black p-4">
                                <Globe className="w-8 h-8 text-[#A3E635] mb-3" />
                                <h3 className="font-bold text-lg mb-2">Works Offline</h3>
                                <p className="text-sm text-gray-700">PDFagian works without an internet connection. Once the page is loaded, you&apos;re good to go.</p>
                            </div>
                            <div className="bg-[#FFFBE6] border-2 border-black p-4">
                                <Heart className="w-8 h-8 text-[#F472B6] mb-3" />
                                <h3 className="font-bold text-lg mb-2">Forever Free</h3>
                                <p className="text-sm text-gray-700">All tools are free to use. No hidden fees, no &quot;pro&quot; subscriptions for basic features.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Privacy First */}
                <section id="privacy-first" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-10 h-10 bg-[#A78BFA] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-black">3</span>
                        <h2 className="text-2xl md:text-3xl font-display font-black">Privacy First</h2>
                    </div>
                    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
                        <p className="leading-relaxed">
                            We don&apos;t just say we care about privacy; we built our entire architecture around it. By leveraging modern browser capabilities like WebAssembly and Service Workers, we&apos;ve eliminated the need for server-side processing.
                        </p>
                        <p className="leading-relaxed">
                            For a deep dive into how we protect your data, check out our <Link href="/security" className="font-bold hover:text-[#A78BFA] underline">Security Page</Link>.
                        </p>
                    </div>
                </section>

                {/* 5. The Team -> 4. The Team */}
                <section id="team" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-10 h-10 bg-[#A78BFA] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-black">4</span>
                        <h2 className="text-2xl md:text-3xl font-display font-black">The Team</h2>
                    </div>
                    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
                        <p className="leading-relaxed">
                            PDFagian is maintained by a small team of developers passionate about privacy and web performance. We are constantly working to add new tools and improve existing ones.
                        </p>
                    </div>
                </section>
            </div>

            {/* Cross-links */}
            <div className="mt-16 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-2 border-black inline-block px-3 py-1 bg-[#A78BFA] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Get in Touch
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/contact" className="flex items-center justify-between px-6 py-4 border-2 border-black bg-[#FFFBE6] hover:bg-[#F472B6] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all duration-200 font-bold text-lg group">
                        <span>Contact Us</span>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center justify-between px-6 py-4 border-2 border-black bg-[#FFFBE6] hover:bg-[#22D3EE] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all duration-200 font-bold text-lg group">
                        <span>GitHub</span>
                        <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
}
