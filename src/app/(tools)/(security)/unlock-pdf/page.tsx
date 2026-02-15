import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Unlock PDF - Remove Password from PDF | PDFagain',
  description: 'Remove password protection from PDF files. Unlock PDF documents instantly. 100% free, secure, and local processing.',
  keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'pdf password remover', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/unlock-pdf',
  },
  openGraph: {
    title: 'Unlock PDF - Remove Password from PDF',
    description: 'Remove password protection from PDF files. Unlock PDF documents instantly. 100% free and local processing.',
    url: 'https://pdfagain.com/unlock-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const UnlockPdfClient = dynamic(() => import('@/components/tools/UnlockPdfClient'));

export default function UnlockPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Unlock PDF",
    "description": "Remove password protection from PDF files. Unlock PDF documents instantly.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/unlock-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <UnlockPdfClient />
    </>
  );
}
