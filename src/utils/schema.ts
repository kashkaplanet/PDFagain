
import { ToolContent } from "@/config/tool-content";

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

export function getToolSchema(tool: ToolContent, overrides?: Record<string, any>) {
    const softwareAppSchema = {
        "@type": "SoftwareApplication",
        "name": tool.title,
        "description": tool.description,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "url": `https://pdfagain.com/${tool.slug}`,
        "image": "https://pdfagain.com/icons/icon-512.svg",
        ...overrides
    };

    if (tool.faq && tool.faq.length > 0) {
        const faqSchema = getFaqSchema(tool.faq);
        return {
            "@context": "https://schema.org",
            "@graph": [
                softwareAppSchema,
                faqSchema
            ]
        };
    }

    return {
        "@context": "https://schema.org",
        ...softwareAppSchema
    };
}
