import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Comparison | PDFagain',
  description: 'Free online Legal Comparison tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const LegalComparisonClient = dynamic(() => import('@/components/tools/LegalComparisonClient'));






export default function LegalComparisonPage() {
  return <LegalComparisonClient />;
}
