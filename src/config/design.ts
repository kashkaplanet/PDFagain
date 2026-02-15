export type RetroVariant = 'pink' | 'orange' | 'cyan' | 'purple' | 'green' | 'lime' | 'red' | 'blue' | 'yellow' | 'indigo' | 'default';

export const RETRO_COLORS = {
    pink: {
        bg: 'bg-[#F472B6]',
        hoverBg: 'hover:bg-[#EC4899]',
        activeBg: 'bg-[#EC4899]',
        lightBg: 'bg-[#F472B6]/30',
        text: 'text-black',
        border: 'border-black'
    },
    orange: {
        bg: 'bg-[#FB923C]',
        hoverBg: 'hover:bg-[#F97316]',
        activeBg: 'bg-[#F97316]',
        lightBg: 'bg-[#FB923C]/30',
        text: 'text-black',
        border: 'border-black'
    },
    cyan: {
        bg: 'bg-[#22D3EE]',
        hoverBg: 'hover:bg-[#06B6D4]',
        activeBg: 'bg-[#06B6D4]',
        lightBg: 'bg-[#22D3EE]/30',
        text: 'text-black',
        border: 'border-black'
    },
    purple: {
        bg: 'bg-[#A78BFA]',
        hoverBg: 'hover:bg-[#8B5CF6]',
        activeBg: 'bg-[#8B5CF6]',
        lightBg: 'bg-[#A78BFA]/30',
        text: 'text-black',
        border: 'border-black'
    },
    green: {
        bg: 'bg-[#34D399]',
        hoverBg: 'hover:bg-[#10B981]',
        activeBg: 'bg-[#10B981]',
        lightBg: 'bg-[#34D399]/30',
        text: 'text-black',
        border: 'border-black'
    },
    lime: {
        bg: 'bg-[#A3E635]',
        hoverBg: 'hover:bg-[#84CC16]',
        activeBg: 'bg-[#84CC16]',
        lightBg: 'bg-[#A3E635]/30',
        text: 'text-black',
        border: 'border-black'
    },
    red: {
        bg: 'bg-[#F87171]',
        hoverBg: 'hover:bg-[#EF4444]',
        activeBg: 'bg-[#EF4444]',
        lightBg: 'bg-[#F87171]/30',
        text: 'text-black',
        border: 'border-black'
    },
    blue: {
        bg: 'bg-[#60A5FA]',
        hoverBg: 'hover:bg-[#3B82F6]',
        activeBg: 'bg-[#3B82F6]',
        lightBg: 'bg-[#60A5FA]/30',
        text: 'text-black',
        border: 'border-black'
    },
    yellow: {
        bg: 'bg-[#FACC15]',
        hoverBg: 'hover:bg-[#EAB308]',
        activeBg: 'bg-[#EAB308]',
        lightBg: 'bg-[#FACC15]/30',
        text: 'text-black',
        border: 'border-black'
    },
    indigo: {
        bg: 'bg-[#818CF8]',
        hoverBg: 'hover:bg-[#6366F1]',
        activeBg: 'bg-[#6366F1]',
        lightBg: 'bg-[#818CF8]/30',
        text: 'text-black',
        border: 'border-black'
    },
    default: {
        bg: 'bg-white',
        hoverBg: 'hover:bg-gray-100',
        activeBg: 'bg-gray-200',
        lightBg: 'bg-gray-200',
        text: 'text-black',
        border: 'border-black'
    }
} as const;

export const RETRO_SHADOWS = {
    base: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    hover: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    sm: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    hoverSm: 'shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
};
