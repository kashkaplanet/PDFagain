/**
 * Simple in-memory rate limiter.
 * NOTE: In serverless environments (e.g. Vercel), this only works per-instance.
 * Each cold start creates a fresh Map, so rate limiting is best-effort.
 * For distributed rate limiting, use Upstash Redis or Vercel KV.
 */

type RateLimitConfig = {
    interval: number; // Window size in milliseconds
    limit: number;    // Max requests per window
};

const trackers = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(ip: string, config: RateLimitConfig = { interval: 60 * 1000, limit: 5 }) {
    const now = Date.now();
    const record = trackers.get(ip);

    if (!record || now > record.expiresAt) {
        trackers.set(ip, {
            count: 1,
            expiresAt: now + config.interval,
        });
        return { success: true, remaining: config.limit - 1 };
    }

    if (record.count >= config.limit) {
        return { success: false, remaining: 0 };
    }

    record.count++;
    return { success: true, remaining: config.limit - record.count };
}
