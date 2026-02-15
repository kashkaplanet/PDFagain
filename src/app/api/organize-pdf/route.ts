export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const pageOrderStr = formData.get('pageOrder') as string | null;

        if (!file || !pageOrderStr) {
            return handleBadRequest("PDF file and page order are required");
        }

        let pageOrder: number[] = [];
        try {
            pageOrder = JSON.parse(pageOrderStr);
        } catch {
            return handleBadRequest("Invalid page order format");
        }

        const arrayBuffer = await file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, pageOrder);

        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="organized.pdf"',
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during organization");
    }
}
