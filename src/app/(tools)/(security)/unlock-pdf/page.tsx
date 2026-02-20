import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Unlock PDF - Remove Password from PDF | PDFagain',
  description: 'Experience the ultimate Unlock PDF tool with PDFagain. Remove password protection from PDF files. Unlock PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'pdf password remover', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/unlock-pdf',
  },
  openGraph: {
    title: 'Unlock PDF - Remove Password from PDF',
    description: 'Experience the ultimate Unlock PDF tool with PDFagain. Remove password protection from PDF files. Unlock PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.',
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
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "Unlock PDF",
    "description": "Experience the ultimate Unlock PDF tool with PDFagain. Remove password protection from PDF files. Unlock PDF documents instantly. 100% free, secure, and private - processing happens locally in your browser.",
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
