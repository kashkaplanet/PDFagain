import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Legal Document Comparison | PDFagain',
  description: 'Compare legal contracts and documents side-by-side. Specialized view for verifying clause changes and formatting. Fast, secure, and private processing in your browser.',
  keywords: ['legal comparison', 'compare contracts', 'legal document diff', 'contract comparison', 'free pdf tools'],
  alternates: {
    canonical: '/legal-comparison',
  },
  openGraph: {
    title: 'Legal Document Comparison | PDFagain',
    description: 'Compare legal contracts and documents side-by-side. Specialized view for verifying clause changes and formatting.',
    url: 'https://pdfagain.com/legal-comparison',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const LegalComparisonClient = dynamic(() => import('@/components/tools/LegalComparisonClient'));

export default function LegalComparisonPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['legal-comparison'])} />
      <LegalComparisonClient />
    </>
  );
}
