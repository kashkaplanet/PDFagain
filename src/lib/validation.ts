import { z } from "zod";
import { NextResponse } from "next/server";

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
    DEFAULT: 50 * 1024 * 1024,  // 50MB
    PDF: 100 * 1024 * 1024,     // 100MB for PDFs
    IMAGE: 20 * 1024 * 1024,    // 20MB for images
};

// Allowed extensions by category
const ALLOWED_EXTENSIONS = {
    PDF: ['.pdf'],
    DOCX: ['.docx'],
    DOC: ['.doc', '.docx'],
    EXCEL: ['.xlsx', '.xls'],
    PPT: ['.pptx', '.ppt'],
    IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    HTML: ['.html', '.htm'],
};

export type FileCategory = keyof typeof ALLOWED_EXTENSIONS;

interface ValidationOptions {
    allowedExtensions: string[];
    maxSizeBytes?: number;
    required?: boolean;
}

type ValidationSuccess = {
    success: true;
    file: File;
};

type ValidationError = {
    success: false;
    error: string;
    response: NextResponse;
};

type ValidationResult = ValidationSuccess | ValidationError;

/**
 * Validate a file from FormData
 */
export function validateFile(
    file: File | null,
    options: ValidationOptions
): ValidationResult {
    const {
        allowedExtensions,
        maxSizeBytes = FILE_SIZE_LIMITS.DEFAULT,
        required = true
    } = options;

    // Check if file exists
    if (!file) {
        if (required) {
            return {
                success: false,
                error: "No file provided",
                response: NextResponse.json({ error: "No file provided" }, { status: 400 }),
            };
        }
        return {
            success: false,
            error: "No file provided",
            response: NextResponse.json({ error: "No file provided" }, { status: 400 }),
        };
    }

    // Check file size
    if (file.size > maxSizeBytes) {
        const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
        return {
            success: false,
            error: `File too large. Maximum size is ${maxSizeMB}MB`,
            response: NextResponse.json(
                { error: `File too large. Maximum size is ${maxSizeMB}MB` },
                { status: 400 }
            ),
        };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
        const extensionList = allowedExtensions.join(', ');
        return {
            success: false,
            error: `Invalid file type. Allowed: ${extensionList}`,
            response: NextResponse.json(
                { error: `Invalid file type. Allowed: ${extensionList}` },
                { status: 400 }
            ),
        };
    }

    return { success: true, file };
}

// Pre-built validators for common file types
export const validators = {
    pdf: (file: File | null) => validateFile(file, {
        allowedExtensions: ALLOWED_EXTENSIONS.PDF,
        maxSizeBytes: FILE_SIZE_LIMITS.PDF,
    }),
    docx: (file: File | null) => validateFile(file, {
        allowedExtensions: ALLOWED_EXTENSIONS.DOCX,
    }),
    excel: (file: File | null) => validateFile(file, {
        allowedExtensions: ALLOWED_EXTENSIONS.EXCEL,
    }),
    ppt: (file: File | null) => validateFile(file, {
        allowedExtensions: ALLOWED_EXTENSIONS.PPT,
    }),
    image: (file: File | null) => validateFile(file, {
        allowedExtensions: ALLOWED_EXTENSIONS.IMAGE,
        maxSizeBytes: FILE_SIZE_LIMITS.IMAGE,
    }),
    html: (file: File | null) => validateFile(file, {
        allowedExtensions: ALLOWED_EXTENSIONS.HTML,
    }),
};

// Re-export zod for convenience
export { z };
