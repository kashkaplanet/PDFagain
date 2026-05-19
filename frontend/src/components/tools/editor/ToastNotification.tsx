import React, { useEffect } from 'react';

import { CheckCircle2, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export function ToastNotification({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        error: <XCircle className="w-5 h-5 text-red-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#252526] border border-white/10 rounded-xl shadow-2xl shadow-black/50">
                {icons[type]}
                <span className="text-sm font-medium text-zinc-200">{message}</span>
                <button onClick={onClose} className="ml-4 text-zinc-500 hover:text-white transition-colors">
                    ×
                </button>
            </div>
        </div>
    );
}
