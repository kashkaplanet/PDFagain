import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XPS To PDF | PDFagain',
  description: 'Experience the best online XPS To PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const XpsToPdfClient = dynamic(() => import('@/components/tools/XpsToPdfClient'));






export default function XpsToPdfPage() {
  return <XpsToPdfClient />;
}
