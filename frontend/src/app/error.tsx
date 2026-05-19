'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-display">Something went wrong!</h2>
            <p className="text-gray-600 max-w-md mb-8">
                We apologize for the inconvenience. An unexpected error occurred.
            </p>
            <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none border-2 border-black"
            >
                <RefreshCcw className="w-4 h-4" />
                Try again
            </button>
        </div>
    );
}
