import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Remove Pages from PDF - Delete PDF Pages | PDFagain',
  description: 'Delete unwanted pages from your PDF documents instantly. Fast, secure, and private processing directly in your browser. 100% free.',
  keywords: ['remove pdf pages', 'delete pdf pages', 'pdf page remover', 'edit pdf pages', 'free pdf tools'],
  alternates: {
    canonical: '/remove-pages',
  },
  openGraph: {
    title: 'Remove Pages from PDF - Delete PDF Pages',
    description: 'Delete unwanted pages from your PDF documents instantly. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/remove-pages',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const RemovePagesClient = dynamic(() => import('@/components/tools/RemovePagesPdfClient'));

export default function RemovePagesPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['remove-pages'])} />
      <RemovePagesClient />
    </>
  );
}
