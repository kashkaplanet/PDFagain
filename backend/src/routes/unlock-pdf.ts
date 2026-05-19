import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import { runPythonScript } from '../lib/python-runner.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        // Multer handles formData
        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);
        const password = (req.body || {}).password as string | null;

        if (!file) {
            return handleBadRequest(res, "PDF file is required");
        }

        const buffer = Buffer.from(file.buffer);
        const args = password ? [password] : [];

        const result = await runPythonScript({
            script: 'unlock_pdf.py',
            inputBuffer: buffer,
            inputExt: '.pdf',
            outputExt: '.pdf',
            args: args
        });

        if (!result.success || !result.outputBuffer) {
            throw new Error(result.error || "Failed to unlock PDF");
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=unlocked.pdf');
        res.setHeader('Content-Length', result.outputBuffer.length.toString());
        return res.send(result.outputBuffer);

    } catch (error) {
        return handleApiError(res, error, "Internal server error during unlocking");
    }
}
