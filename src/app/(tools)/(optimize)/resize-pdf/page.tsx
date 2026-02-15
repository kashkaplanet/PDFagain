import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Resize PDF - Change PDF Page Size | PDFagain',
  description: 'Change the page size of your PDF document. Scale pages to A4, Letter, and more. 100% free and local processing.',
  keywords: ['resize pdf', 'change pdf size', 'scale pdf', 'pdf page size', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/resize-pdf',
  },
  openGraph: {
    title: 'Resize PDF - Change PDF Page Size',
    description: 'Change the page size of your PDF document. Scale pages to A4, Letter, and more. 100% free and local processing.',
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
    "description": "Change the page size of your PDF document.",
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
