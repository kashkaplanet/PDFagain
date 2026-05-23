import { Metadata } from "next";
import MarkdownToPdfClient from "@/components/tools/MarkdownToPdfClient";

export const metadata: Metadata = {
    title: "Markdown to PDF Converter | Free Online PDF Tools",
    description: "Convert your Markdown text into a beautifully styled PDF document instantly. Supports GitHub Flavored Markdown.",
};

export default function MarkdownToPdfPage() {
    return <MarkdownToPdfClient />;
}
