import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Repair PDF - Fix Corrupted PDF Files | PDFagain',
  description: 'Experience the ultimate Repair PDF tool with PDFagain. Repair corrupted or damaged PDF files. Recover content from broken PDFs. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['repair pdf', 'fix pdf', 'recover pdf', 'corrupt pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/repair-pdf',
  },
  openGraph: {
    title: 'Repair PDF - Fix Corrupted PDF Files',
    description: 'Experience the ultimate Repair PDF tool with PDFagain. Repair corrupted or damaged PDF files. Recover content from broken PDFs. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/repair-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const RepairPdfClient = dynamic(() => import('@/components/tools/RepairPdfClient'));

export default function RepairPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "Repair PDF",
    "description": "Experience the ultimate Repair PDF tool with PDFagain. Repair corrupted or damaged PDF files. Recover content from broken PDFs. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/repair-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <RepairPdfClient />
    </>
  );
}
