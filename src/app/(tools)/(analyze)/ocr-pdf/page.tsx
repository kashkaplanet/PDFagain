import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR PDF | PDFagain',
  description: 'Experience the best online OCR PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';


const OcrPdfClient = dynamic(() => import('@/components/tools/OcrPdfClient'));

export default function OcrPdfPage() {
  return <OcrPdfClient />;
}
