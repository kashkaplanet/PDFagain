import React from 'react';
import { CheckCircle2, AlertTriangle, FileText, Ban, Eye } from 'lucide-react';

interface StampMenuProps {
    onSelectStamp: (stampUrl: string | null, label: string) => void;
    onClose: () => void;
}

export function StampMenu({ onSelectStamp }: StampMenuProps) {
    // In a real app, these would be proper SVG images or loaded assets. 
    // Here we'll generate simple SVG data URLs or just pass metadata to be rendered by Fabric

    const stamps = [
        { id: 'approved', label: 'APPROVED', color: '#22c55e', icon: <CheckCircle2 className="w-4 h-4" /> },
        { id: 'rejected', label: 'REJECTED', color: '#ef4444', icon: <Ban className="w-4 h-4" /> },
        { id: 'draft', label: 'DRAFT', color: '#94a3b8', icon: <FileText className="w-4 h-4" /> },
        { id: 'confidential', label: 'CONFIDENTIAL', color: '#ef4444', icon: <AlertTriangle className="w-4 h-4" /> },
        { id: 'reviewed', label: 'REVIEWED', color: '#3b82f6', icon: <Eye className="w-4 h-4" /> },
    ];

    return (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#252526] border border-white/10 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-white/5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Stamps</span>
            </div>
            {stamps.map(stamp => (
                <button
                    key={stamp.id}
                    onClick={() => onSelectStamp(null, stamp.label)} // We'll render text for now
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                    <div className="p-1. rounded-full bg-white/5 text-white" style={{ color: stamp.color }}>
                        {stamp.icon}
                    </div>
                    <span className="text-sm font-medium text-zinc-200" style={{ color: stamp.color }}>{stamp.label}</span>
                </button>
            ))}
        </div>
    );
}
