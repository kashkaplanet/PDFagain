import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR PDF | PDFagian',
  description: 'Free online OCR PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';


const OcrPdfClient = dynamic(() => import('@/components/tools/OcrPdfClient'));

export default function OcrPdfPage() {
  return <OcrPdfClient />;
}
