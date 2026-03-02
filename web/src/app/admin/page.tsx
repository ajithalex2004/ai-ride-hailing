'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const GLOBAL_STATS = [
    { label: 'Active Vehicles', value: '4,128', delta: '+3.2%', color: 'cyan', icon: '🚗' },
    { label: 'Drivers Online', value: '1,890', delta: '+1.8%', color: 'blue', icon: '👤' },
    { label: 'Active Tenants', value: '8', delta: '+2', color: 'green', icon: '🏢' },
    { label: 'Revenue (24h)', value: 'AED 842K', delta: '+12%', color: 'orange', icon: '💰' },
    { label: 'P1 Incidents (today)', value: '14', delta: '-2', color: 'red', icon: '🆘' },
    { label: 'Avg Response Time', value: '4.2m', delta: '-0.3m', color: 'green', icon: '⚡' },
    { label: 'School Routes', value: '48', delta: '+4', color: 'yellow', icon: '🏫' },
    { label: 'Fleet Utilization', value: '87%', delta: '+5%', color: 'green', icon: '📊' },
];

const DOMAIN_CARDS = [
    { href: '/admin/fleet', label: 'Fleet Management', icon: '🚗', color: 'cyan', description: 'Vehicles, fuel, maintenance & asset lifecycle' },
    { href: '/admin/emergency', label: 'Emergency Response', icon: '🚑', color: 'red', description: 'Ambulance dispatch, P1-P3 priorities, hospital routing' },
    { href: '/admin/incidents', label: 'Incident Command', icon: '⚠️', color: 'orange', description: 'Road incidents, tow dispatch, traffic recovery' },
    { href: '/admin/corporate', label: 'Corporate Accounts', icon: '🏢', color: 'blue', description: 'Contracts, cost centers, SLA monitoring' },
    { href: '/admin/school-bus', label: 'School Bus', icon: '🏫', color: 'yellow', description: 'Routes, student assignments, safety monitoring' },
    { href: '/admin/corporate-shuttle', label: 'Corporate Shuttle', icon: '🚌', color: 'green', description: 'Recurring routes, shift scheduling, capacity AI' },
    { href: '/admin/car-rental', label: 'Car Rental', icon: '🔑', color: 'purple', description: 'Fleet availability, contracts, insurance' },
    { href: '/admin/workforce', label: 'Driver Workforce', icon: '👷', color: 'teal', description: 'Certifications, shifts, fatigue monitoring' },
    { href: '/admin/finance', label: 'Finance & ERP', icon: '💳', color: 'green', description: 'Billing, revenue share, forecasting' },
    { href: '/admin/compliance', label: 'Compliance & Audit', icon: '🛡️', color: 'blue', description: 'Regulatory audit, tax, immutable logs' },
    { href: '/admin/customers', label: 'Customer Intelligence', icon: '🧠', color: 'pink', description: 'Loyalty, subscriptions, churn prediction' },
    { href: '/admin/security', label: 'Security & Fraud', icon: '🔒', color: 'red', description: 'GPS spoofing, risk scoring, auto-blocking' },
    { href: '/admin/optimization', label: 'AI Optimization', icon: '🤖', color: 'cyan', description: 'Demand forecasting, surge pricing, fleet AI' },
    { href: '/admin/governance', label: 'Global Governance', icon: '🌐', color: 'orange', description: 'Super admin domain matrix & config' },
    { href: '/admin/tenants', label: 'Tenant Management', icon: '🏛️', color: 'cyan', description: 'Manage tenants, services & SLA plans' },
    { href: '/admin/drill', label: 'Emergency Drill', icon: '🧪', color: 'purple', description: 'Run P1 simulation drills' },
];

const COLOR_MAP: Record<string, string> = {
    cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10',
    red: 'border-red-500/30 bg-red-500/5 text-red-400 hover:border-red-400/50 hover:bg-red-500/10',
    orange: 'border-orange-500/30 bg-orange-500/5 text-orange-400 hover:border-orange-400/50 hover:bg-orange-500/10',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400 hover:border-blue-400/50 hover:bg-blue-500/10',
    green: 'border-green-500/30 bg-green-500/5 text-green-400 hover:border-green-400/50 hover:bg-green-500/10',
    yellow: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-500/10',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400 hover:border-purple-400/50 hover:bg-purple-500/10',
    teal: 'border-teal-500/30 bg-teal-500/5 text-teal-400 hover:border-teal-400/50 hover:bg-teal-500/10',
    pink: 'border-pink-500/30 bg-pink-500/5 text-pink-400 hover:border-pink-400/50 hover:bg-pink-500/10',
};

const RECENT_EVENTS = [
    { time: '16:48', type: '🚑', label: 'P1 Cardiac – Ambulance AMB-042 dispatched', tenant: 'dubai-ops' },
    { time: '16:45', type: '🚗', label: 'Corporate booking – ACME Corp, 4 seats', tenant: 'acme-corp' },
    { time: '16:41', type: '⚠️', label: 'Incident reported – Sheikh Zayed Rd, km 14', tenant: 'rta-traffic' },
    { time: '16:38', type: '🏫', label: 'School Bus Route A completed – 42 students', tenant: 'alnoor-school' },
    { time: '16:30', type: '🔒', label: 'Fraud alert: GPS spoofing detected (user #4821)', tenant: 'dubai-ops' },
    { time: '16:22', type: '💳', label: 'Invoice INV-2026-4481 generated – AED 18,400', tenant: 'acme-corp' },
];

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 flex items-center justify-between">
                <div>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-1">Welcome back</p>
                    <h2 className="text-2xl font-black text-white">{user?.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">{user?.role?.replace(/_/g, ' ')} · {user?.tenantName} · All regions visible</p>
                </div>
                <div className="hidden md:block text-6xl opacity-30">🛡️</div>
            </div>

            {/* Stats Grid */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Platform Pulse (Live)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {GLOBAL_STATS.map(s => (
                        <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl">{s.icon}</span>
                                <span className={`text-[10px] font-bold ${s.delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{s.delta}</span>
                            </div>
                            <p className={`text-xl font-black text-${s.color}-400`}>{s.value}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Domain Cards Grid */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">All Platform Modules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {DOMAIN_CARDS.map(card => (
                        <Link key={card.href} href={card.href}
                            className={`block p-4 rounded-2xl border transition-all group ${COLOR_MAP[card.color] || COLOR_MAP.cyan}`}>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{card.icon}</span>
                                <div className="min-w-0">
                                    <p className="font-bold text-sm text-white group-hover:translate-x-0.5 transition-transform">{card.label}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{card.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Events */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Platform Events</h3>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl divide-y divide-white/[0.04]">
                    {RECENT_EVENTS.map((ev, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-3">
                            <span className="text-gray-600 font-mono text-xs w-10">{ev.time}</span>
                            <span className="text-lg">{ev.type}</span>
                            <p className="text-sm text-gray-300 flex-1">{ev.label}</p>
                            <span className="text-[10px] text-gray-600 font-mono">{ev.tenant}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
