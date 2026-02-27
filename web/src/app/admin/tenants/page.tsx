"use client";

import React, { useState } from 'react';

type ServiceID = 'EMERGENCY_CORE' | 'TRANSPORT_CORE' | 'WORKFORCE_AI' | 'INCIDENT_MGMT' | 'TELEMETRY_HUB';
type TenantCategory = 'PRIVATE_EMS' | 'GOVT_EMS' | 'TRAFFIC_AUTH' | 'MUNICIPALITY' | 'HIGHWAY_PATROL' | 'TOW_OPERATOR';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    category: TenantCategory;
    services: ServiceID[];
    status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_COMPLIANCE';
    complianceLevel: number;
    sla: Record<'P1' | 'P2' | 'P3', number>;
}

const AVAILABLE_SERVICES: { id: ServiceID, label: string, desc: string }[] = [
    { id: 'EMERGENCY_CORE', label: 'Emergency Ops', desc: 'Ambulance dispatch, hospital routing, P1 queuing.' },
    { id: 'TRANSPORT_CORE', label: 'Commercial Transport', desc: 'Taxi, Limo, Corporate booking & flows.' },
    { id: 'WORKFORCE_AI', label: 'Workforce Intelligence', desc: 'Fatigue monitoring, skill matching, shift AI.' },
    { id: 'INCIDENT_MGMT', label: 'Road Incident Hub', desc: 'Citizen reports, Police & Tow orchestration.' },
    { id: 'TELEMETRY_HUB', label: 'Real-time Telemetry', desc: 'Kafka-driven live asset tracking & mission control.' },
];

const CATEGORIES: { id: TenantCategory, label: string }[] = [
    { id: 'GOVT_EMS', label: 'Government EMS' },
    { id: 'PRIVATE_EMS', label: 'Private Ambulance Operator' },
    { id: 'TRAFFIC_AUTH', label: 'Traffic Authority' },
    { id: 'MUNICIPALITY', label: 'Municipality' },
    { id: 'HIGHWAY_PATROL', label: 'Highway Patrol' },
    { id: 'TOW_OPERATOR', label: 'Tow Truck Operator' },
];

export default function SuperAdminTenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([
        { id: '1', name: 'Dubai Health Authority', slug: 'dha-ems', category: 'GOVT_EMS', status: 'ACTIVE', complianceLevel: 5, services: ['EMERGENCY_CORE', 'WORKFORCE_AI', 'TELEMETRY_HUB'], sla: { P1: 8, P2: 15, P3: 60 } },
        { id: '2', name: 'Roads & Transport Authority', slug: 'rta-traffic', category: 'TRAFFIC_AUTH', status: 'ACTIVE', complianceLevel: 5, services: ['INCIDENT_MGMT', 'TELEMETRY_HUB'], sla: { P1: 10, P2: 20, P3: 90 } },
        { id: '3', name: 'Al Ghurair Ambulance', slug: 'ag-private-ems', category: 'PRIVATE_EMS', status: 'PENDING_COMPLIANCE', complianceLevel: 3, services: ['EMERGENCY_CORE'], sla: { P1: 12, P2: 18, P3: 45 } },
    ]);

    const updateSLA = (tenantId: string, priority: 'P1' | 'P2' | 'P3', value: number) => {
        setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, sla: { ...t.sla, [priority]: value } } : t));
    };

    const toggleService = (tenantId: string, serviceId: ServiceID) => {
        setTenants(prev => prev.map(t => {
            if (t.id === tenantId) {
                const hasService = t.services.includes(serviceId);
                return { ...t, services: hasService ? t.services.filter(s => s !== serviceId) : [...t.services, serviceId] };
            }
            return t;
        }));
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-white p-8 font-sans selection:bg-neon-blue selection:text-black">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex justify-between items-end border-b border-white/5 pb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-neon-blue text-black text-[10px] font-black rounded uppercase">Super_Admin</span>
                            <h1 className="text-4xl font-black italic tracking-tighter text-white">PLATFORM_ORCHESTRATOR</h1>
                        </div>
                        <p className="text-xs text-muted-grey uppercase tracking-[0.4em] font-medium">Global Multi-Tenant Control Hub & Compliance Layer</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all">
                            BUSINESS_RULES
                        </button>
                        <button className="px-8 py-2 bg-neon-blue text-black font-black rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                            PROVISION_TENANT
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {tenants.map((tenant) => (
                        <div key={tenant.id} className="group relative glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
                            {/* Animated Pulse for Pending Compliance */}
                            {tenant.status === 'PENDING_COMPLIANCE' && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/50 animate-pulse"></div>
                            )}

                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black tracking-tight group-hover:text-neon-blue transition-colors">{tenant.name}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 rounded text-muted-grey border border-white/10 uppercase">{tenant.category.replace('_', ' ')}</span>
                                        <code className="text-[9px] text-neon-blue font-mono font-bold">/{tenant.slug}</code>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] font-black uppercase text-muted-grey mb-1">Compliance</div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(lvl => (
                                            <div key={lvl} className={`w-1.5 h-3 rounded-sm ${lvl <= tenant.complianceLevel ? 'bg-neon-blue' : 'bg-white/5'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-grey">Priority SLA Controls</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['P1', 'P2', 'P3'] as const).map((p) => (
                                        <div key={p} className="bg-black/40 border border-white/5 p-3 rounded-xl">
                                            <div className="text-[8px] font-black text-muted-grey mb-1">{p} TARGET</div>
                                            <input
                                                type="number"
                                                value={tenant.sla[p]}
                                                onChange={(e) => updateSLA(tenant.id, p, parseInt(e.target.value))}
                                                className="bg-transparent text-xs font-mono text-neon-blue w-full outline-none"
                                            />
                                            <div className="text-[7px] text-muted-grey mt-1">mins</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 mt-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-grey">Enabled Modules</h3>
                                    <span className="text-[10px] font-mono text-neon-blue">{tenant.services.length}/{AVAILABLE_SERVICES.length}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {AVAILABLE_SERVICES.map((svc) => (
                                        <ServiceCard
                                            key={svc.id}
                                            label={svc.label}
                                            active={tenant.services.includes(svc.id)}
                                            onClick={() => toggleService(tenant.id, svc.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <button className="py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">
                                    GOVERNANCE_LOGS
                                </button>
                                <button className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${tenant.status === 'SUSPENDED' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-red-500/20 text-red-400 bg-red-500/5'}`}>
                                    {tenant.status === 'SUSPENDED' ? 'REINSTATE' : 'SUSPEND_OPS'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ServiceCard({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer transition-all border group/card ${active ? 'bg-neon-blue/10 border-neon-blue/30' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
        >
            <span className={`text-[11px] font-bold ${active ? 'text-white' : 'text-muted-grey group-hover/card:text-white'}`}>{label}</span>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-neon-blue bg-neon-blue' : 'border-white/10 bg-transparent'}`}>
                {active && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
            </div>
        </div>
    );
}
