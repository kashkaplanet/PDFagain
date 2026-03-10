import { md5 } from '@pdfsmaller/pdf-encrypt-lite';

function test() {
    const input = new Uint8Array([1, 2, 3]);
    const result = md5(input);
    console.log('md5 constructor:', result?.constructor?.name);
    console.log('md5 length:', result?.length);
    console.log('md5 first byte:', result?.[0]);
}

test();
