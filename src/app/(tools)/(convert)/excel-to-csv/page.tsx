import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Excel To CSV | PDFagian',
  description: 'Free online Excel To CSV tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const ExcelToCsvClient = dynamic(() => import('@/components/tools/ExcelToCsvClient'));






export default function ExcelToCsvPage() {
    return <ExcelToCsvClient />;
}
