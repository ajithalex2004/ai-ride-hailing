'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const S = {
    page: { minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '1.75rem' } as React.CSSProperties,
    card: { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.5rem' } as React.CSSProperties,
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '-0.02em' } as React.CSSProperties,
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 800 } as React.CSSProperties,
    label: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.09em', color: 'var(--t-text-dim)' },
    mono: { fontFamily: 'var(--font-mono)' } as React.CSSProperties,
    muted: { color: 'var(--t-text-muted)', fontSize: '0.85rem' } as React.CSSProperties,
};

/* Mock vehicle DB */
const VEHICLE_DB: Record<string, any> = {
    'VEH-001': { id: 'VEH-001', vin: '1HGBH41JXMN109186', year: 2023, make: 'Toyota', model: 'HiAce', type: 'Van', plate: 'DXB-A-11442', driver: 'Mohammed Al-Rashid', driverPhone: '+971 50 123 4567', mileage: 42180, fuel: 'Diesel', status: 'Active', dept: 'Logistics', color: 'White', seats: 12, registered: '15 Jan 2023', insurance: '15 Jan 2025', nextService: '12 Apr 2026', lastService: '12 Oct 2025', nextInspect: '1 Jun 2026' },
    'VEH-002': { id: 'VEH-002', vin: '2T1BURHE0JC019484', year: 2022, make: 'Mercedes', model: 'Sprinter', type: 'Heavy Van', plate: 'DXB-B-88812', driver: 'Ahmed Al-Sayed', driverPhone: '+971 55 987 6543', mileage: 78440, fuel: 'Diesel', status: 'In Shop', dept: 'Maintenance', color: 'Silver', seats: 9, registered: '3 Mar 2022', insurance: '3 Mar 2025', nextService: '20 Mar 2026', lastService: '20 Sep 2025', nextInspect: '15 May 2026' },
    'VEH-003': { id: 'VEH-003', vin: '3VWFE21C04M000001', year: 2024, make: 'Ford', model: 'Transit', type: 'Cargo Van', plate: 'AUH-C-10234', driver: 'Unassigned', driverPhone: '—', mileage: 12300, fuel: 'Diesel', status: 'Active', dept: 'Operations', color: 'Gray', seats: 3, registered: '20 Jul 2024', insurance: '20 Jul 2026', nextService: '5 Aug 2026', lastService: '5 Feb 2026', nextInspect: '20 Sep 2026' },
};

const SERVICE_HISTORY = [
    { date: '12 Oct 2025', type: 'Scheduled Service', tech: 'Workshop A', cost: 'AED 840', notes: 'Oil, filter, brake check', mileage: 41200 },
    { date: '5 Jun 2025', type: 'Tyre Replacement', tech: 'Workshop B', cost: 'AED 1,240', notes: 'Replaced 4 tyres', mileage: 38100 },
    { date: '18 Jan 2025', type: 'Annual Inspection', tech: 'RTA Centre', cost: 'AED 320', notes: 'Pass — all clear', mileage: 33200 },
    { date: '2 Sep 2024', type: 'AC Repair', tech: 'Workshop A', cost: 'AED 650', notes: 'Compressor replaced', mileage: 28900 },
    { date: '15 Mar 2024', type: 'Scheduled Service', tech: 'Workshop C', cost: 'AED 780', notes: 'Full service', mileage: 22400 },
];

const FUEL_LOGS = [
    { date: '1 Mar 2026', litres: 65, cost: 'AED 195', odometer: 42180, station: 'ADNOC — Al Quoz' },
    { date: '18 Feb 2026', litres: 60, cost: 'AED 180', odometer: 41800, station: 'ENOC — Sheikh Zayed' },
    { date: '4 Feb 2026', litres: 58, cost: 'AED 174', odometer: 41400, station: 'ADNOC — Al Quoz' },
    { date: '21 Jan 2026', litres: 62, cost: 'AED 186', odometer: 41000, station: 'BP — Motor City' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
    'Active': { bg: 'var(--t-green-soft)', color: 'var(--t-green)' },
    'In Shop': { bg: 'var(--t-orange-soft)', color: 'var(--t-orange)' },
    'Inactive': { bg: 'var(--t-surface)', color: 'var(--t-text-muted)' },
    'Out of Service': { bg: 'var(--t-red-soft)', color: 'var(--t-red)' },
};

function TabBtn({ label, active, onClick, count }: any) {
    return (
        <button onClick={onClick}
            style={{ padding: '0.5rem 1rem', borderRadius: 9, border: `1px solid ${active ? 'var(--t-accent)' : 'var(--t-border)'}`, background: active ? 'var(--t-accent-soft)' : 'var(--t-surface)', color: active ? 'var(--t-accent)' : 'var(--t-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: active ? 700 : 400, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {label}
            {count !== undefined && <span style={{ ...S.label, background: 'var(--t-surface)', padding: '1px 5px', borderRadius: 5 }}>{count}</span>}
        </button>
    );
}

export default function VehicleDetailPage() {
    const params = useParams();
    const vehicleId = String(params?.id ?? 'VEH-001');
    const v = VEHICLE_DB[vehicleId] ?? VEHICLE_DB['VEH-001'];
    const [tab, setTab] = useState<'overview' | 'service' | 'fuel' | 'docs'>('overview');
    const ss = STATUS_STYLE[v.status] ?? STATUS_STYLE['Inactive'];

    return (
        <div style={S.page}>
            {/* ── Breadcrumb ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <Link href="/admin/fleet" style={{ ...S.label, color: 'var(--t-text-muted)', textDecoration: 'none' }}>Fleet</Link>
                <span style={{ color: 'var(--t-border)' }}>/</span>
                <Link href="/admin/fleet/vehicles" style={{ ...S.label, color: 'var(--t-text-muted)', textDecoration: 'none' }}>Vehicle Master</Link>
                <span style={{ color: 'var(--t-border)' }}>/</span>
                <span style={{ ...S.label, color: 'var(--t-accent)' }}>{v.id}</span>
            </div>

            {/* ── Hero card ── */}
            <div style={{ ...S.card, marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
                {/* Vehicle icon */}
                <div style={{ width: 72, height: 72, borderRadius: 16, background: `${ss.color}18`, border: `2px solid ${ss.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
                    🚗
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <h1 style={{ ...S.h1, fontSize: '1.75rem' }}>{v.year} {v.make} {v.model}</h1>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.65rem', fontWeight: 800, background: ss.bg, color: ss.color, border: `1px solid ${ss.color}44` }}>
                            {v.status}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Plate', value: v.plate, accent: true },
                            { label: 'VIN', value: v.vin },
                            { label: 'Type', value: v.type },
                            { label: 'Fuel', value: v.fuel },
                            { label: 'Dept', value: v.dept },
                        ].map(f => (
                            <div key={f.label}>
                                <p style={S.label}>{f.label}</p>
                                <p style={{ ...S.mono, fontSize: '0.82rem', fontWeight: f.accent ? 800 : 500, color: f.accent ? 'var(--t-accent)' : 'var(--t-text)', marginTop: 3 }}>{f.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mileage big number */}
                <div style={{ textAlign: 'right' as const }}>
                    <p style={S.label}>Total Mileage</p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--t-cyan)', marginTop: 4 }}>{v.mileage.toLocaleString()}</p>
                    <p style={{ ...S.mono, fontSize: '0.68rem', color: 'var(--t-text-dim)' }}>km</p>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <TabBtn label="Overview" active={tab === 'overview'} onClick={() => setTab('overview')} />
                <TabBtn label="Service History" active={tab === 'service'} onClick={() => setTab('service')} count={SERVICE_HISTORY.length} />
                <TabBtn label="Fuel Logs" active={tab === 'fuel'} onClick={() => setTab('fuel')} count={FUEL_LOGS.length} />
                <TabBtn label="Documents" active={tab === 'docs'} onClick={() => setTab('docs')} />
            </div>

            {/* ── Tab: Overview ── */}
            {tab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    {/* Vehicle Info */}
                    <div style={S.card}>
                        <h2 style={{ ...S.h2, fontSize: '0.9rem', marginBottom: '1rem' }}>Vehicle Information</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { label: 'Make / Model', value: `${v.make} ${v.model}` },
                                { label: 'Year', value: v.year },
                                { label: 'Type', value: v.type },
                                { label: 'Colour', value: v.color },
                                { label: 'Seats', value: v.seats },
                                { label: 'Fuel Type', value: v.fuel },
                                { label: 'VIN', value: v.vin },
                                { label: 'Plate', value: v.plate },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--t-surface)', borderRadius: 9 }}>
                                    <span style={S.label}>{row.label}</span>
                                    <span style={{ ...S.mono, fontSize: '0.82rem', fontWeight: 600 }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dates + Driver */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={S.card}>
                            <h2 style={{ ...S.h2, fontSize: '0.9rem', marginBottom: '1rem' }}>Key Dates</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { label: 'Registered', value: v.registered, icon: '📋' },
                                    { label: 'Insurance Due', value: v.insurance, icon: '🛡️' },
                                    { label: 'Next Service', value: v.nextService, icon: '🔧' },
                                    { label: 'Last Service', value: v.lastService, icon: '✅' },
                                    { label: 'Next Inspection', value: v.nextInspect, icon: '🔍' },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.75rem', background: 'var(--t-surface)', borderRadius: 9 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span>{row.icon}</span>
                                            <span style={S.label}>{row.label}</span>
                                        </span>
                                        <span style={{ ...S.mono, fontSize: '0.8rem', color: 'var(--t-text)', fontWeight: 600 }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={S.card}>
                            <h2 style={{ ...S.h2, fontSize: '0.9rem', marginBottom: '1rem' }}>Assigned Driver</h2>
                            {v.driver !== 'Unassigned' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--t-accent-soft)', border: '2px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 900, color: 'var(--t-accent)', fontSize: '1rem' }}>
                                        {v.driver.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{v.driver}</p>
                                        <p style={{ ...S.mono, fontSize: '0.72rem', color: 'var(--t-text-muted)', marginTop: 3 }}>{v.driverPhone}</p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' as const, padding: '1rem', color: 'var(--t-text-dim)' }}>
                                    <p>👤</p>
                                    <p style={{ fontSize: '0.82rem', marginTop: 6 }}>No driver assigned</p>
                                    <button style={{ marginTop: 10, padding: '0.4rem 0.875rem', borderRadius: 8, border: '1px solid var(--t-accent)', background: 'var(--t-accent-soft)', color: 'var(--t-accent)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                                        Assign Driver
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab: Service History ── */}
            {tab === 'service' && (
                <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--t-surface)' }}>
                                {['Date', 'Service Type', 'Technician', 'Mileage', 'Cost', 'Notes'].map(col => (
                                    <th key={col} style={{ ...S.label, padding: '0.75rem 1rem', textAlign: 'left' }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SERVICE_HISTORY.map((s, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--t-border-subtle)' }}
                                    onMouseEnter={e => (e.currentTarget as any).style.background = 'var(--t-row-hover)'}
                                    onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.78rem', color: 'var(--t-text-muted)' }}>{s.date}</td>
                                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontSize: '0.85rem' }}>{s.type}</td>
                                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem' }}>{s.tech}</td>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.78rem', color: 'var(--t-cyan)' }}>{s.mileage.toLocaleString()} km</td>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.82rem', color: 'var(--t-orange)', fontWeight: 700 }}>{s.cost}</td>
                                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: 'var(--t-text-muted)' }}>{s.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Tab: Fuel Logs ── */}
            {tab === 'fuel' && (
                <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--t-surface)' }}>
                                {['Date', 'Litres', 'Cost', 'Odometer', 'Station'].map(col => (
                                    <th key={col} style={{ ...S.label, padding: '0.75rem 1rem', textAlign: 'left' }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {FUEL_LOGS.map((f, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--t-border-subtle)' }}
                                    onMouseEnter={e => (e.currentTarget as any).style.background = 'var(--t-row-hover)'}
                                    onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.78rem', color: 'var(--t-text-muted)' }}>{f.date}</td>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, color: 'var(--t-green)', fontWeight: 700 }}>{f.litres} L</td>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, color: 'var(--t-orange)', fontWeight: 700 }}>{f.cost}</td>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.78rem', color: 'var(--t-cyan)' }}>{f.odometer.toLocaleString()} km</td>
                                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem' }}>{f.station}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Tab: Documents ── */}
            {tab === 'docs' && (
                <div style={S.card}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { doc: 'Registration Certificate', expires: '15 Jan 2025', status: 'Valid' },
                            { doc: 'Insurance Policy', expires: '15 Jan 2025', status: 'Valid' },
                            { doc: 'RTA Inspection Report', expires: '1 Jun 2026', status: 'Valid' },
                            { doc: 'Vehicle Purchase Invoice', expires: 'N/A', status: 'Stored' },
                            { doc: 'Maintenance Log', expires: 'N/A', status: 'Stored' },
                        ].map(d => (
                            <div key={d.doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', background: 'var(--t-surface)', borderRadius: 10, border: '1px solid var(--t-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: '1.3rem' }}>📄</span>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.doc}</p>
                                        <p style={{ ...S.label, marginTop: 3 }}>Expires: {d.expires}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: d.status === 'Valid' ? 'var(--t-green-soft)' : 'var(--t-surface)', color: d.status === 'Valid' ? 'var(--t-green)' : 'var(--t-text-muted)', border: `1px solid ${d.status === 'Valid' ? 'rgba(16,185,129,0.25)' : 'var(--t-border)'}` }}>
                                        {d.status}
                                    </span>
                                    <button style={{ padding: '0.3rem 0.75rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-card)', color: 'var(--t-text-muted)', fontSize: '0.72rem', cursor: 'pointer' }}>
                                        ↓ Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
