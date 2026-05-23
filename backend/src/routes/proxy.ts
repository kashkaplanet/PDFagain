import { Request, Response } from 'express';

export const getHandler = async (req: Request, res: Response) => {
    const url = req.query.url as string;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Validate the URL
        new URL(url);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PDFagain/1.0; +https://pdfagain.com)',
            },
        });

        if (!response.ok) {
            return res.status(200).json(
                { error: `Failed to fetch URL: ${response.statusText}` });
        }
        
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Failed to fetch the URL' });
    }
}
