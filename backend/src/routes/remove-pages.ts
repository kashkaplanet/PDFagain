import fs from 'fs';


import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files as Express.Multer.File[];
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

        // Sort indices in descending order to avoid shifting issues when removing
        pageIndices.sort((a, b) => b - a);

        const arrayBuffer = await fs.promises.readFile(file.path);
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        for (const index of pageIndices) {
            if (index >= 0 && index < pdfDoc.getPageCount()) {
                pdfDoc.removePage(index);
            }
        }

        const pdfBytes = await pdfDoc.save();

                res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=removed_pages.pdf');
        res.setHeader('Content-Length', pdfBytes.length.toString());
        return res.send(Buffer.from(pdfBytes));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during page removal");
    }
}
