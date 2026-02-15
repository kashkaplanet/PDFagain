import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Compress PDF - Reduce PDF File Size Online for Free | PDFagain',
  description: 'Compress PDF files to reduce size while maintaining quality. 100% free, secure, and processing happens locally in your browser.',
  keywords: ['compress pdf', 'reduce pdf size', 'optimize pdf', 'pdf compressor', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/compress-pdf',
  },
  openGraph: {
    title: 'Compress PDF - Reduce PDF File Size Online for Free',
    description: 'Compress PDF files to reduce size while maintaining quality. 100% free, secure, and processing happens locally.',
    url: 'https://pdfagain.com/compress-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const CompressPdfClient = dynamic(() => import('@/components/tools/CompressPdfClient'));

export default function CompressPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Compress PDF",
    "description": "Compress PDF files to reduce size while maintaining quality.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/compress-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <CompressPdfClient />
    </>
  );
}
