"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ToolPageLayoutProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor: string;
    children: React.ReactNode;
}

export default function ToolPageLayout({
    title,
    description,
    icon: Icon,
    iconColor,
    children,
}: ToolPageLayoutProps) {
    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${iconColor} shadow-lg mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
                        {title}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-xl mx-auto">
                        {description}
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8">
                    {children}
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center p-4 bg-white border-2 border-black">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-black text-sm">100% Free</div>
                            <div className="text-gray-600 text-xs">No hidden charges</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-white border-2 border-black">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-black text-sm">Private & Secure</div>
                            <div className="text-gray-600 text-xs">Files never uploaded</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-white border-2 border-black">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-black text-sm">Lightning Fast</div>
                            <div className="text-gray-600 text-xs">Browser-based processing</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
