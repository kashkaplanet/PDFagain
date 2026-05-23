import { Metadata } from "next";
import SvgToPdfClient from "@/components/tools/SvgToPdfClient";

export const metadata: Metadata = {
    title: "SVG to PDF Converter | Free Online Vector Tools",
    description: "Convert scalable vector graphics into high-quality PDF documents instantly in your browser.",
};

export default function SvgToPdfPage() {
    return <SvgToPdfClient />;
}
