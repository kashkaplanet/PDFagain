export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
    const memUsage = process.memoryUsage();

    const health = {
        status: "healthy",
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        memory: {
            heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
            rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        },
        env: process.env.NODE_ENV,
        node: process.version,
    };

    return NextResponse.json(health, { status: 200 });
}
