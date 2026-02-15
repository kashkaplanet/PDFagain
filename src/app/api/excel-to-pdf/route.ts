export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';

export async function POST(req: NextRequest) {
    let inputPath = "";
    let outputPath = "";

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return handleBadRequest("Excel file is required");
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Save to temp file
        const tempDir = os.tmpdir();
        const uniqueId = Math.random().toString(36).substring(7);
        inputPath = path.join(tempDir, `input_${uniqueId}.xlsx`);
        outputPath = path.join(tempDir, `output_${uniqueId}.pdf`);

        await fs.writeFile(inputPath, buffer);

        // Run Python script

        const scriptPath = path.join(process.cwd(), 'scripts', 'convert_excel_to_pdf.py');

        // Wrap command execution in a promise
        await new Promise((resolve, reject) => {
            // Use python or python3 depending on environment. Assuming 'python' works as verified in terminal.
            exec(`python "${scriptPath}" "${inputPath}" "${outputPath}"`, (error: any, stdout: string, stderr: string) => {
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

        // Cleanup logic handled in finally block to ensure it runs

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="excel_converted.pdf"',
                'Content-Length': pdfBuffer.length.toString(),
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

    } catch (error) {
        console.error("Conversion error:", error);
        return handleApiError(error, "Internal server error during conversion");
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
