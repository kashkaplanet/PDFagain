type JsonLdProps = {
    data?: Record<string, any>;
};

export default function JsonLd({ data }: JsonLdProps) {
    const defaultData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "name": "PDFagain",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "description": "Experience the ultimate PDF toolkit with PDFagain. Chat with your documents using AI, edit, convert, merge, split, and organize files locally. 100% free, secure, and private - no file uploads required.",
                "featureList": [
                    "Convert PDF to Word, Excel, JPG",
                    "Edit PDF documents",
                    "Merge and Split PDFs",
                    "OCR PDF",
                    "Chat with PDF AI"
                ],
                "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
                "softwareVersion": "1.0.0"
            },
            {
                "@type": "Organization",
                "name": "PDFagain",
                "url": "https://pdfagain.com",
                "logo": "https://pdfagain.com/icons/icon-512.svg",
                "sameAs": [
                    "https://twitter.com/pdfagain"
                ],
                "description": "Experience the ultimate PDF toolkit with PDFagain. Chat with your documents using AI, edit, convert, merge, split, and organize files locally. 100% free, secure, and private - no file uploads required."
            }
        ]
    };

    const finalData = data ? { "@context": "https://schema.org", ...data } : defaultData;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(finalData) }}
        />
    );
}
