export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const angleStr = formData.get('angle') as string | null;
        const angle = parseInt(angleStr || '90') || 90;

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        pages.forEach((page) => {
            const rotation = page.getRotation();
            page.setRotation(degrees(rotation.angle + angle));
        });

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="rotated.pdf"',
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during rotation");
    }
}
