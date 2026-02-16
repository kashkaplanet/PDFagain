import React from "react";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { blogPosts } from "@/config/blog";
import { BlogCard } from "@/components/BlogCard";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
    title: "PDF Tools Blog | Tips, Tricks & Tutorials",
    description: "Master your digital documents with our expert guides on PDF management, security, and productivity.",
    openGraph: {
        title: "PDF Tools Blog | Tips, Tricks & Tutorials",
        description: "Master your digital documents with our expert guides on PDF management, security, and productivity.",
        url: "/blog",
        type: "website",
    },
};

export default function BlogPage() {
    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto pt-12 pb-24 px-4">
            {/* Header */}
            <div className="text-center mb-16 space-y-6">
                <div className="inline-flex p-5 border-2 border-black bg-[#A78BFA] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:rotate-3 transition-transform duration-300 mb-2">
                    <BookOpen className="w-12 h-12 text-black" />
                </div>

                <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter">
                    The PDF Blog
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto font-sans">
                    Tips, tricks, and tutorials to help you master your digital documents.
                </p>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {blogPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            {/* Newsletter / Footer CTA */}
            <div className="w-full mt-24 border-4 border-black bg-[#A3E635] p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl md:text-4xl font-display font-black mb-4 uppercase">
                    Stay Updated
                </h2>
                <p className="text-lg md:text-xl font-sans mb-8 max-w-xl mx-auto">
                    Get the latest PDF tips and product updates delivered straight to your inbox.
                </p>
                <NewsletterForm />
            </div>
        </div>
    );
}
