
import { RETRO_COLORS } from "./design";

// Import all blog posts
import { whyClientSide } from "./posts/why-client-side";
import { mergePdfGuide } from "./posts/merge-pdf-guide";
import { securityBestPractices } from "./posts/security-best-practices";
import { digitizePaperRecords } from "./posts/digitize-paper-records";
import { compressPdfEmail } from "./posts/compress-pdf-email";
import { digitalSignatures } from "./posts/digital-signatures";
import { whatIsPdfA } from "./posts/what-is-pdf-a";
import { reducePdfSizeGovernment } from "./posts/reduce-pdf-size-government";
import { studentPdfHacks } from "./posts/student-pdf-hacks";
import { travelDocumentManagement } from "./posts/travel-document-management";
import { resumePdfVsWord } from "./posts/resume-pdf-vs-word";
import { base64Pdf } from "./posts/base64-pdf";

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    readTime: string;
    color: keyof typeof RETRO_COLORS;
}

export const blogPosts: BlogPost[] = [
    whyClientSide,
    mergePdfGuide,
    securityBestPractices,
    digitizePaperRecords,
    compressPdfEmail,
    digitalSignatures,
    whatIsPdfA,
    reducePdfSizeGovernment,
    studentPdfHacks,
    travelDocumentManagement,
    resumePdfVsWord,
    base64Pdf
];
