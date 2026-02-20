import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Excel To CSV | PDFagain',
  description: 'Experience the best online Excel To CSV tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const ExcelToCsvClient = dynamic(() => import('@/components/tools/ExcelToCsvClient'));






export default function ExcelToCsvPage() {
  return <ExcelToCsvClient />;
}
