import { Metadata } from "next";
import AddMarginsClient from "@/components/tools/AddMarginsClient";

export const metadata: Metadata = {
    title: "Add Margins to PDF | Free Online PDF Editor",
    description: "Add white space or padding around the edges of your PDF pages instantly in your browser.",
};

export default function AddMarginsPage() {
    return <AddMarginsClient />;
}
