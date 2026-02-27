"use client";

import React, { useState } from 'react';
import {
    Ambulance,
    Hospital,
    Activity,
    Map as MapIcon,
    AlertTriangle,
    Search,
    ChevronRight,
    Clock,
    Users,
    Wind,
    PlusCircle,
    Truck,
    HeartPulse,
    Route
} from 'lucide-react';

export default function EmergencyCommandPage() {
    const [activeIncident, setActiveIncident] = useState('P1_882');

    return (
        <div className="min-h-screen bg-[#060608] text-white p-8 font-sans selection:bg-red-500/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Emergency_Response_OS</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">COMMAND_CENTER_DELTA</h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white/[0.03] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[8px] font-bold text-muted-grey uppercase">Ambulance_Availability</div>
                            <div className="text-xl font-mono font-black text-green-400">84%</div>
                        </div>
                        <Ambulance size={24} className="text-green-400" />
                    </div>
                    <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20">
                        <PlusCircle size={18} strokeWidth={3} />
                        INITIATE_P1_DISPATCH
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Live Map & Fleet Status */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-[550px] relative overflow-hidden group">
                        {/* Map Mockup Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.3,25.2,12/800x600?access_token=mock')] bg-cover" />
                        <div className="absolute top-8 left-8 z-10">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl inline-block">
                                <div className="text-[8px] font-black uppercase text-muted-grey mb-2 tracking-widest italic">Live_Unit_Display</div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-[10px] font-black uppercase tracking-tight">ALS_Active (12)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-pulse-orange" />
                                        <span className="text-[10px] font-black uppercase tracking-tight">En_Route (4)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-8 right-8 z-10 flex gap-4">
                            <button className="bg-black/80 hover:bg-white/10 border border-white/10 p-4 rounded-2xl active:scale-95 transition-all">
                                <MapIcon size={20} className="text-neon-blue" />
                            </button>
                            <button className="bg-black/80 hover:bg-white/10 border border-white/10 p-4 rounded-2xl active:scale-95 transition-all">
                                <Users size={20} className="text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em]">Hospital_Capacity_AI</h3>
                                <Clock size={16} className="text-pulse-orange animate-pulse" />
                            </div>
                            <div className="space-y-4">
                                <HospitalItem name="Rashid Hospital" capacity="92%" wait="45m" status="FULL" />
                                <HospitalItem name="Dubai Hospital" capacity="64%" wait="12m" status="OPT" />
                                <HospitalItem name="Zulekha Med" capacity="42%" wait="8m" status="OPT" />
                            </div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em]">Traffic_Impact_Overlay</h3>
                                <Route size={16} className="text-neon-blue" />
                            </div>
                            <div className="space-y-4 text-center py-6">
                                <div className="text-3xl font-black font-mono italic tracking-tighter">+14m</div>
                                <div className="text-[8px] font-bold text-muted-grey uppercase leading-relaxed tracking-widest">Congestion Delay on E11 North<br />Rerouting Incident #P1_882</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Active Incidents & Transfers */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Priority_Incident_Stream</h3>
                        <div className="space-y-4">
                            <IncidentCard id="P1_882" type="Cardiac Arrest" eta="4m" priority="P1" status="DISPATCHED" />
                            <IncidentCard id="P2_901" type="Severe Trauma" eta="12m" priority="P2" status="PENDING" />
                            <IncidentCard id="P3_844" type="Stable Transfer" eta="28m" priority="P3" status="SCHEDULED" />
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-[350px] flex flex-col justify-between">
                        <div>
                            <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Medical_Transfer_Pulse</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <HeartPulse size={18} className="text-pulse-orange" />
                                        <div>
                                            <div className="text-[10px] font-black uppercase italic">Dialysis_Routine</div>
                                            <div className="text-[8px] font-bold text-muted-grey uppercase">12 Trips Processed Today</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-muted-grey" />
                                </div>
                                <div className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-3 text-neon-blue">
                                        <Truck size={18} />
                                        <div>
                                            <div className="text-[10px] font-black uppercase italic">Inter-Hospital</div>
                                            <div className="text-[8px] font-bold text-muted-grey uppercase">4 Moves in Progress</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all italic">Transfer_Optimizations_View</button>
                    </div>

                    <div className="bg-pulse-orange/5 border border-pulse-orange/20 p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-pulse-orange/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                <AlertTriangle size={20} className="animate-bounce" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-tight">Hospital_Reroute_Alert</div>
                                <div className="text-[8px] text-muted-grey uppercase">Rashid ER Full - AI Rerouting Enabled</div>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-muted-grey group-hover:text-red-500 transition-all" />
                    </div>
                </div>

            </div>
        </div>
    );
}

function HospitalItem({ name, capacity, wait, status }: any) {
    return (
        <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5">
            <div>
                <div className="text-[10px] font-black text-white italic tracking-tight uppercase mb-1">{name}</div>
                <div className="text-[8px] font-black text-muted-grey uppercase">Wait Time: <span className="text-white">{wait}</span></div>
            </div>
            <div className="text-right">
                <div className="text-xs font-black font-mono text-white leading-none mb-1">{capacity}</div>
                <div className={`text-[7px] font-black px-1.5 py-0.5 rounded-sm border ${status === 'FULL' ? 'bg-red-500/10 border-red-500/40 text-red-500' : 'bg-green-500/10 border-green-500/40 text-green-400'
                    }`}>{status}</div>
            </div>
        </div>
    );
}

function IncidentCard({ id, type, eta, priority, status }: any) {
    return (
        <div className={`p-5 rounded-2xl border ${priority === 'P1' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.03] border-white/10'
            } group hover:border-white/30 transition-all cursor-pointer relative overflow-hidden`}>
            {priority === 'P1' && <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-3xl pointer-events-none" />}
            <div className="flex justify-between items-start mb-4">
                <div className={`text-[10px] font-black uppercase tracking-widest ${priority === 'P1' ? 'text-red-500' : 'text-neon-blue'}`}>{priority} INCIDENT</div>
                <div className="text-[8px] font-bold text-muted-grey uppercase">{id}</div>
            </div>
            <div className="text-lg font-black italic uppercase tracking-tighter mb-4">{type}</div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-muted-grey" />
                    <span className="text-xs font-mono font-black">{eta}</span>
                </div>
                <div className="text-[8px] font-black px-2 py-0.5 border border-white/20 rounded-md uppercase tracking-widest">{status}</div>
            </div>
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
