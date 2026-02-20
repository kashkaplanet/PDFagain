import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remove Pages | PDFagain',
  description: 'Experience the best online Remove Pages tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const RemovePagesPdfClient = dynamic(() => import('@/components/tools/RemovePagesPdfClient'));








export default function RemovePagesPdfPage() {
  return <RemovePagesPdfClient />;
}
