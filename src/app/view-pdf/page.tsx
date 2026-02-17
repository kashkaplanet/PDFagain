import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'View PDF Online - Free Secure PDF Viewer | PDFagain',
    description: 'View and preview PDF documents directly in your browser. 100% free, secure, and local processing — no uploads required.',
    keywords: ['view pdf online', 'pdf viewer', 'read pdf', 'pdf reader', 'free pdf viewer', 'local pdf viewer'],
    alternates: {
        canonical: '/view-pdf',
    },
    openGraph: {
        title: 'View PDF Online - Free Secure PDF Viewer',
        description: 'View and preview PDF documents directly in your browser. 100% free, secure, and local processing.',
        url: 'https://pdfagain.com/view-pdf',
        type: 'website',
    },
};

import dynamic from 'next/dynamic';
import React from 'react';
const ViewPdfClient = dynamic(() => import('@/components/tools/ViewPdfClient'));

export default function ViewPdfPage() {
    const jsonLdData = {
        "@type": "SoftwareApplication",
        "name": "View PDF Online",
        "description": "View and preview PDF documents directly in your browser.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "url": "https://pdfagain.com/view-pdf",
    };

    return (
        <>
            <JsonLd data={jsonLdData} />
            <ViewPdfClient />
        </>
    );
}
