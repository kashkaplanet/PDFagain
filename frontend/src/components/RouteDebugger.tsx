"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteDebugger() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const count = useRef(0);

    useEffect(() => {
        count.current++;
        console.group(`[RouteDebugger] Navigation Event #${count.current}`);
        console.log("Time:", new Date().toISOString());
        console.log("Pathname:", pathname);
        console.log("SearchParams:", searchParams.toString());
        console.log("History Length:", window.history.length);
        console.log("History State:", window.history.state);
        console.groupEnd();

        // Listen for popstate mainly for back/forward but usePathname covers most
        const handlePopState = (e: PopStateEvent) => {
            console.log("[RouteDebugger] PopState Event:", e);
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [pathname, searchParams]);

    return null;
}
