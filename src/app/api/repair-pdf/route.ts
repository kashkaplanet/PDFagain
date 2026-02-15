export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        const arrayBuffer = await file.arrayBuffer();

        // PDFDocument.load with ignoreEncryption: true can sometimes help open corrupted files
        // simply saving it again can fix XREF tables
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="repaired.pdf"',
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during repair (file might be too corrupted)");
    }
}
