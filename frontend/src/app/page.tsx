"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

import JsonLd, { homePageSchema } from "@/components/JsonLd";

const HomePage = dynamic(() => import("@/components/HomePage"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <Loader2 className="w-10 h-10 animate-spin text-zinc-500" />
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <JsonLd data={homePageSchema} />
      <HomePage />
    </>
  );
}
