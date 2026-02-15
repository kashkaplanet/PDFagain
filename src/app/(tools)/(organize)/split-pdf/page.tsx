import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Split PDF - Separate PDF Pages Online for Free | PDFagian',
  description: 'Split PDF files into individual pages or extract specific pages instantly. 100% free, secure, and local processing.',
  keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf splitter', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/split-pdf',
  },
  openGraph: {
    title: 'Split PDF - Separate PDF Pages Online for Free',
    description: 'Split PDF files into individual pages or extract specific pages instantly. 100% free, secure, and local processing.',
    url: 'https://pdfagian.com/split-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const SplitPdfClient = dynamic(() => import('@/components/tools/SplitPdfClient'));

export default function SplitPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Split PDF",
    "description": "Split PDF files into individual pages or extract specific pages instantly.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagian.com/split-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <SplitPdfClient />
    </>
  );
}
