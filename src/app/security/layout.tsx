import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security Architecture | PDFagian",
    description: "In-depth overview of PDFagian's 100% client-side security model.",
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
