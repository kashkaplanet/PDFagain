export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
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
        const zip = new JSZip();

        const numPages = pdfDoc.getPageCount();

        for (let i = 0; i < numPages; i++) {
            const newPdf = await PDFDocument.create();
            // copyPages returns an array of copied pages
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
            newPdf.addPage(copiedPage);
            const pdfBytes = await newPdf.save();

            zip.file(`page_${i + 1}.pdf`, pdfBytes);
        }

        const zipContent = await zip.generateAsync({ type: "nodebuffer" });

        return new NextResponse(zipContent as any, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="split_files.zip"',
                'Content-Length': zipContent.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during split");
    }
}
