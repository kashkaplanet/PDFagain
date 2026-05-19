import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/error-handler.js';
import { browserPool } from './services/browser-pool.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition', 'Content-Length']
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically load routes
const routesDir = path.join(__dirname, 'routes');
if (fs.existsSync(routesDir)) {
    const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of routeFiles) {
        const routeName = file.replace(/\.(ts|js)$/, '');
        const routePath = `/api/${routeName}`;
        
        // Use an IIFE or handle promises properly
        import(`./routes/${file}`).then(routeModule => {
            if (routeModule.getHandler) {
                app.get(routePath, routeModule.getHandler);
            }
            if (routeModule.postHandler) {
                import('multer').then(multerModule => {
                    const multer = multerModule.default;
                    const upload = multer({ storage: multer.memoryStorage() });
                    app.post(routePath, upload.any(), routeModule.postHandler);
                });
            }
            console.log(`Mounted route: ${routePath}`);
        });
    }
}

// Global Error Handler
app.use(errorHandler);

// Graceful shutdown
const server = app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Shutting down gracefully.');
    server.close();
    await browserPool.shutdown();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Shutting down gracefully.');
    server.close();
    await browserPool.shutdown();
    process.exit(0);
});
