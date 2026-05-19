import { useState, useCallback, useRef } from 'react';

export interface TaskProgress {
    current: number;
    total: number;
    message?: string;
}

export interface UsePdfTaskReturn<T> {
    isProcessing: boolean;
    progress: TaskProgress | null;
    error: string | null;
    result: T | null;
    execute: (taskFn: (signal: AbortSignal, updateProgress: (p: TaskProgress) => void) => Promise<T>) => Promise<void>;
    cancel: () => void;
    reset: () => void;
}

export function usePdfTask<T = any>(): UsePdfTaskReturn<T> {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState<TaskProgress | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<T | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const execute = useCallback(async (taskFn: (signal: AbortSignal, updateProgress: (p: TaskProgress) => void) => Promise<T>) => {
        setIsProcessing(true);
        setError(null);
        setProgress(null);
        setResult(null);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const res = await taskFn(abortController.signal, setProgress);
            if (!abortController.signal.aborted) {
                setResult(res);
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                console.log("Task cancelled");
                // Don't set error for cancellation
            } else {
                console.error("Task failed:", err);
                setError(err instanceof Error ? err.message : "An unexpected error occurred");
            }
        } finally {
            if (abortControllerRef.current === abortController) {
                setIsProcessing(false);
                abortControllerRef.current = null;
            }
        }
    }, []);

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsProcessing(false);
            // Optionally set error or just leave it
            setError("Cancelled");
        }
    }, []);

    const reset = useCallback(() => {
        setIsProcessing(false);
        setProgress(null);
        setError(null);
        setResult(null);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    return {
        isProcessing,
        progress,
        error,
        result,
        execute,
        cancel,
        reset
    };
}
