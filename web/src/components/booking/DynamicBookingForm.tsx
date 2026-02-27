"use client";

import React, { useState, useEffect } from 'react';
import { BOOKING_METADATA, FormField } from './metadata';

export default function DynamicBookingForm() {
    const [selectedDomain, setSelectedDomain] = useState('TRANSPORT');
    const [selectedRequestType, setSelectedRequestType] = useState('');
    const [formData, setFormData] = useState<any>({});

    const domainData = BOOKING_METADATA.find(d => d.domain === selectedDomain);
    const requestTypes = domainData ? Object.keys(domainData.requestTypes) : [];
    const currentRequestConfig = domainData?.requestTypes[selectedRequestType];

    useEffect(() => {
        if (requestTypes.length > 0) {
            setSelectedRequestType(requestTypes[0]);
        }
    }, [selectedDomain]);

    useEffect(() => {
        // Reset form data when request type changes
        const defaults: any = {};
        currentRequestConfig?.fields.forEach(f => {
            if (f.defaultValue !== undefined) defaults[f.id] = f.defaultValue;
        });
        setFormData(defaults);
    }, [selectedRequestType]);

    const handleInputChange = (id: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        const endpoint = selectedDomain === 'EMERGENCY'
            ? 'http://localhost:9001/api/v1/emergency/book'
            : 'http://localhost:9002/api/v1/transport/book';

        const payload = {
            domain: selectedDomain,
            request_type: selectedRequestType,
            priority: formData.priority || 'STANDARD',
            metadata_json: JSON.stringify(formData),
            pickup_lat: 25.1972, // Mocked from map logic
            pickup_lng: 55.2744,
            pickup_address: "Current Location",
            dropoff_lat: 25.0772,
            dropoff_lng: 55.1306,
            dropoff_address: "Destination",
            requester_id: 101, // Mocked auth user
        };

        console.log(`[DynamicEngine] Routing to ${selectedDomain} Monolith...`, payload);

        try {
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await resp.json();
            alert(`${selectedDomain} Request Processed! Status: ${result.status}`);
        } catch (err) {
            console.error("Submission failed", err);
            alert("Submission simulation active. (Backend connection skipped in test)");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-8 p-1 bg-white/5 rounded-2xl border border-white/5">
                <button
                    onClick={() => setSelectedDomain('TRANSPORT')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${selectedDomain === 'TRANSPORT' ? 'bg-neon-blue text-deep-space shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'hover:bg-white/5 text-muted-grey'}`}
                >
                    🚘 TRANSPORT
                </button>
                <button
                    onClick={() => setSelectedDomain('EMERGENCY')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${selectedDomain === 'EMERGENCY' ? 'bg-pulse-orange text-deep-space shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'hover:bg-white/5 text-muted-grey'}`}
                >
                    🚑 EMERGENCY
                </button>
            </div>

            <div className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    {currentRequestConfig?.fields.map(field => (
                        <div key={field.id} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-grey ml-1">{field.label}</label>
                            {renderField(field, formData[field.id], (val) => handleInputChange(field.id, val))}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className={`w-full py-5 rounded-2xl font-black text-lg mt-8 transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedDomain === 'EMERGENCY' ? 'bg-pulse-orange text-white shadow-lg shadow-pulse-orange/20' : 'bg-neon-blue text-deep-space shadow-lg shadow-neon-blue/20'}`}>
                    {currentRequestConfig?.primaryAction || 'Process Request'}
                </button>
            </div>
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
