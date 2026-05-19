import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import fs from "fs";

const execAsync = promisify(exec);

export const postHandler = async (req: Request, res: Response) => {
    let tempDir: string | null = null;

    try {
        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "Excel file is required");
        }

        const buffer = Buffer.from(file.buffer);
        const requestId = crypto.randomUUID();
        tempDir = join(os.tmpdir(), "pdf-tools", requestId);
        await mkdir(tempDir, { recursive: true });

        const originalName = file.originalname || 'document.xlsx';
        const inputPath = join(tempDir, originalName);
        await writeFile(inputPath, buffer);

        const outputFilename = originalName.replace(/\.[^/.]+$/, "") + ".csv";
        const outputPath = join(tempDir, outputFilename);
        const scriptPath = join(process.cwd(), "scripts", "convert_excel_to_csv.py");

        if (!fs.existsSync(scriptPath)) {
            console.error('Script not found:', scriptPath);
            return handleBadRequest(res, "Conversion script not found on server");
        }

        const command = `python "${scriptPath}" "${inputPath}" "${outputPath}"`;

        console.log("Executing:", command);
        const { stdout, stderr } = await execAsync(command, { timeout: 120000 });
        console.log("Stdout:", stdout);
        if (stderr) console.warn("Stderr:", stderr);

        if (!fs.existsSync(outputPath)) {
            throw new Error(`Conversion failed to produce output file: ${stdout}`);
        }

        const outputBuffer = await readFile(outputPath);

        await rm(tempDir, { recursive: true, force: true }).catch(() => { });
        tempDir = null;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('Content-Length', outputBuffer.length.toString());
        return res.send(outputBuffer);

    } catch (error) {
        console.error("CSV Conversion Error:", error);
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        return handleApiError(res, error, "Internal server error during CSV conversion");
    }
}
