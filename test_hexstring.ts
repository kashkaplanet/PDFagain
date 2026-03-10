import { PDFHexString } from 'pdf-lib';

async function test() {
    const hex = PDFHexString.of('1A2B');
    console.log('asString():', hex.asString());
    console.log('asBytes():', hex.asBytes());
    console.log('decodeText():', hex.decodeText());
}
test();
