import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bank Statement Converter | PDFagain',
  description: 'Experience the best online Bank Statement Converter tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';

const BankStatementConverterClient = dynamic(() => import('@/components/tools/BankStatementConverterClient'));

export default function BankStatementConverterPage() {
  return <BankStatementConverterClient />;
}
