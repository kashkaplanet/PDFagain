/**
 * OCR Worker Thread
 * Runs Tesseract.js OCR in an isolated thread to prevent blocking the main event loop
 */

const { parentPort, workerData } = require("worker_threads");
const { createWorker } = require("tesseract.js");

let tesseractWorker = null;
let currentLang = null;

async function initWorker(lang) {
    // Reinitialize if language changed
    if (tesseractWorker && currentLang !== lang) {
        await tesseractWorker.terminate();
        tesseractWorker = null;
    }

    if (!tesseractWorker) {
        tesseractWorker = await createWorker(lang);
        currentLang = lang;
        console.log(`[OCR Worker] Tesseract initialized for language: ${lang}`);
    }
    return tesseractWorker;
}

async function processOCR(task) {
    const lang = task.lang || (workerData && workerData.lang) || "eng";

    try {
        const worker = await initWorker(lang);
        const { data: { text } } = await worker.recognize(task.imageBuffer);

        return {
            pageNumber: task.pageNumber,
            text,
        };
    } catch (error) {
        return {
            pageNumber: task.pageNumber,
            text: "",
            error: error instanceof Error ? error.message : "Unknown OCR error",
        };
    }
}

// Handle messages from main thread
if (parentPort) {
    parentPort.on("message", async (task) => {
        const result = await processOCR(task);
        if (parentPort) {
            parentPort.postMessage(result);
        }
    });

    // Cleanup on exit
    parentPort.on("close", async () => {
        if (tesseractWorker) {
            await tesseractWorker.terminate();
            tesseractWorker = null;
        }
    });
}
