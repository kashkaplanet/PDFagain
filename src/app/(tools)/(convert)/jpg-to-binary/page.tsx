import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JPG To Binary | PDFagain',
  description: 'Experience the best online JPG To Binary tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const JpgToBinaryClient = dynamic(() => import('@/components/tools/JpgToBinaryClient'));






export default function JpgToBinaryPage() {
  return <JpgToBinaryClient />;
}
