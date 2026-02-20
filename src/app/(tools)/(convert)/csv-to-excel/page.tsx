import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'CSV to Excel - Convert CSV Files to XLSX | PDFagain',
  description: 'Convert CSV files to Excel (XLSX) format instantly. Fast, secure, and private processing directly in your browser. 100% free and easy to use.',
  keywords: ['csv to excel', 'convert csv to xlsx', 'csv converter', 'spreadsheet converter', 'free tools'],
  alternates: {
    canonical: '/csv-to-excel',
  },
  openGraph: {
    title: 'CSV to Excel - Convert CSV Files to XLSX',
    description: 'Convert CSV files to Excel (XLSX) format instantly. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/csv-to-excel',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const CsvToExcelClient = dynamic(() => import('@/components/tools/CsvToExcelClient'));

export default function CsvToExcelPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "CSV to Excel Converter",
    "description": "Convert CSV files to Excel (XLSX) format instantly with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/csv-to-excel",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <CsvToExcelClient />
    </>
  );
}
