'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import MidnightSelect from '@/components/ui/MidnightSelect';

/* ── theme ── */
const S = {
    page: { minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '1.75rem' } as React.CSSProperties,
    card: { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16 } as React.CSSProperties,
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '-0.02em' } as React.CSSProperties,
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 800 } as React.CSSProperties,
    lbl: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.09em', color: 'var(--t-text-dim)' },
    mono: { fontFamily: 'var(--font-mono)' } as React.CSSProperties,
    inp: { width: '100%', padding: '0.55rem 0.75rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const },
};
const MUT = '#8899AB';

/* ── types ── */
type Vehicle = {
    id: string; vin: string; year: number; make: string; model: string; type: string;
    plate: string; driver: string; mileage: number; fuel: string; status: string; dept: string;
    color: string; seats: number; notes: string;
};

/* ── seed data ── */
const SEED: Vehicle[] = [
    { id: 'VEH-001', vin: '1HGBH41JXMN109186', year: 2023, make: 'Toyota', model: 'HiAce', type: 'Van', plate: 'DXB-A-11442', driver: 'Mohammed Al-Rashid', mileage: 42180, fuel: 'Diesel', status: 'Active', dept: 'Logistics', color: 'White', seats: 12, notes: '' },
    { id: 'VEH-002', vin: '2T1BURHE0JC019484', year: 2022, make: 'Mercedes', model: 'Sprinter', type: 'Heavy Van', plate: 'DXB-B-88812', driver: 'Ahmed Al-Sayed', mileage: 78440, fuel: 'Diesel', status: 'In Shop', dept: 'Maintenance', color: 'Silver', seats: 16, notes: 'Brake service in progress' },
    { id: 'VEH-003', vin: '3VWFE21C04M000001', year: 2024, make: 'Ford', model: 'Transit', type: 'Cargo Van', plate: 'AUH-C-10234', driver: 'Unassigned', mileage: 12300, fuel: 'Diesel', status: 'Active', dept: 'Operations', color: 'White', seats: 3, notes: '' },
    { id: 'VEH-004', vin: '4T1BF3EK5AU518069', year: 2023, make: 'Toyota', model: 'Camry', type: 'Sedan', plate: 'DXB-D-55617', driver: 'Sara Al-Hamer', mileage: 32100, fuel: 'Hybrid', status: 'Active', dept: 'Executive', color: 'Black', seats: 5, notes: '' },
    { id: 'VEH-005', vin: '5UXWX7C5XBA723456', year: 2021, make: 'BMW', model: 'X5', type: 'SUV', plate: 'DXB-E-22001', driver: 'Khalid Ibrahim', mileage: 91200, fuel: 'Petrol', status: 'Active', dept: 'VIP', color: 'Black', seats: 5, notes: '' },
    { id: 'VEH-006', vin: '6G1ZB5ST1KF199245', year: 2022, make: 'Chevrolet', model: 'Suburban', type: 'SUV', plate: 'SHJ-F-77800', driver: 'Unassigned', mileage: 54300, fuel: 'Petrol', status: 'Inactive', dept: 'Logistics', color: 'White', seats: 8, notes: 'Retired from active duty' },
    { id: 'VEH-007', vin: '7FBSS3B13KE008765', year: 2023, make: 'Toyota', model: 'Coaster', type: 'Minibus', plate: 'DXB-G-33412', driver: 'Zayed Al-Marri', mileage: 28990, fuel: 'Diesel', status: 'Active', dept: 'Shuttle', color: 'Blue', seats: 30, notes: '' },
    { id: 'VEH-008', vin: '8AFACGEC5G5322031', year: 2020, make: 'Isuzu', model: 'NPR', type: 'Truck', plate: 'AJM-H-00112', driver: 'Omar Farouk', mileage: 112400, fuel: 'Diesel', status: 'Out of Service', dept: 'Heavy Ops', color: 'Red', seats: 3, notes: 'Engine overhaul needed' },
    { id: 'VEH-009', vin: '9C6RN71A38B603455', year: 2024, make: 'Tesla', model: 'Model Y', type: 'Sedan', plate: 'DXB-I-99001', driver: 'Noura Al-Zaabi', mileage: 8500, fuel: 'Electric', status: 'Active', dept: 'Executive', color: 'White', seats: 5, notes: '' },
    { id: 'VEH-010', vin: 'JTMRJREV0HD218766', year: 2023, make: 'Lexus', model: 'LX 600', type: 'SUV', plate: 'DXB-J-15523', driver: 'Fahad Al-Otaibi', mileage: 19800, fuel: 'Petrol', status: 'Active', dept: 'VIP', color: 'Black', seats: 7, notes: '' },
    { id: 'VEH-011', vin: '1FTFW1ET5DFC10312', year: 2022, make: 'Ford', model: 'F-150', type: 'Pickup', plate: 'DXB-K-48800', driver: 'Hassan Mukhtar', mileage: 67100, fuel: 'Petrol', status: 'In Shop', dept: 'Field Ops', color: 'Grey', seats: 5, notes: 'Tyre replacement' },
    { id: 'VEH-012', vin: 'WBA8B9G5XJN135823', year: 2023, make: 'BMW', model: '5 Series', type: 'Sedan', plate: 'DXB-L-60444', driver: 'Amna Al-Ali', mileage: 24700, fuel: 'Hybrid', status: 'Active', dept: 'Executive', color: 'Blue', seats: 5, notes: '' },
];

let _seq = 13;
const mkId = () => `VEH-${String(_seq++).padStart(3, '0')}`;

/* ── option lists ── */
const TYPE_OPTS = ['Van', 'Heavy Van', 'Cargo Van', 'Sedan', 'SUV', 'Minibus', 'Truck', 'Pickup', 'Other'].map(v => ({ value: v, label: v }));
const FUEL_OPTS = ['Diesel', 'Petrol', 'Hybrid', 'Electric'].map(v => ({ value: v, label: v }));
const STATUS_OPTS = ['Active', 'In Shop', 'Inactive', 'Out of Service'].map(v => ({ value: v, label: v }));
const DEPT_OPTS = ['Logistics', 'Maintenance', 'Operations', 'Executive', 'VIP', 'Shuttle', 'Field Ops', 'Heavy Ops'].map(v => ({ value: v, label: v }));
const COLOR_OPTS = ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Other'].map(v => ({ value: v, label: v }));

const FUEL_ICON: Record<string, string> = { Diesel: '🛢️', Petrol: '⛽', Hybrid: '🔋', Electric: '⚡' };

const SS: Record<string, { bg: string; color: string; border: string }> = {
    'Active': { bg: 'rgba(16,185,129,0.1)', color: 'var(--t-green)', border: 'rgba(16,185,129,0.3)' },
    'In Shop': { bg: 'rgba(249,115,22,0.1)', color: 'var(--t-orange)', border: 'rgba(249,115,22,0.3)' },
    'Inactive': { bg: 'var(--t-surface)', color: MUT, border: 'var(--t-border)' },
    'Out of Service': { bg: 'rgba(239,68,68,0.1)', color: 'var(--t-red)', border: 'rgba(239,68,68,0.3)' },
};

/* ── blank vehicle ── */
const blank = (): Omit<Vehicle, 'id'> => ({
    vin: '', year: new Date().getFullYear(), make: '', model: '', type: 'Sedan',
    plate: '', driver: 'Unassigned', mileage: 0, fuel: 'Petrol', status: 'Active',
    dept: 'Operations', color: 'White', seats: 5, notes: '',
});

/* ── VehicleForm (shared Add / Edit) ── */
function VehicleForm({ title, initial, onSave, onClose }: {
    title: string; initial: Omit<Vehicle, 'id'>; onSave: (v: Omit<Vehicle, 'id'>) => void; onClose: () => void;
}) {
    const [f, setF] = useState({ ...initial });
    const set = (k: keyof typeof f, v: any) => setF(p => ({ ...p, [k]: v }));

    const textFields: { key: keyof typeof f; label: string; placeholder: string; half?: boolean }[] = [
        { key: 'make', label: 'Make', placeholder: 'Toyota', half: true },
        { key: 'model', label: 'Model', placeholder: 'HiAce', half: true },
        { key: 'year', label: 'Year', placeholder: '2024', half: true },
        { key: 'plate', label: 'Plate No.', placeholder: 'DXB-A-12345', half: true },
        { key: 'vin', label: 'VIN', placeholder: '1HGBH41...', half: false },
        { key: 'driver', label: 'Assigned Driver', placeholder: 'Unassigned', half: true },
        { key: 'mileage', label: 'Mileage (km)', placeholder: '0', half: true },
        { key: 'seats', label: 'Seats', placeholder: '5', half: true },
    ];

    const valid = f.make.trim() && f.model.trim() && f.plate.trim();

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...S.card, padding: '1.75rem', width: '100%', maxWidth: 560, boxShadow: '0 32px 80px rgba(0,0,0,0.5)', maxHeight: '92vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ ...S.h2, fontSize: '1.1rem' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUT, fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
                    {textFields.filter(tf => tf.half).map(tf => (
                        <div key={tf.key as string}>
                            <label style={{ ...S.lbl, display: 'block', marginBottom: 5 }}>{tf.label}</label>
                            <input style={S.inp} value={(f as any)[tf.key]} onChange={e => set(tf.key, tf.key === 'year' || tf.key === 'mileage' || tf.key === 'seats' ? Number(e.target.value) : e.target.value)} placeholder={tf.placeholder} />
                        </div>
                    ))}
                </div>

                {/* VIN full width */}
                <div style={{ marginBottom: '0.875rem' }}>
                    <label style={{ ...S.lbl, display: 'block', marginBottom: 5 }}>VIN</label>
                    <input style={S.inp} value={f.vin} onChange={e => set('vin', e.target.value)} placeholder="1HGBH41JXMN109186" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
                    <MidnightSelect label="Vehicle Type" value={f.type} onChange={v => set('type', v)} options={TYPE_OPTS} />
                    <MidnightSelect label="Fuel Type" value={f.fuel} onChange={v => set('fuel', v)} options={FUEL_OPTS} />
                    <MidnightSelect label="Status" value={f.status} onChange={v => set('status', v)} options={STATUS_OPTS} />
                    <MidnightSelect label="Department" value={f.dept} onChange={v => set('dept', v)} options={DEPT_OPTS} />
                    <MidnightSelect label="Colour" value={f.color} onChange={v => set('color', v)} options={COLOR_OPTS} />
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ ...S.lbl, display: 'block', marginBottom: 5 }}>Notes</label>
                    <textarea value={f.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Optional notes or remarks…"
                        style={{ ...S.inp, resize: 'vertical' as const }} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => { if (!valid) return; onSave(f); onClose(); }} disabled={!valid}
                        style={{ flex: 2, padding: '0.65rem', borderRadius: 10, border: 'none', background: valid ? 'var(--t-accent)' : 'var(--t-border)', color: valid ? '#000' : 'var(--t-text-dim)', ...S.h2, fontSize: '0.88rem', cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '0 4px 12px rgba(245,158,11,0.25)' : 'none' }}>
                        Save Vehicle →
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── ViewModal ── */
function ViewModal({ v, onEdit, onDelete, onClose }: { v: Vehicle; onEdit: () => void; onDelete: () => void; onClose: () => void }) {
    const ss = SS[v.status] ?? SS['Inactive'];
    const rows: [string, string | number][] = [
        ['ID', v.id],
        ['VIN', v.vin || '—'],
        ['Year', v.year],
        ['Make', v.make],
        ['Model', v.model],
        ['Type', v.type],
        ['Plate No.', v.plate],
        ['Fuel', `${FUEL_ICON[v.fuel] ?? ''} ${v.fuel}`],
        ['Colour', v.color],
        ['Seats', v.seats],
        ['Mileage', `${v.mileage.toLocaleString()} km`],
        ['Driver', v.driver],
        ['Department', v.dept],
        ['Status', v.status],
        ['Notes', v.notes || '—'],
    ];
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...S.card, padding: '1.75rem', width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
                {/* header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <span style={{ fontSize: '2rem' }}>🚗</span>
                            <div>
                                <h2 style={{ ...S.h2, fontSize: '1.05rem', marginBottom: 2 }}>{v.year} {v.make} {v.model}</h2>
                                <p style={{ ...S.mono, fontSize: '0.7rem', color: 'var(--t-accent)' }}>{v.plate}</p>
                            </div>
                        </div>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{v.status}</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUT, fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                </div>

                {rows.map(([k, val]) => (
                    <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.55rem 0', borderBottom: '1px solid var(--t-border)' }}>
                        <span style={{ ...S.lbl, fontSize: '0.6rem' }}>{k as string}</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, textAlign: 'right' as const, maxWidth: '65%', color: k === 'Plate No.' ? 'var(--t-accent)' : k === 'Status' ? ss.color : 'var(--t-text)' }}>{val as string}</span>
                    </div>
                ))}

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer' }}>Close</button>
                    <button onClick={onEdit} style={{ flex: 2, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-accent)44', background: 'var(--t-accent-soft)', color: 'var(--t-accent)', ...S.h2, fontSize: '0.85rem', cursor: 'pointer' }}>✏️ Edit</button>
                    <button onClick={onDelete} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: 'var(--t-red)', ...S.h2, fontSize: '0.85rem', cursor: 'pointer' }}>🗑</button>
                </div>
                <div style={{ marginTop: 10 }}>
                    <Link href={`/admin/fleet/vehicles/${v.id}`} style={{ display: 'block', padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, fontSize: '0.8rem', textAlign: 'center' as const, textDecoration: 'none' }}>
                        🔍 Open Full Vehicle Detail →
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ── DeleteModal ── */
function DeleteModal({ v, onConfirm, onClose }: { v: Vehicle; onConfirm: () => void; onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
            <div style={{ ...S.card, padding: '1.75rem', width: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>🗑️</p>
                <h2 style={{ ...S.h2, fontSize: '1rem', marginBottom: 8 }}>Remove Vehicle?</h2>
                <p style={{ fontSize: '0.82rem', color: MUT, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    This will permanently remove <b>{v.id}</b> — {v.year} {v.make} {v.model} (<b>{v.plate}</b>) from the fleet registry. This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => { onConfirm(); onClose(); }} style={{ flex: 2, padding: '0.65rem', borderRadius: 10, border: 'none', background: 'var(--t-red)', color: '#fff', ...S.h2, fontSize: '0.88rem', cursor: 'pointer' }}>
                        Delete Vehicle
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Main Page ── */
export default function VehicleMasterPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>(SEED);
    const [search, setSearch] = useState('');
    const [fType, setFType] = useState('');
    const [fStatus, setFStatus] = useState('');
    const [pg, setPg] = useState(0);
    const PER = 8;

    /* modals */
    const [showAdd, setShowAdd] = useState(false);
    const [editV, setEditV] = useState<Vehicle | null>(null);
    const [viewV, setViewV] = useState<Vehicle | null>(null);
    const [delV, setDelV] = useState<Vehicle | null>(null);

    const filtered = useMemo(() =>
        vehicles.filter(v => {
            const q = search.toLowerCase();
            return (!q || [v.id, v.make, v.model, v.plate, v.vin, v.driver].some(s => s.toLowerCase().includes(q)))
                && (!fType || v.type === fType)
                && (!fStatus || v.status === fStatus);
        })
        , [vehicles, search, fType, fStatus]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER));
    const paged = filtered.slice(pg * PER, (pg + 1) * PER);

    const counts: Record<string, number> = { Active: 0, 'In Shop': 0, Inactive: 0, 'Out of Service': 0 };
    vehicles.forEach(v => { counts[v.status] = (counts[v.status] ?? 0) + 1; });

    const addVehicle = (v: Omit<Vehicle, 'id'>) => setVehicles(p => [{ ...v, id: mkId() }, ...p]);
    const saveEdit = (v: Omit<Vehicle, 'id'>) => setVehicles(p => p.map(x => x.id === editV?.id ? { ...v, id: x.id } : x));
    const deleteById = (id: string) => setVehicles(p => p.filter(x => x.id !== id));

    const selStyle = { minWidth: 160 };

    return (
        <div style={S.page}>
            {/* header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Link href="/admin/fleet" style={{ ...S.lbl, color: 'var(--t-accent)', textDecoration: 'none' }}>← Fleet Dashboard</Link>
                    </div>
                    <h1 style={{ ...S.h1, fontSize: '2rem', marginBottom: '0.25rem' }}>Vehicle Master</h1>
                    <p style={{ color: MUT, fontSize: '0.85rem' }}>Complete registry of {vehicles.length} fleet vehicles</p>
                </div>
                <button onClick={() => setShowAdd(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 1.25rem', borderRadius: 10, border: 'none', background: 'var(--t-accent)', color: '#000', ...S.h2, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                    + Add Vehicle
                </button>
            </div>

            {/* KPI strip — clickable filter */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {Object.entries(counts).map(([status, count]) => {
                    const ss = SS[status];
                    return (
                        <div key={status} onClick={() => { setFStatus(p => p === status ? '' : status); setPg(0); }}
                            style={{ ...S.card, padding: '1rem', cursor: 'pointer', borderColor: fStatus === status ? ss.color : 'var(--t-border)', transition: 'border-color 0.15s' }}>
                            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.6rem', color: ss.color, marginBottom: 4 }}>{count}</p>
                            <p style={S.lbl}>{status}</p>
                        </div>
                    );
                })}
            </div>

            {/* filters */}
            <div style={{ ...S.card, padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input value={search} onChange={e => { setSearch(e.target.value); setPg(0); }}
                    placeholder="🔍  Search VIN, plate, make, model, driver…"
                    style={{ ...S.inp, flex: 1, minWidth: 220 }} />
                <div style={selStyle}>
                    <MidnightSelect value={fType} onChange={v => { setFType(v); setPg(0); }} size="sm"
                        options={[{ value: '', label: 'All Types' }, ...TYPE_OPTS]} />
                </div>
                <div style={selStyle}>
                    <MidnightSelect value={fStatus} onChange={v => { setFStatus(v); setPg(0); }} size="sm"
                        options={[{ value: '', label: 'All Statuses' }, ...STATUS_OPTS]} />
                </div>
                {(search || fType || fStatus) && (
                    <button onClick={() => { setSearch(''); setFType(''); setFStatus(''); setPg(0); }}
                        style={{ padding: '0.45rem 0.875rem', borderRadius: 8, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                        Clear ✕
                    </button>
                )}
            </div>

            {/* table */}
            <div style={{ ...S.card, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--t-surface)' }}>
                            {['ID', 'Year / Make', 'Model', 'Type', 'Plate No.', 'VIN', 'Driver', 'Mileage', 'Fuel', 'Dept', 'Status', 'Actions'].map(col => (
                                <th key={col} style={{ ...S.lbl, padding: '0.75rem 0.75rem', textAlign: 'left', whiteSpace: 'nowrap' }}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(v => {
                            const ss = SS[v.status] ?? SS['Inactive'];
                            return (
                                <tr key={v.id}
                                    onMouseEnter={e => (e.currentTarget as any).style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}
                                    style={{ borderBottom: '1px solid #1e2d3e', transition: 'background 0.1s' }}>
                                    <td style={{ padding: '0.8rem 0.75rem', ...S.mono, fontSize: '0.68rem', color: 'var(--t-text-dim)' }}>{v.id}</td>
                                    <td style={{ padding: '0.8rem 0.75rem' }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.84rem' }}>{v.make}</p>
                                        <p style={{ ...S.mono, fontSize: '0.65rem', color: MUT }}>{v.year}</p>
                                    </td>
                                    <td style={{ padding: '0.8rem 0.75rem', fontWeight: 600, fontSize: '0.84rem' }}>{v.model}</td>
                                    <td style={{ padding: '0.8rem 0.75rem' }}>
                                        <span style={{ padding: '0.15rem 0.45rem', borderRadius: 6, fontSize: '0.62rem', fontWeight: 700, background: 'var(--t-surface)', color: MUT, border: '1px solid var(--t-border)', whiteSpace: 'nowrap' as const }}>{v.type}</span>
                                    </td>
                                    <td style={{ padding: '0.8rem 0.75rem', ...S.mono, fontSize: '0.76rem', color: 'var(--t-accent)', fontWeight: 700 }}>{v.plate}</td>
                                    <td style={{ padding: '0.8rem 0.75rem', ...S.mono, fontSize: '0.64rem', color: MUT, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{v.vin}</td>
                                    <td style={{ padding: '0.8rem 0.75rem', fontSize: '0.8rem', color: v.driver === 'Unassigned' ? MUT : 'var(--t-text)' }}>{v.driver}</td>
                                    <td style={{ padding: '0.8rem 0.75rem', ...S.mono, fontSize: '0.76rem', color: 'var(--t-cyan)' }}>{v.mileage.toLocaleString()} km</td>
                                    <td style={{ padding: '0.8rem 0.75rem', fontSize: '0.78rem' }}>{FUEL_ICON[v.fuel]} {v.fuel}</td>
                                    <td style={{ padding: '0.8rem 0.75rem', fontSize: '0.76rem', color: MUT }}>{v.dept}</td>
                                    <td style={{ padding: '0.8rem 0.75rem' }}>
                                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: 999, fontSize: '0.6rem', fontWeight: 800, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, whiteSpace: 'nowrap' as const }}>{v.status}</span>
                                    </td>
                                    <td style={{ padding: '0.8rem 0.75rem' }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button onClick={() => setViewV(v)} title="View" style={{ padding: '0.28rem 0.5rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer', fontSize: '0.72rem' }}>👁</button>
                                            <button onClick={() => setEditV(v)} title="Edit" style={{ padding: '0.28rem 0.5rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-accent)', cursor: 'pointer', fontSize: '0.72rem' }}>✏️</button>
                                            <button onClick={() => setDelV(v)} title="Delete" style={{ padding: '0.28rem 0.5rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-red)', cursor: 'pointer', fontSize: '0.72rem' }}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* empty state */}
                {filtered.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center' as const, color: MUT }}>
                        <p style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</p>
                        <p style={{ fontWeight: 600 }}>No vehicles match your filters</p>
                    </div>
                )}

                {/* pagination */}
                {pages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderTop: '1px solid var(--t-border)', background: 'var(--t-surface)' }}>
                        <p style={{ ...S.lbl, color: MUT }}>
                            Showing {pg * PER + 1}–{Math.min((pg + 1) * PER, filtered.length)} of {filtered.length}
                        </p>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <button disabled={pg === 0} onClick={() => setPg(p => p - 1)} style={{ padding: '0.3rem 0.6rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-card)', color: pg === 0 ? 'var(--t-border)' : MUT, cursor: pg === 0 ? 'not-allowed' : 'pointer' }}>←</button>
                            {Array.from({ length: pages }, (_, i) => (
                                <button key={i} onClick={() => setPg(i)} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${i === pg ? 'var(--t-accent)' : 'var(--t-border)'}`, background: i === pg ? 'var(--t-accent-soft)' : 'var(--t-card)', color: i === pg ? 'var(--t-accent)' : MUT, ...S.mono, fontSize: '0.72rem', cursor: 'pointer', fontWeight: i === pg ? 800 : 400 }}>{i + 1}</button>
                            ))}
                            <button disabled={pg === pages - 1} onClick={() => setPg(p => p + 1)} style={{ padding: '0.3rem 0.6rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-card)', color: pg === pages - 1 ? 'var(--t-border)' : MUT, cursor: pg === pages - 1 ? 'not-allowed' : 'pointer' }}>→</button>
                        </div>
                    </div>
                )}
            </div>

            {/* modals */}
            {showAdd && <VehicleForm title="Add New Vehicle" initial={blank()} onSave={addVehicle} onClose={() => setShowAdd(false)} />}
            {editV && <VehicleForm title="Edit Vehicle" initial={editV} onSave={saveEdit} onClose={() => setEditV(null)} />}
            {viewV && <ViewModal v={viewV} onEdit={() => { setEditV(viewV); setViewV(null); }} onDelete={() => { setDelV(viewV); setViewV(null); }} onClose={() => setViewV(null)} />}
            {delV && <DeleteModal v={delV} onConfirm={() => deleteById(delV.id)} onClose={() => setDelV(null)} />}
        </div >
    );
}
