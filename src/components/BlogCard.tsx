"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { RETRO_COLORS } from "@/config/design";
import type { BlogPost } from "@/config/blog";

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    const colors = RETRO_COLORS[post.color] || RETRO_COLORS.default;

    return (
        <Link href={`/blog/${post.id}`} className="block h-full group">
            <div className="h-full flex flex-col bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200">
                {/* Category Tag (Top Line) */}
                <div className={`px-4 py-2 border-b-2 border-black font-display font-bold uppercase text-sm tracking-wider ${colors.bg}`}>
                    {post.category}
                </div>

                {/* Content Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs font-sans text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                        </span>
                    </div>

                    <h3 className="text-2xl font-display font-black leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4">
                        {post.title}
                    </h3>

                    <p className="text-gray-600 font-sans mb-6 line-clamp-3 flex-1 leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-end pt-4 border-t-2 border-gray-100 mt-auto">

                        <span className="inline-flex items-center justify-center w-10 h-10 border-2 border-black hover:bg-black hover:text-white transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
