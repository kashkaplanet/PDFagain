import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
    title: 'PDF to PNG - Convert PDF Pages to PNG Images | PDFagain',
    description: 'Convert PDF pages into transparent, lossless PNG images. Fast, secure, and private processing directly in your browser. 100% free.',
    keywords: ['pdf to png', 'convert pdf to png', 'pdf to image', 'lossless pdf converter', 'free pdf tools'],
    alternates: {
        canonical: '/pdf-to-png',
    },
    openGraph: {
        title: 'PDF to PNG - Convert PDF Pages to PNG Images',
        description: 'Convert PDF pages into transparent, lossless PNG images. Processing happens locally in your browser.',
        url: 'https://pdfagain.com/pdf-to-png',
        type: 'website',
    },
};

import dynamic from 'next/dynamic';
const PdfToPngClient = dynamic(() => import('@/components/tools/PdfToPngClient'));

export default function PdfToPngPage() {
    return (
        <>
            <JsonLd data={getToolSchema(toolContent['pdf-to-png'])} />
            <PdfToPngClient />
        </>
    );
}
