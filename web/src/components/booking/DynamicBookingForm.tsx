"use client";

import React, { useState, useEffect } from 'react';
import { BOOKING_METADATA, FormField } from './metadata';

interface DispatchResult {
    trip_id: string;
    status: string;
    domain: string;
    eta_minutes: number;
    message: string;
    [key: string]: any;
}

export default function DynamicBookingForm() {
    const [selectedDomain, setSelectedDomain] = useState('TRANSPORT');
    const [selectedRequestType, setSelectedRequestType] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<DispatchResult | null>(null);

    const domainData = BOOKING_METADATA.find(d => d.domain === selectedDomain);
    const requestTypes = domainData ? Object.keys(domainData.requestTypes) : [];
    const currentRequestConfig = domainData?.requestTypes[selectedRequestType];

    useEffect(() => {
        if (requestTypes.length > 0) {
            setSelectedRequestType(requestTypes[0]);
        }
        setResult(null);
    }, [selectedDomain]);

    useEffect(() => {
        const defaults: any = {};
        currentRequestConfig?.fields.forEach((f: FormField) => {
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
            pickup_lat: 25.1972,
            pickup_lng: 55.2744,
            pickup_address: 'DIFC, Dubai',
            dropoff_lat: 25.0772,
            dropoff_lng: 55.1306,
            dropoff_address: 'Dubai Marina',
            requester_id: 101,
        };

        console.log(`[AI Dispatch Oracle] Routing to ${selectedDomain} domain...`, payload);

        try {
            const resp = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();
            setResult(data);
        } catch (err) {
            console.error('Booking failed', err);
            setResult({
                trip_id: 'ERR-000',
                status: 'ERROR',
                domain: selectedDomain,
                eta_minutes: 0,
                message: '❌ Could not reach Dispatch Oracle. Check console for details.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isEmergency = selectedDomain === 'EMERGENCY';

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                {/* Domain Toggle */}
                <div className="flex items-center gap-4 mb-8 p-1 bg-white/5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setSelectedDomain('TRANSPORT')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isEmergency ? 'bg-neon-blue text-deep-space shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'hover:bg-white/5 text-muted-grey'}`}
                    >
                        🚘 TRANSPORT
                    </button>
                    <button
                        onClick={() => setSelectedDomain('EMERGENCY')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${isEmergency ? 'bg-pulse-orange text-deep-space shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'hover:bg-white/5 text-muted-grey'}`}
                    >
                        🚑 EMERGENCY
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Request Type */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-grey ml-1">Request Type</label>
                        <select
                            value={selectedRequestType}
                            onChange={(e) => setSelectedRequestType(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-blue transition-all"
                        >
                            {requestTypes.map(rt => (
                                <option key={rt} value={rt}>{rt.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                        {currentRequestConfig?.fields.map((field: FormField) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-grey ml-1">{field.label}</label>
                                {renderField(field, formData[field.id], (val) => handleInputChange(field.id, val))}
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full py-5 rounded-2xl font-black text-lg mt-8 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 ${isEmergency ? 'bg-pulse-orange text-white shadow-lg shadow-pulse-orange/20' : 'bg-neon-blue text-deep-space shadow-lg shadow-neon-blue/20'}`}
                    >
                        {isLoading ? '⏳ Dispatching...' : (currentRequestConfig?.primaryAction || 'Process Request')}
                    </button>
                </div>
            </div>

            {/* Dispatch Result Panel */}
            {result && (
                <div className={`mt-6 p-6 rounded-2xl border animate-slideUp ${result.status === 'ERROR' ? 'bg-red-900/20 border-red-500/30' : isEmergency ? 'bg-orange-900/20 border-orange-500/30' : 'bg-cyan-900/20 border-cyan-500/30'}`}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Dispatch Oracle Response</p>
                            <p className="text-lg font-black">{result.message}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${result.status === 'DISPATCHED' ? 'bg-orange-500/20 text-orange-400' : result.status === 'MATCHED' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
                            {result.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-xs opacity-50 mb-1">TRIP ID</p>
                            <p className="font-mono font-bold">{result.trip_id}</p>
                        </div>
                        {result.eta_minutes > 0 && (
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-xs opacity-50 mb-1">ETA</p>
                                <p className="font-bold">{result.eta_minutes} minutes</p>
                            </div>
                        )}
                        {result.assigned_ambulance && (
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-xs opacity-50 mb-1">UNIT</p>
                                <p className="font-bold">{result.assigned_ambulance}</p>
                            </div>
                        )}
                        {result.assigned_driver && (
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-xs opacity-50 mb-1">DRIVER</p>
                                <p className="font-bold">{result.assigned_driver} ⭐ {result.driver_rating}</p>
                            </div>
                        )}
                        {result.fare_estimate_aed && (
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-xs opacity-50 mb-1">FARE ESTIMATE</p>
                                <p className="font-bold">AED {result.fare_estimate_aed}</p>
                            </div>
                        )}
                        {result.destination_hospital && (
                            <div className="bg-white/5 rounded-xl p-3 col-span-2">
                                <p className="text-xs opacity-50 mb-1">DESTINATION HOSPITAL</p>
                                <p className="font-bold">{result.destination_hospital}</p>
                            </div>
                        )}
                    </div>

                    <p className="text-xs opacity-30 mt-4 font-mono text-right">{result.processed_by}</p>
                </div>
            )}
        </div>
    );
}

function renderField(field: FormField, value: any, onChange: (val: any) => void) {
    switch (field.type) {
        case 'select':
            return (
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-blue transition-all"
                >
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        case 'number':
            return (
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-blue transition-all"
                />
            );
        case 'checkbox':
            return (
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => onChange(!value)}>
                    <span className="text-sm font-medium">Enable</span>
                    <div className={`w-6 h-6 rounded-md border border-white/20 flex items-center justify-center transition-all ${value ? 'bg-neon-blue border-neon-blue' : 'bg-transparent'}`}>
                        {value && <span className="text-deep-space text-xs font-bold">✓</span>}
                    </div>
                </div>
            );
        default:
            return (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-blue transition-all"
                />
            );
    }
}
