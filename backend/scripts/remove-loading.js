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
            removeLoading(fullPath);
        }
    });
}

function removeLoading(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to match loading property in dynamic options
    // It handles multi-line loading: () => ( ... ),
    const loadingRegex = /loading:\s*\(\)\s*=>\s*\(\s*<div[\s\S]*?<\/div>\s*\),?\s*/g;

    if (loadingRegex.test(content)) {
        content = content.replace(loadingRegex, '');
        // Also remove Loader2 import if it was used only there
        // Simpler to just remove usage, import might get warned as unused but wont break build usually (unless strict).
        // Let's remove the import too if possible.
        content = content.replace(/import\s*{\s*Loader2\s*}\s*from\s*['"]lucide-react['"];?\s*/, '');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

processDirectory(rootDir);
