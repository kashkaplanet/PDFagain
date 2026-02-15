export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const metadataStr = formData.get('metadata') as string | null;

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        let metadata: any = {};
        if (metadataStr) {
            try {
                metadata = JSON.parse(metadataStr);
            } catch {
                // ignore or error
            }
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        if (metadata.title) pdfDoc.setTitle(metadata.title);
        if (metadata.author) pdfDoc.setAuthor(metadata.author);
        if (metadata.subject) pdfDoc.setSubject(metadata.subject);
        if (metadata.keywords) pdfDoc.setKeywords(metadata.keywords.split ? metadata.keywords.split(",") : metadata.keywords);
        if (metadata.producer) pdfDoc.setProducer(metadata.producer);
        if (metadata.creator) pdfDoc.setCreator(metadata.creator);

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="metadata_updated.pdf"',
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during metadata update");
    }
}
