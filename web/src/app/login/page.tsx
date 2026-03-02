'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, ROLE_HOME } from '@/context/AuthContext';

const ROLES: { value: UserRole; label: string; description: string; icon: string }[] = [
    { value: 'PASSENGER', label: 'Passenger', description: 'Book taxis, limos, rentals', icon: '🧳' },
    { value: 'CORPORATE', label: 'Corporate User', description: 'Company transport & shuttles', icon: '🏢' },
    { value: 'EMS_OPERATOR', label: 'EMS Dispatcher', description: 'Ambulance & emergency dispatch', icon: '🚑' },
    { value: 'FLEET_ADMIN', label: 'Fleet Administrator', description: 'Manage fleet operations', icon: '🚛' },
    { value: 'ADMIN', label: 'Platform Admin', description: 'Full platform access', icon: '⚙️' },
    { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Global governance & tenants', icon: '🛡️' },
];

const QUICK_LOGINS = [
    { email: 'passenger@test.com', label: 'Passenger', role: 'PASSENGER' as UserRole },
    { email: 'admin@dubai.gov', label: 'Admin', role: 'ADMIN' as UserRole },
    { email: 'ems@dha.gov', label: 'EMS', role: 'EMS_OPERATOR' as UserRole },
    { email: 'superadmin@exl.com', label: 'Super Admin', role: 'SUPER_ADMIN' as UserRole },
];

export default function LoginPage() {
    const { login, user, isLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('PASSENGER');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && user) router.replace(ROLE_HOME[user.role]);
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--t-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, border: '2px solid var(--t-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
        );
    }

    const handleQuickLogin = async (q: typeof QUICK_LOGINS[0]) => {
        setSubmitting(true); setError('');
        try {
            await login({ email: q.email, password: 'demo123', role: q.role, tenantSlug: 'dubai-ops' });
            router.push(ROLE_HOME[q.role]);
        } catch { setError('Login failed.'); }
        finally { setSubmitting(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (!email.trim()) { setError('Email is required'); return; }
        setSubmitting(true);
        try {
            await login({ email, password, role, tenantSlug: 'dubai-ops' });
            router.push(ROLE_HOME[role]);
        } catch { setError('Invalid credentials. Try a demo account above.'); }
        finally { setSubmitting(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--t-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            {/* Background glow orbs */}
            <div style={{ position: 'absolute', top: '15%', left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', right: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }} className="animate-fade-in">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem', padding: '0.4rem 1rem', borderRadius: 999, border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.06)' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--t-accent)', animation: 'pulse 2s ease-in-out infinite' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--t-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>System Online</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                        AI Mobility &{' '}
                        <span className="gradient-text">Emergency OS</span>
                    </h1>
                    <p style={{ color: 'var(--t-text-dim)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Powered by EXL Solutions</p>
                </div>

                {/* Card */}
                <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 20, padding: '2rem' }}>
                    {/* Quick Logins */}
                    <p style={{ fontSize: '0.65rem', color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.75rem' }}>Quick Demo Access</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.5rem' }}>
                        {QUICK_LOGINS.map(q => (
                            <button key={q.email} onClick={() => handleQuickLogin(q)} disabled={submitting}
                                style={{ textAlign: 'left', padding: '0.6rem 0.75rem', borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-surface)', cursor: 'pointer', transition: 'all 0.15s' }}
                                onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'rgba(245,158,11,0.4)'; (e.currentTarget as any).style.background = 'var(--t-sidebar-active)'; }}
                                onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'var(--t-border)'; (e.currentTarget as any).style.background = 'var(--t-surface)'; }}
                            >
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--t-text)' }}>{q.label}</p>
                                <p style={{ fontSize: '0.6rem', color: 'var(--t-text-dim)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{q.email}</p>
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--t-border)' }} />
                        <span style={{ color: 'var(--t-text-dim)', fontSize: '0.7rem' }}>or enter manually</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--t-border)' }} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--t-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Email</label>
                            <input className="input" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@dubai.gov" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--t-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Password</label>
                            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Any password for demo" />
                        </div>

                        {/* Role Grid */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--t-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Access Role</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                {ROLES.map(r => (
                                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                                        style={{ textAlign: 'left', padding: '0.6rem 0.75rem', borderRadius: 10, border: `1px solid ${role === r.value ? 'rgba(245,158,11,0.5)' : 'var(--t-border)'}`, background: role === r.value ? 'var(--t-sidebar-active)' : 'var(--t-surface)', cursor: 'pointer', transition: 'all 0.15s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 16 }}>{r.icon}</span>
                                            <div>
                                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: role === r.value ? 'var(--t-accent)' : 'var(--t-text)' }}>{r.label}</p>
                                                <p style={{ fontSize: '0.6rem', color: 'var(--t-text-dim)', marginTop: 1 }}>{r.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="badge-red" style={{ padding: '0.6rem 0.75rem', borderRadius: 10, fontSize: '0.8rem' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', marginTop: 4 }}>
                            {submitting ? '🔐 Authenticating...' : 'Login to Platform →'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: 'var(--t-text-dim)', fontSize: '0.7rem', marginTop: '1.25rem', fontFamily: 'var(--font-mono)' }}>
                    Demo mode · Any password accepted · Access governed by role
                </p>
            </div>
        </div>
    );
}
