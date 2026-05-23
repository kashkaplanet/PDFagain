const fs = require('fs');
const path = require('path');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');

const proxyTemplate = (routeName) => `export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const response = await fetch(\`\${BACKEND_URL}/api/${routeName}\`, {
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
        console.error('${routeName} proxy error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error during conversion' },
            { status: 500 }
        );
    }
}
`;

const routesToFix = [
    'pdf-to-excel',
    'pdf-to-rtf',
    'excel-to-pdf',
    'word-to-pdf',
    'pdf-to-word',
    'pdf-to-jpg',
    'pdf-to-png',
    'pdf-to-webp',
    'jpg-to-pdf',
    'ppt-to-pdf',
    'binary-to-pdf',
    'binary-to-jpg',
    'binary-to-txt',
    'compress-pdf',
    'extract-pages',
    'flatten-pdf',
    'html-to-pdf',
    'jpg-to-binary',
    'merge-pdf',
    'ocr-pdf',
    'organize-pdf',
    'page-numbers',
    'pdf-metadata',
    'pdf-to-binary',
    'pdf-to-txt',
    'protect-pdf',
    'remove-pages',
    'repair-pdf',
    'rotate-pdf',
    'split-pdf',
    'txt-to-binary',
    'unlock-pdf',
    'watermark-pdf'
];

for (const route of routesToFix) {
    const routeFile = path.join(apiDir, route, 'route.ts');
    if (fs.existsSync(routeFile)) {
        fs.writeFileSync(routeFile, proxyTemplate(route), 'utf-8');
        console.log("Updated " + routeFile + " to use proxy.");
    } else {
        console.log(routeFile + " not found.");
    }
}
