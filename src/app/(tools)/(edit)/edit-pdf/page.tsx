import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'Edit PDF - Free Online PDF Editor | PDFagain',
    description: 'Experience the ultimate Edit PDF tool with PDFagain. Edit PDF files online for free. Add text, images, and shapes to your PDF documents. 100% free, secure, and private - processing happens locally in your browser.',
    keywords: ['edit pdf', 'pdf editor', 'free pdf editor', 'add text to pdf', 'online pdf editor', 'local pdf processing'],
    alternates: {
        canonical: '/edit-pdf',
    },
    openGraph: {
        title: 'Edit PDF - Free Online PDF Editor',
        description: 'Experience the ultimate Edit PDF tool with PDFagain. Edit PDF files online for free. Add text, images, and shapes to your PDF documents. 100% free, secure, and private - processing happens locally in your browser.',
        url: 'https://pdfagain.com/edit-pdf',
        type: 'website',
    },
};

import dynamic from 'next/dynamic';
import React from 'react';
const EditPdfClient = dynamic(() => import('@/components/tools/EditPdfClient'));

export default function EditPdfPage() {
    const jsonLdData = {
        "@type": "SoftwareApplication",
        "name": "Edit PDF",
        "description": "Experience the ultimate Edit PDF tool with PDFagain. Edit PDF files online for free. Add text, images, and shapes to your PDF documents. 100% free, secure, and private - processing happens locally in your browser.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "url": "https://pdfagain.com/edit-pdf",
    };

    return (
        <>
            <JsonLd data={jsonLdData} />
            <EditPdfClient />
        </>
    );
}
