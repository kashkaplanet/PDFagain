importScripts("https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js");

self.onmessage = async (e) => {
    const { type, payload, id } = e.data;

    try {
        if (type === 'merge') {
            await handleMerge(payload, id);
        } else {
            throw new Error(`Unknown operation type: ${type}`);
        }
    } catch (error) {
        self.postMessage({
            type: 'error',
            id,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

async function handleMerge(files, id) {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();

    const totalFiles = files.length;
    let processed = 0;

    for (const fileData of files) {
        const pdf = await PDFDocument.load(fileData);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));

        processed++;
        self.postMessage({
            type: 'progress',
            id,
            progress: { current: processed, total: totalFiles, message: `Merging file ${processed} of ${totalFiles}` }
        });
    }

    const mergedPdfBytes = await mergedPdf.save();
    // Transfer buffer back to avoid copy if possible, but Blob is fine
    self.postMessage({
        type: 'complete',
        id,
        result: mergedPdfBytes
    }, [mergedPdfBytes.buffer]);
}
