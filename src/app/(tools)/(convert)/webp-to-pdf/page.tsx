import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webp To PDF | PDFagian',
  description: 'Free online Webp To PDF tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const JpgToPdfClient = dynamic(() => import('@/components/tools/JpgToPdfClient'));






export default function WebpToPdfPage() {
    return (
        <JpgToPdfClient
            title="WEBP to PDF"
            description="Convert WEBP images to a single PDF document."
            accept={{ "image/webp": [".webp"] }}
            variant="cyan"
        />
    );
}
