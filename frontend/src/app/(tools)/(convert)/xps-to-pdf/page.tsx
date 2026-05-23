import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'XPS to PDF - Convert XPS Files to PDF | PDFagain',
  description: 'Convert XPS (XML Paper Specification) files to PDF format. Fast, secure, and private processing directly in your browser. 100% free and easy to use.',
  keywords: ['xps to pdf', 'convert xps to pdf', 'xps converter', 'xps reader', 'free pdf tools'],
  alternates: {
    canonical: '/xps-to-pdf',
  },
  openGraph: {
    title: 'XPS to PDF - Convert XPS Files to PDF',
    description: 'Convert XPS (XML Paper Specification) files to PDF format. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/xps-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const XpsToPdfClient = dynamic(() => import('@/components/tools/XpsToPdfClient'));

export default function XpsToPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "XPS to PDF Converter",
    "description": "Convert XPS files to PDF format with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/xps-to-pdf",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <XpsToPdfClient />
    </>
  );
}
