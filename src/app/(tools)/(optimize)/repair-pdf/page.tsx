import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Repair PDF - Fix Corrupted PDF Files | PDFagain',
  description: 'Repair corrupted or damaged PDF files. Recover data from unreadable PDFs. 100% free, secure, and local processing.',
  keywords: ['repair pdf', 'fix pdf', 'recover pdf', 'corrupt pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/repair-pdf',
  },
  openGraph: {
    title: 'Repair PDF - Fix Corrupted PDF Files',
    description: 'Repair corrupted or damaged PDF files. Recover data from unreadable PDFs. 100% free and local processing.',
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
    "name": "Repair PDF",
    "description": "Repair corrupted or damaged PDF files.",
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
