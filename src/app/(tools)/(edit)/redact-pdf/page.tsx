import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Redact PDF - Black Out Text in PDF Online | PDFagain',
  description: 'Redact sensitive information from PDF files securely. Permanently remove text and images. 100% free and local processing.',
  keywords: ['redact pdf', 'black out pdf', 'remove text from pdf', 'sanitize pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/redact-pdf',
  },
  openGraph: {
    title: 'Redact PDF - Black Out Text in PDF Online',
    description: 'Redact sensitive information from PDF files securely. Permanently remove text and images. 100% free and local processing.',
    url: 'https://pdfagain.com/redact-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const RedactPdfClient = dynamic(() => import('@/components/tools/RedactPdfClient'));

export default function RedactPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Redact PDF",
    "description": "Redact sensitive information from PDF files securely.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/redact-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <RedactPdfClient />
    </>
  );
}
