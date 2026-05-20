import { rateLimit } from 'express-rate-limit';

// Standard heavy task limiter: 10 requests per 15 minutes
export const heavyTaskLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { error: 'Too many requests for this resource. Please try again later.' },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// Lighter tasks: 50 requests per 15 minutes
export const lightTaskLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
