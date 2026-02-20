import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Excel to CSV - Convert XLSX to CSV | PDFagain',
  description: 'Convert Excel (XLSX) files to CSV format instantly. Fast, secure, and private processing directly in your browser. 100% free and easy to use.',
  keywords: ['excel to csv', 'convert xlsx to csv', 'excel converter', 'spreadsheet to csv', 'free tools'],
  alternates: {
    canonical: '/excel-to-csv',
  },
  openGraph: {
    title: 'Excel to CSV - Convert XLSX to CSV',
    description: 'Convert Excel (XLSX) files to CSV format instantly. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/excel-to-csv',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const ExcelToCsvClient = dynamic(() => import('@/components/tools/ExcelToCsvClient'));

export default function ExcelToCsvPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Excel to CSV Converter",
    "description": "Convert Excel (XLSX) files to CSV format instantly with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/excel-to-csv",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ExcelToCsvClient />
    </>
  );
}
