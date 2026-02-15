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

        const jpgBuffer = Buffer.from(base64String, 'base64');

        // Verify it looks like a JPEG (starts with FF D8 FF)
        if (jpgBuffer.length < 3 || jpgBuffer[0] !== 0xFF || jpgBuffer[1] !== 0xD8 || jpgBuffer[2] !== 0xFF) {
            return handleBadRequest("Invalid binary file. The decoded data is not a valid JPG image.");
        }

        const outputFilename = file.name.replace(/\.bin\.txt$/i, "").replace(/\.[^/.]+$/, "") + ".jpg";

        return new NextResponse(jpgBuffer, {
            headers: {
                "Content-Type": "image/jpeg",
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during binary to JPG conversion");
    }
}
