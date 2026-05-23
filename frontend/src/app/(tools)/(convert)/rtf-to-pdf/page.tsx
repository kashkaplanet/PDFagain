import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'RTF to PDF - Convert Rich Text to PDF | PDFagain',
  description: 'Convert RTF (Rich Text Format) files to PDF documents. Fast, secure, and private processing directly in your browser. 100% free and easy to use.',
  keywords: ['rtf to pdf', 'convert rtf to pdf', 'rich text to pdf', 'rtf converter', 'free pdf tools'],
  alternates: {
    canonical: '/rtf-to-pdf',
  },
  openGraph: {
    title: 'RTF to PDF - Convert Rich Text to PDF',
    description: 'Convert RTF (Rich Text Format) files to PDF documents. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/rtf-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const RtfToPdfClient = dynamic(() => import('@/components/tools/RtfToPdfClient'));

export default function RtfToPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "RTF to PDF Converter",
    "description": "Convert RTF (Rich Text Format) files to PDF documents with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/rtf-to-pdf",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <RtfToPdfClient />
    </>
  );
}
