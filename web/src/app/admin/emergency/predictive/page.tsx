"use client";

import React, { useState } from 'react';
import {
    Brain,
    Map as MapIcon,
    CloudRain,
    Navigation,
    Zap,
    Activity,
    TrendingUp,
    Wind,
    Thermometer,
    AlertTriangle,
    MoveUp,
    Target
} from 'lucide-react';

export default function PredictiveEmergencyDashboard() {
    const [riskLevel, setRiskLevel] = useState('HIGH');

    return (
        <div className="min-h-screen bg-[#060608] text-white p-8 font-sans selection:bg-neon-blue/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">AI_Predictive_Oracle_V2</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white">PREDICTIVE_EMERGENCY_HQ</h1>
                </div>

                <div className="flex gap-4">
                    <WeatherWidget temp={28} condition="Light Fog" risk={1.45} />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Predictive Risk Map */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-2 h-[600px] relative overflow-hidden group shadow-2xl">
                        {/* Map Render Mock */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.3,25.2,12/1000x800?access_token=mock')] bg-cover grayscale" />

                        {/* Hotspot Polygons (Mock) */}
                        <div className="absolute top-[30%] left-[40%] w-48 h-48 bg-red-500/10 border border-red-500/40 rounded-full animate-pulse flex items-center justify-center">
                            <div className="text-[10px] font-black uppercase text-red-500 tracking-widest">High_Risk_Hotspot</div>
                        </div>

                        {/* Repositioning HUD */}
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="bg-black/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[32px] flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-neon-blue/10 rounded-2xl text-neon-blue">
                                        <Brain size={32} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase text-white tracking-widest mb-1">Ambulance_Repositioning_AI</div>
                                        <div className="text-sm font-bold text-muted-grey uppercase italic">3 Idle Units → High-Risk Move-Up Suggested</div>
                                    </div>
                                </div>
                                <button className="px-8 py-4 bg-neon-blue text-black text-[12px] font-black uppercase italic rounded-2xl hover:scale-105 transition-all shadow-lg shadow-neon-blue/20">Execute_Shift_Strategy</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em]">Demand_Forecast_Next_4H</h3>
                                <TrendingUp size={16} className="text-green-400" />
                            </div>
                            <div className="space-y-6">
                                <ForecastBar label="Downtown-1" current={4} predicted={8} peak />
                                <ForecastBar label="Marina-JBR" current={2} predicted={3} />
                                <ForecastBar label="Business Bay" current={1} predicted={5} warn />
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em]">Move-Up_Strategy</h3>
                                <Navigation size={16} className="text-neon-blue" />
                            </div>
                            <div className="space-y-4">
                                <MoveUpItem unit="AMB-102" current="Station 4" target="SZR Exit 44" eta="4m" />
                                <MoveUpItem unit="AMB-088" current="Staton 1" target="Financial Center" eta="6m" />
                                <MoveUpItem unit="AMB-114" current="Marina" target="Palm West" eta="3m" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Weather & City Preparedness */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[12px] font-black uppercase text-muted-grey tracking-[0.4em]">WEATHER_RISK_MATIX</h3>
                            <CloudRain size={20} className="text-neon-blue" />
                        </div>
                        <div className="space-y-8">
                            <WeatherStat icon={<Thermometer size={14} />} label="Ground Temp" value="32°C" stat="NORMAL" />
                            <WeatherStat icon={<Wind size={14} />} label="Hub Visibility" value="1.2km" stat="CRITICAL" />
                            <WeatherStat icon={<Activity size={14} />} label="Road Friction" value="0.74" stat="LOW" />

                            <div className="pt-8 border-t border-white/5">
                                <div className="text-[10px] font-black uppercase italic text-muted-grey mb-4 tracking-widest">Recommended_Action</div>
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                    <p className="text-[11px] font-black text-red-500 uppercase leading-relaxed tracking-tight">Active Low Visibility Alert. Suggest 60km/h variable limit on SZR and E11 corridors.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neon-blue/5 border border-neon-blue/20 p-8 rounded-[40px]">
                        <div className="text-[10px] font-black uppercase text-white tracking-[0.2em] mb-6">City_Preparedness_Index</div>
                        <div className="text-6xl font-black italic tracking-tighter text-neon-blue mb-4">88%</div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-neon-blue shadow-[0_0_20px_rgba(0,163,255,0.6)]" style={{ width: '88%' }} />
                        </div>
                        <div className="mt-6 flex justify-between items-center text-[10px] font-bold text-muted-grey uppercase italic">
                            <span>Operational Reach</span>
                            <span className="text-white">+12% vs Manual</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function WeatherWidget({ temp, condition, risk }: any) {
    return (
        <div className="bg-white/[0.03] border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-6">
            <div className="flex items-center gap-3">
                <CloudRain size={18} className="text-neon-blue" />
                <div className="text-xl font-black font-mono tracking-tighter">{temp}°C</div>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div>
                <div className="text-[8px] font-black uppercase text-muted-grey tracking-widest mb-0.5">Risk_Multiplier</div>
                <div className="text-sm font-black text-red-500 font-mono tracking-tighter">{risk}x</div>
            </div>
        </div>
    );
}

function ForecastBar({ label, current, predicted, peak, warn }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-tight italic">{label}</span>
                <span className="text-[10px] font-mono font-black text-white/40">INC: {current} → <span className={warn ? 'text-red-500' : 'text-neon-blue'}>{predicted}</span></span>
            </div>
            <div className="relative w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-white/20" style={{ width: `${(current / 10) * 100}%` }} />
                <div className={`h-full ${warn ? 'bg-red-500' : 'bg-neon-blue'} opacity-40`} style={{ width: `${(predicted / 10) * 100}%` }} />
            </div>
        </div>
    );
}

function MoveUpItem({ unit, current, target, eta }: any) {
    return (
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/[0.08] transition-all cursor-pointer border border-transparent hover:border-white/10">
            <div className="p-2 bg-neon-blue/10 rounded-xl text-neon-blue">
                <MoveUp size={16} />
            </div>
            <div className="flex-1">
                <div className="text-[10px] font-black uppercase italic tracking-tighter mb-0.5">{unit}</div>
                <div className="text-[8px] font-bold text-muted-grey uppercase tracking-widest">{current} → {target}</div>
            </div>
            <div className="text-[10px] font-black font-mono italic text-neon-blue">{eta}</div>
        </div>
    );
}

function WeatherStat({ icon, label, value, stat }: any) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-muted-grey">
                    {icon}
                </div>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-black">{value}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${stat === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-green-400'}`} />
            </div>
        </div>
    );
}
