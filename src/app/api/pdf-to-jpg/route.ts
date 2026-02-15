export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from 'canvas';
import JSZip from 'jszip';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';
import path from 'path';
import { pathToFileURL } from 'url';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

        const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(arrayBuffer),
            disableFontFace: true,
            useSystemFonts: true,
        });

        const pdfDocument = await loadingTask.promise;
        const zip = new JSZip();

        // Process sequentially to manage memory in serverless
        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext("2d");

            await page.render({
                canvasContext: context as any,
                viewport: viewport,
            } as any).promise;

            const buffer = canvas.toBuffer("image/jpeg");
            zip.file(`page_${i}.jpg`, buffer);

            page.cleanup();
        }

        const zipContent = await zip.generateAsync({ type: "nodebuffer" });

        return new NextResponse(zipContent as any, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="pdf_images.zip"',
                'Content-Length': zipContent.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during conversion");
    }
}
