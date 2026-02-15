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
 * Compresses a PDF by maintaining only essential data (basic) or rasterizing pages (strong).
 * Currently implements basic cleanup. Rasterization requires PDF.js which is better handled in the component for now to avoid circular deps or browser-only issues in core.
 * @param file The source PDF file
 * @param quality 'extreme' | 'recommended' | 'less' (Placeholder for future logic)
 * @returns Blob of the compressed PDF
 */
export async function compressPDF(file: File, quality: 'extreme' | 'recommended' | 'less' = 'recommended'): Promise<Blob> {
    // For now, we perform a "save" which can sometimes reduce size by removing unused objects.
    // True compression via rasterization will be handled in the component level for access to Canvas/PDF.js
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);

    // Use standard object streams
    const pdfBytes = await pdf.save({ useObjectStreams: true });
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
