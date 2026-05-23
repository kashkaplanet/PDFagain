import { Metadata } from "next";
import SanitizePdfClient from "@/components/tools/SanitizePdfClient";

export const metadata: Metadata = {
    title: "Sanitize PDF | Free Online PDF Privacy Tool",
    description: "Permanently remove hidden metadata, author information, and creation dates from your PDF documents for total privacy.",
};

export default function SanitizePdfPage() {
    return <SanitizePdfClient />;
}
