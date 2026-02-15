"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';

const ViewPdfClient = dynamic(() => import('@/components/tools/ViewPdfClient'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 animate-spin text-[#A3E635]" />
        </div>
    ),
});

export default function ViewPdfPage() {
    return <ViewPdfClient />;
}
