import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Binary to PDF - Decode Base64 to PDF | PDFagain',
  description: 'Decode Base64 binary strings back into readable PDF documents. Fast, secure, and private processing directly in your browser. 100% free.',
  keywords: ['base64 to pdf', 'decode base64 pdf', 'binary to pdf', 'base64 decoder', 'free tools'],
  alternates: {
    canonical: '/binary-to-pdf',
  },
  openGraph: {
    title: 'Binary to PDF - Decode Base64 to PDF',
    description: 'Decode Base64 binary strings back into readable PDF documents. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/binary-to-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const BinaryToPdfClient = dynamic(() => import('@/components/tools/BinaryToPdfClient'));

export default function BinaryToPdfPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['binary-to-pdf'])} />
      <BinaryToPdfClient />
    </>
  );
}
