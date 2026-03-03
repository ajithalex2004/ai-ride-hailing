'use client';

import React, { useState } from 'react';
import MidnightSelect from '@/components/ui/MidnightSelect';

const DEPT_OPTIONS = [
    { value: 'Engineering', label: '💻 Engineering' },
    { value: 'Sales & Marketing', label: '📣 Sales & Marketing' },
    { value: 'Human Resources', label: '👥 Human Resources' },
    { value: 'Executive', label: '🏛️ Executive' },
];

const initialEmployees = [
    { id: 1, name: 'Zayed bin Rashid', email: 'zayed@exlsolutions.com', dept: 'Engineering', status: 'Active' },
    { id: 2, name: 'Sara Al-Hamer', email: 'sara@exlsolutions.com', dept: 'Sales & Marketing', status: 'Pending Invite' },
];

export default function EmployeeOnboardingPage() {
    const [showAdd, setShowAdd] = useState(false);
    const [employees, setEmployees] = useState(initialEmployees);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newDept, setNewDept] = useState('Engineering');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setEmployees(prev => [...prev, { id: Date.now(), name: newName, email: newEmail, dept: newDept, status: 'Onboarding' }]);
        setNewName(''); setNewEmail(''); setNewDept('Engineering'); setShowAdd(false);
    };

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'var(--font-sans)', color: 'var(--t-text)' }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.35rem' }}>Employee Directory</h1>
                    <p style={{ color: 'var(--t-text-muted)', fontSize: '0.9rem' }}>Manage access and ride subsidies for your global workforce.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAdd(v => !v)}>
                    {showAdd ? '✕ Cancel' : '+ Onboard Employee'}
                </button>
            </div>

            {/* Add form */}
            {showAdd && (
                <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }} className="animate-fade-in">
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '1.25rem' }}>Add New Employee</h3>
                    <form onSubmit={handleAdd}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 640, marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Full Name</label>
                                <input className="input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Ahmed Sulaiman" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--t-text-dim)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Work Email</label>
                                <input className="input" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="ahmed@exlsolutions.com" required />
                            </div>
                            <MidnightSelect
                                label="Department"
                                value={newDept}
                                onChange={setNewDept}
                                options={DEPT_OPTIONS}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Send Invite &amp; Onboard →</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div style={{ background: 'var(--t-card)', border: '1px solid var(--t-border)', borderRadius: 16, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Corporate Email</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--t-accent-soft)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: 'var(--t-accent)' }}>
                                            {emp.name[0]}
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{emp.name}</span>
                                    </div>
                                </td>
                                <td style={{ color: 'var(--t-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{emp.email}</td>
                                <td>{emp.dept}</td>
                                <td>
                                    <span className={`badge ${emp.status === 'Active' ? 'badge-green' : emp.status === 'Onboarding' ? 'badge-blue' : 'badge-amber'}`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-ghost" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
