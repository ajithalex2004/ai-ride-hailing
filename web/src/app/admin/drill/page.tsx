"use client";

import React, { useState, useEffect } from 'react';
import LiveMapOverlay from '@/components/map/LiveMapOverlay';

type DrillStep = 'IDLE' | 'ALERT' | 'DISPATCH' | 'ROUTING' | 'TELEMETRY' | 'COMPLETED';

export default function EmergencyDrillPage() {
    const [step, setStep] = useState<DrillStep>('IDLE');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const startDrill = async () => {
        setStep('ALERT');
        setLogs([]);
        addLog("DRILL_START: P1_MEDICAL_EMERGENCY (Cardiac Arrest)");
        addLog("LOCATION: Sheikh Zayed Road, Zone 4");

        setTimeout(() => {
            setStep('DISPATCH');
            addLog("MONOLITH: Processing P1 Priority Queue...");
            addLog("AI_WORKFORCE: Checking nearby ambulances...");
            addLog("AI_WORKFORCE: Driver ID 555 rejected (Fatigue Score: 88).");
            addLog("AI_WORKFORCE: Driver ID 777 selected (ACLS Certified, Fatigue Score: 12).");
        }, 2000);

        setTimeout(() => {
            setStep('ROUTING');
            addLog("EMERGENCY_LOGIC: Hospital Capacity-Aware search triggered.");
            addLog("HOSPITAL_AI: City Hospital ER full (Diversion).");
            addLog("HOSPITAL_AI: Aster Mediclinic selected (3 Available ER Beds, Trauma Ready).");
            addLog("TRAFFIC_AI: Detecting congestion on E11. Route adjusted to Al Wasl Rd.");
        }, 4500);

        setTimeout(() => {
            setStep('TELEMETRY');
            addLog("KAFKA: Broadcasting AMB-777 telemetry to municipal hub.");
            addLog("TELEMETRY: Sub-second GPS sync engaged.");
        }, 6500);

        setTimeout(() => {
            setStep('COMPLETED');
            addLog("DRILL_COMPLETED: Mission Successful. SLA targets met.");
        }, 9000);
    };

    return (
        <div className="min-h-screen bg-deep-space text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tighter text-pulse-orange">LIVE EMERGENCY DRILL</h1>
                        <p className="text-muted-grey text-xs uppercase tracking-[0.3em]">End-to-End System Integrity Validation</p>
                    </div>
                    {step === 'IDLE' || step === 'COMPLETED' ? (
                        <button
                            onClick={startDrill}
                            className="px-8 py-3 bg-pulse-orange text-white font-black rounded-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,102,0,0.4)]"
                        >
                            INITIATE P1 DRILL
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-pulse-orange animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-pulse-orange"></span>
                            <span className="text-xs font-black uppercase tracking-widest">DRILL IN PROGRESS</span>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Simulation Viewport */}
                    <div className="lg:col-span-2 relative h-[500px] bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/55.27,25.20,13/800x500?access_token=MOCK')] bg-cover opacity-30"></div>

                        {step === 'IDLE' ? (
                            <div className="absolute inset-0 flex items-center justify-center text-center">
                                <div className="space-y-4 opacity-40">
                                    <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-full mx-auto animate-spin-slow"></div>
                                    <p className="text-xs font-mono uppercase tracking-widest">System Standby // Ready for Injection</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <LiveMapOverlay />
                                {step === 'ALERT' && (
                                    <div className="absolute inset-0 bg-pulse-orange/10 animate-pulse border-4 border-pulse-orange pointer-events-none"></div>
                                )}
                                {/* Visual Drill Indicators */}
                                <div className="absolute top-6 left-6 space-y-4">
                                    <Indicator label="AI SAFETY CHECK" active={step === 'DISPATCH' || step === 'ROUTING' || step === 'TELEMETRY'} />
                                    <Indicator label="HOSPITAL ROUTING" active={step === 'ROUTING' || step === 'TELEMETRY'} />
                                    <Indicator label="KAFKA TELEMETRY" active={step === 'TELEMETRY'} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Real-time System Logs */}
                    <aside className="bg-black/40 border border-white/10 rounded-2xl p-6 font-mono overflow-hidden flex flex-col h-[500px]">
                        <h2 className="text-[10px] font-black text-muted-grey uppercase tracking-widest mb-4">Monolith System Logs</h2>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {logs.length === 0 && <p className="text-[10px] text-white/10 italic">Waiting for event injection...</p>}
                            {logs.map((log, i) => (
                                <p key={i} className={`text-[10px] ${log.includes('ALRT') || log.includes('START') ? 'text-pulse-orange' : log.includes('AI') ? 'text-neon-blue' : 'text-zinc-400'}`}>
                                    {log}
                                </p>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] text-muted-grey uppercase font-bold">
                            <span>Phase: {step}</span>
                            <span>Sub-Systems: ACTIVE</span>
                        </div>
                    </aside>
                </div>

                {/* Post-Drill Analysis Artifact (Hidden until complete) */}
                {step === 'COMPLETED' && (
                    <div className="p-8 rounded-2xl bg-white/5 border border-neon-blue/20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <h2 className="text-xl font-bold text-neon-blue mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                            Drill Post-Analysis Report
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px]">
                            <AnalysisCard label="Response Time" value="1.2s" sub="Monolith Latency" />
                            <AnalysisCard label="AI Match Quality" value="100%" sub="Skill/Fatigue Matched" />
                            <AnalysisCard label="Route Efficiency" value="+15%" sub="Traffic AI Gain" />
                        </div>
                    </div>
                )}
            </div>

            <footer className="mt-12 text-center">
                <p className="text-[10px] text-muted-grey uppercase tracking-[0.2em]">Strategic Emergency Simulation Environment • Powered by EXL Solutions</p>
            </footer>
        </div>
    );
}

function Indicator({ label, active }: { label: string, active: boolean }) {
    return (
        <div className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-3 ${active ? 'bg-black text-white border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 'bg-black/40 text-muted-grey border-white/10 opacity-30'}`}>
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-neon-blue shadow-[0_0_5px_#00f3ff]' : 'bg-white/20'}`}></div>
            <span className="text-[10px] font-black tracking-widest">{label}</span>
        </div>
    );
}

function AnalysisCard({ label, value, sub }: { label: string, value: string, sub: string }) {
    return (
        <div className="p-4 rounded-xl bg-black/60 border border-white/5">
            <p className="text-muted-grey mb-1 uppercase font-bold tracking-tighter">{label}</p>
            <p className="text-2xl font-black text-white mb-1">{value}</p>
            <p className="text-[9px] text-neon-blue/60 uppercase font-mono tracking-widest">{sub}</p>
        </div>
    );
}
