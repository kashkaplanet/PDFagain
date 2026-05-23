import fs from 'fs';


import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "Text file is required");
        }

        const arrayBuffer = await fs.promises.readFile(file.path);
        const base64String = Buffer.from(arrayBuffer).toString('base64');

        const outputFilename = file.originalname.replace(/\.[^/.]+$/, "") + ".bin.txt";

                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', '`attachment; filename=${outputFilename');
        return res.send(Buffer.from(base64String, 'utf-8'));

    } catch (error) {
        return handleApiError(res, error, "Internal server error during text to binary conversion");
    }
}
