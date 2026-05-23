import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Compare PDF - Side-by-Side PDF Comparison | PDFagain',
  description: 'Compare two PDF documents side-by-side to find differences. Fast, secure, and private processing directly in your browser. 100% free and easy to use.',
  keywords: ['compare pdf', 'pdf comparison', 'diff pdf', 'side by side pdf', 'free pdf tools'],
  alternates: {
    canonical: '/compare-pdf',
  },
  openGraph: {
    title: 'Compare PDF - Side-by-Side PDF Comparison',
    description: 'Compare two PDF documents side-by-side to find differences. Fast, secure, and private processing directly in your browser.',
    url: 'https://pdfagain.com/compare-pdf',
    type: 'website',
  },
};

const ComparePdfClient = dynamic(() => import('@/components/tools/ComparePdfClient'));

export default function ComparePdfPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['compare-pdf'])} />
      <ComparePdfClient />
    </>
  );
}
