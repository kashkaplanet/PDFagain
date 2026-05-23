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
            cleanDynamic(fullPath);
        }
    });
}

function cleanDynamic(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to capture the variable name, import path, and replace the whole block
    // Matches const Name = dynamic(() => import('path'), { ... });
    // Handles multiline loosely
    const regex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\s*,\s*\{[\s\S]*?\}\s*\);?/g;

    if (regex.test(content)) {
        content = content.replace(regex, (match, varName, importPath) => {
            // Force single line, ssr: false
            return `const ${varName} = dynamic(() => import('${importPath}'), { ssr: false });`;
        });
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned ${filePath}`);
    }
}

processDirectory(rootDir);
