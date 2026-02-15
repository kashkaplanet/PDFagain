type JsonLdProps = {
    data?: Record<string, any>;
};

export default function JsonLd({ data }: JsonLdProps) {
    const defaultData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "PDFagian",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "100% Free PDF Tools. Chat with PDF, edit, convert, and organize files locally.",
        "featureList": [
            "Convert PDF to Word, Excel, JPG",
            "Edit PDF documents",
            "Merge and Split PDFs",
            "OCR PDF",
            "Chat with PDF AI"
        ],
        "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
        "softwareVersion": "1.0.0"
    };

    const finalData = data ? { "@context": "https://schema.org", ...data } : defaultData;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(finalData) }}
        />
    );
}
