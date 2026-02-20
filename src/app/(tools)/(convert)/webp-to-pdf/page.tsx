import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Webp To PDF | PDFagain',
    description: 'Experience the best online Webp To PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
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
