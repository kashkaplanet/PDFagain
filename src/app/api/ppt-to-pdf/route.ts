export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';
import JSZip from 'jszip';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return handleBadRequest("No file uploaded");
        }

        const buffer = await file.arrayBuffer();
        
        // 1. Load PPTX with JSZip
        const zip = await JSZip.loadAsync(buffer);
        
        // 2. Find all slide files
        const slideFiles = Object.keys(zip.files).filter(name => name.match(/^ppt\/slides\/slide\d+\.xml$/));
        
        // Sort slides by number
        slideFiles.sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)/)?.[1] || "0");
            const numB = parseInt(b.match(/slide(\d+)/)?.[1] || "0");
            return numA - numB;
        });

        // 3. Create a new PDF Document
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 16;

        for (const slideFile of slideFiles) {
            const xmlContent = await zip.file(slideFile)!.async("string");
            
            // Extract text from <a:t>...</a:t>
            const textMatches = xmlContent.match(/<a:t.*?>(.*?)<\/a:t>/g) || [];
            const texts = textMatches.map(t => t.replace(/<.*?>/g, '').trim()).filter(t => t.length > 0);

            // Create a page for this slide
            const page = pdfDoc.addPage([800, 600]); // Standard presentation size roughly 4:3
            const { width, height } = page.getSize();
            
            let currentY = height - 50;
            const marginX = 50;
            const maxWidth = width - (marginX * 2);

            // Simple line wrapping
            for (const text of texts) {
                const words = text.split(' ');
                let currentLine = '';

                for (const word of words) {
                    const testLine = currentLine + (currentLine ? ' ' : '') + word;
                    const textWidth = font.widthOfTextAtSize(testLine, fontSize);

                    if (textWidth > maxWidth && currentLine !== '') {
                        page.drawText(currentLine, { x: marginX, y: currentY, size: fontSize, font, color: rgb(0, 0, 0) });
                        currentY -= fontSize * 1.5;
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }

                    if (currentY < 50) {
                        // New page if we run out of vertical space
                        const newPage = pdfDoc.addPage([800, 600]);
                        currentY = 600 - 50;
                    }
                }

                if (currentLine) {
                    page.drawText(currentLine, { x: marginX, y: currentY, size: fontSize, font, color: rgb(0, 0, 0) });
                    currentY -= fontSize * 1.5;
                }
                
                // Add extra spacing between text blocks
                currentY -= fontSize * 0.5;
            }
        }

        // 4. Save PDF
        // If there were no slides, create a blank page with a message
        if (slideFiles.length === 0) {
            const page = pdfDoc.addPage([800, 600]);
            page.drawText("No text found in presentation.", { x: 50, y: 550, size: 24 });
        }

        const pdfBytes = await pdfDoc.save();
        const outputFilename = file.name.replace(/\.[^/.]+$/, "") + ".pdf";

        return new NextResponse(pdfBytes, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${outputFilename}"`,
            },
        });

    } catch (error: any) {
        console.error("PPTX conversion error:", error);
        
        if (error.message && error.message.includes("end of central directory")) {
            return handleBadRequest("Invalid file format. Please upload a modern .pptx file, not a legacy .ppt file.");
        }
        
        return handleApiError(error, "Failed to parse PPTX file and generate PDF.");
    }
}
