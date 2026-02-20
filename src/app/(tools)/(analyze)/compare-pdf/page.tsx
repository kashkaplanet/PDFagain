import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare PDF | PDFagain',
  description: 'Experience the best online Compare PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const ComparePdfClient = dynamic(() => import('@/components/tools/ComparePdfClient'));






export default function ComparePdfPage() {
  return <ComparePdfClient />;
}
