'use client';

import React, { useState } from 'react';

const S = {
    page: { minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '2rem' } as React.CSSProperties,
    card: { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.5rem' } as React.CSSProperties,
    surface: { background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 12, padding: '1rem' } as React.CSSProperties,
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--t-text)' } as React.CSSProperties,
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--t-text)' } as React.CSSProperties,
    label: { fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase' as const, letterSpacing: '0.09em', fontFamily: 'var(--font-mono)' },
    val: { fontFamily: 'var(--font-heading)', fontWeight: 900 } as React.CSSProperties,
    mono: { fontFamily: 'var(--font-mono)', fontSize: '0.8rem' } as React.CSSProperties,
    muted: { color: 'var(--t-text-muted)', fontSize: '0.85rem' } as React.CSSProperties,
};

const VEHICLES = [
    { vin: '7GZXX1...442', model: 'Toyota Hiace', fuel: '12.4 L/100', value: 'AED 28,400', health: 94, status: 'Active', flag: false },
    { vin: '8HBYY2...881', model: 'Mercedes Sprinter', fuel: '15.8 L/100', value: 'AED 45,200', health: 42, status: 'Maint.', flag: false },
    { vin: '1JKLL3...102', model: 'Ford Transit', fuel: '11.2 L/100', value: 'AED 31,000', health: 82, status: 'Active', flag: false },
    { vin: '5POQQ4...556', model: 'Toyota Hiace', fuel: '22.1 L/100 ⚠️', value: 'AED 24,900', health: 76, status: 'Active', flag: true },
];

const PARTS = [
    { label: 'Brake Pads (DXB-442)', health: 12, status: 'Replace' },
    { label: 'Front Left Tire (DXB-881)', health: 28, status: 'Warning' },
    { label: 'Timing Belt (DXB-102)', health: 88, status: 'Good' },
];

const STATS = [
    { label: 'Fleet Health Index', value: '92%', color: 'var(--t-green)', icon: '📊' },
    { label: 'Active Procurement', value: 'AED 2.4M', color: 'var(--t-accent)', icon: '🚗' },
    { label: 'Depreciation Avg', value: '14.2%', color: 'var(--t-orange)', icon: '📉' },
    { label: 'Fuel Anomalies', value: '04', color: 'var(--t-red)', icon: '⛽' },
];

export default function FleetAdminPage() {
    const [selectedVin, setSelectedVin] = useState<string | null>(null);

    return (
        <div style={S.page}>
            {/* Header */}
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--t-orange)', boxShadow: '0 0 6px var(--t-orange)' }} />
                    <span style={S.label}>Fleet_Asset_Intelligence</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ ...S.h1, fontSize: '2.25rem', marginBottom: '0.25rem' }}>Fleet Management</h1>
                        <p style={S.muted}>Vehicle lifecycle, fuel analytics &amp; predictive maintenance</p>
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 1.25rem', borderRadius: 10, border: 'none', background: 'var(--t-accent)', color: 'var(--t-accent-contrast)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                        🔍 Scan VIN Data
                    </button>
                </div>
            </header>

            {/* KPI Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {STATS.map(s => (
                    <div key={s.label} style={{ ...S.card, padding: '1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
                        </div>
                        <p style={{ ...S.val, fontSize: '1.6rem', color: s.color }}>{s.value}</p>
                        <p style={S.label}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
                {/* Left: Lifecycle + Parts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* AI Resale */}
                    <div style={{ ...S.card }}>
                        <p style={{ ...S.h2, fontSize: '0.85rem', marginBottom: '1rem' }}>Lifecycle Summary</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { label: 'Active Procurement', value: 'AED 2.4M', sub: '12 vehicles pending' },
                                { label: 'Avg Depreciation', value: '14.2%', sub: 'Year-over-year' },
                                { label: 'Fuel Anomalies', value: '4', sub: 'Last 24 hours' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--t-surface)', borderRadius: 10 }}>
                                    <div>
                                        <p style={{ ...S.label, marginBottom: 3 }}>{item.label}</p>
                                        <p style={{ ...S.mono, color: 'var(--t-text-muted)', fontSize: '0.72rem' }}>{item.sub}</p>
                                    </div>
                                    <p style={{ ...S.val, fontSize: '1.25rem', color: 'var(--t-accent)' }}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'var(--t-cyan-soft)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 10 }}>
                            <p style={{ ...S.label, color: 'var(--t-cyan)', marginBottom: 6 }}>⚡ Resale Valuation AI</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--t-text-muted)', lineHeight: 1.6 }}>
                                Market trends indicate a <strong style={{ color: 'var(--t-text)' }}>5.2% increase</strong> in resale value for 2024 Toyota HiAce in MENA region.
                            </p>
                        </div>
                    </div>

                    {/* Parts Health */}
                    <div style={S.card}>
                        <p style={{ ...S.h2, fontSize: '0.85rem', marginBottom: '1rem' }}>Critical Spare Parts</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {PARTS.map(p => {
                                const color = p.health < 20 ? 'var(--t-red)' : p.health < 40 ? 'var(--t-orange)' : 'var(--t-green)';
                                return (
                                    <div key={p.label}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{p.label}</span>
                                            <span style={{ ...S.label, color }}>{p.status}</span>
                                        </div>
                                        <div style={{ height: 5, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${p.health}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Asset Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--t-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 style={{ ...S.h2, fontSize: '1rem' }}>Active Asset Inventory</h2>
                            <span style={{ ...S.label, background: 'var(--t-accent-soft)', color: 'var(--t-accent)', padding: '0.25rem 0.75rem', borderRadius: 999, border: '1px solid rgba(245,158,11,0.25)' }}>
                                {VEHICLES.length} vehicles
                            </span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--t-surface)' }}>
                                    {['VIN', 'Model', 'Fuel Efficiency', 'Book Value', 'Health', 'Status'].map(col => (
                                        <th key={col} style={{ ...S.label, padding: '0.75rem 1.25rem', textAlign: 'left' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {VEHICLES.map(v => (
                                    <tr key={v.vin} onClick={() => setSelectedVin(v.vin === selectedVin ? null : v.vin)}
                                        style={{ borderBottom: '1px solid var(--t-border-subtle)', cursor: 'pointer', background: v.vin === selectedVin ? 'var(--t-row-selected)' : 'transparent', transition: 'background 0.15s' }}>
                                        <td style={{ padding: '0.875rem 1.25rem' }}>
                                            <p style={{ ...S.mono, color: 'var(--t-text-dim)', fontSize: '0.7rem' }}>{v.vin}</p>
                                        </td>
                                        <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.85rem' }}>{v.model}</td>
                                        <td style={{ padding: '0.875rem 1.25rem' }}>
                                            <span style={{ ...S.mono, color: v.flag ? 'var(--t-red)' : 'var(--t-cyan)' }}>{v.fuel}</span>
                                        </td>
                                        <td style={{ padding: '0.875rem 1.25rem', ...S.mono, color: 'var(--t-text-muted)' }}>{v.value}</td>
                                        <td style={{ padding: '0.875rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, maxWidth: 60, height: 4, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${v.health}%`, background: v.health > 70 ? 'var(--t-green)' : v.health > 40 ? 'var(--t-orange)' : 'var(--t-red)', borderRadius: 99 }} />
                                                </div>
                                                <span style={{ ...S.mono, color: 'var(--t-text-dim)', fontSize: '0.7rem' }}>{v.health}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.875rem 1.25rem' }}>
                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, background: v.status === 'Active' ? 'var(--t-green-soft)' : 'var(--t-orange-soft)', color: v.status === 'Active' ? 'var(--t-green)' : 'var(--t-orange)', border: `1px solid ${v.status === 'Active' ? 'rgba(16,185,129,0.25)' : 'rgba(249,115,22,0.25)'}` }}>
                                                {v.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* AI Optimisation alert */}
                    <div style={{ ...S.card, background: 'var(--t-orange-soft)', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.875rem', background: 'rgba(249,115,22,0.12)', borderRadius: 12, fontSize: '1.75rem' }}>📈</div>
                            <div>
                                <h3 style={{ ...S.h2, fontSize: '0.95rem', color: 'var(--t-orange)', marginBottom: 4 }}>Driver ↔ Vehicle Optimisation</h3>
                                <p style={{ ...S.muted, fontSize: '0.8rem' }}>
                                    Assign <strong>Top_Gun_Driver #442</strong> to Mercedes DXB-881 for <strong>18% lower brake wear</strong> forecast.
                                </p>
                            </div>
                        </div>
                        <button style={{ padding: '0.65rem 1.25rem', borderRadius: 10, border: 'none', background: 'var(--t-orange)', color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                            Activate Optimisation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
