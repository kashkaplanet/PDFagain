"use client";

import React, { useState } from "react";
import { RetroCard } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Pencil } from "lucide-react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";

export default function EditPdfClient() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    return (
        <ToolPageWrapper
            title="Edit PDF"
            description="Add text, images, and shapes to your PDF documents."
            icon={Pencil}
            color="orange"
        >
            <RetroCard>
                <div className="text-center p-8">
                    {!file ? (
                        <RetroFileUploader
                            onFilesSelected={handleFileSelected}
                            multiple={false}
                            accept={{ "application/pdf": [".pdf"] }}
                            title="Select PDF to Edit"
                            description="Drag & drop or click to browse"
                            variant="orange"
                        />
                    ) : (
                        <div className="space-y-4">
                            <p className="font-display text-xl">Editor Loading...</p>
                            <p className="text-gray-600">The full editor experience is coming soon.</p>
                            <button
                                onClick={() => setFile(null)}
                                className="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 font-display text-sm"
                            >
                                Change File
                            </button>
                        </div>
                    )}
                </div>
            </RetroCard>
        </ToolPageWrapper>
    );
}
