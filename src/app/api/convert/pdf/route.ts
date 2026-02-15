import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir, rm, readdir } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import JSZip from "jszip";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const format = formData.get("format") as string; // 'docx', 'images', 'txt'

        if (!file || !format) {
            return NextResponse.json({ error: "File and format are required" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const requestId = crypto.randomUUID();
        const tempDir = join(os.tmpdir(), "pdf-tools", requestId);
        await mkdir(tempDir, { recursive: true });

        const inputPath = join(tempDir, file.name);
        await writeFile(inputPath, buffer);

        const scriptPath = join(process.cwd(), "scripts", "convert_pdf.py");
        let command = "";
        let outputPath = "";
        let outputMimeType = "";
        let outputFilename = "";

        if (format === "docx") {
            // Serverless: Use internal library
            outputFilename = file.name.replace(/\.[^/.]+$/, "") + ".docx";
            outputPath = join(tempDir, outputFilename);

            // Import dynamically or assume it's available. 
            // Since we are in an async function in a route, we can use the library.
            const { convertPdfToDocx } = await import("@/lib/pdf-to-docx");
            const docxBuffer = await convertPdfToDocx(buffer);
            await writeFile(outputPath, docxBuffer);

            outputMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            // No command to execute
            command = "";
        } else if (format === "txt") {
            outputFilename = file.name.replace(/\.[^/.]+$/, "") + ".txt";
            outputPath = join(tempDir, outputFilename);
            command = `python "${scriptPath}" "${inputPath}" "${outputPath}"`;
            outputMimeType = "text/plain";
        } else if (format === "images") {
            const imagesDir = join(tempDir, "images");
            await mkdir(imagesDir, { recursive: true });

            const imageFormat = formData.get("image_format") as string || "jpeg";
            const validFormats = ["jpeg", "jpg", "png"];
            const safeFormat = validFormats.includes(imageFormat.toLowerCase()) ? imageFormat.toLowerCase() : "jpeg";

            command = `python "${scriptPath}" "${inputPath}" --to-images --output-dir "${imagesDir}" --image-format ${safeFormat}`;
            outputMimeType = "application/zip";
            outputFilename = file.name.replace(/\.[^/.]+$/, "") + `_${safeFormat}.zip`;
        } else {
            return NextResponse.json({ error: "Invalid format" }, { status: 400 });
        }

        if (command) {
            console.log("Executing:", command);
            const { stdout, stderr } = await execAsync(command);
            console.log("Stdout:", stdout);
            if (stderr) console.error("Stderr:", stderr);
        }

        let outputBuffer: Buffer;

        if (format === "images") {
            const imagesDir = join(tempDir, "images");
            const files = await readdir(imagesDir);
            if (files.length === 0) {
                throw new Error("No images generated");
            }

            const zip = new JSZip();
            for (const imgJson of files) {
                const imgContent = await readFile(join(imagesDir, imgJson));
                zip.file(imgJson, imgContent);
            }
            outputBuffer = await zip.generateAsync({ type: "nodebuffer" });

        } else {
            try {
                outputBuffer = await readFile(outputPath);
            } catch {
                throw new Error(`Conversion failed to produce output file: ${outputPath}`);
            }
        }

        await rm(tempDir, { recursive: true, force: true }).catch(() => { });

        return new NextResponse(new Uint8Array(outputBuffer), {
            headers: {
                "Content-Type": outputMimeType,
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            },
        });

    } catch (error) {
        console.error("Conversion error:", error);
        return NextResponse.json({ error: `Conversion failed: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
    }
}
