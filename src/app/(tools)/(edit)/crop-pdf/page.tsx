import { Metadata } from "next";
import CropPdfClient from "@/components/tools/CropPdfClient";

export const metadata: Metadata = {
    title: "Crop PDF | Free Online PDF Tool",
    description: "Trim the visible area or margins of your PDF pages easily in your browser.",
};

export default function CropPdfPage() {
    return <CropPdfClient />;
}
