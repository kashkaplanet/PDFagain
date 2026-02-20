import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice Extractor | PDFagain',
  description: 'Experience the best online Invoice Extractor tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';

const InvoiceExtractorClient = dynamic(() => import('@/components/tools/InvoiceExtractorClient'));






export default function InvoiceExtractorPage() {
  return <InvoiceExtractorClient />;
}
