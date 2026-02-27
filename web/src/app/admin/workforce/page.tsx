"use client";

import React, { useState } from 'react';
import {
    Users,
    Clock,
    ShieldCheck,
    AlertTriangle,
    BarChart3,
    Search,
    Calendar,
    FileBadge,
    Zap,
    ChevronRight,
    UserCheck,
    TrendingUp
} from 'lucide-react';

export default function WorkforceAdminPage() {
    const [selectedZone, setSelectedZone] = useState('Central');

    return (
        <div className="min-h-screen bg-[#060608] text-white p-8 font-sans selection:bg-neon-blue/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Workforce_Intelligence_OS</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic">DRIVER_FORCE_COMMAND</h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white/[0.03] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[8px] font-bold text-muted-grey uppercase">Safety_Aggregate</div>
                            <div className="text-xl font-mono font-black text-neon-blue">A-</div>
                        </div>
                        <ShieldCheck size={24} className="text-neon-blue" />
                    </div>
                    <button className="bg-neon-blue text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 hover:brightness-110 transition-all">
                        <Zap size={18} strokeWidth={3} />
                        AI_OPTIMIZE_ROSTER
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left Column: Workforce Pulse */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Workforce_Status</h3>

                        <div className="space-y-8">
                            <StatItem label="Active_Drivers" value="1,240" sub="84% of total force" icon={Users} />
                            <StatItem label="Average_Fatigue" value="0.22" sub="Index score (Target < 0.3)" icon={Clock} color="text-green-400" />
                            <StatItem label="Compliance_Alerts" value="08" sub="Expired Certs / Licenses" icon={AlertTriangle} color="text-pulse-orange" />
                        </div>

                        <div className="mt-12 p-6 bg-pulse-orange/5 border border-pulse-orange/10 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2 text-pulse-orange">
                                <AlertTriangle size={14} />
                                <span className="text-[9px] font-black uppercase">Mandatory_ReCertification_Due</span>
                            </div>
                            <div className="text-xs text-muted-grey leading-relaxed">
                                <span className="text-white font-bold">12 Responder Drivers</span> have pending Emergency Ops renewal. Blocking active status in <span className="text-white font-bold">48 hours</span>.
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Safety_Leaderboard</h3>
                        <div className="space-y-4">
                            <DriverRank name="Khalid I." score={98.4} grade="A+" />
                            <DriverRank name="Sarah M." score={96.1} grade="A" />
                            <DriverRank name="Omar A." score={95.5} grade="A" />
                            <div className="pt-4 flex justify-center">
                                <button className="text-[9px] font-black uppercase text-muted-grey hover:text-white transition-colors">View All 1,240 Drivers</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics & Rosters */}
                <div className="col-span-8 space-y-6">

                    {/* Behavioral Heatmap Placeholder */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-[320px] flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em]">Behavioral_Risk_Analytics</h3>
                            <div className="flex gap-2">
                                <TabButton active label="Harsh Braking" />
                                <TabButton label="Overspeed" />
                            </div>
                        </div>
                        <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center">
                            <BarChart3 className="text-white/10" size={64} />
                            <span className="text-[10px] font-black uppercase text-white/20 ml-4 tracking-widest italic">Live_Telemetry_Stream</span>
                        </div>
                    </div>

                    {/* Workforce List */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <h2 className="text-xl font-black italic tracking-tight uppercase">Fleet_Workforce_Roster</h2>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-grey" size={14} />
                                    <input className="bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-[10px] focus:outline-none focus:border-neon-blue w-64" placeholder="Search Driver ID or Name..." />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[9px] font-black text-muted-grey uppercase tracking-widest border-b border-white/5">
                                        <th className="p-8">DRIVER_ENTITY</th>
                                        <th className="p-8">SHIFT_STATUS</th>
                                        <th className="p-8">SAFETY_RISK</th>
                                        <th className="p-8">CERTIFICATIONS</th>
                                        <th className="p-8">FATIGUE</th>
                                        <th className="p-8"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <DriverRow name="Ahmad Z." id="#DR_4421" shift="On-Shift (04:12)" risk="Low" grade="A" fatigue={0.12} />
                                    <DriverRow name="Sami K." id="#DR_8829" shift="Resting (06:00 Remain)" risk="Mod" grade="B" fatigue={0.45} alert />
                                    <DriverRow name="Elena R." id="#DR_1021" shift="On-Shift (01:22)" risk="Low" grade="A-" fatigue={0.08} />
                                    <DriverRow name="Yousif B." id="#DR_5562" shift="Standby" risk="Mod" grade="B+" fatigue={0.21} certExp />
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, sub, icon: Icon, color = "text-white" }: any) {
    return (
        <div className="flex items-center gap-5">
            <div className={`p-4 bg-white/[0.03] rounded-2xl ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <div className="text-[9px] font-bold text-muted-grey uppercase mb-1">{label}</div>
                <div className="text-2xl font-black font-mono leading-none mb-1">{value}</div>
                <div className="text-[9px] font-medium text-muted-grey tracking-wider uppercase">{sub}</div>
            </div>
        </div>
    );
}

function DriverRank({ name, score, grade }: any) {
    return (
        <div className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-neon-blue/40 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-blue/20 flex items-center justify-center text-[10px] font-black text-black">
                    {name[0]}
                </div>
                <div>
                    <div className="text-[11px] font-black tracking-tight">{name}</div>
                    <div className="text-[8px] text-muted-grey font-mono">{score}% Compliance</div>
                </div>
            </div>
            <div className="text-xs font-black text-neon-blue italic">{grade}</div>
        </div>
    );
}

function TabButton({ active, label }: any) {
    return (
        <button className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${active ? 'bg-white/10 text-white' : 'text-muted-grey hover:bg-white/5'
            }`}>
            {label}
        </button>
    );
}

function DriverRow({ name, id, shift, risk, grade, fatigue, alert = false, certExp = false }: any) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all group">
            <td className="p-8">
                <div className="text-xs font-black text-white italic tracking-tighter mb-1">{name}</div>
                <div className="text-[10px] font-mono text-muted-grey">{id}</div>
            </td>
            <td className="p-8">
                <div className={`text-[10px] font-black uppercase ${alert ? 'text-pulse-orange' : 'text-green-400'}`}>
                    {shift}
                </div>
            </td>
            <td className="p-8">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${risk === 'Low' ? 'bg-green-500/10 text-green-400' : 'bg-pulse-orange/10 text-pulse-orange'
                        }`}>{risk}</span>
                    <span className="text-xs font-black italic">{grade}</span>
                </div>
            </td>
            <td className="p-8">
                {certExp ? (
                    <div className="flex items-center gap-2 text-red-500">
                        <FileBadge size={14} />
                        <span className="text-[9px] font-black uppercase">License Expiring</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-muted-grey">
                        <FileBadge size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest italic">All_Valid</span>
                    </div>
                )}
            </td>
            <td className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${fatigue > 0.4 ? 'bg-pulse-orange' : 'bg-neon-blue'}`} style={{ width: `${fatigue * 100}%` }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-muted-grey">{Math.round(fatigue * 100)}%</span>
                </div>
            </td>
            <td className="p-8 text-right">
                <ChevronRight size={16} className="text-muted-grey group-hover:text-neon-blue transition-all cursor-pointer" />
            </td>
        </tr>
    );
}
