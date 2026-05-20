import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import { convertPdfToWord } from '../services/pdf-to-word.service.js';
import { heavyTaskLimiter } from '../middleware/rate-limiter.js';
import { pdfValidator } from '../middleware/file-validator.js';

export const rateLimiter = heavyTaskLimiter;
export const fileValidator = pdfValidator;

export const postHandler = async (req: Request, res: Response) => {
    try {
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "PDF file is required");
        }

        const docBuffer = await convertPdfToWord(file.path);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
        res.setHeader('Content-Length', docBuffer.length.toString());
        return res.send(docBuffer);

    } catch (error) {
        return handleApiError(res, error, "Internal server error during conversion");
    }
}
