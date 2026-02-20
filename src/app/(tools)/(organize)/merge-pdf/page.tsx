import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Merge PDF - Combine PDF Files Online for Free | PDFagain',
  description: 'Experience the ultimate Merge PDF tool with PDFagain. Merge multiple PDF files into one document instantly. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['merge pdf', 'combine pdf', 'join pdf', 'pdf merger', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/merge-pdf',
  },
  openGraph: {
    title: 'Merge PDF - Combine PDF Files Online for Free',
    description: 'Experience the ultimate Merge PDF tool with PDFagain. Merge multiple PDF files into one document instantly. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/merge-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from "react";
const MergePdfClient = dynamic(() => import('@/components/tools/MergePdfClient'));

export default function MergePdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Merge PDF",
    "description": "Experience the ultimate Merge PDF tool with PDFagain. Merge multiple PDF files into one document instantly. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/merge-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <MergePdfClient />
    </>
  );
}
