import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const regex = /return\s+res\.send\(([^,]+),\s*\{\s*headers:\s*(\{[\s\S]*?\})\s*,?\s*\}\s*\);/g;
    
    if (regex.test(content)) {
        console.log(`Fixing ${file}`);
        content = content.replace(regex, (match, varName, headersObj) => {
            return `res.set(${headersObj});\n        return res.send(${varName});`;
        });
        fs.writeFileSync(filePath, content);
    }
});
