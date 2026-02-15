
import * as file2html from 'file2html';
import OdfReader from 'file2html-odf';
import ImageReader from 'file2html-image';

// Configure the reader
file2html.config({
    readers: [OdfReader, ImageReader],
});

export async function convertOdtToHtml(buffer: Buffer): Promise<string> {
    try {
        // file2html expects an ArrayBuffer or Uint8Array
        const fileBuffer = new Uint8Array(buffer).buffer;

        const file = await file2html.read({
            fileBuffer,
            meta: {
                mimeType: 'application/vnd.oasis.opendocument.text',
            },
        });

        const { styles, content } = file.getData();

        // Wrap in a basic HTML structure
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                </style>
                ${styles}
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;
    } catch (error) {
        console.error('Error converting ODT to HTML:', error);
        throw new Error('Failed to convert ODT file to HTML');
    }
}
