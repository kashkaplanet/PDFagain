import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PDF to RTF - Convert PDF to Rich Text | PDFagain',
  description: 'Convert PDF files to RTF (Rich Text Format) for universal compatibility. Fast, secure, and private processing in your browser. 100% free.',
  keywords: ['pdf to rtf', 'convert pdf to rtf', 'pdf to rich text', 'pdf converter', 'free pdf tools'],
  alternates: {
    canonical: '/pdf-to-rtf',
  },
  openGraph: {
    title: 'PDF to RTF - Convert PDF to Rich Text',
    description: 'Convert PDF files to RTF (Rich Text Format) for universal compatibility. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/pdf-to-rtf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const PdfToRtfClient = dynamic(() => import('@/components/tools/PdfToRtfClient'));

export default function PdfToRtfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "PDF to RTF Converter",
    "description": "Convert PDF files to RTF (Rich Text Format) with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/pdf-to-rtf",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PdfToRtfClient />
    </>
  );
}
