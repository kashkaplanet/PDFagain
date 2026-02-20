import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Invoice Extractor - Extract Data from PDF Invoices | PDFagain',
  description: 'Extract data from PDF invoices automatically. Pull out amounts, dates, and vendor information. Fast, secure, and private processing directly in your browser.',
  keywords: ['invoice extractor', 'pdf invoice', 'extract invoice data', 'invoice parser', 'free pdf tools'],
  alternates: {
    canonical: '/invoice-extractor',
  },
  openGraph: {
    title: 'Invoice Extractor - Extract Data from PDF Invoices',
    description: 'Extract data from PDF invoices automatically. Pull out amounts, dates, and vendor information. Fast, secure, and private processing.',
    url: 'https://pdfagain.com/invoice-extractor',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const InvoiceExtractorClient = dynamic(() => import('@/components/tools/InvoiceExtractorClient'));

export default function InvoiceExtractorPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Invoice Extractor",
    "description": "Extract data from PDF invoices automatically with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/invoice-extractor",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <InvoiceExtractorClient />
    </>
  );
}
