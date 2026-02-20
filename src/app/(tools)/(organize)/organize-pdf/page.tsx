import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organize PDF | PDFagain',
  description: 'Experience the best online Organize PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const OrganizePdfClient = dynamic(() => import('@/components/tools/OrganizePdfClient'));








export default function OrganizePdfPage() {
  return <OrganizePdfClient />;
}
