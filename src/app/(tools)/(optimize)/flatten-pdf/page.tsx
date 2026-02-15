import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Flatten PDF - Make PDF Read-Only Online | PDFagain',
  description: 'Flatten PDF forms and annotations to make them uneditable. Merge layers into a single layer. 100% free and local processing.',
  keywords: ['flatten pdf', 'make pdf read only', 'merge pdf layers', 'pdf flattener', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/flatten-pdf',
  },
  openGraph: {
    title: 'Flatten PDF - Make PDF Read-Only Online',
    description: 'Flatten PDF forms and annotations to make them uneditable. Merge layers into a single layer. 100% free and local processing.',
    url: 'https://pdfagain.com/flatten-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const FlattenPdfClient = dynamic(() => import('@/components/tools/FlattenPdfClient'));

export default function FlattenPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Flatten PDF",
    "description": "Flatten PDF forms and annotations to make them uneditable.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/flatten-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <FlattenPdfClient />
    </>
  );
}
