import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary To JPG | PDFagain',
  description: 'Experience the best online Binary To JPG tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const BinaryToJpgClient = dynamic(() => import('@/components/tools/BinaryToJpgClient'));






export default function BinaryToJpgPage() {
  return <BinaryToJpgClient />;
}
