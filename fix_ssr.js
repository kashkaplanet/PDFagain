const fs = require('fs');
const issues = JSON.parse(fs.readFileSync('ssr_issues.json', 'utf8'));

for (const file of issues) {
    let content = fs.readFileSync(file, 'utf8');

    // Find the dynamic import line
    const regex = /(const\s+\w+\s*=\s*dynamic\(\(\)\s*=>\s*import\(['"]@\/components\/tools\/[^'"]+['"]\))(.*?)(\);)/g;

    content = content.replace(regex, (match, p1, p2, p3) => {
        // If it doesn't already have ssr: false, add it
        if (!p2.includes('ssr: false')) {
            // If it already has a second argument object, it's more complex, but looking at the codebase they don't.
            // So we just add the second argument.
            return p1 + ', { ssr: false }' + p3;
        }
        return match;
    });

    fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed ' + issues.length + ' files.');
