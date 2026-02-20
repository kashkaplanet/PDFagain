"use client";

import React from "react";
import JpgToPdfClient from "./JpgToPdfClient";

export default function PngToPdfClient() {
    return (
        <JpgToPdfClient
            title="PNG to PDF"
            description="Convert PNG images to a single PDF document."
            accept={{ "image/png": [".png"] }}
            variant="pink"
        />
    );
}
