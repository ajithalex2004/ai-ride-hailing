"use client";

import React, { useState } from 'react';
import {
    AlertTriangle,
    Map as MapIcon,
    Activity,
    Clock,
    TrendingDown,
    Navigation,
    ShieldAlert,
    BarChart3,
    Layers,
    MapPin,
    AlertCircle
} from 'lucide-react';

export default function TrafficImpactDashboard() {
    const [activeLayer, setActiveLayer] = useState('HEATMAP');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-white p-8 selection:bg-[var(--t-orange)]/30" style={{fontFamily:"var(--font-sans)"}}>
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--t-orange)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t-text-muted)]">Traffic_Recovery_OS</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">TRAFFIC_RECOVERY_HUB</h1>
                </div>

                <div className="flex gap-4">
                    <TabButton active={activeLayer === 'HEATMAP'} onClick={() => setActiveLayer('HEATMAP')} label="INCIDENT_HEATMAP" />
                    <TabButton active={activeLayer === 'DIVERSIONS'} onClick={() => setActiveLayer('DIVERSIONS')} label="ROUTE_DIVERSIONS" />
                    <TabButton active={activeLayer === 'BLACKSPOTS'} onClick={() => setActiveLayer('BLACKSPOTS')} label="BLACKSPOT_AI" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Interactive Map Layer */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-3xl p-8 h-[650px] relative overflow-hidden group">
                        {/* Map Mask Mockup */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.3,25.2,12/1000x800?access_token=mock')] bg-cover filter saturate-0" />

                        {/* Dynamic Heatmap Circles (Mock) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-64 h-64 bg-red-600/20 rounded-full border border-red-600/40 animate-pulse relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/40 rounded-full blur-xl" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <AlertTriangle size={24} className="text-red-500" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-8 left-8 space-y-4">
                            <LayerToggle label="Heatmap Layer" active />
                            <LayerToggle label="Diversion Polygons" active={activeLayer === 'DIVERSIONS'} />
                            <LayerToggle label="Asset GPS" active />
                        </div>

                        <div className="absolute bottom-8 left-8">
                            <div className="bg-black/80 backdrop-blur-xl border border-[var(--t-border)] p-6 rounded-2xl flex items-center gap-6">
                                <div>
                                    <div className="text-[8px] font-black uppercase text-[var(--t-text-muted)] tracking-widest mb-1">Impact_Radius</div>
                                    <div className="text-xl font-black font-mono tracking-tighter">4.2km</div>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10" />
                                <div>
                                    <div className="text-[8px] font-black uppercase text-[var(--t-text-muted)] tracking-widest mb-1">Avg_Delay</div>
                                    <div className="text-xl font-black font-mono tracking-tighter text-[var(--t-orange)]">+24m</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.3em]">AI_Clearance_Estimation</h3>
                                <Clock size={16} className="text-[var(--t-orange)]" />
                            </div>
                            <div className="space-y-4">
                                <EstimationItem label="Heavy Tow Dispatch" time="14m" status="COMPLETED" />
                                <EstimationItem label="Scene Investigation" time="22m" status="IN_PROGRESS" />
                                <EstimationItem label="Final Recovery" time="18m" status="PENDING" />
                                <div className="pt-4 border-t border-[var(--t-border)] flex justify-between items-end">
                                    <div className="text-[10px] font-black uppercase italic">Total_Clearance_ETA</div>
                                    <div className="text-3xl font-black font-mono italic text-[var(--t-orange)]">38m</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.3em]">Suggested_Diversions</h3>
                                <Navigation size={16} className="text-[var(--t-cyan)]" />
                            </div>
                            <div className="space-y-3">
                                <DiversionItem route="D71 (Al Khail)" impact="Light" gain="-12m" />
                                <DiversionItem route="D62 (Financial)" impact="Heavy" gain="-4m" warning />
                                <DiversionItem route="E11 Southbound" impact="Optimal" gain="-18m" active />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Blackspot Analysis & Safety Index */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.3em]">Safety_Blackspot_AI</h3>
                            <ShieldAlert size={16} className="text-red-500" />
                        </div>
                        <div className="space-y-6">
                            <BlackspotCard location="SZR Exit 44" risk={0.94} trend="UP" count={14} />
                            <BlackspotCard location="Al Khail Tunnel" risk={0.78} trend="DOWN" count={8} />
                            <BlackspotCard location="Meydan Interchange" risk={0.62} trend="STABLE" count={5} />
                        </div>
                    </div>

                    <div className="bg-[var(--t-orange)]/5 border border-[var(--t-orange)]/20 p-8 rounded-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[var(--t-orange)]/10 rounded-2xl text-[var(--t-orange)]">
                                <TrendingDown size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-tight text-white mb-1">Recovery_Impact</div>
                                <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase tracking-wider italic">Congestion Shielded: 2.1k Cars</div>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-[var(--t-text-muted)] uppercase leading-relaxed tracking-widest">
                            AI Route Diversion broadcasts have effectively redirected 64% of approaching traffic, preventing a total standstill on E11.
                        </p>
                    </div>

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-3xl p-8">
                        <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] mb-8 tracking-[0.3em]">Live_Recovery_Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black italic uppercase">Lane 1 & 2 Blocked</span>
                                <AlertCircle size={14} className="text-red-500" />
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: '40%' }} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black italic uppercase">Hard Shoulder Clear</span>
                                <Activity size={14} className="text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function EstimationItem({ label, time, status }: any) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'COMPLETED' ? 'bg-green-400' : status === 'IN_PROGRESS' ? 'bg-[var(--t-orange)] animate-pulse' : 'bg-white/20'
                    }`} />
                <span className="text-[10px] font-bold text-[var(--t-text-muted)] uppercase tracking-tight">{label}</span>
            </div>
            <span className="text-[10px] font-mono font-black">{time}</span>
        </div>
    );
}

function DiversionItem({ route, impact, gain, active, warning }: any) {
    return (
        <div className={`p-4 rounded-xl border transition-all cursor-pointer ${active ? 'bg-[var(--t-accent)]/10 border-[var(--t-cyan)]/40' : 'bg-[var(--t-surface)] border-[var(--t-border)]'
            } ${warning ? 'border-red-500/20' : ''}`}>
            <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] font-black uppercase italic tracking-tight">{route}</div>
                <div className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase ${active ? 'bg-[var(--t-accent)] text-black border-[var(--t-cyan)]' : 'bg-white/5 border-[var(--t-border)]'
                    }`}>{active ? 'SELECTED' : impact}</div>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="text-[var(--t-text-muted)] uppercase">Est. Saving</span>
                <span className="text-green-400 font-black font-mono">{gain}</span>
            </div>
        </div>
    );
}

function BlackspotCard({ location, risk, count, trend }: any) {
    return (
        <div className="bg-[var(--t-surface)] border border-[var(--t-border)] p-5 rounded-2xl group hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-[10px] font-black uppercase italic tracking-tighter mb-1">{location}</div>
                    <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase">{count} Incidents last 30d</div>
                </div>
                <div className={`text-[9px] font-black ${trend === 'UP' ? 'text-red-500' : 'text-green-400'} italic font-mono`}>{trend}</div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${risk * 100}%` }} />
                </div>
                <div className="text-[10px] font-black font-mono">{Math.round(risk * 100)}%</div>
            </div>
        </div>
    );
}

function LayerToggle({ label, active }: any) {
    return (
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${active ? 'bg-white text-black border-white' : 'bg-black/60 backdrop-blur-md border-[var(--t-border)] text-[var(--t-text-muted)]'
            }`}>
            <Layers size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
    );
}

function TabButton({ active, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-[var(--t-orange)] text-black italic shadow-lg shadow-pulse-orange/10' : 'bg-[var(--t-surface)] text-[var(--t-text-muted)] hover:bg-white/[0.06]'
                }`}>
            {label}
        </button>
    );
}

