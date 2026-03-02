'use client';

import React, { useState } from 'react';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    type: 'GOVT' | 'CORPORATE' | 'SCHOOL' | 'HOSPITAL' | 'INDIVIDUAL';
    country: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
    services: string[];
    users: number;
    trips_30d: number;
    revenue_30d: number;
    plan: string;
    created: string;
}

const MOCK_TENANTS: Tenant[] = [
    { id: '1', name: 'Dubai Municipality', slug: 'dubai-ops', type: 'GOVT', country: '🇦🇪 UAE', status: 'ACTIVE', services: ['TRANSPORT', 'EMERGENCY', 'INCIDENT'], users: 1240, trips_30d: 42800, revenue_30d: 185000, plan: 'Enterprise', created: '2024-01-15' },
    { id: '2', name: 'ACME Corporation', slug: 'acme-corp', type: 'CORPORATE', country: '🇦🇪 UAE', status: 'ACTIVE', services: ['TRANSPORT', 'SHUTTLE', 'RENTAL'], users: 340, trips_30d: 12400, revenue_30d: 62000, plan: 'Corporate', created: '2024-03-12' },
    { id: '3', name: 'Dubai Health Authority', slug: 'dha-ems', type: 'HOSPITAL', country: '🇦🇪 UAE', status: 'ACTIVE', services: ['EMERGENCY', 'AMBULANCE'], users: 520, trips_30d: 8900, revenue_30d: 0, plan: 'Govt EMS', created: '2024-02-01' },
    { id: '4', name: 'Al Noor School District', slug: 'alnoor-school', type: 'SCHOOL', country: '🇦🇪 UAE', status: 'ACTIVE', services: ['SCHOOL_BUS'], users: 89, trips_30d: 6200, revenue_30d: 35000, plan: 'Education', created: '2024-06-10' },
    { id: '5', name: 'RTA Traffic Authority', slug: 'rta-traffic', type: 'GOVT', country: '🇦🇪 UAE', status: 'ACTIVE', services: ['TRANSPORT', 'INCIDENT', 'EMERGENCY'], users: 780, trips_30d: 31200, revenue_30d: 0, plan: 'Govt Master', created: '2024-01-20' },
    { id: '6', name: 'Riyadh Metro Corp', slug: 'riyadh-metro', type: 'CORPORATE', country: '🇸🇦 KSA', status: 'TRIAL', services: ['SHUTTLE', 'TRANSPORT'], users: 120, trips_30d: 3100, revenue_30d: 14000, plan: 'Trial', created: '2025-11-01' },
    { id: '7', name: 'Cairo Ambulance Network', slug: 'cairo-ems', type: 'HOSPITAL', country: '🇪🇬 Egypt', status: 'SUSPENDED', services: ['EMERGENCY'], users: 45, trips_30d: 0, revenue_30d: 0, plan: 'Govt EMS', created: '2024-08-05' },
    { id: '8', name: 'Kuwait Oil Transport', slug: 'kot-fleet', type: 'CORPORATE', country: '🇰🇼 Kuwait', status: 'ACTIVE', services: ['TRANSPORT', 'RENTAL'], users: 210, trips_30d: 7800, revenue_30d: 48000, plan: 'Corporate', created: '2025-01-18' },
];

const ALL_SERVICES = ['TRANSPORT', 'EMERGENCY', 'AMBULANCE', 'INCIDENT', 'SHUTTLE', 'SCHOOL_BUS', 'RENTAL'];
const TENANT_TYPES = ['ALL', 'GOVT', 'CORPORATE', 'SCHOOL', 'HOSPITAL', 'INDIVIDUAL'];
const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'bg-green-500/15 text-green-400 border-green-500/30',
    SUSPENDED: 'bg-red-500/15 text-red-400 border-red-500/30',
    TRIAL: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
};
const TYPE_ICONS: Record<string, string> = {
    GOVT: '🏛️', CORPORATE: '🏢', SCHOOL: '🏫', HOSPITAL: '🏥', INDIVIDUAL: '👤',
};

export default function TenantsPage() {
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);

    const filtered = tenants.filter(t =>
        (filter === 'ALL' || t.type === filter) &&
        (t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.includes(search.toLowerCase()))
    );

    const totalRevenue = tenants.reduce((s, t) => s + t.revenue_30d, 0);
    const totalUsers = tenants.reduce((s, t) => s + t.users, 0);
    const totalTrips = tenants.reduce((s, t) => s + t.trips_30d, 0);
    const activeCount = tenants.filter(t => t.status === 'ACTIVE').length;

    const toggleService = (tenantId: string, service: string) => {
        setTenants(prev => prev.map(t => {
            if (t.id !== tenantId) return t;
            const has = t.services.includes(service);
            return { ...t, services: has ? t.services.filter(s => s !== service) : [...t.services, service] };
        }));
        if (selectedTenant?.id === tenantId) {
            setSelectedTenant(prev => {
                if (!prev) return null;
                const has = prev.services.includes(service);
                return { ...prev, services: has ? prev.services.filter(s => s !== service) : [...prev.services, service] };
            });
        }
    };

    const toggleStatus = (tenantId: string) => {
        setTenants(prev => prev.map(t => {
            if (t.id !== tenantId) return t;
            return { ...t, status: t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' };
        }));
    };

    return (
        <div className="space-y-6">
            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tenants', value: tenants.length, sub: `${activeCount} active`, color: 'cyan' },
                    { label: 'Total Users', value: totalUsers.toLocaleString(), sub: 'across all tenants', color: 'blue' },
                    { label: 'Trips (30d)', value: totalTrips.toLocaleString(), sub: 'all domains', color: 'green' },
                    { label: 'Revenue (30d)', value: `AED ${(totalRevenue / 1000).toFixed(0)}K`, sub: 'billed tenants', color: 'orange' },
                ].map(k => (
                    <div key={k.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <p className={`text-2xl font-black text-${k.color}-400`}>{k.value}</p>
                        <p className="text-xs text-gray-400 font-bold mt-1">{k.label}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{k.sub}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-6">
                {/* Tenant List */}
                <div className="flex-1 space-y-4">
                    {/* Filters */}
                    <div className="flex gap-3 flex-wrap">
                        <input
                            type="text"
                            placeholder="Search tenants..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-400/50 transition-all"
                        />
                        <div className="flex gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1">
                            {TENANT_TYPES.map(t => (
                                <button key={t} onClick={() => setFilter(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === t ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-500 hover:text-white'}`}>
                                    {t === 'ALL' ? 'All' : `${TYPE_ICONS[t]} ${t}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-4 py-3 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Tenant</th>
                                    <th className="text-left px-4 py-3 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Type</th>
                                    <th className="text-left px-4 py-3 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Status</th>
                                    <th className="text-left px-4 py-3 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Services</th>
                                    <th className="text-left px-4 py-3 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Users</th>
                                    <th className="text-left px-4 py-3 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {filtered.map(t => (
                                    <tr key={t.id} className={`hover:bg-white/[0.02] transition-all cursor-pointer ${selectedTenant?.id === t.id ? 'bg-cyan-400/5' : ''}`}
                                        onClick={() => setSelectedTenant(t)}>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-white">{t.name}</p>
                                            <p className="text-[10px] text-gray-500 font-mono">{t.slug} · {t.country}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs">{TYPE_ICONS[t.type]} {t.type}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] px-2 py-1 rounded-full border font-bold ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1 flex-wrap">
                                                {t.services.slice(0, 3).map(s => (
                                                    <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{s}</span>
                                                ))}
                                                {t.services.length > 3 && <span className="text-[9px] text-gray-500">+{t.services.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">{t.users.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={e => { e.stopPropagation(); toggleStatus(t.id); }}
                                                className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition-all ${t.status === 'ACTIVE'
                                                        ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                                        : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                                                    }`}
                                            >
                                                {t.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tenant Detail Panel */}
                {selectedTenant && (
                    <div className="w-80 flex-shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-5 h-fit sticky top-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-black text-white">{selectedTenant.name}</p>
                                <p className="text-xs text-gray-500 font-mono">{selectedTenant.slug}</p>
                            </div>
                            <button onClick={() => setSelectedTenant(null)} className="text-gray-600 hover:text-white text-xs">✕</button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-lg font-black text-cyan-400">{selectedTenant.users.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500">Users</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-lg font-black text-green-400">{selectedTenant.trips_30d.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500">Trips (30d)</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-lg font-black text-orange-400">
                                    {selectedTenant.revenue_30d > 0 ? `AED ${(selectedTenant.revenue_30d / 1000).toFixed(0)}K` : '—'}
                                </p>
                                <p className="text-[10px] text-gray-500">Revenue</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-[10px] font-black text-white">{selectedTenant.plan}</p>
                                <p className="text-[10px] text-gray-500">Plan</p>
                            </div>
                        </div>

                        {/* Service Toggles */}
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3">Service Entitlements</p>
                            <div className="space-y-2">
                                {ALL_SERVICES.map(svc => {
                                    const enabled = selectedTenant.services.includes(svc);
                                    return (
                                        <div key={svc} className="flex items-center justify-between">
                                            <span className="text-xs text-gray-300">{svc.replace(/_/g, ' ')}</span>
                                            <button
                                                onClick={() => toggleService(selectedTenant.id, svc)}
                                                className={`relative w-10 h-5 rounded-full transition-all ${enabled ? 'bg-cyan-400' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/25 transition-all">
                                📧 Send Notification
                            </button>
                            <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-all">
                                📊 View Full Report
                            </button>
                            <button
                                onClick={() => toggleStatus(selectedTenant.id)}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all ${selectedTenant.status === 'ACTIVE'
                                        ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                        : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                                    }`}
                            >
                                {selectedTenant.status === 'ACTIVE' ? '🔴 Suspend Tenant' : '🟢 Activate Tenant'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
