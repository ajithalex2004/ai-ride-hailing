'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

/* ── theme ── */
const card = { background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16 } as React.CSSProperties;
const mono = { fontFamily: 'var(--font-mono)' } as React.CSSProperties;
const hdg = { fontFamily: 'var(--font-heading)', fontWeight: 900 } as React.CSSProperties;
const lbl = { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.09em', color: 'var(--t-text-dim)' };
const MUT = '#8899AB';
const ACCENT = '#F59E0B';
const TEAL = '#14B8A6';

/* ── default parameters ── */
const DEFAULT = {
    vehicleLife: 96,       // months
    annualUsage: 20000,    // km
    fuelEfficiency: 15,    // L/100 km
    purchasePrice: 50000,  // AED
    disposalCost: 1000,    // AED
    salvageValue: 20,      // % of purchase
    deprecMethod: 'double' as 'double' | 'sumOfYears',
    serviceCosts: [1500, 1500, 1500, 300, 1350, 2500, 2000, 10000],
    fuelPrices: [1.5, 1.6, 1.75, 1.9, 2.0, 2.1, 2.3, 2.5],
};

/* ── analysis engine ── */
type YearPoint = {
    year: number;
    depreciation: number;      // cumulative AED
    serviceCum: number;        // cumulative AED
    fuelCum: number;           // cumulative AED
    totalCostPerKm: number;    // AED/km
    depreciationPerKm: number;
    servicePerKm: number;
    fuelPerKm: number;
};

function computeAnalysis(p: typeof DEFAULT): YearPoint[] {
    const years = Math.round(p.vehicleLife / 12);
    const N = Math.max(years, 8);
    const salvage = p.purchasePrice * (p.salvageValue / 100);
    const depreciable = p.purchasePrice - salvage;
    const annualKm = p.annualUsage;

    // Depreciation arrays
    const annualDep: number[] = [];
    if (p.deprecMethod === 'double') {
        let bv = p.purchasePrice;
        const rate = 2 / N;
        for (let i = 0; i < N; i++) {
            const d = Math.min(bv * rate, bv - salvage);
            annualDep.push(Math.max(0, d));
            bv -= Math.max(0, d);
        }
    } else {
        // Sum of years digits
        const sumY = (N * (N + 1)) / 2;
        for (let i = 0; i < N; i++) annualDep.push(depreciable * ((N - i) / sumY));
    }

    const points: YearPoint[] = [];
    let cumDep = 0, cumSvc = 0, cumFuel = 0;
    for (let i = 0; i < N; i++) {
        const yr = i + 1;
        cumDep += annualDep[i] ?? 0;
        cumSvc += (p.serviceCosts[i] ?? (p.serviceCosts[p.serviceCosts.length - 1] * 1.15));
        // fuel cost = annualKm/100 * fuelEfficiency * pricePerLitre
        const fuelL = (annualKm / 100) * p.fuelEfficiency;
        cumFuel += fuelL * (p.fuelPrices[i] ?? (p.fuelPrices[p.fuelPrices.length - 1] * 1.05));

        const kmSoFar = yr * annualKm;
        points.push({
            year: yr,
            depreciation: cumDep,
            serviceCum: cumSvc,
            fuelCum: cumFuel,
            totalCostPerKm: (cumDep + cumSvc + cumFuel) / kmSoFar,
            depreciationPerKm: cumDep / kmSoFar,
            servicePerKm: cumSvc / kmSoFar,
            fuelPerKm: cumFuel / kmSoFar,
        });
    }
    return points;
}

/* ── SVG Chart ── */
function ReplacementChart({ points, optimalYear }: { points: YearPoint[]; optimalYear: number }) {
    const W = 700, H = 260, PL = 60, PR = 40, PT = 30, PB = 50;
    const plotW = W - PL - PR, plotH = H - PT - PB;

    const maxY = Math.max(...points.map(p => p.totalCostPerKm)) * 1.15;
    const minY = 0;
    const N = points.length;

    const xScale = (i: number) => PL + (i / (N - 1)) * plotW;
    const yScale = (v: number) => PT + plotH - ((v - minY) / (maxY - minY)) * plotH;

    const linePoints = (accessor: (p: YearPoint) => number) =>
        points.map((p, i) => `${xScale(i)},${yScale(accessor(p))}`).join(' ');

    const areaPath = (top: (p: YearPoint) => number, bot: (p: YearPoint) => number) => {
        const topPts = points.map((p, i) => `${xScale(i)},${yScale(top(p))}`).join(' ');
        const botPts = [...points].reverse().map((p, i) => `${xScale(N - 1 - i)},${yScale(bot(p))}`).join(' ');
        return `M ${topPts.split(' ')[0]} L ${topPts} L ${botPts} Z`;
    };

    // Optimal replacement X position
    const optX = xScale(optimalYear - 1);
    const minCostY = yScale(points[optimalYear - 1]?.totalCostPerKm ?? 0);

    // Y-axis ticks
    const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map(f => ({ v: minY + f * (maxY - minY), y: yScale(minY + f * (maxY - minY)) }));

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            {/* grid */}
            {yTicks.map(t => (
                <g key={t.v}>
                    <line x1={PL} y1={t.y} x2={PL + plotW} y2={t.y} stroke="#2A3A50" strokeWidth={1} />
                    <text x={PL - 8} y={t.y + 4} textAnchor="end" style={{ ...mono, fontSize: 9, fill: MUT }}>{t.v.toFixed(2)}</text>
                </g>
            ))}

            {/* X-axis labels */}
            {points.map((p, i) => (
                <text key={i} x={xScale(i)} y={PT + plotH + 18} textAnchor="middle" style={{ ...mono, fontSize: 9, fill: MUT }}>{p.year}</text>
            ))}

            {/* Optimal replacement highlight zone */}
            <rect x={optX - 18} y={PT} width={36} height={plotH} fill={`${ACCENT}18`} stroke={`${ACCENT}44`} strokeWidth={1} strokeDasharray="4,3" />
            <text x={optX + 24} y={PT + 14} style={{ ...mono, fontSize: 8, fill: ACCENT, writingMode: 'vertical-rl' as const }}>Optimal Replacement</text>

            {/* Area: fuel (bottom layer) */}
            <path d={areaPath(p => p.fuelPerKm, () => 0)} fill={`${TEAL}30`} />
            {/* Area: service */}
            <path d={areaPath(p => p.fuelPerKm + p.servicePerKm, p => p.fuelPerKm)} fill={`${TEAL}50`} />
            {/* Area: depreciation (top) */}
            <path d={areaPath(p => p.totalCostPerKm, p => p.fuelPerKm + p.servicePerKm)} fill={`${TEAL}40`} />

            {/* Total cost line */}
            <polyline points={linePoints(p => p.totalCostPerKm)} fill="none" stroke={TEAL} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* Minimum cost dotted line */}
            <line x1={PL} y1={minCostY} x2={PL + plotW} y2={minCostY} stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6,4" />
            <text x={PL + 6} y={minCostY - 5} style={{ ...mono, fontSize: 8, fill: ACCENT }}>Minimum Cost of Ownership</text>

            {/* Optimal marker dot */}
            <circle cx={optX} cy={yScale(points[optimalYear - 1]?.totalCostPerKm ?? 0)} r={5} fill={ACCENT} stroke="var(--t-card)" strokeWidth={2} />

            {/* Axes */}
            <line x1={PL} y1={PT} x2={PL} y2={PT + plotH} stroke="#2A3A50" strokeWidth={1.5} />
            <line x1={PL} y1={PT + plotH} x2={PL + plotW} y2={PT + plotH} stroke="#2A3A50" strokeWidth={1.5} />

            {/* Axis labels */}
            <text x={PL - 36} y={PT + plotH / 2} textAnchor="middle" transform={`rotate(-90,${PL - 36},${PT + plotH / 2})`} style={{ ...mono, fontSize: 9, fill: MUT }}>Annual Cost per Kilometer</text>
            <text x={PL + plotW / 2} y={H - 4} textAnchor="middle" style={{ ...mono, fontSize: 10, fill: MUT }}>Vehicle Age (years)</text>

            {/* Title */}
            <text x={PL + plotW / 2} y={15} textAnchor="middle" style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, fill: 'var(--t-text)' }}>Vehicle Replacement Analysis</text>
        </svg>
    );
}

/* ── Number Input ── */
function NumInput({ value, onChange, suffix, step = 1 }: { value: number; onChange: (v: number) => void; suffix?: string; step?: number }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--t-border)', borderRadius: 9, overflow: 'hidden', background: 'var(--t-surface)' }}>
            <input type="number" value={value} step={step} onChange={e => onChange(parseFloat(e.target.value) || 0)}
                style={{ flex: 1, padding: '0.45rem 0.65rem', border: 'none', background: 'transparent', color: 'var(--t-text)', ...mono, fontSize: '0.82rem', outline: 'none', minWidth: 0 }} />
            {suffix && <span style={{ padding: '0 0.6rem', ...lbl, fontSize: '0.58rem', borderLeft: '1px solid var(--t-border)', background: 'var(--t-card)', color: MUT, whiteSpace: 'nowrap' as const }}>{suffix}</span>}
        </div>
    );
}

/* ── Per-year table (editable) ── */
function YearTable({ title, values, suffix, step = 1, onChange }: {
    title: string; values: number[]; suffix: string; step?: number; onChange: (i: number, v: number) => void;
}) {
    return (
        <div style={{ ...card, padding: '1.25rem', flex: 1 }}>
            <p style={{ ...hdg, fontSize: '0.9rem', marginBottom: 14 }}>{title}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {values.map((v, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ ...lbl, fontSize: '0.58rem', width: 36 }}>Year {i + 1}</span>
                        <NumInput value={v} step={step} onChange={nv => onChange(i, nv)} suffix={suffix} />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Main Page ── */
export default function ReplacementAnalysisPage() {
    const [params, setParams] = useState(DEFAULT);
    const set = <K extends keyof typeof DEFAULT>(k: K, v: typeof DEFAULT[K]) => setParams(p => ({ ...p, [k]: v }));

    const setSvcCost = (i: number, v: number) => setParams(p => { const a = [...p.serviceCosts]; a[i] = v; return { ...p, serviceCosts: a }; });
    const setFuelPx = (i: number, v: number) => setParams(p => { const a = [...p.fuelPrices]; a[i] = v; return { ...p, fuelPrices: a }; });

    const points = useMemo(() => computeAnalysis(params), [params]);

    // Optimal year = minimum totalCostPerKm
    const optimalYear = useMemo(() => {
        let minIdx = 0, minVal = Infinity;
        points.forEach((p, i) => { if (p.totalCostPerKm < minVal) { minVal = p.totalCostPerKm; minIdx = i; } });
        return minIdx + 1;
    }, [points]);

    const optPt = points[optimalYear - 1];

    const inpStyle = { width: '100%', padding: '0.5rem 0.7rem', borderRadius: 9, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-text)', ...mono, fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' as const };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', padding: '1.75rem' }}>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Link href="/admin/fleet" style={{ ...lbl, color: MUT, textDecoration: 'none' }}>Fleet</Link>
                        <span style={{ color: 'var(--t-border)' }}>/</span>
                        <span style={{ ...lbl, color: ACCENT }}>Replacement Analysis</span>
                    </div>
                    <h1 style={{ ...hdg, fontSize: '1.9rem', marginBottom: '0.2rem' }}>Vehicle Replacement Analysis</h1>
                    <p style={{ color: MUT, fontSize: '0.82rem' }}>Model lifecycle costs to determine the optimal time to replace a vehicle</p>
                </div>
                {/* Optimal result badge */}
                {optPt && (
                    <div style={{ ...card, padding: '1rem 1.5rem', borderColor: `${ACCENT}44`, background: `${ACCENT}0A`, textAlign: 'center' as const }}>
                        <p style={{ ...lbl, color: ACCENT, marginBottom: 4 }}>Optimal Replacement</p>
                        <p style={{ ...hdg, fontSize: '1.6rem', color: ACCENT }}>Year {optimalYear}</p>
                        <p style={{ ...mono, fontSize: '0.72rem', color: MUT, marginTop: 2 }}>
                            AED {optPt.totalCostPerKm.toFixed(3)} / km
                        </p>
                    </div>
                )}
            </div>

            {/* KPI strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {optPt && [
                    { icon: '📅', label: 'Vehicle Life', val: `${params.vehicleLife} months`, color: 'var(--t-cyan)' },
                    { icon: '🛣️', label: 'Annual Usage', val: `${params.annualUsage.toLocaleString()} km`, color: 'var(--t-green)' },
                    { icon: '💰', label: 'Total Cost at Opt.', val: `AED ${((optPt.depreciation + optPt.serviceCum + optPt.fuelCum) / 1000).toFixed(1)}k`, color: ACCENT },
                    { icon: '📉', label: 'Cost / km at Opt.', val: `AED ${optPt.totalCostPerKm.toFixed(3)}`, color: 'var(--t-purple)' },
                ].map(k => (
                    <div key={k.label} style={{ ...card, padding: '1rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: 6 }}>{k.icon}</p>
                        <p style={{ ...hdg, fontSize: '1.25rem', color: k.color }}>{k.val}</p>
                        <p style={lbl}>{k.label}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
                <ReplacementChart points={points} optimalYear={optimalYear} />
                {/* Legend */}
                <div style={{ display: 'flex', gap: 18, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                        { color: `${TEAL}80`, label: 'Depreciation' },
                        { color: `${TEAL}B0`, label: 'Service Costs' },
                        { color: `${TEAL}50`, label: 'Fuel Costs' },
                        { color: TEAL, label: 'Total Cost/km' },
                        { color: ACCENT, label: 'Min. Cost of Ownership', dashed: true },
                    ].map(l => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: l.dashed ? 20 : 12, height: l.dashed ? 0 : 12, borderRadius: l.dashed ? 0 : 3, background: l.dashed ? 'transparent' : l.color, borderTop: l.dashed ? `2px dashed ${l.color}` : 'none' }} />
                            <span style={{ fontSize: '0.72rem', color: MUT }}>{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Parameters + Cost tables */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>

                {/* Lifecycle Estimates */}
                <div style={{ ...card, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <p style={{ ...hdg, fontSize: '0.9rem', marginBottom: 4 }}>Lifecycle Estimates</p>

                    {/* Estimated Vehicle Life */}
                    <div>
                        <label style={{ ...lbl, display: 'block', marginBottom: 5 }}>Estimated Vehicle Life</label>
                        <NumInput value={params.vehicleLife} onChange={v => set('vehicleLife', Math.max(12, v))} suffix="months" />
                    </div>
                    <div>
                        <label style={{ ...lbl, display: 'block', marginBottom: 5 }}>Estimated Annual Usage</label>
                        <NumInput value={params.annualUsage} step={1000} onChange={v => set('annualUsage', Math.max(1000, v))} suffix="km" />
                    </div>
                    <div>
                        <label style={{ ...lbl, display: 'block', marginBottom: 5 }}>Estimated Fuel Efficiency</label>
                        <NumInput value={params.fuelEfficiency} step={0.5} onChange={v => set('fuelEfficiency', Math.max(1, v))} suffix="L/100km" />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--t-border)' }} />
                    <p style={{ ...hdg, fontSize: '0.82rem' }}>Acquisition</p>
                    <div>
                        <label style={{ ...lbl, display: 'block', marginBottom: 5 }}>Purchase Price (AED)</label>
                        <NumInput value={params.purchasePrice} step={1000} onChange={v => set('purchasePrice', Math.max(1000, v))} suffix="AED" />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--t-border)' }} />
                    <p style={{ ...hdg, fontSize: '0.82rem' }}>Disposal</p>
                    <div>
                        <label style={{ ...lbl, display: 'block', marginBottom: 5 }}>Estimated Disposal Cost</label>
                        <NumInput value={params.disposalCost} step={100} onChange={v => set('disposalCost', v)} suffix="AED" />
                    </div>
                    <div>
                        <label style={{ ...lbl, display: 'block', marginBottom: 5 }}>Estimated Salvage Value</label>
                        <NumInput value={params.salvageValue} step={1} onChange={v => set('salvageValue', Math.max(0, Math.min(100, v)))} suffix="% of price" />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--t-border)' }} />
                    <p style={{ ...hdg, fontSize: '0.82rem' }}>Depreciation Method</p>
                    <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
                        {([['double', 'Double Declining'], ['sumOfYears', 'Sum of Years']] as const).map(([val, label]) => (
                            <button key={val} onClick={() => set('deprecMethod', val)}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.55rem 0.875rem', borderRadius: 10, border: `1px solid ${params.deprecMethod === val ? ACCENT + '66' : 'var(--t-border)'}`, background: params.deprecMethod === val ? `${ACCENT}12` : 'var(--t-surface)', cursor: 'pointer', textAlign: 'left' as const }}>
                                <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${params.deprecMethod === val ? ACCENT : 'var(--t-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {params.deprecMethod === val && <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />}
                                </div>
                                <span style={{ fontSize: '0.82rem', fontWeight: params.deprecMethod === val ? 700 : 400, color: params.deprecMethod === val ? ACCENT : 'var(--t-text)' }}>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Service Cost Estimates */}
                <YearTable
                    title="Service Cost Estimates"
                    values={params.serviceCosts}
                    suffix="AED / year"
                    step={50}
                    onChange={setSvcCost}
                />

                {/* Fuel Cost Estimates */}
                <YearTable
                    title="Fuel Cost Estimates"
                    values={params.fuelPrices}
                    suffix="AED / litre"
                    step={0.05}
                    onChange={setFuelPx}
                />
            </div>

            {/* Cost breakdown table */}
            <div style={{ ...card, padding: '1.25rem', marginTop: '1.25rem', overflow: 'auto' }}>
                <p style={{ ...hdg, fontSize: '0.9rem', marginBottom: 12 }}>Year-by-Year Cost Breakdown</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', ...mono, fontSize: '0.75rem' }}>
                    <thead>
                        <tr style={{ background: 'var(--t-surface)' }}>
                            {['Year', 'Depreciation', 'Cumul. Service', 'Cumul. Fuel', 'Total Cost', 'Cost/km', 'Rec.'].map(h => (
                                <th key={h} style={{ padding: '0.6rem 0.875rem', textAlign: 'left', ...lbl, fontSize: '0.58rem', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {points.map((p, i) => {
                            const isOpt = p.year === optimalYear;
                            return (
                                <tr key={i} style={{ borderBottom: '1px solid #1e2d3e', background: isOpt ? `${ACCENT}0A` : 'transparent' }}
                                    onMouseEnter={e => (e.currentTarget as any).style.background = isOpt ? `${ACCENT}15` : 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => (e.currentTarget as any).style.background = isOpt ? `${ACCENT}0A` : 'transparent'}>
                                    <td style={{ padding: '0.6rem 0.875rem', fontWeight: 700, color: isOpt ? ACCENT : 'var(--t-text)' }}>{p.year}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', color: MUT }}>AED {p.depreciation.toFixed(0)}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', color: MUT }}>AED {p.serviceCum.toFixed(0)}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', color: MUT }}>AED {p.fuelCum.toFixed(0)}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', fontWeight: 700 }}>AED {(p.depreciation + p.serviceCum + p.fuelCum).toFixed(0)}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', color: isOpt ? ACCENT : 'var(--t-text)', fontWeight: isOpt ? 800 : 400 }}>AED {p.totalCostPerKm.toFixed(4)}</td>
                                    <td style={{ padding: '0.6rem 0.875rem' }}>
                                        {isOpt && <span style={{ padding: '0.15rem 0.5rem', borderRadius: 999, fontSize: '0.58rem', fontWeight: 800, background: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}44` }}>✓ Optimal</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
