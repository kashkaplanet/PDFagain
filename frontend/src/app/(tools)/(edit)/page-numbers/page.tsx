import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Page Numbers - Add Page Numbers to PDF Online | PDFagain',
  description: 'Experience the ultimate Page Numbers tool with PDFagain. Add page numbers to your PDF documents easily. Customize position and format. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['page numbers', 'add page numbers to pdf', 'number pdf pages', 'paginate pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/page-numbers',
  },
  openGraph: {
    title: 'Page Numbers - Add Page Numbers to PDF Online',
    description: 'Experience the ultimate Page Numbers tool with PDFagain. Add page numbers to your PDF documents easily. Customize position and format. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/page-numbers',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const PageNumbersClient = dynamic(() => import('@/components/tools/PageNumbersPdfClient'));

export default function PageNumbersPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "Add Page Numbers",
    "description": "Experience the ultimate Page Numbers tool with PDFagain. Add page numbers to your PDF documents easily. Customize position and format. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/page-numbers",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PageNumbersClient />
    </>
  );
}
