// import * as pdfjsLib from "pdfjs-dist";

export async function extractTextFromPdf(file: File): Promise<string> {
    try {
        const pdfjsLib = await import('pdfjs-dist');

        // Ensure worker is set up
        if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `/workers/pdf.worker.min.mjs`;
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageText = textContent.items.map((item: any) => item.str).join(" ");

            // Add page marker so AI knows where text comes from
            fullText += `[Page ${i}]\n${pageText}\n\n`;
        }

        return fullText;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
}
