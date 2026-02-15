export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const password = formData.get('password') as string | null;

        if (!file || !password) {
            return handleBadRequest("PDF file and password are required");
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);

        const encryptedPdf = await encryptPDF(pdfBytes, password, password);

        return new NextResponse(Buffer.from(encryptedPdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="protected.pdf"',
                'Content-Length': encryptedPdf.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during protection");
    }
}
