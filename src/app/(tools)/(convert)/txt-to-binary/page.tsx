import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TXT To Binary | PDFagain',
  description: 'Free online TXT To Binary tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const TxtToBinaryClient = dynamic(() => import('@/components/tools/TxtToBinaryClient'));






export default function TxtToBinaryPage() {
  return <TxtToBinaryClient />;
}
