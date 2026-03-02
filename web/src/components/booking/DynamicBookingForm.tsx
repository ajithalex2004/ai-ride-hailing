'use client';

import React, { useState, useEffect } from 'react';
import { BOOKING_METADATA, FormField, ROLE_DOMAIN_ACCESS } from './metadata';
import { useAuth } from '@/context/AuthContext';

interface DispatchResult { trip_id: string; status: string; domain: string; eta_minutes: number; message: string;[key: string]: any; }

export default function DynamicBookingForm() {
    const { user } = useAuth();

    const allowedDomains = BOOKING_METADATA.filter(d =>
        !user || (ROLE_DOMAIN_ACCESS[user.role] ?? ['TRANSPORT', 'EMERGENCY']).includes(d.domain)
    );

    const [selectedDomain, setSelectedDomain] = useState(allowedDomains[0]?.domain ?? 'TRANSPORT');
    const [selectedRequestType, setSelectedRequestType] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<DispatchResult | null>(null);

    const domainData = allowedDomains.find(d => d.domain === selectedDomain);
    const requestTypeKeys = domainData ? Object.keys(domainData.requestTypes) : [];
    const currentConfig = domainData?.requestTypes[selectedRequestType];

    useEffect(() => { if (allowedDomains.length > 0) setSelectedDomain(allowedDomains[0].domain); }, [user?.role]);
    useEffect(() => { if (requestTypeKeys.length > 0) setSelectedRequestType(requestTypeKeys[0]); setResult(null); }, [selectedDomain]);
    useEffect(() => {
        const defaults: any = {};
        currentConfig?.fields.forEach((f: FormField) => { if (f.defaultValue !== undefined) defaults[f.id] = f.defaultValue; });
        setFormData(defaults); setResult(null);
    }, [selectedRequestType]);

    const handleSubmit = async () => {
        setIsLoading(true); setResult(null);
        try {
            const resp = await fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain: selectedDomain, request_type: selectedRequestType, priority: formData.priority || 'STANDARD', metadata_json: JSON.stringify(formData), pickup_address: 'DIFC, Dubai', dropoff_address: 'Dubai Marina', requester_id: user?.id ?? '0', requester_role: user?.role }) });
            setResult(await resp.json());
        } catch { setResult({ trip_id: 'ERR-000', status: 'ERROR', domain: selectedDomain, eta_minutes: 0, message: '❌ Request failed.' }); }
        finally { setIsLoading(false); }
    };

    const isEmergency = selectedDomain === 'EMERGENCY';
    const accentColor = isEmergency ? 'var(--t-orange)' : 'var(--t-accent)';
    const accentSoft = isEmergency ? 'var(--t-orange-soft)' : 'var(--t-accent-soft)';
    const accentBorder = isEmergency ? 'rgba(249,115,22,0.25)' : 'rgba(245,158,11,0.25)';

    if (allowedDomains.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t-text-muted)' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚫</p>
                <p style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>No booking access for your role.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--t-text-dim)' }}>Contact your administrator to request access.</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Domain Toggle */}
            <div style={{ display: 'flex', gap: 8, padding: 4, background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 16 }}>
                {allowedDomains.map(d => {
                    const isActive = selectedDomain === d.domain;
                    const isEmg = d.domain === 'EMERGENCY';
                    return (
                        <button key={d.domain} onClick={() => setSelectedDomain(d.domain)}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.7rem', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', transition: 'all 0.2s',
                                background: isActive ? (isEmg ? 'var(--t-orange)' : 'var(--t-accent)') : 'transparent',
                                color: isActive ? (isEmg ? '#fff' : 'var(--t-accent-contrast)') : 'var(--t-text-muted)',
                                boxShadow: isActive ? `0 4px 15px ${isEmg ? 'rgba(249,115,22,0.3)' : 'rgba(245,158,11,0.3)'}` : 'none',
                            }}>
                            <span>{d.icon}</span><span>{d.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Form Card */}
            <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 20, padding: '1.75rem' }}>

                {/* Request Type Pills */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Request Type</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {requestTypeKeys.map(key => {
                            const cfg = domainData!.requestTypes[key];
                            const isActive = selectedRequestType === key;
                            return (
                                <button key={key} onClick={() => setSelectedRequestType(key)}
                                    style={{ padding: '0.5rem 1rem', borderRadius: 10, border: `1px solid ${isActive ? accentBorder : 'var(--t-border)'}`, background: isActive ? accentSoft : 'var(--t-surface)', color: isActive ? accentColor : 'var(--t-text-muted)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-sans)', cursor: 'pointer', transition: 'all 0.15s' }}>
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dynamic Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    {currentConfig?.fields.map((field: FormField) => (
                        <div key={field.id} style={{ gridColumn: field.type === 'checkbox' ? '1 / -1' : 'auto' }}>
                            <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{field.label}</label>
                            {renderField(field, formData[field.id], (val) => setFormData((p: any) => ({ ...p, [field.id]: val })), accentColor, accentSoft)}
                        </div>
                    ))}
                </div>

                {/* Pickup / Drop */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
                    {[['📍 Pickup', 'DIFC, Dubai'], ['📍 Dropoff', 'Dubai Marina']].map(([lbl, val]) => (
                        <div key={lbl} style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 10, padding: '0.7rem 0.85rem' }}>
                            <p style={{ fontSize: '0.6rem', color: 'var(--t-text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{lbl}</p>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--t-text)' }}>{val}</p>
                        </div>
                    ))}
                </div>

                {/* Submit */}
                <button onClick={handleSubmit} disabled={isLoading}
                    style={{
                        width: '100%', padding: '0.95rem', borderRadius: 14, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1rem', transition: 'all 0.2s', opacity: isLoading ? 0.65 : 1,
                        background: isEmergency ? 'var(--t-orange)' : 'var(--t-accent)',
                        color: isEmergency ? '#fff' : 'var(--t-accent-contrast)',
                        boxShadow: `0 4px 20px ${isEmergency ? 'rgba(249,115,22,0.25)' : 'rgba(245,158,11,0.25)'}`,
                    }}>
                    {isLoading ? '⏳ Dispatching...' : (currentConfig?.primaryAction || 'Process Request')}
                </button>
            </div>

            {/* Result Panel */}
            {result && (
                <div style={{ padding: '1.25rem', borderRadius: 16, border: `1px solid ${result.status === 'ERROR' ? 'rgba(239,68,68,0.25)' : accentBorder}`, background: result.status === 'ERROR' ? 'var(--t-red-soft)' : accentSoft, animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ fontSize: '0.6rem', color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>Dispatch Oracle Response</p>
                            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1rem', color: 'var(--t-text)' }}>{result.message}</p>
                        </div>
                        <span className={`badge ${result.status === 'DISPATCHED' ? 'badge-orange' : result.status === 'MATCHED' ? 'badge-amber' : 'badge-red'}`}>
                            {result.status}
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                            result.trip_id && { label: 'TRIP ID', val: result.trip_id, mono: true },
                            result.eta_minutes > 0 && { label: 'ETA', val: `${result.eta_minutes} min` },
                            result.assigned_driver && { label: 'DRIVER', val: `${result.assigned_driver} ⭐ ${result.driver_rating}` },
                            result.fare_estimate_aed && { label: 'FARE', val: `AED ${result.fare_estimate_aed}` },
                            result.assigned_ambulance && { label: 'UNIT', val: result.assigned_ambulance },
                        ].filter(Boolean).map((item: any) => (
                            <div key={item.label} style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 10, padding: '0.6rem 0.75rem' }}>
                                <p style={{ fontSize: '0.6rem', color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 3 }}>{item.label}</p>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: item.mono ? 'var(--font-mono)' : 'inherit' }}>{item.val}</p>
                            </div>
                        ))}
                        {result.destination_hospital && (
                            <div style={{ gridColumn: '1 / -1', background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 10, padding: '0.6rem 0.75rem' }}>
                                <p style={{ fontSize: '0.6rem', color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 3 }}>HOSPITAL</p>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{result.destination_hospital}</p>
                            </div>
                        )}
                    </div>
                    {result.processed_by && <p style={{ fontSize: '0.6rem', color: 'var(--t-text-dim)', fontFamily: 'var(--font-mono)', textAlign: 'right', marginTop: 10 }}>{result.processed_by}</p>}
                </div>
            )}
        </div>
    );
}

function renderField(field: FormField, value: any, onChange: (val: any) => void, accentColor: string, accentSoft: string) {
    const base: React.CSSProperties = { width: '100%', background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderRadius: 10, padding: '0.65rem 0.85rem', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' };
    if (field.type === 'select') return (
        <select value={value || ''} onChange={e => onChange(e.target.value)} style={base}>
            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    );
    if (field.type === 'number') return <input type="number" value={value ?? ''} onChange={e => onChange(e.target.value)} style={base} />;
    if (field.type === 'checkbox') return (
        <div onClick={() => onChange(!value)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 10, background: 'var(--t-surface)', border: '1px solid var(--t-border)', cursor: 'pointer', userSelect: 'none' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--t-text-muted)' }}>Enable</span>
            <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${value ? accentColor : 'var(--t-border)'}`, background: value ? accentSoft : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                {value && <span style={{ color: accentColor, fontSize: 12, fontWeight: 900 }}>✓</span>}
            </div>
        </div>
    );
    return <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} style={base} />;
}
