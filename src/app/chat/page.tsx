import type { Metadata } from "next";
import RetroChatPage from "@/components/RetroChatPage";

export const metadata: Metadata = {
    title: "Chat with PDF - PDFagian",
    description: "Upload a PDF and chat with it using AI. Ask questions, get summaries, and extract insights. 100% free.",
};

export default function ChatPage() {
    return <RetroChatPage />;
}
