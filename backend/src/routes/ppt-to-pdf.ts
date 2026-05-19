

import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { getPythonCommand } from '../lib/python-runner.js';

export const postHandler = async (req: Request, res: Response) => {
    let inputPath = "";
    let outputPath = "";

    try {
        // Multer handles formData
        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "PPT file is required");
        }

        const arrayBuffer = file.buffer;
        const buffer = Buffer.from(arrayBuffer);

        // Save to temp file
        const tempDir = os.tmpdir();
        const uniqueId = Math.random().toString(36).substring(7);
        // Retain original extension if possible or use a generic one
        const ext = file.originalname ? path.extname(file.originalname) : '.pptx';
        inputPath = path.join(tempDir, `input_${uniqueId}${ext}`);
        outputPath = path.join(tempDir, `output_${uniqueId}.pdf`);

        await fs.writeFile(inputPath, buffer);

        // Run Python script
        const scriptPath = path.join(process.cwd(), 'scripts', 'convert_pptx.py');

        // Wrap command execution in a promise
        await new Promise((resolve, reject) => {
            exec(`"${getPythonCommand()}" "${scriptPath}" "${inputPath}" "${outputPath}"`, (error: any, stdout: string, stderr: string) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    reject(new Error(`Python script failed: ${stderr || error.message}`));
                    return;
                }
                console.log(`stdout: ${stdout}`);
                resolve(true);
            });
        });

        // Read output PDF
        const pdfBuffer = await fs.readFile(outputPath);

        res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="converted.pdf"',
                'Content-Length': pdfBuffer.length.toString(),
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            });
        return res.send(pdfBuffer);

    } catch (error) {
        console.error("Conversion error:", error);
        return res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error during conversion" });
    } finally {
        // Cleanup temp files
        try {
            if (inputPath) await fs.unlink(inputPath).catch(() => { });
            if (outputPath) await fs.unlink(outputPath).catch(() => { });
        } catch (e) {
            console.error("Error cleaning up temp files:", e);
        }
    }
}
