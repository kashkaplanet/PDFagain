import {
    FileText, Scissors, FileArchive, FileOutput, FileImage,
    Lock, Unlock, Stamp, Hash, Trash2, FileSearch,
    RotateCcw, PenTool, Layers, Wrench, Palette, Globe,
    GitCompare, Eye, FileType, Combine, Maximize2,
    EyeOff, Info, ArrowDownUp, Receipt, Scale, Table,
    Sparkles, Zap, Shield, MessageSquare, Presentation, Landmark,
    Binary, Image, FileCode, ShieldAlert, Maximize, FileX, Crop, Braces
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface TutorialStep {
    title: string;
    description: string;
}

export interface Tool {
    name: string;
    href: string;
    icon: LucideIcon;
    description: string;
    disabled?: boolean;
    popular?: boolean;
    tutorialSteps?: TutorialStep[];
}

export interface Section {
    title: string;
    color: string;
    icon: LucideIcon;
    description: string;
    tools: Tool[];
}

// Tool categories mapped to the design
export const sections: Section[] = [
    {
        title: "ORGANIZE PDF",
        color: "pink",
        icon: Layers,
        description: "Merge, split, and arrange your PDF pages with ease",
        tools: [
            {
                name: "Extract Pages",
                href: "/extract-pages",
                icon: FileOutput,
                description: "Select and save specific pages as a new PDF.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the PDF file you want to extract pages from." },
                    { title: "Select Pages", description: "Click on the pages you want to keep. You can also type page ranges (e.g., 1-5, 8)." },
                    { title: "Extract", description: "Click the 'Extract PDF' button to create a new document with only the selected pages." },
                    { title: "Download", description: "Save your new PDF file instantly." }
                ]
            },
            {
                name: "Extract Images",
                href: "/extract-images",
                icon: Image,
                description: "Extract all embedded images from a PDF into a ZIP file.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the PDF file containing images." },
                    { title: "Extract", description: "The tool scans and extracts all image streams." },
                    { title: "Download", description: "Download a ZIP archive with all your images." }
                ]
            },
            {
                name: "Merge PDF",
                href: "/merge-pdf",
                icon: Combine,
                description: "Combine multiple PDFs into one unified document.",
                popular: true,
                tutorialSteps: [
                    { title: "Upload Files", description: "Select multiple PDF files from your device. You can drag and drop them to rearrange the order." },
                    { title: "Arrange", description: "Drag the files to sort them in the desired order for the final document." },
                    { title: "Merge", description: "Click 'Merge PDF' to combine them into a single file." },
                    { title: "Download", description: "Download your unified PDF document." }
                ]
            },
            {
                name: "Organize PDF",
                href: "/organize-pdf",
                icon: FileSearch,
                description: "Rearrange, rotate, or delete pages easily.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Upload the PDF you want to organize." },
                    { title: "Edit Pages", description: "Drag and drop pages to reorder them. Hover over a page to rotate or delete unique pages." },
                    { title: "Save Changes", description: "Click 'Organize' to apply your changes." },
                    { title: "Download", description: "Get your newly organized PDF file." }
                ]
            },
            {
                name: "Remove Pages",
                href: "/remove-pages",
                icon: Trash2,
                description: "Delete unwanted pages from your document.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the file containing pages you want to remove." },
                    { title: "Select Pages", description: "Click on the pages you want to delete to mark them for removal." },
                    { title: "Remove", description: "Click the button to delete the selected pages." },
                    { title: "Download", description: "Download the cleaned PDF." }
                ]
            },
            {
                name: "Remove Empty Pages",
                href: "/remove-empty-pages",
                icon: FileX,
                description: "Automatically detect and delete blank pages.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the PDF file with blank pages." },
                    { title: "Scan", description: "The tool scans for completely blank pages." },
                    { title: "Download", description: "Download the cleaned PDF without empty pages." }
                ]
            },
            {
                name: "Reverse PDF",
                href: "/reverse-pdf",
                icon: ArrowDownUp,
                description: "Reverse the order of pages in your PDF.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Choose the PDF file you want to reverse." },
                    { title: "Process", description: "The tool automatically reverses the page order." },
                    { title: "Download", description: "Save the PDF with pages in reverse order." }
                ]
            },
            {
                name: "Split PDF",
                href: "/split-pdf",
                icon: Scissors,
                description: "Separate pages or split a PDF into smaller files.",
                popular: true,
                tutorialSteps: [
                    { title: "Upload PDF", description: "Upload the PDF you want to split." },
                    { title: "Choose Method", description: "Select 'Split by ranges' or 'Extract all pages'." },
                    { title: "Set Ranges", description: "If splitting by range, define the page numbers (e.g., 1-5)." },
                    { title: "Split & Download", description: "Click 'Split PDF' to download a ZIP file containing your separated PDFs." }
                ]
            },
        ]
    },
    {
        title: "EDIT PDF",
        color: "purple",
        icon: PenTool,
        description: "Modify, annotate, and customize your PDFs",
        tools: [
            {
                name: "Add Margins",
                href: "/add-margins",
                icon: Maximize,
                description: "Add padding and margins to your PDF pages.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the PDF you want to add margins to." },
                    { title: "Set Margins", description: "Define the top, bottom, left, and right margins." },
                    { title: "Apply", description: "Click to add margins and adjust the page size." },
                    { title: "Download", description: "Download the adjusted PDF document." }
                ]
            },
            {
                name: "Crop PDF",
                href: "/crop-pdf",
                icon: Crop,
                description: "Trim the visible area or margins of your PDF pages.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the PDF you want to crop." },
                    { title: "Set Margins", description: "Define the crop margins (Top, Bottom, Left, Right)." },
                    { title: "Crop", description: "Click to apply the crop bounds to all pages." },
                    { title: "Download", description: "Save the cropped PDF document." }
                ]
            },
            {
                name: "Flatten PDF",
                href: "/flatten-pdf",
                icon: Layers,
                description: "Merge layers and lock annotations permanently.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the PDF with interactive forms or annotations." },
                    { title: "Flatten", description: "Click the button to merge all layers into a single background layer." },
                    { title: "Download", description: "Save the flattened PDF. Contents can no longer be edited." }
                ]
            },
            {
                name: "Grayscale PDF",
                href: "/grayscale-pdf",
                icon: Palette,
                description: "Convert colored PDFs to black and white.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Upload your colored PDF document." },
                    { title: "Convert", description: "The tool processes the file to remove color information." },
                    { title: "Download", description: "Download the high-quality black and white PDF." }
                ]
            },
            {
                name: "Page Numbers",
                href: "/page-numbers",
                icon: Hash,
                description: "Add page numbers to your document headers/footers.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the PDF requiring page numbers." },
                    { title: "Configure", description: "Choose the position, format, and typography for the numbers." },
                    { title: "Add Numbers", description: "Click to apply page numbering." },
                    { title: "Download", description: "Save your paginated document." }
                ]
            },
            {
                name: "PDF Metadata",
                href: "/pdf-metadata",
                icon: Info,
                description: "View and edit PDF properties and metadata.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Upload the PDF to view its metadata." },
                    { title: "Edit Fields", description: "Modify Title, Author, Subject, Keywords, and other properties." },
                    { title: "Update", description: "Click 'Update Metadata' to save your changes." },
                    { title: "Download", description: "Get the updated PDF file." }
                ]
            },
            {
                name: "Redact PDF",
                href: "/redact-pdf",
                icon: EyeOff,
                description: "Permanently remove sensitive information.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Open the PDF containing sensitive info." },
                    { title: "Mark for Redaction", description: "Select text or areas to black out." },
                    { title: "Redact", description: "Confirm redaction to permanently remove the content." },
                    { title: "Download", description: "Save the secure PDF." }
                ]
            },
            {
                name: "Resize PDF",
                href: "/resize-pdf",
                icon: Maximize2,
                description: "Change PDF page size and margins.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Choose the file you want to resize." },
                    { title: "Select Size", description: "Choose a standard page size (A4, Letter) or set custom dimensions." },
                    { title: "Resize", description: "The tool scales your pages to the new size." },
                    { title: "Download", description: "Download your resized document." }
                ]
            },
            {
                name: "Rotate PDF",
                href: "/rotate-pdf",
                icon: RotateCcw,
                description: "Rotate pages 90, 180, or 270 degrees.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the PDF to rotate." },
                    { title: "Rotate Pages", description: "Rotate individual pages or all pages at once using the buttons." },
                    { title: "Apply", description: "Click 'Apply' to save the new orientation." },
                    { title: "Download", description: "Download your correctly oriented PDF." }
                ]
            },
            {
                name: "Watermark PDF",
                href: "/watermark-pdf",
                icon: Stamp,
                description: "Add text or image watermarks for security.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Upload the document you want to watermark." },
                    { title: "Customize", description: "Enter text or upload an image. Adjust opacity, position, and rotation." },
                    { title: "Stamp", description: "Apply the watermark to all pages." },
                    { title: "Download", description: "Save your watermarked PDF." }
                ]
            },
        ]
    },
    {
        title: "OPTIMIZE PDF",
        color: "orange",
        icon: Zap,
        description: "Compress, repair, and enhance your documents",
        tools: [
            {
                name: "Compress PDF",
                href: "/compress-pdf",
                icon: FileArchive,
                description: "Reduce file size while maintaining quality.",
                popular: true,
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select your large PDF file." },
                    { title: "Select Quality", description: "Choose between 'Extreme', 'Recommended', or 'Less' compression levels." },
                    { title: "Compress", description: "Click to start the compression engine." },
                    { title: "Download", description: "Download your smaller, optimized PDF." }
                ]
            },
            {
                name: "OCR PDF",
                href: "/ocr-pdf",
                icon: FileSearch,
<<<<<<< HEAD:src/config/tools.ts
                description: "Make scanned PDFs searchable and selectable.",
                disabled: false
=======
                description: "Make scanned PDFs searchable and selectable."
>>>>>>> 94c59b13b938d0bc43d1cc614f5c0cf994463719:frontend/src/config/tools.ts
            },
            {
                name: "Repair PDF",
                href: "/repair-pdf",
                icon: Wrench,
                description: "Recover data from corrupted or damaged PDFs.",
                tutorialSteps: [
                    { title: "Upload File", description: "Upload the corrupt PDF file." },
                    { title: "Repair", description: "Our tool analyzes and attempts to fix the file structure." },
                    { title: "Download", description: "Save the repaired PDF to your device." }
                ]
            },
        ]
    },
    {
        title: "PDF SECURITY",
        color: "green",
        icon: Shield,
        description: "Protect, encrypt, and sign your documents",
        tools: [
            {
                name: "Protect PDF",
                href: "/protect-pdf",
                icon: Lock,
                description: "Encrypt your PDF with a strong password.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Choose the PDF you want to secure." },
                    { title: "Set Password", description: "Enter a strong password to encrypt the file." },
                    { title: "Protect", description: "Click 'Protect PDF' to apply encryption." },
                    { title: "Download", description: "Download your password-protected file." }
                ]
            },
            {
                name: "Sanitize PDF",
                href: "/sanitize-pdf",
                icon: ShieldAlert,
                description: "Remove hidden metadata and author information for total privacy.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Choose the PDF file you want to sanitize." },
                    { title: "Sanitize", description: "Our tool permanently strips all hidden metadata." },
                    { title: "Download", description: "Download the sanitized, untraceable PDF." }
                ]
            },
            {
                name: "Sign PDF",
                href: "/sign-pdf",
                icon: PenTool,
                description: "Add your digital signature to documents.",
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the document you need to sign." },
                    { title: "Create Signature", description: "Draw, type, or upload your signature image." },
                    { title: "Place Signature", description: "Drag and drop the signature onto the correct page and position." },
                    { title: "Download", description: "Save the signed document." }
                ]
            },
            {
                name: "Unlock PDF",
                href: "/unlock-pdf",
                icon: Unlock,
                description: "Remove passwords and security restrictions.",
                popular: true,
                tutorialSteps: [
                    { title: "Upload PDF", description: "Select the password-protected (encrypted) PDF." },
                    { title: "Unlock", description: "If you know the password, enter it. If user permissions are restricted, the tool removes them." },
                    { title: "Download", description: "Download the unlocked, unrestricted PDF." }
                ]
            },
        ]
    },
    {
        title: "CONVERT TO PDF",
        color: "cyan",
        icon: FileType,
        description: "Transform any document into PDF format",
        tools: [
            { name: "Excel to PDF", href: "/excel-to-pdf", icon: Table, description: "Convert Excel spreadsheets to PDF format." },
            {
                name: "HTML to PDF",
                href: "/html-to-pdf",
                icon: Globe,
                description: "Save web pages as PDF documents.",
                tutorialSteps: [
                    { title: "Enter URL", description: "Paste the web address (URL) of the page you want to convert." },
                    { title: "Convert", description: "Click 'Convert' to capture the webpage." },
                    { title: "Download", description: "Save the webpage as a PDF document." }
                ]
            },
            {
                name: "JSON to PDF",
                href: "/json-to-pdf",
                icon: Braces,
                description: "Format raw JSON data into a clean, readable PDF document.",
                tutorialSteps: [
                    { title: "Paste JSON", description: "Paste your raw JSON data." },
                    { title: "Preview", description: "The tool formats and highlights your data." },
                    { title: "Download", description: "Export the formatted data as a PDF." }
                ]
            },
            {
                name: "JPG to PDF",
                href: "/jpg-to-pdf",
                icon: FileImage,
                description: "Convert images to high-quality PDF documents.",
                popular: true,
                tutorialSteps: [
                    { title: "Upload Images", description: "Select JPG images from your device." },
                    { title: "Adjust", description: "Reorder images or adjust margin and orientation settings." },
                    { title: "Convert", description: "Click to generate the PDF." },
                    { title: "Download", description: "Save your new PDF photo album." }
                ]
            },
            {
                name: "Markdown to PDF",
                href: "/markdown-to-pdf",
                icon: FileCode,
                description: "Convert Markdown text into a beautifully styled PDF.",
                tutorialSteps: [
                    { title: "Write or Paste", description: "Type or paste your Markdown content." },
                    { title: "Preview", description: "See a live preview of how the document will look." },
                    { title: "Download", description: "Export the rendered content as a PDF file." }
                ]
            },
            {
                name: "PNG to PDF",
                href: "/png-to-pdf",
                icon: FileImage,
                description: "Convert PNG images to PDF documents.",
                tutorialSteps: [
                    { title: "Upload PNGs", description: "Select PNG images using the file picker." },
                    { title: "Adjust", description: "Reorder images or adjust settings as needed." },
                    { title: "Convert", description: "Click to generate the PDF." },
                    { title: "Download", description: "Save your new PDF." }
                ]
            },
            { name: "PPT to PDF", href: "/ppt-to-pdf", icon: Presentation, description: "Convert PowerPoint presentations to PDF." },
            { name: "RTF to PDF", href: "/rtf-to-pdf", icon: FileText, description: "Convert Rich Text Format files to PDF." },
            {
                name: "SVG to PDF",
                href: "/svg-to-pdf",
                icon: PenTool,
                description: "Convert scalable vector graphics into high-quality PDFs.",
                tutorialSteps: [
                    { title: "Upload SVG", description: "Select your SVG image file." },
                    { title: "Convert", description: "The tool perfectly renders the vector into a PDF." },
                    { title: "Download", description: "Save the resulting PDF document." }
                ]
            },
            {
                name: "TXT to PDF",
                href: "/txt-to-pdf",
                icon: FileText,
                description: "Convert plain text files to PDF documents.",
                tutorialSteps: [
                    { title: "Upload TXT", description: "Select your plain text file." },
                    { title: "Convert", description: "The tool converts the text into a clean PDF document." },
                    { title: "Download", description: "Save your new PDF." }
                ]
            },
            {
                name: "WEBP to PDF",
                href: "/webp-to-pdf",
                icon: FileImage,
                description: "Convert WEBP images to PDF documents.",
                tutorialSteps: [
                    { title: "Upload WEBP", description: "Select WebP images." },
                    { title: "Convert", description: "Click to turn them into a PDF." },
                    { title: "Download", description: "Save the result." }
                ]
            },
            { name: "Word to PDF", href: "/word-to-pdf", icon: FileText, description: "Convert Microsoft Word documents to PDF.", popular: true },
        ]
    },
    {
        title: "CONVERT FROM PDF",
        color: "blue",
        icon: ArrowDownUp,
        description: "Convert PDFs to other formats",
        tools: [
            { name: "PDF to Excel", href: "/pdf-to-excel", icon: Table, description: "Convert PDF tables and data to Excel spreadsheets." },
            { name: "PDF to JPG", href: "/pdf-to-jpg", icon: FileImage, description: "Convert PDF pages to high-quality images." },
            { name: "PDF to ODT", href: "/pdf-to-odt", icon: FileText, description: "Convert PDF documents to OpenDocument Text format." },
            { name: "PDF to PNG", href: "/pdf-to-png", icon: FileImage, description: "Convert PDF pages to high-quality PNG images." },
            { name: "PDF to PPT", href: "/pdf-to-ppt", icon: Presentation, description: "Convert PDF pages to PowerPoint slides (images)." },
            { name: "PDF to RTF", href: "/pdf-to-rtf", icon: FileText, description: "Convert PDF documents to Rich Text Format." },
            { name: "PDF to TXT", href: "/pdf-to-txt", icon: FileText, description: "Extract text content from PDF documents." },
<<<<<<< HEAD:src/config/tools.ts
            { name: "PDF to WebP", href: "/pdf-to-webp", icon: FileImage, description: "Convert PDF pages to modern WebP images.", disabled: false },
            { name: "PDF to Word", href: "/pdf-to-word", icon: FileText, description: "Convert PDF documents to editable Word files.", popular: true, disabled: true },
=======
            { name: "PDF to WebP", href: "/pdf-to-webp", icon: FileImage, description: "Convert PDF pages to modern WebP images." },
            { name: "PDF to Word", href: "/pdf-to-word", icon: FileText, description: "Convert PDF documents to editable Word files.", popular: true },
>>>>>>> 94c59b13b938d0bc43d1cc614f5c0cf994463719:frontend/src/config/tools.ts
        ]
    },
    {
        title: "DATA & FINANCE",
        color: "yellow",
        icon: Table,
        description: "Convert between spreadsheet, data, and financial formats",
        tools: [
<<<<<<< HEAD:src/config/tools.ts
            { name: "CSV to Excel", href: "/csv-to-excel", icon: Table, description: "Convert CSV files to Excel spreadsheets.", disabled: false },
            { name: "Excel to CSV", href: "/excel-to-csv", icon: Table, description: "Convert Excel spreadsheets to CSV format.", disabled: false },
            { name: "Invoice Extractor", href: "/invoice-extractor", icon: Receipt, description: "Automatically extract data from invoices.", disabled: false },
            { name: "Bank Statement Analyzer", href: "/bank-statement-analyzer", icon: Landmark, description: "AI-powered analysis of bank statement PDFs.", disabled: false },
            { name: "Bank Statement Converter", href: "/bank-statement-converter", icon: Landmark, description: "Convert bank statements between PDF, CSV, and Excel formats.", disabled: false },
=======
            { name: "CSV to Excel", href: "/csv-to-excel", icon: Table, description: "Convert CSV files to Excel spreadsheets." },
            { name: "Excel to CSV", href: "/excel-to-csv", icon: Table, description: "Convert Excel spreadsheets to CSV format." },
            { name: "Invoice Extractor", href: "/invoice-extractor", icon: Receipt, description: "Automatically extract data from invoices.", disabled: true },
            { name: "Bank Statement Analyzer", href: "/bank-statement-analyzer", icon: Landmark, description: "AI-powered analysis of bank statement PDFs.", disabled: true },
            { name: "Bank Statement Converter", href: "/bank-statement-converter", icon: Landmark, description: "Convert bank statements between PDF, CSV, and Excel formats.", disabled: true },
>>>>>>> 94c59b13b938d0bc43d1cc614f5c0cf994463719:frontend/src/config/tools.ts
        ]
    },
    {
        title: "ENCODING & BINARY",
        color: "indigo",
        icon: Binary,
        description: "Encode and decode files using Base64 binary format",
        tools: [
            { name: "Binary to JPG", href: "/binary-to-jpg", icon: Binary, description: "Restore a JPG image from a Base64-encoded binary text file." },
            { name: "Binary to PDF", href: "/binary-to-pdf", icon: Binary, description: "Restore a PDF from a Base64-encoded binary text file." },
            { name: "Binary to TXT", href: "/binary-to-txt", icon: Binary, description: "Restore a text file from a Base64-encoded binary text file." },
            { name: "JPG to Binary", href: "/jpg-to-binary", icon: Binary, description: "Convert JPG images to Base64 binary text for safe storage." },
            { name: "PDF to Binary", href: "/pdf-to-binary", icon: Binary, description: "Convert PDF to Base64 binary text for safe storage." },
            { name: "TXT to Binary", href: "/txt-to-binary", icon: Binary, description: "Convert text files to Base64 binary text for safe storage." },
        ]
    },
    {
        title: "VIEW & COMPARE",
        color: "lime",
        icon: Eye,
        description: "View and compare PDF documents side by side",
        tools: [
            { name: "Compare PDF", href: "/compare-pdf", icon: GitCompare, description: "Compare two PDFs side-by-side for differences." },
            { name: "Legal Comparison", href: "/legal-comparison", icon: Scale, description: "Compare legal documents for modifications." },
            { name: "View PDF", href: "/view-pdf", icon: Eye, description: "Read and view PDF documents online.", disabled: true },
        ]
    },
];

// All tools flattened for search
export const allTools = sections.flatMap(section =>
    section.tools
        .filter(tool => !tool.disabled)
        .map(tool => ({ ...tool, sectionColor: section.color, sectionTitle: section.title }))
);

// Popular tools pulled from all sections
export const popularTools = sections.flatMap(section =>
    section.tools
        .filter(tool => tool.popular && !tool.disabled)
        .map(tool => ({ ...tool, sectionColor: section.color, sectionTitle: section.title }))
);

// Feature badges for hero section
export const features = [
    { icon: Sparkles, text: "100% Free", color: "bg-[#A3E635]" },
    { icon: Zap, text: "Lightning Fast", color: "bg-[#FB923C]" },
    { icon: MessageSquare, text: "Chat with PDF", color: "bg-[#22D3EE]" },
];

// Find the section a tool belongs to by its href
export function getSectionForTool(href: string) {
    for (const section of sections) {
        const tool = section.tools.find(t => t.href === href);
        if (tool) return { section, tool };
    }
    return null;
}

// Get related tools (same category, excluding current tool)
export function getRelatedTools(href: string, limit = 4) {
    const result = getSectionForTool(href);
    if (!result) return [];
    return result.section.tools
        .filter(t => t.href !== href && !t.disabled)
        .slice(0, limit)
        .map(t => ({ ...t, sectionColor: result.section.color, sectionTitle: result.section.title }));
}
