'use client';

import React, { useState, useEffect } from 'react';

const S = {
    page: { minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '2rem' } as React.CSSProperties,
    card: { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.5rem' } as React.CSSProperties,
    surface: { background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 12, padding: '1rem' } as React.CSSProperties,
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '-0.02em' } as React.CSSProperties,
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 800 } as React.CSSProperties,
    label: { fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase' as const, letterSpacing: '0.09em', fontFamily: 'var(--font-mono)' },
    mono: { fontFamily: 'var(--font-mono)', fontSize: '0.8rem' } as React.CSSProperties,
    muted: { color: 'var(--t-text-muted)', fontSize: '0.85rem' } as React.CSSProperties,
};

const INCIDENTS = [
    { id: 'INC-2401', type: '🚗 Road Accident', location: 'Sheikh Zayed Rd, J12', severity: 'P1', status: 'Active', units: 3, eta: '4 min' },
    { id: 'INC-2399', type: '🔥 Vehicle Fire', location: 'Al Khail Rd, Near Mall', severity: 'P1', status: 'Contained', units: 5, eta: 'On-site' },
    { id: 'INC-2397', type: '⚠️ Road Hazard', location: 'E311, Km 24', severity: 'P2', status: 'Resolved', units: 1, eta: 'Done' },
    { id: 'INC-2395', type: '🚑 Medical Emergency', location: 'DIFC Towers, G Floor', severity: 'P2', status: 'En Route', units: 2, eta: '6 min' },
];

const LIVE_STATS = [
    { label: 'Active Incidents', value: '7', color: 'var(--t-red)', icon: '🚨' },
    { label: 'Units Deployed', value: '23', color: 'var(--t-orange)', icon: '🚒' },
    { label: 'Avg Response Time', value: '8.4 min', color: 'var(--t-accent)', icon: '⏱️' },
    { label: 'SLA Compliance', value: '97.3%', color: 'var(--t-green)', icon: '✅' },
];

const SEV_COLOUR: Record<string, string> = {
    P1: 'var(--t-red)', P2: 'var(--t-orange)', P3: 'var(--t-accent)',
};

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
    'Active': { bg: 'var(--t-red-soft)', color: 'var(--t-red)' },
    'En Route': { bg: 'var(--t-orange-soft)', color: 'var(--t-orange)' },
    'Contained': { bg: 'var(--t-accent-soft)', color: 'var(--t-accent)' },
    'Resolved': { bg: 'var(--t-green-soft)', color: 'var(--t-green)' },
};

function Tick({ value }: { value: string }) {
    const [display, setDisplay] = useState(value);
    useEffect(() => {
        const id = setInterval(() => setDisplay(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(id);
    }, []);
    return <span style={{ ...S.mono, fontSize: '0.85rem', color: 'var(--t-accent)' }}>{display}</span>;
}

export default function EmergencyResponsePage() {
    const [filter, setFilter] = useState<'ALL' | 'P1' | 'P2'>('ALL');

    const filtered = filter === 'ALL' ? INCIDENTS : INCIDENTS.filter(i => i.severity === filter);

    return (
        <div style={S.page}>
            {/* Header */}
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t-red)', boxShadow: '0 0 8px var(--t-red)', animation: 'pulse 2s infinite' }} />
                    <span style={S.label}>Emergency_Response_OS</span>
                    <span style={{ marginLeft: 'auto' }}><Tick value="" /></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ ...S.h1, fontSize: '2.25rem', marginBottom: '0.25rem' }}>Emergency Response</h1>
                        <p style={S.muted}>Real-time incident orchestration &amp; unit dispatch</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['ALL', 'P1', 'P2'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                style={{ padding: '0.5rem 1rem', borderRadius: 8, border: `1px solid ${filter === f ? 'var(--t-red)' : 'var(--t-border)'}`, background: filter === f ? 'var(--t-red-soft)' : 'var(--t-surface)', color: filter === f ? 'var(--t-red)' : 'var(--t-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* KPI Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {LIVE_STATS.map(s => (
                    <div key={s.label} style={S.card}>
                        <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{s.icon}</div>
                        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.6rem', color: s.color }}>{s.value}</p>
                        <p style={S.label}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                {/* Incident Table */}
                <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--t-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t-red)', animation: 'pulse 1s infinite' }} />
                        <h2 style={{ ...S.h2, fontSize: '1rem' }}>Live Incident Feed</h2>
                        <span style={{ marginLeft: 'auto', ...S.label, background: 'var(--t-red-soft)', color: 'var(--t-red)', padding: '0.2rem 0.6rem', borderRadius: 999, border: '1px solid rgba(239,68,68,0.25)' }}>
                            {filtered.length} incidents
                        </span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--t-surface)' }}>
                                {['Incident ID', 'Type', 'Location', 'Sev', 'Units', 'ETA', 'Status'].map(col => (
                                    <th key={col} style={{ ...S.label, padding: '0.75rem 1rem', textAlign: 'left' }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((inc, i) => {
                                const badge = STATUS_BADGE[inc.status] ?? { bg: 'var(--t-surface)', color: 'var(--t-text-muted)' };
                                return (
                                    <tr key={inc.id} style={{ borderBottom: '1px solid var(--t-border-subtle)', transition: 'background 0.1s' }}
                                        onMouseEnter={e => (e.currentTarget as any).style.background = 'var(--t-row-hover)'}
                                        onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                                        <td style={{ padding: '0.875rem 1rem', ...S.mono, color: 'var(--t-text-dim)', fontSize: '0.72rem' }}>{inc.id}</td>
                                        <td style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.85rem' }}>{inc.type}</td>
                                        <td style={{ padding: '0.875rem 1rem', ...S.muted, fontSize: '0.78rem' }}>{inc.location}</td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <span style={{ ...S.mono, fontWeight: 900, fontSize: '0.72rem', color: SEV_COLOUR[inc.severity] ?? 'var(--t-text)' }}>{inc.severity}</span>
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', ...S.mono, color: 'var(--t-text)' }}>{inc.units}</td>
                                        <td style={{ padding: '0.875rem 1rem', ...S.mono, color: 'var(--t-accent)', fontWeight: 700 }}>{inc.eta}</td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: badge.bg, color: badge.color, border: `1px solid ${badge.color}44`, whiteSpace: 'nowrap' as const }}>
                                                {inc.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Right panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* AI Dispatch */}
                    <div style={{ ...S.card, background: 'var(--t-red-soft)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <p style={{ ...S.h2, fontSize: '0.9rem', color: 'var(--t-red)', marginBottom: 8 }}>🤖 AI Dispatch Recommendation</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--t-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                            Ambulance <strong style={{ color: 'var(--t-text)' }}>AMB-007</strong> is 2.1 km from INC-2401. Rerouting via E44 saves <strong style={{ color: 'var(--t-red)' }}>2.3 minutes</strong>.
                        </p>
                        <button style={{ width: '100%', padding: '0.6rem', borderRadius: 10, border: 'none', background: 'var(--t-red)', color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                            Dispatch Now →
                        </button>
                    </div>

                    {/* Unit status */}
                    <div style={S.card}>
                        <p style={{ ...S.h2, fontSize: '0.85rem', marginBottom: '1rem' }}>Unit Availability</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { id: 'AMB-007', type: '🚑 Ambulance', status: 'Available', dist: '2.1 km' },
                                { id: 'FTK-002', type: '🚒 Fire Truck', status: 'On Site', dist: 'Active' },
                                { id: 'AMB-012', type: '🚑 Ambulance', status: 'En Route', dist: '5.4 km' },
                                { id: 'TOW-004', type: '🏗️ Tow Truck', status: 'Available', dist: '3.8 km' },
                            ].map(u => (
                                <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.875rem', background: 'var(--t-surface)', borderRadius: 10 }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{u.type}</p>
                                        <p style={{ ...S.mono, color: 'var(--t-text-dim)', fontSize: '0.68rem' }}>{u.id}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' as const }}>
                                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: u.status === 'Available' ? 'var(--t-green)' : u.status === 'On Site' ? 'var(--t-red)' : 'var(--t-orange)' }}>{u.status}</p>
                                        <p style={{ ...S.mono, color: 'var(--t-text-dim)', fontSize: '0.65rem' }}>{u.dist}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
