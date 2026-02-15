import {
    FileText, Scissors, FileArchive, FileOutput, FileImage,
    Lock, Unlock, Stamp, Hash, Trash2, FileSearch,
    RotateCcw, PenTool, Layers, Wrench, Palette, Globe,
    GitCompare, Eye, FileType, Combine, Maximize2,
    EyeOff, Info, ArrowDownUp, Receipt, Scale, Table,
    Sparkles, Zap, Shield, MessageSquare, Presentation, Landmark,
    Binary
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface Tool {
    name: string;
    href: string;
    icon: LucideIcon;
    description: string;
    disabled?: boolean;
    popular?: boolean;
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
            { name: "Extract Pages", href: "/extract-pages", icon: FileOutput, description: "Select and save specific pages as a new PDF." },
            { name: "Merge PDF", href: "/merge-pdf", icon: Combine, description: "Combine multiple PDFs into one unified document.", popular: true },
            { name: "Organize PDF", href: "/organize-pdf", icon: FileSearch, description: "Rearrange, rotate, or delete pages easily." },
            { name: "Remove Pages", href: "/remove-pages", icon: Trash2, description: "Delete unwanted pages from your document." },
            { name: "Reverse PDF", href: "/reverse-pdf", icon: ArrowDownUp, description: "Reverse the order of pages in your PDF." },
            { name: "Split PDF", href: "/split-pdf", icon: Scissors, description: "Separate pages or split a PDF into smaller files.", popular: true },
        ]
    },
    {
        title: "EDIT PDF",
        color: "purple",
        icon: PenTool,
        description: "Modify, annotate, and customize your PDFs",
        tools: [
            { name: "Flatten PDF", href: "/flatten-pdf", icon: Layers, description: "Merge layers and lock annotations permanently." },
            { name: "Grayscale PDF", href: "/grayscale-pdf", icon: Palette, description: "Convert colored PDFs to black and white." },
            { name: "Page Numbers", href: "/page-numbers", icon: Hash, description: "Add page numbers to your document headers/footers." },
            { name: "PDF Metadata", href: "/pdf-metadata", icon: Info, description: "View and edit PDF properties and metadata." },
            { name: "Redact PDF", href: "/redact-pdf", icon: EyeOff, description: "Permanently remove sensitive information." },
            { name: "Resize PDF", href: "/resize-pdf", icon: Maximize2, description: "Change PDF page size and margins." },
            { name: "Rotate PDF", href: "/rotate-pdf", icon: RotateCcw, description: "Rotate pages 90, 180, or 270 degrees." },
            { name: "Watermark PDF", href: "/watermark-pdf", icon: Stamp, description: "Add text or image watermarks for security." },
        ]
    },
    {
        title: "OPTIMIZE PDF",
        color: "orange",
        icon: Zap,
        description: "Compress, repair, and enhance your documents",
        tools: [
            { name: "Compress PDF", href: "/compress-pdf", icon: FileArchive, description: "Reduce file size while maintaining quality.", popular: true },
            { name: "OCR PDF", href: "/ocr-pdf", icon: FileSearch, description: "Make scanned PDFs searchable and selectable." },
            { name: "Repair PDF", href: "/repair-pdf", icon: Wrench, description: "Recover data from corrupted or damaged PDFs." },
        ]
    },
    {
        title: "PDF SECURITY",
        color: "green",
        icon: Shield,
        description: "Protect, encrypt, and sign your documents",
        tools: [
            { name: "Protect PDF", href: "/protect-pdf", icon: Lock, description: "Encrypt your PDF with a strong password." },
            { name: "Sign PDF", href: "/sign-pdf", icon: PenTool, description: "Add your digital signature to documents." },
            { name: "Unlock PDF", href: "/unlock-pdf", icon: Unlock, description: "Remove passwords and security restrictions.", popular: true },
        ]
    },
    {
        title: "CONVERT TO PDF",
        color: "cyan",
        icon: FileType,
        description: "Transform any document into PDF format",
        tools: [
            { name: "Excel to PDF", href: "/excel-to-pdf", icon: Table, description: "Convert Excel spreadsheets to PDF format." },
            { name: "HTML to PDF", href: "/html-to-pdf", icon: Globe, description: "Save web pages as PDF documents." },
            { name: "JPG to PDF", href: "/jpg-to-pdf", icon: FileImage, description: "Convert images to high-quality PDF documents.", popular: true },
            { name: "ODT to PDF", href: "/odt-to-pdf", icon: FileText, description: "Convert OpenDocument Text files to PDF." },
            { name: "PNG to PDF", href: "/png-to-pdf", icon: FileImage, description: "Convert PNG images to PDF documents." },
            { name: "PPT to PDF", href: "/ppt-to-pdf", icon: Presentation, description: "Convert PowerPoint presentations to PDF." },
            { name: "RTF to PDF", href: "/rtf-to-pdf", icon: FileText, description: "Convert Rich Text Format files to PDF." },
            { name: "TXT to PDF", href: "/txt-to-pdf", icon: FileText, description: "Convert plain text files to PDF documents." },
            { name: "WEBP to PDF", href: "/webp-to-pdf", icon: FileImage, description: "Convert WEBP images to PDF documents." },
            { name: "Word to PDF", href: "/word-to-pdf", icon: FileText, description: "Convert Microsoft Word documents to PDF." },
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
            { name: "PDF to WebP", href: "/pdf-to-webp", icon: FileImage, description: "Convert PDF pages to modern WebP images." },
            { name: "PDF to Word", href: "/pdf-to-word", icon: FileText, description: "Convert PDF documents to editable Word files.", popular: true },
        ]
    },
    {
        title: "DATA & FINANCE",
        color: "yellow",
        icon: Table,
        description: "Convert between spreadsheet, data, and financial formats",
        tools: [
            { name: "CSV to Excel", href: "/csv-to-excel", icon: Table, description: "Convert CSV files to Excel spreadsheets." },
            { name: "Excel to CSV", href: "/excel-to-csv", icon: Table, description: "Convert Excel spreadsheets to CSV format." },
            { name: "Invoice Extractor", href: "/invoice-extractor", icon: Receipt, description: "Automatically extract data from invoices.", disabled: true },
            { name: "Bank Statement Analyzer", href: "/bank-statement-analyzer", icon: Landmark, description: "AI-powered analysis of bank statement PDFs.", disabled: true },
            { name: "Bank Statement Converter", href: "/bank-statement-converter", icon: Landmark, description: "Convert bank statements between PDF, CSV, and Excel formats.", disabled: true },
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
            { name: "View PDF", href: "/view-pdf", icon: Eye, description: "Read and view PDF documents online." },
        ]
    },
];

// All tools flattened for search
export const allTools = sections.flatMap(section =>
    section.tools.map(tool => ({ ...tool, sectionColor: section.color, sectionTitle: section.title }))
);

// Popular tools pulled from all sections
export const popularTools = sections.flatMap(section =>
    section.tools
        .filter(tool => tool.popular)
        .map(tool => ({ ...tool, sectionColor: section.color, sectionTitle: section.title }))
);

// Feature badges for hero section
export const features = [
    { icon: Sparkles, text: "100% Free", color: "bg-[#A3E635]" },
    { icon: Shield, text: "Privacy First", color: "bg-[#22D3EE]" },
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
