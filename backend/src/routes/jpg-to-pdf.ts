

import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files as any[];

        if (!files || files.length === 0) {
            return handleBadRequest(res, "Image files are required");
        }

        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
            const buffer = file.buffer;
            let image;

            const name = file.originalname.toLowerCase();
            if (file.mimetype === 'image/png' || name.endsWith(".png")) {
                image = await pdfDoc.embedPng(buffer);
            } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
                image = await pdfDoc.embedJpg(buffer);
            } else {
                continue; // Skip unsupported
            }

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const pdfBytes = await pdfDoc.save();

                res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=images.pdf');
        res.setHeader('Content-Length', 'pdfBytes.length.toString()');
        return res.send(Buffer.from(pdfBytes));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during conversion");
    }
}
