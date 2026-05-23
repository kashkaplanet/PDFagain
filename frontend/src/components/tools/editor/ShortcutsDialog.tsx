import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ShortcutsDialog({ isOpen, onClose }: ShortcutsDialogProps) {
    if (!isOpen) return null;

    const shortcuts = [
        { key: 'V', action: 'Select Tool' },
        { key: 'T', action: 'Add Text' },
        { key: 'E', action: 'Edit Text' },
        { key: 'R', action: 'Rectangle' },
        { key: 'C', action: 'Circle' },
        { key: 'L', action: 'Line' },
        { key: 'Draw', action: 'D' },
        { key: 'W', action: 'Redact' },
        { key: 'H', action: 'Highlight' },
        { key: 'X', action: 'Eraser' },
        { key: 'Del / Backspace', action: 'Delete Selected' },
        { key: 'Esc', action: 'Cancel / Deselect' },
        { key: 'Ctrl + Z', action: 'Undo' },
        { key: 'Ctrl + Shift + Z', action: 'Redo' },
        { key: 'Ctrl + S', action: 'Export PDF' },
        { key: '+ / -', action: 'Zoom In / Out' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#252526] border border-white/10 rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-violet-500/10 rounded-lg">
                        <Keyboard className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                        <p className="text-xs text-zinc-400">Boost your productivity with these hotkeys</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between pb-2 border-b border-white/5">
                            <span className="text-sm text-zinc-400">{shortcut.action}</span>
                            <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-zinc-300 min-w-[24px] text-center">
                                {shortcut.key}
                            </kbd>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-zinc-500">
                        Press <kbd className="font-mono text-zinc-400">?</kbd> to toggle this dialog anytime
                    </p>
                </div>
            </div>
        </div>
    );
}
