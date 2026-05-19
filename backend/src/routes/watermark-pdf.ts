

import { Request, Response } from 'express';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);
        const text = (req.body || {}).text as string | null;

        if (!file || !text) {
            return handleBadRequest(res, "PDF file and watermark text are required");
        }

        const arrayBuffer = file.buffer;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        pages.forEach((page) => {
            const { width, height } = page.getSize();
            // Basic watermark: centered, diagonal, red
            // Use standard font (Helvetica)
            page.drawText(text, {
                x: width / 2 - (text.length * 10), // Approximate centering
                y: height / 2,
                size: 50,
                color: rgb(0.95, 0.1, 0.1),
                opacity: 0.5,
                rotate: degrees(45),
            });
        });

        const pdfBytes = await pdfDoc.save();

                res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');
        res.setHeader('Content-Length', 'pdfBytes.length.toString()');
        return res.send(Buffer.from(pdfBytes));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during watermarking");
    }
}
