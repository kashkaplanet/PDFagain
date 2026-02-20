import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PNG To PDF | PDFagain',
    description: 'Experience the best online PNG To PDF tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const JpgToPdfClient = dynamic(() => import('@/components/tools/JpgToPdfClient'));






export default function PngToPdfPage() {
    return (
        <JpgToPdfClient
            title="PNG to PDF"
            description="Convert PNG images to a single PDF document."
            accept={{ "image/png": [".png"] }}
            variant="cyan"
        />
    );
}
