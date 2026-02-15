
import { NextResponse } from 'next/server';

export function handleBadRequest(message: string) {
    return NextResponse.json({ error: message }, { status: 400 });
}

export function handleApiError(error: any, message: string) {
    console.error(message, error);
    return NextResponse.json(
        { error: message, details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
    );
}
