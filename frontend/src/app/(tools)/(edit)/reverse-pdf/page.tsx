import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Reverse PDF Pages - Reverse Page Order | PDFagain',
  description: 'Reverse the order of pages in your PDF document instantly. Fix scanning errors where pages were fed backwards. 100% free, secure, and private.',
  keywords: ['reverse pdf', 'reverse page order', 'flip pdf pages', 'reorder pdf', 'free pdf tools'],
  alternates: {
    canonical: '/reverse-pdf',
  },
  openGraph: {
    title: 'Reverse PDF Pages - Reverse Page Order',
    description: 'Reverse the order of pages in your PDF document instantly. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/reverse-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const ReversePdfClient = dynamic(() => import('@/components/tools/ReversePdfClient'));

export default function ReversePdfPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['reverse-pdf'])} />
      <ReversePdfClient />
    </>
  );
}
