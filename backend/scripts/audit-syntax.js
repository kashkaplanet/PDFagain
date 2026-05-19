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
            checkSyntax(fullPath);
        }
    });
}

function checkSyntax(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check for common syntax errors introduced by script
    // e.g. import statement inside export?
    // e.g. multiple "import type { Metadata } from 'next';" lines?

    if ((content.match(/import type { Metadata }/g) || []).length > 1) {
        console.log(`[PROBLEM] Multiple metadata imports in ${filePath}`);
    }

    if (content.includes('import type { Metadata } from \'next\';import')) {
        // Missing newline?
        console.log(`[WARN] Missing newline in imports in ${filePath}`);
    }

    // Check for unterminated strings or template literals (hard with regex but try basic)
    const openBackticks = (content.match(/`/g) || []).length;
    if (openBackticks % 2 !== 0) {
        console.log(`[PROBLEM] Odd number of backticks in ${filePath}`);
    }
}

processDirectory(rootDir);
