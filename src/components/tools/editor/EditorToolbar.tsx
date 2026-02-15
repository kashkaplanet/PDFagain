import React from 'react';
import {
    MousePointer,

    Type,
    Pencil,
    Eraser,
    Highlighter,
    Square,
    Circle,
    Minus,
    Image as ImageIcon,
    Trash2,
    Stamp,
    PenTool,
    ArrowRight,
    MessageSquare,
} from 'lucide-react';
import clsx from 'clsx';

export type Tool = "select" | "text" | "rectangle" | "circle" | "line" | "arrow" | "draw" | "eraser" | "image" | "highlight" | "edit-text" | "redact" | "signature" | "stamp" | "sticky-note";

export type EditorMode = 'edit' | 'annotate';

interface EditorToolbarProps {
    activeTool: Tool;
    onToolChange: (tool: Tool) => void;
    strokeColor: string;
    onStrokeColorChange: (color: string) => void;
    fillColor: string;
    onFillColorChange: (color: string) => void;
    onDelete: () => void;
    onImageUpload: () => void;
    onSignature: () => void;
    onStamp: (e: React.MouseEvent) => void;
    hasSelection: boolean;
}

export function EditorToolbar({
    activeTool,
    onToolChange,
    strokeColor,
    onStrokeColorChange,
    fillColor,
    onFillColorChange,
    onDelete,
    onImageUpload,
    onSignature,
    onStamp,
    hasSelection
}: EditorToolbarProps) {

    const allTools: { id: Tool; icon: React.ReactNode; label: string; shortcut?: string; group: string }[] = [
        { id: "select", icon: <MousePointer className="w-4 h-4" />, label: "Select", shortcut: "V", group: "basic" },
        { id: "text", icon: <Type className="w-4 h-4" />, label: "Add Text", shortcut: "T", group: "basic" },
        { id: "draw", icon: <Pencil className="w-4 h-4" />, label: "Draw", shortcut: "D", group: "draw" },
        { id: "eraser", icon: <Eraser className="w-4 h-4" />, label: "Eraser", shortcut: "X", group: "draw" },
        { id: "highlight", icon: <Highlighter className="w-4 h-4" />, label: "Highlight", shortcut: "H", group: "draw" },
        { id: "rectangle", icon: <Square className="w-4 h-4" />, label: "Rectangle", shortcut: "R", group: "shapes" },
        { id: "circle", icon: <Circle className="w-4 h-4" />, label: "Circle", shortcut: "C", group: "shapes" },
        { id: "line", icon: <Minus className="w-4 h-4" />, label: "Line", shortcut: "L", group: "shapes" },
        { id: "arrow", icon: <ArrowRight className="w-4 h-4" />, label: "Arrow", shortcut: "A", group: "shapes" },
        { id: "sticky-note", icon: <MessageSquare className="w-4 h-4" />, label: "Sticky Note", shortcut: "S", group: "annotate" },
        { id: "redact", icon: <Square className="w-4 h-4 fill-current" />, label: "Redact", shortcut: "W", group: "annotate" },
    ];

    const ToolButton = ({ tool }: { tool: typeof allTools[0] }) => (
        <button
            onClick={() => onToolChange(tool.id)}
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            className={clsx(
                "w-9 h-9 flex items-center justify-center border-2 border-black transition-all duration-150",
                activeTool === tool.id
                    ? "bg-[#A855F7] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white hover:bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
            )}
        >
            {tool.icon}
        </button>
    );

    const Separator = () => <div className="w-px h-8 bg-black mx-1" />;

    return (
        <div className="h-12 border-b-2 border-black bg-[#FFFBE6] flex items-center px-3 gap-1 select-none overflow-x-auto">
            {/* Basic Tools */}
            <div className="flex items-center gap-1">
                {allTools.filter(t => t.group === 'basic').map(tool => (
                    <ToolButton key={tool.id} tool={tool} />
                ))}
            </div>

            <Separator />

            {/* Draw Tools */}
            <div className="flex items-center gap-1">
                {allTools.filter(t => t.group === 'draw').map(tool => (
                    <ToolButton key={tool.id} tool={tool} />
                ))}
            </div>

            <Separator />

            {/* Shape Tools with Dropdown indicator */}
            <div className="flex items-center gap-1">
                {allTools.filter(t => t.group === 'shapes').map(tool => (
                    <ToolButton key={tool.id} tool={tool} />
                ))}
            </div>

            <Separator />

            {/* Annotate Tools */}
            <div className="flex items-center gap-1">
                {allTools.filter(t => t.group === 'annotate').map(tool => (
                    <ToolButton key={tool.id} tool={tool} />
                ))}
            </div>

            <Separator />

            {/* Special Actions */}
            <button
                onClick={onSignature}
                title="Add Signature"
                className="w-9 h-9 flex items-center justify-center border-2 border-black bg-[#F472B6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
                <PenTool className="w-4 h-4" />
            </button>

            <button
                onClick={onStamp}
                title="Add Stamp"
                className="w-9 h-9 flex items-center justify-center border-2 border-black bg-[#22D3EE] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
                <Stamp className="w-4 h-4" />
            </button>

            <button
                onClick={onImageUpload}
                title="Add Image (I)"
                className="w-9 h-9 flex items-center justify-center border-2 border-black bg-[#A3E635] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
                <ImageIcon className="w-4 h-4" />
            </button>

            <Separator />

            {/* Colors */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <div className="w-7 h-7 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer overflow-hidden">
                        <input
                            type="color"
                            value={strokeColor}
                            onChange={(e) => onStrokeColorChange(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            title="Stroke Color"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: strokeColor }} />
                    </div>
                </div>
                <div className="relative">
                    <div className="w-7 h-7 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer overflow-hidden">
                        <input
                            type="color"
                            value={fillColor}
                            onChange={(e) => onFillColorChange(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            title="Fill Color"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: fillColor }} />
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Delete Button */}
            <button
                onClick={onDelete}
                disabled={!hasSelection}
                title="Delete (Del)"
                className={clsx(
                    "w-9 h-9 flex items-center justify-center border-2 border-black transition-all",
                    hasSelection
                        ? "bg-[#F87171] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                )}
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
