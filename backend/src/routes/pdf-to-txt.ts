import fs from 'fs';


import { Request, Response } from 'express';
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
            useSystemFonts: true,
            disableFontFace: true,
        });

        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;
        const textParts: string[] = [];

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();

            let lastY = -1;
            let currentLineText = "";
            const lines: string[] = [];

            for (const item of textContent.items) {
                const itemText = (item as any).str;
                const itemY = (item as any).transform[5];

                if (lastY !== -1 && Math.abs(itemY - lastY) > 5) {
                    if (currentLineText.trim()) {
                        lines.push(currentLineText.trimEnd());
                    }
                    currentLineText = "";
                }

                currentLineText += itemText;
                lastY = itemY;
            }

            if (currentLineText.trim()) {
                lines.push(currentLineText.trimEnd());
            }

            if (lines.length > 0) {
                textParts.push(`--- Page ${i} ---\n${lines.join("\n")}`);
            }
        }

        const fullText = textParts.join("\n\n");
        const outputFilename = file.originalname.replace(/\.[^/.]+$/, "") + ".txt";

                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', '`attachment; filename=${outputFilename');
        return res.send(Buffer.from(fullText, 'utf-8'));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during text extraction");
    }
}
