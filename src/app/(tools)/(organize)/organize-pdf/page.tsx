import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organize PDF | PDFagain',
  description: 'Free online Organize PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const OrganizePdfClient = dynamic(() => import('@/components/tools/OrganizePdfClient'));








export default function OrganizePdfPage() {
  return <OrganizePdfClient />;
}
