'use client';

import React, { useState, useEffect } from 'react';
import { BOOKING_METADATA, FormField, ROLE_DOMAIN_ACCESS } from './metadata';
import { useAuth } from '@/context/AuthContext';

interface DispatchResult {
    trip_id: string;
    status: string;
    domain: string;
    eta_minutes: number;
    message: string;
    [key: string]: any;
}

export default function DynamicBookingForm() {
    const { user } = useAuth();

    // Filter domains the current role can access
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

    useEffect(() => {
        if (allowedDomains.length > 0) setSelectedDomain(allowedDomains[0].domain);
    }, [user?.role]);

    useEffect(() => {
        if (requestTypeKeys.length > 0) setSelectedRequestType(requestTypeKeys[0]);
        setResult(null);
    }, [selectedDomain]);

    useEffect(() => {
        const defaults: any = {};
        currentConfig?.fields.forEach((f: FormField) => {
            if (f.defaultValue !== undefined) defaults[f.id] = f.defaultValue;
        });
        setFormData(defaults);
        setResult(null);
    }, [selectedRequestType]);

    const handleInputChange = (id: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setResult(null);
        const payload = {
            domain: selectedDomain,
            request_type: selectedRequestType,
            priority: formData.priority || 'STANDARD',
            metadata_json: JSON.stringify(formData),
            pickup_address: 'DIFC, Dubai',
            dropoff_address: 'Dubai Marina',
            requester_id: user?.id ?? '0',
            requester_role: user?.role,
        };
        try {
            const resp = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setResult(await resp.json());
        } catch {
            setResult({ trip_id: 'ERR-000', status: 'ERROR', domain: selectedDomain, eta_minutes: 0, message: '❌ Request failed. Check console.' });
        } finally {
            setIsLoading(false);
        }
    };

    const isEmergency = selectedDomain === 'EMERGENCY';

    if (allowedDomains.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-4">🚫</p>
                <p className="font-bold">No booking access for your role.</p>
                <p className="text-sm mt-2">Contact your administrator to request access.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Domain Toggle */}
            <div className="flex gap-3 p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
                {allowedDomains.map(d => (
                    <button
                        key={d.domain}
                        onClick={() => setSelectedDomain(d.domain)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${selectedDomain === d.domain
                                ? d.domain === 'EMERGENCY'
                                    ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.35)]'
                                    : 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <span>{d.icon}</span>
                        <span>{d.label}</span>
                    </button>
                ))}
            </div>

            {/* Form Card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                {/* Request Type */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Request Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {requestTypeKeys.map(key => {
                            const config = domainData!.requestTypes[key];
                            const isActive = selectedRequestType === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedRequestType(key)}
                                    className={`py-2.5 px-3 rounded-xl text-sm font-bold border transition-all ${isActive
                                            ? isEmergency
                                                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                                                : 'bg-cyan-400/15 border-cyan-400/40 text-cyan-400'
                                            : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dynamic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {currentConfig?.fields.map((field: FormField) => (
                        <div key={field.id} className={field.type === 'checkbox' ? 'col-span-1 md:col-span-2' : ''}>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{field.label}</label>
                            {renderField(field, formData[field.id], (val) => handleInputChange(field.id, val), isEmergency)}
                        </div>
                    ))}
                </div>

                {/* Pickup / Dropoff (mocked) */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">📍 Pickup</p>
                        <p className="text-sm text-white font-medium">DIFC, Dubai</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">📍 Dropoff</p>
                        <p className="text-sm text-white font-medium">Dubai Marina</p>
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 ${isEmergency
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-400'
                            : 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/25 hover:bg-cyan-300'
                        }`}
                >
                    {isLoading ? '⏳ Dispatching...' : currentConfig?.primaryAction || 'Process Request'}
                </button>
            </div>

            {/* Result Panel */}
            {result && (
                <div className={`p-6 rounded-2xl border ${result.status === 'ERROR'
                        ? 'bg-red-900/20 border-red-500/30'
                        : isEmergency
                            ? 'bg-orange-900/20 border-orange-500/30'
                            : 'bg-cyan-900/20 border-cyan-500/30'
                    }`}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Dispatch Oracle Response</p>
                            <p className="text-base font-black">{result.message}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${result.status === 'DISPATCHED' ? 'bg-orange-500/20 text-orange-400' :
                                result.status === 'MATCHED' ? 'bg-cyan-500/20 text-cyan-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>{result.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-[10px] text-gray-500 mb-1">TRIP ID</p>
                            <p className="font-mono font-bold">{result.trip_id}</p>
                        </div>
                        {result.eta_minutes > 0 && (
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-[10px] text-gray-500 mb-1">ETA</p>
                                <p className="font-bold">{result.eta_minutes} min</p>
                            </div>
                        )}
                        {result.assigned_driver && (
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-[10px] text-gray-500 mb-1">DRIVER</p>
                                <p className="font-bold">{result.assigned_driver} ⭐ {result.driver_rating}</p>
                            </div>
                        )}
                        {result.fare_estimate_aed && (
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-[10px] text-gray-500 mb-1">FARE</p>
                                <p className="font-bold">AED {result.fare_estimate_aed}</p>
                            </div>
                        )}
                        {result.assigned_ambulance && (
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-[10px] text-gray-500 mb-1">UNIT</p>
                                <p className="font-bold">{result.assigned_ambulance}</p>
                            </div>
                        )}
                        {result.destination_hospital && (
                            <div className="bg-white/5 rounded-xl p-3 col-span-2">
                                <p className="text-[10px] text-gray-500 mb-1">HOSPITAL</p>
                                <p className="font-bold">{result.destination_hospital}</p>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-600 mt-3 font-mono text-right">{result.processed_by}</p>
                </div>
            )}
        </div>
    );
}

function renderField(field: FormField, value: any, onChange: (val: any) => void, isEmergency: boolean) {
    const focusClass = isEmergency ? 'focus:border-orange-400/60' : 'focus:border-cyan-400/60';
    const baseClass = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all ${focusClass}`;
    switch (field.type) {
        case 'select':
            return (
                <select value={value || ''} onChange={e => onChange(e.target.value)} className={baseClass}>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        case 'number':
            return <input type="number" value={value ?? ''} onChange={e => onChange(e.target.value)} className={baseClass} />;
        case 'checkbox':
            return (
                <div
                    onClick={() => onChange(!value)}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer select-none"
                >
                    <span className="text-sm font-medium text-white">Enable</span>
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${value ? (isEmergency ? 'bg-orange-500 border-orange-500' : 'bg-cyan-400 border-cyan-400') : 'bg-transparent border-white/20'}`}>
                        {value && <span className="text-black text-xs font-black">✓</span>}
                    </div>
                </div>
            );
        default:
            return <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={baseClass} />;
    }
}
