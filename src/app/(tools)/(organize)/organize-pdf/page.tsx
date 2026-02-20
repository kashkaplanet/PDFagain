import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getToolSchema } from '@/utils/schema';
import { toolContent } from '@/config/tool-content';

export const metadata: Metadata = {
  title: 'Organize PDF - Sort, Rotate & Delete Pages | PDFagain',
  description: 'Sort, rotate, and delete pages from your PDF document in a visual editor. Fast, secure, and private processing in your browser. 100% free.',
  keywords: ['organize pdf', 'sort pdf pages', 'rearrange pdf', 'pdf page editor', 'free pdf tools'],
  alternates: {
    canonical: '/organize-pdf',
  },
  openGraph: {
    title: 'Organize PDF - Sort, Rotate & Delete Pages',
    description: 'Sort, rotate, and delete pages from your PDF document in a visual editor. Processing happens locally in your browser.',
    url: 'https://pdfagain.com/organize-pdf',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';
const OrganizePdfClient = dynamic(() => import('@/components/tools/OrganizePdfClient'));

export default function OrganizePdfPage() {
  return (
    <>
      <JsonLd data={getToolSchema(toolContent['organize-pdf'])} />
      <OrganizePdfClient />
    </>
  );
}
