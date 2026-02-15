export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length < 2) {
            return handleBadRequest("At least two PDF files are required");
        }

        if (files.length > 20) {
            return handleBadRequest("Cannot merge more than 20 files at once");
        }

        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        if (totalSize > 50 * 1024 * 1024) { // 50MB limit
            return handleBadRequest("Total file size exceeds 50MB limit");
        }

        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                return handleBadRequest(`File ${file.name} is not a PDF`);
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const savedPdfBytes = await mergedPdf.save();

        // Return as response
        return new NextResponse(Buffer.from(savedPdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="merged.pdf"',
                'Content-Length': savedPdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during merge");
    }
}
