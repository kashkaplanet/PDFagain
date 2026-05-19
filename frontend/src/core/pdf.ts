import { PDFDocument, degrees } from 'pdf-lib';

/**
 * Merges multiple PDF files into a single PDF.
 * @param files Array of File objects to merge
 * @returns Blob of the merged PDF
 */
export async function mergePDFs(files: File[]): Promise<Blob> {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
        });
    }

    const mergedPdfBytes = await mergedPdf.save();
    return new Blob([mergedPdfBytes as BlobPart], { type: 'application/pdf' });
}

/**
 * Extracts specific pages from a PDF to create a new PDF.
 * @param file The source PDF file
 * @param pageIndices Array of 0-based page indices to include
 * @returns Blob of the new PDF
 */
export async function extractPages(file: File, pageIndices: number[]): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((page) => {
        newPdf.addPage(page);
    });

    const newPdfBytes = await newPdf.save();
    return new Blob([newPdfBytes as BlobPart], { type: 'application/pdf' });
}

/**
 * Splits a PDF into multiple single-page PDFs (zipped).
 * @param file The source PDF file
 * @returns Blob of the ZIP file containing single-page PDFs
 */
export async function splitPdfToZip(file: File): Promise<Blob> {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const pageCount = srcPdf.getPageCount();
    const baseName = file.name.replace('.pdf', '');

    for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(srcPdf, [i]);
        newPdf.addPage(page);
        const pdfBytes = await newPdf.save();
        zip.file(`${baseName}_page_${i + 1}.pdf`, pdfBytes);
    }

    return await zip.generateAsync({ type: 'blob' });
}

/**
 * Quality presets for PDF compression.
 * Each preset controls JPEG quality and render scale to balance size vs visual fidelity.
 */
const COMPRESSION_PRESETS = {
    extreme: { jpegQuality: 0.35, scale: 1.0 },
    recommended: { jpegQuality: 0.65, scale: 1.5 },
    less: { jpegQuality: 0.85, scale: 2.0 },
} as const;

/**
 * Compresses a PDF by rasterizing each page to JPEG and re-embedding into a new PDF.
 * This achieves real compression (often 50%+) by converting all page content to
 * optimized JPEG bitmaps at configurable quality levels.
 * 
 * @param file The source PDF file
 * @param quality Compression preset: 'extreme' (~70-80% reduction), 'recommended' (~40-60%), 'less' (~20-30%)
 * @param onProgress Optional callback reporting progress (0-100)
 * @returns Blob of the compressed PDF
 */
export async function compressPDF(
    file: File,
    quality: 'extreme' | 'recommended' | 'less' = 'recommended',
    onProgress?: (percent: number) => void,
): Promise<Blob> {
    const { jpegQuality, scale } = COMPRESSION_PRESETS[quality];

    // --- Load the PDF with PDF.js for rendering ---
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/workers/pdf.worker.min.mjs';
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
    const totalPages = pdfDoc.numPages;

    // --- Create a new PDF with pdf-lib to hold the compressed pages ---
    const newPdf = await PDFDocument.create();

    // Use an offscreen canvas for rendering
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Clear and render the page
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Fill white background (JPEG doesn't support transparency)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await (page.render({ canvasContext: ctx, viewport } as any).promise);

        // Convert canvas to JPEG blob
        const jpegDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
        const jpegBytes = await fetch(jpegDataUrl).then(r => r.arrayBuffer());

        // Embed the JPEG into the new PDF
        const jpegImage = await newPdf.embedJpg(new Uint8Array(jpegBytes));

        // Original page dimensions (in PDF points at 72 DPI)
        const origViewport = page.getViewport({ scale: 1 });
        const newPage = newPdf.addPage([origViewport.width, origViewport.height]);
        newPage.drawImage(jpegImage, {
            x: 0,
            y: 0,
            width: origViewport.width,
            height: origViewport.height,
        });

        onProgress?.(Math.round((i / totalPages) * 100));
    }

    const pdfBytes = await newPdf.save({ useObjectStreams: true });
    pdfDoc.destroy();
    return new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
}

export interface PageOrder {
    index: number; // Original 0-based index
    rotation: number; // Additional rotation (0, 90, 180, 270)
}

/**
 * Creates a new PDF by reordering, rotating, and filtering pages from the source.
 * @param file The source PDF file
 * @param pageOrders Array of page configs. Only pages in this array are included in the output.
 * @returns Blob of the organized PDF
 */
export async function organizePDF(file: File, pageOrders: PageOrder[]): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    const indices = pageOrders.map(p => p.index);
    const copiedPages = await newPdf.copyPages(srcPdf, indices);

    copiedPages.forEach((page, i) => {
        const rotationToAdd = pageOrders[i].rotation;
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotationToAdd) % 360));
        newPdf.addPage(page);
    });

    const newPdfBytes = await newPdf.save();
    return new Blob([newPdfBytes as BlobPart], { type: 'application/pdf' });
}
