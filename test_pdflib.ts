import { PDFDocument, PDFName, PDFHexString, PDFString } from 'pdf-lib';

async function test() {
    const doc = await PDFDocument.create();
    const arr = doc.context.obj([
        PDFString.of('1234567890123456'),
        PDFHexString.fromText('1234567890123456')
    ]);

    console.log('Array created:', arr.constructor.name);
    try {
        const val = arr.lookup(0, PDFHexString);
        console.log('val0 as HexString:', val?.constructor.name);
    } catch (e: any) {
        console.error('Error looking up 0 as HexString:', e.message);
    }
}
test();
