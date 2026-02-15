export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getBrowserPage } from '@/lib/browser';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    let page = null;
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const url = formData.get('url') as string | null;

        let content = "";

        if (url) {
            // URL to PDF
        } else if (file) {
            content = await file.text(); // Assumes HTML file is text
        } else {
            return handleBadRequest("HTML file or URL is required");
        }

        page = await getBrowserPage();

        if (url) {
            await page.goto(url, { waitUntil: 'networkidle0' });
        } else {
            await page.setContent(content, { waitUntil: 'networkidle0' });
        }

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        // In serverless, we might not want to keep the browser open forever, 
        // but re-launching is expensive. 
        // For now, we rely on the container freezing or recycling.
        // We close the page to free memory.
        await page.close();
        page = null;

        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="converted.pdf"',
                'Content-Length': pdfBuffer.length.toString(),
            },
        });

    } catch (error) {
        // Ensure page is closed if error
        if (page) await page.close().catch(() => { });
        return handleApiError(error, "Internal server error during conversion");
    }
}
