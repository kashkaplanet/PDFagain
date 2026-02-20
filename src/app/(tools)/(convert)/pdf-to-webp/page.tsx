import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PDF To Webp | PDFagain',
    description: 'Experience the best online PDF To Webp tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
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
