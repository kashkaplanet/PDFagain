import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To Binary | PDFagain',
  description: 'Experience the best online PDF To Binary tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToBinaryClient = dynamic(() => import('@/components/tools/PdfToBinaryClient'));






export default function PdfToBinaryPage() {
  return <PdfToBinaryClient />;
}
