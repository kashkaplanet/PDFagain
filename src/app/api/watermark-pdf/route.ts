export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const text = formData.get('text') as string | null;

        if (!file || !text) {
            return handleBadRequest("PDF file and watermark text are required");
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        pages.forEach((page) => {
            const { width, height } = page.getSize();
            // Basic watermark: centered, diagonal, red
            // Use standard font (Helvetica)
            page.drawText(text, {
                x: width / 2 - (text.length * 10), // Approximate centering
                y: height / 2,
                size: 50,
                color: rgb(0.95, 0.1, 0.1),
                opacity: 0.5,
                rotate: degrees(45),
            });
        });

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="watermarked.pdf"',
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during watermarking");
    }
}
