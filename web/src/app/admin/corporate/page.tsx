"use client";

import React, { useState } from 'react';
import {
    Building2,
    CalendarClock,
    Wallet,
    ShieldCheck,
    TrendingUp,
    AlertTriangle,
    Plus,
    ArrowUpRight,
    Settings,
    ShieldAlert
} from 'lucide-react';

export default function CorporateAdminPage() {
    const [activeTab, setActiveTab] = useState('schedules');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-[var(--t-text)] p-6" style={{fontFamily:"var(--font-sans)"}}>
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--t-accent)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t-text-muted)]">Corporate_Command</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic" style={{fontFamily:"var(--font-heading)",letterSpacing:"-0.02em"}}>AL_GHURAIR_OPERATIONS</h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[var(--t-surface)] border border-[var(--t-border)] p-4 rounded-2xl flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase">Reliability_Index</div>
                            <div className="text-xl font-mono font-black text-[var(--t-cyan)]" style={{fontFamily:"var(--font-mono)"}}>0.98</div>
                        </div>
                        <TrendingUp size={24} className="text-[var(--t-cyan)]" />
                    </div>
                    <button className="bg-[var(--t-accent)] text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:brightness-110 transition-all">
                        <Plus size={20} strokeWidth={3} />
                        NEW_RECURRING_MISSION
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-8">

                {/* Sidebar Nav */}
                <div className="col-span-3 space-y-2">
                    <NavButton active={activeTab === 'schedules'} icon={CalendarClock} label="Recurring Schedules" onClick={() => setActiveTab('schedules')} />
                    <NavButton active={activeTab === 'billing'} icon={Wallet} label="Department Billing" onClick={() => setActiveTab('billing')} />
                    <NavButton active={activeTab === 'fleet'} icon={ShieldCheck} label="Dedicated Fleet" onClick={() => setActiveTab('fleet')} />
                    <NavButton active={activeTab === 'sla'} icon={ShieldAlert} label="SLA Compliance" onClick={() => setActiveTab('sla')} />

                    <div className="mt-12 p-6 bg-[var(--t-orange)]/5 border border-[var(--t-orange)]/10 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 text-[var(--t-orange)]">
                            <AlertTriangle size={16} />
                            <span className="text-[10px] font-black uppercase">Penalty_Forecast</span>
                        </div>
                        <div className="text-2xl font-mono font-black" style={{fontFamily:"var(--font-mono)"}}>$1,420.00</div>
                        <div className="text-[9px] text-[var(--t-text-muted)] mt-1 tracking-wider uppercase">Projected SLA Breach Penalty (Next 30 Days)</div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-span-9 space-y-8">

                    {/* Dashboard Summary Cards */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-6 rounded-2xl">
                            <div className="text-[9px] font-bold text-[var(--t-text-muted)] mb-4 uppercase">Total_Budget_Allocation</div>
                            <div className="text-3xl font-black font-mono" style={{fontFamily:"var(--font-mono)"}}>$450,000</div>
                            <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--t-accent)] w-[45%]" />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[9px] text-[var(--t-text-muted)] font-bold uppercase">45% Utilized</span>
                                <span className="text-[9px] text-[var(--t-text)] font-bold uppercase">$202.5k Remaining</span>
                            </div>
                        </div>

                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-6 rounded-2xl">
                            <div className="text-[9px] font-bold text-[var(--t-text-muted)] mb-4 uppercase">Reserved_Vessel_Status</div>
                            <div className="text-3xl font-black font-mono" style={{fontFamily:"var(--font-mono)"}}>12 <span className="text-sm text-[var(--t-text-muted)] italic">/ 15</span></div>
                            <div className="mt-4 flex gap-1">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i < 12 ? 'bg-[var(--t-orange)]' : 'bg-white/10'}`} />
                                ))}
                            </div>
                            <div className="mt-2 text-[9px] text-[var(--t-text-muted)] font-bold uppercase">80% Fleet Utilization</div>
                        </div>

                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <div className="text-[9px] font-bold text-[var(--t-text-muted)] mb-1 uppercase">Active_Missions</div>
                                <div className="text-3xl font-black font-mono" style={{fontFamily:"var(--font-mono)"}}>142</div>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <ArrowUpRight size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">+12% vs last week</span>
                            </div>
                        </div>
                    </div>

                    {/* Tab Content Placeholder */}
                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-2xl overflow-hidden">
                        <div className="p-8 border-b border-[var(--t-border)] flex justify-between items-center">
                            <h2 className="text-xl font-black tracking-tight italic uppercase" style={{fontFamily:"var(--font-heading)"}}>{activeTab.replace('_', ' ')}</h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase text-[var(--t-text-muted)] hover:bg-white/10">Filter</button>
                                <button className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase text-[var(--t-text-muted)] hover:bg-white/10">Export CSV</button>
                            </div>
                        </div>

                        <div className="p-8">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[9px] font-black text-[var(--t-text-muted)] uppercase tracking-widest">
                                        <th className="pb-6">COST_CENTER</th>
                                        <th className="pb-6">MISSION_TYPE</th>
                                        <th className="pb-6">FREQUENCY</th>
                                        <th className="pb-6">SLA_TARGET</th>
                                        <th className="pb-6">STATUS</th>
                                        <th className="pb-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium">
                                    <TableRow center="Engineering" type="Staff Shuttle" freq="Daily" sla="8m" status="Active" />
                                    <TableRow center="Executive" type="Dedicated Chauffeur" freq="On-Demand" sla="5m" status="Warning" />
                                    <TableRow center="Sales" type="Field Transport" freq="Weekly" sla="15m" status="Active" />
                                    <TableRow center="Operations" type="Shift Transfer" freq="Daily" sla="10m" status="Active" />
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function NavButton({ active, icon: Icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active
                    ? 'bg-white/10 text-[var(--t-text)] border border-[var(--t-border)]'
                    : 'text-[var(--t-text-muted)] hover:bg-white/5'
                }`}
        >
            <Icon size={20} color={active ? '#00F3FF' : 'currentColor'} />
            <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
        </button>
    );
}

function TableRow({ center, type, freq, sla, status }: any) {
    return (
        <tr className="border-t border-[var(--t-border)]">
            <td className="py-6 font-mono text-[var(--t-cyan)]" style={{fontFamily:"var(--font-mono)"}}>{center}</td>
            <td className="py-6 italic font-black text-[var(--t-text)]">{type}</td>
            <td className="py-6 text-[var(--t-text-muted)]">{freq}</td>
            <td className="py-6 font-mono" style={{fontFamily:"var(--font-mono)"}}>{sla}</td>
            <td className="py-6">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-[var(--t-orange)]/10 text-[var(--t-orange)]'
                    }`}>
                    {status}
                </span>
            </td>
            <td className="py-6 text-right">
                <button className="text-[var(--t-text-muted)] hover:text-[var(--t-text)] transition-colors">
                    <Settings size={16} />
                </button>
            </td>
        </tr>
    );
}


