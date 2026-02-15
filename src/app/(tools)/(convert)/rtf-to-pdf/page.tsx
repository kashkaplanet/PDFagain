import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RTF To PDF | PDFagian',
  description: 'Free online RTF To PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const RtfToPdfClient = dynamic(() => import('@/components/tools/RtfToPdfClient'));






export default function RtfToPdfPage() {
    return <RtfToPdfClient />;
}
