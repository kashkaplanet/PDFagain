import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PDF to JPG - Convert PDF Pages to Images | PDFagian',
  description: 'Convert PDF pages to high-quality JPG images. Extract images from PDF documents. 100% free and local processing.',
  keywords: ['pdf to jpg', 'convert pdf to image', 'save pdf as jpg', 'pdf to image converter', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/pdf-to-jpg',
  },
  openGraph: {
    title: 'PDF to JPG - Convert PDF Pages to Images',
    description: 'Convert PDF pages to high-quality JPG images. Extract images from PDF documents. 100% free and local processing.',
    url: 'https://pdfagian.com/pdf-to-jpg',
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
    "description": "Convert PDF pages to high-quality JPG images.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagian.com/pdf-to-jpg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PdfToJpgClient />
    </>
  );
}
