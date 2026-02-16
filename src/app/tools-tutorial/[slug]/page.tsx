"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, CheckCircle } from "lucide-react";
import { allTools, type Tool, type TutorialStep } from "@/config/tools";
import { RETRO_COLORS } from "@/config/design";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function ToolTutorialPage({ params }: PageProps) {
    // Unwrap params using use() hook as they are promises in Next.js 15+ (or compatible structure)
    // If using older Next.js, standard props access works, but adhering to newer patterns is safer.
    // However, since the user environment might be Next 13/14, standard await or props might differ.
    // Given the "use client" directive, this component receives params as props directly in some versions,
    // but in Server Components it's a promise. "use client" implies we might need to be careful.
    // Actually, simply treating it as a prop is standard for client pages if strictly typed, but let's safely handle it.
    // For simplicity in a client component, we often just read props. 
    // BUT 'params' in page.tsx is usually server-side context unless explicitly passed. 
    // Let's assume standard Next.js 13+ App Router behavior where params is an object.

    // safe approach for 'use client' page receiving params:
    const { slug } = use(params);

    const toolHref = `/${slug}`;
    const tool = allTools.find((t) => t.href === toolHref);

    if (!tool) {
        notFound();
    }

    const colorKey = (tool as any).sectionColor as keyof typeof RETRO_COLORS || 'default';
    const colors = RETRO_COLORS[colorKey];
    const Icon = tool.icon;

    const steps = tool.tutorialSteps || [
        { title: "Open Tool", description: `Navigate to the ${tool.name} tool page.` },
        { title: "Upload File", description: "Select or drag and drop your file into the upload area." },
        { title: "Process", description: "Adjust any available settings and click the action button." },
        { title: "Download", description: "Save your processed file to your device." }
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto pt-8 pb-20 px-4">
            {/* Back Link */}
            <div className="w-full mb-8">
                <Link
                    href="/tools-tutorial"
                    className="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tutorials
                </Link>
            </div>

            {/* Hero Header */}
            <div className="w-full flex flex-col md:flex-row gap-8 items-start mb-16 border-b-4 border-black pb-12">
                <div className={`p-6 border-2 border-black ${colors.bg} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                    <Icon className="w-16 h-16 text-black" />
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-bold border-2 border-black bg-white uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                            Tutorial
                        </span>
                        {(tool as any).sectionTitle && (
                            <span className="px-3 py-1 text-xs font-bold bg-black text-white uppercase tracking-wider">
                                {(tool as any).sectionTitle}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight uppercase">
                        How to use {tool.name}
                    </h1>
                    <p className="text-xl text-gray-700 font-sans max-w-2xl leading-relaxed">
                        {tool.description} Follow these simple steps to get started.
                    </p>
                </div>
            </div>

            {/* Steps Section */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div className="space-y-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 group">
                            <div className={`
                                flex-shrink-0 w-12 h-12 flex items-center justify-center 
                                border-2 border-black bg-white font-display font-black text-xl
                                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 transition-transform
                            `}>
                                {index + 1}
                            </div>
                            <div className="pt-2">
                                <h3 className="font-display font-bold text-xl mb-2 uppercase tracking-wide">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 font-sans leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action Card */}
                <div className="relative">
                    <div className="sticky top-24">
                        <div className="bg-[#FFFBE6] border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
                            <h3 className="text-2xl font-display font-black uppercase text-center">
                                Ready to {tool.name.toLowerCase()}?
                            </h3>
                            <p className="text-center text-gray-700 font-sans">
                                Its fast, free, and runs entirely in your browser. No software installation needed.
                            </p>

                            <Link
                                href={tool.href}
                                className={`
                                    flex items-center justify-center gap-3 w-full py-4 
                                    border-2 border-black bg-[#FACC15] 
                                    font-display font-black text-xl uppercase tracking-widest
                                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                                    hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
                                    hover:translate-x-[2px] hover:translate-y-[2px] 
                                    transition-all
                                `}
                            >
                                Open {tool.name}
                                <ExternalLink className="w-5 h-5" />
                            </Link>

                            <div className="pt-6 border-t-2 border-dashed border-black/10 text-sm space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>No sign-up required</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Files stay private</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
