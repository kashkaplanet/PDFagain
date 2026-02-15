import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PNG To PDF | PDFagain',
    description: 'Free online PNG To PDF tool. Fast, secure, and private. No installation required.',
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
