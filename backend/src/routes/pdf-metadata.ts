import fs from 'fs';


import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);
        const metadataStr = (req.body || {}).metadata as string | null;

        if (!file) {
            return handleBadRequest(res, "PDF file is required");
        }

        let metadata: any = {};
        if (metadataStr) {
            try {
                metadata = JSON.parse(metadataStr);
            } catch {
                // ignore or error
            }
        }

        const arrayBuffer = await fs.promises.readFile(file.path);
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        if (metadata.title) pdfDoc.setTitle(metadata.title);
        if (metadata.author) pdfDoc.setAuthor(metadata.author);
        if (metadata.subject) pdfDoc.setSubject(metadata.subject);
        if (metadata.keywords) pdfDoc.setKeywords(metadata.keywords.split ? metadata.keywords.split(",") : metadata.keywords);
        if (metadata.producer) pdfDoc.setProducer(metadata.producer);
        if (metadata.creator) pdfDoc.setCreator(metadata.creator);

        const pdfBytes = await pdfDoc.save();

                res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=metadata_updated.pdf');
        res.setHeader('Content-Length', pdfBytes.length.toString());
        return res.send(Buffer.from(pdfBytes));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during metadata update");
    }
}
