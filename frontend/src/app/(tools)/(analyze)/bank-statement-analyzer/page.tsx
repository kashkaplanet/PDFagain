import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Bank Statement Analyzer | PDFagain',
  description: 'Analyze bank statements with PDFagain. Extract transactions, totals, and insights from your PDF bank statements. Fast, secure, and private processing directly in your browser.',
  keywords: ['bank statement analyzer', 'pdf bank statement', 'extract transactions', 'financial pdf tools', 'free pdf tools'],
  alternates: {
    canonical: '/bank-statement-analyzer',
  },
  openGraph: {
    title: 'Bank Statement Analyzer | PDFagain',
    description: 'Analyze bank statements with PDFagain. Extract transactions, totals, and insights from your PDF bank statements. Fast, secure, and private processing directly in your browser.',
    url: 'https://pdfagain.com/bank-statement-analyzer',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const BankStatementAnalyzerClient = dynamic(() => import('@/components/tools/BankStatementAnalyzerClient'));

export default function BankStatementAnalyzerPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "Bank Statement Analyzer",
    "description": "Analyze bank statements with PDFagain. Extract transactions, totals, and insights from your PDF bank statements.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/bank-statement-analyzer",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <BankStatementAnalyzerClient />
    </>
  );
}
