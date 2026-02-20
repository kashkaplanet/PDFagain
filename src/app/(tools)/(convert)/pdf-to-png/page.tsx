import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PDF To PNG | PDFagain',
    description: 'Experience the best online PDF To PNG tool with PDFagain. Fast, secure, and private processing directly in your browser. No installation or registration required. 100% free and easy to use.',
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
