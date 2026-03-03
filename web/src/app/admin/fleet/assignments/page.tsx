'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ─── theme tokens ──────────────────────────────────────── */
const S = {
    page: { minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '1.75rem' } as React.CSSProperties,
    card: { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16 } as React.CSSProperties,
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '-0.02em' } as React.CSSProperties,
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 800 } as React.CSSProperties,
    label: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.09em', color: 'var(--t-text-dim)' },
    mono: { fontFamily: 'var(--font-mono)' } as React.CSSProperties,
    muted: { color: 'var(--t-text-muted)', fontSize: '0.82rem' } as React.CSSProperties,
    chip: (color: string) => ({ padding: '0.18rem 0.55rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: `${color}18`, color, border: `1px solid ${color}44` }),
};

/* ─── constants ─────────────────────────────────────────── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DATES = [3, 4, 5, 6, 7, 8, 9]; // week of 3–9 Mar 2026

// drivers with avatar initials & colour
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

// Pre-seeded assignments: { vehicleId -> { dayIndex -> driverId } }
const INITIAL_ASSIGNMENTS: Record<string, Record<number, string>> = {
    'VEH-001': { 0: 'D1', 1: 'D1', 2: 'D2', 3: 'D1', 4: 'D1' },
    'VEH-003': { 0: 'D3', 1: 'D4', 2: 'D4', 3: 'D4', 4: 'D5', 5: 'D5' },
    'VEH-004': { 0: 'D2', 1: 'D2', 2: 'D2', 3: 'D2', 4: 'D2', 5: 'D2', 6: 'D6' },
    'VEH-005': { 0: 'D6', 1: 'D6', 2: 'D6', 3: 'D1', 4: 'D1' },
    'VEH-007': { 0: 'D5', 1: 'D5', 2: 'D5', 3: 'D5', 4: 'D5' },
    'VEH-009': { 0: 'D3', 1: 'D3', 2: 'D3', 3: 'D3', 4: 'D3', 5: 'D3', 6: 'D3' },
    'VEH-010': { 0: 'D4', 1: 'D4', 2: 'D6', 3: 'D6', 4: 'D4' },
};

/* % assigned stat per vehicle */
function pctAssigned(vehicleId: string, assignments: Record<string, Record<number, string>>) {
    const days = assignments[vehicleId] ?? {};
    return Math.round((Object.keys(days).length / 7) * 100);
}

/* Bar chart for utilisation */
function UtilBar({ pct, color }: { pct: number; color: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 18, height: 80, background: 'var(--t-surface)', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${pct}%`, background: color, borderRadius: 6, transition: 'height 0.6s ease' }} />
            </div>
            <span style={{ ...S.mono, fontSize: '0.55rem', color: 'var(--t-text-dim)' }}>{pct}%</span>
        </div>
    );
}

/* Driver avatar pill */
function Avatar({ driver, size = 22 }: { driver: typeof DRIVERS[0]; size?: number }) {
    return (
        <span title={driver.name} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, borderRadius: '50%', background: `${driver.color}22`, border: `1.5px solid ${driver.color}55`, fontFamily: 'var(--font-mono)', fontSize: size * 0.35, fontWeight: 800, color: driver.color, flexShrink: 0, cursor: 'default' }}>
            {driver.init}
        </span>
    );
}

/* Assignment pill in calendar cell */
function AssignPill({ driver, onClick }: { driver: typeof DRIVERS[0]; onClick: () => void }) {
    return (
        <button onClick={onClick}
            title={`${driver.name} — click to unassign`}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', borderRadius: 99, background: `${driver.color}18`, border: `1px solid ${driver.color}44`, cursor: 'pointer', width: '100%', overflow: 'hidden' }}>
            <Avatar driver={driver} size={16} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 600, color: driver.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                {driver.name.split(' ')[0]}
            </span>
        </button>
    );
}

/* ─── Add Assignment Modal ──────────────────────────────── */
function AssignModal({ vehicleId, dayIndex, current, onSave, onClose }:
    { vehicleId: string; dayIndex: number; current?: string; onSave: (driverId: string | null) => void; onClose: () => void }) {
    const [selected, setSelected] = useState<string | null>(current ?? null);
    const v = VEHICLES.find(v => v.id === vehicleId)!;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...S.card, padding: '1.75rem', width: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ ...S.h2, fontSize: '1rem', marginBottom: 3 }}>Assign Operator</h2>
                        <p style={{ ...S.label }}>{v.label} · {DAYS[dayIndex]}, {DATES[dayIndex]} Mar 2026</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t-text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.25rem' }}>
                    {/* Unassign option */}
                    <button onClick={() => setSelected(null)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0.875rem', borderRadius: 10, border: `1px solid ${selected === null ? 'var(--t-border)' : 'var(--t-border)'}`, background: selected === null ? 'var(--t-surface)' : 'transparent', cursor: 'pointer', transition: 'all 0.12s' }}>
                        <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--t-surface)', border: '1px dashed var(--t-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>✕</span>
                        <span style={{ fontSize: '0.82rem', color: selected === null ? 'var(--t-text)' : 'var(--t-text-muted)', fontWeight: selected === null ? 700 : 400 }}>No assignment / Unassigned</span>
                        {selected === null && <span style={{ marginLeft: 'auto', ...S.chip('var(--t-accent)') }}>Selected</span>}
                    </button>

                    {DRIVERS.map(d => (
                        <button key={d.id} onClick={() => setSelected(d.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0.875rem', borderRadius: 10, border: `1px solid ${selected === d.id ? d.color + '55' : 'var(--t-border)'}`, background: selected === d.id ? `${d.color}12` : 'transparent', cursor: 'pointer', transition: 'all 0.12s' }}>
                            <Avatar driver={d} size={28} />
                            <span style={{ fontSize: '0.85rem', fontWeight: selected === d.id ? 700 : 400, color: selected === d.id ? d.color : 'var(--t-text)' }}>{d.name}</span>
                            {selected === d.id && <span style={{ marginLeft: 'auto', ...S.chip(d.color) }}>Selected</span>}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text-muted)', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => { onSave(selected); onClose(); }}
                        style={{ flex: 2, padding: '0.65rem', borderRadius: 10, border: 'none', background: 'var(--t-accent)', color: '#000', fontFamily: 'var(--font-heading)', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                        Save Assignment →
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Overview Learn Modal ──────────────────────────────── */
function LearnModal({ onClose }: { onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '5rem', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...S.card, padding: '2rem', width: '100%', maxWidth: 780, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ ...S.h1, fontSize: '1.5rem' }}>Vehicle Assignments Overview</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t-text-muted)', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                </div>
                <p style={{ color: 'var(--t-text-muted)', lineHeight: 1.6, marginBottom: '1.75rem', maxWidth: 540 }}>
                    Quickly assign and schedule Operators to Vehicles in a calendar view. Gain insight into a vehicle's assignment history at any point in time and update assignments at lightning speed.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                    {[
                        { icon: '📅', title: 'Manage Assignments', body: 'Assign vehicles to operators in a calendar view. Save time by quickly editing at any time.' },
                        { icon: '🔔', title: 'Notify Operators', body: 'Once assigned, operators automatically receive notifications when new activity happens on their vehicle.' },
                        { icon: '📊', title: 'Analyse Utilisation', body: 'See how often vehicles or operators were assigned. Report on duration, usage and schedule utilisation.' },
                    ].map(f => (
                        <div key={f.title} style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 14, padding: '1.25rem' }}>
                            <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: 10 }}>{f.icon}</span>
                            <p style={{ ...S.h2, fontSize: '0.9rem', marginBottom: 6 }}>{f.title}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--t-text-muted)', lineHeight: 1.5 }}>{f.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function VehicleAssignmentsPage() {
    const [assignments, setAssignments] = useState<Record<string, Record<number, string>>>(INITIAL_ASSIGNMENTS);
    const [showLearn, setShowLearn] = useState(false);
    const [modal, setModal] = useState<{ vehicleId: string; dayIndex: number } | null>(null);
    const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
    const [filter, setFilter] = useState('');

    const driverMap = Object.fromEntries(DRIVERS.map(d => [d.id, d]));

    const save = (vehicleId: string, dayIndex: number, driverId: string | null) => {
        setAssignments(prev => {
            const next = { ...prev, [vehicleId]: { ...(prev[vehicleId] ?? {}) } };
            if (driverId === null) delete next[vehicleId][dayIndex];
            else next[vehicleId][dayIndex] = driverId;
            return next;
        });
    };

    const vehicles = VEHICLES.filter(v =>
        !filter || v.label.toLowerCase().includes(filter.toLowerCase()) || v.plate.toLowerCase().includes(filter.toLowerCase())
    );

    // Utilisation data for bar chart
    const utilData = VEHICLES.map(v => ({ v, pct: pctAssigned(v.id, assignments) })).sort((a, b) => b.pct - a.pct);

    return (
        <div style={S.page}>
            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <Link href="/admin/fleet" style={{ ...S.label, color: 'var(--t-text-muted)', textDecoration: 'none' }}>Fleet</Link>
                        <span style={{ color: 'var(--t-border)' }}>/</span>
                        <span style={{ ...S.label, color: 'var(--t-accent)' }}>Vehicle Assignments</span>
                    </div>
                    <h1 style={{ ...S.h1, fontSize: '1.9rem', marginBottom: '0.25rem' }}>Vehicle Assignments</h1>
                    <p style={{ ...S.muted }}>Week of 3–9 Mar 2026 · Assign operators to vehicles via the calendar</p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => setShowLearn(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
                        💡 Learn
                    </button>
                    {(['week', 'list'] as const).map(m => (
                        <button key={m} onClick={() => setViewMode(m)}
                            style={{ padding: '0.5rem 0.875rem', borderRadius: 9, border: `1px solid ${viewMode === m ? 'var(--t-accent)' : 'var(--t-border)'}`, background: viewMode === m ? 'var(--t-accent-soft)' : 'var(--t-surface)', color: viewMode === m ? 'var(--t-accent)' : 'var(--t-text-muted)', fontSize: '0.78rem', fontWeight: viewMode === m ? 700 : 400, cursor: 'pointer' }}>
                            {m === 'week' ? '📅 Week' : '📋 List'}
                        </button>
                    ))}
                    <button
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 9, border: 'none', background: 'var(--t-accent)', color: '#000', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.2)' }}>
                        + Add Assignment
                    </button>
                </div>
            </div>

            {/* ── KPI strip ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                    { label: 'Total Vehicles', value: VEHICLES.length, color: 'var(--t-text)', icon: '🚗' },
                    { label: 'Assigned This Week', value: VEHICLES.filter(v => pctAssigned(v.id, assignments) > 0).length, color: 'var(--t-green)', icon: '✅' },
                    { label: 'Unassigned', value: VEHICLES.filter(v => pctAssigned(v.id, assignments) === 0).length, color: 'var(--t-orange)', icon: '⚠️' },
                    { label: 'Avg Utilisation', value: Math.round(VEHICLES.reduce((s, v) => s + pctAssigned(v.id, assignments), 0) / VEHICLES.length) + '%', color: 'var(--t-accent)', icon: '📊' },
                ].map(k => (
                    <div key={k.label} style={{ ...S.card, padding: '1rem' }}>
                        <p style={{ fontSize: '1.3rem', marginBottom: 6 }}>{k.icon}</p>
                        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.6rem', color: k.color }}>{k.value}</p>
                        <p style={{ ...S.label }}>{k.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Main grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.25rem', alignItems: 'start' }}>

                {/* LEFT: Calendar / List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Search */}
                    <div style={{ ...S.card, padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input value={filter} onChange={e => setFilter(e.target.value)}
                            placeholder="🔍  Filter by vehicle or plate…"
                            style={{ flex: 1, padding: '0.45rem 0.75rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', outline: 'none' }} />
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            {DRIVERS.map(d => <Avatar key={d.id} driver={d} size={24} />)}
                        </div>
                    </div>

                    {viewMode === 'week' ? (
                        /* ── Week Calendar ── */
                        <div style={{ ...S.card, overflow: 'hidden' }}>
                            {/* Header row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '180px repeat(7,1fr)', background: 'var(--t-surface)', borderBottom: '1px solid var(--t-border)' }}>
                                <div style={{ padding: '0.65rem 1rem', ...S.label }}>Vehicle</div>
                                {DAYS.map((d, i) => (
                                    <div key={d} style={{ padding: '0.65rem 0.5rem', textAlign: 'center' as const, borderLeft: '1px solid var(--t-border)' }}>
                                        <p style={{ ...S.label, color: 'var(--t-text-muted)' }}>{d}</p>
                                        <p style={{ ...S.mono, fontSize: '0.75rem', color: 'var(--t-text)', fontWeight: 700, marginTop: 2 }}>{DATES[i]}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Vehicle rows */}
                            {vehicles.map(v => {
                                const pct = pctAssigned(v.id, assignments);
                                const statusColor = v.status === 'Active' ? 'var(--t-green)' : v.status === 'In Shop' ? 'var(--t-orange)' : 'var(--t-text-dim)';
                                return (
                                    <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '180px repeat(7,1fr)', borderBottom: '1px solid var(--t-border-subtle)' }}
                                        onMouseEnter={e => (e.currentTarget as any).style.background = 'var(--t-row-hover)'}
                                        onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                                        {/* Vehicle cell */}
                                        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, borderRight: '1px solid var(--t-border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                                                <span style={{ fontWeight: 700, fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{v.label}</span>
                                            </div>
                                            <span style={{ ...S.label, fontSize: '0.58rem', color: 'var(--t-accent)', marginLeft: 12 }}>{v.plate}</span>
                                            <div style={{ marginLeft: 12, marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <div style={{ flex: 1, height: 3, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 80 ? 'var(--t-green)' : pct > 40 ? 'var(--t-accent)' : 'var(--t-orange)', borderRadius: 99 }} />
                                                </div>
                                                <span style={{ ...S.mono, fontSize: '0.55rem', color: 'var(--t-text-dim)' }}>{pct}%</span>
                                            </div>
                                        </div>
                                        {/* Day cells */}
                                        {DAYS.map((_, dayIdx) => {
                                            const driverId = assignments[v.id]?.[dayIdx];
                                            const driver = driverId ? driverMap[driverId] : null;
                                            const isShop = v.status === 'In Shop' && dayIdx < 3;
                                            return (
                                                <div key={dayIdx}
                                                    onClick={() => !isShop && setModal({ vehicleId: v.id, dayIndex: dayIdx })}
                                                    style={{ padding: '0.4rem 0.3rem', borderLeft: '1px solid var(--t-border-subtle)', minHeight: 52, cursor: isShop ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.1s', position: 'relative' }}
                                                    onMouseEnter={e => { if (!isShop) (e.currentTarget as any).style.background = 'rgba(245,158,11,0.05)'; }}
                                                    onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                                                    {isShop ? (
                                                        <span style={{ ...S.label, fontSize: '0.55rem', color: 'var(--t-orange)', textAlign: 'center' as const }}>In Shop</span>
                                                    ) : driver ? (
                                                        <AssignPill driver={driver} onClick={() => setModal({ vehicleId: v.id, dayIndex: dayIdx })} />
                                                    ) : (
                                                        <span style={{ fontSize: '1rem', color: 'var(--t-border)', opacity: 0 }} className="add-icon">＋</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* ── List view ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {vehicles.map(v => {
                                const vAssigned = assignments[v.id] ?? {};
                                const days = Object.entries(vAssigned);
                                return (
                                    <div key={v.id} style={{ ...S.card, padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{v.label}</p>
                                                <p style={{ ...S.mono, fontSize: '0.7rem', color: 'var(--t-accent)', marginTop: 2 }}>{v.plate}</p>
                                            </div>
                                            <span style={{ ...S.chip(v.status === 'Active' ? 'var(--t-green)' : v.status === 'In Shop' ? 'var(--t-orange)' : 'var(--t-text-muted)') }}>{v.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {days.length === 0 ? (
                                                <span style={{ ...S.label, color: 'var(--t-red)' }}>Unassigned this week</span>
                                            ) : days.map(([dayIdx, dId]) => {
                                                const d = driverMap[dId];
                                                return d ? (
                                                    <button key={dayIdx} onClick={() => setModal({ vehicleId: v.id, dayIndex: Number(dayIdx) })}
                                                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.6rem', borderRadius: 99, border: `1px solid ${d.color}44`, background: `${d.color}12`, cursor: 'pointer' }}>
                                                        <Avatar driver={d} size={16} />
                                                        <span style={{ fontSize: '0.68rem', color: d.color, fontWeight: 700 }}>{DAYS[Number(dayIdx)]}</span>
                                                    </button>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* RIGHT: Utilisation chart + Driver legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Vehicles by % Assigned */}
                    <div style={{ ...S.card, padding: '1rem' }}>
                        <p style={{ ...S.h2, fontSize: '0.82rem', marginBottom: 3 }}>Vehicles by % Assigned</p>
                        <p style={{ ...S.label, fontSize: '0.58rem', color: 'var(--t-text-dim)', marginBottom: 12 }}>Mar 3 – 9</p>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            {utilData.map(({ v, pct }) => (
                                <div key={v.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                    <UtilBar pct={pct} color={pct >= 80 ? 'var(--t-green)' : pct >= 50 ? 'var(--t-accent)' : pct > 0 ? 'var(--t-orange)' : 'var(--t-border)'} />
                                    <span title={v.label} style={{ ...S.mono, fontSize: '0.5rem', color: 'var(--t-text-dim)', maxWidth: 22, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{v.id.replace('VEH-', '')}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                            {[['≥80%', 'var(--t-green)'], ['50–79%', 'var(--t-accent)'], ['<50%', 'var(--t-orange)'], ['0%', 'var(--t-border)']].map(([l, c]) => (
                                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, ...S.label, fontSize: '0.55rem' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Driver legend */}
                    <div style={{ ...S.card, padding: '1rem' }}>
                        <p style={{ ...S.h2, fontSize: '0.82rem', marginBottom: 12 }}>Operators</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {DRIVERS.map(d => {
                                // count how many day-slots this driver has
                                let count = 0;
                                Object.values(assignments).forEach(days => Object.values(days).forEach(id => { if (id === d.id) count++; }));
                                return (
                                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0.6rem', background: 'var(--t-surface)', borderRadius: 9 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Avatar driver={d} size={24} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{d.name.split(' ')[0]}</span>
                                        </div>
                                        <span style={{ ...S.mono, fontSize: '0.68rem', color: d.color, fontWeight: 800 }}>{count}d</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick instructions */}
                    <div style={{ ...S.card, padding: '1rem', background: 'var(--t-accent-soft)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <p style={{ ...S.h2, fontSize: '0.78rem', color: 'var(--t-accent)', marginBottom: 8 }}>⚡ Quick Guide</p>
                        <ul style={{ paddingLeft: 14, fontSize: '0.72rem', color: 'var(--t-text-muted)', lineHeight: 1.7, margin: 0 }}>
                            <li>Click any empty cell to assign</li>
                            <li>Click an assigned pill to change</li>
                            <li>Select "Unassigned" to clear</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            {showLearn && <LearnModal onClose={() => setShowLearn(false)} />}
            {modal && (
                <AssignModal
                    vehicleId={modal.vehicleId}
                    dayIndex={modal.dayIndex}
                    current={assignments[modal.vehicleId]?.[modal.dayIndex]}
                    onSave={(driverId) => save(modal.vehicleId, modal.dayIndex, driverId)}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}
