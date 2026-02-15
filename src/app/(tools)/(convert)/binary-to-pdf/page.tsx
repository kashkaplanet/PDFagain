import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary To PDF | PDFagian',
  description: 'Free online Binary To PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const BinaryToPdfClient = dynamic(() => import('@/components/tools/BinaryToPdfClient'));






export default function BinaryToPdfPage() {
    return <BinaryToPdfClient />;
}
