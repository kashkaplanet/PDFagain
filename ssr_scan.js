const fs = require('fs');
const path = require('path');
const out = [];

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

const pageFiles = getFiles(path.join(process.cwd(), 'src/app/(tools)'));
for (const file of pageFiles) {
    if (!file.endsWith('page.tsx')) continue;
    const content = fs.readFileSync(file, 'utf8');

    const match = content.match(/const\s+\w+\s*=\s*dynamic\(\(\)\s*=>\s*import\(['"]@\/components\/tools\/([^'"]+)['"]\)(.*?)\);/);
    if (match) {
        const componentName = match[1];
        const dynamicArgs = match[2] || '';

        if (!dynamicArgs.includes('ssr: false')) {
            const compPath = path.join(process.cwd(), 'src/components/tools', componentName + '.tsx');
            if (fs.existsSync(compPath)) {
                const compContent = fs.readFileSync(compPath, 'utf8');
                if (
                    compContent.includes('window.') ||
                    compContent.includes('document.') ||
                    compContent.includes('usePDF') ||
                    compContent.includes('tesseract.js') ||
                    compContent.includes('<canvas') ||
                    compContent.includes('.getContext')
                ) {
                    out.push(file);
                }
            }
        }
    }
}
fs.writeFileSync('ssr_issues.json', JSON.stringify(out, null, 2));
console.log('Found ' + out.length + ' issues');
