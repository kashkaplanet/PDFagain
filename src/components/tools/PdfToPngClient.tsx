"use client";

import React from "react";
import PdfToJpgClient from "./PdfToJpgClient";

export default function PdfToPngClient() {
    return (
        <PdfToJpgClient
            title="PDF to PNG"
            description="Convert PDF pages to high-quality PNG images with transparent backgrounds."
            outputFormat="png"
            variant="purple"
        />
    );
}
