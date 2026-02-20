import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Watermark PDF - Add Watermark to PDF Online | PDFagain',
  description: 'Experience the ultimate Watermark PDF tool with PDFagain. Add watermarks to your PDF documents. Custom text or image watermarks. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['watermark pdf', 'add watermark', 'pdf watermark', 'stamp pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/watermark-pdf',
  },
  openGraph: {
    title: 'Watermark PDF - Add Watermark to PDF Online',
    description: 'Experience the ultimate Watermark PDF tool with PDFagain. Add watermarks to your PDF documents. Custom text or image watermarks. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/watermark-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const WatermarkPdfClient = dynamic(() => import('@/components/tools/WatermarkPdfClient'));

export default function WatermarkPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Watermark PDF",
    "description": "Experience the ultimate Watermark PDF tool with PDFagain. Add watermarks to your PDF documents. Custom text or image watermarks. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/watermark-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <WatermarkPdfClient />
    </>
  );
}
