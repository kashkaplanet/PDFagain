import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Excel to PDF - Convert XLSX to PDF Online for Free | PDFagain',
  description: 'Convert Excel spreadsheets (XLSX) to PDF documents instantly. 100% free, secure, and processing happens locally in your browser.',
  keywords: ['excel to pdf', 'xlsx to pdf', 'convert excel to pdf', 'xls to pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/excel-to-pdf',
  },
  openGraph: {
    title: 'Excel to PDF - Convert XLSX to PDF Online for Free',
    description: 'Convert Excel spreadsheets to PDF documents instantly. 100% free, secure, and processing happens locally.',
    url: 'https://pdfagain.com/excel-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const ExcelToPdfClient = dynamic(() => import('@/components/tools/ExcelToPdfClient'));

export default function ExcelToPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Excel to PDF",
    "description": "Convert Excel spreadsheets (XLSX) to PDF documents instantly.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/excel-to-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ExcelToPdfClient />
    </>
  );
}
