'use client';

import React, { useState } from 'react';
import MidnightSelect from '@/components/ui/MidnightSelect';

const reportData = [
    { id: 1, name: 'Monthly Expense Summary', date: 'Feb 2026', type: 'Financial', status: 'Ready' },
    { id: 2, name: 'Departmental Breakdown', date: 'Jan 2026', type: 'Analytics', status: 'Ready' },
    { id: 3, name: 'Sustainability & ESG Carbon Footprint', date: 'Q1 2026', type: 'ESG', status: 'In Progress' },
];

const PERIOD_OPTIONS = [
    { value: '30d', label: 'Last 30 Days' },
    { value: 'q', label: 'Last Quarter' },
    { value: 'custom', label: 'Custom Range' },
];

const TYPE_OPTIONS = [
    { value: 'expense', label: '💰 Expense Audit (VAT Inclusive)' },
    { value: 'util', label: '👤 Employee Utilization' },
    { value: 'esg', label: '🌱 Sustainability Report' },
];

export default function CorporateReportsPage() {
    const [period, setPeriod] = useState('30d');
    const [reportType, setReportType] = useState('expense');

    const handleExport = (name: string) => {
        alert(`Generating PDF Export for: ${name}\nYour download will begin shortly...`);
    };

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'var(--font-sans)', color: 'var(--t-text)' }}>
            {/* Header */}
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.4rem' }}>
                    Corporate Intelligence &amp; Reports
                </h1>
                <p style={{ color: 'var(--t-text-muted)', fontSize: '0.9rem' }}>
                    Generate and export detailed analytics for your workforce logistics.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Report Generator */}
                <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t-accent)', display: 'inline-block', boxShadow: '0 0 6px var(--t-accent)' }} />
                        Generate Custom Report
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <MidnightSelect label="Select Period" value={period} onChange={setPeriod} options={PERIOD_OPTIONS} />
                        <MidnightSelect label="Report Type" value={reportType} onChange={setReportType} options={TYPE_OPTIONS} />
                        <button
                            className="btn-primary"
                            style={{ marginTop: 4 }}
                            onClick={() => handleExport('Custom Audit Report')}
                        >
                            Generate &amp; Export PDF →
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { label: 'Total Reports Generated', value: '142', icon: '📊' },
                        { label: 'Scheduled Exports', value: '4 Active', icon: '⏱️' },
                        { label: 'Avg. Download Time', value: '1.2 sec', icon: '⚡' },
                    ].map(stat => (
                        <div key={stat.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                            <div>
                                <p className="stat-label">{stat.label}</p>
                                <p className="stat-value" style={{ fontSize: '1.35rem', color: 'var(--t-accent)' }}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Report List */}
            <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--t-border)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>Recent Generated Reports</h3>
                </div>
                <div>
                    {reportData.map((report, i) => (
                        <div key={report.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: i < reportData.length - 1 ? '1px solid var(--t-border-subtle)' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <span style={{ fontSize: '1.5rem' }}>📄</span>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--t-text)' }}>{report.name}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--t-text-muted)', marginTop: 2 }}>{report.date} · {report.type}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <span className={`badge ${report.status === 'Ready' ? 'badge-green' : 'badge-amber'}`}>
                                    {report.status}
                                </span>
                                <button
                                    style={{ background: 'none', border: 'none', color: report.status === 'Ready' ? 'var(--t-accent)' : 'var(--t-text-dim)', fontWeight: 700, fontSize: '0.8rem', cursor: report.status === 'Ready' ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)' }}
                                    disabled={report.status !== 'Ready'}
                                    onClick={() => handleExport(report.name)}
                                >
                                    Download PDF ↓
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
