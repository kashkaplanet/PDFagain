import React, { useState, useEffect } from "react";
import { MessageSquare, X, Check } from "lucide-react";

interface StickyNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (text: string) => void;
    initialText?: string;
}

export function StickyNoteModal({ isOpen, onClose, onSave, initialText = "" }: StickyNoteModalProps) {
    const [text, setText] = useState(initialText);

    useEffect(() => {
        setText(initialText);
    }, [initialText, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1e1e20] border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#252528]">
                    <div className="flex items-center gap-2 text-zinc-100">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-yellow-500" />
                        </div>
                        <h2 className="font-medium">Add Sticky Note</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Note Content</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type your note here..."
                            className="w-full h-32 bg-[#2a2a2d] border border-white/10 rounded-lg p-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 hover:bg-white/5 text-zinc-300 rounded-lg transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onSave(text);
                                onClose();
                            }}
                            disabled={!text.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Check className="w-4 h-4" />
                            Add Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
