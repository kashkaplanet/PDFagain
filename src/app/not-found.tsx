import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <FileQuestion className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-display">Page Not Found</h2>
            <p className="text-gray-600 max-w-md mb-8">
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#FF6B6B] text-white rounded-lg font-medium hover:bg-[#ff5252] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none border-2 border-black"
            >
                Back to Home
            </Link>
        </div>
    );
}
