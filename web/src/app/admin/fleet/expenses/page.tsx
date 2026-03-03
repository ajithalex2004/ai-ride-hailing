'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

/* ── theme ── */
const card = { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16 } as React.CSSProperties;
const mono = { fontFamily: 'var(--font-mono)' } as React.CSSProperties;
const hdg = { fontFamily: 'var(--font-heading)', fontWeight: 900 } as React.CSSProperties;
const lbl = { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.09em', color: 'var(--t-text-dim)' };
const chip = (c: string) => ({ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.64rem', fontWeight: 800, background: `${c}18`, color: c, border: `1px solid ${c}44` });
const MUT = '#8899AB';

/* ── expense types ── */
const TYPES = [
    { id: 'fuel', label: 'Fuel', color: 'var(--t-cyan)', icon: '⛽' },
    { id: 'insurance', label: 'Insurance', color: 'var(--t-purple)', icon: '🛡️' },
    { id: 'tolls', label: 'Tolls', color: 'var(--t-accent)', icon: '🚧' },
    { id: 'loan', label: 'Loan / Finance', color: 'var(--t-green)', icon: '💵' },
    { id: 'fines', label: 'Fines', color: 'var(--t-red)', icon: '📋' },
    { id: 'service', label: 'Service', color: 'var(--t-orange)', icon: '🔧' },
    { id: 'registration', label: 'Registration', color: 'var(--t-cyan)', icon: '📄' },
    { id: 'other', label: 'Other', color: MUT, icon: '📦' },
];
const tMap = Object.fromEntries(TYPES.map(t => [t.id, t]));

const VEHICLES = [
    { id: 'VEH-001', label: 'Toyota HiAce', plate: 'DXB-A-11442' },
    { id: 'VEH-002', label: 'Mercedes Sprinter', plate: 'DXB-B-88812' },
    { id: 'VEH-003', label: 'Ford Transit', plate: 'AUH-C-10234' },
    { id: 'VEH-004', label: 'Toyota Camry', plate: 'DXB-D-55617' },
    { id: 'VEH-005', label: 'BMW X5', plate: 'DXB-E-22001' },
    { id: 'VEH-007', label: 'Toyota Coaster', plate: 'DXB-G-33412' },
    { id: 'VEH-009', label: 'Tesla Model Y', plate: 'DXB-I-99001' },
    { id: 'VEH-010', label: 'Lexus LX 600', plate: 'DXB-J-15523' },
];
const vMap = Object.fromEntries(VEHICLES.map(v => [v.id, v]));

/* ── seed data ── */
let _id = 100;
const makeId = () => `EXP-${++_id}`;

type Expense = {
    id: string; vehicleId: string; date: string; type: string;
    amount: number; vendor: string; notes: string; status: 'paid' | 'pending';
};

const SEED: Expense[] = [
    { id: 'EXP-001', vehicleId: 'VEH-001', date: '2026-02-28', type: 'tolls', amount: 15.39, vendor: 'Salik', notes: 'Dubai toll gate charge', status: 'paid' },
    { id: 'EXP-002', vehicleId: 'VEH-002', date: '2026-02-27', type: 'loan', amount: 389.39, vendor: 'Emirates NBD', notes: 'Monthly vehicle loan payment', status: 'paid' },
    { id: 'EXP-003', vehicleId: 'VEH-004', date: '2026-02-24', type: 'fines', amount: 48.28, vendor: 'RTA', notes: 'Parking violation – Deira', status: 'pending' },
    { id: 'EXP-004', vehicleId: 'VEH-007', date: '2026-02-20', type: 'insurance', amount: 91.22, vendor: 'Al Sagr National', notes: 'Monthly insurance installment', status: 'paid' },
    { id: 'EXP-005', vehicleId: 'VEH-003', date: '2026-02-18', type: 'fuel', amount: 220.00, vendor: 'ENOC', notes: 'Full tank – 80L', status: 'paid' },
    { id: 'EXP-006', vehicleId: 'VEH-005', date: '2026-02-15', type: 'service', amount: 650.00, vendor: 'BMW Service AUH', notes: '10,000 km service + oil change', status: 'paid' },
    { id: 'EXP-007', vehicleId: 'VEH-009', date: '2026-02-10', type: 'registration', amount: 350.00, vendor: 'RTA Online', notes: 'Annual vehicle registration', status: 'paid' },
    { id: 'EXP-008', vehicleId: 'VEH-010', date: '2026-02-08', type: 'fuel', amount: 180.00, vendor: 'ADNOC', notes: 'Full tank – 65L', status: 'paid' },
    { id: 'EXP-009', vehicleId: 'VEH-001', date: '2026-01-30', type: 'service', amount: 420.00, vendor: 'Toyota Al-Futtaim', notes: 'Brake pads replacement', status: 'paid' },
    { id: 'EXP-010', vehicleId: 'VEH-004', date: '2026-01-25', type: 'tolls', amount: 22.50, vendor: 'Salik', notes: 'Airport road toll', status: 'paid' },
    { id: 'EXP-011', vehicleId: 'VEH-002', date: '2026-01-20', type: 'fuel', amount: 310.00, vendor: 'ENOC', notes: 'Long-haul trip refuel', status: 'paid' },
    { id: 'EXP-012', vehicleId: 'VEH-003', date: '2026-01-15', type: 'insurance', amount: 91.22, vendor: 'Oman Insurance', notes: 'Monthly installment', status: 'pending' },
];

/* ── Donut SVG ── */
function Donut({ data }: { data: { label: string; amount: number; color: string }[] }) {
    const total = data.reduce((s, d) => s + d.amount, 0);
    if (total === 0) return null;
    const r = 60, cx = 70, cy = 70, stroke = 22;
    let offset = 0;
    const slices = data.map(d => {
        const pct = d.amount / total;
        const dashArr = `${pct * 2 * Math.PI * r} ${2 * Math.PI * r}`;
        const dashOff = -offset * 2 * Math.PI * r;
        offset += pct;
        return { ...d, dashArr, dashOff, pct };
    });
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width={140} height={140} style={{ flexShrink: 0 }}>
                {slices.map(s => (
                    <circle key={s.label} cx={cx} cy={cy} r={r}
                        fill="none" stroke={s.color} strokeWidth={stroke}
                        strokeDasharray={s.dashArr}
                        strokeDashoffset={s.dashOff}
                        style={{ transition: 'all 0.5s', transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(-90deg)' }} />
                ))}
                <text x={cx} y={cy - 6} textAnchor="middle" style={{ ...mono, fontSize: 10, fill: MUT }}>Total</text>
                <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 900, fill: 'var(--t-text)' }}>
                    {total.toLocaleString('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}
                </text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {slices.map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--t-text-muted)' }}>{s.label}</span>
                        <span style={{ ...mono, fontSize: '0.68rem', color: s.color, marginLeft: 'auto', fontWeight: 700 }}>
                            {s.amount.toLocaleString('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Learn modal ── */
function LearnModal({ onClose }: { onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '5rem', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...card, padding: '2rem', width: '100%', maxWidth: 760, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ ...hdg, fontSize: '1.5rem' }}>Expenses Overview</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUT, fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
                </div>
                <p style={{ color: MUT, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 560 }}>
                    Track any administrative expense, from depreciation and recurring registration fees to loan payments and insurance costs. Easily identify where you're spending too much and gain insight into where you can reduce costs and create efficiencies.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                    {[
                        { icon: '📋', title: 'Track and Manage', body: 'Add, view and edit administrative expenses related to your fleet. Filter by vehicle, date, expense type, vendor and much more.' },
                        { icon: '💡', title: 'Gain Insight', body: 'Know when and where costs are coming from and view common expense types. Review comments and documents associated with expenses.' },
                        { icon: '📊', title: 'Analyze in Real Time', body: "Identify where you're spending too much by viewing expense entries on your Dashboard. Make data-driven decisions to reduce costs." },
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

/* ── blank expense ── */
const blank = (): Omit<Expense, 'id'> => ({
    vehicleId: '', date: new Date().toISOString().slice(0, 10),
    type: 'fuel', amount: 0, vendor: '', notes: '', status: 'pending',
});

/* ── ExpenseForm (Add / Edit) ── */
function ExpenseForm({ title, initial, onSave, onClose }: {
    title: string; initial: Omit<Expense, 'id'>; onSave: (e: Omit<Expense, 'id'>) => void; onClose: () => void;
}) {
    const [form, setForm] = useState({ ...initial });
    const f = (k: keyof typeof form, v: any) => setForm(p => ({ ...p, [k]: v }));
    const inputStyle = { width: '100%', padding: '0.5rem 0.7rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', ...mono, fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' as const };
    const groupStyle = { display: 'flex', flexDirection: 'column' as const, gap: 5 };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...card, padding: '1.75rem', width: '100%', maxWidth: 500, boxShadow: '0 32px 80px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ ...hdg, fontSize: '1.05rem' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUT, fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Vehicle */}
                    <div style={groupStyle}>
                        <label style={lbl}>Vehicle *</label>
                        <select value={form.vehicleId} onChange={e => f('vehicleId', e.target.value)} style={inputStyle}>
                            <option value="">-- Select vehicle --</option>
                            {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.label} ({v.plate})</option>)}
                        </select>
                    </div>
                    {/* Date + Type */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={groupStyle}>
                            <label style={lbl}>Date *</label>
                            <input type="date" value={form.date} onChange={e => f('date', e.target.value)} style={inputStyle} />
                        </div>
                        <div style={groupStyle}>
                            <label style={lbl}>Expense Type *</label>
                            <select value={form.type} onChange={e => f('type', e.target.value)} style={inputStyle}>
                                {TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Amount + Vendor */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={groupStyle}>
                            <label style={lbl}>Amount (AED) *</label>
                            <input type="number" min={0} step={0.01} value={form.amount} onChange={e => f('amount', parseFloat(e.target.value) || 0)} style={inputStyle} />
                        </div>
                        <div style={groupStyle}>
                            <label style={lbl}>Vendor</label>
                            <input type="text" value={form.vendor} onChange={e => f('vendor', e.target.value)} placeholder="e.g. ENOC, RTA" style={inputStyle} />
                        </div>
                    </div>
                    {/* Status */}
                    <div style={groupStyle}>
                        <label style={lbl}>Status</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {(['paid', 'pending'] as const).map(s => (
                                <button key={s} onClick={() => f('status', s)} style={{ flex: 1, padding: '0.5rem', borderRadius: 9, border: `1px solid ${form.status === s ? (s === 'paid' ? 'var(--t-green)' : 'var(--t-orange)') : 'var(--t-border)'}`, background: form.status === s ? (s === 'paid' ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)') : 'transparent', color: form.status === s ? (s === 'paid' ? 'var(--t-green)' : 'var(--t-orange)') : MUT, cursor: 'pointer', fontWeight: form.status === s ? 700 : 400, fontSize: '0.82rem' }}>
                                    {s === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Notes */}
                    <div style={groupStyle}>
                        <label style={lbl}>Notes</label>
                        <textarea value={form.notes} onChange={e => f('notes', e.target.value)} rows={3} placeholder="Optional description or reference…"
                            style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'var(--font-sans)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', marginTop: 6 }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => { if (!form.vehicleId || !form.date) return; onSave(form); onClose(); }}
                            disabled={!form.vehicleId || !form.date}
                            style={{ flex: 2, padding: '0.65rem', borderRadius: 10, border: 'none', background: 'var(--t-accent)', color: '#000', ...hdg, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                            Save Expense →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── ViewModal ── */
function ViewModal({ exp, onEdit, onClose }: { exp: Expense; onEdit: () => void; onClose: () => void }) {
    const v = vMap[exp.vehicleId]; const t = tMap[exp.type];
    const rows: [string, string | number][] = [
        ['Vehicle', v ? `${v.label} (${v.plate})` : '—'],
        ['Date', new Date(exp.date + 'T00:00:00').toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })],
        ['Expense Type', `${t?.icon} ${t?.label}`],
        ['Amount', `AED ${exp.amount.toFixed(2)}`],
        ['Vendor', exp.vendor || '—'],
        ['Status', exp.status === 'paid' ? '✅ Paid' : '⏳ Pending'],
        ['Notes', exp.notes || '—'],
    ];
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...card, padding: '1.75rem', width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ ...hdg, fontSize: '1rem', marginBottom: 4 }}>Expense Detail</h2>
                        <p style={lbl}>{exp.id}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUT, fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {rows.map(([k, val]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.6rem 0', borderBottom: '1px solid var(--t-border)' }}>
                            <span style={{ ...lbl, fontSize: '0.62rem' }}>{k}</span>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, textAlign: 'right' as const, maxWidth: '60%', color: k === 'Amount' ? 'var(--t-accent)' : 'var(--t-text)' }}>{val}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer' }}>Close</button>
                    <button onClick={onEdit} style={{ flex: 2, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--t-accent)44', background: 'var(--t-accent-soft)', color: 'var(--t-accent)', ...hdg, fontSize: '0.85rem', cursor: 'pointer' }}>✏️ Edit Expense</button>
                </div>
            </div>
        </div>
    );
}

/* ── Delete confirmation ── */
function DeleteModal({ exp, onConfirm, onClose }: { exp: Expense; onConfirm: () => void; onClose: () => void }) {
    const v = vMap[exp.vehicleId];
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
            <div style={{ ...card, padding: '1.75rem', width: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>🗑️</p>
                <h2 style={{ ...hdg, fontSize: '1rem', marginBottom: 8 }}>Delete Expense?</h2>
                <p style={{ fontSize: '0.82rem', color: MUT, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    This will permanently remove <b>{exp.id}</b> — {tMap[exp.type]?.label} of <b>AED {exp.amount.toFixed(2)}</b> for <b>{v?.label}</b>.
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
export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>(SEED);
    const [showLearn, setShowLearn] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [editExp, setEditExp] = useState<Expense | null>(null);
    const [viewExp, setViewExp] = useState<Expense | null>(null);
    const [delExp, setDelExp] = useState<Expense | null>(null);

    /* filters */
    const [fVehicle, setFVehicle] = useState('');
    const [fType, setFType] = useState('');
    const [fStatus, setFStatus] = useState('');
    const [fSearch, setFSearch] = useState('');
    const [page, setPage] = useState(1);
    const PER = 8;

    const filtered = useMemo(() =>
        expenses.filter(e =>
            (!fVehicle || e.vehicleId === fVehicle) &&
            (!fType || e.type === fType) &&
            (!fStatus || e.status === fStatus) &&
            (!fSearch || e.vendor.toLowerCase().includes(fSearch.toLowerCase()) || e.notes.toLowerCase().includes(fSearch.toLowerCase()) || e.id.toLowerCase().includes(fSearch.toLowerCase()))
        ).sort((a, b) => b.date.localeCompare(a.date))
        , [expenses, fVehicle, fType, fStatus, fSearch]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER));
    const paged = filtered.slice((page - 1) * PER, page * PER);

    /* KPIs */
    const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);
    const pendingCount = expenses.filter(e => e.status === 'pending').length;
    const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
    const thisMonth = expenses.filter(e => e.date.startsWith('2026-02')).reduce((s, e) => s + e.amount, 0);

    /* donut data – top 4 categories */
    const donutData = useMemo(() => {
        const agg: Record<string, number> = {};
        expenses.forEach(e => { agg[e.type] = (agg[e.type] ?? 0) + e.amount; });
        return Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 5)
            .map(([k, v]) => ({ label: tMap[k]?.label ?? k, amount: v, color: tMap[k]?.color ?? MUT }));
    }, [expenses]);

    const addExpense = (e: Omit<Expense, 'id'>) => setExpenses(p => [{ ...e, id: makeId() }, ...p]);
    const saveEdit = (e: Omit<Expense, 'id'>) => setExpenses(p => p.map(x => x.id === editExp?.id ? { ...e, id: x.id } : x));
    const deleteById = (id: string) => setExpenses(p => p.filter(x => x.id !== id));

    const sel = { padding: '0.45rem 0.7rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', ...mono, fontSize: '0.78rem', outline: 'none' };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '1.75rem' }}>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Link href="/admin/fleet" style={{ ...lbl, color: MUT, textDecoration: 'none' }}>Fleet</Link>
                        <span style={{ color: 'var(--t-border)' }}>/</span>
                        <span style={{ ...lbl, color: 'var(--t-accent)' }}>Expense History</span>
                    </div>
                    <h1 style={{ ...hdg, fontSize: '1.9rem', marginBottom: '0.2rem' }}>Expense Entries</h1>
                    <p style={{ color: MUT, fontSize: '0.82rem' }}>{expenses.length} entries · Manage fleet administrative costs</p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={() => setShowLearn(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, fontSize: '0.8rem', cursor: 'pointer' }}>💡 Learn</button>
                    <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 9, border: 'none', background: 'var(--t-accent)', color: '#000', ...hdg, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.2)' }}>
                        + Add Expense Entry
                    </button>
                </div>
            </div>

            {/* KPI strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                    { icon: '💰', label: 'Total Spend', val: `AED ${totalSpend.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`, color: 'var(--t-accent)' },
                    { icon: '📅', label: 'This Month', val: `AED ${thisMonth.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`, color: 'var(--t-cyan)' },
                    { icon: '⏳', label: 'Pending', val: `${pendingCount} entries`, color: 'var(--t-orange)' },
                    { icon: '⚠️', label: 'Pending Amount', val: `AED ${pendingAmount.toFixed(2)}`, color: 'var(--t-red)' },
                ].map(k => (
                    <div key={k.label} style={{ ...card, padding: '1rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: 6 }}>{k.icon}</p>
                        <p style={{ ...hdg, fontSize: '1.35rem', color: k.color }}>{k.val}</p>
                        <p style={lbl}>{k.label}</p>
                    </div>
                ))}
            </div>

            {/* main layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.25rem', alignItems: 'start' }}>

                {/* LEFT: filters + table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* filters */}
                    <div style={{ ...card, padding: '0.875rem 1rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input value={fSearch} onChange={e => { setFSearch(e.target.value); setPage(1); }} placeholder="🔍  Search vendor, notes, ID…"
                            style={{ flex: 2, minWidth: 180, padding: '0.45rem 0.75rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', ...mono, fontSize: '0.78rem', outline: 'none' }} />
                        <select value={fVehicle} onChange={e => { setFVehicle(e.target.value); setPage(1); }} style={sel}>
                            <option value="">All Vehicles</option>
                            {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                        </select>
                        <select value={fType} onChange={e => { setFType(e.target.value); setPage(1); }} style={sel}>
                            <option value="">All Types</option>
                            {TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                        </select>
                        <select value={fStatus} onChange={e => { setFStatus(e.target.value); setPage(1); }} style={sel}>
                            <option value="">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                        </select>
                        {(fVehicle || fType || fStatus || fSearch) && (
                            <button onClick={() => { setFVehicle(''); setFType(''); setFStatus(''); setFSearch(''); setPage(1); }}
                                style={{ padding: '0.4rem 0.75rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, fontSize: '0.75rem', cursor: 'pointer' }}>✕ Clear</button>
                        )}
                    </div>

                    {/* table */}
                    <div style={{ ...card, overflow: 'hidden' }}>
                        {/* head */}
                        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px 110px 105px 100px 90px', background: 'var(--t-surface)', borderBottom: '1px solid var(--t-border)', padding: '0.65rem 1rem', gap: 8 }}>
                            {['ID', 'Vehicle', 'Date', 'Type', 'Amount', 'Status', ''].map(h => (
                                <span key={h} style={{ ...lbl, fontSize: '0.58rem' }}>{h}</span>
                            ))}
                        </div>

                        {paged.length === 0 && (
                            <div style={{ padding: '3rem', textAlign: 'center' as const, color: MUT }}>
                                <p style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</p>
                                <p style={{ ...hdg, fontSize: '1rem' }}>No expenses found</p>
                                <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Try adjusting your filters</p>
                            </div>
                        )}

                        {paged.map(e => {
                            const v = vMap[e.vehicleId]; const t = tMap[e.type];
                            return (
                                <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px 110px 105px 100px 90px', padding: '0.7rem 1rem', borderBottom: '1px solid #1e2d3e', gap: 8, alignItems: 'center', cursor: 'default' }}
                                    onMouseEnter={el => (el.currentTarget as any).style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={el => (el.currentTarget as any).style.background = 'transparent'}>
                                    <span style={{ ...mono, fontSize: '0.68rem', color: 'var(--t-accent)' }}>{e.id}</span>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v?.label ?? '—'}</p>
                                        <p style={{ ...mono, fontSize: '0.6rem', color: MUT, marginTop: 1 }}>{v?.plate}</p>
                                    </div>
                                    <span style={{ ...mono, fontSize: '0.72rem', color: MUT }}>{new Date(e.date + 'T00:00:00').toLocaleDateString('en-AE', { day: '2-digit', month: 'short' })}</span>
                                    <span style={{ ...chip(t?.color ?? MUT), display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.6rem' }}>{t?.icon} {t?.label}</span>
                                    <span style={{ ...mono, fontWeight: 800, fontSize: '0.82rem', color: 'var(--t-text)' }}>AED {e.amount.toFixed(2)}</span>
                                    <span style={{ ...chip(e.status === 'paid' ? 'var(--t-green)' : 'var(--t-orange)'), fontSize: '0.6rem' }}>{e.status === 'paid' ? 'Paid' : 'Pending'}</span>
                                    <div style={{ display: 'flex', gap: 5 }}>
                                        <button onClick={() => setViewExp(e)} title="View" style={{ padding: '0.3rem 0.5rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, cursor: 'pointer', fontSize: '0.75rem' }}>👁</button>
                                        <button onClick={() => { setEditExp(e); }} title="Edit" style={{ padding: '0.3rem 0.5rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-accent)', cursor: 'pointer', fontSize: '0.75rem' }}>✏️</button>
                                        <button onClick={() => setDelExp(e)} title="Delete" style={{ padding: '0.3rem 0.5rem', borderRadius: 7, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-red)', cursor: 'pointer', fontSize: '0.75rem' }}>🗑</button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* pagination */}
                        {pages > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--t-surface)', borderTop: '1px solid var(--t-border)' }}>
                                <span style={{ ...lbl, fontSize: '0.58rem' }}>Showing {(page - 1) * PER + 1}–{Math.min(page * PER, filtered.length)} of {filtered.length}</span>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: '1px solid var(--t-border)', background: page === 1 ? 'transparent' : 'var(--t-card)', color: page === 1 ? 'var(--t-border)' : MUT, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>←</button>
                                    {Array.from({ length: pages }, (_, i) => (
                                        <button key={i} onClick={() => setPage(i + 1)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: `1px solid ${page === i + 1 ? 'var(--t-accent)' : 'var(--t-border)'}`, background: page === i + 1 ? 'var(--t-accent-soft)' : 'var(--t-card)', color: page === i + 1 ? 'var(--t-accent)' : MUT, cursor: 'pointer' }}>{i + 1}</button>
                                    ))}
                                    <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: '1px solid var(--t-border)', background: page === pages ? 'transparent' : 'var(--t-card)', color: page === pages ? 'var(--t-border)' : MUT, cursor: page === pages ? 'not-allowed' : 'pointer' }}>→</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: donut + expense type list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* donut */}
                    <div style={{ ...card, padding: '1.25rem' }}>
                        <p style={{ ...hdg, fontSize: '0.82rem', marginBottom: 3 }}>Cost Breakdown</p>
                        <p style={{ ...lbl, fontSize: '0.58rem', color: MUT, marginBottom: 14 }}>All time · by category</p>
                        <Donut data={donutData} />
                    </div>

                    {/* expense type ledger */}
                    <div style={{ ...card, padding: '1.25rem' }}>
                        <p style={{ ...hdg, fontSize: '0.82rem', marginBottom: 12 }}>By Type</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                            {TYPES.map(t => {
                                const amt = expenses.filter(e => e.type === t.id).reduce((s, e) => s + e.amount, 0);
                                const cnt = expenses.filter(e => e.type === t.id).length;
                                if (!cnt) return null;
                                const pct = Math.round(amt / totalSpend * 100);
                                return (
                                    <div key={t.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontSize: '0.85rem' }}>{t.icon}</span>
                                                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{t.label}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ ...mono, fontSize: '0.62rem', color: MUT }}>{cnt}x</span>
                                                <span style={{ ...mono, fontSize: '0.7rem', color: t.color, fontWeight: 800 }}>AED {amt.toFixed(0)}</span>
                                            </div>
                                        </div>
                                        <div style={{ height: 3, background: 'var(--t-border)', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${pct}%`, background: t.color, borderRadius: 99, transition: 'width 0.5s' }} />
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
                            <button onClick={() => setShowAdd(true)} style={{ padding: '0.5rem', borderRadius: 9, border: '1px solid rgba(245,158,11,0.3)', background: 'var(--t-accent)', color: '#000', ...hdg, fontSize: '0.78rem', cursor: 'pointer' }}>+ Add Expense</button>
                            <button onClick={() => setFStatus('pending')} style={{ padding: '0.5rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: MUT, fontSize: '0.76rem', cursor: 'pointer' }}>⏳ View Pending ({pendingCount})</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* modals */}
            {showLearn && <LearnModal onClose={() => setShowLearn(false)} />}
            {showAdd && <ExpenseForm title="Add Expense Entry" initial={blank()} onSave={addExpense} onClose={() => setShowAdd(false)} />}
            {editExp && <ExpenseForm title="Edit Expense" initial={editExp} onSave={saveEdit} onClose={() => setEditExp(null)} />}
            {viewExp && <ViewModal exp={viewExp} onEdit={() => { setEditExp(viewExp); setViewExp(null); }} onClose={() => setViewExp(null)} />}
            {delExp && <DeleteModal exp={delExp} onConfirm={() => deleteById(delExp.id)} onClose={() => setDelExp(null)} />}
        </div>
    );
}
