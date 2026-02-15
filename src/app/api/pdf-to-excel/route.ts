export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const requestId = crypto.randomUUID();
        const tempDir = join(os.tmpdir(), "pdf-tools", requestId);
        await mkdir(tempDir, { recursive: true });

        const inputPath = join(tempDir, file.name);
        await writeFile(inputPath, buffer);

        const outputFilename = file.name.replace(/\.[^/.]+$/, "") + ".xlsx";
        const outputPath = join(tempDir, outputFilename);
        const scriptPath = join(process.cwd(), "scripts", "convert_pdf.py");

        // Command: python script.py input.pdf output.xlsx
        const command = `python "${scriptPath}" "${inputPath}" "${outputPath}"`;

        console.log("Executing:", command);
        const { stdout, stderr } = await execAsync(command);
        console.log("Stdout:", stdout);
        if (stderr) console.error("Stderr:", stderr);

        let outputBuffer: Buffer;
        try {
            outputBuffer = await readFile(outputPath);
        } catch {
            throw new Error(`Conversion failed to produce output file: ${stdout}`);
        }

        // Cleanup
        await rm(tempDir, { recursive: true, force: true }).catch(() => { });

        return new NextResponse(new Uint8Array(outputBuffer), {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during Excel conversion");
    }
}
