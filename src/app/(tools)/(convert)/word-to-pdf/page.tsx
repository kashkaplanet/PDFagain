import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Word to PDF - Convert DOCX to PDF Online for Free | PDFagian',
  description: 'Convert Microsoft Word (DOCX) files to PDF documents instantly. 100% free, secure, and processing happens locally in your browser.',
  keywords: ['word to pdf', 'docx to pdf', 'convert word to pdf', 'doc to pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/word-to-pdf',
  },
  openGraph: {
    title: 'Word to PDF - Convert DOCX to PDF Online for Free',
    description: 'Convert Microsoft Word files to PDF documents instantly. 100% free, secure, and processing happens locally.',
    url: 'https://pdfagian.com/word-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const WordToPdfClient = dynamic(() => import('@/components/tools/WordToPdfClient'));

export default function WordToPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Word to PDF",
    "description": "Convert Microsoft Word (DOCX) files to PDF documents instantly.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagian.com/word-to-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <WordToPdfClient />
    </>
  );
}
