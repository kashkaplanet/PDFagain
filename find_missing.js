const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getFiles(fullPath, files);
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

const pageFiles = getFiles(path.join(__dirname, 'src/app/(tools)'));
const componentsDir = path.join(__dirname, 'src/components/tools');
const availableComponents = new Set(fs.readdirSync(componentsDir));

const missing = [];

for (const file of pageFiles) {
    if (!file.endsWith('page.tsx')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/import\(['"]@\/components\/tools\/([^'"]+)['"]\)/);
    if (match) {
        const componentName = match[1] + '.tsx';
        if (!availableComponents.has(componentName)) {
            missing.push({ file, missingComponent: componentName });
        }
    }
}

console.log(JSON.stringify(missing, null, 2));
