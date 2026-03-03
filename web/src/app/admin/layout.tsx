'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const NAV_GROUPS = [
    {
        label: 'Command',
        items: [
            { href: '/admin', label: 'Overview Dashboard', icon: '📊' },
            { href: '/admin/governance', label: 'Global Governance', icon: '🌐' },
            { href: '/admin/tenants', label: 'Tenant Management', icon: '🏢' },
            { href: '/admin/config', label: 'Platform Config', icon: '⚙️' },
            { href: '/admin/policies', label: 'Policy Engine', icon: '📜' },
        ],
    },
    {
        label: 'Transport',
        items: [
            {
                href: '/admin/fleet', label: 'Fleet Management', icon: '🚗',
                sub: [
                    { href: '/admin/fleet', label: 'Dashboard', icon: '📊' },
                    { href: '/admin/fleet/vehicles', label: 'Vehicle Master', icon: '🚙' },
                    { href: '/admin/fleet/assignments', label: 'Vehicle Assignments', icon: '📅' },
                    { href: '/admin/fleet/drivers', label: 'Drivers', icon: '👤' },
                    { href: '/admin/fleet/maintenance', label: 'Maintenance', icon: '🔧' },
                    { href: '/admin/fleet/fuel', label: 'Fuel Logs', icon: '⛽' },
                ],
            },
            { href: '/admin/corporate', label: 'Corporate Accounts', icon: '🏢' },
            { href: '/admin/corporate-shuttle', label: 'Corporate Shuttle', icon: '🚌' },
            { href: '/admin/school-bus', label: 'School Bus', icon: '🏫' },
            { href: '/admin/car-rental', label: 'Car Rental', icon: '🔑' },
            { href: '/admin/optimization', label: 'AI Optimization', icon: '🤖' },
        ],
    },
    {
        label: 'Emergency',
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
        label: 'Finance & Compliance',
        items: [
            { href: '/admin/finance', label: 'Finance & ERP', icon: '💳' },
            { href: '/admin/compliance', label: 'Compliance & Audit', icon: '🛡️' },
        ],
    },
    {
        label: 'People & Security',
        items: [
            { href: '/admin/workforce', label: 'Driver Workforce', icon: '👷' },
            { href: '/admin/customers', label: 'Customer Intelligence', icon: '🧠' },
            { href: '/admin/security', label: 'Security & Fraud', icon: '🔒' },
        ],
    },
    {
        label: 'Simulation',
        items: [
            { href: '/admin/drill', label: 'Emergency Drill', icon: '🧪' },
        ],
    },
];


const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'EMS_OPERATOR', 'GOVT_EMS', 'FLEET_ADMIN'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
        new Set(NAV_GROUPS.map(g => g.label))
    );
    // Track which parent nav items have their sub-menus open
    const [expandedSubs, setExpandedSubs] = useState<Set<string>>(
        new Set(['/admin/fleet']) // Fleet open by default
    );

    useEffect(() => {
        if (!isLoading && !user) router.replace('/login');
        else if (!isLoading && user && !ADMIN_ROLES.includes(user.role)) router.replace('/');
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--t-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, border: '2px solid var(--t-accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
            </div>
        );
    }

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => {
            const n = new Set(prev);
            n.has(label) ? n.delete(label) : n.add(label);
            return n;
        });
    };

    const toggleSub = (href: string) => {
        setExpandedSubs(prev => {
            const n = new Set(prev);
            n.has(href) ? n.delete(href) : n.add(href);
            return n;
        });
    };

    const visibleGroups = NAV_GROUPS.map(g => ({
        ...g,
        items: g.items.filter(() => {
            if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
            if (user.role === 'EMS_OPERATOR' || user.role === 'GOVT_EMS')
                return g.label === 'Emergency' || g.label === 'Simulation';
            if (user.role === 'FLEET_ADMIN') return g.label === 'Transport';
            return false;
        }),
    })).filter(g => g.items.length > 0);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--t-bg)', color: 'var(--t-text)' }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: collapsed ? 56 : 256,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--t-sidebar-bg)',
                borderRight: '1px solid var(--t-border)',
                transition: 'width 0.25s ease',
                overflow: 'hidden',
            }}>
                {/* Logo row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '1rem 0.75rem', borderBottom: '1px solid var(--t-border)' }}>
                    <button onClick={() => setCollapsed(v => !v)}
                        style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: '1px solid var(--t-border)', background: 'var(--t-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-text-muted)', fontSize: 11, transition: 'all 0.15s' }}>
                        {collapsed ? '▶' : '◀'}
                    </button>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--t-accent)', flexShrink: 0, boxShadow: '0 0 6px var(--t-accent)' }} />
                            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>AI Mobility OS</span>
                        </div>
                    )}
                </div>

                {/* User badge */}
                {!collapsed && (
                    <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--t-border)' }}>
                        <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 12, padding: '0.6rem 0.8rem' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--t-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                            <p style={{ fontSize: '0.6rem', color: 'var(--t-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{user.role.replace(/_/g, ' ')}</p>
                            <p style={{ fontSize: '0.6rem', color: 'var(--t-text-dim)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.tenantName}</p>
                        </div>
                    </div>
                )}

                {/* Nav */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {visibleGroups.map(group => (
                        <div key={group.label} style={{ marginBottom: 4 }}>
                            {!collapsed && (
                                <button onClick={() => toggleGroup(group.label)}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.35rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-text-dim)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                                    <span>{group.label}</span>
                                    <span style={{ fontSize: 8 }}>{expandedGroups.has(group.label) ? '▲' : '▼'}</span>
                                </button>
                            )}
                            {(expandedGroups.has(group.label) || collapsed) && (group.items as any[]).map((item: any) => {
                                const hasSub = Boolean(item.sub?.length);
                                const subOpen = expandedSubs.has(item.href);
                                const isParentActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                const isActive = !hasSub && isParentActive;
                                return (
                                    <div key={item.href}>
                                        {hasSub ? (
                                            <button
                                                onClick={() => !collapsed && toggleSub(item.href)}
                                                title={collapsed ? item.label : undefined}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                                                    padding: collapsed ? '0.6rem 0' : '0.5rem 0.6rem',
                                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                                    borderRadius: 10, background: isParentActive ? 'var(--t-sidebar-active)' : 'none',
                                                    border: isParentActive ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                                                    cursor: 'pointer', fontSize: '0.8rem',
                                                    fontWeight: isParentActive ? 700 : 500,
                                                    color: isParentActive ? 'var(--t-sidebar-active-text)' : 'var(--t-text-muted)',
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => { if (!isParentActive) { (e.currentTarget as any).style.background = 'var(--t-card-hover)'; (e.currentTarget as any).style.color = 'var(--t-text)'; } }}
                                                onMouseLeave={e => { if (!isParentActive) { (e.currentTarget as any).style.background = 'none'; (e.currentTarget as any).style.color = 'var(--t-text-muted)'; } }}
                                            >
                                                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                                                {!collapsed && <>
                                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' as const }}>{item.label}</span>
                                                    <span style={{ fontSize: 8, flexShrink: 0, color: 'var(--t-text-dim)', display: 'inline-block', transition: 'transform 0.2s', transform: subOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                                                </>}
                                            </button>
                                        ) : (
                                            <Link href={item.href} title={collapsed ? item.label : undefined}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 9,
                                                    padding: collapsed ? '0.6rem 0' : '0.5rem 0.6rem',
                                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                                    borderRadius: 10, textDecoration: 'none',
                                                    fontSize: '0.8rem', fontWeight: isActive ? 700 : 500,
                                                    color: isActive ? 'var(--t-sidebar-active-text)' : 'var(--t-text-muted)',
                                                    background: isActive ? 'var(--t-sidebar-active)' : 'transparent',
                                                    border: isActive ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => { if (!isActive) { (e.currentTarget as any).style.background = 'var(--t-card-hover)'; (e.currentTarget as any).style.color = 'var(--t-text)'; } }}
                                                onMouseLeave={e => { if (!isActive) { (e.currentTarget as any).style.background = 'transparent'; (e.currentTarget as any).style.color = 'var(--t-text-muted)'; } }}
                                            >
                                                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                                                {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
                                            </Link>
                                        )}
                                        {hasSub && subOpen && !collapsed && (
                                            <div style={{ marginLeft: 12, paddingLeft: 10, borderLeft: '2px solid var(--t-border)', marginTop: 2, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                {(item.sub || []).map((sub: any) => {
                                                    const subActive = pathname === sub.href;
                                                    return (
                                                        <Link key={sub.href} href={sub.href}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: 7,
                                                                padding: '0.35rem 0.5rem', borderRadius: 8,
                                                                textDecoration: 'none', fontSize: '0.75rem',
                                                                fontWeight: subActive ? 700 : 400,
                                                                color: subActive ? 'var(--t-accent)' : 'var(--t-text-dim)',
                                                                background: subActive ? 'var(--t-accent-soft)' : 'transparent',
                                                                transition: 'all 0.12s',
                                                            }}
                                                            onMouseEnter={e => { if (!subActive) { (e.currentTarget as any).style.color = 'var(--t-text)'; (e.currentTarget as any).style.background = 'var(--t-surface)'; } }}
                                                            onMouseLeave={e => { if (!subActive) { (e.currentTarget as any).style.color = 'var(--t-text-dim)'; (e.currentTarget as any).style.background = 'transparent'; } }}
                                                        >
                                                            <span style={{ fontSize: '0.8rem' }}>{sub.icon}</span>
                                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.label}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                        </div>
                    ))}
                </nav>

                {/* Bottom: home + logout */}
                <div style={{ borderTop: '1px solid var(--t-border)', padding: '0.5rem' }}>
                    {[
                        { href: '/', label: 'Booking Portal', icon: '🏠' },
                    ].map(item => (
                        <Link key={item.href} href={item.href}
                            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: collapsed ? '0.6rem 0' : '0.5rem 0.6rem', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 10, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500, color: 'var(--t-text-muted)', transition: 'all 0.15s', marginBottom: 2 }}
                            onMouseEnter={e => { (e.currentTarget as any).style.background = 'var(--t-card)'; (e.currentTarget as any).style.color = 'var(--t-text)'; }}
                            onMouseLeave={e => { (e.currentTarget as any).style.background = 'transparent'; (e.currentTarget as any).style.color = 'var(--t-text-muted)'; }}>
                            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                    <button onClick={() => { logout(); router.push('/login'); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: collapsed ? '0.6rem 0' : '0.5rem 0.6rem', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, color: 'var(--t-text-dim)', transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as any).style.background = 'var(--t-red-soft)'; (e.currentTarget as any).style.color = 'var(--t-red)'; }}
                        onMouseLeave={e => { (e.currentTarget as any).style.background = 'none'; (e.currentTarget as any).style.color = 'var(--t-text-dim)'; }}>
                        <span style={{ fontSize: '1rem' }}>🚪</span>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <header style={{ flexShrink: 0, borderBottom: '1px solid var(--t-border)', background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(12px)', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--t-text)', textTransform: 'capitalize' }}>
                            {pathname === '/admin' ? 'Overview Dashboard' : pathname.split('/').filter(Boolean).slice(1).join(' › ').replace(/-/g, ' ')}
                        </h2>
                        <p style={{ fontSize: '0.7rem', color: 'var(--t-text-dim)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                            {user.tenantName} · {new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="badge badge-green" style={{ padding: '0.3rem 0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--t-green)' }} />
                            All Services Online
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--t-text-dim)', paddingLeft: 12, borderLeft: '1px solid var(--t-border)' }}>
                            {new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </header>

                {/* Page */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
