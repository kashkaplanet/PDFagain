import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'PDF to Text - Extract Text from PDF | PDFagain',
  description: 'Extract all text content from PDF files. Convert PDFs to plain text (.txt) instantly. Fast, secure, and private processing in your browser. 100% free.',
  keywords: ['pdf to text', 'extract text from pdf', 'pdf to txt', 'pdf text extractor', 'free pdf tools'],
  alternates: {
    canonical: '/pdf-to-txt',
  },
  openGraph: {
    title: 'PDF to Text - Extract Text from PDF',
    description: 'Extract all text content from PDF files. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/pdf-to-txt',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const PdfToTxtClient = dynamic(() => import('@/components/tools/PdfToTxtClient'));

export default function PdfToTxtPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['pdf-to-txt'])} />
      <PdfToTxtClient />
    </>
  );
}
