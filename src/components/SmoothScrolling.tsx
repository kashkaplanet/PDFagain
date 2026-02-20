"use client";
import { ReactLenis } from "lenis/react";

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
    // Only enable smooth scrolling on non-touch devices for better mobile performance
    return (
        <ReactLenis root options={{
            lerp: 0.1,
            duration: 1.5,
            smoothWheel: true,
            // Disable on touch devices
            touchMultiplier: 0,
        }}>
            {children}
        </ReactLenis>
    );
}
