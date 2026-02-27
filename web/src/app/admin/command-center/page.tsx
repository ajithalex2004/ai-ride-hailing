"use client";

import React, { useState, useEffect } from 'react';
import LiveMapOverlay from '@/components/map/LiveMapOverlay';

export default function CommandCenterPage() {
    const [activeMissions, setActiveMissions] = useState(42);
    const [view, setView] = useState<'FLEET' | 'POLICE'>('FLEET');
    const [incidents, setIncidents] = useState([
        { id: 'INC-772', type: 'CRASH', severity: 'P1', location: 'Sheikh Zayed Rd', time: '2m ago', status: 'RESPONDING', units: ['POLICE', 'EMS', 'TOW'] },
        { id: 'INC-773', type: 'STALL', severity: 'P2', location: 'Downtown Dubai', time: '5m ago', status: 'VERIFIED', units: ['TOW'] },
        { id: 'INC-774', type: 'HAZARD', severity: 'P3', location: 'Marina Bay', time: '1m ago', status: 'RESPONDING', units: ['POLICE'] },
    ]);

    return (
        <div className={`min-h-screen bg-deep-space text-white flex flex-col overflow-hidden transition-colors duration-1000 ${view === 'POLICE' ? 'border-t-4 border-blue-600' : ''}`}>
            {/* Top Header */}
            <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl transition-colors ${view === 'POLICE' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-pulse-orange shadow-[0_0_15px_rgba(255,102,0,0.5)]'}`}>OS</div>
                    <div>
                        <h1 className="font-black text-lg leading-none tracking-tighter">{view === 'POLICE' ? 'POLICE_COMMAND' : 'MISSION_CONTROL'}</h1>
                        <p className="text-[10px] text-muted-grey tracking-[0.3em] uppercase">AI Mobility & Emergency Operating System</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setView('FLEET')}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${view === 'FLEET' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            FLEET_OPS
                        </button>
                        <button
                            onClick={() => setView('POLICE')}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${view === 'POLICE' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            POLICE_OPS
                        </button>
                    </div>
                    <div className="h-8 w-px bg-white/10 mx-2"></div>
                    <StatItem label="TOTAL FLEET" value="1,240" color="text-neon-blue" />
                    <StatItem label="ACTIVE INCIDENTS" value={incidents.length} color={view === 'POLICE' ? 'text-blue-400' : 'text-pulse-orange'} />
                    <StatItem label="SLA COMPLIANCE" value="98.4%" color="text-green-400" />
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Incident Feed */}
                <aside className="w-85 border-r border-white/10 bg-black/20 backdrop-blur-sm p-6 overflow-y-auto hidden lg:block">
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-grey mb-6 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-ping ${view === 'POLICE' ? 'bg-blue-600' : 'bg-pulse-orange'}`}></span>
                        {view === 'POLICE' ? 'Live Unit Dispatch' : 'Incident Feed'}
                    </h2>
                    <div className="space-y-4">
                        {incidents.map((inc) => (
                            <div key={inc.id} className={`p-4 rounded-xl bg-white/5 border transition-all group cursor-pointer ${view === 'POLICE' ? 'border-blue-600/10 hover:border-blue-600/40' : 'border-white/5 hover:border-white/20'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${inc.severity === 'P1' ? 'bg-red-500 text-white' : 'bg-white/10 text-muted-grey'}`}>
                                        {inc.type} • {inc.severity}
                                    </span>
                                    <span className="text-[10px] text-muted-grey font-mono">{inc.time}</span>
                                </div>
                                <h3 className="text-sm font-black tracking-tight">{inc.location}</h3>
                                <div className="flex gap-1 mt-2 mb-3">
                                    {inc.units.map(u => (
                                        <span key={u} className="text-[8px] border border-white/5 bg-white/5 px-1.5 py-0.5 rounded text-white/40 font-bold">{u}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-neon-blue">{inc.id}</span>
                                    <span className={`text-[10px] uppercase font-black ${inc.status === 'VERIFIED' ? 'text-yellow-500' : 'text-neon-blue'}`}>{inc.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Map View Placeholder */}
                <main className="flex-1 relative bg-[#0a0a0c]">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/55.27,25.20,11/1200x800?access_token=MOCK')] bg-cover opacity-20 mix-blend-luminosity"></div>

                    <LiveMapOverlay />

                    {/* Geofence/Heatmap Indicator */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full border border-red-500/20 flex items-center justify-center animate-pulse pointer-events-none">
                        <div className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-black/80 px-2 py-1 rounded border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                            Active Incident Geofence // Rerouting Active
                        </div>
                    </div>

                    {/* Incident Cluster Tooltip */}
                    <div className="absolute top-[40%] left-[60%] group cursor-pointer">
                        <div className="w-10 h-10 bg-pulse-orange/20 rounded-full flex items-center justify-center border border-pulse-orange/40 animate-bounce">
                            <span className="text-[10px] font-black">12</span>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 bg-black/90 border border-white/10 p-3 rounded-lg backdrop-blur-xl z-[60]">
                            <h5 className="text-[9px] font-black text-pulse-orange mb-1 uppercase tracking-widest">Incident Cluster A4</h5>
                            <p className="text-[8px] text-white/60 mb-2 leading-tight">High density of reported stalls and hazards. Priority dispatch recommended.</p>
                            <div className="flex justify-between items-center text-[7px] font-bold text-muted-grey">
                                <span>Wait Time: +12m</span>
                                <span className="text-red-400">STATUS: CRITICAL</span>
                            </div>
                        </div>
                    </div>


                    <div className="absolute top-6 left-6 p-4 glass-panel rounded-xl border border-white/10 max-w-xs transition-opacity hover:opacity-20 pointer-events-none backdrop-blur-xl">
                        <h4 className="text-[10px] font-black mb-2 uppercase tracking-widest">Road Incident Heatmap</h4>
                        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full mb-1"></div>
                        <div className="flex justify-between text-[8px] font-bold text-muted-grey uppercase tracking-tighter">
                            <span>Safe</span>
                            <span>Hazardous</span>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                        <MapButton label="FLEET" active={view === 'FLEET'} />
                        <MapButton label="POLICE_UNITS" active={view === 'POLICE'} />
                        <MapButton label="TOW_LOGISTICS" />
                        <MapButton label="INCIDENT_HEATMAP" active />
                    </div>
                </main>

                {/* Right Sidebar: Telemetry Stream */}
                <aside className="w-72 border-l border-white/10 bg-black/40 p-6 hidden xl:block font-mono overflow-y-auto">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-grey mb-6">Dispatch_Node_Alpha</h2>
                    <div className="space-y-2 text-[10px] text-white/40">
                        <p><span className="text-neon-blue font-bold">[INFO]</span> POLICE_NET_SYNC: OK</p>
                        <p><span className="text-pulse-orange font-bold">[ALRT]</span> CITIZEN_REPORT: STALL_ON_D71</p>
                        <p><span className="text-blue-400 font-bold">[POLI]</span> UNIT_DISPATCHED: PATROL_402</p>
                        <p><span className="text-purple-400 font-bold">[AMBU]</span> UNIT_DISPATCHED: EMS_777</p>
                        <p><span className="text-yellow-400 font-bold">[TOWI]</span> UNIT_DISPATCHED: TOW_001</p>
                        <p><span className="text-neon-blue font-bold">[TRAF]</span> AI_REROUTING: ACTIVE_NODE_MARINA</p>
                        <div className="h-px bg-white/5 my-4"></div>
                        <p className="animate-pulse text-neon-blue font-bold text-[9px]">MONOLITH_SYNC_STABLE</p>
                        <p className="text-[8px] text-muted-grey mt-2">Uptime: 99.99% • Latency: 42ms</p>
                    </div>
                </aside>
            </div>

            {/* Footer Branding */}
            <footer className="h-8 bg-black flex items-center px-8 border-t border-white/5 relative z-50">
                <p className="text-[9px] text-muted-grey uppercase tracking-[0.2em] font-medium">Strategic Road Management Engine • Powered by EXL Solutions • © 2026</p>
            </footer>
        </div>
    );
}

function StatItem({ label, value, color }: { label: string, value: string | number, color: string }) {
    return (
        <div className="text-center group cursor-default">
            <p className="text-[9px] text-muted-grey font-black tracking-widest mb-1 group-hover:text-white transition-colors uppercase">{label}</p>
            <p className={`text-xl font-black ${color} tracking-tighter`}>{value}</p>
        </div>
    );
}

function MapButton({ label, active = false }: { label: string, active?: boolean }) {
    return (
        <button className={`px-6 h-10 rounded-full border text-[10px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${active ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-black/60 border-white/10 hover:border-white/30 text-white/60 hover:text-white backdrop-blur-md'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-black animate-pulse' : 'bg-white/20'}`}></div>
            {label}
        </button>
    );
}
