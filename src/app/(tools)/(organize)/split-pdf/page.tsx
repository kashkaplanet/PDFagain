import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Split PDF - Separate PDF Pages Online for Free | PDFagain',
  description: 'Experience the ultimate Split PDF tool with PDFagain. Split PDF files into individual pages or extract specific pages instantly. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf splitter', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/split-pdf',
  },
  openGraph: {
    title: 'Split PDF - Separate PDF Pages Online for Free',
    description: 'Experience the ultimate Split PDF tool with PDFagain. Split PDF files into individual pages or extract specific pages instantly. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/split-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const SplitPdfClient = dynamic(() => import('@/components/tools/SplitPdfClient'));

export default function SplitPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "Split PDF",
    "description": "Experience the ultimate Split PDF tool with PDFagain. Split PDF files into individual pages or extract specific pages instantly. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/split-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <SplitPdfClient />
    </>
  );
}
