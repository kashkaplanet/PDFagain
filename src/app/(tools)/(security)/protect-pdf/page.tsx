import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Protect PDF - Encrypt PDF with Password | PDFagian',
  description: 'Protect your PDF files with a password. Encrypt PDF documents securely. 100% free and local processing.',
  keywords: ['protect pdf', 'encrypt pdf', 'password protect pdf', 'pdf security', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/protect-pdf',
  },
  openGraph: {
    title: 'Protect PDF - Encrypt PDF with Password',
    description: 'Protect your PDF files with a password. Encrypt PDF documents securely. 100% free and local processing.',
    url: 'https://pdfagian.com/protect-pdf',
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
    "description": "Protect your PDF files with a password. Encrypt PDF documents securely.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagian.com/protect-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ProtectPdfClient />
    </>
  );
}
