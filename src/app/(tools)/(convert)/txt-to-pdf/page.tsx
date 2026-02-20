import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Text to PDF - Convert TXT Files to PDF | PDFagain',
  description: 'Convert plain text files (.txt) into clean, readable PDF documents. Fast, secure, and private processing in your browser. 100% free.',
  keywords: ['text to pdf', 'convert txt to pdf', 'txt to pdf', 'text converter', 'free pdf tools'],
  alternates: {
    canonical: '/txt-to-pdf',
  },
  openGraph: {
    title: 'Text to PDF - Convert TXT Files to PDF',
    description: 'Convert plain text files into clean, readable PDF documents. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/txt-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const TxtToPdfClient = dynamic(() => import('@/components/tools/TxtToPdfClient'));

export default function TxtToPdfPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['txt-to-pdf'])} />
      <TxtToPdfClient />
    </>
  );
}
