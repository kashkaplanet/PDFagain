import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | PDFagain",
    description: "PDFagain Privacy Policy: Comprehensive details on our zero-data-collection approach.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
