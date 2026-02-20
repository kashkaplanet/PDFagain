import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Metadata | PDFagain',
  description: 'Experience the best online PDF Metadata tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';

const MetadataPdfClient = dynamic(() => import('@/components/tools/MetadataPdfClient'));





export default function MetadataPdfPage() {
  return <MetadataPdfClient />;
}
