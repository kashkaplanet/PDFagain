"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FileContextType {
    files: File[];
    setFiles: (files: File[]) => void;
    addFiles: (files: File[]) => void;
    clearFiles: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
    const [files, setFilesState] = useState<File[]>([]);

    const setFiles = (newFiles: File[]) => {
        setFilesState(newFiles);
    };

    const addFiles = (newFiles: File[]) => {
        setFilesState((prev) => [...prev, ...newFiles]);
    };

    const clearFiles = () => {
        setFilesState([]);
    };

    return (
        <FileContext.Provider value={{ files, setFiles, addFiles, clearFiles }}>
            {children}
        </FileContext.Provider>
    );
}

export function useFileContext() {
    const context = useContext(FileContext);
    if (context === undefined) {
        throw new Error("useFileContext must be used within a FileProvider");
    }
    return context;
}
