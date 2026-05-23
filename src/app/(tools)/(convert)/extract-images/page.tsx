import { Metadata } from "next";
import ExtractImagesClient from "@/components/tools/ExtractImagesClient";

export const metadata: Metadata = {
    title: "Extract Images from PDF | Free Online PDF Tools",
    description: "Extract all embedded images from a PDF into a single ZIP file instantly in your browser.",
};

export default function ExtractImagesPage() {
    return <ExtractImagesClient />;
}
