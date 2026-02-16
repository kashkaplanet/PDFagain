"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { RETRO_COLORS } from "@/config/design";

interface TutorialCardProps {
    title: string;
    description: string;
    href: string;
    color?: keyof typeof RETRO_COLORS;
    icon?: React.ElementType;
}

export function TutorialCard({
    title,
    description,
    href,
    color = "pink",
    icon: Icon = BookOpen
}: TutorialCardProps) {
    const colors = RETRO_COLORS[color] || RETRO_COLORS.default;

    return (
        <Link
            href={href}
            className="group relative block h-full"
        >
            <div className={`
                h-full flex flex-col p-6 bg-white border-2 border-black 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
                hover:-translate-y-1 transition-all duration-200
            `}>
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 border-2 border-black ${colors.bg}`}>
                        <Icon className="w-6 h-6 text-black" />
                    </div>
                </div>

                <h3 className="font-display text-xl font-bold mb-2 group-hover:underline decoration-2 underline-offset-4">
                    {title}
                </h3>

                <p className="text-gray-600 font-sans leading-relaxed mb-6 flex-1">
                    {description}
                </p>

                <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 group-hover:border-black transition-colors">
                    <span className="font-display font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        Read Guide
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
