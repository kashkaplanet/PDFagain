import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'HTML to PDF - Convert Web Pages to PDF | PDFagain',
  description: 'Experience the ultimate HTML to PDF tool with PDFagain. Convert HTML files and web pages to PDF documents. Save websites as PDF. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['html to pdf', 'convert web to pdf', 'save website as pdf', 'url to pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/html-to-pdf',
  },
  openGraph: {
    title: 'HTML to PDF - Convert Web Pages to PDF',
    description: 'Experience the ultimate HTML to PDF tool with PDFagain. Convert HTML files and web pages to PDF documents. Save websites as PDF. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/html-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const HtmlToPdfClient = dynamic(() => import('@/components/tools/HtmlToPdfClient'));

export default function HtmlToPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "HTML to PDF",
    "description": "Experience the ultimate HTML to PDF tool with PDFagain. Convert HTML files and web pages to PDF documents. Save websites as PDF. 100% free, secure, and private - processing happens locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/html-to-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <HtmlToPdfClient />
    </>
  );
}
