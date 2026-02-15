export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return handleBadRequest("Image files are required");
        }

        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
            const buffer = await file.arrayBuffer();
            let image;

            const name = file.name.toLowerCase();
            if (file.type === 'image/png' || name.endsWith(".png")) {
                image = await pdfDoc.embedPng(buffer);
            } else if (file.type === 'image/jpeg' || file.type === 'image/jpg' || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
                image = await pdfDoc.embedJpg(buffer);
            } else {
                continue; // Skip unsupported
            }

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="images.pdf"',
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Internal server error during conversion");
    }
}
