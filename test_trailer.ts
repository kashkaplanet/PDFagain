import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';

async function test() {
    const buffer = fs.readFileSync('test_encrypted.pdf');
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true } as any);
    const trailer = pdfDoc.context.trailerInfo as any;
    console.log('Trailer properties:');
    for (const key of Object.keys(trailer)) {
        console.log(`- ${key}: ${trailer[key]?.constructor?.name}`);
    }
    const idArray = trailer.ID;
    console.log('ID array constructor:', idArray?.constructor?.name);
    if (idArray && idArray.constructor.name === 'PDFArray') {
        console.log('Elements:');
        for (let i = 0; i < idArray.size(); i++) {
            const el = idArray.get(i);
            console.log(`- [${i}] ${el?.constructor?.name}`);
        }
    }
}
test();
