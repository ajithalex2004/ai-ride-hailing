'use client';

import React, { useState, useEffect } from 'react';

/* ─── Design tokens ──────────────────────────────────────────── */
const C = {
    bg: 'var(--t-bg)',
    card: 'var(--t-card)',
    surface: 'var(--t-surface)',
    border: 'var(--t-border)',
    borderSub: 'var(--t-border-subtle)',
    text: 'var(--t-text)',
    muted: 'var(--t-text-muted)',
    dim: 'var(--t-text-dim)',
    accent: 'var(--t-accent)',
    green: 'var(--t-green)',
    red: 'var(--t-red)',
    orange: 'var(--t-orange)',
    cyan: 'var(--t-cyan)',
    purple: 'var(--t-purple)',
    blue: 'var(--t-blue)',
};

const T: Record<string, React.CSSProperties> = {
    h: { fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '-0.01em' },
    mono: { fontFamily: 'var(--font-mono)' },
    label: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t-text-dim)' },
};

/* ─── Helper components ──────────────────────────────────────── */
function Widget({ title, children, span = 1, action }: { title: string; children: React.ReactNode; span?: number; action?: React.ReactNode }) {
    return (
        <div style={{ gridColumn: `span ${span}`, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ ...T.label, fontSize: '0.62rem', color: C.muted }}>{title}</span>
                {action}
            </div>
            {children}
        </div>
    );
}

function KpiPair({ items }: { items: { label: string; value: string | number; color?: string }[] }) {
    return (
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
            {items.map(item => (
                <div key={item.label}>
                    <p style={{ ...T.h, fontSize: '2rem', color: item.color ?? C.accent }}>{item.value}</p>
                    <p style={{ ...T.label, marginTop: 2 }}>{item.label}</p>
                </div>
            ))}
        </div>
    );
}

function Dot({ color }: { color: string }) {
    return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />;
}

function Badge({ v, color }: { v: number; color: string }) {
    return (
        <span style={{ ...T.mono, fontSize: '0.72rem', fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 6, padding: '1px 7px', minWidth: 24, textAlign: 'center' }}>
            {v}
        </span>
    );
}

/* ─── Mini SVG Bar chart ─────────────────────────────────────── */
function BarChart({ data, color = C.green, height = 60 }: { data: number[]; color?: string; height?: number }) {
    const max = Math.max(...data, 1);
    const labels = ['Oct 23', 'Nov 23', 'Dec 23', 'Jan 26', 'Feb 26', 'Mar 26'];
    const w = 100 / data.length;
    return (
        <svg viewBox={`0 0 200 ${height + 20}`} style={{ width: '100%', overflow: 'visible' }}>
            {data.map((v, i) => {
                const barH = (v / max) * height;
                const x = i * (200 / data.length) + 4;
                return (
                    <g key={i}>
                        <rect x={x} y={height - barH} width={(200 / data.length) - 8} height={barH} rx={3} fill={color} opacity={0.85} />
                        <text x={x + (200 / data.length - 8) / 2} y={height + 14} textAnchor="middle" style={{ fontSize: 7, fill: C.dim, fontFamily: 'var(--font-mono)' }}>
                            {labels[i] ?? ''}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

/* ─── Mini SVG Line chart ────────────────────────────────────── */
function LineChart({ data, color = C.accent, height = 60 }: { data: number[]; color?: string; height?: number }) {
    const max = Math.max(...data, 1);
    const labels = ['Oct 23', 'Nov 23', 'Dec 23', 'Jan 26', 'Feb 26', 'Mar 26'];
    const px = (i: number) => (i / (data.length - 1)) * 190 + 5;
    const py = (v: number) => height - (v / max) * (height - 10) + 5;
    const points = data.map((v, i) => `${px(i)},${py(v)}`).join(' ');
    const area = `M${px(0)},${py(data[0])} ` + data.slice(1).map((v, i) => `L${px(i + 1)},${py(v)}`).join(' ') + ` L${px(data.length - 1)},${height + 5} L${px(0)},${height + 5} Z`;
    return (
        <svg viewBox={`0 0 200 ${height + 20}`} style={{ width: '100%', overflow: 'visible' }}>
            <defs>
                <linearGradient id={`lg-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#lg-${color.replace(/[^a-z]/gi, '')})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
            {data.map((v, i) => (
                <circle key={i} cx={px(i)} cy={py(v)} r={2.5} fill={color} />
            ))}
            {labels.map((l, i) => (
                <text key={i} x={px(i)} y={height + 14} textAnchor="middle" style={{ fontSize: 7, fill: C.dim, fontFamily: 'var(--font-mono)' }}>{l}</text>
            ))}
        </svg>
    );
}

/* ─── Mini SVG Pie chart ─────────────────────────────────────── */
function PieChart({ slices }: { slices: { v: number; color: string }[] }) {
    const total = slices.reduce((a, s) => a + s.v, 0);
    let angle = -Math.PI / 2;
    const R = 36, cx = 40, cy = 40;
    const paths = slices.map(s => {
        const sweep = (s.v / total) * 2 * Math.PI;
        const x1 = cx + R * Math.cos(angle);
        const y1 = cy + R * Math.sin(angle);
        angle += sweep;
        const x2 = cx + R * Math.cos(angle);
        const y2 = cy + R * Math.sin(angle);
        const large = sweep > Math.PI ? 1 : 0;
        return { d: `M${cx},${cy} L${x1},${y1} A${R},${R},0,${large},1,${x2},${y2} Z`, color: s.color };
    });
    return (
        <svg viewBox="0 0 80 80" width={80} height={80}>
            {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} opacity={0.9} stroke={C.card} strokeWidth={1.5} />)}
            <circle cx={cx} cy={cy} r={18} fill={C.card} />
        </svg>
    );
}

/* ─── Live Clock ─────────────────────────────────────────────── */
function Clock() {
    const [t, setT] = useState('');
    useEffect(() => {
        const update = () => setT(new Date().toLocaleTimeString());
        update(); const id = setInterval(update, 1000); return () => clearInterval(id);
    }, []);
    return <span style={{ ...T.mono, fontSize: '0.72rem', color: C.muted }}>{t}</span>;
}

/* ─── Data ───────────────────────────────────────────────────── */
const MONTHS = ['Oct 23', 'Nov 23', 'Dec 23', 'Jan 26', 'Feb 26', 'Mar 26'];
const fuelData = [12, 18, 14, 22, 16, 20];
const svcData = [800, 1200, 600, 900, 1800, 400];
const otherData = [400, 600, 800, 500, 1900, 700];
const totalData = [4, 5, 4.5, 6, 5.5, 5.8];
const resolveData = [3, 4, 2, 5, 3.5, 4];
const cpmData = [0.8, 1.2, 0.9, 1.5, 1.1, 1.3];

const VEHICLE_STATUS = [
    { label: 'Active', v: 42, color: C.green },
    { label: 'In Shop', v: 6, color: C.orange },
    { label: 'Inactive', v: 3, color: C.muted },
    { label: 'Out of Service', v: 1, color: C.red },
];

const REASONS = [
    { label: 'Worn Out', v: 22, color: C.orange },
    { label: 'Oil Consumption', v: 20, color: C.cyan },
    { label: 'Trouble', v: 11, color: C.purple },
];

const COMMENTS = [
    { user: 'Aaron Ali', avatar: 'AA', msg: 'Checked this periodically to prevent further problems.', time: '4 months ago' },
    { user: 'Aaron Ali', avatar: 'AA', msg: "Might want to get it checked out though, we have replaced the bulb several times.", time: 'a month ago' },
    { user: 'Aaron Ali', avatar: 'AA', msg: 'Called the shop and they\'ll replace the 2 back tires later today.', time: '5 months ago' },
    { user: 'Aaron Ali', avatar: 'AA', msg: 'Thanks!', time: '7 days ago' },
    { user: 'Aaron Ali', avatar: 'AA', msg: 'Confirmed with driver — issue resolved.', time: '3 months ago' },
];

const PO_STATUS = [
    { label: 'Draft', v: 2, color: C.muted },
    { label: 'Pending Approval', v: 1, color: C.orange },
    { label: 'Approved', v: 4, color: C.cyan },
    { label: 'Purchased', v: 8, color: C.green },
];

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function FleetManagementDashboard() {
    const [location, setLocation] = useState('Alabama / Birmingham');

    return (
        <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'var(--font-sans)', color: C.text, padding: '1.25rem' }}>

            {/* ── Top bar ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ ...T.h, fontSize: '1.4rem', color: C.text }}>Fleet Dashboard</h1>
                    <p style={{ ...T.label, marginTop: 3, color: C.dim }}>Live fleet intelligence · <Clock /></p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <select value={location} onChange={e => setLocation(e.target.value)}
                        style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 9, padding: '0.4rem 0.75rem', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', outline: 'none', colorScheme: 'dark' }}>
                        <option>Alabama / Birmingham</option>
                        <option>Dubai / DIFC</option>
                        <option>Abu Dhabi / CBD</option>
                    </select>
                    <button style={{ padding: '0.4rem 0.875rem', borderRadius: 9, border: `1px solid ${C.border}`, background: C.accent, color: '#000', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                        + Add Widget
                    </button>
                </div>
            </div>

            {/* ── Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>

                {/* Row 1 */}
                <Widget title="Service Reminders Compliance">
                    <div style={{ textAlign: 'center' as const, padding: '0.5rem 0' }}>
                        <p style={{ ...T.h, fontSize: '2.4rem', color: C.green }}>98%</p>
                        <p style={{ ...T.label, color: C.muted, margin: '4px 0 10px' }}>compliance rate</p>
                        <p style={{ fontSize: '0.72rem', color: C.dim, lineHeight: 1.5 }}>
                            You have 7 open service reminders due soon. Assign them to maintain your compliance rate.
                        </p>
                        <button style={{ marginTop: 10, padding: '0.35rem 1rem', borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                            See reminders →
                        </button>
                    </div>
                </Widget>

                <Widget title="Service Reminders">
                    <KpiPair items={[
                        { label: 'Vehicles Overdue', value: 0, color: C.red },
                        { label: 'Vehicles Due Soon', value: 1, color: C.orange },
                    ]} />
                </Widget>

                <Widget title="Vehicle Renewal Reminders">
                    <KpiPair items={[
                        { label: 'Overdue', value: 0, color: C.red },
                        { label: 'Due Soon', value: 0, color: C.orange },
                    ]} />
                </Widget>

                <Widget title="Open Issues">
                    <KpiPair items={[
                        { label: 'Open', value: 1, color: C.orange },
                        { label: 'Overdue', value: 0, color: C.red },
                    ]} />
                </Widget>

                {/* Row 2 */}
                <Widget title="Incomplete Work Orders">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                            { label: 'Open', v: 8, color: C.blue },
                            { label: 'Pending', v: 2, color: C.orange },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.6rem', background: C.surface, borderRadius: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Dot color={item.color} />
                                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.label}</span>
                                </div>
                                <Badge v={item.v} color={item.color} />
                            </div>
                        ))}
                    </div>
                </Widget>

                <Widget title="Time to Resolve">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, ...T.label }}><Dot color={C.accent} />Avg Time to Resolve</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, ...T.label }}><Dot color={C.cyan} />All Issues</span>
                        </div>
                    </div>
                    <LineChart data={resolveData} color={C.accent} height={55} />
                </Widget>

                <Widget title="Purchase Orders">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {PO_STATUS.map(po => (
                            <div key={po.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: C.surface, borderRadius: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Dot color={po.color} />
                                    <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>{po.label}</span>
                                </div>
                                <Badge v={po.v} color={po.color} />
                            </div>
                        ))}
                    </div>
                </Widget>

                <Widget title="Contact Renewal Reminders">
                    <KpiPair items={[
                        { label: 'Overdue', value: 0, color: C.red },
                        { label: 'Due Soon', value: 2, color: C.orange },
                    ]} />
                </Widget>

                {/* Row 3 */}
                <Widget title="Vehicle Assignments">
                    <KpiPair items={[
                        { label: 'Assigned', value: 0, color: C.cyan },
                        { label: 'Unassigned', value: 11, color: C.orange },
                    ]} />
                </Widget>

                <Widget title="Vehicle Status">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                            {VEHICLE_STATUS.map(vs => (
                                <div key={vs.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: C.surface, borderRadius: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Dot color={vs.color} />
                                        <span style={{ fontSize: '0.78rem' }}>{vs.label}</span>
                                    </div>
                                    <Badge v={vs.v} color={vs.color} />
                                </div>
                            ))}
                        </div>
                        <PieChart slices={VEHICLE_STATUS.map(vs => ({ v: vs.v, color: vs.color }))} />
                    </div>
                </Widget>

                <Widget title="Vehicle Locations">
                    <div style={{ background: C.surface, borderRadius: 10, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, border: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: '2rem' }}>🗺️</span>
                        <p style={{ ...T.label, color: C.dim }}>No active GPS data</p>
                        <p style={{ fontSize: '0.7rem', color: C.dim }}>{location}</p>
                    </div>
                </Widget>

                <Widget title="Overdue Inspections">
                    <KpiPair items={[
                        { label: 'Overdue', value: 0, color: C.red },
                        { label: '% of Total Due', value: '0%', color: C.orange },
                    ]} />
                </Widget>

                {/* Row 4 — Cost charts */}
                <Widget title="Fuel Costs">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ ...T.mono, fontSize: '0.68rem', color: C.dim }}>$5K</span>
                    </div>
                    <BarChart data={fuelData} color={C.green} height={60} />
                </Widget>

                <Widget title="Service Costs">
                    <BarChart data={svcData.map((v, i) => v)} color={C.cyan} height={60} />
                </Widget>

                <Widget title="Other Costs">
                    <BarChart data={otherData} color={C.orange} height={60} />
                </Widget>

                <Widget title="Total Costs">
                    <BarChart data={totalData.map(v => v * 1000)} color={C.blue} height={60} />
                </Widget>

                {/* Row 5 */}
                <Widget title="On-Time Service Compliance">
                    <KpiPair items={[
                        { label: 'All Time', value: '99%', color: C.green },
                        { label: 'Last 30 Days', value: '98%', color: C.accent },
                    ]} />
                </Widget>

                <Widget title="Cost Per Meter">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, ...T.label }}><Dot color={C.green} />Gasoline</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, ...T.label }}><Dot color={C.blue} />Electric</span>
                    </div>
                    <LineChart data={cpmData} color={C.green} height={55} />
                </Widget>

                <Widget title="Recent Comments" span={2}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {COMMENTS.map((c, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, padding: '0.625rem 0', borderBottom: i < COMMENTS.length - 1 ? `1px solid ${C.borderSub}` : 'none' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${C.accent}20`, border: `1px solid ${C.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...T.mono, fontSize: '0.6rem', fontWeight: 800, color: C.accent }}>
                                    {c.avatar}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: C.text }}>{c.user}</span>
                                        <span style={{ ...T.label, fontSize: '0.58rem', color: C.dim, flexShrink: 0 }}>{c.time}</span>
                                    </div>
                                    <p style={{ fontSize: '0.73rem', color: C.muted, marginTop: 2, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Widget>

                {/* Row 6 */}
                <Widget title="Top Reasons for Repair">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <PieChart slices={REASONS.map(r => ({ v: r.v, color: r.color }))} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                            {REASONS.map(r => (
                                <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Dot color={r.color} />
                                        <span style={{ fontSize: '0.75rem', color: C.muted }}>{r.label}</span>
                                    </div>
                                    <Badge v={r.v} color={r.color} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Widget>

                {/* Fleet Metrics summary */}
                <Widget title="Fleet Health Index" span={3}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '0.5rem' }}>
                        {[
                            { label: 'Total Vehicles', value: '52', color: C.text },
                            { label: 'Active', value: '42', color: C.green },
                            { label: 'Avg Mileage', value: '42,180 km', color: C.cyan },
                            { label: 'Fuel Spend (YTD)', value: 'AED 92K', color: C.orange },
                            { label: 'Service Spend (YTD)', value: 'AED 48K', color: C.accent },
                            { label: 'SLA On-Time', value: '99%', color: C.green },
                        ].map(item => (
                            <div key={item.label} style={{ background: C.surface, borderRadius: 10, padding: '0.75rem', border: `1px solid ${C.border}` }}>
                                <p style={{ ...T.h, fontSize: '1.2rem', color: item.color }}>{item.value}</p>
                                <p style={{ ...T.label, marginTop: 4 }}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </Widget>

            </div>
        </div>
    );
}
