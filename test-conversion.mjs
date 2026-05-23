import fs from 'fs';
import path from 'path';

async function testConversion() {
    const baseUrl = 'http://localhost:3000';
    
    // 1. Test PDF to Word
    console.log('Testing PDF to Word...');
    try {
        const dummyPdfPath = path.join(process.cwd(), 'dummy.pdf');
        
        if (!fs.existsSync(dummyPdfPath)) {
            console.log('Creating dummy.pdf for testing...');
            fs.writeFileSync(dummyPdfPath, '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [3 0 R]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n/Resources <<\n/Font <<\n/F1 <<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\n>>\n>>\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 712 Td\n(Hello, this is a test PDF!) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000288 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n381\n%%EOF');
        }

        const formData = new FormData();
        const fileData = fs.readFileSync(dummyPdfPath);
        const blob = new Blob([fileData], { type: 'application/pdf' });
        formData.append('file', blob, 'dummy.pdf');

        const res = await fetch(`${baseUrl}/api/pdf-to-word`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            console.log('✅ PDF to Word API is working! Status:', res.status);
            const buffer = await res.arrayBuffer();
            fs.writeFileSync('test_output.docx', Buffer.from(buffer));
            console.log('Saved test_output.docx');
        } else {
            console.error('❌ PDF to Word API failed:', res.status, await res.text());
        }
    } catch (e) {
        console.error('Error testing PDF to Word:', e);
    }

    // 2. Test Word to PDF
    console.log('\nTesting Word to PDF...');
    try {
        if (!fs.existsSync('test_output.docx')) {
            console.log('Skipping Word to PDF test: no docx file to test with');
            return;
        }

        const formData = new FormData();
        const fileData = fs.readFileSync('test_output.docx');
        const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        formData.append('file', blob, 'test_output.docx');

        const res = await fetch(`${baseUrl}/api/word-to-pdf`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            console.log('✅ Word to PDF API is working! Status:', res.status);
        } else {
            console.error('❌ Word to PDF API failed:', res.status, await res.text());
        }
    } catch (e) {
        console.error('Error testing Word to PDF:', e);
    }
}

testConversion();
