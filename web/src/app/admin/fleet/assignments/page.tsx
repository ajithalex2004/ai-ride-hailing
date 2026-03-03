'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

/* ── theme shortcuts ─────────────────────────────────────── */
const card = { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16 } as React.CSSProperties;
const mono = { fontFamily: 'var(--font-mono)' } as React.CSSProperties;
const hdg = { fontFamily: 'var(--font-heading)', fontWeight: 900 } as React.CSSProperties;
const lbl = { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.09em', color: 'var(--t-text-dim)' };
const chip = (c: string) => ({ padding: '0.18rem 0.55rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: `${c}18`, color: c, border: `1px solid ${c}44` });
const muted = '#8899AB';

/* ── date helpers ────────────────────────────────────────── */
const fmt = (d: Date) => d.toISOString().slice(0, 10);           // "YYYY-MM-DD"
const label = (k: string) => { const d = new Date(k + 'T00:00:00'); return d.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' }); };
const addDays = (base: Date, n: number) => { const d = new Date(base); d.setDate(d.getDate() + n); return d; };

/* current week: Mon 3 Mar – Sun 9 Mar 2026 */
const WEEK_START = new Date('2026-03-03T00:00:00');
const WEEK_KEYS = Array.from({ length: 7 }, (_, i) => fmt(addDays(WEEK_START, i)));
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* March 2026 full month */
const MONTH_START = new Date('2026-03-01T00:00:00');
const MONTH_KEYS = Array.from({ length: 31 }, (_, i) => fmt(addDays(MONTH_START, i)));

/* ── data ────────────────────────────────────────────────── */
const DRIVERS = [
    { id: 'D1', name: 'Mohammed Al-Rashid', init: 'MR', color: 'var(--t-accent)' },
    { id: 'D2', name: 'Ahmed Al-Sayed', init: 'AA', color: 'var(--t-cyan)' },
    { id: 'D3', name: 'Sara Al-Hamer', init: 'SH', color: 'var(--t-purple)' },
    { id: 'D4', name: 'Khalid Ibrahim', init: 'KI', color: 'var(--t-green)' },
    { id: 'D5', name: 'Zayed Al-Marri', init: 'ZM', color: 'var(--t-orange)' },
    { id: 'D6', name: 'Noura Al-Zaabi', init: 'NZ', color: 'var(--t-red)' },
];
const VEHICLES = [
    { id: 'VEH-001', label: 'Toyota HiAce', plate: 'DXB-A-11442', type: 'Van', status: 'Active' },
    { id: 'VEH-002', label: 'Mercedes Sprinter', plate: 'DXB-B-88812', type: 'Heavy Van', status: 'In Shop' },
    { id: 'VEH-003', label: 'Ford Transit', plate: 'AUH-C-10234', type: 'Cargo', status: 'Active' },
    { id: 'VEH-004', label: 'Toyota Camry', plate: 'DXB-D-55617', type: 'Sedan', status: 'Active' },
    { id: 'VEH-005', label: 'BMW X5', plate: 'DXB-E-22001', type: 'SUV', status: 'Active' },
    { id: 'VEH-007', label: 'Toyota Coaster', plate: 'DXB-G-33412', type: 'Minibus', status: 'Active' },
    { id: 'VEH-009', label: 'Tesla Model Y', plate: 'DXB-I-99001', type: 'Sedan', status: 'Active' },
    { id: 'VEH-010', label: 'Lexus LX 600', plate: 'DXB-J-15523', type: 'SUV', status: 'Active' },
];

/* Seed: { vehicleId -> { dateKey -> driverId } } */
function buildInitial(): Record<string, Record<string, string>> {
    const seed: Record<string, Record<number, string>> = {
        'VEH-001': { 0: 'D1', 1: 'D1', 2: 'D2', 3: 'D1', 4: 'D1' },
        'VEH-003': { 0: 'D3', 1: 'D4', 2: 'D4', 3: 'D4', 4: 'D5', 5: 'D5' },
        'VEH-004': { 0: 'D2', 1: 'D2', 2: 'D2', 3: 'D2', 4: 'D2', 5: 'D2', 6: 'D6' },
        'VEH-005': { 0: 'D6', 1: 'D6', 2: 'D6', 3: 'D1', 4: 'D1' },
        'VEH-007': { 0: 'D5', 1: 'D5', 2: 'D5', 3: 'D5', 4: 'D5' },
        'VEH-009': { 0: 'D3', 1: 'D3', 2: 'D3', 3: 'D3', 4: 'D3', 5: 'D3', 6: 'D3' },
        'VEH-010': { 0: 'D4', 1: 'D4', 2: 'D6', 3: 'D6', 4: 'D4' },
    };
    const out: Record<string, Record<string, string>> = {};
    for (const [vid, days] of Object.entries(seed)) {
        out[vid] = {};
        for (const [idx, did] of Object.entries(days)) out[vid][WEEK_KEYS[+idx]] = did;
    }
    return out;
}
const INITIAL = buildInitial();

/* ── sub-components ─────────────────────────────────────── */
function Av({ d, size = 22 }: { d: typeof DRIVERS[0]; size?: number }) {
    return <span title={d.name} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, borderRadius: '50%', background: `${d.color}22`, border: `1.5px solid ${d.color}55`, ...mono, fontSize: size * .36, fontWeight: 800, color: d.color, flexShrink: 0, cursor: 'default' }}>{d.init}</span>;
}

function Pill({ driver, onClick }: { driver: typeof DRIVERS[0]; onClick: () => void }) {
    return <button onClick={onClick} title={`${driver.name} — click to change`} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 5px', borderRadius: 99, background: `${driver.color}18`, border: `1px solid ${driver.color}44`, cursor: 'pointer', width: '100%', overflow: 'hidden' }}>
        <Av d={driver} size={15} /><span style={{ fontSize: '0.58rem', fontWeight: 600, color: driver.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{driver.name.split(' ')[0]}</span>
    </button>;
}

/* ── CellAssignModal (click cell → change one date) ─────── */
function CellModal({ vehicleId, dateKey, current, driverMap, onSave, onClose }:
    { vehicleId: string; dateKey: string; current?: string; driverMap: Record<string, typeof DRIVERS[0]>; onSave: (id: string | null) => void; onClose: () => void }) {
    const [sel, setSel] = useState<string | null>(current ?? null);
    const v = VEHICLES.find(v => v.id === vehicleId)!;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...card, padding: '1.75rem', width: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div><h2 style={{ ...hdg, fontSize: '1rem', marginBottom: 3 }}>Assign Operator</h2>
                        <p style={lbl}>{v.label} · {label(dateKey)}</p></div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: muted, fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.25rem' }}>
                    <button onClick={() => setSel(null)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.875rem', borderRadius: 10, border: `1px solid ${sel === null ? 'var(--t-accent)' : 'var(--t-border)'}`, background: sel === null ? 'var(--t-surface)' : 'transparent', cursor: 'pointer' }}>
                        <span style={{ width: 26, height: 26, borderRadius: '50%', border: '1px dashed var(--t-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>✕</span>
                        <span style={{ fontSize: '0.82rem', color: sel === null ? 'var(--t-text)' : muted, fontWeight: sel === null ? 700 : 400 }}>Unassigned</span>
                        {sel === null && <span style={{ marginLeft: 'auto', ...chip('var(--t-accent)') }}>Selected</span>}
                    </button>
                    {DRIVERS.map(d => (
                        <button key={d.id} onClick={() => setSel(d.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.875rem', borderRadius: 10, border: `1px solid ${sel === d.id ? d.color + '55' : 'var(--t-border)'}`, background: sel === d.id ? `${d.color}12` : 'transparent', cursor: 'pointer' }}>
                            <Av d={d} size={26} /><span style={{ fontSize: '0.84rem', fontWeight: sel === d.id ? 700 : 400, color: sel === d.id ? d.color : 'var(--t-text)' }}>{d.name}</span>
                            {sel === d.id && <span style={{ marginLeft: 'auto', ...chip(d.color) }}>✓</span>}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: muted, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => { onSave(sel); onClose(); }} style={{ flex: 2, padding: '0.6rem', borderRadius: 10, border: 'none', background: 'var(--t-accent)', color: '#000', ...hdg, fontSize: '0.85rem', cursor: 'pointer' }}>Save →</button>
                </div>
            </div>
        </div>
    );
}

/* ── AddAssignmentModal (3-step + scope: week | month) ───── */
function AddModal({ onSave, onClose }: { onSave: (vid: string, did: string, dates: string[]) => void; onClose: () => void }) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [scope, setScope] = useState<'week' | 'month'>('week');
    const [selV, setSelV] = useState<string | null>(null);
    const [selD, setSelD] = useState<string | null>(null);
    /* week mode: toggle individual days */
    const [selDays, setSelDays] = useState<string[]>([]);
    /* month mode: date-range */
    const [rangeStart, setRangeStart] = useState('2026-03-01');
    const [rangeEnd, setRangeEnd] = useState('2026-03-31');

    const toggleDay = (k: string) => setSelDays(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);

    const computedDates = useMemo(() => {
        if (scope === 'week') return selDays;
        if (!rangeStart || !rangeEnd) return [];
        const s = new Date(rangeStart + 'T00:00:00'), e = new Date(rangeEnd + 'T00:00:00');
        if (s > e) return [];
        const out: string[] = [];
        for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) out.push(fmt(new Date(d)));
        return out;
    }, [scope, selDays, rangeStart, rangeEnd]);

    const canNext = (step === 1 && selV) || (step === 2 && selD) || step === 3;
    const canSave = selV && selD && computedDates.length > 0;

    const STEPS = ['Select Vehicle', 'Select Operator', 'Choose Dates'];

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...card, padding: '1.75rem', width: '100%', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.55)', maxHeight: '90vh', overflowY: 'auto' }}>
                {/* header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div><h2 style={{ ...hdg, fontSize: '1.1rem', marginBottom: 4 }}>New Assignment</h2>
                        <p style={lbl}>Step {step} of 3 · {STEPS[step - 1]}</p></div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: muted, fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                </div>
                {/* progress */}
                <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem' }}>
                    {[1, 2, 3].map(n => <div key={n} style={{ flex: 1, height: 3, borderRadius: 99, background: n <= step ? 'var(--t-accent)' : 'var(--t-border)', transition: 'background 0.3s' }} />)}
                </div>

                {/* Step 1 – vehicle */}
                {step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 340, overflowY: 'auto' }}>
                    {VEHICLES.map(v => (
                        <button key={v.id} onClick={() => setSelV(v.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.65rem 0.875rem', borderRadius: 12, border: `1px solid ${selV === v.id ? 'var(--t-accent)' : 'var(--t-border)'}`, background: selV === v.id ? 'var(--t-accent-soft)' : 'var(--t-surface)', cursor: 'pointer', textAlign: 'left' as const }}>
                            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>🚗</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: selV === v.id ? 'var(--t-accent)' : 'var(--t-text)' }}>{v.label}</p>
                                <p style={{ ...mono, fontSize: '0.68rem', color: muted, marginTop: 2 }}>{v.plate} · {v.type}</p>
                            </div>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.status === 'Active' ? 'var(--t-green)' : v.status === 'In Shop' ? 'var(--t-orange)' : 'var(--t-text-dim)', flexShrink: 0 }} />
                            {selV === v.id && <span style={{ color: 'var(--t-accent)' }}>✓</span>}
                        </button>
                    ))}
                </div>}

                {/* Step 2 – driver */}
                {step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {DRIVERS.map(d => (
                        <button key={d.id} onClick={() => setSelD(d.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.65rem 0.875rem', borderRadius: 12, border: `1px solid ${selD === d.id ? d.color + '66' : 'var(--t-border)'}`, background: selD === d.id ? `${d.color}14` : 'var(--t-surface)', cursor: 'pointer', textAlign: 'left' as const }}>
                            <Av d={d} size={32} /><span style={{ flex: 1, fontSize: '0.85rem', fontWeight: selD === d.id ? 700 : 400, color: selD === d.id ? d.color : 'var(--t-text)' }}>{d.name}</span>
                            {selD === d.id && <span style={{ color: d.color }}>✓</span>}
                        </button>
                    ))}
                </div>}

                {/* Step 3 – dates */}
                {step === 3 && <div>
                    {/* Scope toggle */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', background: 'var(--t-surface)', padding: 4, borderRadius: 10, border: '1px solid var(--t-border)' }}>
                        {(['week', 'month'] as const).map(s => (
                            <button key={s} onClick={() => setScope(s)} style={{ flex: 1, padding: '0.5rem', borderRadius: 8, border: 'none', background: scope === s ? 'var(--t-accent)' : 'transparent', color: scope === s ? '#000' : muted, ...hdg, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                                {s === 'week' ? '📅 Weekly' : '🗓️ Monthly'}
                            </button>
                        ))}
                    </div>

                    {scope === 'week' && (
                        <div>
                            <p style={{ ...lbl, marginBottom: 10 }}>Toggle days (week of 3–9 Mar 2026)</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5, marginBottom: 14 }}>
                                {WEEK_KEYS.map((k, i) => {
                                    const on = selDays.includes(k);
                                    return <button key={k} onClick={() => toggleDay(k)} style={{ padding: '0.55rem 0', borderRadius: 10, border: `1.5px solid ${on ? 'var(--t-accent)' : 'var(--t-border)'}`, background: on ? 'var(--t-accent-soft)' : 'var(--t-surface)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                        <span style={{ ...lbl, color: on ? 'var(--t-accent)' : 'var(--t-text-dim)', fontSize: '0.58rem' }}>{WEEK_DAYS[i]}</span>
                                        <span style={{ ...mono, fontWeight: 800, fontSize: '0.72rem', color: on ? 'var(--t-accent)' : 'var(--t-text)' }}>{i + 3}</span>
                                        {on && <span style={{ fontSize: '0.55rem' }}>✓</span>}
                                    </button>;
                                })}
                            </div>
                        </div>
                    )}

                    {scope === 'month' && (
                        <div>
                            <p style={{ ...lbl, marginBottom: 10 }}>Date range (March 2026)</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                                {[['From', 'rangeStart', rangeStart, setRangeStart], ['To', 'rangeEnd', rangeEnd, setRangeEnd]].map(([label, _, val, setter]) => (
                                    <div key={label as string}>
                                        <p style={{ ...lbl, marginBottom: 5, fontSize: '0.58rem' }}>{label as string}</p>
                                        <input type="date" value={val as string} min="2026-03-01" max="2026-03-31"
                                            onChange={e => (setter as any)(e.target.value)}
                                            style={{ width: '100%', padding: '0.5rem 0.6rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', ...mono, fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' as const }} />
                                    </div>
                                ))}
                            </div>
                            {/* mini month preview */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 12 }}>
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} style={{ ...lbl, textAlign: 'center' as const, fontSize: '0.55rem', paddingBottom: 3 }}>{d}</div>)}
                                {/* offset for Mar 2026 starting Sunday → shift 6 */}
                                {Array.from({ length: 6 }).map((_, i) => <div key={'e' + i} />)}
                                {MONTH_KEYS.map(k => {
                                    const inRange = rangeStart && rangeEnd && k >= rangeStart && k <= rangeEnd;
                                    const day = new Date(k + 'T00:00:00').getDate();
                                    return <div key={k} style={{ textAlign: 'center' as const, padding: '3px 0', borderRadius: 6, background: inRange ? 'var(--t-accent-soft)' : 'transparent', border: inRange ? '1px solid var(--t-accent)44' : '1px solid transparent', ...mono, fontSize: '0.65rem', fontWeight: inRange ? 700 : 400, color: inRange ? 'var(--t-accent)' : muted }}>{day}</div>;
                                })}
                            </div>
                            <p style={{ ...lbl, color: 'var(--t-accent)', fontSize: '0.62rem' }}>✓ {computedDates.length} day{computedDates.length !== 1 ? 's' : ''} selected</p>
                        </div>
                    )}

                    {/* summary */}
                    {selV && selD && <div style={{ marginTop: 12, padding: '0.75rem', background: 'var(--t-surface)', borderRadius: 10, border: '1px solid var(--t-border)' }}>
                        <p style={{ ...lbl, marginBottom: 6 }}>Summary</p>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>🚗 {VEHICLES.find(v => v.id === selV)?.label}</p>
                        <p style={{ fontSize: '0.82rem', marginTop: 4 }}>👤 {DRIVERS.find(d => d.id === selD)?.name}</p>
                        <p style={{ ...mono, fontSize: '0.72rem', color: 'var(--t-accent)', marginTop: 4 }}>
                            📅 {computedDates.length === 0 ? 'No dates selected' :
                                scope === 'week' ? computedDates.map(k => label(k)).join(', ') :
                                    `${label(computedDates[0])} → ${label(computedDates[computedDates.length - 1])} (${computedDates.length} days)`}
                        </p>
                    </div>}
                </div>}

                {/* footer */}
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
                    {step > 1 && <button onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: muted, cursor: 'pointer' }}>← Back</button>}
                    <button onClick={() => step < 3 ? setStep(s => (s + 1) as 1 | 2 | 3) : (canSave && (onSave(selV!, selD!, computedDates), onClose()))} disabled={!canNext}
                        style={{ flex: 2, padding: '0.6rem', borderRadius: 10, border: 'none', background: canNext ? 'var(--t-accent)' : 'var(--t-border)', color: canNext ? '#000' : 'var(--t-text-dim)', ...hdg, fontSize: '0.85rem', cursor: canNext ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
                        {step < 3 ? 'Next →' : canSave ? `Save ${computedDates.length} day${computedDates.length !== 1 ? 's' : ''} ✓` : 'Select dates to save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── pct helpers ─────────────────────────────────────────── */
const weekPct = (vid: string, a: Record<string, Record<string, string>>) => Math.round((WEEK_KEYS.filter(k => a[vid]?.[k]).length / 7) * 100);
const monthPct = (vid: string, a: Record<string, Record<string, string>>) => Math.round((MONTH_KEYS.filter(k => a[vid]?.[k]).length / 31) * 100);

/* ── Main Page ───────────────────────────────────────────── */
export default function VehicleAssignmentsPage() {
    const [asn, setAsn] = useState<Record<string, Record<string, string>>>(INITIAL);
    const [view, setView] = useState<'week' | 'month' | 'list'>('week');
    const [showAdd, setShowAdd] = useState(false);
    const [cellModal, setCellModal] = useState<{ vid: string; dk: string } | null>(null);
    const [filter, setFilter] = useState('');

    const dMap = Object.fromEntries(DRIVERS.map(d => [d.id, d]));

    const saveCell = (vid: string, dk: string, did: string | null) => setAsn(prev => {
        const n = { ...prev, [vid]: { ...prev[vid] ?? {} } };
        if (did === null) delete n[vid][dk]; else n[vid][dk] = did;
        return n;
    });

    const saveMulti = (vid: string, did: string, dates: string[]) => setAsn(prev => {
        const n = { ...prev, [vid]: { ...prev[vid] ?? {} } };
        dates.forEach(k => { n[vid][k] = did; });
        return n;
    });

    const vehicles = VEHICLES.filter(v => !filter || v.label.toLowerCase().includes(filter.toLowerCase()) || v.plate.toLowerCase().includes(filter.toLowerCase()));
    const utilData = VEHICLES.map(v => ({ v, pct: weekPct(v.id, asn) })).sort((a, b) => b.pct - a.pct);

    /* ── KPI values ── */
    const totalAssignedWeek = VEHICLES.filter(v => weekPct(v.id, asn) > 0).length;
    const avgWeek = Math.round(VEHICLES.reduce((s, v) => s + weekPct(v.id, asn), 0) / VEHICLES.length);
    const totalAssignedMonth = VEHICLES.filter(v => monthPct(v.id, asn) > 0).length;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '1.75rem' }}>
            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Link href="/admin/fleet" style={{ ...lbl, color: muted, textDecoration: 'none' }}>Fleet</Link>
                        <span style={{ color: 'var(--t-border)' }}>/</span>
                        <span style={{ ...lbl, color: 'var(--t-accent)' }}>Vehicle Assignments</span>
                    </div>
                    <h1 style={{ ...hdg, fontSize: '1.9rem', marginBottom: '0.2rem' }}>Vehicle Assignments</h1>
                    <p style={{ color: muted, fontSize: '0.82rem' }}>Assign operators to vehicles — weekly or monthly</p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {(['week', 'month', 'list'] as const).map(m => (
                        <button key={m} onClick={() => setView(m)} style={{ padding: '0.5rem 0.875rem', borderRadius: 9, border: `1px solid ${view === m ? 'var(--t-accent)' : 'var(--t-border)'}`, background: view === m ? 'var(--t-accent-soft)' : 'var(--t-surface)', color: view === m ? 'var(--t-accent)' : muted, fontSize: '0.78rem', fontWeight: view === m ? 700 : 400, cursor: 'pointer' }}>
                            {m === 'week' ? '📅 Week' : m === 'month' ? '🗓️ Month' : '📋 List'}
                        </button>
                    ))}
                    <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 9, border: 'none', background: 'var(--t-accent)', color: '#000', ...hdg, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.2)' }}>
                        + Add Assignment
                    </button>
                </div>
            </div>

            {/* KPI strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                    { label: 'Total Vehicles', val: VEHICLES.length, color: 'var(--t-text)', icon: '🚗' },
                    { label: 'Assigned This Week', val: totalAssignedWeek, color: 'var(--t-green)', icon: '✅' },
                    { label: 'Assigned This Month', val: totalAssignedMonth, color: 'var(--t-cyan)', icon: '🗓️' },
                    { label: 'Weekly Utilisation', val: avgWeek + '%', color: 'var(--t-accent)', icon: '📊' },
                ].map(k => (
                    <div key={k.label} style={{ ...card, padding: '1rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: 6 }}>{k.icon}</p>
                        <p style={{ ...hdg, fontSize: '1.5rem', color: k.color }}>{k.val}</p>
                        <p style={lbl}>{k.label}</p>
                    </div>
                ))}
            </div>

            {/* main grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 210px', gap: '1.25rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* filter */}
                    <div style={{ ...card, padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="🔍  Filter by vehicle or plate…"
                            style={{ flex: 1, padding: '0.45rem 0.75rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', ...mono, fontSize: '0.82rem', outline: 'none' }} />
                        <div style={{ display: 'flex', gap: 6 }}>{DRIVERS.map(d => <Av key={d.id} d={d} size={22} />)}</div>
                    </div>

                    {/* ── Week calendar ── */}
                    {view === 'week' && (
                        <div style={{ ...card, overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '175px repeat(7,1fr)', background: 'var(--t-surface)', borderBottom: '1px solid var(--t-border)' }}>
                                <div style={{ padding: '0.6rem 1rem', ...lbl }}>Vehicle</div>
                                {WEEK_KEYS.map((k, i) => (
                                    <div key={k} style={{ padding: '0.6rem 0.4rem', textAlign: 'center' as const, borderLeft: '1px solid var(--t-border)' }}>
                                        <p style={{ ...lbl, color: muted }}>{WEEK_DAYS[i]}</p>
                                        <p style={{ ...mono, fontSize: '0.75rem', fontWeight: 700, marginTop: 2 }}>{i + 3}</p>
                                    </div>
                                ))}
                            </div>
                            {vehicles.map(v => {
                                const pct = weekPct(v.id, asn);
                                const sc = v.status === 'Active' ? 'var(--t-green)' : v.status === 'In Shop' ? 'var(--t-orange)' : 'var(--t-text-dim)';
                                return (
                                    <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '175px repeat(7,1fr)', borderBottom: '1px solid #1e2d3e' }}
                                        onMouseEnter={e => (e.currentTarget as any).style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                                        <div style={{ padding: '0.7rem 1rem', display: 'flex', flexDirection: 'column', gap: 3, borderRight: '1px solid var(--t-border)', justifyContent: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc, flexShrink: 0 }} />
                                                <span style={{ fontWeight: 700, fontSize: '0.76rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{v.label}</span>
                                            </div>
                                            <span style={{ ...lbl, fontSize: '0.56rem', color: 'var(--t-accent)', marginLeft: 12 }}>{v.plate}</span>
                                            <div style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <div style={{ flex: 1, height: 3, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 80 ? 'var(--t-green)' : pct > 40 ? 'var(--t-accent)' : 'var(--t-orange)', borderRadius: 99 }} />
                                                </div>
                                                <span style={{ ...mono, fontSize: '0.52rem', color: muted }}>{pct}%</span>
                                            </div>
                                        </div>
                                        {WEEK_KEYS.map(k => {
                                            const did = asn[v.id]?.[k];
                                            const drv = did ? dMap[did] : null;
                                            const locked = v.status === 'In Shop' && k <= '2026-03-05';
                                            return (
                                                <div key={k} onClick={() => !locked && setCellModal({ vid: v.id, dk: k })}
                                                    style={{ padding: '0.35rem 0.25rem', borderLeft: '1px solid #1e2d3e', minHeight: 52, cursor: locked ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    onMouseEnter={e => { if (!locked) (e.currentTarget as any).style.background = 'rgba(245,158,11,0.05)' }}
                                                    onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                                                    {locked ? <span style={{ ...lbl, fontSize: '0.5rem', color: 'var(--t-orange)' }}>Shop</span>
                                                        : drv ? <Pill driver={drv} onClick={() => setCellModal({ vid: v.id, dk: k })} />
                                                            : <span style={{ color: 'var(--t-border)', fontSize: '0.9rem', opacity: 0.4 }}>＋</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Month calendar ── */}
                    {view === 'month' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {vehicles.map(v => {
                                const pct = monthPct(v.id, asn);
                                /* build 5-week grid: Mar 2026 starts on Sunday → offset 6 Mon-based */
                                const offset = 6;
                                return (
                                    <div key={v.id} style={{ ...card, padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>{v.label}</p>
                                                <p style={{ ...mono, fontSize: '0.68rem', color: 'var(--t-accent)', marginTop: 1 }}>{v.plate}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 80, height: 5, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 80 ? 'var(--t-green)' : pct > 40 ? 'var(--t-accent)' : 'var(--t-orange)', borderRadius: 99 }} />
                                                </div>
                                                <span style={{ ...mono, fontSize: '0.7rem', color: 'var(--t-accent)', fontWeight: 700 }}>{pct}%</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
                                            {WEEK_DAYS.map(d => <div key={d} style={{ ...lbl, textAlign: 'center' as const, fontSize: '0.5rem', paddingBottom: 3 }}>{d}</div>)}
                                            {Array.from({ length: offset }).map((_, i) => <div key={'e' + i} />)}
                                            {MONTH_KEYS.map(k => {
                                                const did = asn[v.id]?.[k];
                                                const drv = did ? dMap[did] : null;
                                                const day = new Date(k + 'T00:00:00').getDate();
                                                return (
                                                    <div key={k} onClick={() => setCellModal({ vid: v.id, dk: k })}
                                                        style={{ position: 'relative', borderRadius: 6, border: `1px solid ${drv ? drv.color + '44' : 'var(--t-border)'}`, background: drv ? `${drv.color}12` : 'var(--t-surface)', padding: '3px 2px', minHeight: 34, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transition: 'all 0.1s' }}
                                                        onMouseEnter={e => (e.currentTarget as any).style.borderColor = 'var(--t-accent)44'}
                                                        onMouseLeave={e => (e.currentTarget as any).style.borderColor = drv ? drv.color + '44' : 'var(--t-border)'}>
                                                        <span style={{ ...mono, fontSize: '0.6rem', fontWeight: 700, color: drv ? drv.color : muted }}>{day}</span>
                                                        {drv && <Av d={drv} size={14} />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── List view ── */}
                    {view === 'list' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {vehicles.map(v => {
                                const entries = Object.entries(asn[v.id] ?? {}).sort(([a], [b]) => a.localeCompare(b));
                                return (
                                    <div key={v.id} style={{ ...card, padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>{v.label}</p>
                                                <p style={{ ...mono, fontSize: '0.7rem', color: 'var(--t-accent)', marginTop: 2 }}>{v.plate}</p>
                                            </div>
                                            <span style={{ ...chip(v.status === 'Active' ? 'var(--t-green)' : v.status === 'In Shop' ? 'var(--t-orange)' : 'var(--t-text-dim)') }}>{v.status}</span>
                                        </div>
                                        {entries.length === 0 ? <span style={{ ...lbl, color: 'var(--t-red)' }}>No assignments</span> : (
                                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                                {entries.map(([dk, did]) => {
                                                    const d = dMap[did]; if (!d) return null;
                                                    return <button key={dk} onClick={() => setCellModal({ vid: v.id, dk })}
                                                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.25rem 0.55rem', borderRadius: 99, border: `1px solid ${d.color}44`, background: `${d.color}12`, cursor: 'pointer' }}>
                                                        <Av d={d} size={14} />
                                                        <span style={{ ...mono, fontSize: '0.62rem', color: d.color, fontWeight: 700 }}>{new Date(dk + 'T00:00:00').getDate()}</span>
                                                    </button>;
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* right panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* util chart */}
                    <div style={{ ...card, padding: '1rem' }}>
                        <p style={{ ...hdg, fontSize: '0.82rem', marginBottom: 3 }}>Weekly Utilisation</p>
                        <p style={{ ...lbl, fontSize: '0.56rem', color: muted, marginBottom: 12 }}>Mar 3–9</p>
                        <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            {utilData.map(({ v, pct }) => (
                                <div key={v.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                    <div style={{ width: 16, height: 70, background: 'var(--t-surface)', borderRadius: 5, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <div style={{ width: '100%', height: `${pct}%`, background: pct >= 80 ? 'var(--t-green)' : pct >= 50 ? 'var(--t-accent)' : pct > 0 ? 'var(--t-orange)' : 'var(--t-border)', borderRadius: 5, transition: 'height 0.6s' }} />
                                    </div>
                                    <span style={{ ...mono, fontSize: '0.48rem', color: muted }}>{pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* operators */}
                    <div style={{ ...card, padding: '1rem' }}>
                        <p style={{ ...hdg, fontSize: '0.82rem', marginBottom: 10 }}>Operators</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                            {DRIVERS.map(d => {
                                let cnt = 0; Object.values(asn).forEach(days => Object.values(days).forEach(id => { if (id === d.id) cnt++; }));
                                return (
                                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.55rem', background: 'var(--t-surface)', borderRadius: 9 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Av d={d} size={22} /><span style={{ fontSize: '0.73rem', fontWeight: 600 }}>{d.name.split(' ')[0]}</span></div>
                                        <span style={{ ...mono, fontSize: '0.66rem', color: d.color, fontWeight: 800 }}>{cnt}d</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* guide */}
                    <div style={{ ...card, padding: '1rem', background: 'var(--t-accent-soft)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <p style={{ ...hdg, fontSize: '0.78rem', color: 'var(--t-accent)', marginBottom: 8 }}>⚡ Quick Guide</p>
                        <ul style={{ paddingLeft: 14, fontSize: '0.72rem', color: muted, lineHeight: 1.8, margin: 0 }}>
                            <li>📅 <b>Week</b> view — click cell to assign</li>
                            <li>🗓️ <b>Month</b> view — click any day to assign</li>
                            <li><b>+ Add</b> — bulk assign via date range</li>
                            <li>Click pill to change/unassign</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* modals */}
            {showAdd && <AddModal onSave={saveMulti} onClose={() => setShowAdd(false)} />}
            {cellModal && (
                <CellModal vehicleId={cellModal.vid} dateKey={cellModal.dk}
                    current={asn[cellModal.vid]?.[cellModal.dk]}
                    driverMap={dMap}
                    onSave={did => saveCell(cellModal.vid, cellModal.dk, did)}
                    onClose={() => setCellModal(null)} />
            )}
        </div>
    );
}
