import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
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
            return NextResponse.json(
                { error: `Failed to fetch URL: ${response.statusText}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') || 'text/html';
        const text = await response.text();

        return new NextResponse(text, {
            headers: {
                'Content-Type': contentType,
                // Add CORS headers if needed, though usually not for same-origin API calls
            },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: 500 });
    }
}
