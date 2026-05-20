import fs from 'fs';

import { Request, Response } from 'express';
import mammoth from 'mammoth';
import { browserPool } from '../services/browser-pool.js';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    let page = null;
    try {
        // Multer handles formData
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "Word file is required");
        }

        const buffer = Buffer.from(await fs.promises.readFile(file.path));

        // Convert DOCX to HTML using mammoth
        const { value: html, messages } = await mammoth.convertToHtml({ buffer });

        if (messages.length > 0) {
            console.warn("Mammoth messages:", messages);
        }

        page = await browserPool.getPage();

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

        await page.setContent(fullHtml, { waitUntil: 'load' });

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

        await browserPool.releasePage(page);
        page = null;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
        res.setHeader('Content-Length', pdfBuffer.length.toString());
        return res.send(Buffer.from(pdfBuffer));

    } catch (error) {
        if (page) await browserPool.releasePage(page).catch(() => { });
        return handleApiError(res, error, "Internal server error during conversion");
    }
}

