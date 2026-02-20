import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary To PDF | PDFagain',
  description: 'Experience the best online Binary To PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const BinaryToPdfClient = dynamic(() => import('@/components/tools/BinaryToPdfClient'));






export default function BinaryToPdfPage() {
  return <BinaryToPdfClient />;
}
