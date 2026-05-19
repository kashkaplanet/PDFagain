import { Request, Response } from 'express';
import { createCanvas } from 'canvas';
import JSZip from 'jszip';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import path from 'path';
import { pathToFileURL } from 'url';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "PDF file is required");
        }

        const arrayBuffer = file.buffer;
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

        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext("2d");

            await page.render({
                canvasContext: context as any,
                viewport: viewport,
            } as any).promise;

            // Convert canvas to PNG buffer first, then to WebP using sharp
            const pngBuffer = canvas.toBuffer("image/png");

            let webpBuffer: Buffer;
            try {
                const sharp = (await import('sharp')).default;
                webpBuffer = await sharp(pngBuffer).webp({ quality: 85 }).toBuffer();
            } catch {
                // Fallback: if sharp is not available, use PNG and rename
                webpBuffer = pngBuffer;
            }

            zip.file(`page_${i}.webp`, webpBuffer);
            page.cleanup();
        }

        const zipContent = await zip.generateAsync({ type: "nodebuffer" });
        const outputFilename = file.originalname.replace(/\.[^/.]+$/, "") + "_webp.zip";

        res.set({
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${outputFilename}"`,
                'Content-Length': zipContent.length.toString(),
            });
        return res.send(zipContent as any);

    } catch (error) {
        return handleApiError(res, error, "Internal server error during WebP conversion");
    }
}
