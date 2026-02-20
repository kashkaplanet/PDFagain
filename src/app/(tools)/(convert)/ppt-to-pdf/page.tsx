import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PPT to PDF - Convert PowerPoint to PDF Online for Free | PDFagain',
  description: 'Experience the ultimate PPT to PDF tool with PDFagain. Convert PowerPoint presentations (PPTX) to PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['ppt to pdf', 'pptx to pdf', 'convert powerpoint to pdf', 'powerpoint to pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/ppt-to-pdf',
  },
  openGraph: {
    title: 'PPT to PDF - Convert PowerPoint to PDF Online for Free',
    description: 'Experience the ultimate PPT to PDF tool with PDFagain. Convert PowerPoint presentations (PPTX) to PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/ppt-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const PptToPdfClient = dynamic(() => import('@/components/tools/PptToPdfClient'));

export default function PptToPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "PPT to PDF",
    "description": "Experience the ultimate PPT to PDF tool with PDFagain. Convert PowerPoint presentations (PPTX) to PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/ppt-to-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PptToPdfClient />
    </>
  );
}
