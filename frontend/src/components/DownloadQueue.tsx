"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, CheckCircle2, Loader2, AlertCircle, FileText } from "lucide-react";

interface QueueItem {
    id: string;
    name: string;
    status: "pending" | "processing" | "complete" | "error";
    progress?: number;
    blob?: Blob;
    error?: string;
}

interface DownloadQueueContextType {
    queue: QueueItem[];
    addToQueue: (name: string) => string;
    updateItem: (id: string, updates: Partial<QueueItem>) => void;
    removeItem: (id: string) => void;
    downloadItem: (id: string) => void;
    clearCompleted: () => void;
}

const DownloadQueueContext = createContext<DownloadQueueContextType | undefined>(undefined);

export function DownloadQueueProvider({ children }: { children: React.ReactNode }) {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addToQueue = useCallback((name: string): string => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setQueue(prev => [...prev, { id, name, status: "pending" }]);
        setIsOpen(true);
        return id;
    }, []);

    const updateItem = useCallback((id: string, updates: Partial<QueueItem>) => {
        setQueue(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    }, []);

    const removeItem = useCallback((id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    }, []);

    const downloadItem = useCallback((id: string) => {
        const item = queue.find(q => q.id === id);
        if (item?.blob) {
            const url = URL.createObjectURL(item.blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = item.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }, [queue]);

    const clearCompleted = useCallback(() => {
        setQueue(prev => prev.filter(item => item.status !== "complete"));
    }, []);

    const completedCount = queue.filter(q => q.status === "complete").length;
    const processingCount = queue.filter(q => q.status === "processing").length;

    return (
        <DownloadQueueContext.Provider value={{ queue, addToQueue, updateItem, removeItem, downloadItem, clearCompleted }}>
            {children}

            {/* Floating Queue Button */}
            {queue.length > 0 && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-400 border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                    <Download className="w-6 h-6" />
                    {queue.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 border-2 border-black rounded-full text-xs flex items-center justify-center font-bold text-black">
                            {queue.length}
                        </span>
                    )}
                </motion.button>
            )}

            {/* Queue Panel */}
            <AnimatePresence>
                {isOpen && queue.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-yellow-300 border-b-2 border-black">
                            <div className="flex items-center">
                                <Download className="w-5 h-5 text-black mr-2" />
                                <span className="font-bold text-black uppercase">Downloads</span>
                                {processingCount > 0 && (
                                    <span className="ml-2 text-xs font-bold text-black bg-orange-400 border border-black px-2 py-0.5 rounded-full">
                                        {processingCount} processing
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white rounded border border-transparent hover:border-black transition-all"
                            >
                                <X className="w-4 h-4 text-black" />
                            </button>
                        </div>

                        {/* Queue Items */}
                        <div className="max-h-64 overflow-y-auto">
                            {queue.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center p-3 border-b-2 border-black last:border-b-0 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-200 border-2 border-black flex items-center justify-center mr-3">
                                        <FileText className="w-5 h-5 text-black" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-base font-bold text-black truncate">
                                            {item.name}
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium">
                                            {item.status === "pending" && "Waiting..."}
                                            {item.status === "processing" && `Processing${item.progress ? ` ${item.progress}%` : "..."}`}
                                            {item.status === "complete" && "Ready to download"}
                                            {item.status === "error" && (item.error || "Failed")}
                                        </div>
                                    </div>
                                    <div className="ml-2">
                                        {item.status === "pending" && (
                                            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-black" />
                                        )}
                                        {item.status === "processing" && (
                                            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                                        )}
                                        {item.status === "complete" && (
                                            <button
                                                onClick={() => downloadItem(item.id)}
                                                className="p-1 hover:bg-green-300 rounded border-2 border-transparent hover:border-black transition-all"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            </button>
                                        )}
                                        {item.status === "error" && (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="ml-1 p-1 hover:bg-red-200 rounded border-2 border-transparent hover:border-black transition-all"
                                    >
                                        <X className="w-4 h-4 text-black" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        {completedCount > 0 && (
                            <div className="px-4 py-2 bg-gray-100 border-t-2 border-black">
                                <button
                                    onClick={clearCompleted}
                                    className="text-sm font-bold text-black hover:underline decoration-2"
                                >
                                    Clear {completedCount} completed
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </DownloadQueueContext.Provider>
    );
}

export function useDownloadQueue() {
    const context = useContext(DownloadQueueContext);
    if (context === undefined) {
        throw new Error("useDownloadQueue must be used within a DownloadQueueProvider");
    }
    return context;
}
