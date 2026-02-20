"use client";

import React from "react";
import JpgToPdfClient from "./JpgToPdfClient";

export default function WebpToPdfClient() {
    return (
        <JpgToPdfClient
            title="WebP to PDF"
            description="Convert WebP images to a single PDF document."
            accept={{ "image/webp": [".webp"] }}
            variant="cyan"
        />
    );
}
