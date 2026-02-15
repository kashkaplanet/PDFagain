import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Metadata | PDFagain',
  description: 'Free online PDF Metadata tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';

const MetadataPdfClient = dynamic(() => import('@/components/tools/MetadataPdfClient'));





export default function MetadataPdfPage() {
  return <MetadataPdfClient />;
}
