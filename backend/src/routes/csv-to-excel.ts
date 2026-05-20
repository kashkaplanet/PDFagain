import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import fs from "fs";
import { runPythonScript } from '../lib/python-runner.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "CSV file is required");
        }

        const buffer = Buffer.from(await fs.promises.readFile(file.path));
        const originalName = file.originalname || 'document.csv';
        const outputFilename = originalName.replace(/\.[^/.]+$/, "") + ".xlsx";

        const result = await runPythonScript({
            script: 'convert_csv_to_excel.py',
            inputBuffer: buffer,
            inputExt: '.csv',
            outputExt: '.xlsx',
            timeout: 120000
        });

        if (!result.success || !result.outputBuffer) {
            throw new Error(result.error || "Failed to convert CSV to Excel");
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('Content-Length', result.outputBuffer.length.toString());
        return res.send(result.outputBuffer);

    } catch (error) {
        console.error("Excel Conversion Error:", error);
        return handleApiError(res, error, "Internal server error during Excel conversion");
    }
}
