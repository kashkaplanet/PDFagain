import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'JPG to PDF - Convert Images to PDF Online for Free | PDFagain',
  description: 'Experience the ultimate JPG to PDF tool with PDFagain. Convert JPG, PNG, and other image files to PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['jpg to pdf', 'image to pdf', 'convert jpg to pdf', 'png to pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/jpg-to-pdf',
  },
  openGraph: {
    title: 'JPG to PDF - Convert Images to PDF Online for Free',
    description: 'Experience the ultimate JPG to PDF tool with PDFagain. Convert JPG, PNG, and other image files to PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/jpg-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const JpgToPdfClient = dynamic(() => import('@/components/tools/JpgToPdfClient'));

export default function JpgToPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "JPG to PDF",
    "description": "Experience the ultimate JPG to PDF tool with PDFagain. Convert JPG, PNG, and other image files to PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/jpg-to-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JpgToPdfClient />
    </>
  );
}
