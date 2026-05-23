import { Request, Response } from 'express';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pdfagain.com";

// All active tool URLs — keep in sync with src/config/tools.ts
const TOOL_URLS: { href: string; popular?: boolean }[] = [
    // ORGANIZE
    { href: "/extract-pages" }, { href: "/merge-pdf", popular: true },
    { href: "/organize-pdf" }, { href: "/remove-pages" },
    { href: "/reverse-pdf" }, { href: "/split-pdf", popular: true },
    // EDIT
    { href: "/crop-pdf" }, { href: "/edit-pdf" }, { href: "/flatten-pdf" },
    { href: "/page-numbers" }, { href: "/redact-pdf" }, { href: "/rotate-pdf" },
    { href: "/sign-pdf" }, { href: "/watermark-pdf" },
    // OPTIMIZE
    { href: "/compress-pdf", popular: true }, { href: "/repair-pdf" }, { href: "/resize-pdf" },
    // SECURITY
    { href: "/protect-pdf" }, { href: "/unlock-pdf", popular: true },
    // CONVERT TO PDF
    { href: "/html-to-pdf" }, { href: "/jpg-to-pdf", popular: true },
    { href: "/png-to-pdf" }, { href: "/ppt-to-pdf" }, { href: "/rtf-to-pdf" },
    { href: "/txt-to-pdf" }, { href: "/webp-to-pdf" }, { href: "/word-to-pdf" }, { href: "/xps-to-pdf" },
    // CONVERT FROM PDF
    { href: "/pdf-to-excel" }, { href: "/pdf-to-jpg" }, { href: "/pdf-to-odt" },
    { href: "/pdf-to-png" }, { href: "/pdf-to-ppt" }, { href: "/pdf-to-rtf" },
    { href: "/pdf-to-txt" }, { href: "/pdf-to-webp" }, { href: "/pdf-to-word", popular: true },
    // DATA & FINANCE
    { href: "/bank-statement-converter" }, { href: "/csv-to-excel" }, { href: "/excel-to-csv" },
    // ENCODING & BINARY
    { href: "/binary-to-jpg" }, { href: "/binary-to-pdf" }, { href: "/binary-to-txt" },
    { href: "/jpg-to-binary" }, { href: "/pdf-to-binary" }, { href: "/txt-to-binary" },
    // VIEW & COMPARE
    { href: "/compare-pdf" }, { href: "/legal-comparison" }, { href: "/view-pdf" },
];

const STATIC_PAGES = [
    { href: "", priority: 1.0, freq: "daily" },
    { href: "/chat", priority: 0.9, freq: "weekly" },
    { href: "/about", priority: 0.5, freq: "monthly" },
    { href: "/privacy", priority: 0.3, freq: "monthly" },
    { href: "/terms", priority: 0.3, freq: "monthly" },
    { href: "/contact", priority: 0.4, freq: "monthly" },
];

function buildXml(): string {
    const now = new Date().toISOString();
    const urls = [
        ...STATIC_PAGES.map(p => `  <url>\n    <loc>${BASE_URL}${p.href}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`),
        ...TOOL_URLS.map(t => `  <url>\n    <loc>${BASE_URL}${t.href}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${t.popular ? 0.9 : 0.7}</priority>\n  </url>`),
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
}

export const getHandler = async (req: Request, res: Response) => {
    res.set({
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        });
        return res.send(buildXml());
}
