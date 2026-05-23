import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'OCR PDF - Extract Text from Scanned PDFs | PDFagain',
  description: 'Extract text from scanned PDF documents using OCR technology. Convert image-based PDFs into searchable, selectable text. 100% free, secure, and private.',
  keywords: ['ocr pdf', 'extract text from pdf', 'scanned pdf to text', 'pdf ocr', 'free ocr tool'],
  alternates: {
    canonical: '/ocr-pdf',
  },
  openGraph: {
    title: 'OCR PDF - Extract Text from Scanned PDFs',
    description: 'Extract text from scanned PDF documents using OCR technology. Convert image-based PDFs into searchable, selectable text.',
    url: 'https://pdfagain.com/ocr-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const OcrPdfClient = dynamic(() => import('@/components/tools/OcrPdfClient'));

export default function OcrPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "OCR PDF",
    "description": "Extract text from scanned PDF documents using OCR technology with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/ocr-pdf",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <OcrPdfClient />
    </>
  );
}
