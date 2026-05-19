import { spawn } from "child_process";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
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

const TEMP_DIR = join(process.cwd(), "tmp");
const SCRIPTS_DIR = join(process.cwd(), "scripts");

export const getPythonCommand = () => {
    const localPath = 'C:\\Users\\kashk\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';
    if (process.platform === 'win32' && existsSync(localPath)) {
        return localPath;
    }
    return 'python';
};

/**
 * Run a Python script with input/output file handling
 */
export async function runPythonScript(options: PythonRunnerOptions): Promise<PythonResult> {
    const {
        script,
        inputBuffer,
        inputExt,
        outputExt,
        timeout = 60000,
        args = []
    } = options;

    // Ensure temp directory exists
    if (!existsSync(TEMP_DIR)) {
        await mkdir(TEMP_DIR, { recursive: true });
    }

    const uuid = randomUUID();
    const inputPath = join(TEMP_DIR, `${uuid}${inputExt}`);
    const outputPath = join(TEMP_DIR, `${uuid}${outputExt}`);
    const scriptPath = join(SCRIPTS_DIR, script);

    try {
        // Write input file
        await writeFile(inputPath, inputBuffer);

        // Build command arguments
        const cmdArgs = [scriptPath, inputPath, outputPath, ...args];

        // Run Python script
        const result = await new Promise<PythonResult>((resolve) => {
            const pythonProcess = spawn(getPythonCommand(), cmdArgs, {
                cwd: process.cwd(),
                timeout: timeout,
            });

            let stdout = "";
            let stderr = "";

            pythonProcess.stdout.on("data", (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on("data", (data) => {
                stderr += data.toString();
            });

            pythonProcess.on("close", async (code) => {
                if (code === 0 && existsSync(outputPath)) {
                    try {
                        const outputBuffer = await readFile(outputPath);
                        resolve({ success: true, outputBuffer });
                    } catch (readError) {
                        resolve({
                            success: false,
                            error: `Failed to read output: ${readError}`
                        });
                    }
                } else {
                    resolve({
                        success: false,
                        error: stderr || stdout || `Python script exited with code ${code}`
                    });
                }
            });

            pythonProcess.on("error", (err) => {
                resolve({
                    success: false,
                    error: `Failed to spawn Python: ${err.message}`
                });
            });
        });

        return result;

    } finally {
        // Cleanup temp files
        await cleanupFile(inputPath);
        await cleanupFile(outputPath);
    }
}

async function cleanupFile(filePath: string): Promise<void> {
    try {
        if (existsSync(filePath)) {
            await unlink(filePath);
        }
    } catch {
        // Ignore cleanup errors
    }
}

/**
 * Check if Python is available in PATH
 */
export async function isPythonAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
        const pythonProcess = spawn(getPythonCommand(), ["--version"]);

        pythonProcess.on("close", (code) => {
            resolve(code === 0);
        });

        pythonProcess.on("error", () => {
            resolve(false);
        });
    });
}
