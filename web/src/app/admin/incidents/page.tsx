"use client";

import React, { useState } from 'react';
import {
    AlertTriangle,
    Truck,
    Map as MapIcon,
    Upload,
    Activity,
    Clock,
    ChevronRight,
    ShieldAlert,
    Fuel,
    Zap,
    Search,
    Filter
} from 'lucide-react';

export default function IncidentCommandPage() {
    const [activeTab, setActiveTab] = useState('FEED');

    return (
        <div className="min-h-screen bg-[#060608] text-white p-8 font-sans selection:bg-red-500/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Road_Safety_OS</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">INCIDENT_COMMAND_HQ</h1>
                </div>

                <div className="flex gap-4">
                    <TabButton active={activeTab === 'FEED'} onClick={() => setActiveTab('FEED')} label="LIVE_INCIDENTS" />
                    <TabButton active={activeTab === 'TOW'} onClick={() => setActiveTab('TOW')} label="TOW_FLEET" />
                    <TabButton active={activeTab === 'ASSIST'} onClick={() => setActiveTab('ASSIST')} label="ROADSIDE_ASSIST" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Interactive Feed & Map */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-[600px] relative overflow-hidden group">
                        {/* Map Background Mockup */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.3,25.2,12/1000x800?access_token=mock')] bg-cover" />

                        <div className="absolute top-8 left-8 flex gap-4">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                                <div className="text-[8px] font-black uppercase text-muted-grey mb-2 tracking-widest">Active_Clusters</div>
                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <div className="text-lg font-black font-mono text-red-500">12</div>
                                        <div className="text-[7px] font-bold uppercase">Accidents</div>
                                    </div>
                                    <div className="text-center border-l border-white/10 pl-6">
                                        <div className="text-lg font-black font-mono text-pulse-orange">34</div>
                                        <div className="text-[7px] font-bold uppercase">Breakdowns</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-8 right-8 flex gap-4">
                            <button className="bg-red-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-tighter shadow-lg shadow-red-600/20 hover:scale-105 transition-all">
                                INITIATE_ESCALATION
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <MetricCard label="Avg Clearance" value="28m" trend="-4m" up />
                        <MetricCard label="Tow Utilization" value="92%" trend="+8%" up />
                        <MetricCard label="Assistance CSAT" value="4.8/5" trend="Stable" />
                    </div>
                </div>

                {/* Right: Detailed List & AI Scores */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-[750px] flex flex-col">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Critical_Incident_Queue</h3>
                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            <IncidentItem id="INC-882" type="Multi-Vehicle Collision" severity="CRITICAL" score={0.94} eta="4m" />
                            <IncidentItem id="INC-901" type="Heay Vehicle Breakdown" severity="MODERATE" score={0.58} eta="14m" />
                            <IncidentItem id="INC-844" type="Low Battery Stall" severity="MINOR" score={0.22} eta="22m" />
                            <IncidentItem id="INC-889" type="Fuel Depletion" severity="MINOR" score={0.18} eta="18m" />
                        </div>

                        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
                            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-red-500/15 transition-all">
                                <ShieldAlert size={24} className="text-red-500 animate-pulse" />
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-tight text-red-500">AI_Escalation_Trigger</div>
                                    <div className="text-[8px] font-bold text-muted-grey uppercase">INC-882 flagged as high-fire risk. Police notified.</div>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all italic">Generate_Clearance_Report</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function IncidentItem({ id, type, severity, score, eta }: any) {
    return (
        <div className={`p-4 rounded-xl border ${severity === 'CRITICAL' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.03] border-white/10'
            } group hover:border-white/20 transition-all cursor-pointer`}>
            <div className="flex justify-between items-start mb-3">
                <div className={`text-[9px] font-black ${severity === 'CRITICAL' ? 'text-red-500' : 'text-neon-blue'
                    } uppercase tracking-widest`}>{severity}</div>
                <div className="text-[8px] font-bold text-muted-grey uppercase">{id}</div>
            </div>
            <div className="text-[12px] font-black italic uppercase tracking-tight mb-4">{type}</div>
            <div className="flex justify-between items-center text-[10px] font-mono">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-muted-grey" />
                    <span className="font-black">{eta}</span>
                </div>
                <div className="text-[8px] font-black text-muted-grey uppercase">AI_Score: <span className="text-white">{score}</span></div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, trend, up }: any) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <div className="text-[8px] font-black text-muted-grey uppercase tracking-[0.2em] mb-4">{label}</div>
            <div className="text-2xl font-black font-mono tracking-tighter italic mb-1">{value}</div>
            <div className={`text-[8px] font-black uppercase ${up ? 'text-green-400' : 'text-muted-grey'}`}>{trend} VS LW</div>
        </div>
    );
}

function TabButton({ active, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-red-600 text-white italic shadow-lg shadow-red-600/10' : 'bg-white/[0.03] text-muted-grey hover:bg-white/[0.06]'
                }`}>
            {label}
        </button>
    );
}
