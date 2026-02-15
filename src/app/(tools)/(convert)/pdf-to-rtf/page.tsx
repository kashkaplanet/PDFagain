import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To RTF | PDFagain',
  description: 'Free online PDF To RTF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToRtfClient = dynamic(() => import('@/components/tools/PdfToRtfClient'));






export default function PdfToRtfPage() {
  return <PdfToRtfClient />;
}
