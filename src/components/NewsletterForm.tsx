"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const response = await fetch("https://formsubmit.co/ajax/support@pdfagain.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    _subject: "New Newsletter Subscriber!",
                    _honey: "" // Spam protection
                })
            });

            if (response.ok) {
                setStatus("success");
                setEmail("");
            } else {
                console.error("Subscription failed");
                setStatus("idle");
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("idle");
            alert("Something went wrong. Please try again.");
        }
    };

    if (status === "success") {
        return (
            <div className="w-full max-w-md mx-auto p-8 bg-black text-white text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] animate-in fade-in zoom-in duration-300">
                <div className="inline-flex p-3 rounded-full bg-[#A3E635] text-black mb-4">
                    <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-black uppercase mb-2">You're In!</h3>
                <p className="font-sans text-gray-300">Thanks for subscribing. Keep an eye on your inbox.</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm underline hover:text-[#A3E635] transition-colors"
                >
                    Subscribe another email
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1 px-4 py-3 border-2 border-black font-sans focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-black text-white font-display font-bold uppercase tracking-wider hover:bg-white hover:text-black border-2 border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
                {status === "loading" ? "Joining..." : "Subscribe"}
            </button>
        </form>
    );
}
