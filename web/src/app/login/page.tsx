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
    { email: 'passenger@test.com', label: 'Passenger Demo' },
    { email: 'admin@dubai.gov', label: 'Admin Demo' },
    { email: 'ems@dha.gov', label: 'EMS Demo' },
    { email: 'superadmin@exl.com', label: 'Super Admin Demo' },
];

export default function LoginPage() {
    const { login, user, isLoading } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('PASSENGER');
    const [tenantSlug, setTenantSlug] = useState('dubai-ops');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Already logged in: redirect immediately
    useEffect(() => {
        if (!isLoading && user) {
            router.replace(ROLE_HOME[user.role]);
        }
    }, [user, isLoading, router]);

    const handleQuickLogin = (quickEmail: string) => {
        setEmail(quickEmail);
        setPassword('demo123');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Email is required'); return; }

        setSubmitting(true);
        try {
            await login({ email, password, role, tenantSlug });
            router.push(ROLE_HOME[role]);
        } catch {
            setError('Invalid credentials. Try a demo account below.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050810] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">System Online</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        AI Mobility &<br />
                        <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Emergency OS</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Powered by EXL Solutions</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    {/* Quick Login Buttons */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Quick Demo Login</p>
                        <div className="grid grid-cols-2 gap-2">
                            {QUICK_LOGINS.map(q => (
                                <button
                                    key={q.email}
                                    type="button"
                                    onClick={() => handleQuickLogin(q.email)}
                                    className="text-left px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all"
                                >
                                    <p className="text-xs font-bold text-white">{q.label}</p>
                                    <p className="text-[10px] text-gray-500 font-mono truncate">{q.email}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-transparent text-gray-500 text-xs">or enter manually</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Email / Phone</label>
                            <input
                                type="text"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@dubai.gov"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-cyan-400/60 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Any password for demo"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-cyan-400/60 transition-all"
                            />
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Access Role</label>
                            <div className="grid grid-cols-2 gap-2">
                                {ROLES.map(r => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRole(r.value)}
                                        className={`text-left px-3 py-2.5 rounded-xl border transition-all ${role === r.value ? 'border-cyan-400/60 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{r.icon}</span>
                                            <div>
                                                <p className="text-xs font-bold leading-none">{r.label}</p>
                                                <p className="text-[10px] mt-0.5 opacity-60">{r.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 mt-2"
                        >
                            {submitting ? '🔐 Authenticating...' : 'Login to Platform →'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                    Demo mode — any password accepted • Access governed by selected role
                </p>
            </div>
        </div>
    );
}
