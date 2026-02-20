import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Protect PDF - Encrypt PDF with Password | PDFagain',
  description: 'Experience the ultimate Protect PDF tool with PDFagain. Protect your PDF files with a password. Encrypt PDF documents securely. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['protect pdf', 'encrypt pdf', 'password protect pdf', 'pdf security', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/protect-pdf',
  },
  openGraph: {
    title: 'Protect PDF - Encrypt PDF with Password',
    description: 'Experience the ultimate Protect PDF tool with PDFagain. Protect your PDF files with a password. Encrypt PDF documents securely. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/protect-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const ProtectPdfClient = dynamic(() => import('@/components/tools/ProtectPdfClient'));

export default function ProtectPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Protect PDF",
    "description": "Experience the ultimate Protect PDF tool with PDFagain. Protect your PDF files with a password. Encrypt PDF documents securely. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/protect-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ProtectPdfClient />
    </>
  );
}
