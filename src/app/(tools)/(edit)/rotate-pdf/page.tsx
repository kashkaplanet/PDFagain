import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Rotate PDF - Rotate PDF Pages Online for Free | PDFagain',
  description: 'Experience the ultimate Rotate PDF tool with PDFagain. Rotate PDF pages permanently. Orient your PDF documents correctly. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['rotate pdf', 'rotate pdf pages', 'turn pdf pages', 'pdf rotator', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/rotate-pdf',
  },
  openGraph: {
    title: 'Rotate PDF - Rotate PDF Pages Online for Free',
    description: 'Experience the ultimate Rotate PDF tool with PDFagain. Rotate PDF pages permanently. Orient your PDF documents correctly. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/rotate-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const RotatePdfClient = dynamic(() => import('@/components/tools/RotatePdfClient'));

export default function RotatePdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Rotate PDF",
    "description": "Experience the ultimate Rotate PDF tool with PDFagain. Rotate PDF pages permanently. Orient your PDF documents correctly. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/rotate-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <RotatePdfClient />
    </>
  );
}
