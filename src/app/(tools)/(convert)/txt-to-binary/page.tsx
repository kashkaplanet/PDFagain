import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TXT To Binary | PDFagain',
  description: 'Experience the best online TXT To Binary tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const TxtToBinaryClient = dynamic(() => import('@/components/tools/TxtToBinaryClient'));






export default function TxtToBinaryPage() {
  return <TxtToBinaryClient />;
}
