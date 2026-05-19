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
            checkImports(fullPath);
        }
    });
}

function checkImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('import dynamic from')) {
        // Check if ssr: false is used
        if (content.includes('ssr: false') && !content.includes("'use client'") && !content.includes('"use client"')) {
            // This is fine, but lets check loading prop
            if (content.includes('loading:')) {
                // Check if loading uses JSX
                if (content.includes('<') && content.includes('/>')) {
                    // This is fine too
                }
            }
        }
    }
    // Check for weird characters or syntax
    // Just in case script broke something
    if (content.includes('undefined') || content.includes('[object Object]')) {
        console.log(`[PROBLEM] Possible corruption in ${filePath}`);
    }
}

processDirectory(rootDir);
