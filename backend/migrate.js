const fs = require('fs');
const path = require('path');

const srcApiDir = path.join(__dirname, '../src/app/api');
const destRoutesDir = path.join(__dirname, 'src/routes');

if (!fs.existsSync(destRoutesDir)) {
    fs.mkdirSync(destRoutesDir, { recursive: true });
}

const folders = fs.readdirSync(srcApiDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

let indexContent = `import express from 'express';\nimport multer from 'multer';\n\nconst router = express.Router();\nconst upload = multer({ storage: multer.memoryStorage() });\n\n`;

for (const folder of folders) {
    const routeFile = path.join(srcApiDir, folder, 'route.ts');
    if (fs.existsSync(routeFile)) {
        let content = fs.readFileSync(routeFile, 'utf8');
        
        // Basic regex replacements to convert Next.js route to Express
        content = content.replace(/export const dynamic = 'force-dynamic';/g, '');
        content = content.replace(/import { NextRequest, NextResponse } from 'next\/server';/g, 'import { Request, Response } from \'express\';');
        content = content.replace(/export async function POST\(req: NextRequest\) {/g, 'export const postHandler = async (req: Request, res: Response) => {');
        content = content.replace(/export async function GET\(req: NextRequest\) {/g, 'export const getHandler = async (req: Request, res: Response) => {');
        
        // Handle NextResponse returns
        content = content.replace(/return NextResponse\.json\((.*?)(?:,\s*\{(.*?)\})?\);/gs, (match, body, opts) => {
            if (opts && opts.includes('status:')) {
                const statusMatch = opts.match(/status:\s*(\d+)/);
                const status = statusMatch ? statusMatch[1] : 200;
                return `return res.status(${status}).json(${body});`;
            }
            return `return res.json(${body});`;
        });

        // Handle handleBadRequest, handleApiError which we updated
        content = content.replace(/return handleBadRequest\((.*?)\);/g, 'return handleBadRequest(res, $1);');
        content = content.replace(/return handleApiError\((.*?)\);/g, 'return handleApiError(res, $1);');
        
        // Handle Buffer returns
        content = content.replace(/return new NextResponse\(Buffer\.from\((.*?)\),\s*\{(.*?)\}\);/gs, (match, buffer, opts) => {
            let headers = '';
            const headersMatch = opts.match(/headers:\s*\{([^}]+)\}/);
            if (headersMatch) {
                const headerLines = headersMatch[1].split(',').filter(l => l.trim() !== '');
                for (const line of headerLines) {
                    const [key, val] = line.split(':').map(s => s.trim().replace(/['"]/g, ''));
                    if (key && val) {
                        headers += `        res.setHeader('${key}', '${val}');\n`;
                    }
                }
            }
            return `${headers}        return res.send(Buffer.from(${buffer}));`;
        });
        
        // Replace formData parsing with req.files and req.body from multer (basic mapping)
        content = content.replace(/const formData = await req\.formData\(\);/g, '// Multer handles formData');
        content = content.replace(/const file = formData\.get\('file'\) as File(?: \| null)?;/g, 'const file = req.file as any;');
        content = content.replace(/const files = formData\.getAll\('files'\) as File\[\];/g, 'const files = req.files as any[];');
        
        // We will need to adapt file.arrayBuffer() to file.buffer since multer provides buffer
        content = content.replace(/await file\.arrayBuffer\(\)/g, 'file.buffer');
        content = content.replace(/file\.size/g, 'file.size');
        content = content.replace(/file\.type/g, 'file.mimetype');
        content = content.replace(/file\.name/g, 'file.originalname');

        // Write to new file
        const newFilePath = path.join(destRoutesDir, `${folder}.ts`);
        fs.writeFileSync(newFilePath, content);
        
        console.log(`Migrated ${folder}`);
    }
}
