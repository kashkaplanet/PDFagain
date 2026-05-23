import { Metadata } from "next";
import JsonToPdfClient from "@/components/tools/JsonToPdfClient";

export const metadata: Metadata = {
    title: "JSON to PDF Converter | Free Online Developer Tools",
    description: "Format raw JSON data into a clean, readable, and beautifully highlighted PDF document.",
};

export default function JsonToPdfPage() {
    return <JsonToPdfClient />;
}
