/**
 * OCR Worker Pool
 * Maintains a pool of worker threads for parallel OCR processing.
 * Reuses Tesseract initialization across requests for better performance.
 */

import { Worker } from "worker_threads";
import { join } from "path";
import os from "os";

interface OCRTask {
    imageBuffer: Buffer;
    pageNumber: number;
    lang: string;
    requestId: string;
}

interface OCRResult {
    pageNumber: number;
    text: string;
    error?: string;
}

interface QueuedTask {
    task: OCRTask;
    resolve: (result: OCRResult) => void;
    reject: (error: Error) => void;
}

interface PoolWorker {
    worker: Worker;
    busy: boolean;
    currentLang: string | null;
}

class OCRWorkerPool {
    private workers: PoolWorker[] = [];
    private taskQueue: QueuedTask[] = [];
    private readonly poolSize: number;
    private initialized = false;
    private idleTimeoutMs = 60_000; // 60 seconds
    private idleCheckInterval: NodeJS.Timeout | null = null;

    constructor(size?: number) {
        // Use CPU cores - 1, minimum 2, maximum 4 for OCR
        // On very small instances (1-2 cores), use 1 worker to leave room for main thread/system
        const cpus = os.cpus().length;
        this.poolSize = size ?? (cpus <= 2 ? 1 : Math.min(Math.max(cpus - 1, 2), 4));
    }

    /**
     * Create a new worker instance with correct arguments
     */
    private createWorker(): Worker {
        const workerPath = join(process.cwd(), "src/workers/ocr-worker.js");
        return new Worker(workerPath);
    }

    /**
     * Initialize the worker pool
     */
    private async initializePool(): Promise<void> {
        if (this.initialized) return;

        for (let i = 0; i < this.poolSize; i++) {
            const worker = this.createWorker();

            const poolWorker: PoolWorker = {
                worker,
                busy: false,
                currentLang: null,
            };

            worker.on("error", (error) => {
                console.error(`[OCRPool] Worker ${i} error:`, error);
                this.handleWorkerError(poolWorker);
            });

            worker.on("exit", (code) => {
                if (code !== 0) {
                    console.error(`[OCRPool] Worker ${i} exited with code ${code}`);
                }
            });

            this.workers.push(poolWorker);
        }

        this.initialized = true;
        this.startIdleCheck();
        console.log(`[OCRPool] Initialized with ${this.poolSize} workers`);
    }

    /**
     * Start idle check interval
     */
    private startIdleCheck() {
        if (this.idleCheckInterval) clearInterval(this.idleCheckInterval);

        this.idleCheckInterval = setInterval(() => {
            const now = Date.now();

            // If tasks are queued or workers are busy, we are active
            if (this.taskQueue.length > 0 || this.workers.some(w => w.busy)) {
                this.touch(); // Treat as active
                return;
            }

            // If completely idle for timeout duration
            if (now - this.lastActivity > this.idleTimeoutMs && this.workers.length > 0) {
                console.log("[OCRPool] Idle timeout reached. Terminating workers to free memory.");
                this.shutdown();
            }
        }, 30_000); // Check every 30 seconds
    }

    private lastActivity = Date.now();

    /**
     * Update activity timestamp
     */
    private touch() {
        this.lastActivity = Date.now();
        if (!this.initialized) this.initializePool(); // Re-init if needed (auto-wake)
    }

    /**
     * Handle worker errors by recreating the worker
     */
    private async handleWorkerError(poolWorker: PoolWorker): Promise<void> {
        const index = this.workers.indexOf(poolWorker);
        if (index === -1) return;

        try {
            await poolWorker.worker.terminate();
        } catch {
            // Ignore termination errors
        }

        const newWorker = this.createWorker();

        poolWorker.worker = newWorker;
        poolWorker.busy = false;
        poolWorker.currentLang = null;

        this.processQueue();
    }

    /**
     * Execute an OCR task using the pool
     */
    async execute(task: OCRTask): Promise<OCRResult> {
        this.touch();
        if (!this.initialized) await this.initializePool();

        return new Promise((resolve, reject) => {
            this.taskQueue.push({ task, resolve, reject });
            this.processQueue();
        });
    }

    /**
     * Process queued tasks
     */
    private processQueue(): void {
        this.touch();
        if (this.taskQueue.length === 0) return;

        const availableWorker = this.workers.find((w) => !w.busy);
        if (!availableWorker) return;

        const queuedTask = this.taskQueue.shift();
        if (!queuedTask) return;

        availableWorker.busy = true;
        const { task, resolve, reject } = queuedTask;

        const messageHandler = (result: OCRResult) => {
            availableWorker.busy = false;
            availableWorker.worker.off("message", messageHandler);
            availableWorker.worker.off("error", errorHandler);
            this.touch();

            console.log(
                `[OCRPool:${task.requestId}] Page ${task.pageNumber} complete`
            );
            resolve(result);
            this.processQueue();
        };

        const errorHandler = (error: Error) => {
            availableWorker.busy = false;
            availableWorker.worker.off("message", messageHandler);
            availableWorker.worker.off("error", errorHandler);
            this.touch();

            reject(error);
            this.processQueue();
        };

        availableWorker.worker.on("message", messageHandler);
        availableWorker.worker.on("error", errorHandler);

        // Send task to worker
        availableWorker.worker.postMessage({
            imageBuffer: task.imageBuffer,
            pageNumber: task.pageNumber,
            lang: task.lang,
        });
    }

    /**
     * Get pool statistics
     */
    getStats(): { total: number; busy: number; queued: number } {
        return {
            total: this.workers.length,
            busy: this.workers.filter((w) => w.busy).length,
            queued: this.taskQueue.length,
        };
    }

    /**
     * Gracefully shutdown the pool
     */
    async shutdown(): Promise<void> {
        console.log("[OCRPool] Shutting down...");
        if (this.idleCheckInterval) {
            clearInterval(this.idleCheckInterval);
            this.idleCheckInterval = null;
        }

        await Promise.all(
            this.workers.map(async (w) => {
                try {
                    await w.worker.terminate();
                } catch {
                    // Ignore
                }
            })
        );

        this.workers = [];
        this.taskQueue = [];
        this.initialized = false;
        console.log("[OCRPool] Shutdown complete");
    }
}

// Singleton instance
const ocrWorkerPool = new OCRWorkerPool();

// Graceful shutdown handlers
if (typeof process !== "undefined") {
    process.on("SIGTERM", () => ocrWorkerPool.shutdown());
    process.on("SIGINT", () => ocrWorkerPool.shutdown());
}

export { ocrWorkerPool, OCRWorkerPool };
export type { OCRTask, OCRResult };
