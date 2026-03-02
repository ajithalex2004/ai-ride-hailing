'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DynamicBookingForm from '@/components/booking/DynamicBookingForm';

const STATS = [
  { label: 'Active Vehicles', value: '4,128', color: 'var(--t-accent)', icon: '🚗' },
  { label: 'Drivers Online', value: '1,890', color: 'var(--t-blue)', icon: '👤' },
  { label: 'Revenue (24h)', value: 'AED 842K', color: 'var(--t-green)', icon: '💰' },
  { label: 'Avg ETA', value: '4.2 min', color: 'var(--t-orange)', icon: '⚡' },
];

export default function HomePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--t-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--t-accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'EMS_OPERATOR', 'GOVT_EMS', 'FLEET_ADMIN'].includes(user.role);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--t-border-subtle)', background: 'rgba(11,17,32,0.85)', backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t-accent)', boxShadow: '0 0 8px var(--t-accent)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Mobility OS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAdmin && (
              <Link href="/admin" style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.4rem 1rem', borderRadius: 10, border: '1px solid rgba(245,158,11,0.35)', color: 'var(--t-accent)', textDecoration: 'none', background: 'var(--t-sidebar-active)', transition: 'all 0.15s' }}>
                Admin Panel →
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12, borderLeft: '1px solid var(--t-border)' }}>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1 }}>{user.name}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--t-text-dim)', fontFamily: 'var(--font-mono)' }}>{user.role.replace(/_/g, ' ')} · {user.tenantName}</p>
              </div>
              <button onClick={() => { logout(); router.push('/login'); }}
                className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem 3rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem', padding: '0.35rem 1rem', borderRadius: 999, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--t-green)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--t-green)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Welcome, {user.name} · {user.tenantName}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', lineHeight: 1.05, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            AI Mobility &{' '}
            <span className="gradient-text">Emergency OS</span>
          </h1>
          <p style={{ color: 'var(--t-text-muted)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto 0.75rem' }}>
            City-scale dispatch intelligence. Book transport, request emergency services, or manage your fleet.
          </p>
          <p style={{ color: 'var(--t-text-dim)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Powered by EXL Solutions · Mission Critical Platform
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0.75rem', maxWidth: 700, margin: '2.5rem auto 0' }}>
            {STATS.map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                </div>
                <p className="stat-value" style={{ color: s.color, fontSize: '1.5rem' }}>{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>New Request</h2>
          <p style={{ color: 'var(--t-text-dim)', fontSize: '0.85rem' }}>
            Access governed by your role:{' '}
            <span style={{ color: 'var(--t-accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{user.role.replace(/_/g, ' ')}</span>
          </p>
        </div>
        <DynamicBookingForm />
      </div>
    </div>
  );
}
