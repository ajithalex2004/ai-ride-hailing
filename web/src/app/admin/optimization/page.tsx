"use client";

import React, { useState } from 'react';
import {
    Zap,
    Map as MapIcon,
    Clock,
    TrendingUp,
    Target,
    AlertTriangle,
    Maximize2,
    ChevronRight,
    Gauge,
    Activity,
    BarChart3,
    MousePointer2
} from 'lucide-react';

export default function OptimizationDashboard() {
    const [activeLayer, setActiveLayer] = useState('surge');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-[var(--t-text)] p-6 selection:bg-[var(--t-accent)]/30" style={{fontFamily:"var(--font-sans)"}}>
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--t-orange)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t-text-muted)]">Transport_Optimization_Core</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase" style={{fontFamily:"var(--font-heading)",letterSpacing:"-0.02em"}}>FLEET_EFFICIENCY_ENGINE</h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[var(--t-surface)] border border-[var(--t-border)] px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase">Global_Utilization</div>
                            <div className="text-xl font-mono font-black text-green-400" style={{fontFamily:"var(--font-mono)"}}>88.4%</div>
                        </div>
                        <Activity size={24} className="text-green-400" />
                    </div>
                    <button className="bg-[var(--t-accent)] text-[var(--t-accent-contrast)] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 hover:bg-[var(--t-accent)] transition-all">
                        <Zap size={18} strokeWidth={3} />
                        RUN_CALIBRATION
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Map & Heatmaps */}
                <div className="col-span-8 flex flex-col space-y-6">
                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-2xl p-6 flex-1 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent opacity-50" />

                        <div className="relative z-10 flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-black italic tracking-tight uppercase mb-1" style={{fontFamily:"var(--font-heading)"}}>PROBABILITY_DEMAND_HEATMAP</h3>
                                <p className="text-[10px] text-[var(--t-text-muted)] font-bold tracking-widest uppercase italic">Real-time Surge & Idle-Time Optimization Layer</p>
                            </div>
                            <div className="flex gap-2">
                                <LayerButton active={activeLayer === 'surge'} onClick={() => setActiveLayer('surge')} label="Surge Probability" />
                                <LayerButton active={activeLayer === 'utilization'} onClick={() => setActiveLayer('utilization')} label="Fleet Utilization" />
                                <LayerButton active={activeLayer === 'reposition'} onClick={() => setActiveLayer('reposition')} label="Reposition Recommendation" />
                            </div>
                        </div>

                        <div className="relative z-10 flex-1 h-[400px] border border-[var(--t-border)] rounded-2xl bg-[var(--t-surface)] flex items-center justify-center">
                            <div className="text-center group-hover:scale-105 transition-transform duration-700">
                                <MapIcon size={64} className="text-white/5 mx-auto mb-4" />
                                <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic leading-loose">
                                    RENDERING_SPATIAL_INTELLIGENCE<br />
                                    <span className="text-[var(--t-cyan)] font-mono font-bold tracking-normal opacity-40" style={{fontFamily:"var(--font-mono)"}}>DXB_CORE_GRID_V2.0</span>
                                </span>
                            </div>

                            {/* Mock Heatmap Nodes */}
                            <div className="absolute top-20 left-40 w-32 h-32 bg-[var(--t-accent)]/10 blur-[60px] rounded-full animate-pulse" />
                            <div className="absolute bottom-40 right-60 w-48 h-48 bg-[var(--t-orange)]/10 blur-[80px] rounded-full animate-pulse delay-700" />

                            <div className="absolute bottom-8 right-8 flex items-center gap-4 bg-black/60 border border-[var(--t-border)] p-4 rounded-xl">
                                <div className="text-right">
                                    <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase">Peak_Zone_Prob</div>
                                    <div className="text-lg font-mono font-black text-[var(--t-cyan)]" style={{fontFamily:"var(--font-mono)"}}>0.92</div>
                                </div>
                                <Target size={20} className="text-[var(--t-cyan)]" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <MetricCard label="Average_Idle_Time" value="4.2m" sub="Target < 5.0m" icon={Clock} color="text-green-400" />
                        <MetricCard label="Cancellation_Risk_Avg" value="0.12" sub="Fleet-wide parity" icon={AlertTriangle} color="text-[var(--t-orange)]" />
                    </div>
                </div>

                {/* Right: Insights & AI Actions */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-2xl p-6">
                        <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] mb-8 tracking-[0.3em]" style={{fontFamily:"var(--font-heading)"}}>AI_Earnings_Forecast</h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-[var(--t-surface)] border border-[var(--t-border)] rounded-2xl">
                                <div className="text-[9px] font-bold text-[var(--t-text-muted)] uppercase mb-2">Next_Shift_Projected (Driver_Avg)</div>
                                <div className="text-2xl font-black font-mono leading-none mb-1 text-[var(--t-cyan)]" style={{fontFamily:"var(--font-mono)"}}>$182.40</div>
                                <div className="flex items-center gap-1 text-[9px] text-green-400 font-bold uppercase">
                                    <TrendingUp size={12} />
                                    +14.2% Optimization Lift
                                </div>
                            </div>

                            <div className="p-6 bg-[var(--t-orange)]/5 border border-[var(--t-orange)]/10 rounded-2xl">
                                <div className="flex items-center gap-2 mb-3 text-[var(--t-orange)]">
                                    <Zap size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Surge_Probability_Alert</span>
                                </div>
                                <div className="text-xs text-[var(--t-text-muted)] leading-relaxed">
                                    <span className="text-[var(--t-text)] font-bold">Zone_A2 (Business Bay)</span> has a <span className="text-[var(--t-text)] font-bold">94% probability</span> of surge between 17:00 - 18:30 due to weather impact (Rain).
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-2xl p-6">
                        <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] mb-8 tracking-[0.3em]" style={{fontFamily:"var(--font-heading)"}}>Utilization_Optimizer</h3>
                        <div className="space-y-4">
                            <OptimizationAction label="Reposition 12 Empty Vans to Downtown" impact="+4.2%" priority="High" />
                            <OptimizationAction label="Pre-dispatch 3 Ambulances to Jumeirah" impact="SLA-Guard" priority="Med" />
                            <OptimizationAction label="Adjust Surge Multiplier in Zone_4" impact="Revenue_Lift" priority="Low" />
                        </div>
                    </div>

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[var(--t-accent)]/10 rounded-xl text-[var(--t-cyan)]">
                                <Gauge size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-tight">Elasticity_Modeling</div>
                                <div className="text-[8px] text-[var(--t-text-muted)] uppercase">Run Corporate Price Sensitivity AI</div>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-[var(--t-text-muted)] group-hover:text-[var(--t-cyan)] transition-all" />
                    </div>
                </div>

            </div>
        </div>
    );
}

function MetricCard({ label, value, sub, icon: Icon, color = "text-[var(--t-text)]" }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-2xl p-6 flex items-center gap-6">
            <div className={`p-4 bg-[var(--t-surface)] rounded-2xl ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <div className="text-[9px] font-bold text-[var(--t-text-muted)] uppercase mb-1 tracking-widest">{label}</div>
                <div className="text-2xl font-black font-mono italic leading-none mb-1" style={{fontFamily:"var(--font-mono)"}}>{value}</div>
                <div className="text-[9px] font-medium text-[var(--t-text-muted)] uppercase">{sub}</div>
            </div>
        </div>
    );
}

function OptimizationAction({ label, impact, priority }: any) {
    return (
        <div className="p-4 bg-[var(--t-surface)] border border-[var(--t-border)] rounded-2xl flex justify-between items-center group hover:border-white/20 transition-all cursor-pointer">
            <div>
                <div className="text-[10px] font-black text-[var(--t-text)] italic tracking-tight uppercase mb-1">{label}</div>
                <div className="text-[8px] font-bold text-[var(--t-cyan)] uppercase">Impact: {impact}</div>
            </div>
            <div className={`text-[8px] font-black px-2 py-0.5 rounded-md border ${priority === 'High' ? 'border-red-500/40 text-red-500' : 'border-muted-grey/40 text-[var(--t-text-muted)]'
                }`}>
                {priority}
            </div>
        </div>
    );
}

function LayerButton({ active, onClick, label }: any) {
    return (
        <button onClick={onClick} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-2 ${active ? 'bg-white/10 text-[var(--t-text)]' : 'text-[var(--t-text-muted)] hover:bg-white/5'
            }`}>
            {active && <MousePointer2 size={12} />}
            {label}
        </button>
    );
}


