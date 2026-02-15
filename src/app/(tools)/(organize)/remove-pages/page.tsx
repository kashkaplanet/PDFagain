import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remove Pages | PDFagian',
  description: 'Free online Remove Pages tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const RemovePagesPdfClient = dynamic(() => import('@/components/tools/RemovePagesPdfClient'));








export default function RemovePagesPdfPage() {
    return <RemovePagesPdfClient />;
}
