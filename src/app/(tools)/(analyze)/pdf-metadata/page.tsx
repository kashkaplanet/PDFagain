import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'PDF Metadata Editor - View & Edit PDF Properties | PDFagain',
  description: 'View and edit PDF metadata including title, author, subject, and keywords. Fast, secure, and private processing directly in your browser.',
  keywords: ['pdf metadata', 'edit pdf properties', 'pdf author', 'pdf title editor', 'free pdf tools'],
  alternates: {
    canonical: '/pdf-metadata',
  },
  openGraph: {
    title: 'PDF Metadata Editor - View & Edit PDF Properties',
    description: 'View and edit PDF metadata including title, author, subject, and keywords. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/pdf-metadata',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const PdfMetadataClient = dynamic(() => import('@/components/tools/MetadataPdfClient'));

export default function PdfMetadataPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['pdf-metadata'])} />
      <PdfMetadataClient />
    </>
  );
}
