"use client";

import React, { useState } from 'react';
import {
    Car,
    Fuel,
    Settings2,
    TrendingDown,
    Activity,
    AlertOctagon,
    ChevronRight,
    Gauge,
    Tool,
    Download,
    Search,
    Zap
} from 'lucide-react';

export default function FleetAdminPage() {
    const [selectedAsset, setSelectedAsset] = useState<any>(null);

    return (
        <div className="min-h-screen bg-[#060608] text-white p-8 font-sans selection:bg-neon-blue/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-pulse-orange animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Fleet_Asset_Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic">ASSET_LIFECYCLE_CORE</h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white/[0.03] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[8px] font-bold text-muted-grey uppercase">Fleet_Health_Index</div>
                            <div className="text-xl font-mono font-black text-green-400">92%</div>
                        </div>
                        <Activity size={24} className="text-green-400" />
                    </div>
                    <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 hover:bg-neon-blue hover:text-black transition-all">
                        <Search size={18} strokeWidth={3} />
                        SCAN_VIN_DATA
                    </button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left Stats Console */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Lifecycle_Summary</h3>

                        <div className="space-y-8">
                            <StatItem label="Active_Procurement" value="$2.4M" sub="12 Vehicles pending" icon={Car} />
                            <StatItem label="Averge_Depreciation" value="14.2%" sub="Year-over-year avg" icon={TrendingDown} color="text-pulse-orange" />
                            <StatItem label="Fuel_Anomaly_Alerts" value="04" sub="Last 24 hours" icon={AlertOctagon} color="text-red-500" />
                        </div>

                        <div className="mt-12 p-6 bg-neon-blue/5 border border-neon-blue/10 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2 text-neon-blue">
                                <Zap size={14} />
                                <span className="text-[9px] font-black uppercase">Resale_Valuation_AI</span>
                            </div>
                            <div className="text-xs text-muted-grey leading-relaxed">
                                Market trends indicate a <span className="text-white font-bold">5.2% increase</span> in resale value for 2024 Toyota HiAce models in the MENA region.
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Critical_Spare_Parts</h3>
                        <div className="space-y-4">
                            <PartHealth label="Brake Pads (DXB-442)" health={12} status="Replace" />
                            <PartHealth label="Front Left Tire (DXB-881)" health={28} status="Warning" />
                            <PartHealth label="Timing Belt (DXB-102)" health={88} status="Good" />
                        </div>
                    </div>
                </div>

                {/* Right Asset List & Details */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-black italic tracking-tight uppercase">Active_Asset_Inventory</h2>
                            <button className="text-muted-grey hover:text-white transition-colors">
                                <Download size={20} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[9px] font-black text-muted-grey uppercase tracking-widest border-b border-white/5">
                                        <th className="p-8">VEHICLE_VIN</th>
                                        <th className="p-8">MODEL_CLASS</th>
                                        <th className="p-8">FUEL_EFFICIENCY</th>
                                        <th className="p-8">BOOK_VALUE</th>
                                        <th className="p-8">STATUS</th>
                                        <th className="p-8"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AssetRow vin="7GZXX1...442" model="TOYOTA HIACE" fuel="12.4 L/100" value="$28,400" status="Active" health={94} />
                                    <AssetRow vin="8HBYY2...881" model="MERCEDES SPRINTER" fuel="15.8 L/100" value="$45,200" status="Maint" health={42} />
                                    <AssetRow vin="1JKLL3...102" model="FORD TRANSIT" fuel="11.2 L/100" value="$31,000" status="Active" health={82} />
                                    <AssetRow vin="5POQQ4...556" model="TOYOTA HIACE" fuel="22.1 L/100" value="$24,900" status="Active" health={76} highlight />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Optimization Alert */}
                    <div className="bg-pulse-orange/5 border border-pulse-orange/20 p-8 rounded-3xl flex items-center justify-between">
                        <div className="flex gap-6 items-center">
                            <div className="p-4 bg-pulse-orange/10 rounded-2xl text-pulse-orange">
                                <Gauge size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black italic tracking-tight mb-1">DRIVER_VEHICLE_OPTIMIZATION</h4>
                                <p className="text-xs text-muted-grey">Assign <span className="text-white font-bold text-xs underline">Top_Gun_Driver #442</span> to Mercedes DXB-881 for 18% lower brake wear forecast.</p>
                            </div>
                        </div>
                        <button className="bg-pulse-orange text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase">ACTIVATE_OPTIMIZATION</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatItem({ label, value, sub, icon: Icon, color = "text-neon-blue" }: any) {
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

function PartHealth({ label, health, status }: any) {
    const isRed = health < 20;
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-white uppercase">{label}</span>
                <span className={`text-[8px] font-black uppercase ${isRed ? 'text-red-500' : 'text-muted-grey'}`}>{status}</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${isRed ? 'bg-red-500' : health < 40 ? 'bg-pulse-orange' : 'bg-neon-blue'}`} style={{ width: `${health}%` }} />
            </div>
        </div>
    );
}

function AssetRow({ vin, model, fuel, value, status, health, highlight = false }: any) {
    return (
        <tr className={`border-b border-white/5 group hover:bg-white/[0.01] transition-all ${highlight ? 'bg-red-500/[0.03]' : ''}`}>
            <td className="p-8">
                <div className="text-[10px] font-mono font-bold text-muted-grey mb-1">{vin}</div>
                <div className="text-xs font-black text-white italic tracking-tighter">{model}</div>
            </td>
            <td className="p-8">
                <span className="text-[9px] px-2 py-1 bg-white/5 rounded-md text-white font-black">VAN_HEAVY</span>
            </td>
            <td className="p-8">
                <div className={`text-xs font-mono font-black ${highlight ? 'text-red-500 animate-pulse' : 'text-neon-blue'}`}>{fuel}</div>
                {highlight && <div className="text-[7px] font-black text-red-500 uppercase mt-1">AnomalyDetected</div>}
            </td>
            <td className="p-8 font-mono font-black text-xs">{value}</td>
            <td className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400" style={{ width: `${health}%` }} />
                    </div>
                    <span className="text-[8px] font-black text-muted-grey uppercase">{health}%</span>
                </div>
            </td>
            <td className="p-8 text-right">
                <ChevronRight size={16} className="text-muted-grey group-hover:text-neon-blue transition-colors cursor-pointer" />
            </td>
        </tr>
    );
}
