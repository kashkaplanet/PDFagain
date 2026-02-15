import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To ODT | PDFagian',
  description: 'Free online PDF To ODT tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToOdtClient = dynamic(() => import('@/components/tools/PdfToOdtClient'));






export default function PdfToOdtPage() {
    return <PdfToOdtClient />;
}
