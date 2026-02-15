export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return handleBadRequest("Binary text file is required");
        }

        const textContent = await file.text();
        const base64String = textContent.trim();

        // Validate Base64 string
        const base64Regex = /^[A-Za-z0-9+/\r\n]+=*$/;
        if (!base64Regex.test(base64String.replace(/\s/g, ''))) {
            return handleBadRequest("Invalid binary file. The file does not contain valid Base64-encoded data.");
        }

        const pdfBuffer = Buffer.from(base64String, 'base64');

        // Verify it looks like a PDF (starts with %PDF)
        if (pdfBuffer.length < 4 || pdfBuffer.toString('utf-8', 0, 4) !== '%PDF') {
            return handleBadRequest("Invalid binary file. The decoded data is not a valid PDF.");
        }

        const outputFilename = file.name.replace(/\.bin\.txt$/i, "").replace(/\.[^/.]+$/, "") + ".pdf";

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during binary to PDF conversion");
    }
}
