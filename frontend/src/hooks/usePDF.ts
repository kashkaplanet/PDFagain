import { useState, useEffect } from 'react';
// import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

export function usePDF(file: File | null) {
    const [pdfProxy, setPdfProxy] = useState<PDFDocumentProxy | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPdfProxy(null);
            setPageCount(0);
            return;
        }

        const loadPdf = async () => {
            setLoading(true);
            setError(null);
            try {
                // const pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
                // const pdfjsLib = pdfjsModule.default || pdfjsModule;

                const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

                if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/workers/pdf.worker.min.mjs';
                }

                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument(arrayBuffer);
                const pdf = await loadingTask.promise;
                setPdfProxy(pdf);
                setPageCount(pdf.numPages);
            } catch (err) {
                console.error("Error loading PDF:", err);
                setError("Failed to load PDF");
            } finally {
                setLoading(false);
            }
        };

        loadPdf();
    }, [file]);

    return { pdfProxy, pageCount, loading, error };
}
