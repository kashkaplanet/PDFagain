import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reverse PDF | PDFagain',
  description: 'Experience the best online Reverse PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const ReversePdfClient = dynamic(() => import('@/components/tools/ReversePdfClient'));








export default function ReversePdfPage() {
  return <ReversePdfClient />;
}
