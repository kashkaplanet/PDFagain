import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security Architecture | PDFagain",
    description: "In-depth overview of PDFagain's 100% client-side security model.",
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
