import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
    title: 'WebP to PDF - Convert WebP Images to PDF | PDFagain',
    description: 'Convert modern WebP images into standard PDF documents. Fast, secure, and private processing directly in your browser. 100% free.',
    keywords: ['webp to pdf', 'convert webp to pdf', 'webp converter', 'image to pdf', 'free pdf tools'],
    alternates: {
        canonical: '/webp-to-pdf',
    },
    openGraph: {
        title: 'WebP to PDF - Convert WebP Images to PDF',
        description: 'Convert modern WebP images into standard PDF documents. Processing happens locally in your browser.',
        url: 'https://pdfagain.com/webp-to-pdf',
        type: 'website',
    },
};

import dynamic from 'next/dynamic';
const WebpToPdfClient = dynamic(() => import('@/components/tools/WebpToPdfClient'));

export default function WebpToPdfPage() {
    return (
        <>
            <JsonLd data={getToolSchema(toolContent['webp-to-pdf'])} />
            <WebpToPdfClient />
        </>
    );
}
