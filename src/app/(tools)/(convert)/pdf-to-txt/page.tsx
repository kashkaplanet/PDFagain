import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To TXT | PDFagian',
  description: 'Free online PDF To TXT tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToTxtClient = dynamic(() => import('@/components/tools/PdfToTxtClient'));






export default function PdfToTxtPage() {
    return <PdfToTxtClient />;
}
