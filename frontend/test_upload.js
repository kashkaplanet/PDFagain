const fs = require('fs');
const path = require('path');

async function test() {
    const filePath = path.join('..', 'backend', 'test_output.pdf');
    const fileBuffer = fs.readFileSync(filePath);
    
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('file', blob, 'test_output.pdf');
    formData.append('format', 'images');
    formData.append('image_format', 'jpg');

    console.log("Sending request...");
    try {
        const response = await fetch('http://localhost:3000/api/pdf-to-jpg', {
            method: 'POST',
            body: formData
        });
        
        console.log("Status:", response.status);
        if (!response.ok) {
            const text = await response.text();
            console.log("Error:", text);
        } else {
            console.log("Success! Content-Type:", response.headers.get('content-type'));
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

test();
