const fs = require('fs');
const path = require('path');

const targetDirName = process.argv[2];
if (!targetDirName) {
    console.error("Please provide a directory name inside src/app/(tools)");
    process.exit(1);
}

const rootDir = path.join(__dirname, `../src/app/(tools)/(${targetDirName})`);

if (!fs.existsSync(rootDir)) {
    console.error(`Directory not found: ${rootDir}`);
    process.exit(1);
}

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
    content = content.replace(/export const metadata: Metadata = \{[\s\S]*?\};/g, '');

    // Remove Metadata import
    content = content.replace(/import type { Metadata } from 'next';\n?/g, '');
    content = content.replace(/import type { Metadata } from "next";\n?/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Reverted ${filePath}`);
}

processDirectory(rootDir);
