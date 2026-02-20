import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bank Statement Analyzer | PDFagain',
  description: 'Experience the best online Bank Statement Analyzer tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const BankStatementAnalyzerClient = dynamic(() => import('@/components/tools/BankStatementAnalyzerClient'));






export default function BankStatementAnalyzerPage() {
  return <BankStatementAnalyzerClient />;
}
