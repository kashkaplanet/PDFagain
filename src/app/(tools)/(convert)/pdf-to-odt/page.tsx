import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To ODT | PDFagain',
  description: 'Experience the best online PDF To ODT tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToOdtClient = dynamic(() => import('@/components/tools/PdfToOdtClient'));






export default function PdfToOdtPage() {
  return <PdfToOdtClient />;
}
