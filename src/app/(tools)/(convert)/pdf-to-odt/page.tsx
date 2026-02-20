import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PDF to ODT - Convert PDF to OpenDocument | PDFagain',
  description: 'Convert PDF files to ODT (OpenDocument Text) format. Fast, secure, and private processing directly in your browser. 100% free and easy to use.',
  keywords: ['pdf to odt', 'convert pdf to odt', 'pdf to opendocument', 'pdf converter', 'free pdf tools'],
  alternates: {
    canonical: '/pdf-to-odt',
  },
  openGraph: {
    title: 'PDF to ODT - Convert PDF to OpenDocument',
    description: 'Convert PDF files to ODT (OpenDocument Text) format. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/pdf-to-odt',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const PdfToOdtClient = dynamic(() => import('@/components/tools/PdfToOdtClient'));

export default function PdfToOdtPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "PDF to ODT Converter",
    "description": "Convert PDF files to ODT (OpenDocument Text) format with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/pdf-to-odt",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PdfToOdtClient />
    </>
  );
}
