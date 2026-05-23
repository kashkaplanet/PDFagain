import chromium from '@sparticuz/chromium';
import puppeteerCore, { Page, Browser } from 'puppeteer-core';

const isProduction = process.env.NODE_ENV === 'production';

let _browser: Browser | null = null;

export async function getBrowserPage(): Promise<Page> {
    if (!_browser) {
        if (isProduction) {
            const chromiumAny = chromium as any;
            _browser = await puppeteerCore.launch({
                args: chromiumAny.args,
                defaultViewport: chromiumAny.defaultViewport,
                executablePath: await chromiumAny.executablePath(),
                headless: chromiumAny.headless,
            }) as unknown as Browser;
        } else {
            // Dynamic import to avoid bundling puppeteer in production
            const puppeteer = (await import('puppeteer')).default;
            _browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true,
            });
        }
    }

    return await _browser.newPage();
}

export async function closeBrowser() {
    if (_browser) {
        await _browser.close();
        _browser = null;
    }
}
