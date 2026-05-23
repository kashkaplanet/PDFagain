
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
                { title: "Upload PDF", description: "Select the PDF file you want to extract pages from, or simply drag and drop it." },
                { title: "Select & Reorder", description: "Click pages to select them. Drag selected pages to rearrange the output order." },
                { title: "Extract & Download", description: "Click 'Extract' to create a new PDF containing only your selected pages, then download instantly." }
            ]
        },
        features: [
            { title: "Visual Page Picker", description: "Browse all pages with live thumbnails. Click to select, drag to reorder — you see exactly what you'll get.", icon: "Move" },
            { title: "Custom Page Ordering", description: "Don't just extract — rearrange. Drag selected pages into any order before downloading your new PDF.", icon: "Star" },
            { title: "100% Private & Local", description: "Your PDF never leaves your device. All extraction happens directly in the browser — no uploads, no servers.", icon: "Shield" },
            { title: "Free & Unlimited", description: "No file size limits, no daily caps, no watermarks. Extract pages from any PDF, as many times as you need.", icon: "Zap" }
        ],
        faq: [
            { question: "Does this modify my original file?", answer: "No, we create a brand-new PDF. Your original remains completely untouched." },
            { question: "Can I rearrange the extracted pages?", answer: "Yes! After selecting pages, drag them into any order in the 'Selected Pages' panel before extracting." },
            { question: "Is there a limit on file size or pages?", answer: "No. Processing is local, so the only limit is your browser's available memory." }
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
    "sign-pdf": {
        slug: "sign-pdf",
        title: "Sign PDF",
        description: "Create and add electronic signatures to your PDF documents.",
        howTo: {
            title: "How to Sign a PDF",
            steps: [
                { title: "Upload PDF", description: "Select the document needing a signature." },
                { title: "Create Signature", description: "Draw with your mouse, type your name, or upload an image." },
                { title: "Place & Save", description: "Drag the signature to the correct spot and click 'Download'." }
            ]
        },
        features: [
            { title: "eSignatures", description: "Quickly sign contracts and forms.", icon: "PenTool" },
            { title: "Secure", description: "Signing happens locally. We don't store your signature.", icon: "Shield" },
            { title: "Multi-Platform", description: "Works on desktop and mobile.", icon: "Check" }
        ],
        faq: [
            { question: "Is this legally binding?", answer: "Electronic signatures are valid in many jurisdictions, but for highly sensitive legal documents, check your local laws regarding digital signature requirements." }
        ]
    },
    "compare-pdf": {
        slug: "compare-pdf",
        title: "Compare PDF Files",
        description: "Compare two PDF documents side-by-side to find differences.",
        howTo: {
            title: "How to Compare PDFs",
            steps: [
                { title: "Upload Files", description: "Select two PDF versions you want to compare." },
                { title: "Analyze", description: "The tool overlays or visualizes differences between the documents." },
                { title: "Review", description: "Scroll through to see what has changed." }
            ]
        },
        features: [
            { title: "Visual Comparison", description: "Spot layout changes easily.", icon: "GitCompare" },
            { title: "Privacy", description: "Comparison logic runs in your browser.", icon: "Shield" },
            { title: "Fast", description: "No need to print and scan to check changes.", icon: "Zap" }
        ],
        faq: [
            { question: "Does it highlight text changes?", answer: "Currently, we focus on visual page comparison. Text-diffing features are in development." }
        ]
    },
    "legal-comparison": {
        slug: "legal-comparison",
        title: "Legal Document Comparison",
        description: "Specialized view for comparing legal contract versions.",
        howTo: {
            title: "How to Compare Contracts",
            steps: [
                { title: "Upload Versions", description: "Upload the original and the revised contract." },
                { title: "Compare", description: "View them side-by-side to ensure integrity." },
                { title: "Verify", description: "Check clause numbering and formatting." }
            ]
        },
        features: [
            { title: "Side-by-Side", description: "Classic split-screen view.", icon: "Scale" },
            { title: "Secure", description: "Confidential contracts stay on your machine.", icon: "Lock" },
            { title: "Precise", description: "High-resolution rendering.", icon: "Check" }
        ],
        faq: [
            { question: "Is the data sent to a server?", answer: "Never. Legal documents are processed strictly within your browser session." }
        ]
    },
    "view-pdf": {
        slug: "view-pdf",
        title: "View PDF Online",
        description: "A lightweight, fast, and secure PDF viewer for your browser.",
        howTo: {
            title: "How to View a PDF",
            steps: [
                { title: "Upload PDF", description: "Drag and drop your PDF file, or click to browse. You can open multiple files at once." },
                { title: "Read & Navigate", description: "Use the toolbar to jump between pages, zoom in or out, and switch between open documents via tabs." },
                { title: "Stay Private", description: "Your files are never uploaded — everything runs locally in your browser with zero data collection." }
            ]
        },
        features: [
            { title: "Multi-Tab Viewing", description: "Open several PDFs at once and switch between them with tabs — no need for multiple browser windows.", icon: "BookOpen" },
            { title: "Zoom & Navigate", description: "Smooth zoom from 50% to 300%, page-by-page navigation, and direct page number input for quick jumping.", icon: "Move" },
            { title: "100% Private & Offline", description: "Your documents never leave your device. No uploads, no tracking, no history saved — works offline too.", icon: "Shield" },
            { title: "Free & Unlimited", description: "No file size limits, no sign-ups, no watermarks. View any PDF, as many times as you want.", icon: "Zap" }
        ],
        faq: [
            { question: "Why use this instead of Chrome's built-in viewer?", answer: "Our viewer guarantees zero data collection — no background analytics, no file metadata sent anywhere. It's a strictly local reading experience." },
            { question: "Can I open multiple PDFs at the same time?", answer: "Yes! Upload several files and use the tab bar at the top to switch between them. Each document keeps its own page position." },
            { question: "Does it work offline?", answer: "Yes. Once the page has loaded, all viewing is done locally — no internet connection required." }
        ]
    },
    "html-to-pdf": {
        slug: "html-to-pdf",
        title: "HTML to PDF",
        description: "Convert webpages or HTML code into properly formatted PDF documents.",
        howTo: {
            title: "How to Convert HTML to PDF",
            steps: [
                { title: "Enter URL", description: "Paste the website link you want to capture." },
                { title: "Convert", description: "Our engine renders the page and prints it to PDF." },
                { title: "Download", description: "Save the article or page for offline reading." }
            ]
        },
        features: [
            { title: "Clean Layout", description: "Removes ads and popups for better reading.", icon: "Globe" },
            { title: "Fast", description: "Capture content in seconds.", icon: "Zap" },
            { title: "Free", description: "Archive web content easily.", icon: "Check" }
        ],
        faq: [
            { question: "Does it work on login-protected pages?", answer: "No, the tool can only access publicly available URLs. For private pages, use 'Print to PDF' in your browser." }
        ]
    },
    "png-to-pdf": {
        slug: "png-to-pdf",
        title: "PNG to PDF",
        description: "Convert PNG images into high-quality PDF files. Preserves transparency and quality.",
        howTo: {
            title: "How to Convert PNG to PDF",
            steps: [
                { title: "Upload PNGs", description: "Select your PNG image files." },
                { title: "Arrange", description: "Reorder them if creating a multi-page document." },
                { title: "Convert", description: "Click to generate the PDF." }
            ]
        },
        features: [
            { title: "Transparency", description: "Handles PNG alpha channels correctly.", icon: "FileImage" },
            { title: "Batching", description: "Combine multiple PNGs.", icon: "Layers" },
            { title: "Secure", description: "Local processing.", icon: "Shield" }
        ],
        faq: [
            { question: "Is quality lost?", answer: "We embed the image directly, so visual quality is preserved at the original resolution." }
        ]
    },
    "txt-to-pdf": {
        slug: "txt-to-pdf",
        title: "Text to PDF",
        description: "Convert plain text files (.txt) into clean, readable PDF documents.",
        howTo: {
            title: "How to Convert Text to PDF",
            steps: [
                { title: "Upload Text", description: "Select your .txt file." },
                { title: "Format", description: "The tool applies standard formatting (font, margins)." },
                { title: "Download", description: "Save as a professional PDF." }
            ]
        },
        features: [
            { title: "Simple", description: "Great for converting code or logs.", icon: "FileText" },
            { title: "Fast", description: "Instant conversion.", icon: "Zap" },
            { title: "Secure", description: "Your text stays local.", icon: "Shield" }
        ],
        faq: [
            { question: "Can I change the font?", answer: "Currently, we use a standard readable font (Courier or Helvetica) for best compatibility." }
        ]
    },
    "webp-to-pdf": {
        slug: "webp-to-pdf",
        title: "WebP to PDF",
        description: "Convert modern WebP images into standard PDF documents.",
        howTo: {
            title: "How to Convert WebP to PDF",
            steps: [
                { title: "Upload WebP", description: "Select your WebP images." },
                { title: "Convert", description: "We transcode them into a PDF container." },
                { title: "Download", description: "Save the file." }
            ]
        },
        features: [
            { title: "Modern Format", description: "Support for the latest web image standards.", icon: "FileImage" },
            { title: "Local", description: "No server uploads.", icon: "Shield" },
            { title: "Free", description: "Convert unlimited files.", icon: "Check" }
        ],
        faq: [
            { question: "Why use WebP?", answer: "WebP offers smaller file sizes than JPG. Converting to PDF makes them easier to share with people who can't open WebP." }
        ]
    },
    "pdf-to-jpg": {
        slug: "pdf-to-jpg",
        title: "PDF to JPG",
        description: "Convert each page of your PDF into high-quality JPG images.",
        howTo: {
            title: "How to Convert PDF to JPG",
            steps: [
                { title: "Upload PDF", description: "Select the file you want to convert." },
                { title: "Convert", description: "The tool rasterizes each page into an image." },
                { title: "Download", description: "Download a ZIP file containing all your images." }
            ]
        },
        features: [
            { title: "High Res", description: "Render pages at 300 DPI for print quality.", icon: "FileImage" },
            { title: "Secure", description: "Processing stays on your device.", icon: "Shield" },
            { title: "Fast", description: "Convert entire books in seconds.", icon: "Zap" }
        ],
        faq: [
            { question: "Can I choose the quality?", answer: "Yes, we prioritize high-quality output suitable for printing and archiving." }
        ]
    },
    "pdf-to-png": {
        slug: "pdf-to-png",
        title: "PDF to PNG",
        description: "Convert PDF pages into transparent, lossless PNG images.",
        howTo: {
            title: "How to Convert PDF to PNG",
            steps: [
                { title: "Upload PDF", description: "Select your document." },
                { title: "Convert", description: "Each page is turned into a PNG file." },
                { title: "Download", description: "Save the images." }
            ]
        },
        features: [
            { title: "Lossless", description: "Perfect for diagrams and text.", icon: "FileImage" },
            { title: "Transparent", description: "Supports transparency if present in the PDF.", icon: "Layers" },
            { title: "Secure", description: "Local processing.", icon: "Shield" }
        ],
        faq: [
            { question: "Why PNG?", answer: "PNG is lossless, meaning no quality is lost during compression, unlike JPG. It's better for text and line art." }
        ]
    },
    "pdf-to-txt": {
        slug: "pdf-to-txt",
        title: "PDF to Text",
        description: "Extract all text content from a PDF file.",
        howTo: {
            title: "How to Extract Text from PDF",
            steps: [
                { title: "Upload PDF", description: "Choose your file." },
                { title: "Extract", description: "The tool pulls all selectable text from the document." },
                { title: "Download", description: "Save as a simple .txt file." }
            ]
        },
        features: [
            { title: "Clean Output", description: "Removes formatting to give you raw text.", icon: "FileText" },
            { title: "Fast", description: "Copy-paste entire documents in seconds.", icon: "Zap" },
            { title: "Secure", description: "Your data never leaves your browser.", icon: "Shield" }
        ],
        faq: [
            { question: "Does it work on scanned PDFs?", answer: "No, this tool only works on PDFs with selectable text. For scans, you need an OCR tool." }
        ]
    },
    "binary-to-jpg": {
        slug: "binary-to-jpg",
        title: "Binary to JPG",
        description: "Decode Base64 binary strings back into viewable JPG images.",
        howTo: {
            title: "How to Convert Base64 to JPG",
            steps: [
                { title: "Paste Code", description: "Paste your Base64 string into the text box." },
                { title: "Decode", description: "The tool reconstructs the image instantly." },
                { title: "Download", description: "Save the restored JPG file." }
            ]
        },
        features: [
            { title: "Developer Tool", description: "Debug API responses easily.", icon: "Wrench" },
            { title: "Secure", description: "Decoding happens locally.", icon: "Shield" },
            { title: "Instant", description: "See the image immediately.", icon: "Eye" }
        ],
        faq: [
            { question: "What if the code is invalid?", answer: "The tool will alert you if the string is not valid Base64 or doesn't represent a JPG." }
        ]
    },
    "binary-to-pdf": {
        slug: "binary-to-pdf",
        title: "Binary to PDF",
        description: "Decode Base64 binary strings back into readable PDF documents.",
        howTo: {
            title: "How to Convert Base64 to PDF",
            steps: [
                { title: "Paste Code", description: "Input the Base64 string." },
                { title: "Decode", description: "The tool converts text back to a PDF file." },
                { title: "Download", description: "Save the document." }
            ]
        },
        features: [
            { title: "Restore Files", description: "Recover files from data dumps.", icon: "RotateCcw" },
            { title: "Secure", description: "No server processing.", icon: "Shield" },
            { title: "Free", description: "Unlimited decoding.", icon: "Check" }
        ],
        faq: [
            { question: "Is there a size limit?", answer: "Only what your browser memory can handle (usually hundreds of megabytes)." }
        ]
    },
    "binary-to-txt": {
        slug: "binary-to-txt",
        title: "Binary to Text",
        description: "Decode Base64 binary strings back into plain text files.",
        howTo: {
            title: "How to Convert Base64 to Text",
            steps: [
                { title: "Input Base64", description: "Paste the encoded string." },
                { title: "Decode", description: "Read the original text." },
                { title: "Copy", description: "Copy the result to your clipboard." }
            ]
        },
        features: [
            { title: "Simple", description: "Standard Base64 decoding.", icon: "FileText" },
            { title: "Secure", description: "Totally local.", icon: "Shield" },
            { title: "Fast", description: "Instant results.", icon: "Zap" }
        ],
        faq: [
            { question: "Does it support UTF-8?", answer: "Yes, we handle standard character encodings correctly." }
        ]
    },
    "txt-to-binary": {
        slug: "txt-to-binary",
        title: "Text to Binary",
        description: "Encode plain text into Base64 binary format.",
        howTo: {
            title: "How to Convert Text to Base64",
            steps: [
                { title: "Type Text", description: "Enter the text you want to encode." },
                { title: "Encode", description: "The tool converts it to a Base64 string." },
                { title: "Copy", description: "Use the string in your application." }
            ]
        },
        features: [
            { title: "Safe", description: "Obfuscate simple text.", icon: "Lock" },
            { title: "Compatible", description: "Standard RFC 4648 Base64.", icon: "Check" },
            { title: "Secure", description: "Local processing.", icon: "Shield" }
        ],
        faq: [
            { question: "Is this encryption?", answer: "No! Base64 is encoding, not encryption. It can be easily reversed (decoded) by anyone." }
        ]
    },
    "reverse-pdf": {
        slug: "reverse-pdf",
        title: "Reverse PDF Pages",
        description: "Reverse the order of pages in your PDF document instantly.",
        howTo: {
            title: "How to Reverse PDF Order",
            steps: [
                { title: "Upload PDF", description: "Select the file with pages you want to reverse." },
                { title: "Process", description: "The tool automatically reorders pages from last to first." },
                { title: "Download", description: "Save the reversed document." }
            ]
        },
        features: [
            { title: "Instant Reorder", description: "Fix scanning errors where pages were fed backwards.", icon: "RotateCcw" },
            { title: "Secure", description: "Processing happens locally.", icon: "Shield" },
            { title: "Free", description: "Reverse large documents easily.", icon: "Check" }
        ],
        faq: [
            { question: "Can I reverse only part of the document?", answer: "This tool reverses the entire file. Use 'Organize PDF' to manually reorder specific pages." }
        ]
    },
    "rotate-pdf": {
        slug: "rotate-pdf",
        title: "Rotate PDF Pages",
        description: "Rotate specific pages or the entire document 90, 180, or 270 degrees.",
        howTo: {
            title: "How to Rotate PDF",
            steps: [
                { title: "Upload PDF", description: "Choose the file you need to rotate." },
                { title: "Select Rotation", description: "Click buttons to rotate individual pages or all pages left/right." },
                { title: "Apply", description: "Confirm the new orientation." },
                { title: "Download", description: "Save the corrected PDF." }
            ]
        },
        features: [
            { title: "Page Level Control", description: "Rotate just the pages that are upside down.", icon: "RotateCcw" },
            { title: "Permanent Fix", description: "Saves the new orientation to the file.", icon: "Check" },
            { title: "Secure", description: "No uploads required.", icon: "Shield" }
        ],
        faq: [
            { question: "Does this affect file quality?", answer: "No, rotation is a metadata change and does not degrade text or image quality." }
        ]
    },
    "page-numbers": {
        slug: "page-numbers",
        title: "Add Page Numbers",
        description: "Insert page numbers into your PDF with custom positioning and formatting.",
        howTo: {
            title: "How to Add Page Numbers",
            steps: [
                { title: "Upload PDF", description: "Select your document." },
                { title: "Configure", description: "Choose position (e.g., Bottom Center) and font style." },
                { title: "Apply", description: "The tool stamps numbers onto every page." },
                { title: "Download", description: "Save the paginated file." }
            ]
        },
        features: [
            { title: "Customizable", description: "Choose font, size, and location.", icon: "Hash" },
            { title: "Professional", description: "Perfect for reports and legal docs.", icon: "FileText" },
            { title: "Secure", description: "Processing stays on your device.", icon: "Shield" }
        ],
        faq: [
            { question: "Can I start numbering from a specific page?", answer: "Currently, we number from the first page, but you can use 'Split PDF' to separate front matter first." }
        ]
    },
    "watermark-pdf": {
        slug: "watermark-pdf",
        title: "Watermark PDF",
        description: "Stamp text or images over your PDF pages to protect intellectual property.",
        howTo: {
            title: "How to Add a Watermark",
            steps: [
                { title: "Upload PDF", description: "Choose the file to watermark." },
                { title: "Customize", description: "Type text (e.g., 'CONFIDENTIAL') or upload a logo image." },
                { title: "Apply", description: "The watermark is fused onto every page." },
                { title: "Download", description: "Get your protected document." }
            ]
        },
        features: [
            { title: "Text or Image", description: "Use text or your company logo.", icon: "Stamp" },
            { title: "Adjustable", description: "Control opacity, rotation, and position.", icon: "Move" },
            { title: "Fast", description: "Watermark large files in seconds.", icon: "Zap" }
        ],
        faq: [
            { question: "Can the watermark be removed?", answer: "We bake the watermark into the page content, making it difficult to remove without specialized editing software." }
        ]
    },
    "pdf-metadata": {
        slug: "pdf-metadata",
        title: "Edit PDF Metadata",
        description: "View and modify PDF properties like Title, Author, Subject, and Keywords.",
        howTo: {
            title: "How to Edit Metadata",
            steps: [
                { title: "Upload PDF", description: "Select the file to inspect." },
                { title: "Edit Fields", description: "Update the Title, Author, or other meta tags." },
                { title: "Save", description: "Click 'Update Metadata' to write changes." },
                { title: "Download", description: "Save the file with new properties." }
            ]
        },
        features: [
            { title: "SEO Friendly", description: "Improve searchability of your PDFs.", icon: "FileSearch" },
            { title: "Privacy", description: "Remove author names before sharing.", icon: "EyeOff" },
            { title: "Easy", description: "Simple form interface.", icon: "Check" }
        ],
        faq: [
            { question: "Is this info visible to everyone?", answer: "Yes, anyone can view PDF properties in their reader software (usually under File > Properties)." }
        ]
    },
    "redact-pdf": {
        slug: "redact-pdf",
        title: "Redact PDF",
        description: "Permanently black out sensitive text and regions from your PDF.",
        howTo: {
            title: "How to Redact a PDF",
            steps: [
                { title: "Upload PDF", description: "Open the file containing sensitive info." },
                { title: "Select Areas", description: "Draw boxes over text you want to hide." },
                { title: "Redact", description: "Click to permanently fill those areas with black." },
                { title: "Download", description: "Save the sanitized version." }
            ]
        },
        features: [
            { title: "Permanent", description: "Information is completely removed, not just covered.", icon: "EyeOff" },
            { title: "Secure", description: "Processing happens in your browser.", icon: "Shield" },
            { title: "Easy", description: "Visual selection tool.", icon: "Move" }
        ],
        faq: [
            { question: "Can redaction be undone?", answer: "No. Once redacted and saved, the underlying information is destroyed and cannot be recovered." }
        ]
    },
    "resize-pdf": {
        slug: "resize-pdf",
        title: "Resize PDF Pages",
        description: "Change the page dimensions and margins of your PDF document.",
        howTo: {
            title: "How to Resize PDF",
            steps: [
                { title: "Upload PDF", description: "Select the file to resize." },
                { title: "Choose Size", description: "Select a standard format (A4, Letter) or custom dimensions." },
                { title: "Process", description: "The tool scales your content to fit the new size." },
                { title: "Download", description: "Save the resized PDF." }
            ]
        },
        features: [
            { title: "Standard Sizes", description: "Quickly convert to A4, Letter, etc.", icon: "Maximize2" },
            { title: "Maintain Aspect", description: "Option to add white space instead of stretching.", icon: "Move" },
            { title: "Local", description: "No server uploads.", icon: "Shield" }
        ],
        faq: [
            { question: "Does this scale the text?", answer: "Yes, the entire page content is scaled to fit the new dimensions." }
        ]
    },
    "extract-images": {
        slug: "extract-images",
        title: "Extract Images from PDF",
        description: "Pull all embedded pictures out of a PDF document into a single ZIP file.",
        howTo: {
            title: "How to Extract Images",
            steps: [
                { title: "Upload PDF", description: "Select the PDF file containing images." },
                { title: "Extract", description: "The tool scans and extracts all image streams." },
                { title: "Download", description: "Download a ZIP archive with all your images." }
            ]
        },
        features: [
            { title: "Batch Extraction", description: "Gets all images at once.", icon: "Layers" },
            { title: "Original Quality", description: "Extracts images in their original format.", icon: "Image" },
            { title: "Secure", description: "Processing stays on your device.", icon: "Shield" }
        ],
        faq: [
            { question: "Will it reduce image quality?", answer: "No, images are extracted exactly as they are embedded in the PDF." }
        ]
    },
    "markdown-to-pdf": {
        slug: "markdown-to-pdf",
        title: "Markdown to PDF",
        description: "Write or paste Markdown text and instantly export it as a beautifully styled PDF.",
        howTo: {
            title: "How to Convert Markdown to PDF",
            steps: [
                { title: "Write or Paste", description: "Type or paste your Markdown content." },
                { title: "Preview", description: "See a live preview of how the document will look." },
                { title: "Download", description: "Export the rendered content as a PDF file." }
            ]
        },
        features: [
            { title: "Live Preview", description: "See changes as you type.", icon: "Eye" },
            { title: "Syntax Highlighting", description: "Supports code block formatting.", icon: "FileCode" },
            { title: "Local Conversion", description: "No server uploads needed.", icon: "Shield" }
        ],
        faq: [
            { question: "Are GitHub Flavored Markdown features supported?", answer: "Yes, tables, task lists, and strikethroughs are supported." }
        ]
    },
    "sanitize-pdf": {
        slug: "sanitize-pdf",
        title: "Sanitize PDF",
        description: "Remove hidden metadata, author information, and creation dates for total privacy.",
        howTo: {
            title: "How to Sanitize a PDF",
            steps: [
                { title: "Upload PDF", description: "Choose the PDF file you want to sanitize." },
                { title: "Sanitize", description: "Our tool permanently strips all hidden metadata." },
                { title: "Download", description: "Download the sanitized, untraceable PDF." }
            ]
        },
        features: [
            { title: "Total Privacy", description: "Removes all tracking data.", icon: "ShieldAlert" },
            { title: "Fast", description: "Instant local sanitization.", icon: "Zap" },
            { title: "Secure", description: "Files never leave your device.", icon: "Lock" }
        ],
        faq: [
            { question: "Does this change the visible text?", answer: "No, it only removes hidden metadata like author, creation date, and software used." }
        ]
    },
    "add-margins": {
        slug: "add-margins",
        title: "Add Margins to PDF",
        description: "Add white space or padding around the edges of your PDF pages.",
        howTo: {
            title: "How to Add Margins",
            steps: [
                { title: "Upload PDF", description: "Select the PDF you want to add margins to." },
                { title: "Set Margins", description: "Define the top, bottom, left, and right margins." },
                { title: "Apply", description: "Click to add margins and adjust the page size." },
                { title: "Download", description: "Download the adjusted PDF document." }
            ]
        },
        features: [
            { title: "Custom Margins", description: "Set exact padding values.", icon: "Maximize" },
            { title: "Binding Ready", description: "Create space for hole punching or binding.", icon: "BookOpen" },
            { title: "Local", description: "No server uploads.", icon: "Shield" }
        ],
        faq: [
            { question: "Does it scale the content?", answer: "The content stays the same size; the page dimensions are increased to add the margin." }
        ]
    },
    "remove-empty-pages": {
        slug: "remove-empty-pages",
        title: "Remove Empty Pages from PDF",
        description: "Automatically detect and delete blank pages from your PDF documents.",
        howTo: {
            title: "How to Remove Empty Pages",
            steps: [
                { title: "Upload PDF", description: "Select the PDF file with blank pages." },
                { title: "Scan", description: "The tool scans for completely blank pages." },
                { title: "Download", description: "Download the cleaned PDF without empty pages." }
            ]
        },
        features: [
            { title: "Auto Detect", description: "Finds pages with no text or graphics.", icon: "Search" },
            { title: "Fast", description: "Cleans large PDFs instantly.", icon: "Zap" },
            { title: "Secure", description: "Everything happens in your browser.", icon: "Shield" }
        ],
        faq: [
            { question: "Will this remove pages with just page numbers?", answer: "No, only completely blank pages with no drawing or text operators are removed." }
        ]
    },
    "crop-pdf": {
        slug: "crop-pdf",
        title: "Crop PDF Pages",
        description: "Trim the visible area or margins of your PDF pages.",
        howTo: {
            title: "How to Crop PDF",
            steps: [
                { title: "Upload PDF", description: "Select the PDF you want to crop." },
                { title: "Set Margins", description: "Define the crop margins (Top, Bottom, Left, Right)." },
                { title: "Crop", description: "Click to apply the crop bounds to all pages." },
                { title: "Download", description: "Save the cropped PDF document." }
            ]
        },
        features: [
            { title: "Custom Crop", description: "Enter precise crop values in inches.", icon: "Crop" },
            { title: "Batch Process", description: "Crops all pages in the document simultaneously.", icon: "Layers" },
            { title: "Local", description: "Processing stays on your device.", icon: "Shield" }
        ],
        faq: [
            { question: "Can I crop individual pages differently?", answer: "Currently, the crop margins are applied uniformly to all pages in the document." }
        ]
    },
    "json-to-pdf": {
        slug: "json-to-pdf",
        title: "JSON to PDF Converter",
        description: "Format raw JSON data into a clean, readable, and beautifully highlighted PDF document.",
        howTo: {
            title: "How to Convert JSON to PDF",
            steps: [
                { title: "Paste JSON", description: "Paste your raw JSON data." },
                { title: "Preview", description: "The tool formats and highlights your data." },
                { title: "Download", description: "Export the formatted data as a PDF." }
            ]
        },
        features: [
            { title: "Syntax Highlighting", description: "Color-codes keys and values.", icon: "Braces" },
            { title: "Pretty Print", description: "Automatically indents and formats raw data.", icon: "AlignLeft" },
            { title: "Secure", description: "Your data never leaves your browser.", icon: "Shield" }
        ],
        faq: [
            { question: "Does it validate my JSON?", answer: "Yes, the tool will try to parse your JSON and will show an error if it's invalid." }
        ]
    },
    "svg-to-pdf": {
        slug: "svg-to-pdf",
        title: "SVG to PDF Converter",
        description: "Convert scalable vector graphics into high-quality PDF documents.",
        howTo: {
            title: "How to Convert SVG to PDF",
            steps: [
                { title: "Upload SVG", description: "Select your SVG image file." },
                { title: "Convert", description: "The tool perfectly renders the vector into a PDF." },
                { title: "Download", description: "Save the resulting PDF document." }
            ]
        },
        features: [
            { title: "Vector Quality", description: "Maintains high resolution.", icon: "Maximize" },
            { title: "Fast Conversion", description: "Converts instantly without servers.", icon: "Zap" },
            { title: "Secure", description: "100% local processing.", icon: "Shield" }
        ],
        faq: [
            { question: "Can I convert multiple SVGs at once?", answer: "Currently, this tool converts one SVG file at a time into a single-page PDF." }
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
