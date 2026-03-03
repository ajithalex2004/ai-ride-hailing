'use client';

import React, { useState, useRef, useEffect } from 'react';

/* ─── Reusable themed select ─────────────────────────────────── */
function Select({
    label, value, onChange, options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = options.find(o => o.value === value);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} ref={ref}>
            <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <button
                    type="button"
                    onClick={() => setOpen(v => !v)}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.7rem 0.875rem', borderRadius: 10,
                        background: 'var(--t-surface)', border: `1px solid ${open ? 'var(--t-accent)' : 'var(--t-border)'}`,
                        color: 'var(--t-text)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500,
                        cursor: 'pointer', transition: 'border-color 0.15s', textAlign: 'left',
                        boxShadow: open ? '0 0 0 3px rgba(245,158,11,0.10)' : 'none',
                    }}
                >
                    <span>{selected?.label ?? value}</span>
                    <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--t-text-dim)', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </button>

                {open && (
                    <div style={{
                        position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100,
                        background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden',
                        animation: 'fadeIn 0.15s ease',
                    }}>
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                style={{
                                    width: '100%', textAlign: 'left', padding: '0.65rem 0.875rem',
                                    background: opt.value === value ? 'var(--t-sidebar-active)' : 'transparent',
                                    color: opt.value === value ? 'var(--t-accent)' : 'var(--t-text)',
                                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: opt.value === value ? 700 : 400,
                                    border: 'none', cursor: 'pointer', transition: 'background 0.1s',
                                    borderBottom: '1px solid var(--t-border-subtle)',
                                }}
                                onMouseEnter={e => { if (opt.value !== value) (e.currentTarget as any).style.background = 'var(--t-card-hover)'; }}
                                onMouseLeave={e => { if (opt.value !== value) (e.currentTarget as any).style.background = 'transparent'; }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Toggle switch ──────────────────────────────────────────── */
function RuleToggle({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem', borderRadius: 12,
                background: 'var(--t-surface)', border: `1px solid ${checked ? 'rgba(245,158,11,0.2)' : 'var(--t-border)'}`,
                transition: 'border-color 0.2s', cursor: 'pointer',
            }}
            onClick={() => setChecked(v => !v)}
        >
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--t-text)', fontFamily: 'var(--font-sans)' }}>{label}</span>
            <div
                style={{
                    width: 40, height: 22, borderRadius: 999, position: 'relative',
                    background: checked ? 'var(--t-accent)' : 'var(--t-border)', transition: 'background 0.2s',
                    flexShrink: 0,
                }}
            >
                <div style={{
                    position: 'absolute', top: 3, left: checked ? 21 : 3, width: 16, height: 16,
                    borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                }} />
            </div>
        </div>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
const DOMAIN_OPTIONS = [
    { value: 'TRANSPORT', label: 'Commercial Transport' },
    { value: 'EMERGENCY', label: 'Emergency Response' },
    { value: 'RESCUE', label: 'Rescue Operations' },
    { value: 'LOGISTICS', label: 'Logistics & Freight' },
];

const SUB_TYPE_OPTIONS = [
    { value: '', label: 'Select sub-type' },
    { value: 'AMB_P1', label: 'Ambulance (P1)' },
    { value: 'INC_P2', label: 'Road Incident (P2)' },
    { value: 'VIP_CORP', label: 'VIP Corporate' },
];

const PRIORITY_OPTIONS = [
    { value: 'P1', label: 'High (P1)' },
    { value: 'P2', label: 'Medium (P2)' },
    { value: 'STANDARD', label: 'Standard' },
];

export default function DomainConfigPage() {
    const [domainType, setDomainType] = useState('TRANSPORT');
    const [subType, setSubType] = useState('');
    const [priority, setPriority] = useState('P1');
    const [saved, setSaved] = useState(false);

    const isEmergency = domainType === 'EMERGENCY' || domainType === 'RESCUE';

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'var(--font-sans)', color: 'var(--t-text)' }}>
            {/* Header */}
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', background: 'var(--t-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Strategic Domain Segregation
                </h1>
                <p style={{ color: 'var(--t-text-muted)', fontSize: '0.9rem' }}>
                    Configure core business rules and segregation logic for the Mobility OS.
                </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Basic Configuration */}
                <section style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.75rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t-accent)', display: 'inline-block', boxShadow: '0 0 8px var(--t-accent)' }} />
                        Basic Configuration
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        <Select label="Domain Type" value={domainType} onChange={setDomainType} options={DOMAIN_OPTIONS} />
                        <Select label="Service Sub-Type" value={subType} onChange={setSubType} options={SUB_TYPE_OPTIONS} />
                        <Select label="Global Priority" value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
                    </div>

                    {/* Domain indicator pill */}
                    <div style={{ marginTop: '1.25rem' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '0.3rem 0.875rem', borderRadius: 999,
                            background: isEmergency ? 'var(--t-red-soft)' : 'var(--t-accent-soft)',
                            border: `1px solid ${isEmergency ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
                            fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                            color: isEmergency ? 'var(--t-red)' : 'var(--t-accent)',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isEmergency ? 'var(--t-red)' : 'var(--t-accent)' }} />
                            {isEmergency ? '🚨 Emergency Mode — strict SLA enforced' : '🚘 Transport Mode — standard rules apply'}
                        </span>
                    </div>
                </section>

                {/* Advanced Governance Rules */}
                <section style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.75rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t-cyan)', display: 'inline-block', boxShadow: '0 0 8px var(--t-cyan)' }} />
                        Advanced Governance Rules
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.75rem' }}>
                        <RuleToggle label="Approval Workflow Required" defaultChecked={false} />
                        <RuleToggle label="EPOD Required" defaultChecked={true} />
                        <RuleToggle label="Auto Dispatch" defaultChecked={true} />
                        <RuleToggle label="Auto Trip Creation" defaultChecked={true} />
                        <RuleToggle label="Auto Trip Merging" defaultChecked={false} />
                        <RuleToggle label="Strict SLA Enforcement" defaultChecked={isEmergency} />
                        <RuleToggle label="Crew Readiness Check" defaultChecked={isEmergency} />
                        <RuleToggle label="Priority Pre-emption" defaultChecked={isEmergency} />
                        <RuleToggle label="Fleet Quota Locking" defaultChecked={false} />
                    </div>
                </section>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button className="btn-ghost" style={{ padding: '0.7rem 1.5rem' }}>Cancel</button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '0.7rem 1.75rem', borderRadius: 12, border: 'none', cursor: 'pointer',
                            background: saved ? 'var(--t-green)' : 'var(--t-accent)',
                            color: saved ? '#fff' : 'var(--t-accent-contrast)',
                            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            boxShadow: `0 4px 15px ${saved ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        }}
                    >
                        {saved ? '✓ Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
