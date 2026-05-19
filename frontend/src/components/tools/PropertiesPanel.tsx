import React from 'react';
import {
    Palette,
    Trash2,
    Copy,
    BringToFront,
    SendToBack,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic
} from 'lucide-react';
import clsx from 'clsx';

interface PropertiesPanelProps {
    values: {
        fill: string;
        stroke: string;
        strokeWidth: number;
        opacity: number;
        backgroundColor?: string;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string | number;
        fontStyle?: string;
        textAlign?: string;
        type: string;
    } | null;
    onChange: (key: string, value: any) => void;
    onAction: (action: 'delete' | 'clone' | 'bringToFront' | 'sendToBack') => void;
}

export function PropertiesPanel({ values, onChange, onAction }: PropertiesPanelProps) {
    if (!values) return null;

    const isText = values.type === 'i-text' || values.type === 'text';

    const SectionLabel = ({ children }: { children: React.ReactNode }) => (
        <div className="text-xs font-display uppercase tracking-widest text-gray-600 pb-2 border-b-2 border-black mb-3">
            {children}
        </div>
    );

    return (
        <div className="w-64 bg-[#FFFBE6] border-l-2 border-black p-4 flex flex-col gap-5 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-display text-sm uppercase tracking-wider">Properties</h3>
                <span className="px-2 py-0.5 bg-black text-white text-[10px] font-display uppercase">
                    {values.type}
                </span>
            </div>

            {/* Colors Section */}
            <div>
                <SectionLabel>Colors</SectionLabel>

                {/* Fill Color */}
                <div className="space-y-2 mb-4">
                    <label className="text-xs font-display uppercase tracking-wide flex items-center gap-2">
                        <Palette className="w-3 h-3" /> Fill
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-9 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                            <input
                                type="color"
                                value={values.fill === 'transparent' ? '#ffffff' : values.fill}
                                onChange={(e) => onChange('fill', e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: values.fill === 'transparent' ? '#ffffff' : values.fill }} />
                        </div>
                        <button
                            onClick={() => onChange('fill', 'transparent')}
                            className="px-2 py-1.5 text-[10px] font-display uppercase bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                        >
                            None
                        </button>
                    </div>
                </div>

                {/* Stroke Color */}
                <div className="space-y-2 mb-4">
                    <label className="text-xs font-display uppercase tracking-wide">Stroke</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-9 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                            <input
                                type="color"
                                value={values.stroke || '#000000'}
                                onChange={(e) => onChange('stroke', e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: values.stroke || '#000000' }} />
                        </div>
                        <button
                            onClick={() => onChange('stroke', 'transparent')}
                            className="px-2 py-1.5 text-[10px] font-display uppercase bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                        >
                            None
                        </button>
                    </div>
                </div>

                {/* Stroke Width */}
                <div className="space-y-2 mb-4">
                    <label className="text-xs font-display uppercase tracking-wide flex justify-between">
                        <span>Stroke Width</span>
                        <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px]">{values.strokeWidth}px</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={values.strokeWidth}
                        onChange={(e) => onChange('strokeWidth', parseInt(e.target.value))}
                        className="w-full accent-[#A855F7] h-2 bg-white border-2 border-black appearance-none cursor-pointer"
                    />
                </div>

                {/* Opacity */}
                <div className="space-y-2">
                    <label className="text-xs font-display uppercase tracking-wide flex justify-between">
                        <span>Opacity</span>
                        <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px]">{Math.round(values.opacity * 100)}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={values.opacity}
                        onChange={(e) => onChange('opacity', parseFloat(e.target.value))}
                        className="w-full accent-[#A855F7] h-2 bg-white border-2 border-black appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Text Specific */}
            {isText && (
                <div>
                    <SectionLabel>Text Style</SectionLabel>

                    <div className="space-y-3">
                        {/* Font Family */}
                        <select
                            value={values.fontFamily}
                            onChange={(e) => onChange('fontFamily', e.target.value)}
                            className="w-full bg-white border-2 border-black px-3 py-2 text-sm font-display uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(168,85,247,1)]"
                        >
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier</option>
                            <option value="Arial">Arial</option>
                        </select>

                        {/* Font Size */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-display uppercase w-16">Size</span>
                            <input
                                type="number"
                                value={values.fontSize}
                                onChange={(e) => onChange('fontSize', parseInt(e.target.value))}
                                className="flex-1 bg-white border-2 border-black px-3 py-1.5 text-sm font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(168,85,247,1)]"
                                min="6"
                                max="100"
                            />
                        </div>

                        {/* Bold / Italic */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => onChange('fontWeight', values.fontWeight === 'bold' || values.fontWeight === 700 ? 'normal' : 'bold')}
                                className={clsx(
                                    "flex-1 p-2 border-2 border-black flex justify-center transition-all duration-200",
                                    (values.fontWeight === 'bold' || values.fontWeight === 700)
                                        ? "bg-[#A855F7] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        : "bg-white hover:bg-[#F5F5F0] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                                )}
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onChange('fontStyle', values.fontStyle === 'italic' ? 'normal' : 'italic')}
                                className={clsx(
                                    "flex-1 p-2 border-2 border-black flex justify-center transition-all duration-200",
                                    values.fontStyle === 'italic'
                                        ? "bg-[#A855F7] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        : "bg-white hover:bg-[#F5F5F0] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                                )}
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Text Alignment */}
                        <div className="flex border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => onChange('textAlign', align)}
                                    className={clsx(
                                        "flex-1 p-2 flex justify-center border-r-2 border-black last:border-r-0 transition-colors",
                                        values.textAlign === align
                                            ? "bg-[#A855F7] text-white"
                                            : "bg-white hover:bg-[#F5F5F0]"
                                    )}
                                >
                                    {align === 'left' && <AlignLeft className="w-4 h-4" />}
                                    {align === 'center' && <AlignCenter className="w-4 h-4" />}
                                    {align === 'right' && <AlignRight className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="mt-auto">
                <SectionLabel>Actions</SectionLabel>

                {/* Layer Actions */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                        onClick={() => onAction('bringToFront')}
                        className="flex flex-col items-center justify-center p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <BringToFront className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-display uppercase">Front</span>
                    </button>
                    <button
                        onClick={() => onAction('sendToBack')}
                        className="flex flex-col items-center justify-center p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                        <SendToBack className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-display uppercase">Back</span>
                    </button>
                </div>

                {/* Clone / Delete */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onAction('clone')}
                        className="flex items-center justify-center gap-2 p-2 bg-[#22D3EE] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-xs font-display uppercase"
                    >
                        <Copy className="w-3 h-3" /> Clone
                    </button>
                    <button
                        onClick={() => onAction('delete')}
                        className="flex items-center justify-center gap-2 p-2 bg-[#F87171] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-xs font-display uppercase"
                    >
                        <Trash2 className="w-3 h-3" /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
