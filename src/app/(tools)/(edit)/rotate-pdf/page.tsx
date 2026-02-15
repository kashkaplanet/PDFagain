import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Rotate PDF - Rotate PDF Pages Online for Free | PDFagian',
  description: 'Rotate PDF pages permanently. Rotate individual pages or all pages. 100% free, secure, and local processing.',
  keywords: ['rotate pdf', 'rotate pdf pages', 'turn pdf pages', 'pdf rotator', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/rotate-pdf',
  },
  openGraph: {
    title: 'Rotate PDF - Rotate PDF Pages Online for Free',
    description: 'Rotate PDF pages permanently. Rotate individual pages or all pages. 100% free, secure, and local processing.',
    url: 'https://pdfagian.com/rotate-pdf',
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
    "description": "Rotate PDF pages permanently. Rotate individual pages or all pages.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagian.com/rotate-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <RotatePdfClient />
    </>
  );
}
