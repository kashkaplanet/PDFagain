import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
    title: 'PDF to WebP - Convert PDF Pages to WebP Images | PDFagain',
    description: 'Convert PDF pages into modern WebP images for smaller file sizes. Fast, secure, and private processing in your browser. 100% free.',
    keywords: ['pdf to webp', 'convert pdf to webp', 'pdf to image', 'webp converter', 'free pdf tools'],
    alternates: {
        canonical: '/pdf-to-webp',
    },
    openGraph: {
        title: 'PDF to WebP - Convert PDF Pages to WebP Images',
        description: 'Convert PDF pages into modern WebP images. Processing happens locally in your browser.',
        url: 'https://pdfagain.com/pdf-to-webp',
        type: 'website',
    },
};

import dynamic from 'next/dynamic';
const PdfToWebpClient = dynamic(() => import('@/components/tools/PdfToWebpClient'));

export default function PdfToWebpPage() {
    const jsonLdData = {
        "@type": "SoftwareApplication",
        "name": "PDF to WebP Converter",
        "description": "Convert PDF pages into modern WebP images with PDFagain.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "url": "https://pdfagain.com/pdf-to-webp",
        "image": "https://pdfagain.com/icons/icon-512.svg",
    };

    return (
        <>
            <JsonLd data={jsonLdData} />
            <PdfToWebpClient />
        </>
    );
}
