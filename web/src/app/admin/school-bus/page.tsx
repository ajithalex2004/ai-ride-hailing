"use client";

import React, { useState } from 'react';
import {
    Bus,
    Map as MapIcon,
    Users,
    ShieldCheck,
    Clock,
    Navigation,
    Bell,
    QrCode,
    AlertTriangle,
    TrendingUp,
    School,
    UserCheck
} from 'lucide-react';

export default function SchoolBusDashboard() {
    const [activeTab, setActiveTab] = useState('FLEET');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-white p-8 selection:bg-[var(--t-accent)]/30" style={{fontFamily:"var(--font-sans)"}}>
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--t-accent)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t-text-muted)]">School_Transport_IQ_V1.1</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white">CAMPUS_COMMUTE_HQ</h1>
                </div>

                <div className="flex gap-4">
                    <SchoolProfile name="Horizon International" zone="DOWNTOWN-1" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 mb-12 border-b border-[var(--t-border)]">
                <NavTab active={activeTab === 'FLEET'} onClick={() => setActiveTab('FLEET')} label="LIVE_FLEET" />
                <NavTab active={activeTab === 'ROUTES'} onClick={() => setActiveTab('ROUTES')} label="FIXED_ROUTES" />
                <NavTab active={activeTab === 'STUDENTS'} onClick={() => setActiveTab('STUDENTS')} label="STUDENT_PORTFOLIO" />
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Main Operations Map/List */}
                <div className="col-span-12 lg:col-span-8 space-y-8">

                    {activeTab === 'FLEET' && (
                        <div className="space-y-8">
                            <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] h-[500px] relative overflow-hidden group shadow-2xl">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.3,25.2,12/1000x800?access_token=mock')] bg-cover grayscale" />

                                {/* Live Bus Markers */}
                                <BusMarker lat="40%" lng="30%" id="BUS-102" status="ON_ROUTE" passengers="32/40" />
                                <BusMarker lat="60%" lng="70%" id="BUS-088" status="AT_STOP" passengers="14/40" warning />

                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="bg-black/90 backdrop-blur-3xl border border-[var(--t-border)] p-8 rounded-[32px] flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-[var(--t-accent)]/10 rounded-2xl text-[var(--t-cyan)]">
                                                <Navigation size={32} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-white tracking-widest mb-1">Morning_Shift_Active</div>
                                                <div className="text-sm font-bold text-[var(--t-text-muted)] uppercase italic text-[var(--t-cyan)]">14/15 Buses En-Route | 2.4m Avg ETA Delay</div>
                                            </div>
                                        </div>
                                        <button className="px-8 py-4 bg-[var(--t-accent)] text-black text-[12px] font-black uppercase italic rounded-2xl hover:scale-105 transition-all shadow-lg shadow-neon-blue/20">Expand_Map_Ops</button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <ServicePanel title="Attendance_Live_Feed" icon={<UserCheck size={16} />}>
                                    <AttendanceEntry student="Omar Ali" bus="B-102" time="07:44" status="BOARDED" />
                                    <AttendanceEntry student="Sarah Khan" bus="B-088" time="07:42" status="BOARDED" />
                                    <AttendanceEntry student="Ken Tanaka" bus="B-114" time="07:40" status="DROPPED" />
                                </ServicePanel>

                                <ServicePanel title="Route_Congestion_Alerts" icon={<AlertTriangle size={16} />}>
                                    <CongestionCard route="Route-X4" delay="12m" reason="Road Closure near E11" />
                                    <CongestionCard route="Route-D2" delay="4m" reason="Minor Congestion" />
                                </ServicePanel>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ROUTES' && (
                        <div className="grid grid-cols-2 gap-6">
                            <RouteCard id="R-102" name="Downtown Express" stops={12} students={44} capacity="92%" />
                            <RouteCard id="R-088" name="Marina Shuttle" stops={8} students={35} capacity="72%" />
                            <RouteCard id="R-114" name="Jumeirah Loop" stops={15} students={22} capacity="45%" warn />
                            <RouteItem id="R-NEW" name="Add New Route" isAction />
                        </div>
                    )}

                </div>

                {/* Right: Parent Intelligence & AI Analytics */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-8">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-[11px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]">PARENT_IQ_TRACKER</h3>
                            <Bell size={18} className="text-[var(--t-cyan)]" />
                        </div>
                        <div className="space-y-6">
                            <ParentStatusWidget parent="Mr. Al Mansoori" child="Aisha" bus="B-102" status="ETA 3m" />
                            <ParentStatusWidget parent="Dr. Smith" child="James" bus="B-088" status="BOARDED" active />
                        </div>
                    </div>

                    <div className="bg-[var(--t-accent)]/5 border border-[var(--t-cyan)]/20 p-8 rounded-[40px]">
                        <div className="text-[10px] font-black uppercase text-white tracking-[0.2em] mb-6">AI_Absentee_Prediction</div>
                        <div className="text-5xl font-black italic tracking-tighter text-[var(--t-cyan)] mb-4">12 <span className="text-lg text-white/40">Expected</span></div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--t-accent)] shadow-[0_0_20px_rgba(0,163,255,0.6)]" style={{ width: '45%' }} />
                        </div>
                        <div className="mt-6 text-[10px] font-bold text-[var(--t-text-muted)] uppercase italic">
                            Based on weather patterns + historical Monday trends.
                        </div>
                    </div>

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[40px] p-8">
                        <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] mb-10 tracking-[0.3em]">SAFETY_VITALS</h3>
                        <div className="space-y-6">
                            <SafetyMetric label="Driver Fatigue" value="LOW" status="HEALTHY" />
                            <SafetyMetric label="Route Adherence" value="98%" status="HEALTHY" />
                            <SafetyMetric label="Speed Compliance" value="100%" status="HEALTHY" />
                        </div>
                    </div>

                    <button className="w-full py-6 bg-white text-black text-[12px] font-black uppercase italic rounded-3xl hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-95">Generate_Fleet_Invoices</button>
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

function SchoolProfile({ name, zone }: any) {
    return (
        <div className="flex bg-[var(--t-surface)] border border-[var(--t-border)] px-6 py-4 rounded-3xl items-center gap-6">
            <div className="flex items-center gap-3">
                <School size={18} className="text-[var(--t-cyan)]" />
                <div className="text-sm font-black tracking-tight">{name}</div>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div>
                <div className="text-[8px] font-black uppercase text-[var(--t-text-muted)] tracking-widest mb-0.5">Admin_Zone</div>
                <div className="text-[10px] font-black text-white italic">{zone}</div>
            </div>
        </div>
    );
}

function BusMarker({ lat, lng, id, status, passengers, warning }: any) {
    return (
        <div className="absolute group cursor-pointer" style={{ top: lat, left: lng }}>
            <div className={`w-8 h-8 rounded-full ${warning ? 'bg-red-500/20' : 'bg-[var(--t-accent)]/20'} animate-ping absolute -inset-2`} />
            <div className={`w-4 h-4 rounded-full border-2 border-white/20 relative z-10 ${warning ? 'bg-red-500' : 'bg-[var(--t-accent)]'} shadow-[0_0_20px_rgba(255,255,255,0.2)]`} />
            <div className="absolute left-6 top-0 opacity-0 group-hover:opacity-100 transition-all px-3 py-2 bg-black/80 backdrop-blur-xl border border-[var(--t-border)] rounded-lg text-[9px] font-black tracking-widest whitespace-nowrap italic">
                <div>{id}</div>
                <div className="text-[7px] text-[var(--t-text-muted)] uppercase mt-1">Status: {status}</div>
                <div className="text-[7px] text-white/60 uppercase">Load: {passengers}</div>
            </div>
        </div>
    );
}

function ServicePanel({ title, icon, children }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-8 rounded-[32px]">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.3em]">{title}</h3>
                <div className="text-[var(--t-text-muted)]">{icon}</div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function AttendanceEntry({ student, bus, time, status }: any) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${status === 'BOARDED' ? 'bg-green-400/10 text-green-400' : 'bg-[var(--t-accent)]/10 text-[var(--t-cyan)]'}`}>
                    <UserCheck size={14} />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase italic text-white">{student}</div>
                    <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">Bus {bus}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-[10px] font-black font-mono text-white/40">{time}</div>
                <div className={`text-[7px] font-black uppercase tracking-widest mt-1 ${status === 'BOARDED' ? 'text-green-400' : 'text-[var(--t-cyan)]'}`}>{status}</div>
            </div>
        </div>
    );
}

function CongestionCard({ route, delay, reason }: any) {
    return (
        <div className="p-4 bg-red-400/5 border border-red-400/10 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-red-400 tracking-tighter italic">{route}</span>
                <span className="text-[10px] font-black font-mono text-red-400">+{delay}</span>
            </div>
            <p className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest leading-relaxed">{reason}</p>
        </div>
    );
}

function RouteCard({ id, name, stops, students, capacity, warn }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-8 rounded-[32px] group hover:border-[var(--t-border)] transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-8">
                <div className={`p-3 rounded-2xl ${warn ? 'bg-red-400/10 text-red-400' : 'bg-[var(--t-accent)]/10 text-[var(--t-cyan)]'}`}>
                    <Bus size={20} />
                </div>
                <div className="text-[10px] font-black font-mono text-white/20 italic">{id}</div>
            </div>
            <div className="text-[11px] font-black uppercase text-white tracking-widest mb-1 italic">{name}</div>
            <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase tracking-[0.2em] mb-4">{stops} Stops | {students} Assigned</div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${warn ? 'bg-red-400' : 'bg-[var(--t-accent)]'}`} style={{ width: capacity }} />
            </div>
            <div className="mt-4 text-[9px] font-black text-right text-[var(--t-text-muted)] uppercase tracking-widest">Load: {capacity}</div>
        </div>
    );
}

function RouteItem({ id, name, isAction }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] border-dashed p-8 rounded-[32px] flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all text-[var(--t-text-muted)] hover:text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <MapIcon size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{name}</span>
            </div>
        </div>
    );
}

function ParentStatusWidget({ parent, child, bus, status, active }: any) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${active ? 'bg-[var(--t-accent)]/10 text-[var(--t-cyan)]' : 'bg-white/5 text-[var(--t-text-muted)]'}`}>
                    <Users size={14} />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase tracking-tighter text-white italic">{child}</div>
                    <div className="text-[8px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">{parent}</div>
                </div>
            </div>
            <div className={`text-[9px] font-black uppercase italic px-3 py-1 rounded-lg ${active ? 'bg-[var(--t-accent)]/10 text-[var(--t-cyan)]' : 'bg-white/5 text-[var(--t-text-muted)]'}`}>
                {status}
            </div>
        </div>
    );
}

function SafetyMetric({ label, value, status }: any) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <ShieldCheck size={14} className="text-[var(--t-text-muted)]" />
                <span className="text-[10px] font-black uppercase text-white tracking-widest">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black font-mono italic">{value}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
            </div>
        </div>
    );
}

