"use client";

import React from "react";
import clsx from "clsx";

interface RetroCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'success' | 'warning';
}

export function RetroCard({ children, className, variant = 'default' }: RetroCardProps) {
    return (
        <div
            className={clsx(
                "bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                variant === 'success' && "bg-[#34D399]/10 border-[#34D399]",
                variant === 'warning' && "bg-[#FB923C]/10 border-[#FB923C]",
                className
            )}
        >
            {children}
        </div>
    );
}

interface RetroSelectProps {
    options: { value: string; label: string; description?: string }[];
    value: string;
    onChange: (value: string) => void;
    color?: 'pink' | 'orange' | 'cyan' | 'purple' | 'green' | 'blue' | 'red' | 'lime' | 'yellow' | 'indigo' | 'default';
}

const selectColorMap = {
    pink: 'border-[#F472B6] bg-[#F472B6]/10',
    orange: 'border-[#FB923C] bg-[#FB923C]/10',
    cyan: 'border-[#22D3EE] bg-[#22D3EE]/10',
    purple: 'border-[#A78BFA] bg-[#A78BFA]/10',
    green: 'border-[#34D399] bg-[#34D399]/10',
    blue: 'border-[#60A5FA] bg-[#60A5FA]/10',
    red: 'border-[#F87171] bg-[#F87171]/10',
    lime: 'border-[#A3E635] bg-[#A3E635]/10',
    yellow: 'border-[#FACC15] bg-[#FACC15]/10',
    indigo: 'border-[#818CF8] bg-[#818CF8]/10',
    default: 'border-black bg-gray-100',
};

export function RetroSelect({ options, value, onChange, color = 'pink' }: RetroSelectProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            {options.map((option) => (
                <div
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={clsx(
                        "flex-1 p-4 border-2 cursor-pointer transition-all duration-200",
                        value === option.value
                            ? `${selectColorMap[color]} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`
                            : "border-black bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px]"
                    )}
                >
                    <h3 className="font-display text-black mb-1">{option.label}</h3>
                    {option.description && (
                        <p className="text-sm text-gray-600 font-sans">{option.description}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

interface RetroFileItemProps {
    name: string;
    size: string;
    index: number;
    onRemove: () => void;
    color?: 'pink' | 'orange' | 'cyan' | 'purple' | 'green' | 'blue' | 'red' | 'lime' | 'yellow' | 'indigo' | 'default';
    draggable?: boolean;
}

const itemColorMap = {
    pink: 'bg-[#F472B6]',
    orange: 'bg-[#FB923C]',
    cyan: 'bg-[#22D3EE]',
    purple: 'bg-[#A78BFA]',
    green: 'bg-[#34D399]',
    blue: 'bg-[#60A5FA]',
    red: 'bg-[#F87171]',
    lime: 'bg-[#A3E635]',
    yellow: 'bg-[#FACC15]',
    indigo: 'bg-[#818CF8]',
    default: 'bg-gray-200',
};

export function RetroFileItem({ name, size, index, onRemove, color = 'pink' }: RetroFileItemProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
            <div className="flex items-center space-x-4">
                <span className={`flex items-center justify-center w-8 h-8 ${itemColorMap[color]} border-2 border-black font-display text-sm`}>
                    {index + 1}
                </span>
                <div>
                    <p className="font-display text-black truncate max-w-[300px]">
                        {name}
                    </p>
                    <p className="text-xs text-gray-600 font-sans">
                        {size}
                    </p>
                </div>
            </div>
            <button
                onClick={onRemove}
                className="px-3 py-1 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
            >
                Remove
            </button>
        </div>
    );
}

interface RetroProgressProps {
    label: string;
    isProcessing: boolean;
    processingText: string;
    onClick: () => void;
    disabled?: boolean;
    color?: 'pink' | 'orange' | 'cyan' | 'purple' | 'green' | 'blue' | 'red' | 'lime' | 'yellow' | 'indigo' | 'default';
    icon?: React.ReactNode;
    className?: string;
}

const buttonColorMap = {
    pink: 'bg-[#F472B6] hover:bg-[#EC4899]',
    orange: 'bg-[#FB923C] hover:bg-[#F97316]',
    cyan: 'bg-[#22D3EE] hover:bg-[#06B6D4]',
    purple: 'bg-[#A78BFA] hover:bg-[#8B5CF6]',
    green: 'bg-[#34D399] hover:bg-[#10B981]',
    blue: 'bg-[#60A5FA] hover:bg-[#3B82F6]',
    red: 'bg-[#F87171] hover:bg-[#EF4444]',
    lime: 'bg-[#A3E635] hover:bg-[#84CC16]',
    yellow: 'bg-[#FACC15] hover:bg-[#EAB308]',
    indigo: 'bg-[#818CF8] hover:bg-[#6366F1]',
    default: 'bg-white hover:bg-gray-100',
};

export function RetroActionButton({ label, isProcessing, processingText, onClick, disabled, color = 'pink', icon, className }: RetroProgressProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || isProcessing}
            className={clsx(
                "w-full flex items-center justify-center gap-2 px-6 py-4 font-display text-xl text-black border-2 border-black transition-all",
                buttonColorMap[color],
                "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0",
                className
            )}
        >
            {isProcessing ? (
                <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {processingText}
                </>
            ) : (
                <>
                    {label}
                    {icon}
                </>
            )}
        </button>
    );
}
