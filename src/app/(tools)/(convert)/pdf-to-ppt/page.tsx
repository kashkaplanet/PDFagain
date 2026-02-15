import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PDF to PPT - Convert PDF to PowerPoint Online | PDFagian',
  description: 'Convert PDF slides to Editable PowerPoint (PPTX) presentations. Restore your slides instantly. 100% free and local processing.',
  keywords: ['pdf to ppt', 'convert pdf to powerpoint', 'pdf to pptx', 'pdf presentation converter', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/pdf-to-ppt',
  },
  openGraph: {
    title: 'PDF to PPT - Convert PDF to PowerPoint Online',
    description: 'Convert PDF slides to Editable PowerPoint (PPTX) presentations. Restore your slides instantly. 100% free and local processing.',
    url: 'https://pdfagian.com/pdf-to-ppt',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToPptClient = dynamic(() => import('@/components/tools/PdfToPptClient'));

export default function PdfToPptPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "PDF to PPT",
    "description": "Convert PDF slides to Editable PowerPoint (PPTX) presentations.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagian.com/pdf-to-ppt",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PdfToPptClient />
    </>
  );
}
