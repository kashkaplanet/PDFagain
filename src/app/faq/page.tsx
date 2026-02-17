import { Metadata } from 'next';
import Link from 'next/link';
import { FaqItem } from "@/components/FaqItem";
import { RetroButton } from "@/components/RetroButton";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQ - PDFagain",
    description: "Frequently asked questions about PDFagain. Learn about our 100% free, local, and private PDF tools.",
};

const faqs = [
    {
        question: "Is PDFagain really free?",
        answer: "Yes! PDFagain is 100% free to use. We believe in providing powerful tools without paywalls or hidden fees. Enjoy unlimited access to all our PDF utilities."
    },
    {
        question: "Are my files safe?",
        answer: "Absolutely. We use local processing technology, meaning your files effectively never leave your device. All processing happens right in your browser, ensuring maximum privacy and security."
    },
    {
        question: "Do you store my documents?",
        answer: "No. Since files are processed locally in your browser, we do not upload or store your documents on our servers. Your data remains completely private and under your control."
    },
    {
        question: "Is there a file size limit?",
        answer: "Because processing happens on your device, the limit is largely determined by your computer's memory and browser capabilities. Most modern devices can handle very large PDF files without issue."
    },
    {
        question: "Can I use PDFagain offline?",
        answer: "As a Progressive Web App (PWA), PDFagain works offline once loaded. You can install it on your device and use the tools even without an active internet connection."
    },
    {
        question: "How do I install the app?",
        answer: "On Chrome or Edge, click the install icon in the address bar. on mobile, use 'Add to Home Screen'. This gives you a native app-like experience."
    }
];

export default function FaqPage() {
    return (
        <div className="min-h-screen w-full bg-[#FFFBE6] text-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">

                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-[#22D3EE] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                        <HelpCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-wider text-shadow-hard">
                        Freq. Asked Questions
                    </h1>
                    <p className="text-xl font-sans max-w-2xl mx-auto border-l-4 border-[#FBBF24] pl-4 italic bg-white/50 p-2">
                        Everything you need to know about our 100% free, private, and local PDF tools.
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-block p-8 border-2 border-black bg-[#A3E635] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-display text-2xl font-bold mb-2">STILL HAVE QUESTIONS?</h3>
                        <p className="font-sans mb-4">We're here to help.</p>
                        <RetroButton
                            label="CONTACT SUPPORT"
                            href="/contact"
                            variant="indigo"
                            className="text-xl px-8 py-4"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
