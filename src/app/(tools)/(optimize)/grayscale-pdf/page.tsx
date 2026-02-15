import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Grayscale PDF - Convert PDF to Black and White | PDFagain',
  description: 'Convert PDF documents to grayscale (black and white). Reduce printing costs and file size. 100% free and local processing.',
  keywords: ['grayscale pdf', 'convert pdf to black and white', 'remove color from pdf', 'pdf grayscale', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/grayscale-pdf',
  },
  openGraph: {
    title: 'Grayscale PDF - Convert PDF to Black and White',
    description: 'Convert PDF documents to grayscale (black and white). Reduce printing costs and file size. 100% free and local processing.',
    url: 'https://pdfagain.com/grayscale-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const GrayscalePdfClient = dynamic(() => import('@/components/tools/GrayscalePdfClient'));

export default function GrayscalePdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Grayscale PDF",
    "description": "Convert PDF documents to grayscale (black and white).",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/grayscale-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <GrayscalePdfClient />
    </>
  );
}
