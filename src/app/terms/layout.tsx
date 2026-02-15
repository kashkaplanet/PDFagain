import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | PDFagian",
    description: "Comprehensive Terms & Conditions for using PDFagian services.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
