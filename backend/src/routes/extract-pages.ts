

import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);
        const pageIndicesStr = (req.body || {}).pages as string | null;

        if (!file || !pageIndicesStr) {
            return handleBadRequest(res, "PDF file and page indices are required");
        }

        let pageIndices: number[] = [];
        try {
            pageIndices = JSON.parse(pageIndicesStr);
        } catch {
            return handleBadRequest(res, "Invalid page indices format");
        }

        const arrayBuffer = file.buffer;
        const srcPdf = await PDFDocument.load(arrayBuffer);

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);

        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();

                res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=extracted_pages.pdf');
        res.setHeader('Content-Length', 'pdfBytes.length.toString()');
        return res.send(Buffer.from(pdfBytes));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during page extraction");
    }
}
