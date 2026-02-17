
export interface ToolContent {
    slug: string;
    title: string;
    description: string;
    howTo: {
        title: string;
        steps: { title: string; description: string }[];
    };
    features: {
        title: string;
        description: string;
        icon: string;
    }[];
    faq: {
        question: string;
        answer: string;
    }[];
}

export const toolContent: Record<string, ToolContent> = {
    "pdf-to-word": {
        slug: "pdf-to-word",
        title: "Convert PDF to Word",
        description: "Transform your PDF documents into editable Word (DOCX) files instantly. 100% free and secure processing directly in your browser.",
        howTo: {
            title: "How to Convert PDF to Word",
            steps: [
                {
                    title: "Select your PDF",
                    description: "Click the upload box or drag and drop your PDF file into the designated area."
                },
                {
                    title: "Let the magic happen",
                    description: "Our tool automatically processes the file. Since it runs locally on your device, it's incredibly fast."
                },
                {
                    title: "Download DOCX",
                    description: "Once the conversion is complete, click 'Download' to save your new editable Word document."
                }
            ]
        },
        features: [
            {
                title: "100% Free & Unlimited",
                description: "No hidden costs, no daily limits, and no watermarks. Convert as many files as you need.",
                icon: "Zap"
            },
            {
                title: "Private & Secure",
                description: "Your files never leave your computer. All processing happens in your browser, ensuring total privacy.",
                icon: "Shield"
            },
            {
                title: "High-Quality Conversion",
                description: "We preserve your layout, fonts, and formatting to give you the best possible Word document.",
                icon: "Star"
            },
            {
                title: "Works Offline",
                description: "No internet? No problem. Use our tools anywhere, anytime, directly from your browser.",
                icon: "WifiOff"
            }
        ],
        faq: [
            {
                question: "Is it really free?",
                answer: "Yes! PDFagain is completely free to use. We believe in providing accessible tools for everyone."
            },
            {
                question: "Do you store my files?",
                answer: "Absolutely not. Your files are processed locally on your device. We never upload or view your documents."
            },
            {
                question: "Can I convert scanned PDFs?",
                answer: "Currently, we support standard PDFs. For scanned documents, you might need OCR software first."
            }
        ]
    },
    "merge-pdf": {
        slug: "merge-pdf",
        title: "Merge PDF Files",
        description: "Combine multiple PDF files into a single document. Organize your files with our simple, drag-and-drop merger.",
        howTo: {
            title: "How to Combine PDF Files",
            steps: [
                {
                    title: "Upload PDFs",
                    description: "Select multiple PDF files you want to merge. You can upload them all at once."
                },
                {
                    title: "Rearrange",
                    description: "Drag and drop the file thumbnails to reorder them exactly how you want them to appear in the final document."
                },
                {
                    title: "Merge & Download",
                    description: "Click 'Merge PDF' and instantly download your combined file."
                }
            ]
        },
        features: [
            {
                title: "Easy Reordering",
                description: "Visual drag-and-drop interface makes it simple to arrange your documents.",
                icon: "Move"
            },
            {
                title: "Secure Processing",
                description: "Files are merged locally in your browser. No server uploads means your data stays safe.",
                icon: "Lock"
            },
            {
                title: "Fast & Efficient",
                description: "Merge large files in seconds without waiting for uploads or downloads.",
                icon: "Zap"
            }
        ],
        faq: [
            {
                question: "How many files can I merge?",
                answer: "There is no hard limit! You can merge as many files as your browser memory allows."
            },
            {
                question: "Can I merge different page sizes?",
                answer: "Yes, our tool handles different page sizes and orientations gracefully."
            }
        ]
    },
    "split-pdf": {
        slug: "split-pdf",
        title: "Split PDF",
        description: "Separate one page or a whole set for easy conversion into independent PDF files.",
        howTo: {
            title: "How to Split a PDF",
            steps: [
                { title: "Upload PDF", description: "Select the PDF file you want to split." },
                { title: "Select Pages", description: "Choose to extract all pages or select specific ranges (e.g., 1-5)." },
                { title: "Split & Download", description: "Click 'Split PDF' to get your separated files, typically as a ZIP archive." }
            ]
        },
        features: [
            { title: "Precise Control", description: "Extract exactly the pages you need.", icon: "Scissors" },
            { title: "Private", description: "Splitting happens on your device.", icon: "Shield" },
            { title: "Instant", description: "No waiting for uploads.", icon: "Zap" }
        ],
        faq: [
            { question: "Can I extract just one page?", answer: "Yes, you can extract a single page or any range of pages." },
            { question: "Is it secure?", answer: "Yes, your file is processed entirely in your browser." }
        ]
    },
    "compress-pdf": {
        slug: "compress-pdf",
        title: "Compress PDF",
        description: "Reduce the file size of your PDF while maintaining the best possible quality.",
        howTo: {
            title: "How to Compress a PDF",
            steps: [
                { title: "Upload PDF", description: "Select the PDF file you want to compress." },
                { title: "Choose Level", description: "Select your desired compression level (Recommended, Extreme, or Less)." },
                { title: "Compress", description: "The tool will optimize images and fonts to reduce file size." },
                { title: "Download", description: "Save your lighter, optimized PDF file." }
            ]
        },
        features: [
            { title: "Smart Optimization", description: "Reduces size without ruining quality.", icon: "Zap" },
            { title: "Secure", description: "Your sensitive documents never leave your computer.", icon: "Shield" },
            { title: "Free", description: "Compress as many files as you need.", icon: "Check" }
        ],
        faq: [
            { question: "Will my quality decrease?", answer: "We optimize the file to maintain the best visual quality while removing unnecessary data. 'Recommended' mode is best for most users." }
        ]
    },
    "protect-pdf": {
        slug: "protect-pdf",
        title: "Protect PDF",
        description: "Encrypt your PDF with a password to prevent unauthorized access.",
        howTo: {
            title: "How to Password Protect a PDF",
            steps: [
                { title: "Upload PDF", description: "Select the file you want to secure." },
                { title: "Set Password", description: "Type a strong password." },
                { title: "Encrypt", description: "Click 'Protect PDF' to apply the encryption." },
                { title: "Download", description: "Download your secure file." }
            ]
        },
        features: [
            { title: "Strong Encryption", description: "Uses standard PDF encryption.", icon: "Lock" },
            { title: "Client-Side", description: "Your password and file represent stay on your device.", icon: "Shield" },
            { title: "Instant", description: "No upload needed.", icon: "Zap" }
        ],
        faq: [
            { question: "Can you recover my password?", answer: "No. Since we don't store your files or passwords, we cannot recover them if lost. Please remember your password!" }
        ]
    },
    "unlock-pdf": {
        slug: "unlock-pdf",
        title: "Unlock PDF",
        description: "Remove password security from PDF files.",
        howTo: {
            title: "How to Unlock a PDF",
            steps: [
                { title: "Upload PDF", description: "Select the encrypted PDF file." },
                { title: "Enter Password", description: "If prompted, enter the owner password." },
                { title: "Unlock", description: "Click 'Unlock' to remove the security restrictions." },
                { title: "Download", description: "Save the unsecured PDF." }
            ]
        },
        features: [
            { title: "Remove Restrictions", description: "Enable printing, copying, and editing.", icon: "Unlock" },
            { title: "Secure", description: "Decryption happens locally.", icon: "Shield" },
            { title: "Free", description: "Unlock your files for free.", icon: "Check" }
        ],
        faq: [
            { question: "Can I unlock a file without the password?", answer: "Only if the file has weak encryption or only owner restrictions. Strong user passwords typically require the password to unlock." }
        ]
    },
    "jpg-to-pdf": {
        slug: "jpg-to-pdf",
        title: "JPG to PDF",
        description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
        howTo: {
            title: "How to Convert JPG to PDF",
            steps: [
                { title: "Upload Images", description: "Select one or more JPG images." },
                { title: "Arrange", description: "Drag and drop to reorder images." },
                { title: "Convert", description: "Click 'Convert' to create a PDF album." },
                { title: "Download", description: "Save your new PDF." }
            ]
        },
        features: [
            { title: "Batch Conversion", description: "Combine multiple images into one PDF.", icon: "Layers" },
            { title: "Fast", description: "Instant local conversion.", icon: "Zap" },
            { title: "Secure", description: "Photos stay on your device.", icon: "Shield" }
        ],
        faq: [
            { question: "Does it support other image formats?", answer: "This tool is optimized for JPGs. Use our PNG to PDF tool for PNG files." }
        ]
    },
    "organize-pdf": {
        slug: "organize-pdf",
        title: "Organize PDF",
        description: "Sort, rotate, and delete pages from your PDF document in a visual editor.",
        howTo: {
            title: "How to Organize PDF Pages",
            steps: [
                { title: "Upload PDF", description: "Select the PDF you want to organize." },
                { title: "Edit", description: "Drag and drop pages to reorder them. Use the buttons to rotate or delete specific pages." },
                { title: "Save", description: "Click 'Organize' to save your changes and download the new file." }
            ]
        },
        features: [
            { title: "Visual Editor", description: "See thumbnails of all your pages.", icon: "Move" },
            { title: "Secure", description: "Editing happens in your browser.", icon: "Shield" },
            { title: "Fast", description: "Instant feedback on your changes.", icon: "Zap" }
        ],
        faq: [
            { question: "Can I move pages between documents?", answer: "Currently, this tool organizes one document at a time. Use the Merge tool to combine files first." }
        ]
    },
    "extract-pages": {
        slug: "extract-pages",
        title: "Extract PDF Pages",
        description: "Save specific pages from a PDF as a new separate document.",
        howTo: {
            title: "How to Extract Pages",
            steps: [
                { title: "Upload PDF", description: "Choose your PDF file." },
                { title: "Select Pages", description: "Click the pages you want to keep, or type page numbers (e.g., 1, 3-5)." },
                { title: "Extract", description: "Click to create a new PDF containing only the selected pages." }
            ]
        },
        features: [
            { title: "Precision", description: "Keep only what matters.", icon: "Scissors" },
            { title: "Secure", description: "No uploads required.", icon: "Lock" },
            { title: "Free", description: "Extract pages from large files.", icon: "Check" }
        ],
        faq: [
            { question: "Does this delete the original pages?", answer: "No, it creates a copy. Your original file remains untouched." }
        ]
    },
    "remove-pages": {
        slug: "remove-pages",
        title: "Remove Pages from PDF",
        description: "Delete unwanted pages from your documents instantly.",
        howTo: {
            title: "How to Delete PDF Pages",
            steps: [
                { title: "Upload PDF", description: "Select the file containing pages you want to remove." },
                { title: "Select to Delete", description: "Click pages to mark them for deletion." },
                { title: "Remove", description: "Click the button to generate a new PDF without those pages." }
            ]
        },
        features: [
            { title: "Clean Up", description: "Remove blank or error pages.", icon: "Trash2" },
            { title: "Private", description: "Processing stays on your device.", icon: "Shield" },
            { title: "Simple", description: "One-click deletion.", icon: "Zap" }
        ],
        faq: [
            { question: "Can I undo this?", answer: "The tool creates a new file, so your original is safe. If you make a mistake, just upload the original again." }
        ]
    },
    "grayscale-pdf": {
        slug: "grayscale-pdf",
        title: "Convert PDF to Grayscale",
        description: "Save ink and reduce file size by converting your PDF to black and white.",
        howTo: {
            title: "How to Convert to Grayscale",
            steps: [
                { title: "Upload PDF", description: "Select your color PDF." },
                { title: "Convert", description: "Our engine strips color information, leaving high-quality grayscale." },
                { title: "Download", description: "Save the B&W version." }
            ]
        },
        features: [
            { title: "Save Ink", description: "Perfect for printing on monochrome printers.", icon: "Check" },
            { title: "Reduce Size", description: "Removing color often lowers file size.", icon: "Zap" },
            { title: "Secure", description: "Conversion happens locally.", icon: "Shield" }
        ],
        faq: [
            { question: "Is it reversible?", answer: "No, once color data is removed, it cannot be restored from the grayscale file." }
        ]
    },
    "flatten-pdf": {
        slug: "flatten-pdf",
        title: "Flatten PDF",
        description: "Merge layers and lock form fields to prevent further editing.",
        howTo: {
            title: "How to Flatten a PDF",
            steps: [
                { title: "Upload PDF", description: "Select your interactive PDF." },
                { title: "Flatten", description: "The tool merges annotations and form data into the background." },
                { title: "Download", description: "Save the non-editable version." }
            ]
        },
        features: [
            { title: "Lock Data", description: "Prevent changes to forms.", icon: "Lock" },
            { title: "Print Ready", description: "Ensures visual consistency.", icon: "Check" },
            { title: "Secure", description: "Local processing.", icon: "Shield" }
        ],
        faq: [
            { question: "Can I edit it afterwards?", answer: "No, flattening makes the content permanent part of the page image." }
        ]
    },
    "repair-pdf": {
        slug: "repair-pdf",
        title: "Repair PDF",
        description: "Attempt to recover data from corrupted or damaged PDF files.",
        howTo: {
            title: "How to Repair a PDF",
            steps: [
                { title: "Upload Corrupt File", description: "Select the PDF that won't open." },
                { title: "Analyze & Fix", description: "We scan the file structure and rebuild the reference table." },
                { title: "Download", description: "Save the recovered document." }
            ]
        },
        features: [
            { title: "Data Recovery", description: "Salvage important documents.", icon: "Wrench" },
            { title: "Secure", description: "We don't see your data.", icon: "Shield" },
            { title: "Automated", description: "Smart analysis algorithm.", icon: "Zap" }
        ],
        faq: [
            { question: "Does it work on all files?", answer: "We can fix many common structure errors, but severely damaged files with missing data may be unrecoverable." }
        ]
    },
    "pdf-to-binary": {
        slug: "pdf-to-binary",
        title: "PDF to Base64 Binary",
        description: "Convert a PDF file into a standard Base64 string for data transmission.",
        howTo: {
            title: "How to Convert PDF to Base64",
            steps: [
                { title: "Upload PDF", description: "Choose the file to encode." },
                { title: "Process", description: "The tool generates the Base64 string." },
                { title: "Copy/Download", description: "Copy the string to clipboard or download as text." }
            ]
        },
        features: [
            { title: "Developer Ready", description: "Perfect for API testing.", icon: "Zap" },
            { title: "Secure", description: "Encoding happens in browser.", icon: "Shield" },
            { title: "Free", description: "Unlimited encoding.", icon: "Check" }
        ],
        faq: [
            { question: "What is Base64?", answer: "It's a way to represent binary data (like a PDF) as text, useful for sending files in JSON or HTML." }
        ]
    },
    "jpg-to-binary": {
        slug: "jpg-to-binary",
        title: "JPG to Base64 Binary",
        description: "Convert a JPG image into a Base64 string for embedding or transmission.",
        howTo: {
            title: "How to Convert JPG to Base64",
            steps: [
                { title: "Upload JPG", description: "Select your image." },
                { title: "Encode", description: "Get the Base64 text representation." },
                { title: "Use", description: "Copy for use in HTML/CSS or APIs." }
            ]
        },
        features: [
            { title: "Embed Images", description: "Use images directly in code.", icon: "Zap" },
            { title: "Secure", description: "Local conversion.", icon: "Shield" },
            { title: "Fast", description: "Instant output.", icon: "Check" }
        ],
        faq: [
            { question: "Does this increase size?", answer: "Yes, Base64 is typically about 33% larger than the original binary file." }
        ]
    }
};

export const defaultToolContent: ToolContent = {
    slug: "default",
    title: "PDF Tool",
    description: "A powerful, free online PDF tool.",
    howTo: {
        title: "How to Use This Tool",
        steps: [
            { title: "Upload", description: "Select your file to get started." },
            { title: "Process", description: "Wait for the tool to process your document." },
            { title: "Download", description: "Save your result instantly." }
        ]
    },
    features: [
        { title: "Free", description: "Always free to use.", icon: "Check" },
        { title: "Secure", description: "Files stay on your device.", icon: "Shield" },
        { title: "Fast", description: "Instant local processing.", icon: "Zap" }
    ],
    faq: [{ question: "Is it free?", answer: "Yes, 100% free." }]
};
