import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, HelpCircle, Bug, Github, AlertTriangle, ArrowLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us | PDFagain",
    description: "Get in touch with the PDFagain team. We're here to help with your questions, feedback, and bug reports.",
};

const sections = [
    { id: "get-in-touch", title: "Get in Touch", icon: Mail },
    { id: "faq", title: "Frequently Asked Questions", icon: HelpCircle },
    { id: "report-bug", title: "Report a Issue", icon: Bug },
];

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-wider group hover:text-[#F472B6] transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>

            {/* Hero */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F472B6] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <MessageSquare className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight mb-4">
                    Contact Us
                </h1>
                <p className="text-lg font-medium text-gray-600 max-w-2xl mx-auto">
                    Have a question, suggestion, or just want to say hi? We&apos;d love to hear from you.
                </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-16 p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 border-2 border-black inline-block px-3 py-1 bg-[#F472B6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Table of Contents
                </h2>
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {sections.map((section, i) => {
                        const SectionIcon = section.icon;
                        return (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="flex items-center gap-3 px-4 py-3 border-2 border-black bg-[#FFFBE6] hover:bg-[#F472B6] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all duration-200 group font-medium"
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
                {/* 1. Get in Touch */}
                <section id="get-in-touch" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-10 h-10 bg-[#F472B6] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-black">1</span>
                        <h2 className="text-2xl md:text-3xl font-display font-black">Get in Touch</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
                            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-[#A3E635] border-2 border-black rounded-full">
                                <Mail className="w-6 h-6 text-black" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Email Support</h3>
                            <p className="text-gray-600 mb-4">
                                For general inquiries, feedback, or assistance with our tools.
                            </p>
                            <a href="mailto:support@pdfagain.com" className="inline-flex items-center gap-2 font-bold hover:text-[#F472B6] transition-colors">
                                support@pdfagain.com <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>


                    </div>
                </section>

                {/* 2. Frequently Asked Questions */}
                <section id="faq" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-10 h-10 bg-[#F472B6] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-black">2</span>
                        <h2 className="text-2xl md:text-3xl font-display font-black">Freq. Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                q: "Is PDFagain really free?",
                                a: "Yes! All tools on PDFagain are 100% free to use. There are no limits on file size or number of files."
                            },
                            {
                                q: "Are my files safe?",
                                a: "Absolutely. We use client-side processing, which means your files never leave your computer. Check our Security page for more details."
                            },
                            {
                                q: "Can I use PDFagain offline?",
                                a: "Yes. Once the website is loaded, you can disconnect from the internet and still use most of the tools."
                            },
                            {
                                q: "Do you save my documents?",
                                a: "No. We physically cannot save your documents because they are never uploaded to our servers. They stay in your browser's memory and are cleared when you close the tab."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
                                <h3 className="text-lg font-bold mb-2 flex items-start gap-2">
                                    <span className="text-[#F472B6]">Q:</span> {faq.q}
                                </h3>
                                <p className="text-gray-700 ml-6">
                                    <span className="font-bold text-black">A:</span> {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Report a Issue */}
                <section id="report-bug" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-10 h-10 bg-[#F472B6] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-black">3</span>
                        <h2 className="text-2xl md:text-3xl font-display font-black">Report an Issue</h2>
                    </div>
                    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-12 h-12 text-[#FB923C] flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold mb-2">Found a bug?</h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    If you encounter any issues while using our tools, please let us know. Detailed reports help us fix problems faster.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">

                                    <a href="mailto:support@pdfagain.com" className="bg-white text-black px-6 py-3 font-bold border-2 border-black hover:bg-[#F472B6] transition-colors text-center">
                                        Email Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
