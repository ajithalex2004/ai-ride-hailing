'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

/* ── theme shortcuts ── */
const card = { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16 } as React.CSSProperties;
const mono = { fontFamily: 'var(--font-mono)' } as React.CSSProperties;
const hdg = { fontFamily: 'var(--font-heading)', fontWeight: 900 } as React.CSSProperties;
const lbl = { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.09em', color: 'var(--t-text-dim)' };
const chip = (c: string) => ({ padding: '0.2rem 0.55rem', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: `${c}18`, color: c, border: `1px solid ${c}44` });
const MUT = '#8899AB';

/* ── constants ── */
const FUEL_TYPES = [
    { id: 'petrol', label: 'Petrol', color: 'var(--t-accent)', icon: '⛽' },
    { id: 'diesel', label: 'Diesel', color: 'var(--t-green)', icon: '🛢️' },
    { id: 'electric', label: 'Electric', color: 'var(--t-cyan)', icon: '⚡' },
    { id: 'hybrid', label: 'Hybrid', color: 'var(--t-purple)', icon: '🔋' },
];
const ftMap = Object.fromEntries(FUEL_TYPES.map(t => [t.id, t]));

const VEHICLES = [
    { id: 'VEH-001', label: 'Toyota HiAce', plate: 'DXB-A-11442', fuelType: 'petrol' },
    { id: 'VEH-002', label: 'Mercedes Sprinter', plate: 'DXB-B-88812', fuelType: 'diesel' },
    { id: 'VEH-003', label: 'Ford Transit', plate: 'AUH-C-10234', fuelType: 'diesel' },
    { id: 'VEH-004', label: 'Toyota Camry', plate: 'DXB-D-55617', fuelType: 'petrol' },
    { id: 'VEH-005', label: 'BMW X5', plate: 'DXB-E-22001', fuelType: 'petrol' },
    { id: 'VEH-007', label: 'Toyota Coaster', plate: 'DXB-G-33412', fuelType: 'diesel' },
    { id: 'VEH-009', label: 'Tesla Model Y', plate: 'DXB-I-99001', fuelType: 'electric' },
    { id: 'VEH-010', label: 'Lexus LX 600', plate: 'DXB-J-15523', fuelType: 'petrol' },
];
const vMap = Object.fromEntries(VEHICLES.map(v => [v.id, v]));

/* ── types ── */
type FuelEntry = {
    id: string; vehicleId: string; date: string; fuelType: string;
    litres: number; pricePerLitre: number; totalCost: number;
    odometer: number; station: string; fullTank: boolean; notes: string;
};

/* ── seed data ── */
let _seq = 100;
const mkId = () => `FUEL-${++_seq}`;

const SEED: FuelEntry[] = [
    { id: 'FUEL-001', vehicleId: 'VEH-001', date: '2026-03-02', fuelType: 'petrol', litres: 55, pricePerLitre: 3.05, totalCost: 167.75, odometer: 58420, station: 'ENOC – Sheikh Zayed Rd', fullTank: true, notes: 'Post-airport run refuel' },
    { id: 'FUEL-002', vehicleId: 'VEH-002', date: '2026-03-01', fuelType: 'diesel', litres: 80, pricePerLitre: 2.95, totalCost: 236.00, odometer: 102340, station: 'ADNOC – Industrial Area', fullTank: true, notes: 'Long haul to Abu Dhabi' },
    { id: 'FUEL-003', vehicleId: 'VEH-004', date: '2026-02-28', fuelType: 'petrol', litres: 42, pricePerLitre: 3.05, totalCost: 128.10, odometer: 44200, station: 'Shell – Al Qusais', fullTank: true, notes: '' },
    { id: 'FUEL-004', vehicleId: 'VEH-009', date: '2026-02-27', fuelType: 'electric', litres: 60, pricePerLitre: 0.50, totalCost: 30.00, odometer: 21100, station: 'DEWA EV – Dubai Mall', fullTank: true, notes: '60 kWh @ 0.50 AED/kWh' },
    { id: 'FUEL-005', vehicleId: 'VEH-005', date: '2026-02-26', fuelType: 'petrol', litres: 65, pricePerLitre: 3.17, totalCost: 206.05, odometer: 37800, station: 'BP – JBR', fullTank: true, notes: 'Premium 98 octane' },
    { id: 'FUEL-006', vehicleId: 'VEH-003', date: '2026-02-25', fuelType: 'diesel', litres: 90, pricePerLitre: 2.95, totalCost: 265.50, odometer: 88700, station: 'ADNOC – Mussafah', fullTank: true, notes: 'School bus fleet fill' },
    { id: 'FUEL-007', vehicleId: 'VEH-010', date: '2026-02-24', fuelType: 'petrol', litres: 70, pricePerLitre: 3.17, totalCost: 221.90, odometer: 29100, station: 'ENOC – Dubai Festival', fullTank: false, notes: 'Partial fill' },
    { id: 'FUEL-008', vehicleId: 'VEH-007', date: '2026-02-22', fuelType: 'diesel', litres: 85, pricePerLitre: 2.95, totalCost: 250.75, odometer: 64300, station: 'Shell – Al Ain Rd', fullTank: true, notes: '' },
    { id: 'FUEL-009', vehicleId: 'VEH-001', date: '2026-02-20', fuelType: 'petrol', litres: 50, pricePerLitre: 3.05, totalCost: 152.50, odometer: 57920, station: 'ENOC – Al Khail', fullTank: true, notes: '' },
    { id: 'FUEL-010', vehicleId: 'VEH-004', date: '2026-02-18', fuelType: 'petrol', litres: 40, pricePerLitre: 3.05, totalCost: 122.00, odometer: 43750, station: 'ADNOC – Downtown', fullTank: false, notes: 'Quick top-up' },
    { id: 'FUEL-011', vehicleId: 'VEH-002', date: '2026-02-15', fuelType: 'diesel', litres: 75, pricePerLitre: 2.95, totalCost: 221.25, odometer: 101800, station: 'ADNOC – Port Jebel Ali', fullTank: true, notes: 'Cross-emirate delivery' },
    { id: 'FUEL-012', vehicleId: 'VEH-009', date: '2026-02-12', fuelType: 'electric', litres: 55, pricePerLitre: 0.50, totalCost: 27.50, odometer: 20650, station: 'DEWA EV – Jumeirah', fullTank: true, notes: '55 kWh topped up' },
];

/* ── SVG Bar Chart ── */
function FuelBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
            {data.map(d => (
                <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
                    <span style={{ ...mono, fontSize: '0.5rem', color: d.color, fontWeight: 800 }}>
                        {d.value > 999 ? (d.value / 1000).toFixed(1) + 'k' : d.value.toFixed(0)}
                    </span>
                    <div style={{ width: '100%', background: 'var(--t-surface)', borderRadius: 5, overflow: 'hidden', height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${(d.value / max) * 100}%`, background: d.color, borderRadius: 5, transition: 'height 0.5s ease' }} />
                    </div>
                    <span style={{ ...mono, fontSize: '0.48rem', color: MUT, textAlign: 'center' as const, whiteSpace: 'nowrap' as const }}>{d.label}</span>
                </div>
            ))}
        </div>
    );
}

/* ── Sparkline SVG ── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
    if (values.length < 2) return null;
    const max = Math.max(...values); const min = Math.min(...values);
    const range = max - min || 1;
    const W = 120, H = 40;
    const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * H}`).join(' ');
    return (
        <svg width={W} height={H} style={{ overflow: 'visible' }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={`0,${H} ${pts} ${W},${H}`} fill={`${color}18`} stroke="none" />
        </svg>
    );
}

/* ── Learn Modal ── */
function LearnModal({ onClose }: { onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '5rem', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...card, padding: '2rem', width: '100%', maxWidth: 760, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ ...hdg, fontSize: '1.5rem' }}>Fuel History Overview</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUT, fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
                </div>
                <p style={{ color: MUT, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 560 }}>
                    Log fuel entries and gain insight into how fuel contributes to asset operating costs. Identify high-consumption vehicles and track metrics related to fuel usage.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                    {[
                        { icon: '⛽', title: 'Add Fuel Entries', body: 'Enter fill-ups on the go. Easily import a CSV of fuel entries from another system to keep all your records in one place.' },
                        { icon: '📉', title: 'Measure and Reduce Costs', body: 'Gain insight into metrics including fuel efficiency and cost per unit for every asset. Identify high-consumption vehicles quickly.' },
                        { icon: '📊', title: 'Identify Trends', body: 'Make data-driven decisions and optimise vehicle allocation. Share fuel insights and maintain full historical cost reports.' },
                    ].map(f => (
                        <div key={f.title} style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 14, padding: '1.25rem' }}>
                            <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: 10 }}>{f.icon}</span>
                            <p style={{ ...hdg, fontSize: '0.88rem', marginBottom: 6 }}>{f.title}</p>
                            <p style={{ fontSize: '0.76rem', color: MUT, lineHeight: 1.5 }}>{f.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── FuelEntryForm (Add / Edit) ── */
const blank = (): Omit<FuelEntry, 'id'> => ({
    vehicleId: '', date: new Date().toISOString().slice(0, 10), fuelType: 'petrol',
    litres: 0, pricePerLitre: 3.05, totalCost: 0, odometer: 0, station: '', fullTank: true, notes: '',
});

function FuelForm({ title, initial, onSave, onClose }: {
    title: string; initial: Omit<FuelEntry, 'id'>; onSave: (e: Omit<FuelEntry, 'id'>) => void; onClose: () => void;
}) {
    const [form, setForm] = useState({ ...initial });
    const set = (k: keyof typeof form, v: any) => {
        setForm(p => {
            const n = { ...p, [k]: v };
            if (k === 'litres' || k === 'pricePerLitre') n.totalCost = parseFloat((n.litres * n.pricePerLitre).toFixed(2));
            if (k === 'totalCost' && n.litres > 0) n.pricePerLitre = parseFloat((n.totalCost / n.litres).toFixed(4));
            return n;
        });
    };
    const inp = { width: '100%', padding: '0.5rem 0.7rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text', ...mono, fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' as const };
    const grp = { display: 'flex', flexDirection: 'column' as const, gap: 5 };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...card, padding: '1.75rem', width: '100%', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.5)', maxHeight: '92vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ ...hdg, fontSize: '1.05rem' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUT, fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Vehicle */}
                    <div style={grp}>
                        <label style={lbl}>Vehicle *</label>
                        <select value={form.vehicleId} onChange={e => set('vehicleId', e.target.value)} style={inp}>
                            <option value="">-- Select vehicle --</option>
                            {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.label} ({v.plate})</option>)}
                        </select>
                    </div>
                    {/* Date + Fuel Type */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={grp}>
                            <label style={lbl}>Date *</label>
                            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inp} />
                        </div>
                        <div style={grp}>
                            <label style={lbl}>Fuel Type</label>
                            <select value={form.fuelType} onChange={e => set('fuelType', e.target.value)} style={inp}>
                                {FUEL_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Litres + Price/L */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={grp}>
                            <label style={lbl}>Litres / kWh *</label>
                            <input type="number" min={0} step={0.01} value={form.litres || ''} onChange={e => set('litres', parseFloat(e.target.value) || 0)} style={inp} placeholder="0.00" />
                        </div>
                        <div style={grp}>
                            <label style={lbl}>Price per Litre (AED)</label>
                            <input type="number" min={0} step={0.001} value={form.pricePerLitre || ''} onChange={e => set('pricePerLitre', parseFloat(e.target.value) || 0)} style={inp} placeholder="3.05" />
                        </div>
                    </div>
                    {/* Total cost (auto) + Odometer */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={grp}>
                            <label style={lbl}>Total Cost (AED)</label>
                            <input type="number" min={0} step={0.01} value={form.totalCost || ''} onChange={e => set('totalCost', parseFloat(e.target.value) || 0)} style={{ ...inp, color: 'var(--t-accent)', fontWeight: 800 }} placeholder="Auto-calc" />
                        </div>
                        <div style={grp}>
                            <label style={lbl}>Odometer (km)</label>
                            <input type="number" min={0} step={1} value={form.odometer || ''} onChange={e => set('odometer', parseInt(e.target.value) || 0)} style={inp} placeholder="0" />
                        </div>
                    </div>
                    {/* Station */}
                    <div style={grp}>
                        <label style={lbl}>Station / Vendor</label>
                        <input type="text" value={form.station} onChange={e => set('station', e.target.value)} style={inp} placeholder="e.g. ENOC – Sheikh Zayed Rd" />
                    </div>
                    {/* Full tank toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => set('fullTank', !form.fullTank)} style={{ width: 44, height: 24, borderRadius: 12, border: `2px solid ${form.fullTank ? 'var(--t-green)' : 'var(--t-border)'}`, background: form.fullTank ? 'var(--t-green)' : 'var(--t-surface)', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
                            <span style={{ position: 'absolute', top: 2, left: form.fullTank ? 22 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                        </button>
                        <span style={{ fontSize: '0.82rem', color: form.fullTank ? 'var(--t-green)' : MUT, fontWeight: form.fullTank ? 700 : 400 }}>Full tank{form.fullTank ? ' ✓' : ''}</span>
                    </div>
                    {/* Notes */}
                    <div style={grp}>
                        <label style={lbl}>Notes</label>
                        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Optional notes…"
                            style={{ ...inp, resize: 'vertical' as const, fontFamily: 'var(--font-sans)' }} />
                    </div>
                    {/* Summary preview */}
                    {form.vehicleId && form.litres > 0 && (
                        <div style={{ padding: '0.75rem', background: 'var(--t-surface)', borderRadius: 10, border: '1px solid var(--t-border)', display: 'flex', gap: 16 }}>
                            {[['Litres', `${form.litres.toFixed(1)} L`, 'var(--t-cyan)'], ['Rate', `AED ${form.pricePerLitre.toFixed(3)}/L`, 'var(--t-text)'], ['Total', `AED ${form.totalCost.toFixed(2)}`, 'var(--t-accent)']].map(([k, v, c]) => (
                                <div key={k as string}><p style={lbl}>{k as string}</p><p style={{ ...hdg, fontSize: '0.9rem', color: c as string }}>{v as string}</p></div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.6rem', marginTop: 4 }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => { if (!form.vehicleId || !form.date || form.litres <= 0) return; onSave(form); onClose(); }}
                            disabled={!form.vehicleId || !form.date || form.litres <= 0}
                            style={{ flex: 2, padding: '0.65rem', borderRadius: 10, border: 'none', background: 'var(--t-accent)', color: '#000', ...hdg, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                            Save Fuel Entry →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── View Modal ── */
function ViewModal({ e, onEdit, onClose }: { e: FuelEntry; onEdit: () => void; onClose: () => void }) {
    const v = vMap[e.vehicleId]; const t = ftMap[e.fuelType];
    const rows: [string, string][] = [
        ['Vehicle', v ? `${v.label} (${v.plate})` : '—'],
        ['Date', new Date(e.date + 'T00:00:00').toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })],
        ['Fuel Type', `${t?.icon} ${t?.label}`],
        ['Litres/kWh', `${e.litres.toFixed(1)}`],
        ['Price/L', `AED ${e.pricePerLitre.toFixed(3)}`],
        ['Total Cost', `AED ${e.totalCost.toFixed(2)}`],
        ['Odometer', `${e.odometer.toLocaleString()} km`],
        ['Station', e.station || '—'],
        ['Full Tank', e.fullTank ? '✅ Yes' : '❌ Partial'],
        ['Notes', e.notes || '—'],
    ];
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
            onClick={el => { if (el.target === el.currentTarget) onClose(); }}>
            <div style={{ ...card, padding: '1.75rem', width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div><h2 style={{ ...hdg, fontSize: '1rem', marginBottom: 4 }}>Fuel Entry Detail</h2><p style={lbl}>{e.id}</p></div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUT, fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>
                {rows.map(([k, val]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.6rem 0', borderBottom: '1px solid var(--t-border)' }}>
                        <span style={{ ...lbl, fontSize: '0.62rem' }}>{k}</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, textAlign: 'right' as const, maxWidth: '60%', color: k === 'Total Cost' ? 'var(--t-accent)' : 'var(--t-text)' }}>{val}</span>
                    </div>
                ))}
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer' }}>Close</button>
                    <button onClick={onEdit} style={{ flex: 2, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-accent)44', background: 'var(--t-accent-soft)', color: 'var(--t-accent)', ...hdg, fontSize: '0.85rem', cursor: 'pointer' }}>✏️ Edit Entry</button>
                </div>
            </div>
        </div>
    );
}

/* ── Delete Modal ── */
function DeleteModal({ e, onConfirm, onClose }: { e: FuelEntry; onConfirm: () => void; onClose: () => void }) {
    const v = vMap[e.vehicleId];
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
            <div style={{ ...card, padding: '1.75rem', width: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>🗑️</p>
                <h2 style={{ ...hdg, fontSize: '1rem', marginBottom: 8 }}>Delete Fuel Entry?</h2>
                <p style={{ fontSize: '0.82rem', color: MUT, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Permanently remove <b>{e.id}</b> — {e.litres.toFixed(1)}L of {ftMap[e.fuelType]?.label} for <b>{v?.label}</b> on {e.date}. <b>AED {e.totalCost.toFixed(2)}</b> will be deducted from totals.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => { onConfirm(); onClose(); }} style={{ flex: 2, padding: '0.6rem', borderRadius: 10, border: 'none', background: 'var(--t-red)', color: '#fff', ...hdg, fontSize: '0.85rem', cursor: 'pointer' }}>Delete</button>
                </div>
            </div>
        </div>
    );
}

/* ── Main Page ── */
export default function FuelHistoryPage() {
    const [entries, setEntries] = useState<FuelEntry[]>(SEED);
    const [showLearn, setShowLearn] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [editE, setEditE] = useState<FuelEntry | null>(null);
    const [viewE, setViewE] = useState<FuelEntry | null>(null);
    const [delE, setDelE] = useState<FuelEntry | null>(null);

    const [fVehicle, setFVehicle] = useState('');
    const [fType, setFType] = useState('');
    const [fTank, setFTank] = useState('');
    const [fSearch, setFSearch] = useState('');
    const [page, setPage] = useState(1);
    const PER = 8;

    const filtered = useMemo(() =>
        entries.filter(e =>
            (!fVehicle || e.vehicleId === fVehicle) &&
            (!fType || e.fuelType === fType) &&
            (!fTank || (fTank === 'full' ? e.fullTank : !e.fullTank)) &&
            (!fSearch || e.station.toLowerCase().includes(fSearch.toLowerCase()) || e.id.toLowerCase().includes(fSearch.toLowerCase()) || e.notes.toLowerCase().includes(fSearch.toLowerCase()))
        ).sort((a, b) => b.date.localeCompare(a.date))
        , [entries, fVehicle, fType, fTank, fSearch]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER));
    const paged = filtered.slice((page - 1) * PER, page * PER);

    /* ── KPIs ── */
    const totalCost = entries.reduce((s, e) => s + e.totalCost, 0);
    const totalLitres = entries.reduce((s, e) => s + e.litres, 0);
    const avgCostPerL = totalLitres > 0 ? totalCost / totalLitres : 0;
    const thisMo = entries.filter(e => e.date.startsWith('2026-02')).reduce((s, e) => s + e.totalCost, 0);

    /* bar chart: cost by vehicle */
    const barData = VEHICLES.map(v => ({
        label: v.plate.split('-').slice(-1)[0],
        value: entries.filter(e => e.vehicleId === v.id).reduce((s, e) => s + e.totalCost, 0),
        color: ftMap[v.fuelType]?.color ?? MUT,
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 6);

    /* sparkline — daily total (last 12 entries by date) */
    const spark = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-12).map(e => e.totalCost);

    const addEntry = (e: Omit<FuelEntry, 'id'>) => setEntries(p => [{ ...e, id: mkId() }, ...p]);
    const saveEdit = (e: Omit<FuelEntry, 'id'>) => setEntries(p => p.map(x => x.id === editE?.id ? { ...e, id: x.id } : x));
    const deleteById = (id: string) => setEntries(p => p.filter(x => x.id !== id));

    const sel = { padding: '0.45rem 0.7rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', ...mono, fontSize: '0.78rem', outline: 'none' };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '1.75rem' }}>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Link href="/admin/fleet" style={{ ...lbl, color: MUT, textDecoration: 'none' }}>Fleet</Link>
                        <span style={{ color: 'var(--t-border)' }}>/</span>
                        <span style={{ ...lbl, color: 'var(--t-accent)' }}>Fuel History</span>
                    </div>
                    <h1 style={{ ...hdg, fontSize: '1.9rem', marginBottom: '0.2rem' }}>Fuel History</h1>
                    <p style={{ color: MUT, fontSize: '0.82rem' }}>{entries.length} entries · Track fleet fuel consumption and costs</p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => setShowLearn(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, fontSize: '0.8rem', cursor: 'pointer' }}>💡 Learn</button>
                    <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 9, border: 'none', background: 'var(--t-accent)', color: '#000', ...hdg, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.2)' }}>
                        + Add Fuel Entry
                    </button>
                </div>
            </div>

            {/* KPI strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                    { icon: '💰', label: 'Total Fuel Cost', val: `AED ${totalCost.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`, color: 'var(--t-accent)' },
                    { icon: '🧪', label: 'Total Volume', val: `${totalLitres.toFixed(0)} L`, color: 'var(--t-cyan)' },
                    { icon: '📉', label: 'Avg Cost / Litre', val: `AED ${avgCostPerL.toFixed(3)}`, color: 'var(--t-green)' },
                    { icon: '📅', label: 'This Month (Feb)', val: `AED ${thisMo.toFixed(2)}`, color: 'var(--t-purple)' },
                ].map(k => (
                    <div key={k.label} style={{ ...card, padding: '1rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: 6 }}>{k.icon}</p>
                        <p style={{ ...hdg, fontSize: '1.35rem', color: k.color }}>{k.val}</p>
                        <p style={lbl}>{k.label}</p>
                    </div>
                ))}
            </div>

            {/* main layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '1.25rem', alignItems: 'start' }}>

                {/* LEFT: filters + table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* filters */}
                    <div style={{ ...card, padding: '0.875rem 1rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input value={fSearch} onChange={e => { setFSearch(e.target.value); setPage(1); }} placeholder="🔍  Search station, notes, ID…"
                            style={{ flex: 2, minWidth: 160, padding: '0.45rem 0.75rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', ...mono, fontSize: '0.78rem', outline: 'none' }} />
                        <select value={fVehicle} onChange={e => { setFVehicle(e.target.value); setPage(1); }} style={sel}>
                            <option value="">All Vehicles</option>
                            {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                        </select>
                        <select value={fType} onChange={e => { setFType(e.target.value); setPage(1); }} style={sel}>
                            <option value="">All Fuel Types</option>
                            {FUEL_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                        </select>
                        <select value={fTank} onChange={e => { setFTank(e.target.value); setPage(1); }} style={sel}>
                            <option value="">Full/Partial</option>
                            <option value="full">Full Tank Only</option>
                            <option value="partial">Partial Only</option>
                        </select>
                        {(fVehicle || fType || fTank || fSearch) && (
                            <button onClick={() => { setFVehicle(''); setFType(''); setFTank(''); setFSearch(''); setPage(1); }}
                                style={{ padding: '0.4rem 0.75rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, fontSize: '0.75rem', cursor: 'pointer' }}>✕ Clear</button>
                        )}
                    </div>

                    {/* table */}
                    <div style={{ ...card, overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 80px 80px 90px 80px 80px 90px', background: 'var(--t-surface)', borderBottom: '1px solid var(--t-border)', padding: '0.65rem 1rem', gap: 6 }}>
                            {['ID', 'Vehicle', 'Date', 'Type', 'Litres', 'Cost (AED)', 'Odom.', 'Tank', ''].map(h => (
                                <span key={h} style={{ ...lbl, fontSize: '0.57rem' }}>{h}</span>
                            ))}
                        </div>

                        {paged.length === 0 && (
                            <div style={{ padding: '3rem', textAlign: 'center' as const, color: MUT }}>
                                <p style={{ fontSize: '2rem', marginBottom: 8 }}>⛽</p>
                                <p style={{ ...hdg, fontSize: '1rem' }}>No fuel entries found</p>
                                <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Try adjusting your filters or add a new entry</p>
                            </div>
                        )}

                        {paged.map(e => {
                            const v = vMap[e.vehicleId]; const t = ftMap[e.fuelType];
                            return (
                                <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 80px 80px 90px 80px 80px 90px', padding: '0.65rem 1rem', borderBottom: '1px solid #1e2d3e', gap: 6, alignItems: 'center' }}
                                    onMouseEnter={el => (el.currentTarget as any).style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={el => (el.currentTarget as any).style.background = 'transparent'}>
                                    <span style={{ ...mono, fontSize: '0.65rem', color: 'var(--t-accent)' }}>{e.id}</span>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.76rem', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v?.label ?? '—'}</p>
                                        <p style={{ ...mono, fontSize: '0.58rem', color: MUT, marginTop: 1 }}>{v?.plate}</p>
                                    </div>
                                    <span style={{ ...mono, fontSize: '0.7rem', color: MUT }}>{new Date(e.date + 'T00:00:00').toLocaleDateString('en-AE', { day: '2-digit', month: 'short' })}</span>
                                    <span style={{ ...chip(t?.color ?? MUT), fontSize: '0.58rem' }}>{t?.icon}</span>
                                    <span style={{ ...mono, fontSize: '0.78rem', fontWeight: 700 }}>{e.litres.toFixed(1)}</span>
                                    <span style={{ ...mono, fontWeight: 800, fontSize: '0.8rem', color: 'var(--t-accent)' }}>{e.totalCost.toFixed(2)}</span>
                                    <span style={{ ...mono, fontSize: '0.68rem', color: MUT }}>{(e.odometer / 1000).toFixed(0)}k</span>
                                    <span style={{ fontSize: '0.75rem' }}>{e.fullTank ? '✅' : '⬜'}</span>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button onClick={() => setViewE(e)} title="View" style={{ padding: '0.28rem 0.45rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer', fontSize: '0.72rem' }}>👁</button>
                                        <button onClick={() => setEditE(e)} title="Edit" style={{ padding: '0.28rem 0.45rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-accent)', cursor: 'pointer', fontSize: '0.72rem' }}>✏️</button>
                                        <button onClick={() => setDelE(e)} title="Delete" style={{ padding: '0.28rem 0.45rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-red)', cursor: 'pointer', fontSize: '0.72rem' }}>🗑</button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* pagination */}
                        {pages > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--t-surface)', borderTop: '1px solid var(--t-border)' }}>
                                <span style={{ ...lbl, fontSize: '0.57rem' }}>Showing {(page - 1) * PER + 1}–{Math.min(page * PER, filtered.length)} of {filtered.length}</span>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-card)', color: page === 1 ? 'var(--t-border)' : MUT, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>←</button>
                                    {Array.from({ length: pages }, (_, i) => (
                                        <button key={i} onClick={() => setPage(i + 1)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: `1px solid ${page === i + 1 ? 'var(--t-accent)' : 'var(--t-border)'}`, background: page === i + 1 ? 'var(--t-accent-soft)' : 'var(--t-card)', color: page === i + 1 ? 'var(--t-accent)' : MUT, cursor: 'pointer' }}>{i + 1}</button>
                                    ))}
                                    <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-card)', color: page === pages ? 'var(--t-border)' : MUT, cursor: page === pages ? 'not-allowed' : 'pointer' }}>→</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Fuel Summary bar */}
                    <div style={{ ...card, padding: '1.25rem' }}>
                        <p style={{ ...hdg, fontSize: '0.82rem', marginBottom: 3 }}>Fuel Summary</p>
                        <p style={{ ...lbl, fontSize: '0.57rem', color: MUT, marginBottom: 4 }}>Cost by vehicle (AED)</p>
                        <p style={{ ...hdg, fontSize: '1.5rem', color: 'var(--t-accent)', marginBottom: 10 }}>
                            AED {totalCost.toLocaleString('en-AE', { maximumFractionDigits: 0 })}
                        </p>
                        <FuelBarChart data={barData} />
                    </div>

                    {/* Trend sparkline */}
                    <div style={{ ...card, padding: '1.25rem' }}>
                        <p style={{ ...hdg, fontSize: '0.82rem', marginBottom: 3 }}>Cost Trend</p>
                        <p style={{ ...lbl, fontSize: '0.57rem', color: MUT, marginBottom: 10 }}>Last 12 fill-ups</p>
                        <Sparkline values={spark} color="var(--t-accent)" />
                    </div>

                    {/* Fuel type breakdown */}
                    <div style={{ ...card, padding: '1.25rem' }}>
                        <p style={{ ...hdg, fontSize: '0.82rem', marginBottom: 12 }}>By Fuel Type</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {FUEL_TYPES.map(t => {
                                const cnt = entries.filter(e => e.fuelType === t.id).length;
                                const amt = entries.filter(e => e.fuelType === t.id).reduce((s, e) => s + e.totalCost, 0);
                                const lt = entries.filter(e => e.fuelType === t.id).reduce((s, e) => s + e.litres, 0);
                                if (!cnt) return null;
                                return (
                                    <div key={t.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontSize: '0.85rem' }}>{t.icon}</span>
                                                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{t.label}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' as const }}>
                                                <p style={{ ...mono, fontSize: '0.68rem', color: t.color, fontWeight: 800 }}>AED {amt.toFixed(0)}</p>
                                                <p style={{ ...mono, fontSize: '0.58rem', color: MUT }}>{lt.toFixed(0)} L · {cnt} fills</p>
                                            </div>
                                        </div>
                                        <div style={{ height: 3, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${Math.round(amt / totalCost * 100)}%`, background: t.color, borderRadius: 99 }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* quick actions */}
                    <div style={{ ...card, padding: '1rem', background: 'var(--t-accent-soft)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <p style={{ ...hdg, fontSize: '0.78rem', color: 'var(--t-accent)', marginBottom: 8 }}>⚡ Actions</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button onClick={() => setShowAdd(true)} style={{ padding: '0.5rem', borderRadius: 9, border: 'none', background: 'var(--t-accent)', color: '#000', ...hdg, fontSize: '0.78rem', cursor: 'pointer' }}>+ Add Fuel Entry</button>
                            <button onClick={() => setFTank('full')} style={{ padding: '0.5rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, fontSize: '0.76rem', cursor: 'pointer' }}>✅ View Full Tanks Only</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* modals */}
            {showLearn && <LearnModal onClose={() => setShowLearn(false)} />}
            {showAdd && <FuelForm title="Add Fuel Entry" initial={blank()} onSave={addEntry} onClose={() => setShowAdd(false)} />}
            {editE && <FuelForm title="Edit Fuel Entry" initial={editE} onSave={saveEdit} onClose={() => setEditE(null)} />}
            {viewE && <ViewModal e={viewE} onEdit={() => { setEditE(viewE); setViewE(null); }} onClose={() => setViewE(null)} />}
            {delE && <DeleteModal e={delE} onConfirm={() => deleteById(delE.id)} onClose={() => setDelE(null)} />}
        </div>
    );
}
