'use client';

import React, { useState } from 'react';
import MidnightSelect from '@/components/ui/MidnightSelect';

const INCIDENT_TYPE_OPTIONS = [
    { value: 'CRASH', label: '🚗 Major Accident' },
    { value: 'STALL', label: '🔧 Vehicle Stall' },
    { value: 'HAZARD', label: '⚠️ Road Hazard' },
    { value: 'FIRE', label: '🔥 Fire Emergency' },
];

const SEVERITY_OPTIONS = [
    { value: 'P1_CRITICAL', label: '🔴 P1 – Life Critical' },
    { value: 'P2_URGENT', label: '🟠 P2 – Serious' },
    { value: 'P3_MINIMUM', label: '🟡 P3 – Minor' },
];

export default function CitizenReportForm() {
    const [type, setType] = useState('CRASH');
    const [severity, setSeverity] = useState('P2_URGENT');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => { setIsSubmitting(false); setSubmitted(true); }, 1500);
    };

    if (submitted) {
        return (
            <div style={{ padding: '2rem', background: 'var(--t-card)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--t-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                    <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Report Received</h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--t-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
                    Emergency units are being orchestrated · Geo-tag: DUBAI_MARINA_COORD
                </p>
                <button onClick={() => setSubmitted(false)}
                    style={{ marginTop: '1rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--t-accent)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    ← File Another Report
                </button>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: 16, opacity: 0.06 }}>
                <svg width="80" height="80" fill="var(--t-orange)" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--t-orange)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                CITIZEN_REPORT
            </h2>
            <p style={{ fontSize: '0.67rem', color: 'var(--t-text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)', marginBottom: '1.5rem' }}>
                Geo-Tagged Incident Injection
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <MidnightSelect
                        label="Incident Type"
                        value={type}
                        onChange={setType}
                        options={INCIDENT_TYPE_OPTIONS}
                        accent="var(--t-orange)"
                    />
                    <MidnightSelect
                        label="Severity Level"
                        value={severity}
                        onChange={setSeverity}
                        options={SEVERITY_OPTIONS}
                        accent="var(--t-orange)"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: 'var(--font-sans)', marginBottom: 6 }}>
                        Description
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe the scene (number of vehicles, smoke, injuries)…"
                        style={{ width: '100%', padding: '0.7rem 0.875rem', borderRadius: 10, background: 'var(--t-surface)', border: '1px solid var(--t-border)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        width: '100%', padding: '0.9rem', borderRadius: 12, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1,
                        background: 'var(--t-orange)', color: '#fff',
                        fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.95rem',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        boxShadow: '0 4px 20px rgba(249,115,22,0.3)',
                    }}
                >
                    {isSubmitting ? (
                        <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    ) : (
                        <>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            SUBMIT_GEO_REPORT
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
