import JSZip from 'jszip';
import fs from 'fs';

async function run() {
    const zip = new JSZip();
    zip.file("ppt/slides/slide1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
    <p:cSld>
        <p:spTree>
            <p:sp>
                <p:txBody>
                    <a:p><a:r><a:t>Hello World Slide 1</a:t></a:r></a:p>
                </p:txBody>
            </p:sp>
        </p:spTree>
    </p:cSld>
</p:sld>`);
    
    const buffer = await zip.generateAsync({type:"nodebuffer"});
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    
    const formData = new FormData();
    formData.append("file", blob, "test.pptx");
    
    try {
        const res = await fetch("http://localhost:3000/api/ppt-to-pdf", {
            method: "POST",
            body: formData
        });
        
        if (!res.ok) {
            const text = await res.text();
            console.error("API Error:", res.status, text);
        } else {
            console.log("Success! Got PDF buffer of size:", (await res.arrayBuffer()).byteLength);
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
run();
