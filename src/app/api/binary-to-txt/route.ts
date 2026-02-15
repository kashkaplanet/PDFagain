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

        const txtBuffer = Buffer.from(base64String, 'base64');

        const outputFilename = file.name.replace(/\.bin\.txt$/i, "").replace(/\.[^/.]+$/, "") + ".txt";

        return new NextResponse(txtBuffer, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during binary to text conversion");
    }
}
