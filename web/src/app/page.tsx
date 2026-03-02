'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DynamicBookingForm from '@/components/booking/DynamicBookingForm';

export default function HomePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  const isEMS = user.role === 'EMS_OPERATOR' || user.role === 'GOVT_EMS';

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-black text-sm tracking-widest uppercase text-white">AI Mobility OS</span>
          </div>
          <div className="flex items-center gap-4">
            {(isAdmin || isEMS) && (
              <Link href="/admin" className="text-xs font-bold px-4 py-2 rounded-xl border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all">
                Admin Panel →
              </Link>
            )}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div>
                <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-500">{user.role.replace(/_/g, ' ')} • {user.tenantName}</p>
              </div>
              <button
                onClick={() => { logout(); router.push('/login'); }}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-red-400/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 text-center relative">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
              Welcome, {user.name} • {user.tenantName}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            AI Mobility &{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-white to-orange-400 bg-clip-text text-transparent">
              Emergency OS
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-2">
            City-scale dispatch intelligence. Book transport, request emergency services, or manage your fleet.
          </p>
          <p className="text-gray-600 text-xs uppercase tracking-widest font-bold">
            Powered by EXL Solutions • Mission Critical Platform
          </p>

          {/* Live Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
            {[
              { label: 'Active Vehicles', value: '4,128', color: 'cyan' },
              { label: 'Drivers Online', value: '1,890', color: 'blue' },
              { label: 'Revenue (24h)', value: 'AED 842K', color: 'green' },
              { label: 'Avg ETA', value: '4.2 min', color: 'orange' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                <div className={`text-2xl font-black text-${stat.color}-400`}>{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">New Request</h2>
          <p className="text-gray-500 text-sm">Access governed by your role: <span className="text-cyan-400 font-bold">{user.role.replace(/_/g, ' ')}</span></p>
        </div>
        <DynamicBookingForm />
      </div>
    </div>
  );
}
