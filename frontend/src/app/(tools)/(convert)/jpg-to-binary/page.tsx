import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'JPG to Binary - Encode Image as Base64 | PDFagain',
  description: 'Convert JPG images into Base64 binary strings for data transmission. Fast, secure, and private processing directly in your browser. 100% free.',
  keywords: ['jpg to base64', 'image to binary', 'encode jpg', 'base64 encoder', 'free tools'],
  alternates: {
    canonical: '/jpg-to-binary',
  },
  openGraph: {
    title: 'JPG to Binary - Encode Image as Base64',
    description: 'Convert JPG images into Base64 binary strings. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/jpg-to-binary',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const JpgToBinaryClient = dynamic(() => import('@/components/tools/JpgToBinaryClient'));

export default function JpgToBinaryPage() {
  const jsonLdData = {
    "@type": "SoftwareApplication",
    "name": "JPG to Base64 Binary",
    "description": "Convert JPG images into Base64 binary strings with PDFagain.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://pdfagain.com/jpg-to-binary",
    "image": "https://pdfagain.com/icons/icon-512.svg",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JpgToBinaryClient />
    </>
  );
}
