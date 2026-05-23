import fs from 'fs';


import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files as Express.Multer.File[] as Express.Multer.File[];

        if (!files || files.length < 2) {
            return handleBadRequest(res, "At least two PDF files are required");
        }

        if (files.length > 20) {
            return handleBadRequest(res, "Cannot merge more than 20 files at once");
        }

        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        if (totalSize > 50 * 1024 * 1024) { // 50MB limit
            return handleBadRequest(res, "Total file size exceeds 50MB limit");
        }

        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            if (file.mimetype !== 'application/pdf' && !file.originalname.toLowerCase().endsWith('.pdf')) {
                return handleBadRequest(res, `File ${file.originalname} is not a PDF`);
            }

            const arrayBuffer = await fs.promises.readFile(file.path);
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const savedPdfBytes = await mergedPdf.save();

        // Return as response
                res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
        res.setHeader('Content-Length', savedPdfBytes.length.toString());
        return res.send(Buffer.from(savedPdfBytes));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during merge");
    }
}
