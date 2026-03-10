import { unlockPdf } from './src/lib/pdf-unlocker';
import * as fs from 'fs';

async function test() {
    try {
        const buffer = fs.readFileSync('test_encrypted.pdf');
        const file = new File([buffer], 'test_encrypted.pdf', { type: 'application/pdf' });
        
        console.log('Testing unlockPdf with correct password...');
        const decryptedBlob = await unlockPdf(file, 'test');
        console.log('Success! Blob size:', decryptedBlob.size);
    } catch (err: any) {
        console.error('Error in unlockPdf:', err.message);
        console.error(err.stack);
    }
}

test();
