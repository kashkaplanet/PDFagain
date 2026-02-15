export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const numPages = pdfDoc.getPageCount();
        const pages = pdfDoc.getPages();

        pages.forEach((page, index) => {
            const { width } = page.getSize();
            // Basic page number implementation
            page.drawText(`${index + 1} / ${numPages}`, {
                x: width - 50,
                y: 20,
                size: 10,
                color: rgb(0, 0, 0),
            });
        });

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="page_numbers.pdf"',
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during page numbering");
    }
}
