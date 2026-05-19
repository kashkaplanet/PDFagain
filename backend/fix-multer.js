import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));

const targetStr = `        const file = (req as any).file as any;`;
const replaceStr = `        const files = (req as any).files;
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);`;

for (const file of files) {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.includes(targetStr)) {
        content = content.replace(targetStr, replaceStr);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file}`);
    } else {
        // Also check if it's missing files = (req as any).files
        const altTarget1 = `        const file = (req as any).file;`;
        if (content.includes(altTarget1)) {
            content = content.replace(altTarget1, replaceStr);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Updated ${file}`);
        }
    }
}
