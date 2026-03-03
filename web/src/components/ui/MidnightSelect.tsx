'use client';

/**
 * MidnightSelect – A fully custom, keyboard-accessible dropdown
 * styled with the Midnight theme CSS variables.
 *
 * Usage:
 *   import MidnightSelect from '@/components/ui/MidnightSelect';
 *
 *   <MidnightSelect
 *     label="Domain Type"
 *     value={value}
 *     onChange={setValue}
 *     options={[{ value: 'TRANSPORT', label: 'Commercial Transport' }]}
 *   />
 *
 * Variant sizes: 'sm' | 'md' (default) | 'lg'
 */

import React, { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption {
    value: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

interface MidnightSelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    /** accent colour - defaults to var(--t-accent) */
    accent?: string;
    /** Classname applied to the wrapper div */
    className?: string;
}

const SIZES = {
    sm: { padding: '0.45rem 0.75rem', fontSize: '0.8rem', borderRadius: 8 },
    md: { padding: '0.7rem 0.875rem', fontSize: '0.875rem', borderRadius: 10 },
    lg: { padding: '0.9rem 1.1rem', fontSize: '0.95rem', borderRadius: 12 },
};

export default function MidnightSelect({
    label,
    value,
    onChange,
    options,
    placeholder = 'Select…',
    size = 'md',
    disabled = false,
    accent = 'var(--t-accent)',
    className,
}: MidnightSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keyboard nav
    const handleKey = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v => !v); }
        if (e.key === 'Escape') setOpen(false);
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const idx = options.findIndex(o => o.value === value);
            const next = e.key === 'ArrowDown'
                ? Math.min(idx + 1, options.length - 1)
                : Math.max(idx - 1, 0);
            onChange(options[next].value);
        }
    };

    const selected = options.find(o => o.value === value);
    const sz = SIZES[size];

    return (
        <div
            className={className}
            ref={ref}
            style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}
        >
            {label && (
                <label
                    htmlFor={id}
                    style={{
                        fontSize: '0.62rem', fontWeight: 700,
                        color: 'var(--t-text-dim)',
                        textTransform: 'uppercase', letterSpacing: '0.09em',
                        fontFamily: 'var(--font-sans)',
                        userSelect: 'none',
                    }}
                >
                    {label}
                </label>
            )}

            {/* Trigger button */}
            <button
                id={id}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(v => !v)}
                onKeyDown={handleKey}
                aria-haspopup="listbox"
                aria-expanded={open}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: sz.padding,
                    borderRadius: sz.borderRadius,
                    background: disabled ? 'var(--t-bg)' : 'var(--t-surface)',
                    border: `1px solid ${open ? accent : 'var(--t-border)'}`,
                    color: selected ? 'var(--t-text)' : 'var(--t-text-dim)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: sz.fontSize,
                    fontWeight: 500,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    textAlign: 'left',
                    boxShadow: open ? `0 0 0 3px ${accent}22` : 'none',
                    outline: 'none',
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selected?.icon && <span>{selected.icon}</span>}
                    <span>{selected?.label ?? placeholder}</span>
                </span>
                <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--t-text-dim)' }}
                >
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Dropdown panel */}
            {open && (
                <div
                    role="listbox"
                    aria-label={label}
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        background: 'var(--t-card)',
                        border: `1px solid ${accent}44`,
                        borderRadius: sz.borderRadius + 2,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.12s ease',
                        maxHeight: 280,
                        overflowY: 'auto',
                    }}
                >
                    {options.map((opt, i) => {
                        const isSelected = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                role="option"
                                aria-selected={isSelected}
                                type="button"
                                disabled={opt.disabled}
                                onClick={() => { if (!opt.disabled) { onChange(opt.value); setOpen(false); } }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: sz.padding,
                                    background: isSelected ? `${accent}18` : 'transparent',
                                    color: isSelected ? accent : opt.disabled ? 'var(--t-text-dim)' : 'var(--t-text)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: sz.fontSize,
                                    fontWeight: isSelected ? 700 : 400,
                                    border: 'none',
                                    borderBottom: i < options.length - 1 ? '1px solid var(--t-border-subtle)' : 'none',
                                    cursor: opt.disabled ? 'not-allowed' : 'pointer',
                                    opacity: opt.disabled ? 0.4 : 1,
                                    transition: 'background 0.1s, color 0.1s',
                                }}
                                onMouseEnter={e => {
                                    if (!isSelected && !opt.disabled)
                                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--t-card-hover)';
                                }}
                                onMouseLeave={e => {
                                    if (!isSelected && !opt.disabled)
                                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                }}
                            >
                                {opt.icon && <span style={{ fontSize: '1rem' }}>{opt.icon}</span>}
                                <span style={{ flex: 1 }}>{opt.label}</span>
                                {isSelected && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6L5 9L10 3" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
