import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Extract Pages - Save Specific PDF Pages Online | PDFagain',
  description: 'Experience the ultimate Extract Pages tool with PDFagain. Extract specific pages from your PDF file and save them as a new document. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['extract pdf pages', 'save pdf pages', 'split pdf pages', 'pdf extractor', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/extract-pages',
  },
  openGraph: {
    title: 'Extract Pages - Save Specific PDF Pages Online',
    description: 'Experience the ultimate Extract Pages tool with PDFagain. Extract specific pages from your PDF file and save them as a new document. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/extract-pages',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const ExtractPagesPdfClient = dynamic(() => import('@/components/tools/ExtractPagesPdfClient'));

export default function ExtractPagesPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Extract PDF Pages",
    "description": "Experience the ultimate Extract Pages tool with PDFagain. Extract specific pages from your PDF file and save them as a new document. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/extract-pages",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ExtractPagesPdfClient />
    </>
  );
}
