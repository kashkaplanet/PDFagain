"use client";

import React, { useState } from "react";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroFileItem, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
// import { mergePDFs } from "@/core/pdf";
import { Download, Combine } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { usePdfTask } from "@/hooks/usePdfTask";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";

export default function MergePdfClient() {
    const [files, setFiles] = useState<File[]>([]);

    useGlobalFileDrop({
        onFilesSelected: (newFiles) => {
            setFiles((prev) => [...prev, ...newFiles]);
            setError(null);
            reset();
        },
        accept: { "application/pdf": [".pdf"] },
    });

    // Use shared task hook
    const { isProcessing, progress, error: taskError, execute, reset } = usePdfTask<Blob>();
    const [error, setError] = useState<string | null>(null);

    // Sync task error to local error state if needed, or just use taskError
    // We'll use a combined approach or effects. For simplicity let's rely on hook's error.

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles]);
        setError(null);
        reset();
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setError(null);
        reset();
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFiles(items);
        setError(null);
        reset();
    };

    const handleMerge = async () => {
        if (files.length === 0) return;

        await execute(async (signal, updateProgress) => {
            return new Promise<Blob>((resolve, reject) => {
                const worker = new Worker('/workers/pdf-worker.js');

                // Read files as ArrayBuffers to send to worker
                Promise.all(files.map(f => f.arrayBuffer())).then(buffers => {
                    worker.postMessage({
                        type: 'merge',
                        payload: buffers,
                        id: 'merge-job'
                    }, buffers); // Transfer buffers
                }).catch(reject);

                worker.onmessage = (e) => {
                    const { type, result, error, progress } = e.data;

                    if (signal.aborted) {
                        worker.terminate();
                        reject(new Error("Cancelled"));
                        return;
                    }

                    if (type === 'complete') {
                        // result is Uint8Array
                        const blob = new Blob([result], { type: 'application/pdf' });
                        worker.terminate();

                        // Auto-download
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `merged_${new Date().toISOString()}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        resolve(blob);
                    } else if (type === 'error') {
                        worker.terminate();
                        reject(new Error(error));
                    } else if (type === 'progress') {
                        updateProgress(progress);
                    }
                };

                worker.onerror = (err) => {
                    worker.terminate();
                    reject(new Error("Worker error: " + err.message));
                };

                signal.addEventListener('abort', () => {
                    worker.terminate();
                    reject(new Error("Cancelled"));
                });
            });
        });
    };

    return (
        <ToolPageWrapper
            title="Merge PDF"
            description="Combine multiple PDFs into one unified document."
            icon={Combine}
            color="pink"
        >
            {files.length === 0 ? (
                <RetroCard>
                    <RetroFileUploader
                        onFilesSelected={handleFilesSelected}
                        title="Select PDF Files to Merge"
                        description="Drag & drop or click to browse"
                        variant="pink"
                    />
                </RetroCard>
            ) : (
                <RetroCard>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-display">
                            {files.length} Files Selected
                        </h2>
                        <button
                            onClick={() => { setFiles([]); setError(null); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                        >
                            Clear All
                        </button>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="files-list">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-3 mb-8"
                                >
                                    {files.map((file, index) => (
                                        <Draggable
                                            key={`${file.name}-${index}`}
                                            draggableId={`${file.name}-${index}`}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <RetroFileItem
                                                        name={file.name}
                                                        size={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                                        index={index}
                                                        onRemove={() => removeFile(index)}
                                                        color="pink"
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    {(error || taskError) && (
                        <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans mb-6">
                            {error || taskError}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="sm:w-1/2">
                            <RetroFileUploader
                                onFilesSelected={handleFilesSelected}
                                title="Add More Files"
                                description="Drop or click"
                                variant="pink"
                                compact={true}
                            />
                        </div>
                        <div className="sm:w-1/2">
                            <RetroActionButton
                                label="Merge PDFs"
                                isProcessing={isProcessing}
                                processingText={progress ? `Merging ${progress.current}/${progress.total}...` : "Merging..."}
                                onClick={handleMerge}
                                disabled={files.length < 2}
                                color="pink"
                                icon={<Download className="w-5 h-5" />}
                                className="h-full"
                            />
                        </div>
                    </div>
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
