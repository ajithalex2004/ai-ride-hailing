"use client";

import React, { useState } from 'react';
import {
    Shield,
    Globe,
    Activity,
    DollarSign,
    Zap,
    AlertTriangle,
    Layers,
    Users,
    Server,
    Network,
    TrendingUp,
    Box,
    Cpu,
    CreditCard
} from 'lucide-react';

export default function GovernanceDashboard() {
    const [governanceMode, setGovernanceMode] = useState('GLOBAL');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-white p-8 selection:bg-[var(--t-accent)]/30 overflow-x-hidden" style={{ fontFamily: "var(--font-sans)" }}>
            {/* City-Scale Header */}
            <div className="flex flex-col gap-6 mb-12 px-4">
                {/* Title row */}
                <div className="relative">
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-4 h-40 bg-[var(--t-accent)]/20 blur-3xl rounded-full" />
                    <div className="flex items-center gap-3 mb-3">
                        <Globe size={16} className="text-[var(--t-cyan)] animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--t-text-muted)]">City_Authority_Governance</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase drop-shadow-2xl" style={{ color: 'var(--t-text)', fontFamily: 'var(--font-heading)' }}>GLOBAL_SYSTEM_OS</h1>
                </div>
                {/* Tab bar — always full width so all 4 tabs are visible */}
                <div className="inline-flex flex-wrap gap-1 bg-[var(--t-surface)] border border-[var(--t-border)] p-1.5 rounded-2xl">
                    <TabButton active={governanceMode === 'GLOBAL'} onClick={() => setGovernanceMode('GLOBAL')} label="GLOBAL_VITALS" />
                    <TabButton active={governanceMode === 'FINANCIAL'} onClick={() => setGovernanceMode('FINANCIAL')} label="TRANSPORT_ERP" />
                    <TabButton active={governanceMode === 'EMERGENCY'} onClick={() => setGovernanceMode('EMERGENCY')} label="SAFETY_SLAs" />
                    <TabButton active={governanceMode === 'INTELLIGENCE'} onClick={() => setGovernanceMode('INTELLIGENCE')} label="AI_CONTROL_TOWER" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 px-4 pb-20">

                {governanceMode !== 'INTELLIGENCE' && (
                    <>
                        {/* Domain Health Tiles */}
                        <div className="col-span-12 grid grid-cols-4 gap-8 mb-8">
                            <HealthTile label="Transport Revenue" value="$4.2M" sub="Today (Real-time)" color="text-green-400" icon={<DollarSign size={24} />} />
                            <HealthTile label="Emergency SLA" value="11.2m" sub="Avg Response City-wide" color="text-[var(--t-cyan)]" icon={<Zap size={24} />} />
                            <HealthTile label="System Uptime (HA)" value="99.998%" sub="Microservice Mesh" color="text-[var(--t-orange)]" icon={<Server size={24} />} />
                            <HealthTile label="Active Assets" value="2.1k" sub="Ambulances / Tows / Rides" color="text-white" icon={<Box size={24} />} />
                        </div>

                        {/* Global Infrastructure Map HUD */}
                        <div className="col-span-8 space-y-8">
                            <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[48px] h-[600px] relative overflow-hidden group shadow-inner">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.3,25.2,11/1200x800?access_token=mock')] bg-cover grayscale contrast-200" />
                                <PulsePoint lat="30%" lng="40%" label="Emergency_Cluster" color="bg-[var(--t-accent)]" active />
                                <PulsePoint lat="60%" lng="70%" label="Revenue_Peak" color="bg-green-400" />
                                <PulsePoint lat="20%" lng="60%" label="Infrastructure_Alert" color="bg-red-500" warning />
                                <div className="absolute top-12 left-12 flex gap-4">
                                    <Badge label="Transport: Operational" color="bg-green-400" />
                                    <Badge label="Emergency: High Demand" color="bg-[var(--t-orange)]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <LogPanel title="Global Governance Log" />
                                <LogPanel title="Cross-Domain Escalations" />
                            </div>
                        </div>

                        {/* Strategic Insights Sidebar */}
                        <div className="col-span-4 space-y-8">
                            <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-8">
                                <h3 className="text-[12px] font-black uppercase text-[var(--t-text-muted)] mb-12 tracking-[0.4em]">SYSTEM_HETEROGENEITY</h3>
                                <div className="space-y-10">
                                    <DomainBar label="Transport (Revenue-Driven)" value={74} color="bg-green-400" detail="ERP Integrated" />
                                    <DomainBar label="Emergency (SLA-Driven)" value={88} color="bg-[var(--t-accent)]" detail="HA Hardened" />
                                    <DomainBar label="Incident Recovery" value={62} color="bg-[var(--t-orange)]" detail="Clearance Optimized" />
                                </div>
                            </div>
                            <div className="bg-[var(--t-accent)]/5 border border-[var(--t-cyan)]/20 p-10 rounded-[48px] relative overflow-hidden group hover:bg-[var(--t-accent)]/10 transition-all">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="p-4 bg-[var(--t-accent)]/10 rounded-[28px] text-[var(--t-cyan)] group-hover:scale-110 transition-transform">
                                        <Zap size={32} />
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-black uppercase italic tracking-tighter text-white">AI_Dispatch_Oracle</div>
                                        <div className="text-[9px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">Priority Matching: Active</div>
                                    </div>
                                </div>
                                <p className="text-[11px] font-black text-white/40 uppercase leading-relaxed tracking-wider mb-8">
                                    Strategic balancing is being applied to reroute non-emergency assets away from high-density response corridors.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {governanceMode === 'GLOBAL' && (
                    <div className="col-span-12 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[48px] p-12">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">GLOBAL_OS_MATRIX</h2>
                                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--t-text-muted)]">Unified Cross-Domain Sovereignty</div>
                                </div>
                                <Shield size={24} className="text-[var(--t-cyan)]" />
                            </div>
                            <div className="grid grid-cols-4 gap-8">
                                <DomainMatrixCard domain="On-Demand" type="TAXI_LIMO" status="HEALTHY" load="74%" icon={<Globe size={20} />} />
                                <DomainMatrixCard domain="Route-Based" type="SCHOOL_SHUTTLE" status="HEALTHY" load="88%" icon={<Network size={20} />} />
                                <DomainMatrixCard domain="Asset-Leasing" type="CAR_RENTAL" status="STABLE" load="42%" icon={<Box size={20} />} />
                                <DomainMatrixCard domain="Emergency" type="AMBULANCE_OS" status="CRITICAL_PEAK" load="91%" icon={<Zap size={20} />} color="text-[var(--t-orange)]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-10 space-y-8">
                                <h3 className="text-[12px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]">SHARED_CORE_UTILIZATION</h3>
                                <div className="space-y-6">
                                    <CoreStat label="Dispatch_Engine" value="99.9%" />
                                    <CoreStat label="ERP_Finance_Backbone" value="Operational" />
                                    <CoreStat label="AI_Intelligence_Layer" value="Active_Learning" />
                                    <CoreStat label="Multi_Tenant_Security" value="Hardened" />
                                </div>
                            </div>
                            <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-10 h-[300px] flex items-center justify-center relative overflow-hidden">
                                <Activity size={120} className="text-[var(--t-cyan)]/10 absolute opacity-20" />
                                <div className="text-center relative z-10">
                                    <div className="text-5xl font-black italic text-white tracking-tighter mb-2">99.998%</div>
                                    <div className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-widest">SYSTEM_HA_AVAILABILITY</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function TabButton({ active, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-10 py-5 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black italic shadow-2xl' : 'text-[var(--t-text-muted)] hover:bg-white/5'
                }`}>
            {label}
        </button>
    );
}

function IntelligenceCard({ title, value, sub, icon }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-10 rounded-[40px] group hover:border-[var(--t-border)] transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-10">
                <div className="text-[11px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]">{title}</div>
                <div className="text-[var(--t-cyan)] group-hover:scale-125 transition-transform duration-500">{icon}</div>
            </div>
            <div className="text-4xl font-black italic tracking-tighter text-white mb-3">{value}</div>
            <div className="text-[10px] font-black uppercase text-white/20 tracking-widest italic">{sub}</div>
        </div>
    );
}

function AiModule({ title, status, detail, icon, color }: any) {
    return (
        <div className="flex justify-between items-center bg-[var(--t-surface)] p-8 rounded-[32px] border border-[var(--t-border)] hover:border-white/20 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-white/[0.01] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl text-[var(--t-text-muted)] group-hover:text-white transition-colors">
                    {icon}
                </div>
                <div>
                    <div className="text-xs font-black uppercase italic tracking-tighter text-white mb-1">{title}</div>
                    <div className="text-[9px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">{detail}</div>
                </div>
            </div>
            <div className={`text-[10px] font-black uppercase italic relative z-10 ${color || 'text-[var(--t-cyan)]'}`}>{status}</div>
        </div>
    );
}

function HealthTile({ label, value, sub, color, icon }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-8 rounded-[40px] group hover:border-[var(--t-border)] transition-all cursor-pointer">
            <div className={`mb-6 ${color} p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="text-[11px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.2em] mb-3">{label}</div>
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black italic tracking-tighter">{value}</span>
            </div>
            <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">{sub}</div>
        </div>
    );
}

function PulsePoint({ lat, lng, label, color, active, warning }: any) {
    return (
        <div className="absolute group cursor-pointer" style={{ top: lat, left: lng }}>
            <div className={`w-8 h-8 rounded-full ${color}/20 animate-ping absolute -inset-2 ${warning ? 'bg-red-500/20' : ''}`} />
            <div className={`w-4 h-4 rounded-full border-2 border-white/20 relative z-10 ${color} shadow-[0_0_20px_rgba(255,255,255,0.2)]`} />
            <div className="absolute left-6 top-0 opacity-0 group-hover:opacity-100 transition-all px-3 py-1 bg-black/80 backdrop-blur-xl border border-[var(--t-border)] rounded-lg text-[8px] font-black tracking-widest whitespace-nowrap italic">{label}</div>
        </div>
    );
}

function Badge({ label, color }: any) {
    return (
        <div className="px-5 py-2.5 bg-black/60 backdrop-blur-3xl border border-[var(--t-border)] rounded-2xl flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
            <span className="text-[9px] font-black uppercase tracking-widest italic">{label}</span>
        </div>
    );
}

function DomainBar({ label, value, color, detail }: any) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[11px] font-black uppercase tracking-tighter italic text-white mb-1">{label}</div>
                    <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">{detail}</div>
                </div>
                <div className="text-xl font-black font-mono text-white/40">{value}%</div>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5">
                <div className={`h-full rounded-full transition-all duration-[2000ms] ${color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function DomainMatrixCard({ domain, type, status, load, icon, color }: any) {
    return (
        <div className="bg-[var(--t-surface)] border border-[var(--t-border)] p-8 rounded-[32px] hover:border-[var(--t-border)] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                {icon}
            </div>
            <div className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.2em] mb-4">{type}</div>
            <div className="text-2xl font-black italic text-white tracking-tighter mb-4">{domain}</div>
            <div className="flex justify-between items-center">
                <div className={`text-[9px] font-black uppercase ${color || 'text-[var(--t-cyan)]'}`}>{status}</div>
                <div className="text-[9px] font-black uppercase text-white/40">Load: {load}</div>
            </div>
        </div>
    );
}

function CoreStat({ label, value }: any) {
    return (
        <div className="flex justify-between items-center pb-4 border-b border-[var(--t-border)] last:border-0">
            <div className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-relaxed italic">{label}</div>
            <div className="text-[11px] font-black uppercase text-[var(--t-cyan)] tracking-tighter italic">{value}</div>
        </div>
    );
}

function LogPanel({ title }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-8">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.3em]">{title}</h3>
                <Layers size={14} className="text-white/20" />
            </div>
            <div className="space-y-6">
                <LogEntry time="12:44" actor="SYS_ORCHESTRATOR" msg="Rebalancing Asset Load: Zone-A" />
                <LogEntry time="12:40" actor="AUTH_TENANT_X" msg="Tenant Isolation Verified (Industrial)" />
                <LogEntry time="12:35" actor="AI_G_ORACLE" msg="Peak Demand Predicted (Transport_Domain)" />
            </div>
        </div>
    );
}

function LogEntry({ time, actor, msg }: any) {
    return (
        <div className="flex gap-4 group">
            <span className="text-[9px] font-mono font-black text-white/20 italic pt-1 group-hover:text-[var(--t-cyan)] transition-colors">{time}</span>
            <div>
                <div className="text-[9px] font-black uppercase tracking-tighter text-white/60 mb-0.5">{actor}</div>
                <p className="text-[10px] font-bold text-[var(--t-text-muted)] uppercase tracking-wider leading-relaxed">{msg}</p>
            </div>
        </div>
    );
}

