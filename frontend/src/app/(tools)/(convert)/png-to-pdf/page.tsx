import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
    title: 'PNG to PDF - Convert PNG Images to PDF | PDFagain',
    description: 'Convert PNG images into high-quality PDF files. Preserves transparency and quality. Fast, secure, and private processing in your browser. 100% free.',
    keywords: ['png to pdf', 'convert png to pdf', 'image to pdf', 'png converter', 'free pdf tools'],
    alternates: {
        canonical: '/png-to-pdf',
    },
    openGraph: {
        title: 'PNG to PDF - Convert PNG Images to PDF',
        description: 'Convert PNG images into high-quality PDF files. Processing happens locally in your browser.',
        url: 'https://pdfagain.com/png-to-pdf',
        type: 'website',
    },
};

import dynamic from 'next/dynamic';
const PngToPdfClient = dynamic(() => import('@/components/tools/PngToPdfClient'));

export default function PngToPdfPage() {
    return (
        <>
            <JsonLd data={getToolSchema(toolContent['png-to-pdf'])} />
            <PngToPdfClient />
        </>
    );
}
