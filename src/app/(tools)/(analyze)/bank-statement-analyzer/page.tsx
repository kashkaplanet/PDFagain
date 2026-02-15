import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bank Statement Analyzer | PDFagain',
  description: 'Free online Bank Statement Analyzer tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const BankStatementAnalyzerClient = dynamic(() => import('@/components/tools/BankStatementAnalyzerClient'));






export default function BankStatementAnalyzerPage() {
  return <BankStatementAnalyzerClient />;
}
