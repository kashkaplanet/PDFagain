import fs from 'fs';
import { Request, Response } from 'express';
import { createCanvas } from 'canvas';
import JSZip from 'jszip';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import path from 'path';
import { pathToFileURL } from 'url';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "PDF file is required");
        }

        const arrayBuffer = await fs.promises.readFile(file.path);
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

        res.set({
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="pdf_images.zip"',
                'Content-Length': zipContent.length.toString(),
            });
        return res.send(zipContent as any);

    } catch (error) {
        return handleApiError(res, error, "Internal server error during conversion");
    }
}
