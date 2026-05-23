import { Metadata } from "next";
import RemoveEmptyPagesClient from "@/components/tools/RemoveEmptyPagesClient";

export const metadata: Metadata = {
    title: "Remove Empty Pages | Free Online PDF Tool",
    description: "Automatically scan and delete completely blank pages from your PDF documents securely in your browser.",
};

export default function RemoveEmptyPagesPage() {
    return <RemoveEmptyPagesClient />;
}
