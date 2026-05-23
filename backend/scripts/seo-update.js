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
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item === 'page.tsx') {
            updatePageFile(fullPath);
        }
    });
}

function updatePageFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Only process if it has "use client" (to avoid double processing or breaking already server components)
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
        console.log(`Skipping ${filePath}: No "use client" directive found.`);
        return;
    }

    const dirName = path.basename(path.dirname(filePath));
    const humanName = toTitleCase(dirName);

    // SEO Metadata
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

    // Add Metadata import if not present (although we might not need to import Metadata type if we don't use it explicitly in JS, but this is TS)
    // We need to import Metadata from next
    if (!content.includes('import type { Metadata } from "next"')) {
        content = `import type { Metadata } from "next";\n` + content;
    }

    // Insert metadata export before the default function
    const exportDefaultRegex = /export default function/;
    if (exportDefaultRegex.test(content)) {
        content = content.replace(exportDefaultRegex, `${metadataExport}\nexport default function`);
        console.log(`Updated ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    } else {
        console.log(`Could not find default export in ${filePath}`);
    }
}

processDirectory(rootDir);
