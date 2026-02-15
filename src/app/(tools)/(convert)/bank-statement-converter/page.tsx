import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bank Statement Converter | PDFagain',
  description: 'Free online Bank Statement Converter tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';

const BankStatementConverterClient = dynamic(() => import('@/components/tools/BankStatementConverterClient'));

export default function BankStatementConverterPage() {
  return <BankStatementConverterClient />;
}
