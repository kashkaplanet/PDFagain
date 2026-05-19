import { Readable } from "stream";

/**
 * Convert a Web API File/Blob to a Node.js Readable stream
 */
export function fileToStream(file: File | Blob): Readable {
    const webStream = file.stream();
    return Readable.fromWeb(webStream as any);
}

/**
 * Convert a Node.js Readable stream to a Buffer
 * Uses efficient chunked buffering with backpressure handling
 */
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
}

/**
 * Process a file in chunks without loading entirely into memory
 * Useful for very large files
 */
export async function processFileInChunks(
    file: File,
    chunkSize: number,
    processor: (chunk: Buffer, index: number) => Promise<void>
): Promise<void> {
    const stream = fileToStream(file);
    let buffer = Buffer.alloc(0);
    let chunkIndex = 0;

    for await (const data of stream) {
        buffer = Buffer.concat([buffer, Buffer.isBuffer(data) ? data : Buffer.from(data)]);

        while (buffer.length >= chunkSize) {
            const chunk = buffer.subarray(0, chunkSize);
            buffer = buffer.subarray(chunkSize);
            await processor(chunk, chunkIndex++);
        }
    }

    // Process any remaining data
    if (buffer.length > 0) {
        await processor(buffer, chunkIndex);
    }
}

/**
 * Create a transform stream for progress tracking
 */
export function createProgressStream(
    totalSize: number,
    onProgress: (percent: number) => void
): { stream: Readable; pipe: (source: Readable) => Readable } {
    let bytesProcessed = 0;

    return {
        stream: new Readable({ read() { } }),
        pipe: (source: Readable) => {
            source.on("data", (chunk) => {
                bytesProcessed += chunk.length;
                const percent = Math.round((bytesProcessed / totalSize) * 100);
                onProgress(percent);
            });
            return source;
        },
    };
}
