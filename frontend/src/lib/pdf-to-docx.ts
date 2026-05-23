
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function convertPdfToDocx(pdfBuffer: Buffer): Promise<Buffer> {
    let parser;
    try {
        // pdf-parse v2 API
        parser = new PDFParse({ data: pdfBuffer });
        const result = await parser.getText();
        const text = result.text;

        const lines = (text as string).split(/\r?\n/);
        const children = lines.map((line: string) =>
            new Paragraph({
                children: [new TextRun(line)]
            })
        );

        const doc = new Document({
            sections: [{
                properties: {},
                children: children,
            }],
        });

        return await Packer.toBuffer(doc);
    } catch (e) {
        console.error("PDF parsing failed:", e);
        throw new Error(`Failed to parse PDF content: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
        if (parser && parser.destroy) {
            await parser.destroy();
        }
    }
}
