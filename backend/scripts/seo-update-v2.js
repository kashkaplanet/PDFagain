const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../src/app/(tools)');

function toTitleCase(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function processDirectory(directory) {
    const items = fs.readdirSync(directory);
    items.forEach(item => {
        const fullPath = path.join(directory, item);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (item === 'page.tsx') {
            updatePage(fullPath);
        }
    });
}

function updatePage(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already updated (has metadata export)
    if (content.includes('export const metadata')) {
        return;
    }

    // Only process if "use client" is present
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
        return;
    }

    const dirName = path.basename(path.dirname(filePath));
    const humanName = toTitleCase(dirName);

    const title = `${humanName} - Free Online Tool`;
    const description = `${humanName}. 100% free, secure, and processing happens locally on your device. No file uploads.`;

    const metadataExport = `
export const metadata: Metadata = {
  title: "${title}",
  description: "${description}",
};
`;

    // Remove "use client"
    content = content.replace(/["']use client["'];?\s*/, '');

    // Add import
    if (!content.includes('import type { Metadata }')) {
        content = `import type { Metadata } from 'next';\n` + content;
    }

    // Find export default
    // Support: export default function X() ...
    // Support: export default function() ...
    // Support: export default class ...

    // We prefer inserting before export default
    const exportMatch = content.match(/export default (function|class|const|async)/);
    if (exportMatch) {
        const index = exportMatch.index;
        content = content.slice(0, index) + metadataExport + content.slice(index);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        // Handle "const X = ...; export default X;"
        // Just append to end? No, metadata must be exported.
        // Try to find "export default"
        const exportDefaultMatch = content.match(/export default/);
        if (exportDefaultMatch) {
            const index = exportDefaultMatch.index;
            content = content.slice(0, index) + metadataExport + content.slice(index);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        } else {
            console.log(`[SKIP] Could not find export default in ${filePath}`);
        }
    }
}

processDirectory(rootDir);
