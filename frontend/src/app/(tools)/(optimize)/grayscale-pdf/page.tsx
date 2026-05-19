import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Grayscale PDF - Convert PDF to Black and White | PDFagain',
  description: 'Experience the ultimate Grayscale PDF tool with PDFagain. Convert PDF colors to grayscale. Reduce file size and save ink. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['grayscale pdf', 'convert pdf to black and white', 'remove color from pdf', 'pdf grayscale', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/grayscale-pdf',
  },
  openGraph: {
    title: 'Grayscale PDF - Convert PDF to Black and White',
    description: 'Experience the ultimate Grayscale PDF tool with PDFagain. Convert PDF colors to grayscale. Reduce file size and save ink. 100% free, secure, and private - processing happens locally in your browser.',
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
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "Grayscale PDF",
    "description": "Experience the ultimate Grayscale PDF tool with PDFagain. Convert PDF colors to grayscale. Reduce file size and save ink. 100% free, secure, and private - processing happens locally in your browser.",
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
