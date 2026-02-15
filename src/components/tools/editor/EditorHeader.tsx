import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Undo2,
    Redo2,
    ZoomOut,
    ZoomIn,
    Download,
    Loader2,
    Search,
    Keyboard as KeyboardIcon,
    FileText,
    RotateCw
} from 'lucide-react';
import clsx from 'clsx';

interface EditorHeaderProps {
    file: File | null;
    currentPage: number;
    pageCount: number;
    zoom: number;
    historyIndex: number;
    historyLength: number;
    isProcessing: boolean;
    onPageChange: (page: number) => void;
    onUndo: () => void;
    onRedo: () => void;
    onZoomChange: (zoom: number) => void;
    onExport: () => void;
    onSearch: () => void;
    onShortcuts: () => void;
}

export function EditorHeader({
    file,
    currentPage,
    pageCount,
    zoom,
    historyIndex,
    historyLength,
    isProcessing,
    onPageChange,
    onUndo,
    onRedo,
    onZoomChange,
    onExport,
    onSearch,
    onShortcuts
}: EditorHeaderProps) {
    if (!file) return null;

    const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

    return (
        <header className="h-12 border-b-2 border-black bg-white flex items-center justify-between px-4 z-20 select-none">
            {/* Left - File Info & Navigation */}
            <div className="flex items-center gap-4">
                {/* File Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F87171] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <FileText className="w-4 h-4" />
                    <span className="font-display text-xs uppercase tracking-wide truncate max-w-[140px]">
                        {file.name.replace('.pdf', '')}
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-black" />

                {/* Page Navigation */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="px-3 py-1 border-2 border-black bg-[#FFFBE6] font-mono text-sm min-w-[70px] text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {currentPage + 1} / {pageCount}
                    </div>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === pageCount - 1}
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Center - Undo/Redo & Zoom */}
            <div className="flex items-center gap-4">
                {/* Undo/Redo */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onUndo}
                        disabled={historyIndex <= 0}
                        title="Undo (Ctrl+Z)"
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={historyIndex >= historyLength - 1}
                        title="Redo (Ctrl+Shift+Z)"
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <Redo2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-black" />

                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
                        title="Zoom Out"
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>

                    <select
                        value={zoom}
                        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                        className="px-2 py-1 border-2 border-black bg-white font-mono text-sm min-w-[80px] text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer focus:outline-none"
                    >
                        {zoomLevels.map(level => (
                            <option key={level} value={level}>{Math.round(level * 100)}%</option>
                        ))}
                    </select>

                    <button
                        onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
                        title="Zoom In"
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onZoomChange(1)}
                        title="Reset Zoom"
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onSearch}
                    title="Search (Ctrl+F)"
                    className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                    <Search className="w-4 h-4" />
                </button>

                <button
                    onClick={onShortcuts}
                    title="Keyboard Shortcuts (?)"
                    className="p-1.5 border-2 border-black bg-white hover:bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                    <KeyboardIcon className="w-4 h-4" />
                </button>

                {/* Export Button */}
                <button
                    onClick={onExport}
                    disabled={isProcessing}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-1.5 border-2 border-black font-display uppercase tracking-wide text-sm transition-all",
                        isProcessing
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#A855F7] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                    )}
                >
                    {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    <span>{isProcessing ? 'Saving...' : 'Export'}</span>
                </button>
            </div>
        </header>
    );
}
