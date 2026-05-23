import fs from 'fs';

async function run() {
    const buffer = Buffer.from("this is a fake ppt file, not a zip");
    const blob = new Blob([buffer], { type: 'application/vnd.ms-powerpoint' });
    
    const formData = new FormData();
    formData.append("file", blob, "test.ppt");
    
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
