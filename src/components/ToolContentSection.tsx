
"use client";

import React from "react";
import { ToolContent } from "@/config/tool-content";
import { Check, Lock, Shield, Star, WifiOff, Zap, Move, HelpCircle, BookOpen } from "lucide-react";

const icons: Record<string, any> = {
    Check, Lock, Shield, Star, WifiOff, Zap, Move, HelpCircle, BookOpen
};

export function ToolContentSection({ content }: { content: ToolContent }) {
    if (!content) return null;

    return (
        <div className="mt-16 space-y-16">

            {/* How To Section */}
            <section className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-3">
                    <span className="bg-[#FBBF24] border-2 border-black w-10 h-10 flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">?</span>
                    {content.howTo.title}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {content.howTo.steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="text-6xl font-black text-gray-100 absolute -top-8 -left-4 -z-10 select-none">
                                {index + 1}
                            </div>
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold border-2 border-black">
                                    {index + 1}
                                </span>
                                {step.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section>
                <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-3">
                    <span className="bg-[#A78BFA] border-2 border-black w-10 h-10 flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">★</span>
                    Features
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    {content.features.map((feature, index) => {
                        const Icon = icons[feature.icon] || Star;
                        return (
                            <div key={index} className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                                <Icon className="w-8 h-8 mb-4 text-black" />
                                <h3 className="font-bold text-lg mb-2 font-display uppercase tracking-wide">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="border-2 border-black bg-white p-8 mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-3">
                    <span className="bg-[#F472B6] border-2 border-black w-10 h-10 flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Q</span>
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    {content.faq.map((item, index) => (
                        <div key={index} className="border-b-2 border-gray-100 last:border-0 pb-6 last:pb-0">
                            <h3 className="font-bold text-lg mb-2 flex items-start gap-2">
                                <HelpCircle className="w-5 h-5 mt-1 shrink-0 text-gray-400" />
                                {item.question}
                            </h3>
                            <p className="text-gray-600 pl-7 leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
