export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

import { BACKEND_URL } from '@/config/api';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const response = await fetch(`${BACKEND_URL}/api/pdf-to-excel`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Backend conversion failed' }));
            return NextResponse.json(errorData, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
        const contentDisposition = response.headers.get('Content-Disposition') || 'attachment; filename="converted"';

        return new NextResponse(Buffer.from(buffer), {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': contentDisposition,
                'Content-Length': buffer.byteLength.toString(),
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

    } catch (error) {
        console.error('pdf-to-excel proxy error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error during conversion' },
            { status: 500 }
        );
    }
}
