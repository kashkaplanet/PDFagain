import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Sign PDF - Add Digital Signature to PDF Online | PDFagain',
  description: 'Sign PDF documents online for free. Draw your signature or upload an image. Secure and local processing.',
  keywords: ['sign pdf', 'esign pdf', 'digital signature', 'add signature to pdf', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/sign-pdf',
  },
  openGraph: {
    title: 'Sign PDF - Add Digital Signature to PDF Online',
    description: 'Sign PDF documents online for free. Draw your signature or upload an image. Secure and local processing.',
    url: 'https://pdfagain.com/sign-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
import React from 'react';
const SignPdfClient = dynamic(() => import('@/components/tools/SignPdfClient'));

export default function SignPdfPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "image": "https://pdfagain.com/icons/icon-512.svg",
    "name": "Sign PDF",
    "description": "Sign PDF documents online for free. Draw your signature or upload an image.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://pdfagain.com/sign-pdf",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <SignPdfClient />
    </>
  );
}
