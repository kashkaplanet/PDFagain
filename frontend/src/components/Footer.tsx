"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t-2 border-black bg-white pt-12 pb-8 mt-12 relative overflow-hidden">
            {/* Decorative background stripes */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F472B6] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22D3EE] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">

                    {/* Popular Tools */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-2 border-black inline-block py-1 bg-[#A3E635] px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Popular Tools
                        </h3>
                        <ul className="space-y-3 font-medium">
                            <li><Link href="/merge-pdf" className="hover:text-[#A3E635] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Merge PDF</Link></li>
                            <li><Link href="/split-pdf" className="hover:text-[#A3E635] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Split PDF</Link></li>
                            <li><Link href="/compress-pdf" className="hover:text-[#A3E635] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Compress PDF</Link></li>
                            <li><Link href="/word-to-pdf" className="hover:text-[#A3E635] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Convert PDF</Link></li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-2 border-black inline-block py-1 bg-[#22D3EE] px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Features
                        </h3>
                        <ul className="space-y-3 font-medium">
                            <li><Link href="/chat" className="hover:text-[#22D3EE] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />AI Chat</Link></li>
                            <li><Link href="/sign-pdf" className="hover:text-[#22D3EE] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Sign PDF</Link></li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-2 border-black inline-block py-1 bg-[#A78BFA] px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Company
                        </h3>
                        <ul className="space-y-3 font-medium">
                            <li><Link href="/blog" className="hover:text-[#A78BFA] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Blog</Link></li>
                            <li><Link href="/faq" className="hover:text-[#A78BFA] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />FAQ</Link></li>
                            <li><Link href="/about" className="hover:text-[#A78BFA] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-[#A78BFA] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-2 border-black inline-block py-1 bg-[#F472B6] px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Legal
                        </h3>
                        <ul className="space-y-3 font-medium">
                            <li><Link href="/security" className="hover:text-[#F472B6] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Security</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#F472B6] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#F472B6] transition-colors flex items-center gap-1 group"><span className="w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t-2 border-dashed border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium text-gray-500">
                    <div>
                        © {new Date().getFullYear()} PDFagain.
                    </div>
                    <div className="flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> by PDFagain Team
                    </div>
                </div>
            </div>
        </footer>
    );
}


