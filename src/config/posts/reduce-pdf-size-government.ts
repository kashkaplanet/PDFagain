
import { BlogPost } from "../blog";

export const reducePdfSizeGovernment: BlogPost = {
    id: "reduce-pdf-size-government",
    title: "How to Compress PDFs for Government Portals: Beating the 2MB Limit",
    excerpt: "Struggling with strict file size limits on visa, tax, or university applications? Here is how to shrink your files without making them unreadable.",
    date: "February 17, 2026",
    category: "Tips",
    readTime: "8 min read",
    color: "red",
    content: `
        <p class="lead-text text-xl font-display font-medium mb-8 text-gray-700 italic border-l-4 border-red-400 pl-4 py-2 bg-red-50/50">
            You have spent weeks gathering documents. You scanned your passport, your bank statements, your diploma, and your birth certificate.
            You click "Upload" on the visa portal.
            The progress bar freezes.
            "Error: File size exceeds 2MB limit."
            Panic sets in. Your file is 15MB.
        </p>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">Why Government Portals Have Strict File Size Limits</h2>
        <p class="mb-6 text-lg leading-relaxed">
            In an age of gigabit internet and terabyte drives, why does the government limit uploads to floppy-disk sizes?
            Three reasons:
        </p>
        <ul class="list-disc leading-relaxed ml-6 space-y-3 text-lg mb-6">
            <li><strong>Legacy Infrastructure:</strong> Many government databases were built in 2005 and never upgraded. They physically cannot handle millions of 20MB files.</li>
            <li><strong>Bandwidth Costs:</strong> Serving millions of citizens costs money. Smaller files mean smaller server bills.</li>
            <li><strong>Review Speed:</strong> A 2MB file opens instantly for the reviewing officer. A 50MB file takes 30 seconds to download. Multiply that by 1,000 applications a day.</li>
        </ul>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">How to Reduce PDF Size for Uploads</h2>
        <p class="mb-6 text-lg leading-relaxed">
            To beat the limit, you need to understand <em>what</em> takes up space.
            1. Images (90%)
            2. Embedded Fonts (5-8%)
            3. Text (1-2%)
        </p>

        <h3 class="text-2xl font-bold mt-8 mb-4">Level 1: Standard Compression (Lossless)</h3>
        <p class="mb-6 text-lg leading-relaxed">
            First, run your file through our <a href="/compress-pdf" class="text-blue-600 underline font-bold">Standard Compress Tool</a>.
            This removes invisible metadata and optimizes the internal structure. It creates "Flate" compression streams.
            It usually saves 10-20%.
            If your file is 2.2MB, this will get you under the 2MB bar.
        </p>

        <h3 class="text-2xl font-bold mt-8 mb-4">Level 2: Image Downsampling (Visually Lossy)</h3>
        <p class="mb-6 text-lg leading-relaxed">
            If your file is 10MB, standard compression isn't enough. You need to degrade the images.
            Government portals do not need "Print Quality" (300dpi). They need "Screen Readability" (96-150dpi).
            Our "Strong Compression" setting resamples all images to 144dpi.
            Result: 70% reduction.
        </p>

        <h3 class="text-2xl font-bold mt-8 mb-4">Level 3: Grayscale Conversion (The Nuclear Option)</h3>
        <p class="mb-6 text-lg leading-relaxed">
            Color scanning uses 3 channels: Red, Green, Blue (24 bits per pixel).
            Grayscale uses 1 channel: Black (8 bits per pixel).
            Converting to Grayscale instantly cuts the image data size by 66%.
            Use our <a href="/grayscale-pdf" class="text-blue-600 underline font-bold">Grayscale PDF Tool</a>.
            Unless the instructions explicitly say "Color copy required" (rare for text documents), B&W is perfectly acceptable and preferred by bureaucrats because it prints faster.
        </p>

        <h3 class="text-2xl font-bold mt-8 mb-4">Level 4: Split and Conquer</h3>
        <p class="mb-6 text-lg leading-relaxed">
            Sometimes, there is a separate upload button for "Additional Documents".
            If you have a 4MB file, split it into two 2MB files using <a href="/split-pdf" class="text-blue-600 underline font-bold">Split PDF</a>.
            Upload them as "Bank_Statement_Part_1.pdf" and "Bank_Statement_Part_2.pdf".
        </p>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">Common PDF Compression Mistakes</h2>
        <p class="mb-6 text-lg leading-relaxed">
             <strong>Do not ZIP it.</strong> Most portals reject .zip files. They want .pdf.
             <strong>Do not take a screenshot.</strong> A screenshot of a PDF page is often a fuzzy, low-res PNG that looks unprofessional.
             <strong>Do not trust sketchy software.</strong> Installing "Free PDF Shrinker.exe" from a random site is a great way to get malware. Use browser-based tools.
        </p>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">Verifying PDF Legibility After Compression</h2>
        <p class="mb-6 text-lg leading-relaxed">
            After compressing, <strong>zoom in to 100%</strong>.
            Can you read the small text?
            Can you distinguish the numbers? Is that an 8 or a 0?
            If the text is blurry, you went too far. Try a lighter compression setting.
            Submitting an unreadable document is an automatic rejection, which is worse than a failed upload.
        </p>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">Conclusion</h2>
        <p class="mb-6 text-lg leading-relaxed">
            The 2MB limit is annoying, but beatable.
            By combining Downsampling + Grayscale, you can usually shrink a 50MB scan down to 1.5MB while keeping it perfectly legible.
            You are helping the portal, the reviewing officer, and ultimately, your own application speed.
        </p>
    `
};
