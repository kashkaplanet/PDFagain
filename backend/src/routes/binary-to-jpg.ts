import fs from 'fs';


import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "Binary text file is required");
        }

        const textContent = (await fs.promises.readFile(file.path)).toString('utf-8');
        const base64String = textContent.trim();

        // Validate Base64 string
        const base64Regex = /^[A-Za-z0-9+/\r\n]+=*$/;
        if (!base64Regex.test(base64String.replace(/\s/g, ''))) {
            return handleBadRequest(res, "Invalid binary file. The file does not contain valid Base64-encoded data.");
        }

        const jpgBuffer = Buffer.from(base64String, 'base64');

        // Verify it looks like a JPEG (starts with FF D8 FF)
        if (jpgBuffer.length < 3 || jpgBuffer[0] !== 0xFF || jpgBuffer[1] !== 0xD8 || jpgBuffer[2] !== 0xFF) {
            return handleBadRequest(res, "Invalid binary file. The decoded data is not a valid JPG image.");
        }

        const outputFilename = file.originalname.replace(/\.bin\.txt$/i, "").replace(/\.[^/.]+$/, "") + ".jpg";

        res.set({
                "Content-Type": "image/jpeg",
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            });
        return res.send(jpgBuffer);

    } catch (error) {
        return handleApiError(res, error, "Internal server error during binary to JPG conversion");
    }
}
