

import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { blogPosts } from "@/config/blog";
import { RETRO_COLORS } from "@/config/design";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const post = blogPosts.find((p) => p.id === id);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | PDF Tools Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            url: `/blog/${post.id}`,
            images: [
                {
                    url: "/og-image.jpg", // Assuming a default OG image exists or will be added
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { id } = await params;
    const post = blogPosts.find((p) => p.id === id);

    if (!post) {
        notFound();
    }

    const colors = RETRO_COLORS[post.color] || RETRO_COLORS.default;

    return (
        <article className="flex flex-col items-center w-full max-w-4xl mx-auto pt-8 pb-24 px-4">

            {/* Back Navigation */}
            <div className="w-full mb-12">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 font-display font-bold uppercase text-sm tracking-wide hover:underline decoration-2 underline-offset-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>
            </div>

            {/* Header Section */}
            <header className="w-full text-center mb-16 space-y-8">
                <div className={`inline-block px-4 py-1.5 border-2 border-black font-display font-bold uppercase text-sm tracking-widest ${colors.bg} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    {post.category}
                </div>

                <h1 className="text-4xl md:text-6xl font-display font-black uppercase leading-tight tracking-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 font-sans font-medium border-y-2 border-gray-100 py-6 max-w-2xl mx-auto">

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="w-full bg-white border-2 border-black p-8 md:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div
                    className="prose prose-lg prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-p:font-sans prose-p:leading-relaxed max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>

            {/* Footer / Share */}
            <div className="w-full mt-12 flex justify-between items-center border-t-2 border-black pt-8">
                <div className="font-display font-bold text-xl uppercase">
                    Thanks for reading!
                </div>

            </div>

        </article>
    );
}
