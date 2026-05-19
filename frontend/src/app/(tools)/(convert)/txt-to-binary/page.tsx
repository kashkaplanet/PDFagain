import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Text to Binary - Encode Text as Base64 | PDFagain',
  description: 'Encode plain text into Base64 binary format. Fast, secure, and private processing directly in your browser. 100% free and easy to use.',
  keywords: ['text to base64', 'encode text', 'text to binary', 'base64 encoder', 'free tools'],
  alternates: {
    canonical: '/txt-to-binary',
  },
  openGraph: {
    title: 'Text to Binary - Encode Text as Base64',
    description: 'Encode plain text into Base64 binary format. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/txt-to-binary',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const TxtToBinaryClient = dynamic(() => import('@/components/tools/TxtToBinaryClient'));

export default function TxtToBinaryPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['txt-to-binary'])} />
      <TxtToBinaryClient />
    </>
  );
}
