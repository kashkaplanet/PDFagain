import fs from 'fs';


import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
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
        const zip = new JSZip();

        const numPages = pdfDoc.getPageCount();

        for (let i = 0; i < numPages; i++) {
            const newPdf = await PDFDocument.create();
            // copyPages returns an array of copied pages
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
            newPdf.addPage(copiedPage);
            const pdfBytes = await newPdf.save();

            zip.file(`page_${i + 1}.pdf`, pdfBytes);
        }

        const zipContent = await zip.generateAsync({ type: "nodebuffer" });

        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="split_files.zip"',
            'Content-Length': zipContent.length.toString(),
        });
        return res.send(zipContent as any);

    } catch (error) {
        return handleApiError(res, error, "Internal server error during split");
    }
}
