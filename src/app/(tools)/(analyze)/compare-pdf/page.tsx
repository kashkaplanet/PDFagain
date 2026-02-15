import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare PDF | PDFagian',
  description: 'Free online Compare PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const ComparePdfClient = dynamic(() => import('@/components/tools/ComparePdfClient'));






export default function ComparePdfPage() {
    return <ComparePdfClient />;
}
