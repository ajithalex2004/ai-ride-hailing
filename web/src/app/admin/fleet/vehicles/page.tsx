'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MidnightSelect from '@/components/ui/MidnightSelect';

/* ─── Shared styles ──────────────────────────────────────────── */
const S = {
    page: { minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '1.75rem' } as React.CSSProperties,
    card: { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16 } as React.CSSProperties,
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '-0.02em' } as React.CSSProperties,
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 800 } as React.CSSProperties,
    label: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.09em', color: 'var(--t-text-dim)' },
    mono: { fontFamily: 'var(--font-mono)' } as React.CSSProperties,
    input: { width: '100%', padding: '0.55rem 0.75rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const },
};

/* ─── Mock data ──────────────────────────────────────────────── */
const VEHICLES = [
    { id: 'VEH-001', vin: '1HGBH41JXMN109186', year: 2023, make: 'Toyota', model: 'HiAce', type: 'Van', plate: 'DXB-A-11442', driver: 'Mohammed Al-Rashid', mileage: 42180, fuel: 'Diesel', status: 'Active', dept: 'Logistics' },
    { id: 'VEH-002', vin: '2T1BURHE0JC019484', year: 2022, make: 'Mercedes', model: 'Sprinter', type: 'Heavy Van', plate: 'DXB-B-88812', driver: 'Ahmed Al-Sayed', mileage: 78440, fuel: 'Diesel', status: 'In Shop', dept: 'Maintenance' },
    { id: 'VEH-003', vin: '3VWFE21C04M000001', year: 2024, make: 'Ford', model: 'Transit', type: 'Cargo Van', plate: 'AUH-C-10234', driver: 'Unassigned', mileage: 12300, fuel: 'Diesel', status: 'Active', dept: 'Operations' },
    { id: 'VEH-004', vin: '4T1BF3EK5AU518069', year: 2023, make: 'Toyota', model: 'Camry', type: 'Sedan', plate: 'DXB-D-55617', driver: 'Sara Al-Hamer', mileage: 32100, fuel: 'Hybrid', status: 'Active', dept: 'Executive' },
    { id: 'VEH-005', vin: '5UXWX7C5XBA723456', year: 2021, make: 'BMW', model: 'X5', type: 'SUV', plate: 'DXB-E-22001', driver: 'Khalid Ibrahim', mileage: 91200, fuel: 'Petrol', status: 'Active', dept: 'VIP' },
    { id: 'VEH-006', vin: '6G1ZB5ST1KF199245', year: 2022, make: 'Chevrolet', model: 'Suburban', type: 'SUV', plate: 'SHJ-F-77800', driver: 'Unassigned', mileage: 54300, fuel: 'Petrol', status: 'Inactive', dept: 'Logistics' },
    { id: 'VEH-007', vin: '7FBSS3B13KE008765', year: 2023, make: 'Toyota', model: 'Coaster', type: 'Minibus', plate: 'DXB-G-33412', driver: 'Zayed Al-Marri', mileage: 28990, fuel: 'Diesel', status: 'Active', dept: 'Shuttle' },
    { id: 'VEH-008', vin: '8AFACGEC5G5322031', year: 2020, make: 'Isuzu', model: 'NPR', type: 'Truck', plate: 'AJM-H-00112', driver: 'Omar Farouk', mileage: 112400, fuel: 'Diesel', status: 'Out of Service', dept: 'Heavy Ops' },
    { id: 'VEH-009', vin: '9C6RN71A38B603455', year: 2024, make: 'Tesla', model: 'Model Y', type: 'Sedan', plate: 'DXB-I-99001', driver: 'Noura Al-Zaabi', mileage: 8500, fuel: 'Electric', status: 'Active', dept: 'Executive' },
    { id: 'VEH-010', vin: 'JTMRJREV0HD218766', year: 2023, make: 'Lexus', model: 'LX 600', type: 'SUV', plate: 'DXB-J-15523', driver: 'Fahad Al-Otaibi', mileage: 19800, fuel: 'Petrol', status: 'Active', dept: 'VIP' },
    { id: 'VEH-011', vin: '1FTFW1ET5DFC10312', year: 2022, make: 'Ford', model: 'F-150', type: 'Pickup', plate: 'DXB-K-48800', driver: 'Hassan Mukhtar', mileage: 67100, fuel: 'Petrol', status: 'In Shop', dept: 'Field Ops' },
    { id: 'VEH-012', vin: 'WBA8B9G5XJN135823', year: 2023, make: 'BMW', model: '5 Series', type: 'Sedan', plate: 'DXB-L-60444', driver: 'Amna Al-Ali', mileage: 24700, fuel: 'Hybrid', status: 'Active', dept: 'Executive' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
    'Active': { bg: 'var(--t-green-soft)', color: 'var(--t-green)', border: 'rgba(16,185,129,0.25)' },
    'In Shop': { bg: 'var(--t-orange-soft)', color: 'var(--t-orange)', border: 'rgba(249,115,22,0.25)' },
    'Inactive': { bg: 'var(--t-surface)', color: 'var(--t-text-muted)', border: 'var(--t-border)' },
    'Out of Service': { bg: 'var(--t-red-soft)', color: 'var(--t-red)', border: 'rgba(239,68,68,0.25)' },
};

const FUEL_ICON: Record<string, string> = { Diesel: '⛽', Petrol: '⛽', Hybrid: '🔋', Electric: '⚡' };
const TYPE_OPTIONS = [
    { value: '', label: 'All Types' },
    { value: 'Van', label: 'Van' }, { value: 'Heavy Van', label: 'Heavy Van' },
    { value: 'Cargo Van', label: 'Cargo Van' }, { value: 'Sedan', label: 'Sedan' },
    { value: 'SUV', label: 'SUV' }, { value: 'Minibus', label: 'Minibus' },
    { value: 'Truck', label: 'Truck' }, { value: 'Pickup', label: 'Pickup' },
];
const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'Active', label: 'Active' }, { value: 'In Shop', label: 'In Shop' },
    { value: 'Inactive', label: 'Inactive' }, { value: 'Out of Service', label: 'Out of Service' },
];

/* ─── Add Vehicle Modal ──────────────────────────────────────── */
function AddVehicleModal({ onClose, onAdd }: { onClose: () => void; onAdd: (v: any) => void }) {
    const [form, setForm] = useState({ make: '', model: '', year: '2024', type: 'Sedan', plate: '', vin: '', fuel: 'Diesel', dept: 'Operations', driver: 'Unassigned' });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ ...form, id: `VEH-${String(Date.now()).slice(-3)}`, mileage: 0, status: 'Active' });
        onClose();
    };

    const fields: { key: string; label: string; placeholder?: string }[] = [
        { key: 'make', label: 'Make', placeholder: 'Toyota' },
        { key: 'model', label: 'Model', placeholder: 'HiAce' },
        { key: 'year', label: 'Year', placeholder: '2024' },
        { key: 'plate', label: 'Plate No.', placeholder: 'DXB-A-12345' },
        { key: 'vin', label: 'VIN', placeholder: '1HGBH41...' },
        { key: 'driver', label: 'Driver', placeholder: 'Unassigned' },
        { key: 'dept', label: 'Department', placeholder: 'Operations' },
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 20, padding: '1.75rem', width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ ...S.h2, fontSize: '1.1rem' }}>Add New Vehicle</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t-text-muted)', fontSize: '1.25rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
                        {fields.map(f => (
                            <div key={f.key}>
                                <label style={{ ...S.label, display: 'block', marginBottom: 5 }}>{f.label}</label>
                                <input style={S.input} required value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
                            </div>
                        ))}
                        <div>
                            <MidnightSelect label="Vehicle Type" value={form.type} onChange={v => set('type', v)}
                                options={TYPE_OPTIONS.filter(o => o.value)} />
                        </div>
                        <div>
                            <MidnightSelect label="Fuel Type" value={form.fuel} onChange={v => set('fuel', v)}
                                options={['Diesel', 'Petrol', 'Hybrid', 'Electric'].map(v => ({ value: v, label: `${FUEL_ICON[v]} ${v}` }))} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                        <button type="button" onClick={onClose}
                            style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit"
                            style={{ flex: 2, padding: '0.7rem', borderRadius: 10, border: 'none', background: 'var(--t-accent)', color: 'var(--t-accent-contrast)', fontFamily: 'var(--font-heading)', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                            Save Vehicle →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function VehicleMasterPage() {
    const [vehicles, setVehicles] = useState(VEHICLES);
    const [search, setSearch] = useState('');
    const [typeFilter, setType] = useState('');
    const [statusFilter, setStat] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [page, setPage] = useState(0);
    const PER_PAGE = 8;

    const filtered = vehicles.filter(v => {
        const q = search.toLowerCase();
        const matchSearch = !q || v.id.toLowerCase().includes(q) || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q) || v.vin.toLowerCase().includes(q);
        const matchType = !typeFilter || v.type === typeFilter;
        const matchStatus = !statusFilter || v.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    });

    const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    const pages = Math.ceil(filtered.length / PER_PAGE);

    const statusCounts = { Active: 0, 'In Shop': 0, Inactive: 0, 'Out of Service': 0 } as Record<string, number>;
    vehicles.forEach(v => { statusCounts[v.status] = (statusCounts[v.status] ?? 0) + 1; });

    return (
        <div style={S.page}>
            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Link href="/admin/fleet" style={{ ...S.label, color: 'var(--t-accent)', textDecoration: 'none' }}>← Fleet Dashboard</Link>
                    </div>
                    <h1 style={{ ...S.h1, fontSize: '2rem', marginBottom: '0.25rem' }}>Vehicle Master</h1>
                    <p style={{ color: 'var(--t-text-muted)', fontSize: '0.85rem' }}>
                        Complete registry of {vehicles.length} fleet vehicles
                    </p>
                </div>
                <button onClick={() => setShowAdd(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 1.25rem', borderRadius: 10, border: 'none', background: 'var(--t-accent)', color: 'var(--t-accent-contrast)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                    + Add Vehicle
                </button>
            </div>

            {/* ── Status KPI strip ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {Object.entries(statusCounts).map(([status, count]) => {
                    const ss = STATUS_STYLE[status];
                    return (
                        <div key={status} onClick={() => setStat(prev => prev === status ? '' : status)}
                            style={{ ...S.card, padding: '1rem', cursor: 'pointer', borderColor: statusFilter === status ? ss.color : 'var(--t-border)', transition: 'border-color 0.15s' }}>
                            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.6rem', color: ss.color, marginBottom: 4 }}>{count}</p>
                            <p style={{ ...S.label }}>{status}</p>
                        </div>
                    );
                })}
            </div>

            {/* ── Filters bar ── */}
            <div style={{ ...S.card, padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
                    placeholder="🔍  Search VIN, plate, make, model, driver…"
                    style={{ ...S.input, flex: 1, minWidth: 220 }} />
                <div style={{ minWidth: 160 }}>
                    <MidnightSelect value={typeFilter} onChange={v => { setType(v); setPage(0); }} options={TYPE_OPTIONS} size="sm" />
                </div>
                <div style={{ minWidth: 175 }}>
                    <MidnightSelect value={statusFilter} onChange={v => { setStat(v); setPage(0); }} options={STATUS_OPTIONS} size="sm" />
                </div>
                {(search || typeFilter || statusFilter) && (
                    <button onClick={() => { setSearch(''); setType(''); setStat(''); setPage(0); }}
                        style={{ padding: '0.45rem 0.875rem', borderRadius: 8, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text-muted)', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                        Clear ✕
                    </button>
                )}
            </div>

            {/* ── Table ── */}
            <div style={{ ...S.card, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--t-surface)' }}>
                            {['ID', 'Year / Make', 'Model', 'Type', 'Plate No.', 'VIN', 'Driver', 'Mileage', 'Fuel', 'Dept', 'Status', ''].map(col => (
                                <th key={col} style={{ ...S.label, padding: '0.75rem 1rem', textAlign: 'left', whiteSpace: 'nowrap' }}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(v => {
                            const ss = STATUS_STYLE[v.status] ?? STATUS_STYLE['Inactive'];
                            return (
                                <tr key={v.id}
                                    onMouseEnter={e => (e.currentTarget as any).style.background = 'var(--t-row-hover)'}
                                    onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}
                                    style={{ borderBottom: '1px solid var(--t-border-subtle)', transition: 'background 0.1s' }}>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.7rem', color: 'var(--t-text-dim)' }}>{v.id}</td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{v.make}</p>
                                        <p style={{ ...S.mono, fontSize: '0.68rem', color: 'var(--t-text-dim)' }}>{v.year}</p>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.85rem' }}>{v.model}</td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <span style={{ padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, background: 'var(--t-surface)', color: 'var(--t-text-muted)', border: '1px solid var(--t-border)' }}>
                                            {v.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.78rem', color: 'var(--t-accent)', fontWeight: 700 }}>{v.plate}</td>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.68rem', color: 'var(--t-text-dim)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{v.vin}</td>
                                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: v.driver === 'Unassigned' ? 'var(--t-text-dim)' : 'var(--t-text)' }}>{v.driver}</td>
                                    <td style={{ padding: '0.875rem 1rem', ...S.mono, fontSize: '0.78rem', color: 'var(--t-cyan)' }}>{v.mileage.toLocaleString()} km</td>
                                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem' }}>{FUEL_ICON[v.fuel]} {v.fuel}</td>
                                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: 'var(--t-text-muted)' }}>{v.dept}</td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, whiteSpace: 'nowrap' as const }}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.875rem 1rem' }}>
                                        <Link href={`/admin/fleet/vehicles/${v.id}`}
                                            style={{ padding: '0.3rem 0.75rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text-muted)', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' as const, transition: 'all 0.15s' }}>
                                            View →
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                {pages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderTop: '1px solid var(--t-border)' }}>
                        <p style={{ ...S.label, color: 'var(--t-text-dim)' }}>
                            Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
                        </p>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {Array.from({ length: pages }, (_, i) => (
                                <button key={i} onClick={() => setPage(i)}
                                    style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${i === page ? 'var(--t-accent)' : 'var(--t-border)'}`, background: i === page ? 'var(--t-accent-soft)' : 'var(--t-surface)', color: i === page ? 'var(--t-accent)' : 'var(--t-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: i === page ? 800 : 400 }}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center' as const, color: 'var(--t-text-muted)' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
                        <p style={{ fontWeight: 600 }}>No vehicles match your filters</p>
                    </div>
                )}
            </div>

            {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} onAdd={v => setVehicles(p => [v, ...p])} />}
        </div>
    );
}
