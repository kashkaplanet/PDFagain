import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // serverExternalPackages: ['pdfjs-dist'], // Try adding this if it fails again
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium', 'canvas', 'tesseract.js'],
  // swcMinify is enabled by default in Next.js 15+

  // Disable transpilation for now to see if it fixes the worker error
  // Disable transpilation for now to see if it fixes the worker error
  // transpilePackages: ['pdfjs-dist'],



  webpack: (config, { isServer }) => {
    // Handle node: protocol imports used by pptxgenjs and other packages
    if (!isServer) {
      // Set up fallbacks for Node.js built-in modules on client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        https: false,
        http: false,
        crypto: false,
        stream: false,
        zlib: false,
        path: false,
        os: false,
        canvas: false, // Critical for pdfjs-dist
        "node:fs": false,
        "node:path": false,
        "node:crypto": false,
        "node:stream": false,
        "node:zlib": false,
        "node:os": false,
      };
    }

    // canvas is handled via serverExternalPackages instead of aliasing

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.DISABLE_PWA === "true",
  register: true,
  skipWaiting: true,
});

export default withBundleAnalyzer(withPWA(nextConfig));
