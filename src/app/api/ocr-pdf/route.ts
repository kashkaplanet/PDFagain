export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { createCanvas } from 'canvas';
import { createWorker } from 'tesseract.js';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';
import path from 'path';
import { pathToFileURL } from 'url';

export async function POST(req: NextRequest) {
    let worker: any = null;
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const lang = (formData.get('lang') as string) || 'eng';

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        const arrayBuffer = await file.arrayBuffer();

        // Dynamic import for pdfjs-dist (server-side: use local worker file URL)
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

        const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(arrayBuffer),
            disableFontFace: true,
            useSystemFonts: true,
            isEvalSupported: false,
        });

        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;

        // Create a streaming response with NDJSON format
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                // Send meta event with total pages for progress tracking
                controller.enqueue(
                    encoder.encode(JSON.stringify({ type: "meta", totalPages: numPages }) + "\n")
                );

                try {
                    worker = await createWorker(lang);

                    for (let i = 1; i <= numPages; i++) {
                        try {
                            const page = await pdfDocument.getPage(i);
                            const viewport = page.getViewport({ scale: 2.0 });

                            const canvas = createCanvas(viewport.width, viewport.height);
                            const context = canvas.getContext("2d");

                            await page.render({
                                canvasContext: context as any,
                                viewport: viewport,
                            } as any).promise;

                            const buffer = canvas.toBuffer("image/png");
                            const { data: { text } } = await worker.recognize(buffer);

                            controller.enqueue(
                                encoder.encode(JSON.stringify({
                                    type: "page",
                                    page: i,
                                    text: text,
                                }) + "\n")
                            );

                            page.cleanup();
                        } catch (pageError) {
                            // Send per-page error but continue processing
                            controller.enqueue(
                                encoder.encode(JSON.stringify({
                                    type: "page",
                                    page: i,
                                    text: "",
                                    error: pageError instanceof Error ? pageError.message : "Failed to process page",
                                }) + "\n")
                            );
                        }
                    }

                    if (worker) {
                        await worker.terminate();
                        worker = null;
                    }
                } catch (error) {
                    controller.enqueue(
                        encoder.encode(JSON.stringify({
                            error: error instanceof Error ? error.message : "OCR processing failed",
                        }) + "\n")
                    );
                    if (worker) {
                        await worker.terminate().catch(() => { });
                        worker = null;
                    }
                }

                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        if (worker) await worker.terminate().catch(() => { });
        return handleApiError(error, "Internal server error during OCR");
    }
}
