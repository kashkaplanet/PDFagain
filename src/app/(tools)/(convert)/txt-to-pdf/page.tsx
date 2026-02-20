import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TXT To PDF | PDFagain',
  description: 'Experience the best online TXT To PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const TxtToPdfClient = dynamic(() => import('@/components/tools/TxtToPdfClient'));






export default function TxtToPdfPage() {
  return <TxtToPdfClient />;
}
