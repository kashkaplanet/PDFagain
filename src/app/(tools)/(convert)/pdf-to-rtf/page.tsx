import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To RTF | PDFagain',
  description: 'Experience the best online PDF To RTF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToRtfClient = dynamic(() => import('@/components/tools/PdfToRtfClient'));






export default function PdfToRtfPage() {
  return <PdfToRtfClient />;
}
