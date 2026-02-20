import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSV To Excel | PDFagain',
  description: 'Experience the best online CSV To Excel tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const CsvToExcelClient = dynamic(() => import('@/components/tools/CsvToExcelClient'));






export default function CsvToExcelPage() {
  return <CsvToExcelClient />;
}
