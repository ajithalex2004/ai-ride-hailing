'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const NAV_GROUPS = [
    {
        label: '🏛️ Command',
        items: [
            { href: '/admin', label: 'Overview Dashboard', icon: '📊' },
            { href: '/admin/governance', label: 'Global Governance', icon: '🌐' },
            { href: '/admin/tenants', label: 'Tenant Management', icon: '🏢' },
            { href: '/admin/config', label: 'Platform Config', icon: '⚙️' },
            { href: '/admin/policies', label: 'Policy Engine', icon: '📜' },
        ],
    },
    {
        label: '🚘 Transport',
        items: [
            { href: '/admin/fleet', label: 'Fleet Management', icon: '🚗' },
            { href: '/admin/corporate', label: 'Corporate Accounts', icon: '🏢' },
            { href: '/admin/corporate-shuttle', label: 'Corporate Shuttle', icon: '🚌' },
            { href: '/admin/school-bus', label: 'School Bus', icon: '🏫' },
            { href: '/admin/car-rental', label: 'Car Rental', icon: '🔑' },
            { href: '/admin/optimization', label: 'AI Optimization', icon: '🤖' },
        ],
    },
    {
        label: '🚑 Emergency',
        items: [
            { href: '/admin/emergency', label: 'Emergency Response', icon: '🆘' },
            { href: '/admin/emergency/predictive', label: 'Predictive AI', icon: '🔮' },
            { href: '/admin/incidents', label: 'Incidents', icon: '⚠️' },
            { href: '/admin/incidents/recovery', label: 'Traffic Recovery', icon: '🛣️' },
            { href: '/admin/command', label: 'Command Center', icon: '🎯' },
            { href: '/admin/command-center', label: 'Live Operations', icon: '📡' },
        ],
    },
    {
        label: '💰 Finance & Compliance',
        items: [
            { href: '/admin/finance', label: 'Finance & ERP', icon: '💳' },
            { href: '/admin/compliance', label: 'Compliance & Audit', icon: '🛡️' },
        ],
    },
    {
        label: '👥 People & Security',
        items: [
            { href: '/admin/workforce', label: 'Driver Workforce', icon: '👷' },
            { href: '/admin/customers', label: 'Customer Intelligence', icon: '🧠' },
            { href: '/admin/security', label: 'Security & Fraud', icon: '🔒' },
        ],
    },
    {
        label: '🔬 Drill & Simulation',
        items: [
            { href: '/admin/drill', label: 'Emergency Drill', icon: '🧪' },
        ],
    },
];

// Which roles can access the admin panel
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'EMS_OPERATOR', 'GOVT_EMS', 'FLEET_ADMIN'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(NAV_GROUPS.map(g => g.label)));

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        } else if (!isLoading && user && !ADMIN_ROLES.includes(user.role)) {
            router.replace('/');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-[#050810] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(label)) next.delete(label);
            else next.add(label);
            return next;
        });
    };

    // Filter nav based on role
    const filteredGroups = NAV_GROUPS.map(group => ({
        ...group,
        items: group.items.filter(item => {
            if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
            if (user.role === 'EMS_OPERATOR' || user.role === 'GOVT_EMS') {
                return group.label.includes('Emergency') || group.label.includes('Command') || item.href === '/admin';
            }
            if (user.role === 'FLEET_ADMIN') {
                return group.label.includes('Transport') || item.href === '/admin';
            }
            return item.href === '/admin';
        }),
    })).filter(g => g.items.length > 0);

    return (
        <div className="flex h-screen bg-[#050810] text-white overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300 overflow-hidden`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
                    <button
                        onClick={() => setSidebarOpen(v => !v)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all flex-shrink-0"
                    >
                        <span className="text-xs">{sidebarOpen ? '◀' : '▶'}</span>
                    </button>
                    {sidebarOpen && (
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                            <span className="font-black text-xs tracking-widest uppercase text-white truncate">AI Mobility OS</span>
                        </div>
                    )}
                </div>

                {/* User Badge */}
                {sidebarOpen && (
                    <div className="px-4 py-3 border-b border-white/5">
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wide mt-0.5">{user.role.replace(/_/g, ' ')}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5 truncate">{user.tenantName}</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
                    {filteredGroups.map(group => (
                        <div key={group.label}>
                            {sidebarOpen && (
                                <button
                                    onClick={() => toggleGroup(group.label)}
                                    className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-gray-400 transition-colors"
                                >
                                    <span>{group.label}</span>
                                    <span className="text-[8px]">{expandedGroups.has(group.label) ? '▲' : '▼'}</span>
                                </button>
                            )}
                            {(expandedGroups.has(group.label) || !sidebarOpen) && (
                                <div className="space-y-0.5">
                                    {group.items.map(item => {
                                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${isActive
                                                        ? 'bg-cyan-400/15 text-cyan-400 font-bold border border-cyan-400/20'
                                                        : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                                                    }`}
                                                title={!sidebarOpen ? item.label : undefined}
                                            >
                                                <span className="text-base flex-shrink-0">{item.icon}</span>
                                                {sidebarOpen && <span className="truncate">{item.label}</span>}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-white/5 p-3 space-y-1">
                    <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-white/[0.04] hover:text-white transition-all`}>
                        <span>🏠</span>
                        {sidebarOpen && <span>Booking Portal</span>}
                    </Link>
                    <button
                        onClick={() => { logout(); router.push('/login'); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <span>🚪</span>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex-shrink-0 border-b border-white/5 bg-black/20 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="font-black text-white capitalize">
                            {pathname === '/admin' ? 'Overview Dashboard' :
                                pathname.split('/').filter(Boolean).slice(1).join(' › ').replace(/-/g, ' ')}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">{user.tenantName} · {new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-green-400 text-xs font-bold">All Services Online</span>
                        </div>
                        <span className="text-xs text-gray-600 border-l border-white/5 pl-3 font-mono">
                            {new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-[#050810]">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
