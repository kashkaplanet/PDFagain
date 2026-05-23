"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Image as ImageIcon, Download } from "lucide-react";
import { usePDF } from "@/hooks/usePDF";
import JSZip from "jszip";

export default function ExtractImagesClient() {
    const [file, setFile] = useState<File | null>(null);
    const { pdfProxy, pageCount, loading: pdfLoading } = usePDF(file);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadReady, setDownloadReady] = useState(false);
    const [imagesFound, setImagesFound] = useState<number>(0);
    const [zipBlob, setZipBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setDownloadReady(false);
            setImagesFound(0);
            setZipBlob(null);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleExtract = async () => {
        if (!pdfProxy) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setImagesFound(0);

        try {
            const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
            const zip = new JSZip();
            let imageCount = 0;

            for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
                const page = await pdfProxy.getPage(pageNum);
                const operatorList = await page.getOperatorList();

                // Find image operators
                for (let i = 0; i < operatorList.fnArray.length; i++) {
                    if (
                        operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject ||
                        operatorList.fnArray[i] === pdfjsLib.OPS.paintInlineImageXObject
                    ) {
                        const imgName = operatorList.argsArray[i][0];
                        try {
                            const img = await page.objs.get(imgName);
                            if (img && img.data && img.width && img.height) {
                                // Create canvas to convert pixel data to image
                                const canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                const ctx = canvas.getContext('2d');
                                
                                if (ctx) {
                                    // Handle different color spaces or just dump clamped array
                                    let imgData;
                                    if (img.data instanceof Uint8ClampedArray && img.data.length === img.width * img.height * 4) {
                                         imgData = new ImageData(img.data, img.width, img.height);
                                    } else {
                                        // Simple fallback: draw using canvas image smoothing if it's an ImageBitmap
                                        imgData = ctx.createImageData(img.width, img.height);
                                        const data = imgData.data;
                                        const src = img.data;
                                        // Assume RGB if length is w*h*3
                                        if (src.length === img.width * img.height * 3) {
                                            for (let j = 0, k = 0; j < src.length; j += 3, k += 4) {
                                                data[k] = src[j];
                                                data[k + 1] = src[j + 1];
                                                data[k + 2] = src[j + 2];
                                                data[k + 3] = 255;
                                            }
                                        }
                                    }
                                    
                                    if (imgData) {
                                        ctx.putImageData(imgData, 0, 0);
                                        
                                        // Convert canvas to blob
                                        const blob = await new Promise<Blob | null>((resolve) => {
                                            canvas.toBlob((b) => resolve(b), "image/png");
                                        });

                                        if (blob) {
                                            imageCount++;
                                            zip.file(`image_${imageCount}_page${pageNum}.png`, blob);
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            console.warn("Could not extract image object", imgName, e);
                        }
                    }
                }
                setProgress(Math.round((pageNum / pageCount) * 100));
            }

            if (imageCount === 0) {
                setError("No embedded images were found in this PDF.");
                setIsProcessing(false);
                return;
            }

            setImagesFound(imageCount);
            const content = await zip.generateAsync({ type: "blob" });
            setZipBlob(content);
            setDownloadReady(true);
        } catch (err) {
            console.error("Failed to extract images:", err);
            setError("An error occurred while extracting images. The PDF might be corrupted or protected.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!zipBlob || !file) return;
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name.replace(".pdf", "_images.zip");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <ToolPageWrapper
            title="Extract Images from PDF"
            description="Pull all embedded pictures out of a PDF document into a single ZIP file."
            icon={ImageIcon}
            color="blue"
        >
            {!file ? (
                <RetroCard className="max-w-2xl mx-auto">
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Select PDF File"
                        description="Upload a PDF to extract its images"
                        variant="blue"
                    />
                </RetroCard>
            ) : (
                <RetroCard className="max-w-xl mx-auto">
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-[#60A5FA]/10 border-2 border-black">
                        <div className="p-3 bg-[#60A5FA] border-2 border-black">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-display truncate">
                                {file.name}
                            </h2>
                            <p className="text-sm text-gray-600 font-sans">
                                {pageCount} pages • {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={() => { setFile(null); setDownloadReady(false); setZipBlob(null); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-sans">
                            {error}
                        </div>
                    )}

                    {isProcessing && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between text-sm font-display mb-2">
                                <span>Scanning and extracting images...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-3 border-2 border-black bg-white overflow-hidden">
                                <div
                                    className="h-full bg-[#60A5FA] transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {!downloadReady && !isProcessing && (
                        <RetroActionButton
                            label="Extract Images"
                            isProcessing={isProcessing}
                            processingText="Extracting..."
                            onClick={handleExtract}
                            disabled={pdfLoading || !pdfProxy}
                            color="blue"
                            icon={<ImageIcon className="w-5 h-5" />}
                        />
                    )}

                    {downloadReady && (
                        <div className="space-y-4">
                            <div className="p-4 bg-[#A3E635]/10 border-2 border-[#A3E635] text-center">
                                <p className="font-display text-lg">
                                    ✓ Extraction complete!
                                </p>
                                <p className="font-sans text-gray-700">
                                    Found {imagesFound} images in the document.
                                </p>
                            </div>
                            <RetroActionButton
                                label="Download Images (ZIP)"
                                onClick={handleDownload}
                                color="blue"
                                icon={<Download className="w-5 h-5" />}
                                isProcessing={false}
                                processingText=""
                            />
                        </div>
                    )}
                </RetroCard>
            )}
        </ToolPageWrapper>
    );
}
