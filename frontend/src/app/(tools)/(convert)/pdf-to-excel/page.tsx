import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PDF to Excel - Convert PDF to XLSX Online | PDFagain',
  description: 'Experience the ultimate PDF to Excel tool with PDFagain. Convert PDF tables using OCR to Editable Excel spreadsheets. Maintain formatting and data accuracy. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['pdf to excel', 'convert pdf to xlsx', 'extract tables from pdf', 'pdf table extractor', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/pdf-to-excel',
  },
  openGraph: {
    title: 'PDF to Excel - Convert PDF to XLSX Online',
    description: 'Experience the ultimate PDF to Excel tool with PDFagain. Convert PDF tables using OCR to Editable Excel spreadsheets. Maintain formatting and data accuracy. 100% free, secure, and private - processing happens locally in your browser.',
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
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "PDF to Excel",
    "description": "Experience the ultimate PDF to Excel tool with PDFagain. Convert PDF tables using OCR to Editable Excel spreadsheets. Maintain formatting and data accuracy. 100% free, secure, and private - processing happens locally in your browser.",
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
