import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import fs from "fs";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const requestId = crypto.randomUUID();
        const tempDir = join(os.tmpdir(), "pdf-tools", requestId);
        await mkdir(tempDir, { recursive: true });

        const inputPath = join(tempDir, file.name);
        const outputFilename = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
        const outputPath = join(tempDir, outputFilename);

        await writeFile(inputPath, buffer);

        const scriptPath = join(process.cwd(), "scripts", "convert_pptx.py");
        const command = `python "${scriptPath}" "${inputPath}" "${outputPath}"`;

        console.log("Executing:", command);
        const { stdout, stderr } = await execAsync(command);
        console.log("Stdout:", stdout);
        if (stderr) console.error("Stderr:", stderr);

        try {
            await readFile(outputPath);
        } catch {
            throw new Error("Conversion failed to produce output file");
        }

        const outputBuffer = await readFile(outputPath);

        await rm(tempDir, { recursive: true, force: true }).catch(() => { });

        return new NextResponse(outputBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            },
        });

    } catch (error) {
        console.error("Conversion error:", error);

        // Log explicitly to a file
        const logPath = join(process.cwd(), "error_log.txt");
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : "";
        const logContent = `\n[${new Date().toISOString()}] Error:\n${errorMessage}\nStack:\n${errorStack}\n`;

        try {
            fs.appendFileSync(logPath, logContent);
        } catch (e) {
            console.error("Failed to write to error log", e);
        }

        return NextResponse.json({ error: "Conversion failed. Ensure Microsoft PowerPoint is installed on the server." }, { status: 500 });
    }
}
