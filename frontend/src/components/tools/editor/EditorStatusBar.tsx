import React from 'react';
import { Tool } from './EditorToolbar';

interface EditorStatusBarProps {
    activeTool: Tool;
    pdfDimensions: { width: number; height: number };
    zoom: number;
}

const toolLabels: Record<Tool, string> = {
    'select': 'Select',
    'edit-text': 'Edit Text',
    'text': 'Add Text',
    'draw': 'Draw',
    'eraser': 'Eraser',
    'highlight': 'Highlight',
    'rectangle': 'Rectangle',
    'circle': 'Circle',
    'line': 'Line',
    'arrow': 'Arrow',
    'sticky-note': 'Sticky Note',
    'redact': 'Redact',
    'image': 'Image',
    'signature': 'Signature',
    'stamp': 'Stamp',
};

export function EditorStatusBar({ activeTool, pdfDimensions, zoom }: EditorStatusBarProps) {
    return (
        <div className="h-8 border-t-2 border-black bg-[#FFFBE6] flex items-center justify-between px-4 text-xs font-display uppercase tracking-wide select-none">
            {/* Left - Current Tool */}
            <div className="flex items-center gap-3">
                <span className="text-gray-500">Tool:</span>
                <span className="px-2 py-0.5 bg-[#A855F7] text-white border border-black">
                    {toolLabels[activeTool] || activeTool}
                </span>
            </div>

            {/* Center - Keyboard Hints */}
            <div className="flex items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-black text-[10px] font-mono">Ctrl+Z</kbd>
                    <span>Undo</span>
                </span>
                <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-black text-[10px] font-mono">Ctrl+S</kbd>
                    <span>Export</span>
                </span>
                <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-black text-[10px] font-mono">?</kbd>
                    <span>Shortcuts</span>
                </span>
            </div>

            {/* Right - Document Info */}
            <div className="flex items-center gap-4">
                <span className="text-gray-500">
                    {Math.round(pdfDimensions.width)} × {Math.round(pdfDimensions.height)} px
                </span>
                <span className="px-2 py-0.5 bg-black text-white">
                    {Math.round(zoom * 100)}%
                </span>
            </div>
        </div>
    );
}
