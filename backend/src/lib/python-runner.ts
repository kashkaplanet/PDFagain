import { randomUUID } from "crypto";

export interface PythonRunnerOptions {
    script: string;        // Script name in scripts/ folder
    inputBuffer: Buffer;   // Input file buffer
    inputExt: string;      // e.g., ".pdf"
    outputExt: string;     // e.g., ".docx"
    timeout?: number;      // Default: 60000ms
    args?: string[];       // Additional arguments
}

export interface PythonResult {
    success: boolean;
    outputBuffer?: Buffer;
    error?: string;
}

export const getPythonCommand = () => {
    // Kept for backwards compatibility if anything still uses it directly
    return 'python';
};

/**
 * Run a Python script by calling the separate Python backend API
 */
export async function runPythonScript(options: PythonRunnerOptions): Promise<PythonResult> {
    const {
        script,
        inputBuffer,
        inputExt,
        outputExt,
        timeout = 120000,
        args = []
    } = options;

    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';
    const endpoint = `${pythonBackendUrl}/api/run-script`;

    try {
        const formData = new FormData();
        // Node's native FormData takes Blobs for files
        const blob = new Blob([inputBuffer as any]);
        formData.append('file', blob, `input${inputExt}`);
        formData.append('script', script);
        formData.append('inputExt', inputExt);
        formData.append('outputExt', outputExt);
        formData.append('args', JSON.stringify(args));

        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), timeout);

        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            signal: abortController.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorDetail = response.statusText;
            try {
                const errorJson = await response.json();
                errorDetail = errorJson.detail || errorDetail;
            } catch (e) {
                // Ignore json parse error
            }
            return {
                success: false,
                error: `Python backend error: ${response.status} ${errorDetail}`
            };
        }

        const arrayBuffer = await response.arrayBuffer();
        const outputBuffer = Buffer.from(arrayBuffer);

        return {
            success: true,
            outputBuffer
        };

    } catch (error: any) {
        return {
            success: false,
            error: `Failed to call Python backend: ${error.message}`
        };
    }
}

/**
 * Check if Python backend is reachable
 */
export async function isPythonAvailable(): Promise<boolean> {
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';
    try {
        const res = await fetch(`${pythonBackendUrl}/health`);
        return res.ok;
    } catch {
        return false;
    }
}
