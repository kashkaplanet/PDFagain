import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Binary to Text - Decode Base64 to Plain Text | PDFagain',
  description: 'Decode Base64 binary strings back into plain text files. Fast, secure, and private processing directly in your browser. 100% free.',
  keywords: ['base64 to text', 'decode base64', 'binary to text', 'base64 decoder', 'free tools'],
  alternates: {
    canonical: '/binary-to-txt',
  },
  openGraph: {
    title: 'Binary to Text - Decode Base64 to Plain Text',
    description: 'Decode Base64 binary strings back into plain text files. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/binary-to-txt',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const BinaryToTxtClient = dynamic(() => import('@/components/tools/BinaryToTxtClient'));

export default function BinaryToTxtPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['binary-to-txt'])} />
      <BinaryToTxtClient />
    </>
  );
}
