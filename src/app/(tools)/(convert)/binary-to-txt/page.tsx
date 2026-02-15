import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary To TXT | PDFagian',
  description: 'Free online Binary To TXT tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const BinaryToTxtClient = dynamic(() => import('@/components/tools/BinaryToTxtClient'));






export default function BinaryToTxtPage() {
    return <BinaryToTxtClient />;
}
