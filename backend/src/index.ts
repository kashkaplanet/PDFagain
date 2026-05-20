import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { errorHandler } from './middleware/error-handler.js';
import { browserPool } from './services/browser-pool.js';
import { rateLimit } from 'express-rate-limit';
import multer from 'multer';

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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(limiter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically load routes
const initServer = async () => {
    const routesDir = path.join(__dirname, 'routes');
    if (fs.existsSync(routesDir)) {
        const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        
        // Configure multer for disk storage
        const uploadDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadDir)
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
            }
        });
        const upload = multer({ 
            storage: storage,
            limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
        });

        // Setup background temp file cleanup
        setInterval(async () => {
            try {
                const files = await fsPromises.readdir(uploadDir);
                const now = Date.now();
                for (const file of files) {
                    const filePath = path.join(uploadDir, file);
                    const stats = await fsPromises.stat(filePath);
                    if (now - stats.mtimeMs > 60 * 60 * 1000) { // 1 hour
                        await fsPromises.unlink(filePath).catch(() => {});
                    }
                }
            } catch (err) {
                console.error('Background temp cleanup error:', err);
            }
        }, 30 * 60 * 1000); // 30 minutes

        const cleanupTempFiles = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.on('finish', async () => {
                if (req.files && Array.isArray(req.files)) {
                    for (const file of req.files) {
                        if (file.path) {
                            try {
                                await fsPromises.unlink(file.path);
                            } catch (err) {
                                console.error('Failed to delete temp file:', file.path, err);
                            }
                        }
                    }
                }
            });
            next();
        };

        const promises = routeFiles.map(async (file) => {
            const routeName = file.replace(/\.(ts|js)$/, '');
            const routePath = `/api/${routeName}`;
            
            const routeModule = await import(`./routes/${file}`);
            if (routeModule.getHandler) {
                app.get(routePath, routeModule.getHandler);
            }
            if (routeModule.postHandler) {
                const middlewares = [];
                if (routeModule.rateLimiter) middlewares.push(routeModule.rateLimiter);
                middlewares.push(upload.any());
                if (routeModule.fileValidator) middlewares.push(routeModule.fileValidator);
                middlewares.push(cleanupTempFiles);
                
                app.post(routePath, ...middlewares, routeModule.postHandler);
            }
            console.log(`Mounted route: ${routePath}`);
        });

        await Promise.all(promises);
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
};

initServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
