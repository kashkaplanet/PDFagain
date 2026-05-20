import puppeteer, { Browser, Page } from "puppeteer";

/**
 * Singleton browser pool for efficient Puppeteer usage.
 * Reuses a single browser instance across all PDF conversion requests.
 */
class BrowserPool {
    private browser: Browser | null = null;
    private isLaunching = false;
    private launchPromise: Promise<Browser> | null = null;

    private getLaunchOptions() {
        const options: Record<string, any> = {
            headless: true as const,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process',
                '--no-zygote',
            ],
        };
        // Use system Chromium on Railway/production
        if (process.env.PUPPETEER_EXECUTABLE_PATH) {
            options.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
        }
        return options;
    }

    /**
     * Get the browser instance, launching if necessary
     */
    private async getBrowser(): Promise<Browser> {
        // Return existing browser if connected
        if (this.browser && this.browser.connected) {
            return this.browser;
        }

        // Wait for in-progress launch
        if (this.isLaunching && this.launchPromise) {
            return this.launchPromise;
        }

        // Launch new browser
        this.isLaunching = true;
        this.launchPromise = puppeteer.launch(this.getLaunchOptions());

        try {
            this.browser = await this.launchPromise;
            console.log("[BrowserPool] Browser launched");

            // Handle unexpected disconnection
            this.browser.on('disconnected', () => {
                console.log("[BrowserPool] Browser disconnected");
                this.browser = null;
            });

            return this.browser;
        } finally {
            this.isLaunching = false;
            this.launchPromise = null;
        }
    }

    /**
     * Get a new page from the browser pool
     */
    async getPage(): Promise<Page> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        console.log("[BrowserPool] New page created");
        return page;
    }

    /**
     * Release a page back to the pool (closes the page)
     */
    async releasePage(page: Page): Promise<void> {
        try {
            if (!page.isClosed()) {
                await page.close();
                console.log("[BrowserPool] Page released");
            }
        } catch (error) {
            console.error("[BrowserPool] Error closing page:", error);
        }
    }

    /**
     * Close the browser entirely (for graceful shutdown)
     */
    async shutdown(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            console.log("[BrowserPool] Browser shutdown complete");
        }
    }
}

// Singleton instance
const browserPool = new BrowserPool();

// Graceful shutdown handlers
if (typeof process !== 'undefined') {
    process.on('SIGTERM', () => browserPool.shutdown());
    process.on('SIGINT', () => browserPool.shutdown());
}

export { browserPool };
export type { BrowserPool };
