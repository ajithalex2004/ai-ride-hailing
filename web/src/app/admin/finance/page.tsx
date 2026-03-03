"use client";

import React, { useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    PieChart,
    Globe,
    Briefcase,
    ChevronRight,
    Download,
    Filter,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    BarChart4
} from 'lucide-react';

export default function FinancialAdminPage() {
    const [currency, setCurrency] = useState('AED');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-[var(--t-text)] p-6 font-sans selection:bg-neon-blue/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-pulse-orange animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Financial_ERP_Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase" style={{fontFamily:"var(--font-heading)",letterSpacing:"-0.02em"}}>REVENUE_CORE_SIMULATOR</h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[var(--t-card)] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[8px] font-bold text-muted-grey uppercase">Daily_Volume</div>
                            <div className="text-xl font-mono font-black text-neon-blue" style={{fontFamily:"var(--font-mono)"}}>14,802.40</div>
                        </div>
                        <DollarSign size={24} className="text-neon-blue" />
                    </div>
                    <button className="bg-[var(--t-accent)] text-black hover:bg-[var(--t-accent-hover)]-blue transition-all">
                        <Download size={18} strokeWidth={3} />
                        EXPORT_LEDGER
                    </button>
                </div>
            </div>

            {/* Stats Quick Grid */}
            <div className="grid grid-cols-4 gap-6 mb-12">
                <FinanceStat label="Total_Gross_Revenue" value="$422.8K" trend="+12.4%" positive icon={TrendingUp} />
                <FinanceStat label="Platform_Cut_Net" value="$84.5K" trend="+5.2%" positive icon={PieChart} />
                <FinanceStat label="Driver_Earnings" value="$338.3K" trend="+8.1%" positive icon={Briefcase} />
                <FinanceStat label="Active_Forecasting" value="0.94" sub="AI Confidence Score" icon={Zap} color="text-pulse-orange" />
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: AI Forecasting Panel */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-[var(--t-card)] border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em] mb-1" style={{fontFamily:"var(--font-heading)"}}>Financial_Projection_Model</h3>
                                <div className="text-xs font-black italic text-white/40 italic tracking-widest">30-DAY_REVENUE_HORIZON_SIMULATION</div>
                            </div>
                            <div className="flex gap-2">
                                <TabButton active label="Optimistic" />
                                <TabButton label="Realistic" />
                                <TabButton label="Pessimistic" />
                            </div>
                        </div>

                        <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden group">
                            <BarChart4 className="text-neon-blue/10 group-hover:scale-110 transition-transform duration-700" size={120} />
                            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 grid grid-cols-7 items-end gap-1">
                                {[40, 60, 45, 80, 55, 90, 100].map((h, i) => (
                                    <div key={i} className="bg-neon-blue/20 border-t border-neon-blue/40 rounded-t-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                            <div className="absolute top-4 left-4 bg-neon-blue/10 border border-neon-blue/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-neon-blue italic">AI_PREDICTION_ACTIVE</div>
                        </div>
                    </div>

                    <div className="bg-[var(--t-card)] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[var(--t-card)]">
                            <h2 className="text-xl font-black italic tracking-tight uppercase" style={{fontFamily:"var(--font-heading)"}}>Cross_Border_Multi_Currency</h2>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                    <Globe size={14} className="text-muted-grey" />
                                    <span className="text-[9px] font-bold text-[var(--t-text)] uppercase">System_Base: AED</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-3 gap-8">
                            <CurrencyItem code="SAR" rate="1.02" status="STABLE" />
                            <CurrencyItem code="USD" rate="0.27" status="STABLE" />
                            <CurrencyItem code="EUR" rate="0.25" status="VOLATILE" />
                        </div>
                    </div>
                </div>

                {/* Right: Revenue Splits & Rules */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-[var(--t-card)] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]" style={{fontFamily:"var(--font-heading)"}}>Revenue_Split_Models</h3>

                        <div className="space-y-4">
                            <SplitModel label="Standard Fleet (80/20)" type="PLATFORM" val="20%" />
                            <SplitModel label="Corporate Custom" type="MIXED" val="VAR" />
                            <SplitModel label="Premium Driver Bonus" type="DRIVER" val="+5%" />
                        </div>

                        <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">CONFIGURE_NEW_MODEL</button>
                    </div>

                    <div className="bg-pulse-orange/5 border border-pulse-orange/20 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-pulse-orange/10 rounded-lg text-pulse-orange">
                                <Zap size={18} />
                            </div>
                            <h4 className="text-sm font-black italic tracking-tight">PROFITABILITY_SIMULATOR</h4>
                        </div>
                        <p className="text-[10px] text-muted-grey leading-relaxed mb-6 italic"> Simulating <span className="text-[var(--t-text)] font-bold">15% commission reduction</span> in SAUDI sector will increase transaction volume by <span className="text-green-400 font-bold underline">22.4%</span> over 90 days.</p>
                        <button className="w-full py-4 bg-pulse-orange text-black rounded-2xl font-black text-[10px] uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all">RUN_FULL_SIMULATION</button>
                    </div>

                    <div className="bg-[var(--t-card)] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[9px] font-black text-muted-grey uppercase">Commission_Alerts</span>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <div className="text-[11px] font-bold text-[var(--t-text)] mb-2 italic">Low_Margin_Overlap Detected</div>
                        <div className="text-[9px] text-muted-grey leading-relaxed">Fleet Operator <span className="text-[var(--t-text)] font-mono" style={{fontFamily:"var(--font-mono)"}}>#FO_441</span> is operating under 4.2% margin in Dammam sector. Higher risk of churn.</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function FinanceStat({ label, value, trend, positive, icon: Icon, color = "text-[var(--t-text)]" }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-[var(--t-card)] rounded-xl group-hover:bg-white/5 transition-colors ${color}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-black ${positive ? 'text-green-400' : 'text-red-500'}`}>
                        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend}
                    </div>
                )}
            </div>
            <div className="text-[9px] font-bold text-muted-grey uppercase mb-1 tracking-widest">{label}</div>
            <div className="text-2xl font-black font-mono tracking-tighter italic" style={{fontFamily:"var(--font-mono)"}}>{value}</div>
        </div>
    );
}

function SplitModel({ label, type, val }: any) {
    return (
        <div className="flex justify-between items-center bg-[var(--t-card)] p-4 rounded-2xl border border-white/5">
            <div className="text-[10px] font-black text-[var(--t-text)] italic tracking-tight uppercase">{label}</div>
            <div className="flex items-center gap-3">
                <span className="text-[8px] font-bold text-muted-grey uppercase">{type}</span>
                <span className="text-xs font-black text-neon-blue font-mono" style={{fontFamily:"var(--font-mono)"}}>{val}</span>
            </div>
        </div>
    );
}

function CurrencyItem({ code, rate, status }: any) {
    return (
        <div className="p-6 bg-black/40 rounded-2xl border border-white/5 group hover:border-neon-blue/40 transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-black font-mono text-[var(--t-text)]" style={{fontFamily:"var(--font-mono)"}}>{code}</div>
                <div className={`text-[8px] font-black px-2 py-0.5 rounded-md ${status === 'STABLE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                    {status}
                </div>
            </div>
            <div className="text-[9px] font-bold text-muted-grey uppercase mb-1">Exchange_Rate (Base)</div>
            <div className="text-xl font-black font-mono italic text-neon-blue group-hover:scale-105 transition-transform origin-left" style={{fontFamily:"var(--font-mono)"}}>{rate}</div>
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

