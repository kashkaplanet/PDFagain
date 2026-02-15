import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To Binary | PDFagain',
  description: 'Free online PDF To Binary tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToBinaryClient = dynamic(() => import('@/components/tools/PdfToBinaryClient'));






export default function PdfToBinaryPage() {
  return <PdfToBinaryClient />;
}
