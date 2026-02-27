"use client";

import React, { useState } from 'react';
import {
    Ambulance,
    Wind,
    Activity,
    Users,
    Zap,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Clock,
    BarChart3,
    Thermometer,
    ShieldCheck,
    ChevronRight,
    MapPin
} from 'lucide-react';

export default function AmbulanceFleetDashboard() {
    const [activeTab, setActiveTab] = useState('EQUIPMENT');

    return (
        <div className="min-h-screen bg-[#060608] text-white p-8 font-sans selection:bg-neon-blue/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Fleet_Management_OS</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">AMBULANCE_FLEET_HQ</h1>
                </div>

                <div className="flex gap-4">
                    <TabButton active={activeTab === 'EQUIPMENT'} onClick={() => setActiveTab('EQUIPMENT')} label="EQUIPMENT_READY" />
                    <TabButton active={activeTab === 'CREW'} onClick={() => setActiveTab('CREW')} label="CREW_VITALITY" />
                    <TabButton active={activeTab === 'ANALYTICS'} onClick={() => setActiveTab('ANALYTICS')} label="RESPONSE_SLA" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Main Content Areas */}
                <div className="col-span-8 space-y-6">

                    {activeTab === 'EQUIPMENT' && (
                        <div className="grid grid-cols-3 gap-6">
                            <EquipmentCard name="O2 Supply" unit="88%" icon={<Wind />} status="OPTIMAL" color="text-green-400" />
                            <EquipmentCard name="Defibrillators" unit="12/12" icon={<Zap />} status="VERIFIED" color="text-neon-blue" />
                            <EquipmentCard name="Trauma Kits" unit="Ready" icon={<ShieldCheck />} status="STOCKED" color="text-white" />

                            <div className="col-span-3 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Fleet_Readiness_Ledger</h3>
                                <div className="space-y-4">
                                    <FleetItem id="DXB-AMB-101" o2="94%" defib="READY" status="ACTIVE" />
                                    <FleetItem id="DXB-AMB-102" o2="22%" defib="CHECK_TEST" status="MAINTENANCE" warning />
                                    <FleetItem id="DXB-AMB-103" o2="85%" defib="READY" status="ACTIVE" />
                                    <FleetItem id="DXB-AMB-104" o2="91%" defib="READY" status="STANDBY" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'CREW' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em]">Fatigue_Risk_AI</h3>
                                        <Activity size={16} className="text-red-500 animate-pulse" />
                                    </div>
                                    <div className="space-y-5">
                                        <CrewRiskItem name="Ahmed Khalil" role="Paramedic" score={0.88} risk="CRITICAL" />
                                        <CrewRiskItem name="Sarah J." role="Emergency Tech" score={0.62} risk="ELEVATED" />
                                        <CrewRiskItem name="Marcus V." role="Driver" score={0.12} risk="STABLE" />
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                                    <AlertCircle size={48} className="text-red-500 mb-4 animate-bounce" />
                                    <div className="text-xl font-black uppercase tracking-tighter mb-2 italic">Stand_Down_Required</div>
                                    <div className="text-[10px] font-bold text-muted-grey uppercase tracking-widest leading-relaxed max-w-[200px]">
                                        User Ahmed Khalil has exceeded safe fatigue limits (0.88). AI Lockout Active.
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Certification_Watchtower</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <div className="text-[10px] font-black uppercase italic">Advanced Life Support</div>
                                            <div className="text-[8px] font-bold text-muted-grey uppercase">3 Expiries Next 30 Days</div>
                                        </div>
                                        <CheckCircle2 size={16} className="text-neon-blue" />
                                    </div>
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <div className="text-[10px] font-black uppercase italic">PHTLS Certification</div>
                                            <div className="text-[8px] font-bold text-muted-grey uppercase">All Active Crews Compliant</div>
                                        </div>
                                        <CheckCircle2 size={16} className="text-green-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ANALYTICS' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                                <MetricSquare label="Avg Response" value="6.4m" trend="-12%" up />
                                <MetricSquare label="P1 Compliance" value="98.2%" trend="+4%" up />
                                <MetricSquare label="Busiest Zone" value="Downtown" icon={<MapPin size={12} />} />
                                <MetricSquare label="Total Dispatches" value="1,242" trend="+18%" up />
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                <div className="flex justify-between items-center mb-12">
                                    <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em]">Zone_Performance_Matrix</h3>
                                    <TrendingUp size={16} className="text-neon-blue" />
                                </div>
                                <div className="space-y-6">
                                    <ZoneBar zone="Jumeirah" perf={94} color="bg-green-400" />
                                    <ZoneBar zone="Downtown" perf={78} color="bg-pulse-orange" />
                                    <ZoneBar zone="Deira" perf={82} color="bg-neon-blue" />
                                    <ZoneBar zone="DIFC" perf={99} color="bg-green-400" />
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right: Quick Insights & Checklist */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Daily_Readiness_Check</h3>
                        <div className="space-y-4">
                            <CheckItem label="Oxygen Resupply Logged" complete />
                            <CheckItem label="Defib Self-Tests Verified" complete />
                            <CheckItem label="Narcotics Chain Verified" complete />
                            <CheckItem label="Crew Certifications Sync" complete />
                            <CheckItem label="Deep Clean Cycles Finalized" />
                        </div>
                    </div>

                    <div className="bg-neon-blue/5 border border-neon-blue/20 p-8 rounded-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-neon-blue/10 rounded-2xl text-neon-blue">
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-tight text-white mb-1">E_Predictor_Impact</div>
                                <div className="text-[8px] font-bold text-muted-grey uppercase tracking-wider italic">Response Precision: +14%</div>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-muted-grey uppercase leading-relaxed tracking-widest">
                            AI Optimization of shift rotations has reduced average P1 response times by 54 seconds in high-density zones.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

function EquipmentCard({ name, unit, icon, status, color }: any) {
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 group hover:border-white/10 transition-all">
            <div className={`p-3 bg-white/5 rounded-xl w-fit mb-6 ${color}`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <div className="text-3xl font-black font-mono italic tracking-tighter mb-1">{unit}</div>
            <div className="text-[10px] font-black uppercase text-muted-grey mb-4">{name}</div>
            <div className={`text-[8px] font-black px-2 py-0.5 rounded-md border w-fit uppercase tracking-widest ${status === 'OPTIMAL' || status === 'VERIFIED' || status === 'STOCKED' ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-red-500/10 border-red-500/40 text-red-500'
                }`}>{status}</div>
        </div>
    );
}

function FleetItem({ id, o2, defib, status, warning }: any) {
    return (
        <div className={`flex justify-between items-center p-4 bg-black/40 rounded-xl border ${warning ? 'border-red-500/30 bg-red-500/5' : 'border-white/5'}`}>
            <div className="flex items-center gap-4">
                <Ambulance size={16} className={warning ? 'text-red-500' : 'text-neon-blue'} />
                <div>
                    <div className="text-[10px] font-black italic uppercase tracking-tight">{id}</div>
                    <div className="text-[8px] font-bold text-muted-grey uppercase tracking-widest">O2: {o2} | Defib: {defib}</div>
                </div>
            </div>
            <div className={`text-[8px] font-black px-2 py-0.5 rounded-sm border uppercase tracking-widest ${status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-red-500/10 border-red-500/40 text-red-500'
                }`}>{status}</div>
        </div>
    );
}

function CrewRiskItem({ name, role, score, risk }: any) {
    return (
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="text-[10px] font-black uppercase italic">{name}</div>
                    <div className="text-[8px] font-bold text-muted-grey uppercase">{role}</div>
                </div>
                <div className={`text-[8px] font-black px-2 py-0.5 rounded-sm border uppercase tracking-widest ${risk === 'CRITICAL' ? 'bg-red-500/10 border-red-500/40 text-red-500' :
                        risk === 'ELEVATED' ? 'bg-pulse-orange/10 border-pulse-orange/40 text-pulse-orange' :
                            'bg-green-500/10 border-green-500/40 text-green-400'
                    }`}>{risk}</div>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full ${risk === 'CRITICAL' ? 'bg-red-500' :
                        risk === 'ELEVATED' ? 'bg-pulse-orange' :
                            'bg-green-400'
                    }`} style={{ width: `${score * 100}%` }} />
            </div>
        </div>
    );
}

function MetricSquare({ label, value, trend, icon, up }: any) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
            <div className="text-[8px] font-black text-muted-grey uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                {icon}
                {label}
            </div>
            <div>
                <div className="text-2xl font-black font-mono italic tracking-tighter mb-1">{value}</div>
                {trend && (
                    <div className={`text-[8px] font-black uppercase ${up ? 'text-green-400' : 'text-red-500'}`}>{trend} VS LW</div>
                )}
            </div>
        </div>
    );
}

function ZoneBar({ zone, perf, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-[10px] font-black uppercase italic mb-2 tracking-tight">
                <span>{zone}</span>
                <span>{perf}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${perf}%` }} />
            </div>
        </div>
    );
}

function CheckItem({ label, complete }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${complete ? 'bg-neon-blue border-neon-blue text-black' : 'border-white/20'
                }`}>
                {complete && <CheckCircle2 size={10} strokeWidth={4} />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tight ${complete ? 'text-white italic' : 'text-muted-grey'}`}>{label}</span>
        </div>
    );
}

function TabButton({ active, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-neon-blue text-black italic' : 'bg-white/[0.03] text-muted-grey hover:bg-white/[0.06]'
                }`}>
            {label}
        </button>
    );
}
