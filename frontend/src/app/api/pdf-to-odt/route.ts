export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

import { BACKEND_URL } from '@/config/api';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // Forward the form data to the backend
        const backendFormData = new FormData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'PDF file is required' }, { status: 400 });
        }

        backendFormData.append('file', file);

        const response = await fetch(`${BACKEND_URL}/api/pdf-to-odt`, {
            method: 'POST',
            body: backendFormData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Backend conversion failed' }));
            return NextResponse.json(errorData, { status: response.status });
        }

        const odtBuffer = await response.arrayBuffer();

        const filename = file.name.replace(/\.[^/.]+$/, "") + ".odt";

        return new NextResponse(Buffer.from(odtBuffer), {
            headers: {
                'Content-Type': 'application/vnd.oasis.opendocument.text',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': odtBuffer.byteLength.toString(),
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

    } catch (error) {
        console.error('PDF to ODT proxy error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error during conversion' },
            { status: 500 }
        );
    }
}
