export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { getBrowserPage } from '@/lib/browser';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    let page = null;
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return handleBadRequest("Word file is required");
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Convert DOCX to HTML using mammoth
        const { value: html, messages } = await mammoth.convertToHtml({ buffer });

        if (messages.length > 0) {
            console.warn("Mammoth messages:", messages);
        }

        page = await getBrowserPage();

        const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 2cm;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                }
                td, th {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
        `;

        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

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
        if (page) await page.close().catch(() => { });
        return handleApiError(error, "Internal server error during conversion");
    }
}
