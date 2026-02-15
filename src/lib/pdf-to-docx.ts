import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import path from 'path';

// Standard font path
// Using import.meta.resolve to find path relative to this module in ESM context
// or fallback to a known path structure relative to process.cwd() or node_modules
import { fileURLToPath } from 'url';

// Resolve via import.meta.resolve is cleaner in ESM if supported (Node 20+)
// Be careful with bundlers.
// Let's try locating it relative to the imported module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// We assume node_modules structure:
// node_modules/pdfjs-dist/legacy/build/pdf.mjs
// standard_fonts are at node_modules/pdfjs-dist/standard_fonts
// So from pdf.mjs, it is ../../standard_fonts

// We can try to resolve the module path
let standardFontDataUrl: string;
try {
    const pdfPath = fileURLToPath(import.meta.resolve('pdfjs-dist/legacy/build/pdf.mjs'));
    standardFontDataUrl = path.join(path.dirname(pdfPath), '../../standard_fonts/');
} catch (e) {
    // Fallback if import.meta.resolve fails or bundler issues
    standardFontDataUrl = path.join(process.cwd(), 'node_modules/pdfjs-dist/standard_fonts/');
}

// In Node environment, we can use the legacy build which has better CJS support
// and handles worker fallback if configured correctly, or we can just point to it.
// However, the cleanest way in Next.js server actions is often to avoid the worker thread overhead
// if we can, OR simply ensure the worker file is resolvable.
// Let's try explicitly pointing to the worker file found via require.resolve if window is undefined.

if (typeof window === 'undefined') {
    // legacy/build/pdf.js is CJS, so we can use require.resolve
    // But we are in an ESM module context (ts -> esm). Next.js handles this mixed mode.
    // The previous dynamic import of createRequire is good, but let's simplify.

    // We can just rely on the main thread if we don't set workerSrc in some versions?
    // No, pdfjs usually demands a worker.

    try {
        // Use standard require if available (e.g. via bundler shims) or create it.
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);

        // Point to the worker file. 
        // We use the one in 'build' or 'legacy/build' matching the main import.
        // Bundlers (Webpack/Next.js) often return weird paths for require.resolve in serverless/dev mode.
        // Let's rely on the physical file existence in node_modules if possible.
        // This is fragile if node_modules is flattened or hoisted differently, but usually safe in standard installs.
        let workerPath;
        try {
            workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
        } catch {
            workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
        }

        // Force absolute path if resolving via require.resolve returned a relative or bundled path that looks wrong
        // The error "Cannot find module ... vendor-chunks ..." suggests require.resolve points to a non-existent virtual file.
        // Let's assume process.cwd() + node_modules is the source of truth for the worker FILE.
        workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');

        // Convert to file URL for dynamic import support on Windows
        pdfjs.GlobalWorkerOptions.workerSrc = fileURLToPath ? require('url').pathToFileURL(workerPath).href : workerPath;
    } catch (e) {
        console.warn("Could not configure PDF worker, falling back to main thread or default:", e);
    }
}

export async function convertPdfToDocx(pdfBuffer: Buffer): Promise<Buffer> {
    // Load PDF
    const uint8Array = new Uint8Array(pdfBuffer);

    // We need standard font data for text extraction to work reasonably well
    // In a serverless/bundled environment, locating these files can be tricky.
    // pdfjs-dist usually needs 'standard_fonts/' relative to the pdf.js file.
    // For now, we disable font face loading which might affect character mapping but avoids FS issues.

    // @ts-ignore
    const loadingTask = pdfjs.getDocument({
        data: uint8Array,
        disableFontFace: true,
        useSystemFonts: true, // Try to use system fonts
        verbosity: 0,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const docxChildren: Paragraph[] = [];

    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items as any[]; // pdfjs types can be tricky

        // Basic layout reconstruction by sorting items
        // items have .transform [scaleX, skewY, skewX, scaleY, transX, transY]
        // transY (index 5) is usually from bottom-up in PDF

        items.sort((a, b) => {
            const yDiff = Math.abs(a.transform[5] - b.transform[5]);
            if (yDiff > 5) { // Line threshold
                return b.transform[5] - a.transform[5]; // Sort Y descending (top to bottom)
            }
            return a.transform[4] - b.transform[4]; // Sort X ascending (left to right)
        });

        let lastY: number | null = null;
        let currentLineText: string[] = [];

        for (const item of items) {
            if (!item.str || !item.str.trim()) continue;

            const y = item.transform[5];

            // New line detection
            if (lastY !== null && Math.abs(y - lastY) > 8) {
                if (currentLineText.length > 0) {
                    docxChildren.push(new Paragraph({
                        children: [new TextRun(currentLineText.join(' '))]
                    }));
                }
                currentLineText = [];
            }

            currentLineText.push(item.str);
            lastY = y;
        }

        // Push last line of page
        if (currentLineText.length > 0) {
            docxChildren.push(new Paragraph({
                children: [new TextRun(currentLineText.join(' '))]
            }));
        }

        // Add page break if needed (DOCX flows naturally, but we can force it)
        if (i < numPages) {
            docxChildren.push(new Paragraph({
                children: [],
                pageBreakBefore: true,
            }));
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: docxChildren,
        }],
    });

    return await Packer.toBuffer(doc);
}
