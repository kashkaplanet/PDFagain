import { MetadataRoute } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { blogPosts } from '@/config/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pdfagain.com';

    try {
        // Helper to get file modification time
        function getFileModTime(filePath: string): Date {
            try {
                const stats = fs.statSync(filePath);
                return stats.mtime;
            } catch (e) {
                return new Date(); // Fallback to current time
            }
        }

        // 1. Static & Tool Pages (Recursive Scan)
        const appDir = path.join(process.cwd(), 'src/app');

        // Returns array of { route: string, filePath: string }
        function getPageRoutes(dir: string, baseUrlPath: string = ''): { route: string, filePath: string }[] {
            let routes: { route: string, filePath: string }[] = [];
            if (!fs.existsSync(dir)) return [];

            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (item.startsWith('api') || item.startsWith('_') || item.startsWith('.')) continue;

                    const nextUrlPath = item.startsWith('(') && item.endsWith(')')
                        ? baseUrlPath
                        : `${baseUrlPath}/${item}`;

                    routes = [...routes, ...getPageRoutes(fullPath, nextUrlPath)];

                } else if (item === 'page.tsx' || item === 'page.ts') {
                    routes.push({
                        route: baseUrlPath === '' ? '/' : baseUrlPath,
                        filePath: fullPath
                    });
                }
            }
            return routes;
        }

        const allRoutes = getPageRoutes(appDir);
        const staticRoutes = allRoutes.filter(r => !r.route.includes('['));

        const staticSitemapEntries = staticRoutes.map(({ route, filePath }) => ({
            url: `${baseUrl}${route === '/' ? '' : route}`,
            lastModified: getFileModTime(filePath),
            changeFrequency: 'monthly' as const,
            priority: route === '/' ? 1 : 0.8,
        }));

        // 2. Blog Posts
        // Build map of postId -> filePath
        const postsDir = path.join(process.cwd(), 'src/config/posts');
        const postIdToPathMap = new Map<string, string>();

        if (fs.existsSync(postsDir)) {
            const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
            for (const file of postFiles) {
                const filePath = path.join(postsDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                // Simple regex to extract id: "..." or id: '...'
                const match = content.match(/id:\s*["']([^"']+)["']/);
                if (match) {
                    postIdToPathMap.set(match[1], filePath);
                }
            }
        }

        const blogSitemapEntries = blogPosts.map((post) => {
            const filePath = postIdToPathMap.get(post.id);
            // Use file mtime if found, otherwise fallback to post.date (which is a string, so new Date(post.date))
            const lastMod = filePath ? getFileModTime(filePath) : new Date(post.date);

            return {
                url: `${baseUrl}/blog/${post.id}`,
                lastModified: lastMod,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });

        return [...staticSitemapEntries, ...blogSitemapEntries];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return [{ url: baseUrl, lastModified: new Date() }];
    }
}
