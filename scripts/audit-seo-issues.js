const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../src/app/(tools)');

function processDirectory(directory) {
    const items = fs.readdirSync(directory);

    items.forEach(item => {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item === 'page.tsx') {
            checkPageFile(fullPath);
        }
    });
}

function checkPageFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    const hasHooks = /use(State|Effect|Context|Reducer|Callback|Memo|Ref|LayoutEffect|ImperativeHandle)/.test(content);
    const hasUseClient = /["']use client["']/.test(content);

    if (hasHooks && !hasUseClient) {
        console.log(`[PROBLEM] ${filePath} uses hooks but is missing "use client"`);
    }
}

processDirectory(rootDir);
