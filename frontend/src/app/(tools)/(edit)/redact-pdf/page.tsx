import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Redact PDF - Black Out Text in PDF Online | PDFagain',
  description: 'Experience the ultimate Redact PDF tool with PDFagain. Redact sensitive information from PDF files securely. Permanently remove text and images. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['redact pdf', 'black out pdf', 'remove text from pdf', 'sanitize pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/redact-pdf',
  },
  openGraph: {
    title: 'Redact PDF - Black Out Text in PDF Online',
    description: 'Experience the ultimate Redact PDF tool with PDFagain. Redact sensitive information from PDF files securely. Permanently remove text and images. 100% free, secure, and private - processing happens locally in your browser.',
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
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "Redact PDF",
    "description": "Experience the ultimate Redact PDF tool with PDFagain. Redact sensitive information from PDF files securely. Permanently remove text and images. 100% free, secure, and private - processing happens locally in your browser.",
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
