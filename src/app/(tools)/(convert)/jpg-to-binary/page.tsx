import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JPG To Binary | PDFagian',
  description: 'Free online JPG To Binary tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const JpgToBinaryClient = dynamic(() => import('@/components/tools/JpgToBinaryClient'));






export default function JpgToBinaryPage() {
    return <JpgToBinaryClient />;
}
