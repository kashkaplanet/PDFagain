import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSV To Excel | PDFagian',
  description: 'Free online CSV To Excel tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const CsvToExcelClient = dynamic(() => import('@/components/tools/CsvToExcelClient'));






export default function CsvToExcelPage() {
    return <CsvToExcelClient />;
}
