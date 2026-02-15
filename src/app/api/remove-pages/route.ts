export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const pageIndicesStr = formData.get('pages') as string | null;

        if (!file || !pageIndicesStr) {
            return handleBadRequest("PDF file and page indices are required");
        }

        let pageIndices: number[] = [];
        try {
            pageIndices = JSON.parse(pageIndicesStr);
        } catch {
            return handleBadRequest("Invalid page indices format");
        }

        // Sort indices in descending order to avoid shifting issues when removing
        pageIndices.sort((a, b) => b - a);

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        for (const index of pageIndices) {
            if (index >= 0 && index < pdfDoc.getPageCount()) {
                pdfDoc.removePage(index);
            }
        }

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="removed_pages.pdf"',
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during page removal");
    }
}
