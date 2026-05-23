
import React from 'react';
import { Highlighter, MessageSquare, MousePointer } from 'lucide-react';
import clsx from 'clsx';

interface AnnotationToolbarProps {
    activeTool: string;
    onToolChange: (tool: string) => void;
    settings: any; // Type properly later
    onSettingsChange: (settings: any) => void;
}

export function AnnotationToolbar({ activeTool, onToolChange }: AnnotationToolbarProps) {
    const tools = [
        { id: 'select', icon: <MousePointer className="w-4 h-4" />, label: 'Select' },
        { id: 'highlight', icon: <Highlighter className="w-4 h-4" />, label: 'Highlight' },
        { id: 'sticky-note', icon: <MessageSquare className="w-4 h-4" />, label: 'Sticky Note' },
    ];

    return (
        <div className="w-14 flex flex-col items-center py-3 gap-1.5 bg-gradient-to-b from-indigo-900/50 to-[#252528] border-r border-indigo-500/20 overflow-y-auto z-10 select-none">
            <div className="text-[10px] font-bold text-indigo-400 mb-2 tracking-wider">ANNOTATE</div>

            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => onToolChange(tool.id)}
                    className={clsx(
                        "w-10 h-10 rounded-lg transition-all duration-150 relative group flex items-center justify-center",
                        activeTool === tool.id
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                            : "hover:bg-indigo-500/10 text-zinc-400 hover:text-indigo-300 hover:scale-105"
                    )}
                    title={tool.label}
                >
                    {tool.icon}
                </button>
            ))}
        </div>
    );
}
