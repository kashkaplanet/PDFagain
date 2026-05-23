import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | PDFagain",
    description: "Comprehensive Terms & Conditions for using PDFagain services.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
