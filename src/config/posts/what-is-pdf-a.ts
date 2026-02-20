
import { BlogPost } from "../blog";

export const whatIsPdfA: BlogPost = {
    id: "what-is-pdf-a",
    title: "What is PDF/A and Why It Matters for Archiving: Future-Proofing Documentation",
    excerpt: "Will your grandchildren be able to open your digital photo album? PDF/A ensures the answer is yes. A deep dive into the ISO standard for long-term preservation.",
    date: "February 17, 2026",
    category: "Tech",
    readTime: "10 min read",
    color: "indigo",
    content: `
        <p class="lead-text text-xl font-display font-medium mb-8 text-gray-700 italic border-l-4 border-indigo-400 pl-4 py-2 bg-indigo-50/50">
            We assume digital files last forever. They don't. Hard drives fail, software formats become obsolete, and external links rot.
            Will a PDF you create today open on a computer in 2076? Only if it adheres to strict standards.
        </p>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">Preventing Digital Obsolescence</h2>
        <p class="mb-6 text-lg leading-relaxed">
            In the 1980s, people wrote documents in WordPerfect and Lotus 1-2-3. Today, opening those files is a forensic challenge.
            A standard PDF is better, but not perfect. A PDF might rely on:
        </p>
        <ul class="list-disc leading-relaxed ml-6 space-y-3 text-lg mb-6">
            <li><strong>System Fonts:</strong> "Helvetica" might be installed on your Mac, but not on a Linux server in 2050. Result: Broken text.</li>
            <li><strong>External Images:</strong> It might link to a logo hosted on a website. If the website dies, the logo vanishes.</li>
            <li><strong>Encryption:</strong> If you lose the password, the data is gone forever.</li>
            <li><strong>JavaScript:</strong> Code that works in Acrobat 2024 might crash Acrobat 2040.</li>
        </ul>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">What is PDF/A? (ISO 19005)</h2>
        <p class="mb-6 text-lg leading-relaxed">
            <strong>PDF/A (Archive)</strong> is an ISO-standardized version of the Portable Document Format (ISO 19005). 
            Its sole purpose is long-term preservation.
            It acts like a digital time capsule.
            To be compliant, a document must be 100% self-contained. It cannot rely on <em>anything</em> outside the file itself.
        </p>

        <h3 class="text-2xl font-bold mt-8 mb-4">The Golden Rules of PDF/A</h3>
        <p class="mb-6 text-lg leading-relaxed">
            To save a file as PDF/A, the software must enforcing the following:
        </p>
        <ol class="list-decimal list-inside space-y-4 text-lg mb-8 bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
            <li><strong>Embed All Fonts:</strong> Every letter must have its font data stored inside the PDF. No exceptions.</li>
            <li><strong>Color Management:</strong> It must specify a device-independent color profile (like sRGB) so "Red" looks the same on a CRT monitor from 1999 and a Holographic display in 2099.</li>
            <li><strong>No Encryption:</strong> Passwords are forbidden. You can't archive something that might be locked forever.</li>
            <li><strong>No Audio/Video:</strong> Multimedia codecs change too fast. No movies allowed.</li>
            <li><strong>No Executable Code:</strong> No JavaScript or launch actions.</li>
        </ol>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">PDF/A-1 vs PDF/A-2 vs PDF/A-3</h2>
        <p class="mb-6 text-lg leading-relaxed">
            The standard has evolved. You will see options like PDF/A-1b or PDF/A-3u. What do they mean?
        </p>

        <h3 class="text-2xl font-bold mt-8 mb-4">The Generations</h3>
        <ul class="list-disc leading-relaxed ml-6 space-y-3 text-lg mb-6">
            <li><strong>PDF/A-1 (2005):</strong> Based on PDF 1.4. The strictest. No transparency (drop shadows are flattened). Use this for maximum compatibility.</li>
            <li><strong>PDF/A-2 (2011):</strong> Based on PDF 1.7. Shows support for transparency, layers, and JPEG2000 compression. The modern standard.</li>
            <li><strong>PDF/A-3 (2012):</strong> Identical to A-2, but allows "embedding non-PDF files." You can attach the original Excel sheet <em>inside</em> the PDF invoice. This is powerful for accounting.</li>
        </ul>

        <h3 class="text-2xl font-bold mt-8 mb-4">The Conformance Levels</h3>
        <ul class="list-disc leading-relaxed ml-6 space-y-3 text-lg mb-6">
            <li><strong>Level B (Basic):</strong> Visual integrity only. The document <em>looks</em> right. Text might not be searchable/copyable if unicode mapping is missing.</li>
            <li><strong>Level A (Accessible):</strong> Visual + Semantic integrity. Text is searchable, mapped to Unicode, and structure (Tagged PDF) is preserved for screen readers. Much harder to create.</li>
            <li><strong>Level U (Unicode):</strong> Visual + Searchable text. A middle ground introduced in PDF/A-2.</li>
        </ul>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">When to Use PDF/A Archiving</h2>

        <h3 class="text-2xl font-bold mt-8 mb-4">1. Legal and Courts</h3>
        <p class="mb-6 text-lg leading-relaxed">
            Most federal and state courts REQUIRE filings to be in PDF/A format. If you submit a standard PDF, the clerk might reject it.
        </p>

        <h3 class="text-2xl font-bold mt-8 mb-4">2. Regulated Industries (Pharma / Finance)</h3>
        <p class="mb-6 text-lg leading-relaxed">
            The FDA requires documentation that lasts decades. An drug trial report must be readable 20 years from now.
        </p>

        <h3 class="text-2xl font-bold mt-8 mb-4">3. Library and Museum Archives</h3>
        <p class="mb-6 text-lg leading-relaxed">
            The Library of Congress and National Archives exclusively use PDF/A for digitizing historical records.
        </p>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">How to Validate and Convert to PDF/A</h2>
        <p class="mb-6 text-lg leading-relaxed">
            Just because a file extension is ".pdf" doesn't mean it's safe.
            You must run a "Preflight" check.
            In Adobe Acrobat Pro: <code>Tools > Print Production > Preflight > Verify compliance with PDF/A-1b</code>.
            If the check fails, it will list the errors (e.g., "Font Arial not embedded"). You must then fix them using the "Convert to PDF/A" tool.
        </p>

        <h2 class="text-3xl font-display font-black mt-12 mb-6 uppercase border-b-2 border-black pb-2">Conclusion</h2>
        <p class="mb-6 text-lg leading-relaxed">
            PDF/A is insurance for your data.
            It creates larger files (because of the embedded fonts), but it buys peace of mind.
            If a document is important enough to keep for more than 5 years, it is important enough to convert to PDF/A.
        </p>
    `
};
