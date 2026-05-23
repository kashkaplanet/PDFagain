import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import { handleBadRequest } from '../lib/api-utils.js';

export const pdfValidator = async (req: Request, res: Response, next: NextFunction) => {
    const files = (req as any).files as Express.Multer.File[];
    const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

    if (!file) {
        return handleBadRequest(res, "File is required");
    }

    try {
        // Read the first 4 bytes
        const fileHandle = await fs.open(file.path, 'r');
        const buffer = Buffer.alloc(4);
        await fileHandle.read(buffer, 0, 4, 0);
        await fileHandle.close();

        // Check for PDF magic bytes: %PDF (hex: 25 50 44 46)
        if (buffer.toString('hex') !== '25504446') {
            return handleBadRequest(res, "Invalid file format. Expected a PDF.");
        }

        next();
    } catch (error) {
        console.error("File validation error:", error);
        return handleBadRequest(res, "Error validating file");
    }
};
