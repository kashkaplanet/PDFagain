import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'PDF to Base64 Binary - Encode PDF as Base64 | PDFagain',
  description: 'Convert PDF files into Base64 binary strings for data transmission and API testing. Fast, secure, and private processing in your browser. 100% free.',
  keywords: ['pdf to base64', 'encode pdf', 'pdf to binary', 'base64 encoder', 'free tools'],
  alternates: {
    canonical: '/pdf-to-binary',
  },
  openGraph: {
    title: 'PDF to Base64 Binary - Encode PDF as Base64',
    description: 'Convert PDF files into Base64 binary strings. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/pdf-to-binary',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const PdfToBinaryClient = dynamic(() => import('@/components/tools/PdfToBinaryClient'));

export default function PdfToBinaryPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['pdf-to-binary'])} />
      <PdfToBinaryClient />
    </>
  );
}
