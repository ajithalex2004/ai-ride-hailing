"use client";

import React, { useState } from 'react';
import {
    ShieldCheck,
    History,
    FileText,
    Globe,
    AlertOctagon,
    Search,
    ChevronRight,
    Lock,
    Calendar,
    CheckCircle2,
    XCircle,
    Activity,
    UserCheck,
    Truck
} from 'lucide-react';

export default function ComplianceAdminPage() {
    const [filter, setFilter] = useState('ALL');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-[var(--t-text)] p-6 font-sans selection:bg-neon-blue/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-pulse-orange animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Regulatory_OS_Goverance</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase" style={{fontFamily:"var(--font-heading)",letterSpacing:"-0.02em"}}>TRUST_INTEGRITY_CORE</h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[var(--t-card)] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[8px] font-bold text-muted-grey uppercase">Encryption_State</div>
                            <div className="text-xl font-mono font-black text-green-400" style={{fontFamily:"var(--font-mono)"}}>ACTIVE_SHA256</div>
                        </div>
                        <Lock size={24} className="text-green-400" />
                    </div>
                    <button className="bg-[var(--t-accent)] text-black hover:bg-[var(--t-accent-hover)]-blue transition-all">
                        <FileText size={18} strokeWidth={3} />
                        GENERATE_SOX_REPORT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Audit Logs & Tax */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-[var(--t-card)] border border-white/5 rounded-2xl p-6 flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em] mb-1" style={{fontFamily:"var(--font-heading)"}}>Immutable_Audit_Trail</h3>
                                <div className="text-xs font-black italic text-white/40 tracking-widest uppercase italic">Full_Traceability_Real_Time_Stream</div>
                            </div>
                            <div className="flex gap-2">
                                <TabButton active label="All Logs" />
                                <TabButton label="Security" />
                                <TabButton label="Financial" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                            <AuditEntry icon={ShieldCheck} type="ACCESS_GRANT" actor="SuperAdmin_42" timestamp="08:42:12" status="VERIFIED" desc="Granted 'Forecasting_Full_View' to Analyst_09" hash="sha256-4f81..." />
                            <AuditEntry icon={Activity} type="CONFIG_CHANGE" actor="System_Core" timestamp="08:40:05" status="VERIFIED" desc="Updated VAT_Rate for 'KSA' region to 15%" hash="sha256-bd22..." />
                            <AuditEntry icon={AlertOctagon} type="DISPATCH_OVERRIDE" actor="Dispatcher_77" timestamp="08:35:54" status="ALERT" desc="Manual override of Emergency P1 queue for Trip #881" hash="sha256-91c2..." />
                            <AuditEntry icon={UserCheck} type="COMPLIANCE_PASS" actor="Gov_API" timestamp="08:30:00" status="VERIFIED" desc="AED Drivers License check passed for ID #1201" hash="sha256-0aab..." />
                        </div>
                    </div>

                    <div className="bg-[var(--t-card)] border border-white/5 rounded-2xl overflow-hidden h-[250px]">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[var(--t-card)]">
                            <h2 className="text-xl font-black italic tracking-tight uppercase" style={{fontFamily:"var(--font-heading)"}}>Regional_Tax_Automation</h2>
                            <Globe size={18} className="text-neon-blue" />
                        </div>
                        <div className="p-8 grid grid-cols-3 gap-8">
                            <TaxCard region="UAE" vat="5%" revenue="$142.2K" />
                            <TaxCard region="KSA" vat="15%" revenue="$288.5K" />
                            <TaxCard region="QAT" vat="0%" revenue="$64.1K" />
                        </div>
                    </div>
                </div>

                {/* Right: Compliance Monitoring */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-[var(--t-card)] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]" style={{fontFamily:"var(--font-heading)"}}>Driver_Compliance_Pulse</h3>
                        <div className="space-y-6">
                            <ComplianceMetric label="Global Compliance Rate" value="98.4%" icon={UserCheck} status="OPTIMAL" />
                            <div className="space-y-3">
                                <span className="text-[8px] font-bold text-muted-grey uppercase">Upcoming_Expiries (30d)</span>
                                <ExpiryItem label="Medical Certification" count="12 Drivers" urgency="CRITICAL" />
                                <ExpiryItem label="Emirates ID Renewal" count="8 Drivers" urgency="MODERATE" />
                                <ExpiryItem label="Background Audits" count="42 Drivers" urgency="ROUTINE" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--t-card)] border border-white/5 rounded-2xl p-6 h-[300px] flex flex-col justify-between">
                        <div>
                            <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]" style={{fontFamily:"var(--font-heading)"}}>Fleet_Regulatory_Gate</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center">
                                    <Truck size={20} className="text-neon-blue mx-auto mb-2" />
                                    <div className="text-xl font-black font-mono" style={{fontFamily:"var(--font-mono)"}}>1,240</div>
                                    <div className="text-[8px] font-bold text-muted-grey uppercase">Inspected</div>
                                </div>
                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center">
                                    <Calendar size={20} className="text-pulse-orange mx-auto mb-2" />
                                    <div className="text-xl font-black font-mono text-pulse-orange" style={{fontFamily:"var(--font-mono)"}}>14</div>
                                    <div className="text-[8px] font-bold text-muted-grey uppercase">Pending_Test</div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-neon-blue text-black rounded-2xl font-black text-[10px] uppercase tracking-tighter hover:scale-[1.02] transition-all">START_FLEET_AUDIT</button>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-red-500/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                <AlertOctagon size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-tight">Active_Risk_Detections</div>
                                <div className="text-[8px] text-muted-grey uppercase">4 Potential Regulatory Breaches</div>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-muted-grey group-hover:text-red-500 transition-all" />
                    </div>
                </div>

            </div>
        </div>
    );
}

function AuditEntry({ icon: Icon, type, actor, timestamp, status, desc, hash }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-white/5 p-5 rounded-2xl group hover:border-white/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                <div className="text-[6px] font-mono text-white/40" style={{fontFamily:"var(--font-mono)"}}>{hash}</div>
            </div>
            <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-xl ${status === 'ALERT' ? 'bg-red-500/10 text-red-500' : 'bg-neon-blue/10 text-neon-blue'}`}>
                    <Icon size={18} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-[10px] font-black uppercase tracking-widest italic">{type}</div>
                        <div className="text-[8px] font-bold text-muted-grey uppercase font-mono" style={{fontFamily:"var(--font-mono)"}}>{timestamp}</div>
                    </div>
                    <div className="text-[11px] text-white/80 font-medium mb-1">{desc}</div>
                    <div className="text-[8px] font-bold text-muted-grey uppercase tracking-widest">ACTOR: <span className="text-[var(--t-text)]">{actor}</span></div>
                </div>
            </div>
        </div>
    );
}

function TaxCard({ region, vat, revenue }: any) {
    return (
        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl group hover:border-neon-blue/40 transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-4 text-xs font-black italic tracking-tighter text-white/60">
                <span>{region}</span>
                <span className="text-neon-blue">{vat} VAT</span>
            </div>
            <div className="text-[9px] font-bold text-muted-grey uppercase mb-1 tracking-widest">Projected_Liability</div>
            <div className="text-2xl font-black font-mono text-[var(--t-text)] group-hover:scale-105 transition-transform origin-left" style={{fontFamily:"var(--font-mono)"}}>{revenue}</div>
        </div>
    );
}

function ComplianceMetric({ label, value, icon: Icon, status }: any) {
    return (
        <div className="flex items-center gap-6">
            <div className="p-4 bg-[var(--t-card)] rounded-2xl text-neon-blue">
                <Icon size={24} />
            </div>
            <div>
                <div className="text-[9px] font-bold text-muted-grey uppercase mb-1 tracking-widest">{label}</div>
                <div className="text-2xl font-black font-mono italic leading-none flex items-center gap-3" style={{fontFamily:"var(--font-mono)"}}>
                    {value}
                    <div className="text-[8px] font-black px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">{status}</div>
                </div>
            </div>
        </div>
    );
}

function ExpiryItem({ label, count, urgency }: any) {
    return (
        <div className="flex justify-between items-center p-3 bg-[var(--t-card)] rounded-xl border border-white/5">
            <div className="text-[9px] font-black text-[var(--t-text)] italic uppercase">{label}</div>
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-black font-mono text-[var(--t-text)]" style={{fontFamily:"var(--font-mono)"}}>{count}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${urgency === 'CRITICAL' ? 'bg-red-500 animate-pulse' : urgency === 'MODERATE' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
            </div>
        </div>
    );
}

function TabButton({ active, label }: any) {
    return (
        <button className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${active ? 'bg-white/10 text-[var(--t-text)]' : 'text-muted-grey hover:bg-white/5'
            }`}>
            {label}
        </button>
    );
}

