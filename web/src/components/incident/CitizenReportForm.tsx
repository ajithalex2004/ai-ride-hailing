"use client";

import React, { useState } from 'react';

export default function CitizenReportForm() {
    const [type, setType] = useState('CRASH');
    const [severity, setSeverity] = useState('P2_URGENT');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call to Emergency Monolith
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="p-8 glass-panel rounded-2xl border border-green-500/50 text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Report Received</h3>
                <p className="text-xs text-muted-grey uppercase tracking-widest">Emergency units are being orchestrated. Geo-tag: DUBAI_MARINA_COORD</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-[10px] font-bold text-neon-blue uppercase tracking-widest hover:underline">File Another Report</button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </div>

            <h2 className="text-2xl font-black italic tracking-tighter text-pulse-orange mb-1">CITIZEN_REPORT</h2>
            <p className="text-[10px] text-muted-grey uppercase tracking-[0.3em] mb-8">Geo-Tagged Incident Injection</p>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[9px] font-bold text-muted-grey uppercase tracking-widest mb-2 block">Incident Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-bold focus:border-pulse-orange outline-none transition-all appearance-none"
                        >
                            <option value="CRASH">Major Accident</option>
                            <option value="STALL">Vehicle Stall</option>
                            <option value="HAZARD">Road Hazard</option>
                            <option value="FIRE">Fire Emergency</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-muted-grey uppercase tracking-widest mb-2 block">Severity</label>
                        <select
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-bold focus:border-pulse-orange outline-none transition-all appearance-none"
                        >
                            <option value="P1_CRITICAL">P1 - Life Critical</option>
                            <option value="P2_URGENT">P2 - Serious</option>
                            <option value="P3_MINIMUM">P3 - Minor</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[9px] font-bold text-muted-grey uppercase tracking-widest mb-2 block">Description</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-pulse-orange outline-none transition-all placeholder:text-white/20"
                        placeholder="Provide details about the scene (e.g., number of vehicles, smoke)..."
                    />
                </div>

                <button
                    disabled={isSubmitting}
                    className="w-full h-14 bg-pulse-orange hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-[0_10px_30px_rgba(255,102,0,0.3)] flex items-center justify-center gap-3 active:scale-95"
                >
                    {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            SUBMIT_GEO_REPORT
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
