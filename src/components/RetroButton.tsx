import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { RETRO_COLORS, RetroVariant } from '@/config/design';

// Simple CSS-based shimmer animation using Tailwind arbitrary values
const ShimmerOverlay = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_6s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 skew-x-[-20deg]" />
);

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: LucideIcon;
    variant?: RetroVariant;
    className?: string;
    onClick?: () => void;
    href?: string;
    shimmer?: boolean;
    rainbow?: boolean;
}

const getVariantClasses = (variant: RetroVariant) => {
    const colors = RETRO_COLORS[variant];
    return `${colors.bg} ${colors.hoverBg}`;
};

export function RetroButton({ label, icon: Icon, variant = 'default', className, href, shimmer, rainbow, ...props }: RetroButtonProps) {
    // We need to override base shadow if rainbow is active, but baseStyles has it hardcoded.
    // Let's remove shadow from basic styles and add it conditionally.
    const baseStylesNoShadow = "relative inline-flex items-center justify-center gap-2 px-5 py-3 font-display font-bold text-black text-lg transition-all duration-300 ease-in-out border-2 border-black rounded-lg hover:translate-y-[2px] hover:translate-x-[2px] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none bg-white tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 overflow-hidden";

    // Default shadow logic
    const shadowStyles = rainbow
        ? "animate-rainbow-shadow"
        : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    const colorStyles = getVariantClasses(variant);

    if (href) {
        const isAnchor = href.startsWith('#');

        if (isAnchor) {
            return (
                <a
                    href={href}
                    className={cn(baseStylesNoShadow, shadowStyles, colorStyles, className)}
                    aria-label={label}
                    onClick={(e) => {
                        e.preventDefault();
                        const id = href.substring(1);
                        const element = document.getElementById(id);
                        if (element) {
                            const y = element.getBoundingClientRect().top + window.scrollY - 140;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                            window.history.pushState(null, '', href);
                        }
                        if (props.onClick) props.onClick();
                    }}
                    {...(props as any)}
                >
                    {Icon && <Icon className="w-5 h-5 relative z-20" aria-hidden="true" />}
                    <span className="relative z-20">{label}</span>
                    {shimmer && <ShimmerOverlay />}
                </a>
            );
        }

        return (
            <Link href={href} className={cn(baseStylesNoShadow, shadowStyles, colorStyles, className)} aria-label={label} {...(props as any)}>
                {Icon && <Icon className="w-5 h-5 relative z-20" aria-hidden="true" />}
                <span className="relative z-20">{label}</span>
                {shimmer && <ShimmerOverlay />}
            </Link>
        );
    }

    return (
        <button className={cn(baseStylesNoShadow, shadowStyles, colorStyles, className)} {...props} aria-label={label}>
            {Icon && <Icon className="w-5 h-5 relative z-20" aria-hidden="true" />}
            <span className="relative z-20">{label}</span>
            {shimmer && <ShimmerOverlay />}
        </button>
    );
}
