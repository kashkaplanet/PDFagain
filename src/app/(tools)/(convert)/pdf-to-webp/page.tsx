import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF To Webp | PDFagian',
  description: 'Free online PDF To Webp tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
import type { RetroVariant } from '@/config/design';

const PdfToJpgClient = dynamic(() => import('@/components/tools/PdfToJpgClient'));






export default function PdfToWebpPage() {
    const variant: RetroVariant = "blue";
    return (
        <PdfToJpgClient
            title="PDF to WebP"
            description="Convert each page of your PDF into modern WebP images."
            outputFormat="webp"
            variant={variant}
        />
    );
}
