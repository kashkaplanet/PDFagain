import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Resize PDF - Change PDF Page Size | PDFagain',
  description: 'Experience the ultimate Resize PDF tool with PDFagain. Resize PDF page dimensions. Change paper size (A4, Letter, etc.) easily. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['resize pdf', 'change pdf size', 'scale pdf', 'pdf page size', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/resize-pdf',
  },
  openGraph: {
    title: 'Resize PDF - Change PDF Page Size',
    description: 'Experience the ultimate Resize PDF tool with PDFagain. Resize PDF page dimensions. Change paper size (A4, Letter, etc.) easily. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/resize-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const ResizePdfClient = dynamic(() => import('@/components/tools/ResizePdfClient'));

export default function ResizePdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Resize PDF",
    "description": "Experience the ultimate Resize PDF tool with PDFagain. Resize PDF page dimensions. Change paper size (A4, Letter, etc.) easily. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/resize-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ResizePdfClient />
    </>
  );
}
