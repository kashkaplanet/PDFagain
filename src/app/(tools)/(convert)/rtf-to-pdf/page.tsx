import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RTF To PDF | PDFagain',
  description: 'Experience the best online RTF To PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const RtfToPdfClient = dynamic(() => import('@/components/tools/RtfToPdfClient'));






export default function RtfToPdfPage() {
  return <RtfToPdfClient />;
}
