"use client";

import React, { useState } from 'react';
import {
    Map as MapIcon,
    Plus,
    Save,
    Trash2,
    ChevronRight,
    Navigation,
    Users,
    Layers,
    Sparkles,
    Maximize2
} from 'lucide-react';

export default function SchoolRouteDesigner() {
    const [selectedRoute, setSelectedRoute] = useState('MORNING_DOWNTOWN');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-white p-8 selection:bg-[var(--t-accent)]/30 h-screen flex flex-col" style={{fontFamily:"var(--font-sans)"}}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-[var(--t-cyan)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t-text-muted)]">AI_Route_Constructor_V4</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter italic uppercase">ROUTE_DESIGNER</h1>
                </div>

                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-[var(--t-surface)] border border-[var(--t-border)] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/5 transition-all">
                        <Layers size={14} />
                        Switch_Layer
                    </button>
                    <button className="px-8 py-3 bg-[var(--t-accent)] text-black text-[10px] font-black uppercase tracking-widest italic rounded-2xl shadow-lg shadow-neon-blue/20 hover:scale-105 transition-all">
                        Save_Network_State
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-12 gap-8">

                {/* Left: Stop Sequence Editor */}
                <div className="col-span-12 lg:col-span-4 bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-8 flex flex-col shadow-2xl overflow-hidden">
                    <div className="flex justify-between items-center mb-10 shrink-0">
                        <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]">STOP_SEQUENCE_STACK</h3>
                        <Plus size={16} className="text-[var(--t-cyan)] cursor-pointer" />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                        <StopItem sequence={1} name="Main Campus Gate" eta="07:00" students={0} isHub />
                        <div className="flex justify-center -my-2">
                            <div className="w-[1px] h-8 bg-white/10 border-r border-dashed border-white/20" />
                        </div>
                        <StopItem sequence={2} name="Burj Vista Stop 4" eta="07:12" students={12} active />
                        <div className="flex justify-center -my-2">
                            <div className="w-[1px] h-8 bg-white/10 border-r border-dashed border-white/20" />
                        </div>
                        <StopItem sequence={3} name="Opera District Hub" eta="07:25" students={8} />
                        <div className="flex justify-center -my-2">
                            <div className="w-[1px] h-8 bg-white/10 border-r border-dashed border-white/20" />
                        </div>
                        <StopItem sequence={4} name="Financial Center M-1" eta="07:38" students={14} />
                        <div className="flex justify-center -my-2">
                            <div className="w-[1px] h-8 bg-white/10 border-r border-dashed border-white/20" />
                        </div>
                        <StopItem sequence={5} name="Arrival: High School" eta="08:00" students={0} isHub />
                    </div>

                    <div className="mt-8 pt-8 border-t border-[var(--t-border)] shrink-0">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black uppercase text-[var(--t-text-muted)]">Total_Commute_Time</span>
                            <span className="text-xl font-black font-mono text-[var(--t-cyan)]">60m</span>
                        </div>
                        <div className="p-4 bg-[var(--t-accent)]/5 border border-[var(--t-cyan)]/20 rounded-2xl flex items-center gap-4">
                            <Navigation size={18} className="text-[var(--t-cyan)]" />
                            <p className="text-[9px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">AI Suggestion: Merge Stop 3 and 4 to save 8m and 1.2L fuel.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Interactive Map Canvas */}
                <div className="col-span-12 lg:col-span-8 bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] relative overflow-hidden group shadow-2xl">
                    {/* Map Underlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.3,25.2,12/1200x800?access_token=mock')] bg-cover grayscale contrast-125" />

                    {/* Canvas Controls */}
                    <div className="absolute top-8 left-8 flex flex-col gap-4">
                        <MapTool icon={<MapIcon size={18} />} active />
                        <MapTool icon={<Plus size={18} />} />
                        <MapTool icon={<Maximize2 size={18} />} />
                    </div>

                    {/* Route Polylines (Mock) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                        <path d="M 100 100 L 300 250 L 500 400 L 800 600" fill="none" stroke="#00A3FF" strokeWidth="4" strokeDasharray="10 10" />
                    </svg>

                    {/* Map Stop Nodes */}
                    <StopNode lat="10%" lng="10%" label="Campus" hub />
                    <StopNode lat="30%" lng="25%" label="Stop_2" active />
                    <StopNode lat="50%" lng="40%" label="Stop_3" />
                    <StopNode lat="80%" lng="60%" label="Stop_4" />

                    {/* AI Clustering Heatmap (Mock) */}
                    <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-[var(--t-accent)]/5 rounded-full blur-[80px] animate-pulse" />
                    <div className="absolute top-[42%] left-[62%] border border-[var(--t-cyan)]/20 p-4 rounded-3xl bg-[var(--t-surface)] backdrop-blur-md">
                        <div className="text-[8px] font-black uppercase text-[var(--t-cyan)] mb-1">AI_CLUSTER_SUGGESTION</div>
                        <div className="text-[10px] font-bold text-white uppercase italic">12 Students in this radius. Place stop here?</div>
                    </div>

                    <div className="absolute bottom-8 right-8">
                        <div className="bg-black/80 backdrop-blur-3xl border border-[var(--t-border)] px-8 py-5 rounded-[24px] flex items-center gap-8">
                            <div className="flex gap-6">
                                <Stat label="Total_Stops" value="12" />
                                <Stat label="Total_Utility" value="84%" />
                                <Stat label="Safety_Index" value="0.98" />
                            </div>
                            <div className="w-[1px] h-8 bg-white/10" />
                            <button className="px-8 py-3 bg-[var(--t-accent)] text-black text-[10px] font-black uppercase italic rounded-xl hover:scale-105 transition-all">Optimize_AI</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StopItem({ sequence, name, eta, students, active, isHub }: any) {
    return (
        <div className={`p-6 rounded-[24px] border transition-all cursor-pointer group ${active ? 'bg-[var(--t-accent)]/10 border-[var(--t-cyan)]/30' : 'bg-white/5 border-transparent hover:border-[var(--t-border)]'
            }`}>
            <div className="flex justify-between items-start">
                <div className="flex gap-5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${active ? 'bg-[var(--t-accent)] text-black' : 'bg-white/10 text-[var(--t-text-muted)]'
                        }`}>
                        {sequence}
                    </div>
                    <div>
                        <div className="text-[11px] font-black uppercase italic tracking-tighter text-white mb-1 group-hover:translate-x-1 transition-transform">{name}</div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono font-black text-white/40 italic">{eta}</span>
                            {students > 0 && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-[var(--t-border)]">
                                    <Users size={8} className="text-[var(--t-text-muted)]" />
                                    <span className="text-[8px] font-black text-[var(--t-text-muted)]">{students}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"><Plus size={14} /></button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
            </div>
        </div>
    );
}

function MapTool({ icon, active }: any) {
    return (
        <button className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-[var(--t-accent)] text-black shadow-lg shadow-neon-blue/20' : 'bg-white/5 text-[var(--t-text-muted)] border border-[var(--t-border)] hover:bg-white/10'
            }`}>
            {icon}
        </button>
    );
}

function StopNode({ lat, lng, label, active, hub }: any) {
    return (
        <div className="absolute group cursor-pointer" style={{ top: lat, left: lng }}>
            <div className={`w-4 h-4 rounded-full border-2 border-white relative z-10 transition-transform group-hover:scale-125 ${active ? 'bg-[var(--t-accent)] border-white shadow-[0_0_20px_rgba(0,163,255,0.6)]' : hub ? 'bg-white text-black flex items-center justify-center p-0.5' : 'bg-black border-white/20'
                }`}>
                {hub && <School size={10} />}
            </div>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/60 backdrop-blur-xl border border-[var(--t-border)] rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                {label}
            </div>
        </div>
    );
}

function Stat({ label, value }: any) {
    return (
        <div>
            <div className="text-[8px] font-black uppercase text-[var(--t-text-muted)] tracking-widest mb-0.5">{label}</div>
            <div className="text-sm font-black italic tracking-tighter text-white">{value}</div>
        </div>
    );
}

