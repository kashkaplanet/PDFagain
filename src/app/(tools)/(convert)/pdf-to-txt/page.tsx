import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To TXT | PDFagain',
  description: 'Experience the best online PDF To TXT tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToTxtClient = dynamic(() => import('@/components/tools/PdfToTxtClient'));






export default function PdfToTxtPage() {
  return <PdfToTxtClient />;
}
