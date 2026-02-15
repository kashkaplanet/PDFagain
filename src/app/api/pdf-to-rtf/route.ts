export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';



export async function POST(req: NextRequest) {
    let inputPath = "";
    let outputPath = "";

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Create temp files
        const timestamp = Date.now();
        const filename = file.name.replace(/\.[^/.]+$/, "");
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

        return new NextResponse(rtfBuffer, {
            headers: {
                "Content-Type": "application/rtf",
                "Content-Disposition": `attachment; filename="${filename}.rtf"`,
                "Content-Length": rtfBuffer.length.toString(),
            },
        });

    } catch (error) {
        // Attempt cleanup
        try {
            if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (e) {
            console.error("Cleanup error:", e);
        }

        return handleApiError(error, "Internal server error during RTF conversion");
    }
}
