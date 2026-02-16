import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DownloadQueueProvider } from "@/components/DownloadQueue";
import { FileProvider } from "@/context/FileContext";
import { DragDropOverlay } from "@/components/DragDropOverlay";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "@/components/ScrollToTop";
import { RouteDebugger } from "@/components/RouteDebugger";



export const dynamic = 'force-dynamic';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const futura = localFont({
  src: [
    {
      path: "./fonts/FuturaBoldCondensed.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PDFagain - 100% Free PDF Tools",
    template: "%s | PDFagain",
  },
  description: "Chat with PDF, edit, convert, and organize. 100% free and local processing. No file uploads - secure and private PDF tools.",
  applicationName: "PDFagain",
  authors: [{ name: "PDFagain" }],
  generator: "Next.js",
  keywords: ["pdf tools", "convert pdf", "edit pdf", "merge pdf", "split pdf", "compress pdf", "free pdf tools", "offline pdf tools", "local pdf processing", "chat with pdf", "ocr pdf"],
  referrer: "origin-when-cross-origin",
  creator: "PDFagain",
  publisher: "PDFagain",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PDFagain - 100% Free PDF Tools",
    description: "Chat with PDF, edit, convert, and organize. 100% free and local processing. No file uploads - secure and private PDF tools.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "PDFagain",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // We should probably create this or use a default one - I'll assume one exists or will be created, or user can provide
        width: 1200,
        height: 630,
        alt: "PDFagain - Free PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFagain - 100% Free PDF Tools",
    description: "Chat with PDF, edit, convert, and organize. 100% free and local processing.",
    creator: "@pdfagain", // Placeholder
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "oHFlkOrLUDLGhKisacaWwSarLvxBdX7kBeDDt8pR8rY",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};

export const viewport: Viewport = {
  themeColor: "#FFFBE6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1595077575947362"
          crossOrigin="anonymous"
        ></script>
        <script data-cfasync="false" src="https://cmp.gatekeeperconsent.com/min.js"></script>
        <script data-cfasync="false" src="https://the.gatekeeperconsent.com/cmp.min.js"></script>
        <meta name="ezoic-site-verification" content="Bl2N8Swc1x9FmJreejK4l9uTrHS2R6" />
        <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${futura.variable} font-sans antialiased bg-[#FFFBE6] text-black text-lg`} suppressHydrationWarning>
        <DownloadQueueProvider>
          <FileProvider>
            <ScrollToTop />
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:font-display focus:text-sm focus:border-2 focus:border-white">
              Skip to content
            </a>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                {children}
              </main>
              <Footer />
            </div>
            <DragDropOverlay />
            <RouteDebugger />
            <JsonLd />
            <Analytics />
          </FileProvider>
        </DownloadQueueProvider>
      </body>
    </html>
  );
}
