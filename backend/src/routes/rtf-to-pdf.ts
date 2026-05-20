import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

const execAsync = promisify(exec);

export const postHandler = async (req: Request, res: Response) => {
    let tempDir: string | null = null;

    try {
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "RTF file is required");
        }

        const buffer = Buffer.from(await fs.promises.readFile(file.path));

        // Create unique temp directory
        const requestId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        tempDir = path.join(os.tmpdir(), 'pdf-tools', requestId);
        fs.mkdirSync(tempDir, { recursive: true });

        const originalName = file.originalname || 'document.rtf';
        const inputPath = path.join(tempDir, originalName);
        const outputFilename = originalName.replace(/\.[^/.]+$/, '') + '.pdf';
        const outputPath = path.join(tempDir, outputFilename);

        fs.writeFileSync(inputPath, buffer);

        // Call Python script
        const scriptPath = path.join(process.cwd(), 'scripts', 'convert_rtf.py');

        if (!fs.existsSync(scriptPath)) {
            console.error('Script not found:', scriptPath);
            return handleBadRequest(res, "Conversion script not found on server");
        }

        const command = `python "${scriptPath}" "${inputPath}" "${outputPath}"`;
        console.log('Executing RTF conversion:', command);

        const { stdout, stderr } = await execAsync(command, { timeout: 60000 });
        console.log('Stdout:', stdout);
        if (stderr) console.warn('Stderr:', stderr);

        if (!fs.existsSync(outputPath)) {
            throw new Error('Conversion failed to produce output file');
        }

        const pdfBuffer = fs.readFileSync(outputPath);

        // Cleanup temp files
        fs.rmSync(tempDir, { recursive: true, force: true });
        tempDir = null;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('Content-Length', pdfBuffer.length.toString());
        return res.send(pdfBuffer);

    } catch (error) {
        // Cleanup on error
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        return handleApiError(res, error, "Internal server error during RTF to PDF conversion");
    }
};
