"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItemProps {
    question: string;
    answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white transition-all duration-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide">
                    {question}
                </span>
                <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                        <div className="bg-[#F472B6] p-1 border-2 border-black">
                            <Minus className="w-6 h-6" />
                        </div>
                    ) : (
                        <div className="bg-[#A3E635] p-1 border-2 border-black">
                            <Plus className="w-6 h-6" />
                        </div>
                    )}
                </div>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="p-4 sm:p-6 pt-0 font-sans text-lg text-gray-800 leading-relaxed border-t-2 border-black border-dashed mt-2">
                    {answer}
                </div>
            </div>
        </div>
    );
}
