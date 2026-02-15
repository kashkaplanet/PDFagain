import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reverse PDF | PDFagain',
  description: 'Free online Reverse PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const ReversePdfClient = dynamic(() => import('@/components/tools/ReversePdfClient'));








export default function ReversePdfPage() {
  return <ReversePdfClient />;
}
