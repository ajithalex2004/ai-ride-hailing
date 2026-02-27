"use client";

import React, { useState } from 'react';

export default function DomainConfigPage() {
    const [domainType, setDomainType] = useState('TRANSPORT');

    return (
        <div className="min-h-screen bg-deep-space text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pulse-orange to-neon-blue bg-clip-text text-transparent mb-2">
                        Strategic Domain Segregation
                    </h1>
                    <p className="text-muted-grey">Configure core business rules and segregation logic for the Mobility OS.</p>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {/* Basic Configuration */}
                    <section className="glass-panel p-8 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pulse-orange animate-pulse"></span>
                            Basic Configuration
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-muted-grey">Domain Type</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-neon-blue transition-colors"
                                    value={domainType}
                                    onChange={(e) => setDomainType(e.target.value)}
                                >
                                    <option value="TRANSPORT">Commercial Transport</option>
                                    <option value="EMERGENCY">Emergency Response</option>
                                    <option value="RESCUE">Rescue Operations</option>
                                    <option value="LOGISTICS">Logistics & Freight</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-muted-grey">Service Sub-Type</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-neon-blue transition-colors">
                                    <option>Select sub-type</option>
                                    <option>Ambulance (P1)</option>
                                    <option>Road Incident (P2)</option>
                                    <option>VIP Corporate</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-muted-grey">Global Priority</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-neon-blue transition-colors">
                                    <option>High (P1)</option>
                                    <option>Medium (P2)</option>
                                    <option>Standard</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Business Rules */}
                    <section className="glass-panel p-8 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
                            Advanced Governance Rules
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            <RuleToggle label="Approval Workflow Required" defaultChecked={false} />
                            <RuleToggle label="EPOD Required" defaultChecked={true} />
                            <RuleToggle label="Auto Dispatch" defaultChecked={true} />
                            <RuleToggle label="Auto Trip Creation" defaultChecked={true} />
                            <RuleToggle label="Auto Trip Merging" defaultChecked={false} />
                            <RuleToggle label="Strict SLA Enforcement" defaultChecked={domainType === 'EMERGENCY'} />
                            <RuleToggle label="Crew Readiness Check" defaultChecked={domainType === 'EMERGENCY'} />
                            <RuleToggle label="Priority Pre-emption" defaultChecked={domainType === 'EMERGENCY'} />
                            <RuleToggle label="Fleet Quota Locking" defaultChecked={false} />
                        </div>
                    </section>

                    <div className="flex justify-end gap-4 mt-8">
                        <button className="px-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all font-medium">Cancel</button>
                        <button className="px-8 py-3 rounded-lg bg-neon-blue text-deep-space font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RuleToggle({ label, defaultChecked }: { label: string, defaultChecked: boolean }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
            <span className="text-sm font-medium">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
            </label>
        </div>
    );
}
