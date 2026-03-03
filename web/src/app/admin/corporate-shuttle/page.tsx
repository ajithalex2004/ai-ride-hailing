"use client";

import React, { useState } from 'react';
import MidnightSelect from '@/components/ui/MidnightSelect';
import {
    Bus,
    Briefcase,
    Users,
    ShieldCheck,
    Zap,
    Clock,
    Navigation,
    CreditCard,
    AlertTriangle,
    TrendingUp,
    Building2,
    QrCode,
    Calendar
} from 'lucide-react';

export default function CorporateShuttleDashboard() {
    const [activeTab, setActiveTab] = useState('COMMAND');

    return (
        <div className="min-h-screen bg-[#050507] text-white p-8 selection:bg-[var(--t-accent)]/30 selection:text-white" style={{ fontFamily: "var(--font-sans)" }}>
            {/* City-Scale Header */}
            <div className="flex justify-between items-end mb-16">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--t-accent)] animate-pulse shadow-[0_0_10px_#00A3FF]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--t-text-muted)]">Corporate_Logistics_OS_V2</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white drop-shadow-2xl">SHUTTLE_COMMAND_HQ</h1>
                </div>

                <div className="flex gap-4">
                    <CorpProfile name="Global Industrial Park" dept="Logistics_Hub" />
                </div>
            </div>

            {/* Navigation Rails */}
            <div className="flex gap-12 mb-16 border-b border-[var(--t-border)] relative">
                <NavRail active={activeTab === 'COMMAND'} onClick={() => setActiveTab('COMMAND')} label="SHIFT_COMMAND" />
                <NavRail active={activeTab === 'ROUTING'} onClick={() => setActiveTab('ROUTING')} label="NETWORK_DESIGN" />
                <NavRail active={activeTab === 'ENROLLMENT'} onClick={() => setActiveTab('ENROLLMENT')} label="EMPLOYEE_PORTAL" />
                <NavRail active={activeTab === 'FINANCE'} onClick={() => setActiveTab('FINANCE')} label="CORPORATE_BILLING" />
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Main Operational Core */}
                <div className="col-span-12 lg:col-span-8 space-y-8">

                    {activeTab === 'COMMAND' && (
                        <div className="space-y-8">
                            {/* Live HUD */}
                            <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[48px] h-[550px] relative overflow-hidden group shadow-inner">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/55.3,25.2,11/1200x800?access_token=mock')] bg-cover grayscale opacity-5" />

                                {/* AI Flow Lines (Mock) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                    <path d="M 100 200 Q 400 300 800 200" fill="none" stroke="#00A3FF" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                </svg>

                                <BusNode lat="30%" lng="40%" id="SHT-402" label="Morning_Shift_R1" pulse />
                                <BusNode lat="65%" lng="70%" id="SHT-119" label="Industrial_Zone_Loop" />

                                <div className="absolute top-10 left-10 flex gap-4">
                                    <Badge label="Operational: 98%" color="bg-green-400" />
                                    <Badge label="Peak: High Demand" color="bg-[var(--t-orange)]" />
                                </div>

                                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                                    <div className="bg-black/90 backdrop-blur-3xl border border-[var(--t-border)] p-10 rounded-[40px] flex items-center gap-10 shadow-2xl">
                                        <div className="flex items-center gap-6">
                                            <div className="p-5 bg-[var(--t-accent)]/10 rounded-3xl text-[var(--t-cyan)]">
                                                <Zap size={36} />
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-black uppercase text-white tracking-widest mb-1 italic">Peak_Orchestrator_Active</div>
                                                <div className="text-xl font-black font-mono tracking-tighter text-[var(--t-cyan)]">32 ACTIVE SHUTTLES</div>
                                            </div>
                                        </div>
                                        <button className="px-10 py-5 bg-[var(--t-accent)] text-black text-[12px] font-black uppercase italic rounded-2xl hover:scale-105 transition-all shadow-xl shadow-neon-blue/30">Optimize_All_Slots</button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <StatBox title="Dept_Attendance_Efficiency" value="94.2%" trend="+2.1%" />
                                <StatBox title="SLA_On_Time_Compliance" value="99.8%" trend="STABLE" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'ENROLLMENT' && (
                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[48px] p-12 space-y-12">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Self_Enrollment_Portal</h2>
                                <QrCode size={32} className="text-white/20" />
                            </div>
                            <div className="grid grid-cols-2 gap-10">
                                <EnrollmentField label="Employee_FullName" placeholder="E.g. Marcus Aurelius" />
                                <EnrollmentField label="Corp_Department" value="INDUSTRIAL_OPS_V4" disabled />
                                <EnrollmentField label="Shuttle_Shift" type="select" options={['MORNING_0800', 'EVENING_1700', 'NIGHT_2200']} />
                                <EnrollmentField label="Pickup_Point" placeholder="Search Geo-Cluster..." />
                            </div>
                            <button className="w-full py-8 bg-white text-black text-[14px] font-black uppercase italic rounded-3xl hover:scale-[1.01] transition-all shadow-2xl">Request_Transport_PASS</button>
                        </div>
                    )}
                </div>

                {/* Right Dashboard Rail */}
                <div className="col-span-12 lg:col-span-4 space-y-8">

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[48px] p-10 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[var(--t-accent)]/10 blur-[80px] group-hover:bg-[var(--t-accent)]/20 transition-all rounded-full" />
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[11px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]">PEAK_INTELLIGENCE</h3>
                            <TrendingUp size={18} className="text-[var(--t-cyan)]" />
                        </div>
                        <div className="space-y-12">
                            <PredictiveMetric label="Tomorrow_Demand_Peak" value="1.2k" sub="07:30 - 08:30" />
                            <div className="p-6 bg-[var(--t-accent)]/5 border border-[var(--t-cyan)]/20 rounded-3xl">
                                <div className="flex items-center gap-4 mb-3">
                                    <AlertTriangle size={16} className="text-[var(--t-cyan)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Capacity_Warning</span>
                                </div>
                                <p className="text-[11px] font-bold text-[var(--t-text-muted)] uppercase leading-relaxed tracking-wider">
                                    Zone-C industrial routes are at 94% capacity. AI recommends adding 1 buffer shuttle.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[48px] p-10">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[11px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]">SLA_PENALTY_COUNTER</h3>
                            <Clock size={18} className="text-[var(--t-orange)]" />
                        </div>
                        <div className="space-y-8">
                            <PenaltyItem label="Late_Arrival_R7" amount="$450.00" status="TRIGGERED" />
                            <PenaltyItem label="Missed_Shift_B2" amount="$120.00" status="RECOVERED" />
                        </div>
                    </div>

                    <div className="bg-[var(--t-accent)]/10 border border-[var(--t-cyan)]/20 p-10 rounded-[48px] text-center group cursor-pointer hover:bg-[var(--t-accent)]/15 transition-all">
                        <CreditCard size={40} className="mx-auto text-[var(--t-cyan)] mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] mb-3">Monthly_Consolidated_Bill</h4>
                        <p className="text-3xl font-black italic tracking-tighter text-white mb-6">$42,480.00</p>
                        <div className="text-[9px] font-black text-[var(--t-text-muted)] uppercase tracking-widest">Billing Period: MAR_2026</div>
                    </div>

                </div>

            </div>

            <style jsx>{`
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }
      `}</style>
        </div>
    );
}

function NavRail({ active, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`pb-6 px-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${active ? 'text-white italic' : 'text-white/20 hover:text-white/60'
                }`}>
            {label}
            {active && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--t-accent)] shadow-[0_0_15px_#00A3FF]" />}
        </button>
    );
}

function CorpProfile({ name, dept }: any) {
    return (
        <div className="flex bg-[var(--t-surface)] border border-[var(--t-border)] px-8 py-5 rounded-[28px] items-center gap-8 shadow-2xl">
            <div className="flex items-center gap-4">
                <Building2 size={24} className="text-[var(--t-cyan)]" />
                <div className="text-sm font-black tracking-tighter uppercase italic">{name}</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
                <div className="text-[9px] font-black uppercase text-[var(--t-text-muted)] tracking-widest mb-0.5">Primary_Dept</div>
                <div className="text-[11px] font-black text-white italic tracking-tighter">{dept}</div>
            </div>
        </div>
    );
}

function BusNode({ lat, lng, id, label, pulse }: any) {
    return (
        <div className="absolute group cursor-pointer" style={{ top: lat, left: lng }}>
            {pulse && <div className="w-10 h-10 rounded-full bg-[var(--t-accent)]/20 animate-ping absolute -inset-3" />}
            <div className="w-4 h-4 rounded-full border-2 border-white/40 bg-[var(--t-accent)] relative z-10 shadow-[0_0_20px_rgba(0,163,255,1)] group-hover:scale-125 transition-transform" />
            <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all bg-black/90 backdrop-blur-2xl border border-[var(--t-border)] px-4 py-2 rounded-xl text-[9px] font-black tracking-widest whitespace-nowrap italic pointer-events-none">
                <div className="text-white mb-1">{id}</div>
                <div className="text-[var(--t-text-muted)] uppercase text-[7px]">{label}</div>
            </div>
        </div>
    );
}

function Badge({ label, color }: any) {
    return (
        <div className="px-6 py-3 bg-black/80 backdrop-blur-3xl border border-[var(--t-border)] rounded-2xl flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{label}</span>
        </div>
    );
}

function StatBox({ title, value, trend }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-10 rounded-[40px] group hover:border-[var(--t-border)] transition-all">
            <div className="text-[11px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em] mb-6">{title}</div>
            <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black italic tracking-tighter text-white">{value}</span>
                <span className={`text-[12px] font-black italic ${trend.startsWith('+') ? 'text-green-400' : 'text-[var(--t-cyan)]'}`}>{trend}</span>
            </div>
        </div>
    );
}

function EnrollmentField({ label, placeholder, value, disabled, type, options }: any) {
    const [sel, setSel] = useState(options?.[0] ?? '');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: 'var(--font-sans)' }}>{label}</label>
            {type === 'select' ? (
                <MidnightSelect
                    value={sel}
                    onChange={setSel}
                    size="lg"
                    options={(options as string[]).map((o: string) => ({ value: o, label: o }))}
                />
            ) : (
                <input
                    disabled={disabled}
                    defaultValue={value}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '0.9rem 1.1rem', borderRadius: 12, background: 'var(--t-surface)', border: '1px solid var(--t-border)', color: 'var(--t-text)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', opacity: disabled ? 0.4 : 1, boxSizing: 'border-box' }}
                />
            )}
        </div>
    );
}

function PredictiveMetric({ label, value, sub }: any) {
    return (
        <div className="space-y-4">
            <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">{label}</div>
            <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black italic tracking-tighter">{value}</span>
                <span className="text-[11px] font-black uppercase text-[var(--t-text-muted)] italic tracking-widest">{sub}</span>
            </div>
        </div>
    );
}

function PenaltyItem({ label, amount, status }: any) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl hover:bg-white/[0.08] transition-all cursor-pointer">
            <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl ${status === 'TRIGGERED' ? 'bg-[var(--t-orange)]/10 text-[var(--t-orange)]' : 'bg-green-400/10 text-green-400'}`}>
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <div className="text-xs font-black uppercase italic tracking-tighter">{label}</div>
                    <div className="text-[9px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">{status}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-lg font-black font-mono italic text-[var(--t-orange)]">{amount}</div>
            </div>
        </div>
    );
}

