import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Binary to JPG - Decode Base64 to Image | PDFagain',
  description: 'Decode Base64 binary strings back into viewable JPG images. Fast, secure, and private processing directly in your browser. 100% free.',
  keywords: ['base64 to jpg', 'decode base64 image', 'binary to jpg', 'base64 decoder', 'free tools'],
  alternates: {
    canonical: '/binary-to-jpg',
  },
  openGraph: {
    title: 'Binary to JPG - Decode Base64 to Image',
    description: 'Decode Base64 binary strings back into viewable JPG images. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/binary-to-jpg',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const BinaryToJpgClient = dynamic(() => import('@/components/tools/BinaryToJpgClient'));

export default function BinaryToJpgPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['binary-to-jpg'])} />
      <BinaryToJpgClient />
    </>
  );
}
