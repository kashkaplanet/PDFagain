import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TXT To PDF | PDFagian',
  description: 'Free online TXT To PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const TxtToPdfClient = dynamic(() => import('@/components/tools/TxtToPdfClient'));






export default function TxtToPdfPage() {
    return <TxtToPdfClient />;
}
