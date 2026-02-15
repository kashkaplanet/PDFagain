import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PDF to Word - Convert PDF to DOCX Online for Free | PDFagain',
  description: 'Convert PDF files to editable Word (DOCX) documents. 100% free, secure, and processing happens locally in your browser.',
  keywords: ['pdf to word', 'convert pdf to docx', 'pdf converter', 'editable word', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/pdf-to-word',
  },
  openGraph: {
    title: 'PDF to Word - Convert PDF to DOCX Online for Free',
    description: 'Convert PDF files to editable Word documents. 100% free, secure, and processing happens locally.',
    url: 'https://pdfagain.com/pdf-to-word',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToWordClient = dynamic(() => import('@/components/tools/PdfToWordClient'));

export default function PdfToWordPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "PDF to Word",
    "description": "Convert PDF files to editable Word (DOCX) documents.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/pdf-to-word",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PdfToWordClient />
    </>
  );
}
