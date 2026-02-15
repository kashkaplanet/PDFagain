
import { convertPdfToDocx } from './src/lib/pdf-to-docx';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function test() {
    try {
        const inputPath = process.argv[2];
        if (!inputPath) {
            console.error("Usage: tsx reproduction.ts <input.pdf>");
            process.exit(1);
        }

        console.log(`Reading ${inputPath}...`);
        const buffer = await readFile(inputPath);

        console.log("Converting...");
        const docxBuffer = await convertPdfToDocx(buffer);

        const outputPath = "test_output.docx";
        await writeFile(outputPath, docxBuffer);
        console.log(`Success! Saved to ${outputPath}`);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
