"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    // Check for theme query parameter
    // Add useSearchParams hook safely (might need Suspense boundary if used directly in page, but acceptable here if wrapped or handled)
    // Actually, simply checking window.location.search in useEffect is safer for pure client-side without de-opting static gen on pages using this component
    // But let's stick to standard next/navigation if possible, BUT since this is a root provider, using useSearchParams might trigger de-opt for whole app?
    // Let's use vanilla JS for safety to avoid Next.js static de-opt issues in root layout

    useEffect(() => {
        setMounted(true);

        // 1. Check URL param first (highest priority for sharing/visibility)
        const params = new URLSearchParams(window.location.search);
        const themeParam = params.get("theme");

        // 2. Check saved preference
        const savedTheme = localStorage.getItem("theme") as Theme | null;

        // 3. Check system preference
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (themeParam === "dark" || themeParam === "light") {
            setTheme(themeParam as Theme);
            // Optionally save to local storage if user arrived via link? 
            // Maybe not, to respect their existing pref if they navigate away. 
            // But usually if you click a link with a theme, you expect that theme.
            // Let's just set it for now.
        } else if (savedTheme) {
            setTheme(savedTheme);
        } else if (systemPrefersDark) {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);

        // Optional: Update URL to reflect current theme?
        // This might be annoying if it appends ?theme=... to every URL navigation.
        // Better to ONLY read from URL, not write to it automatically, 
        // to keep URLs clean unless user explicitly wants to share.
        // However, if the goal is "publicly visible", maybe we WANT it in the URL?
        // User asked "The theme is not publicly visible, so it is not easily identifiable."
        // If I toggle theme, and URL doesn't change, it's still "hidden" state.
        // But forcing it into URL on every toggle is bad UX for normal browsing.
        // A "Share Theme" button would be better, but that's a UI change.
        // Let's stick to just READING for now, which allows manual ?theme=dark.

    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
