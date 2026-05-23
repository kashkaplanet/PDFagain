const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../src/app/(tools)');

function processDirectory(directory) {
    const items = fs.readdirSync(directory);
    items.forEach(item => {
        const fullPath = path.join(directory, item);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (item === 'page.tsx') {
            revertPage(fullPath);
        }
    });
}

function revertPage(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add "use client" if missing
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
        content = '"use client";\n\n' + content;
    }

    // Remove metadata export
    // Matches: export const metadata: Metadata = { ... };
    // Multiline match is tricky with dotAll.
    content = content.replace(/export const metadata: Metadata = \{[\s\S]*?\};/g, '');

    // Remove Metadata import
    content = content.replace(/import type { Metadata } from "next";\n?/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Reverted ${filePath}`);
}

processDirectory(rootDir);
