import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Bank Statement Converter | PDFagain',
  description: 'Convert bank statement PDFs into structured data formats. Extract and organize financial data from your statements. 100% free, secure, and private.',
  keywords: ['bank statement converter', 'convert bank statement', 'pdf to csv bank', 'financial pdf converter', 'free pdf tools'],
  alternates: {
    canonical: '/bank-statement-converter',
  },
  openGraph: {
    title: 'Bank Statement Converter | PDFagain',
    description: 'Convert bank statement PDFs into structured data formats. Extract and organize financial data locally in your browser.',
    url: 'https://pdfagain.com/bank-statement-converter',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const BankStatementConverterClient = dynamic(() => import('@/components/tools/BankStatementConverterClient'));

export default function BankStatementConverterPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Bank Statement Converter",
    "description": "Convert bank statement PDFs into structured data formats with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/bank-statement-converter",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <BankStatementConverterClient />
    </>
  );
}
