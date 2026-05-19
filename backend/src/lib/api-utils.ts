import { Response } from 'express';

export function handleBadRequest(res: Response, message: string) {
    return res.status(400).json({ error: message });
}

export function handleApiError(res: Response, error: any, message: string) {
    console.error(message, error);
    return res.status(500).json(
        { error: message, details: error instanceof Error ? error.message : String(error) }
    );
}
