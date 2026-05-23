import fs from 'fs';


import { Request, Response } from 'express';
import { PDFDocument, rgb } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "PDF file is required");
        }

        const arrayBuffer = await fs.promises.readFile(file.path);
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const numPages = pdfDoc.getPageCount();
        const pages = pdfDoc.getPages();

        pages.forEach((page, index) => {
            const { width } = page.getSize();
            // Basic page number implementation
            page.drawText(`${index + 1} / ${numPages}`, {
                x: width - 50,
                y: 20,
                size: 10,
                color: rgb(0, 0, 0),
            });
        });

        const pdfBytes = await pdfDoc.save();

                res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=page_numbers.pdf');
        res.setHeader('Content-Length', pdfBytes.length.toString());
        return res.send(Buffer.from(pdfBytes));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during page numbering");
    }
}
