"use client";

import React, { useState } from 'react';
import {
    BarChart3,
    ShieldCheck,
    FileText,
    Download,
    Clock,
    Users,
    Search,
    Filter,
    History,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Map,
    Scale
} from 'lucide-react';

export default function ComplianceDashboard() {
    const [activeTab, setActiveTab] = useState('KPIS');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-white p-8 selection:bg-[var(--t-accent)]/30" style={{fontFamily:"var(--font-sans)"}}>
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t-text-muted)]">Governance_Audit_OS</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">COMPLIANCE_&_KPIS</h1>
                </div>

                <div className="flex gap-4">
                    <ExportButton />
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-8 mb-12 border-b border-[var(--t-border)]">
                <NavTab active={activeTab === 'KPIS'} onClick={() => setActiveTab('KPIS')} label="PERFORMANCE_KPIs" />
                <NavTab active={activeTab === 'AUDIT'} onClick={() => setActiveTab('AUDIT')} label="AUDIT_TIMELINE" />
                <NavTab active={activeTab === 'LEGAL'} onClick={() => setActiveTab('LEGAL')} label="LEGAL_EXPORTS" />
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Main Content Area */}
                <div className="col-span-12 lg:col-span-9 space-y-8">

                    {activeTab === 'KPIS' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-3 gap-6">
                                <KPICard label="Avg Response Time" value="11.4m" unit="mins" trend="-1.2m" icon={<Clock size={20} />} />
                                <KPICard label="Golden Hour Survival" value="92.4" unit="%" trend="+4.1%" icon={<ShieldCheck size={20} />} />
                                <KPICard label="Fleet Readiness" value="88.2" unit="%" trend="STABLE" icon={<Activity size={20} />} />
                            </div>

                            <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-10">
                                <div className="flex justify-between items-center mb-12">
                                    <h3 className="text-[12px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]">SURVIVAL_WINDOW_ANALYTICS</h3>
                                    <TrendingUp size={16} className="text-[var(--t-cyan)]" />
                                </div>
                                <div className="h-[400px] flex items-end gap-6">
                                    <AnalyticsBar label="Mon" value={82} />
                                    <AnalyticsBar label="Tue" value={85} />
                                    <AnalyticsBar label="Wed" value={91} />
                                    <AnalyticsBar label="Thu" value={88} active />
                                    <AnalyticsBar label="Fri" value={76} warn />
                                    <AnalyticsBar label="Sat" value={89} />
                                    <AnalyticsBar label="Sun" value={94} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'AUDIT' && (
                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-8">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-[12px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]">INCIDENT_TIMELINE_RECONSTRUCTION</h3>
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 bg-white/5 border border-[var(--t-border)] rounded-xl flex items-center gap-3">
                                        <Search size={14} className="text-[var(--t-text-muted)]" />
                                        <input className="bg-transparent text-[10px] font-bold outline-none uppercase tracking-widest placeholder:text-white/20" placeholder="INCIDENT_ID..." />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <AuditEntry time="12:40:02" action="INCIDENT_REPORTED" user="CITIZEN_APP" details="Geo-tagged report received from Downtown Zone-1" />
                                <AuditEntry time="12:41:15" action="AI_CLASSIFIED" user="HEURISTICS_ENGINE" details="P1 Critical / Life-Threatening (Cardiac Alert)" />
                                <AuditEntry time="12:41:40" action="DISPATCH_ASSIGNED" user="COMMAND_HQ" details="AMB-404 assigned (ETA: 4m)" />
                                <AuditEntry time="12:43:10" action="EN_ROUTE" user="AMB-404_CREW" details="Resource moving at 74km/h on Al Khail Rd" />
                                <AuditEntry time="12:45:55" action="AT_SCENE" user="AMB-404_CREW" details="Arrival confirmed within 4.8m (SLA MET)" />
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Sidebar: Compliance Stats */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-8">
                        <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] mb-10 tracking-[0.3em]">COMPLIANCE_VITALS</h3>
                        <div className="space-y-8">
                            <ComplianceVital label="Data Retention" value="100%" status="HEALTHY" />
                            <AuditHealth label="Audit Integrity" value="VERIFIED" status="HEALTHY" />
                            <ComplianceVital label="Gov Reporting" value="On-Time" status="HEALTHY" />
                        </div>
                    </div>

                    <div className="bg-[var(--t-accent)]/5 border border-[var(--t-cyan)]/20 p-8 rounded-[40px]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[var(--t-accent)]/10 rounded-2xl text-[var(--t-cyan)]">
                                <Scale size={20} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest">Legal_Shield_V1</div>
                        </div>
                        <p className="text-[10px] font-bold text-[var(--t-text-muted)] uppercase leading-relaxed tracking-widest">
                            All telemetry, voice logs, and AI decisions are cryptographically hashed for chain-of-custody verification.
                        </p>
                    </div>

                    <button className="w-full py-6 bg-white text-black text-[12px] font-black uppercase italic rounded-3xl hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-95">Generate_Legal_Bundle</button>
                </div>

            </div>
        </div>
    );
}

function NavTab({ active, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative ${active ? 'text-white italic' : 'text-[var(--t-text-muted)] hover:text-white/40'
                }`}>
            {label}
            {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--t-accent)]" />}
        </button>
    );
}

function KPICard({ label, value, unit, trend, icon }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-8 rounded-[32px] group hover:border-[var(--t-border)] transition-all">
            <div className="flex justify-between items-center mb-8">
                <div className="p-3 bg-white/5 rounded-2xl text-white/40 group-hover:text-[var(--t-cyan)] group-hover:bg-[var(--t-accent)]/10 transition-all">
                    {icon}
                </div>
                <div className={`text-[9px] font-black italic ${trend.includes('+') ? 'text-green-400' : trend === 'STABLE' ? 'text-[var(--t-text-muted)]' : 'text-red-500'}`}>{trend}</div>
            </div>
            <div className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-widest mb-2">{label}</div>
            <div className="flex items-end gap-2">
                <span className="text-4xl font-black italic tracking-tighter">{value}</span>
                <span className="text-xs font-black text-white/20 uppercase mb-1">{unit}</span>
            </div>
        </div>
    );
}

function AnalyticsBar({ label, value, active, warn, peak }: any) {
    return (
        <div className="flex-1 flex flex-col items-center gap-4 group">
            <div className="flex-1 w-full bg-white/5 rounded-2xl relative flex flex-col justify-end overflow-hidden">
                <div className={`w-full transition-all duration-1000 group-hover:brightness-125 ${warn ? 'bg-red-500' : active ? 'bg-[var(--t-accent)] shadow-[0_0_20px_rgba(0,163,255,0.4)]' : 'bg-white/10'
                    }`} style={{ height: `${value}%` }} />
                <div className="absolute top-4 left-0 right-0 text-center text-[10px] font-black font-mono opacity-0 group-hover:opacity-100 transition-opacity">{value}%</div>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? 'text-white' : 'text-[var(--t-text-muted)]'}`}>{label}</span>
        </div>
    );
}

function AuditEntry({ time, action, user, details }: any) {
    return (
        <div className="flex gap-8 group">
            <div className="w-24 text-[10px] font-black font-mono text-[var(--t-text-muted)] italic pt-1">{time}</div>
            <div className="flex-1 pb-8 border-l border-[var(--t-border)] pl-8 relative">
                <div className="absolute -left-1 top-2 w-2 h-2 rounded-full bg-white/10 group-hover:bg-[var(--t-accent)] transition-colors shadow-[0_0_10px_transparent] group-hover:shadow-neon-blue/40" />
                <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white italic">{action}</div>
                    <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">BY: {user}</div>
                </div>
                <p className="text-[10px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest italic leading-relaxed">{details}</p>
            </div>
        </div>
    );
}

function ExportButton() {
    return (
        <div className="flex bg-[var(--t-surface)] border border-[var(--t-border)] p-1 rounded-2xl">
            <button className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest italic rounded-xl flex items-center gap-3">
                <Download size={14} />
                Export_Report
            </button>
        </div>
    );
}

function ComplianceVital({ label, value, status }: any) {
    return (
        <div className="flex justify-between items-center">
            <div className="text-[10px] font-black uppercase text-white tracking-widest">{label}</div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black font-mono italic">{value}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
            </div>
        </div>
    );
}

function AuditHealth({ label, status }: any) {
    return (
        <div className="flex justify-between items-center">
            <div className="text-[10px] font-black uppercase text-white tracking-widest">Audit Stability</div>
            <div className="flex items-center gap-3">
                <div className="px-2 py-0.5 bg-green-400 text-black text-[8px] font-black rounded italic">VERIFIED_SECURE</div>
                <CheckCircle2 size={12} className="text-green-400" />
            </div>
        </div>
    );
}

