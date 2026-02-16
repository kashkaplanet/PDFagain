"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Disable browser's default scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Function to force scroll to top
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant", // Force instant scroll, ignore smooth scrolling preference
            });
        };

        // Attempt 1: Immediate
        scrollToTop();

        // Attempt 2: Small delay to override any browser restoration race conditions
        const timeoutId = setTimeout(scrollToTop, 10);

        // Attempt 3: Slightly longer delay for slower devices/rendering
        const timeoutId2 = setTimeout(scrollToTop, 50);

        // Listen for popstate (back/forward) events to force scroll
        window.addEventListener('popstate', scrollToTop);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);
            window.removeEventListener('popstate', scrollToTop);
        };
    }, [pathname]);

    return null;
}
