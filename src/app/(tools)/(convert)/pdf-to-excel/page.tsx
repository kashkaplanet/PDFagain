import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PDF to Excel - Convert PDF to XLSX Online | PDFagain',
  description: 'Convert PDF tables using OCR to Editable Excel spreadsheets. maintain formatting and data accuracy. 100% free and local processing.',
  keywords: ['pdf to excel', 'convert pdf to xlsx', 'extract tables from pdf', 'pdf table extractor', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/pdf-to-excel',
  },
  openGraph: {
    title: 'PDF to Excel - Convert PDF to XLSX Online',
    description: 'Convert PDF tables using OCR to Editable Excel spreadsheets. 100% free and local processing.',
    url: 'https://pdfagain.com/pdf-to-excel',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToExcelClient = dynamic(() => import('@/components/tools/PdfToExcelClient'));

export default function PdfToExcelPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "PDF to Excel",
    "description": "Convert PDF tables using OCR to Editable Excel spreadsheets.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/pdf-to-excel",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PdfToExcelClient />
    </>
  );
}
