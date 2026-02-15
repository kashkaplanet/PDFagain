import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary To JPG | PDFagain',
  description: 'Free online Binary To JPG tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const BinaryToJpgClient = dynamic(() => import('@/components/tools/BinaryToJpgClient'));






export default function BinaryToJpgPage() {
  return <BinaryToJpgClient />;
}
