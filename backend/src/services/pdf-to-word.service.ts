import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const convertPdfToWord = async (filePath: string): Promise<Buffer> => {
    const arrayBuffer = await fs.promises.readFile(filePath);

    // Dynamic import for pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // Configure worker
    const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

    const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
        disableFontFace: true,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const paragraphs = [];

    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();

        let lastY = -1;
        let currentLineText = "";

        for (const item of textContent.items) {
            const itemText = (item as any).str;
            const itemY = (item as any).transform[5];

            if (lastY !== -1 && Math.abs(itemY - lastY) > 10) {
                if (currentLineText.trim()) {
                    paragraphs.push(
                        new Paragraph({
                            children: [new TextRun(currentLineText)],
                        })
                    );
                }
                currentLineText = "";
            }

            currentLineText += itemText + " ";
            lastY = itemY;
        }

        if (currentLineText.trim()) {
            paragraphs.push(
                new Paragraph({
                    children: [new TextRun(currentLineText)],
                })
            );
        }

        if (i < numPages) {
            paragraphs.push(new Paragraph({ children: [new TextRun({ break: 1 })] }));
        }
    }

    const doc = new Document({
        sections: [{ children: paragraphs }],
    });

    const docBuffer = await Packer.toBuffer(doc);
    return Buffer.from(docBuffer);
};
