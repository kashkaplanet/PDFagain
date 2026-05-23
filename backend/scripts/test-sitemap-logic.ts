
import * as fs from 'fs';
import * as path from 'path';

// Mock blogPosts for testing logic
const blogPosts = [
    { id: 'why-client-side-pdf-tools-are-safer', date: 'February 17, 2026' },
    { id: 'merge-pdf-guide', date: 'February 17, 2026' }
];

async function sitemap() {
    const baseUrl = 'http://localhost:3000';

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
            filePath: filePath // Debugging
        }));

        console.log("Static Entries Pattern:");
        if (staticSitemapEntries.length > 0) {
            console.log(JSON.stringify(staticSitemapEntries[0], null, 2));
        }

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
                filePath: filePath // Debugging
            };
        });

        console.log("Blog Entries Pattern:");
        if (blogSitemapEntries.length > 0) {
            console.log(JSON.stringify(blogSitemapEntries[0], null, 2));
        }

    } catch (error) {
        console.error("Sitemap generation error:", error);
    }
}

sitemap();
