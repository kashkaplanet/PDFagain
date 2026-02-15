import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice Extractor | PDFagain',
  description: 'Free online Invoice Extractor tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';

const InvoiceExtractorClient = dynamic(() => import('@/components/tools/InvoiceExtractorClient'));






export default function InvoiceExtractorPage() {
  return <InvoiceExtractorClient />;
}
