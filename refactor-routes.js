const fs = require('fs');
const path = require('path');

const routesToRefactor = [
    {
        file: 'excel-to-csv.ts',
        scriptName: 'convert_excel_to_csv.py',
        inputExt: '.xlsx',
        outputExt: '.csv',
        mimeType: 'text/csv',
        outputSuffix: '.csv'
    },
    {
        file: 'excel-to-pdf.ts',
        scriptName: 'convert_excel_to_pdf.py',
        inputExt: '.xlsx',
        outputExt: '.pdf',
        mimeType: 'application/pdf',
        outputSuffix: '.pdf'
    },
    {
        file: 'pdf-to-excel.ts',
        scriptName: 'convert_pdf.py',
        inputExt: '.pdf',
        outputExt: '.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        outputSuffix: '.xlsx'
    },
    {
        file: 'pdf-to-odt.ts',
        scriptName: 'convert_pdf_to_odt.py',
        inputExt: '.pdf',
        outputExt: '.odt',
        mimeType: 'application/vnd.oasis.opendocument.text',
        outputSuffix: '.odt'
    },
    {
        file: 'pdf-to-rtf.ts',
        scriptName: 'convert_pdf_to_rtf.py',
        inputExt: '.pdf',
        outputExt: '.rtf',
        mimeType: 'application/rtf',
        outputSuffix: '.rtf'
    },
    {
        file: 'ppt-to-pdf.ts',
        scriptName: 'convert_pptx.py',
        inputExt: '.pptx',
        outputExt: '.pdf',
        mimeType: 'application/pdf',
        outputSuffix: '.pdf'
    },
    {
        file: 'rtf-to-pdf.ts',
        scriptName: 'convert_rtf.py',
        inputExt: '.rtf',
        outputExt: '.pdf',
        mimeType: 'application/pdf',
        outputSuffix: '.pdf'
    }
];

for (const route of routesToRefactor) {
    const filePath = path.join(__dirname, 'backend', 'src', 'routes', route.file);
    if (fs.existsSync(filePath)) {
        const content = `import { Request, Response } from 'express';
import { handleApiError, handleBadRequest } from '../lib/api-utils.js';
import fs from "fs";
import { runPythonScript } from '../lib/python-runner.js';

export const postHandler = async (req: Request, res: Response) => {
    try {
        const files = (req as any).files as Express.Multer.File[];
        const file = (req as any).file || (files && files.length > 0 ? files[0] : null);

        if (!file) {
            return handleBadRequest(res, "File is required");
        }

        const buffer = Buffer.from(await fs.promises.readFile(file.path));
        const originalName = file.originalname || 'document${route.inputExt}';
        const outputFilename = originalName.replace(/\\.[^/.]+$/, "") + "${route.outputSuffix}";

        const result = await runPythonScript({
            script: '${route.scriptName}',
            inputBuffer: buffer,
            inputExt: '${route.inputExt}',
            outputExt: '${route.outputExt}',
            timeout: 120000
        });

        if (!result.success || !result.outputBuffer) {
            throw new Error(result.error || "Conversion failed");
        }

        res.setHeader('Content-Type', '${route.mimeType}');
        res.setHeader('Content-Disposition', \`attachment; filename="\${outputFilename}"\`);
        res.setHeader('Content-Length', result.outputBuffer.length.toString());
        return res.send(result.outputBuffer);

    } catch (error) {
        console.error("Conversion Error:", error);
        return handleApiError(res, error, "Internal server error during conversion");
    }
}
`;
        fs.writeFileSync(filePath, content);
        console.log(`Refactored ${route.file}`);
    }
}
