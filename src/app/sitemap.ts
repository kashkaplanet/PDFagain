import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const currentDate = new Date();

    // Root route
    const routes = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Tool routes - All tools from file structure check
    const tools = [
        // Analyze
        'bank-statement-analyzer',
        'compare-pdf',
        'invoice-extractor',
        'legal-comparison',
        'ocr-pdf',
        'pdf-metadata',

        // Convert
        'bank-statement-converter',
        'binary-to-jpg',
        'binary-to-pdf',
        'binary-to-txt',
        'csv-to-excel',
        'excel-to-csv',
        'excel-to-pdf',
        'html-to-pdf',
        'jpg-to-binary',
        'jpg-to-pdf',
        'odt-to-pdf',
        'pdf-to-binary',
        'pdf-to-excel',
        'pdf-to-jpg',
        'pdf-to-odt',
        'pdf-to-png',
        'pdf-to-ppt',
        'pdf-to-rtf',
        'pdf-to-txt',
        'pdf-to-webp',
        'pdf-to-word',
        'png-to-pdf',
        'ppt-to-pdf',
        'rtf-to-pdf',
        'txt-to-binary',
        'txt-to-pdf',
        'webp-to-pdf',
        'word-to-pdf',
        'xps-to-pdf',

        // Edit
        'edit-pdf',
        'page-numbers',
        'redact-pdf',
        'reverse-pdf',
        'rotate-pdf',
        'sign-pdf',
        'watermark-pdf',

        // Optimize
        'compress-pdf',
        'flatten-pdf',
        'grayscale-pdf',
        'repair-pdf',
        'resize-pdf',

        // Organize
        'extract-pages',
        'merge-pdf',
        'organize-pdf',
        'remove-pages',
        'split-pdf',

        // Security
        'protect-pdf',
        'unlock-pdf',
    ];

    const toolRoutes = tools.map((tool) => ({
        url: `${baseUrl}/${tool}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...toolRoutes];
}
