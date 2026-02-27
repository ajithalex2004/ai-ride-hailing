"use client";

import React, { useState } from 'react';
import {
    Users,
    Crown,
    CreditCard,
    MapPin,
    TrendingDown,
    Sparkles,
    Search,
    ChevronRight,
    Filter,
    Download,
    AlertCircle,
    BarChart2,
    PieChart as PieChartIcon
} from 'lucide-react';

export default function CustomerIntelligencePage() {
    const [activeTab, setActiveTab] = useState('segments');

    return (
        <div className="min-h-screen bg-[#060608] text-white p-8 font-sans selection:bg-neon-blue/30">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-pulse-orange animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-grey">Customer_Intelligence_Hub</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">PASSENGER_RELIABILITY_OS</h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white/[0.03] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[8px] font-bold text-muted-grey uppercase">Active_Subscriptions</div>
                            <div className="text-xl font-mono font-black text-neon-blue">842</div>
                        </div>
                        <CreditCard size={24} className="text-neon-blue" />
                    </div>
                    <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 hover:bg-neon-blue transition-all">
                        <Search size={18} strokeWidth={3} />
                        SCAN_LEAD_DATA
                    </button>
                </div>
            </div>

            {/* Stats Quick Grid */}
            <div className="grid grid-cols-4 gap-6 mb-12">
                <InsightStat label="Total_Passengers" value="122.4K" sub="+4.2% Growth" icon={Users} />
                <InsightStat label="Loyalty_Redemption_Rate" value="34.2%" sub="High Velocity" icon={Crown} color="text-yellow-400" />
                <InsightStat label="Subscription_MRR" value="$184K" sub="92% Retention" icon={TrendingDown} />
                <InsightStat label="Avg_Personalization_Score" value="0.88" sub="AI Confidence" icon={Sparkles} color="text-pulse-orange" />
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Segmentation & Loyalty */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-[450px] flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 blur-[100px] rounded-full" />

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase text-muted-grey tracking-[0.3em] mb-1">Loyalty_Tier_Distribution</h3>
                                <div className="text-xs font-black italic text-white/40 tracking-widest uppercase italic">Tiered_Membership_Active_Sessions</div>
                            </div>
                            <div className="flex gap-2">
                                <TabButton active label="Tiers" />
                                <TabButton label="Spending" />
                                <TabButton label="Retention" />
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-4 items-end gap-6 relative z-10 px-8 mb-4">
                            <TierBar label="Platinum" value="12%" color="bg-white" height="30%" />
                            <TierBar label="Gold" value="28%" color="bg-yellow-400" height="55%" />
                            <TierBar label="Silver" value="35%" color="bg-slate-400" height="75%" />
                            <TierBar label="Bronze" value="25%" color="bg-orange-600" height="50%" />
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <h2 className="text-xl font-black italic tracking-tight uppercase">Predictive_Route_Personalization</h2>
                            <Sparkles size={18} className="text-pulse-orange animate-pulse" />
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase text-muted-grey tracking-widest">Automation_Triggers</h4>
                                <PersonalizationItem label="Favorite Route Automation" count="4.8K Users" status="ACTIVE" />
                                <PersonalizationItem label="Pre-filled Commute Anchor" count="12.2K Users" status="ACTIVE" />
                                <PersonalizationItem label="Time-based Destination Sug." count="9.1K Users" status="OPTIMIZING" />
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center text-center">
                                <MapPin className="text-neon-blue mx-auto mb-4" size={32} />
                                <div className="text-lg font-black font-mono leading-none mb-2 italic">84.2%</div>
                                <div className="text-[9px] font-bold text-muted-grey uppercase leading-relaxed">Prediction Accuracy for<br />"Morning_Commute" Segments</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Subscriptions & Risks */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-[10px] font-black uppercase text-muted-grey mb-8 tracking-[0.3em]">Subscription_Profiles</h3>
                        <div className="space-y-4">
                            <SubProfile label="Monthly_Commute_Pro" price="AED 499" count="542" />
                            <SubProfile label="Limo_Circle_VIP" price="AED 1299" count="128" />
                            <SubProfile label="Safety_First_Family" price="AED 299" count="172" />
                        </div>
                        <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">MANAGE_PLAN_TIERS</button>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3 text-red-500">
                                <AlertCircle size={18} />
                                <h4 className="text-sm font-black italic tracking-tight uppercase">Churn_Risk_Detection</h4>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-muted-grey leading-relaxed mb-6 italic"> AI predicts <span className="text-white font-bold">142 "Gold" members</span> are at risk of churning due to service delays in Zone_4. </p>
                        <button className="w-full py-4 bg-red-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all">DEPOLY_RETENTION_OFFER</button>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl group cursor-pointer hover:bg-white/5 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/[0.03] rounded-xl text-yellow-400">
                                <Crown size={20} />
                            </div>
                            <div className="text-[10px] font-black text-white italic tracking-tighter uppercase px-3 py-1 bg-yellow-400/10 rounded-full">VIP_ECHO_ENABLED</div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2">Priority_Dispatch_Monitor</div>
                        <div className="text-[8px] text-muted-grey uppercase leading-relaxed">VIP members receiving <span className="text-white font-bold">-2.4m ETA priority</span> on average across the platform.</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function InsightStat({ label, value, sub, icon: Icon, color = "text-white" }: any) {
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-white/[0.03] rounded-xl group-hover:bg-white/5 transition-colors ${color}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div className="text-[9px] font-bold text-muted-grey uppercase mb-1 tracking-widest">{label}</div>
            <div className="text-2xl font-black font-mono tracking-tighter italic">{value}</div>
            <div className="text-[9px] font-medium text-muted-grey mt-2 uppercase">{sub}</div>
        </div>
    );
}

function TierBar({ label, value, color, height }: any) {
    return (
        <div className="flex flex-col items-center gap-4 group">
            <div className="text-[10px] font-black font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{value}</div>
            <div className="w-full relative">
                <div className={`w-full ${color} rounded-t-lg transition-all duration-700 ease-out`} style={{ height }} />
                <div className="absolute inset-x-0 -bottom-8 text-[8px] font-black text-muted-grey uppercase text-center tracking-widest">{label}</div>
            </div>
        </div>
    );
}

function PersonalizationItem({ label, count, status }: any) {
    return (
        <div className="flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5">
            <div>
                <div className="text-[10px] font-black text-white italic tracking-tight uppercase mb-1">{label}</div>
                <div className="text-[8px] font-bold text-muted-grey uppercase">{count}</div>
            </div>
            <div className={`text-[8px] font-black px-2 py-0.5 rounded-md border ${status === 'ACTIVE' ? 'border-green-500/40 text-green-400' : 'border-pulse-orange/40 text-pulse-orange'
                }`}>
                {status}
            </div>
        </div>
    );
}

function SubProfile({ label, price, count }: any) {
    return (
        <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5 group hover:border-neon-blue/40 transition-all cursor-pointer">
            <div>
                <div className="text-[10px] font-black text-white italic uppercase">{label}</div>
                <div className="text-[8px] font-bold text-muted-grey uppercase">{count} Profiles Active</div>
            </div>
            <div className="text-xs font-black font-mono text-neon-blue">{price}</div>
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
