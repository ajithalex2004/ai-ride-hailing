"use client";

import React, { useState, useEffect } from 'react';
import {
    Shield,
    Map as MapIcon,
    Activity,
    Clock,
    AlertCircle,
    Ambulance,
    Truck,
    Users,
    Layers,
    Zap,
    ChevronRight,
    Target,
    Smartphone,
    Network
} from 'lucide-react';

export default function CommandControlDashboard() {
    const [tenant, setTenant] = useState('MUNICIPALITY');
    const [elevatedAlert, setElevatedAlert] = useState(false);

    return (
        <div className="min-h-screen bg-[#060608] text-white p-8 font-sans selection:bg-neon-blue/30">
            {/* Header & Tenant Switcher */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${elevatedAlert ? 'bg-red-500 animate-ping' : 'bg-neon-blue animate-pulse'}`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Strategic_Operations_Command</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">C2_WAR_ROOM</h1>
                </div>

                <div className="flex flex-col items-end gap-4">
                    <div className="flex bg-white/[0.03] border border-white/10 p-1 rounded-2xl">
                        <TenantTab active={tenant === 'MUNICIPALITY'} onClick={() => setTenant('MUNICIPALITY')} icon={<Shield size={12} />} label="Municipality" />
                        <TenantTab active={tenant === 'EMS'} onClick={() => setTenant('EMS')} icon={<Ambulance size={12} />} label="Private_EMS" />
                        <TenantTab active={tenant === 'INDUSTRIAL'} onClick={() => setTenant('INDUSTRIAL')} icon={<Network size={12} />} label="Industrial_Zone" />
                    </div>
                    <div className="text-[10px] font-bold text-muted-grey uppercase tracking-widest italic">Viewing as: {tenant}_AUTHORITY_V4</div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Global War Map */}
                <div className="col-span-9 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] h-[700px] relative overflow-hidden group shadow-2xl shadow-black">
                        {/* Map Render Mock */}
                        <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.3,25.2,12/1200x800?access_token=mock')] bg-cover" />

                        {/* Floating HUD Elements */}
                        <div className="absolute top-10 left-10 space-y-4">
                            <HUDLabel icon={<Ambulance size={14} />} label="Active_Ambulances" value="42" color="text-neon-blue" />
                            <HUDLabel icon={<Truck size={14} />} label="Tow_Units" value="18" color="text-pulse-orange" />
                            <HUDLabel icon={<Target size={14} />} label="Live_Incidents" value="12" color="text-red-500" />
                        </div>

                        {/* Live Incident Pins (Mock) */}
                        <div className="absolute top-[40%] left-[30%]">
                            <IncidentPin severity="CRITICAL" label="INC-882" />
                        </div>
                        <div className="absolute top-[60%] left-[70%]">
                            <IncidentPin severity="MODERATE" label="INC-901" />
                        </div>

                        <div className="absolute bottom-10 right-10">
                            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl min-w-[300px]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black uppercase text-muted-grey tracking-widest">System_Vitals</span>
                                    <Activity size={16} className="text-green-400" />
                                </div>
                                <div className="space-y-4">
                                    <VitalRow label="API Latency" value="14ms" />
                                    <VitalRow label="Kafka Throughput" value="1.2k/s" />
                                    <VitalRow label="SLA Compliance" value="98.8%" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <ActionCard label="Mass Casualty Protocol" icon={<Shield size={24} />} color="bg-red-500" />
                        <ActionCard label="Traffic Shield Deployment" icon={<Layers size={24} />} color="bg-pulse-orange" />
                        <ActionCard label="Priority EMS Reroute" icon={<Zap size={24} />} color="bg-neon-blue" />
                    </div>
                </div>

                {/* Right: SLA Escalation Board */}
                <div className="col-span-3 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 h-[900px] flex flex-col">
                        <h3 className="text-[12px] font-black uppercase text-muted-grey mb-10 tracking-[0.4em]">SLA_SURVIVAL_WALL</h3>

                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <SLACountdown id="P1_CARDIAC_SZR" time="01:42" status="CRITICAL" percent={82} />
                            <SLACountdown id="P2_TOW_DOWNTOWN" time="08:14" status="NORMAL" percent={30} />
                            <SLACountdown id="P1_TRUK_ROLLOVER" time="00:12" status="ESCALATING" percent={98} red />
                            <SLACountdown id="P3_TRANSFER_CITY" time="14:55" status="PENDING" percent={10} />
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative">
                                    <Users size={18} className="text-white" />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-blue rounded-full text-[8px] font-black flex items-center justify-center text-black">4</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase italic tracking-tight text-white mb-0.5">Commanders_Online</div>
                                    <div className="text-[8px] font-bold text-muted-grey uppercase tracking-widest">DIFC_HUB_ACTIVE</div>
                                </div>
                            </div>
                            <button className="w-full py-5 bg-white text-black text-[12px] font-black uppercase italic rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-white/10 active:scale-95">Initiate_Global_Sync</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function TenantTab({ active, label, icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black italic' : 'text-muted-grey hover:bg-white/5'
                }`}>
            {icon}
            {label}
        </button>
    );
}

function HUDLabel({ icon, label, value, color }: any) {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-[20px] flex items-center gap-4 min-w-[180px]">
            <div className={`p-2 bg-white/5 rounded-xl ${color}`}>
                {icon}
            </div>
            <div>
                <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">{label}</div>
                <div className="text-xl font-black font-mono tracking-tighter">{value}</div>
            </div>
        </div>
    );
}

function IncidentPin({ severity, label }: any) {
    return (
        <div className="flex flex-col items-center group cursor-pointer">
            <div className={`px-3 py-1 rounded-full text-[9px] font-black mb-2 opacity-0 group-hover:opacity-100 transition-all ${severity === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-pulse-orange text-black'
                }`}>{label}</div>
            <div className="relative">
                <div className={`w-6 h-6 rounded-full animate-ping absolute inset-0 ${severity === 'CRITICAL' ? 'bg-red-500/40' : 'bg-pulse-orange/40'
                    }`} />
                <div className={`w-4 h-4 rounded-full border-2 border-white/20 relative z-10 ${severity === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-pulse-orange shadow-[0_0_20px_rgba(249,115,22,0.8)]'
                    }`} />
            </div>
        </div>
    );
}

function VitalRow({ label, value }: any) {
    return (
        <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-muted-grey uppercase tracking-tighter">{label}</span>
            <span className="font-mono text-white">{value}</span>
        </div>
    );
}

function ActionCard({ label, icon, color }: any) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] flex flex-col items-center text-center group cursor-pointer hover:border-white/20 transition-all hover:bg-white/[0.04]">
            <div className={`w-16 h-16 rounded-[24px] ${color} flex items-center justify-center text-white mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="text-[12px] font-black uppercase tracking-widest italic">{label}</div>
        </div>
    );
}

function SLACountdown({ id, time, status, percent, red }: any) {
    return (
        <div className="space-y-3 p-1">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-black italic uppercase tracking-tighter text-white mb-1">{id}</div>
                    <div className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm border uppercase tracking-widest ${red ? 'bg-red-500/10 border-red-500/40 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-muted-grey'
                        }`}>{status}</div>
                </div>
                <div className={`text-2xl font-black font-mono italic tracking-tighter ${red ? 'text-red-500' : 'text-neon-blue'}`}>{time}</div>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${red ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-neon-blue'}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
