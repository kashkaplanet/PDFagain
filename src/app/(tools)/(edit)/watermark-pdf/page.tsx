import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Watermark PDF - Add Watermark to PDF Online | PDFagian',
  description: 'Add text or image watermarks to your PDF documents. Customize position, opacity, and style. Secure and local processing.',
  keywords: ['watermark pdf', 'add watermark', 'pdf watermark', 'stamp pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/watermark-pdf',
  },
  openGraph: {
    title: 'Watermark PDF - Add Watermark to PDF Online',
    description: 'Add text or image watermarks to your PDF documents. Customize position, opacity, and style. Secure and local processing.',
    url: 'https://pdfagian.com/watermark-pdf',
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
    "description": "Add text or image watermarks to your PDF documents.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagian.com/watermark-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <WatermarkPdfClient />
    </>
  );
}
