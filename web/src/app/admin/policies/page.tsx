"use client";

import React from 'react';

export default function GlobalPoliciesPage() {
    return (
        <div className="min-h-screen bg-deep-space text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-pulse-orange bg-clip-text text-transparent mb-2">
                        Advanced Operations & Policy Engine
                    </h1>
                    <p className="text-muted-grey">Global operational health, revenue sharing, and fleet resilience governance.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Dynamic Pricing */}
                    <PolicyCard
                        title="Dynamic Pricing Architecture"
                        icon="💰"
                        rules={[
                            { label: "AI Surge Pricing Toggle", active: true },
                            { label: "Tier-Based Commission Splits", active: true },
                            { label: "Corporate Subsidization Logic", active: false }
                        ]}
                    />

                    {/* Fleet Resilience */}
                    <PolicyCard
                        title="Fleet Resilience & Maintenance"
                        icon="🛡️"
                        rules={[
                            { label: "Auto-Blackout for Maintenance", active: true },
                            { label: "Vehicle Health Thresholds", active: true },
                            { label: "Mandatory Service Windows", active: true }
                        ]}
                    />

                    {/* Cancellation Logic */}
                    <PolicyCard
                        title="Cancellation & Refund Logic"
                        icon="⚖️"
                        rules={[
                            { label: "Passenger Penalty Tiers", active: true },
                            { label: "Driver Compensation Protection", active: true },
                            { label: "No-Show Fee Automation", active: true }
                        ]}
                    />

                    {/* Resource Efficiency */}
                    <PolicyCard
                        title="Resource Efficiency"
                        icon="⚡"
                        rules={[
                            { label: "Idle Time Minimization AI", active: true },
                            { label: "Fleet Partitioning (Premium Reserves)", active: false },
                            { label: "Proximity Weighting Toggle", active: true }
                        ]}
                    />
                </div>

                <div className="mt-12 p-8 glass-panel rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                    <h3 className="text-xl font-bold mb-4">Strategic Policy Impact</h3>
                    <p className="text-muted-grey leading-relaxed">
                        These global policies define the baseline behavior for all domains. Domain-specific overrides in the Configuration portal
                        will inherit or mutate these values for specialized specialized performance (e.g., Emergency Response priorities).
                    </p>
                </div>
            </div>
        </div>
    );
}

function PolicyCard({ title, icon, rules }: { title: string, icon: string, rules: { label: string, active: boolean }[] }) {
    return (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                {title}
            </h2>
            <div className="space-y-4 flex-grow">
                {rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-sm font-medium">{rule.label}</span>
                        <div className={`w-3 h-3 rounded-full ${rule.active ? 'bg-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.6)]' : 'bg-white/10'}`}></div>
                    </div>
                ))}
            </div>
            <button className="mt-8 text-sm font-bold text-pulse-orange hover:underline">Edit Policy Parameters →</button>
        </div>
    );
}
