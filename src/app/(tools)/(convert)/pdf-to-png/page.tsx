import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PDF To PNG | PDFagain',
    description: 'Free online PDF To PNG tool. Fast, secure, and private. No installation required.',
};

import dynamic from 'next/dynamic';
import React from 'react';
const PdfToJpgClient = dynamic(() => import('@/components/tools/PdfToJpgClient'));






export default function PdfToPngPage() {
    return (
        <PdfToJpgClient
            title="PDF to PNG"
            description="Convert each page of your PDF into high-quality PNG images."
            outputFormat="png"
            variant="blue"
        />
    );
}
