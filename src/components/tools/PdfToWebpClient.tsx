"use client";

import React from "react";
import PdfToJpgClient from "./PdfToJpgClient";

export default function PdfToWebpClient() {
    return (
        <PdfToJpgClient
            title="PDF to WebP"
            description="Convert PDF pages to modern, highly optimized WebP images."
            outputFormat="webp"
            variant="orange"
        />
    );
}
