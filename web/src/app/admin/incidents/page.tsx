'use client';

import React, { useState } from 'react';

const S = {
    page: { minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '2rem' } as React.CSSProperties,
    card: { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.5rem' } as React.CSSProperties,
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '-0.02em' } as React.CSSProperties,
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 800 } as React.CSSProperties,
    label: { fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase' as const, letterSpacing: '0.09em', fontFamily: 'var(--font-mono)' },
    mono: { fontFamily: 'var(--font-mono)', fontSize: '0.8rem' } as React.CSSProperties,
    muted: { color: 'var(--t-text-muted)', fontSize: '0.85rem' } as React.CSSProperties,
};

const INCIDENTS = [
    { id: 'INC-2401', type: '🚗 Road Accident', location: 'Sheikh Zayed Rd, J12', sev: 'P1', status: 'Open', loss: 'AED 120K', recovery: 32 },
    { id: 'INC-2399', type: '🔥 Vehicle Fire', location: 'Al Khail Rd, Near Mall', sev: 'P1', status: 'Recovery', loss: 'AED 85K', recovery: 68 },
    { id: 'INC-2397', type: '⚠️ Road Hazard', location: 'E311, Km 24', sev: 'P2', status: 'Resolved', loss: 'AED 12K', recovery: 100 },
    { id: 'INC-2395', type: '🌊 Flash Flood', location: 'Deira, Creek Area', sev: 'P1', status: 'Open', loss: 'AED 340K', recovery: 15 },
    { id: 'INC-2390', type: '💥 Pile-up', location: 'Abu Dhabi Hwy, Km 8', sev: 'P1', status: 'Recovery', loss: 'AED 210K', recovery: 55 },
];

const RECOVERY_KPI = [
    { label: 'Open Incidents', value: '3', color: 'var(--t-red)', icon: '🚨' },
    { label: 'Recovery in Progress', value: '2', color: 'var(--t-orange)', icon: '🔧' },
    { label: 'Total Liability', value: 'AED 767K', color: 'var(--t-accent)', icon: '💰' },
    { label: 'Resolved (30d)', value: '47', color: 'var(--t-green)', icon: '✅' },
];

export default function IncidentsPage() {
    const [selected, setSelected] = useState('INC-2401');

    const sel = INCIDENTS.find(i => i.id === selected)!;

    const severityColor = (s: string) => s === 'P1' ? 'var(--t-red)' : s === 'P2' ? 'var(--t-orange)' : 'var(--t-accent)';
    const statusStyle = (s: string) => ({
        'Open': { bg: 'var(--t-red-soft)', color: 'var(--t-red)' },
        'Recovery': { bg: 'var(--t-orange-soft)', color: 'var(--t-orange)' },
        'Resolved': { bg: 'var(--t-green-soft)', color: 'var(--t-green)' },
    }[s] ?? { bg: 'var(--t-surface)', color: 'var(--t-text-muted)' });

    return (
        <div style={S.page}>
            {/* Header */}
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--t-red)', boxShadow: '0 0 6px var(--t-red)' }} />
                    <span style={S.label}>Incident_Management_OS</span>
                </div>
                <h1 style={{ ...S.h1, fontSize: '2.25rem', marginBottom: '0.25rem' }}>Incidents &amp; Recovery</h1>
                <p style={S.muted}>Track, manage and close incidents with AI-assisted recovery routing</p>
            </header>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {RECOVERY_KPI.map(k => (
                    <div key={k.label} style={S.card}>
                        <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{k.icon}</div>
                        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', color: k.color }}>{k.value}</p>
                        <p style={S.label}>{k.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                {/* Table */}
                <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--t-border)' }}>
                        <h2 style={{ ...S.h2, fontSize: '1rem' }}>Incident Register</h2>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--t-surface)' }}>
                                {['Incident', 'Type', 'Location', 'Sev', 'Recovery', 'Status'].map(col => (
                                    <th key={col} style={{ ...S.label, padding: '0.75rem 1rem', textAlign: 'left' }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {INCIDENTS.map(inc => {
                                const badge = statusStyle(inc.status);
                                return (
                                    <tr key={inc.id} onClick={() => setSelected(inc.id)}
                                        style={{ borderBottom: '1px solid var(--t-border-subtle)', cursor: 'pointer', background: inc.id === selected ? 'var(--t-row-selected)' : 'transparent', transition: 'background 0.1s' }}>
                                        <td style={{ padding: '0.875rem 1rem', ...S.mono, color: 'var(--t-text-dim)', fontSize: '0.72rem' }}>{inc.id}</td>
                                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}>{inc.type}</td>
                                        <td style={{ padding: '0.875rem 1rem', ...S.muted, fontSize: '0.78rem' }}>{inc.location}</td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <span style={{ ...S.mono, fontWeight: 900, fontSize: '0.72rem', color: severityColor(inc.sev) }}>{inc.sev}</span>
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, maxWidth: 60, height: 4, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${inc.recovery}%`, background: inc.recovery === 100 ? 'var(--t-green)' : inc.recovery > 50 ? 'var(--t-accent)' : 'var(--t-red)', borderRadius: 99 }} />
                                                </div>
                                                <span style={{ ...S.mono, color: 'var(--t-text-dim)', fontSize: '0.68rem' }}>{inc.recovery}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: badge.bg, color: badge.color, border: `1px solid ${badge.color}44` }}>
                                                {inc.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Detail panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={S.card}>
                        <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: '1.25rem', gap: 10 } as any}>
                            <div>
                                <p style={{ ...S.mono, color: 'var(--t-text-dim)', fontSize: '0.7rem', marginBottom: 4 }}>{sel.id}</p>
                                <h2 style={{ ...S.h2, fontSize: '1rem' }}>{sel.type}</h2>
                            </div>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 900, background: statusStyle(sel.status).bg, color: statusStyle(sel.status).color, border: `1px solid ${statusStyle(sel.status).color}44`, whiteSpace: 'nowrap' as const }}>
                                {sel.status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'Location', value: sel.location },
                                { label: 'Severity', value: sel.sev, mono: true, color: severityColor(sel.sev) },
                                { label: 'Estimated Loss', value: sel.loss, mono: true, color: 'var(--t-orange)' },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.875rem', background: 'var(--t-surface)', borderRadius: 10 }}>
                                    <span style={S.label}>{row.label}</span>
                                    <span style={{ ...((row.mono ? S.mono : {}) as React.CSSProperties), fontWeight: 700, color: row.color ?? 'var(--t-text)', fontSize: '0.85rem' }}>{row.value}</span>
                                </div>
                            ))}

                            <div style={{ padding: '0.75rem', background: 'var(--t-surface)', borderRadius: 10 }}>
                                <p style={{ ...S.label, marginBottom: 6 }}>Recovery Progress</p>
                                <div style={{ height: 8, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                                    <div style={{ height: '100%', width: `${sel.recovery}%`, background: sel.recovery === 100 ? 'var(--t-green)' : sel.recovery > 50 ? 'var(--t-accent)' : 'var(--t-red)', borderRadius: 99, transition: 'width 0.5s ease' }} />
                                </div>
                                <p style={{ ...S.mono, color: 'var(--t-accent)', fontSize: '0.72rem', textAlign: 'right' as const }}>{sel.recovery}% complete</p>
                            </div>
                        </div>
                    </div>

                    {/* AI recommendation */}
                    <div style={{ ...S.card, background: 'var(--t-accent-soft)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <p style={{ ...S.h2, fontSize: '0.85rem', color: 'var(--t-accent)', marginBottom: 8 }}>⚡ AI Recovery Insight</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--t-text-muted)', lineHeight: 1.6 }}>
                            Coordinating with Dubai Police &amp; RTA for {sel.id} — estimated clearance in <strong style={{ color: 'var(--t-text)' }}>22 minutes</strong> based on traffic model.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
