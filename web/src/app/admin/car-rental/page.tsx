"use client";

import React, { useState } from 'react';
import {
    Car,
    Calendar,
    FileText,
    Shield,
    Activity,
    DollarSign,
    Key,
    AlertCircle,
    TrendingUp,
    Search,
    CheckCircle2,
    Clock,
    ClipboardList
} from 'lucide-react';

export default function CarRentalDashboard() {
    const [activeTab, setActiveTab] = useState('FLEET');

    return (
        <div className="min-h-screen bg-[var(--t-bg)] text-[var(--t-text)] p-6 selection:bg-[var(--t-accent)]/30 selection:text-[var(--t-text)]" style={{fontFamily:"var(--font-sans)"}}>
            {/* City-Scale Header */}
            <div className="flex justify-between items-end mb-10 px-4">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--t-accent)] animate-pulse shadow-[0_0_10px_var(--t-accent)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--t-text-muted)]">Mobility_Asset_Governance_V3</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic uppercase text-[var(--t-text)] drop-shadow-2xl" style={{fontFamily:"var(--font-heading)",letterSpacing:"-0.02em"}}>RENTAL_ECOSYSTEM_HQ</h1>
                </div>

                <div className="flex gap-4">
                    <RentalProfile name="Elite Mobility Dubai" tier="Enterprise" />
                </div>
            </div>

            {/* Domain Navigation Rails */}
            <div className="flex gap-8 mb-10 border-b border-[var(--t-border)] px-4 relative">
                <NavRail active={activeTab === 'FLEET'} onClick={() => setActiveTab('FLEET')} label="FLEET_CALENDAR" />
                <NavRail active={activeTab === 'CONTRACTS'} onClick={() => setActiveTab('CONTRACTS')} label="DIGITAL_CONTRACTS" />
                <NavRail active={activeTab === 'MAINTENANCE'} onClick={() => setActiveTab('MAINTENANCE')} label="ASSET_HEALTH" />
                <NavRail active={activeTab === 'CLAIMS'} onClick={() => setActiveTab('CLAIMS')} label="INSURANCE_CLAIMS" />
            </div>

            <div className="grid grid-cols-12 gap-8 px-4">

                {/* Main Operational Control */}
                <div className="col-span-12 lg:col-span-8 space-y-8">

                    {activeTab === 'FLEET' && (
                        <div className="space-y-8">
                            {/* Search & Filter Bar */}
                            <div className="flex gap-4 bg-[var(--t-card)] border border-[var(--t-border)] p-6 rounded-[16px] items-center">
                                <Search className="text-[var(--t-text-muted)]" size={20} />
                                <input className="bg-transparent border-none outline-none text-sm font-bold flex-1 placeholder:text-[var(--t-text-muted)] uppercase" placeholder="Search by Plate, Model, or ID..." />
                                <div className="flex gap-2">
                                    <FilterBadge label="ECONOMY" active />
                                    <FilterBadge label="LUXURY" />
                                    <FilterBadge label="SUV" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <VehicleCard
                                    plate="DUBAI-X-99"
                                    model="Mercedes G-Wagon"
                                    status="RENTED"
                                    utilization={92}
                                    returnDate="Mar 15"
                                    customer="Alex Rivera"
                                />
                                <VehicleCard
                                    plate="DUBAI-S-42"
                                    model="Tesla Model Y"
                                    status="AVAILABLE"
                                    utilization={45}
                                    price="$120/day"
                                />
                                <VehicleCard
                                    plate="DUBAI-M-12"
                                    model="Range Rover Sport"
                                    status="MAINTENANCE"
                                    utilization={78}
                                    issue="Brake Pad Sync"
                                />
                                <ActionCard label="Add New Asset" icon={<Car size={32} />} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'CONTRACTS' && (
                        <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[24px] p-6 space-y-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter" style={{fontFamily:"var(--font-heading)"}}>Active_Digital_Contracts</h2>
                                <FileText size={24} className="text-white/20" />
                            </div>
                            <div className="space-y-4">
                                <ContractItem id="CNT-00421" customer="Sarah Jenkins" product="Long-term Lease" status="SIGNED" date="2026-03-01" />
                                <ContractItem id="CNT-00422" customer="Vertex Corp" product="Fleet Subscription" status="PENDING_SIGN" date="2026-03-02" alert />
                                <ContractItem id="CNT-00423" customer="Kenji Tanaka" product="Daily Rental" status="DEPOSIT_PAID" date="2026-03-02" />
                            </div>
                        </div>
                    )}

                </div>

                {/* Strategic Intelligence Sidebar */}
                <div className="col-span-12 lg:col-span-4 space-y-8">

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[24px] p-6 relative overflow-hidden group">
                        <div className="absolute -top-8 -right-12 w-48 h-48 bg-[var(--t-accent)]/10 blur-[90px] rounded-full group-hover:bg-[var(--t-accent)]/20 transition-all duration-700" />
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[11px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]" style={{fontFamily:"var(--font-heading)"}}>ASSET_LIFECYCLE_AI</h3>
                            <TrendingUp size={18} className="text-[var(--t-cyan)]" />
                        </div>
                        <div className="space-y-12">
                            <LifecycleStat label="Total_Fleet_Value" value="$3.8M" sub="Residual Prediction: -2% YoY" />
                            <div className="p-6 bg-[var(--t-accent)]/5 border border-[var(--t-cyan)]/20 rounded-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <Shield size={16} className="text-[var(--t-cyan)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--t-text)]">Utilization_AI_Forecast</span>
                                </div>
                                <div className="text-4xl font-black italic tracking-tighter text-[var(--t-text)] mb-2">88% <span className="text-[10px] text-[var(--t-cyan)] uppercase">Peak Expected</span></div>
                                <p className="text-[10px] font-bold text-[var(--t-text-muted)] uppercase leading-relaxed tracking-widest">
                                    Increased Demand for SUVs during Ramadan Season Predicted. Add 4 units to Economy Cluster.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--t-card)] border border-[var(--t-border)] rounded-[24px] p-6">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[11px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.4em]" style={{fontFamily:"var(--font-heading)"}}>MAINTENANCE_LOGS</h3>
                            <Activity size={18} className="text-green-400" />
                        </div>
                        <div className="space-y-8">
                            <HealthItem vehicle="Tesla Model Y" mileage="12,400 KM" health={98} />
                            <HealthItem vehicle="Mercedes G-Wagon" mileage="44,210 KM" health={62} warn />
                        </div>
                    </div>

                    <div className="bg-[var(--t-accent)]/10 border border-[var(--t-cyan)]/20 p-6 rounded-[24px] group cursor-pointer hover:bg-[var(--t-accent)]/15 transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-4 bg-[var(--t-accent)]/20 rounded-2xl text-[var(--t-cyan)] animate-pulse">
                                <DollarSign size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-[var(--t-text-muted)]">Monthly_Revenue</span>
                        </div>
                        <div className="text-5xl font-black italic tracking-tighter text-[var(--t-text)] mb-4">$214,500</div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-green-400 italic">
                            <TrendingUp size={16} />
                            <span>+14.2% vs Last Month</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

function NavRail({ active, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`pb-6 px-2 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${active ? 'text-[var(--t-text)] italic' : 'text-white/20 hover:text-white/60'
                }`}>
            {label}
            {active && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--t-accent)] shadow-[0_0_15px_var(--t-accent)]" />}
        </button>
    );
}

function RentalProfile({ name, tier }: any) {
    return (
        <div className="flex bg-[var(--t-surface)] border border-[var(--t-border)] px-8 py-5 rounded-[16px] items-center gap-8 shadow-2xl">
            <div className="flex items-center gap-4">
                <Key size={24} className="text-[var(--t-cyan)]" />
                <div className="text-sm font-black tracking-tighter uppercase italic">{name}</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
                <div className="text-[9px] font-black uppercase text-[var(--t-text-muted)] tracking-widest mb-0.5">Tier_Access</div>
                <div className="text-[11px] font-black text-[var(--t-text)] italic tracking-tighter">{tier}</div>
            </div>
        </div>
    );
}

function FilterBadge({ label, active }: any) {
    return (
        <div className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest cursor-pointer transition-all ${active ? 'bg-[var(--t-accent)] text-black italic' : 'bg-white/5 text-[var(--t-text-muted)] hover:bg-white/10'
            }`}>
            {label}
        </div>
    );
}

function VehicleCard({ plate, model, status, utilization, returnDate, customer, price, issue }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] p-6 rounded-[24px] group hover:border-[var(--t-border)] transition-all cursor-pointer relative overflow-hidden">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <div className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-[0.2em] mb-3">{plate}</div>
                    <div className="text-2xl font-black italic tracking-tighter uppercase text-[var(--t-text)] group-hover:translate-x-1 transition-transform">{model}</div>
                </div>
                <StatusBadge status={status} />
            </div>

            {status === 'RENTED' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-widest">Active_Tenant</span>
                        <span className="text-sm font-black italic">{customer}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-widest">Return_Date</span>
                        <span className="text-sm font-black italic text-[var(--t-cyan)]">{returnDate}</span>
                    </div>
                </div>
            )}

            {status === 'AVAILABLE' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase text-[var(--t-text-muted)] tracking-widest">Daily_Price</span>
                        <span className="text-2xl font-black italic text-[var(--t-text)]">{price}</span>
                    </div>
                    <button className="w-full py-4 bg-white/5 border border-[var(--t-border)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Instant_Reserve</button>
                </div>
            )}

            {status === 'MAINTENANCE' && (
                <div className="p-4 bg-red-400/5 border border-red-400/10 rounded-2xl">
                    <div className="text-[10px] font-black uppercase text-red-400 tracking-tighter mb-2">Issue_Diagnostic</div>
                    <div className="text-[11px] font-bold text-[var(--t-text)] uppercase italic">{issue}</div>
                </div>
            )}

            <div className="mt-10 border-t border-[var(--t-border)] pt-6 flex justify-between items-center">
                <span className="text-[9px] font-black uppercase text-[var(--t-text-muted)] tracking-widest">Historical_Utilization</span>
                <span className="text-[10px] font-black font-mono italic text-white/40" style={{fontFamily:"var(--font-mono)"}}>{utilization}%</span>
            </div>
        </div>
    );
}

function StatusBadge({ status }: any) {
    const colors: any = {
        'AVAILABLE': 'bg-green-400',
        'RENTED': 'bg-[var(--t-accent)]',
        'MAINTENANCE': 'bg-red-400'
    };
    return (
        <div className={`flex items-center gap-3 px-4 py-2 bg-[var(--t-surface)] border border-[var(--t-border)] rounded-xl`}>
            <div className={`w-1.5 h-1.5 rounded-full ${colors[status]}`} />
            <span className="text-[9px] font-black uppercase italic tracking-widest">{status}</span>
        </div>
    );
}

function ActionCard({ label, icon }: any) {
    return (
        <div className="bg-[var(--t-card)] border border-[var(--t-border)] border-dashed rounded-[24px] flex flex-col items-center justify-center gap-6 p-6 cursor-pointer hover:bg-[var(--t-card-hover)] transition-all text-[var(--t-text-muted)] hover:text-[var(--t-text)]">
            <div className="p-6 bg-white/5 rounded-[16px]">
                {icon}
            </div>
            <span className="text-[12px] font-black uppercase tracking-[0.4em]">{label}</span>
        </div>
    );
}

function ContractItem({ id, customer, product, status, date, alert }: any) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-6 rounded-[16px] hover:bg-white/[0.08] transition-all cursor-pointer border border-transparent hover:border-[var(--t-border)]">
            <div className="flex items-center gap-8">
                <div className={`p-4 rounded-2xl ${alert ? 'bg-red-400/10 text-red-400' : 'bg-[var(--t-accent)]/10 text-[var(--t-cyan)]'}`}>
                    <FileText size={24} />
                </div>
                <div>
                    <div className="text-lg font-black italic tracking-tighter uppercase mb-1">{customer}</div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--t-text-muted)] tracking-widest uppercase">
                        <span>{id}</span>
                        <span className="opacity-20">|</span>
                        <span>{product}</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className={`text-[10px] font-black uppercase italic px-4 py-2 rounded-xl mb-2 ${alert ? 'bg-red-400/10 text-red-400' : 'bg-[var(--t-accent)]/10 text-[var(--t-cyan)]'}`}>
                    {status}
                </div>
                <div className="text-[9px] font-mono font-black text-white/20 italic" style={{fontFamily:"var(--font-mono)"}}>{date}</div>
            </div>
        </div>
    );
}

function LifecycleStat({ label, value, sub }: any) {
    return (
        <div className="space-y-4">
            <div className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">{label}</div>
            <div className="text-5xl font-black italic tracking-tighter">{value}</div>
            <div className="text-[10px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest italic">{sub}</div>
        </div>
    );
}

function HealthItem({ vehicle, mileage, health, warn }: any) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[12px] font-black uppercase italic tracking-tighter text-[var(--t-text)] mb-1">{vehicle}</div>
                    <div className="text-[9px] font-bold text-[var(--t-text-muted)] uppercase tracking-widest">{mileage}</div>
                </div>
                <div className={`text-xl font-black font-mono ${warn ? 'text-red-400' : 'text-green-400'}`}>{health}%</div>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${warn ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`} style={{ width: `${health}%` }} />
            </div>
        </div>
    );
}


