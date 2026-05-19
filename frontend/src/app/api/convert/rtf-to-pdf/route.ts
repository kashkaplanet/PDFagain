import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Create unique temp directory for this request to avoid collisions
        const requestId = crypto.randomUUID();
        const tempDir = join(os.tmpdir(), "pdf-tools", requestId);
        await mkdir(tempDir, { recursive: true });

        const inputPath = join(tempDir, file.name);
        const outputFilename = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
        const outputPath = join(tempDir, outputFilename);

        await writeFile(inputPath, buffer);

        // Call Python script
        const scriptPath = join(process.cwd(), "scripts", "convert_rtf.py");

        // Command: python script.py input output
        // Quote paths to handle spaces
        const command = `python "${scriptPath}" "${inputPath}" "${outputPath}"`;

        console.log("Executing:", command);
        const { stdout, stderr } = await execAsync(command);
        console.log("Stdout:", stdout);
        if (stderr) console.error("Stderr:", stderr);

        // Check if output file exists
        try {
            await readFile(outputPath);
        } catch (e) {
            console.error("Output file not found:", e);
            throw new Error("Conversion failed to produce output file");
        }

        const outputBuffer = await readFile(outputPath);

        // Cleanup
        // Cleanup
        await rm(tempDir, { recursive: true, force: true }).catch(() => { });

        return new NextResponse(outputBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            },
        });

    } catch (error) {
        console.error("Conversion error:", error);
        return NextResponse.json({ error: "Conversion failed. Ensure Microsoft Word is installed on the server." }, { status: 500 });
    }
}
