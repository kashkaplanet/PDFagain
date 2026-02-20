import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PDF to JPG - Convert PDF Pages to Images | PDFagain',
  description: 'Experience the ultimate PDF to JPG tool with PDFagain. Convert PDF pages to high-quality JPG images. Extract images from PDF documents. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['pdf to jpg', 'convert pdf to image', 'save pdf as jpg', 'pdf to image converter', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/pdf-to-jpg',
  },
  openGraph: {
    title: 'PDF to JPG - Convert PDF Pages to Images',
    description: 'Experience the ultimate PDF to JPG tool with PDFagain. Convert PDF pages to high-quality JPG images. Extract images from PDF documents. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/pdf-to-jpg',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToJpgClient = dynamic(() => import('@/components/tools/PdfToJpgClient'));

export default function PdfToJpgPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "PDF to JPG",
    "description": "Experience the ultimate PDF to JPG tool with PDFagain. Convert PDF pages to high-quality JPG images. Extract images from PDF documents. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/pdf-to-jpg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PdfToJpgClient />
    </>
  );
}
