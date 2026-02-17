"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollRestorationFix() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isPopState = useRef(false);

    useEffect(() => {
        // Track if a navigation is due to history traversal (back/forward)
        const onPopState = () => {
            isPopState.current = true;
        };

        window.addEventListener('popstate', onPopState);

        // Force manual scroll restoration to control the animation
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        // If there is a hash, we want to animate from the top
        // So we reset to top immediately, then let HomePage handle the smooth scroll
        if (window.location.hash) {
            window.scrollTo(0, 0);
            return;
        }

        // NEW NAVIGATION: Force scroll to top aggressively

        const scrollToTop = () => {
            try {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            } catch (e) {
                // ignore
            }
        };

        // 1. Immediate
        scrollToTop();

        // 2. Next frame
        requestAnimationFrame(() => {
            scrollToTop();
        });

        // 3. Timed attempts (10ms, 50ms, 100ms, 300ms)
        // This handles varying render/hydration speeds
        const timers = [
            setTimeout(scrollToTop, 10),
            setTimeout(scrollToTop, 50),
            setTimeout(scrollToTop, 100),
            setTimeout(scrollToTop, 300)
        ];

        return () => timers.forEach(clearTimeout);
    }, [pathname, searchParams]);

    return null;
}
