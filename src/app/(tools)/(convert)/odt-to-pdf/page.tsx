import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ODT To PDF | PDFagian',
  description: 'Free online ODT To PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const OdtToPdfClient = dynamic(() => import('@/components/tools/OdtToPdfClient'));






export default function OdtToPdfPage() {
    return <OdtToPdfClient />;
}
