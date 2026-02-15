import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XPS To PDF | PDFagain',
  description: 'Free online XPS To PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const XpsToPdfClient = dynamic(() => import('@/components/tools/XpsToPdfClient'));






export default function XpsToPdfPage() {
  return <XpsToPdfClient />;
}
