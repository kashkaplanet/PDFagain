import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'PDF to Word - Convert PDF to DOCX Online for Free | PDFagain',
  description: 'Experience the ultimate PDF to Word tool with PDFagain. Convert PDF files to editable Word (DOCX) documents. 100% free, secure, and private - processing happens locally in your browser.',
  keywords: ['pdf to word', 'convert pdf to docx', 'pdf converter', 'editable word', 'free pdf tools', 'local pdf processing'],
  alternates: {
    canonical: '/pdf-to-word',
  },
  openGraph: {
    title: 'PDF to Word - Convert PDF to DOCX Online for Free',
    description: 'Experience the ultimate PDF to Word tool with PDFagain. Convert PDF files to editable Word (DOCX) documents. 100% free, secure, and private - processing happens locally in your browser.',
    url: 'https://pdfagain.com/pdf-to-word',
    type: 'website',
  },
};


import dynamic from 'next/dynamic';
import React from 'react';
const PdfToWordClient = dynamic(() => import('@/components/tools/PdfToWordClient'));

export default function PdfToWordPage() {


  return (
    <>
      <JsonLd data={getToolSchema(toolContent['pdf-to-word'])} />
      <PdfToWordClient />
    </>
  );
}
