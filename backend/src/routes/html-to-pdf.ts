

import { Request, Response } from 'express';
import { getBrowserPage } from '../lib/browser.js';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';

export const postHandler = async (req: Request, res: Response) => {
    let page = null;
    try {
        // Multer handles formData
        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);
        const url = (req.body || {}).url as string | null;

        let content = "";

        if (url) {
            // URL to PDF
        } else if (file) {
            content = file.buffer.toString('utf-8'); // Assumes HTML file is text
        } else {
            return handleBadRequest(res, "HTML file or URL is required");
        }

        page = await getBrowserPage();

        if (url) {
            await page.goto(url, { waitUntil: 'networkidle0' });
        } else {
            await page.setContent(content, { waitUntil: 'load' });
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

                res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
        res.setHeader('Content-Length', pdfBuffer.length.toString());
        return res.send(Buffer.from(pdfBuffer));

    } catch (error) {
        // Ensure page is closed if error
        if (page) await page.close().catch(() => { });
        return handleApiError(res, error, "Internal server error during conversion");
    }
}
