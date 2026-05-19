

import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';



export const postHandler = async (req: Request, res: Response) => {
    let inputPath = "";
    let outputPath = "";

    try {
        // Multer handles formData
        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "PDF file is required");
        }

        const buffer = Buffer.from(file.buffer);

        // Create temp files
        const timestamp = Date.now();
        const filename = file.originalname.replace(/\.[^/.]+$/, "");
        inputPath = path.join(process.cwd(), 'temp', `${timestamp}_${filename}.pdf`);
        outputPath = path.join(process.cwd(), 'temp', `${timestamp}_${filename}.rtf`);

        // Ensure temp directory exists
        const tempDir = path.dirname(inputPath);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        fs.writeFileSync(inputPath, buffer);

        // Call Python script
        const scriptPath = path.join(process.cwd(), 'scripts', 'convert_pdf_to_rtf.py');

        // Check if script exists
        if (!fs.existsSync(scriptPath)) {
            throw new Error(`Conversion script not found at ${scriptPath}`);
        }

        const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

        await new Promise((resolve, reject) => {
            exec(`${pythonCommand} "${scriptPath}" "${inputPath}" "${outputPath}"`, (error: any, stdout: string, stderr: string) => {
                if (error) {
                    console.error("Python script error:", stderr);
                    reject(error);
                } else {
                    console.log("Python script output:", stdout);
                    resolve(stdout);
                }
            });
        });

        if (!fs.existsSync(outputPath)) {
            throw new Error("Conversion failed: Output file not created");
        }

        const rtfBuffer = fs.readFileSync(outputPath);

        // Cleanup
        try {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (e) {
            console.error("Cleanup error:", e);
        }

        res.set({
                "Content-Type": "application/rtf",
                "Content-Disposition": `attachment; filename="${filename}.rtf"`,
                "Content-Length": rtfBuffer.length.toString(),
            });
        return res.send(rtfBuffer);

    } catch (error) {
        // Attempt cleanup
        try {
            if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (e) {
            console.error("Cleanup error:", e);
        }

        return handleApiError(res, error, "Internal server error during RTF conversion");
    }
}
