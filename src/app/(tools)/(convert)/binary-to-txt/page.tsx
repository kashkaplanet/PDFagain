import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary To TXT | PDFagain',
  description: 'Experience the best online Binary To TXT tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const BinaryToTxtClient = dynamic(() => import('@/components/tools/BinaryToTxtClient'));






export default function BinaryToTxtPage() {
  return <BinaryToTxtClient />;
}
