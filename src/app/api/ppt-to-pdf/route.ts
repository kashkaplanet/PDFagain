export const dynamic = 'force-dynamic';

import { handleApiError } from '@/lib/api-utils';

export async function POST() {
    return handleApiError(
        new Error("Not Implemented"),
        "PPT to PDF conversion requires a Windows environment and is not available in serverless mode."
    );
}
