import React from 'react';

const securityAlerts = [
    { id: 1, employee: 'Zayed bin Rashid', type: 'Out-of-Policy Trip', riskScore: 0.72, time: '10 mins ago' },
    { id: 2, employee: 'Sara Al-Hamer', type: 'Late Night Anomaly', riskScore: 0.45, time: '2 hours ago' },
    { id: 3, employee: 'Omar Farooq', type: 'Divergent Route', riskScore: 0.88, time: 'Yesterday' },
];

export default function CorporateSecurityPage() {
    return (
        <div className="security-container">
            <div className="portal-card">
                <h3>Corporate Security Pulse</h3>
                <p className="description">Dedicated monitoring for staff safety and policy compliance.</p>

                <div className="stats-row mt-4">
                    <div className="stat-item">
                        <span className="stat-label">Safety Alerts</span>
                        <span className="stat-val text-error">3 Pending</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Policy Adherence</span>
                        <span className="stat-val text-success">94.8%</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Active Trackers</span>
                        <span className="stat-val">12 Employees</span>
                    </div>
                </div>
            </div>

            <div className="portal-card mt-6">
                <h3>Compliance & Security Logs</h3>
                <table className="portal-table mt-4">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Incident Type</th>
                            <th>Policy Risk Score</th>
                            <th>Detected</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {securityAlerts.map(alert => (
                            <tr key={alert.id}>
                                <td className="font-bold">{alert.employee}</td>
                                <td>{alert.type}</td>
                                <td>
                                    <div className="risk-meter">
                                        <div
                                            className={`risk-fill ${alert.riskScore > 0.8 ? 'bg-danger' : 'bg-warning'}`}
                                            style={{ width: `${alert.riskScore * 100}%` }}
                                        ></div>
                                    </div>
                                </td>
                                <td className="text-muted">{alert.time}</td>
                                <td>
                                    <button className="btn-action">Investigate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="portal-card mt-6">
                <h3>Travel Restriction Policies</h3>
                <div className="rules-grid mt-4">
                    <div className="rule-card active">
                        <span className="rule-name">Geofence: DIFC Hub</span>
                        <span className="rule-status">ENFORCED</span>
                    </div>
                    <div className="rule-card">
                        <span className="rule-name">Luxury Mode Lockout</span>
                        <span className="rule-status">DISABLED</span>
                    </div>
                    <div className="rule-card active">
                        <span className="rule-name">MFA for High-Value Rides</span>
                        <span className="rule-status">ENFORCED</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .security-container { padding: 20px 0; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 32px; }
        .stats-row { display: flex; gap: 40px; }
        .stat-item { display: flex; flex-direction: column; }
        .stat-label { font-size: 13px; color: #64748b; }
        .stat-val { font-size: 20px; font-weight: 800; color: #1e293b; }
        .text-error { color: #ef4444; }
        .text-success { color: #10b981; }
        
        .risk-meter { width: 100px; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; display: inline-block; margin-right: 8px; }
        .risk-fill { height: 100%; }
        .bg-danger { background: #ef4444; }
        .bg-warning { background: #f59e0b; }
        
        .btn-action { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
        .rules-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .rule-card { padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }
        .rule-card.active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
        .rule-name { display: block; font-weight: 700; color: #1e293b; font-size: 14px; }
        .rule-status { font-size: 10px; font-weight: 800; color: #3b82f6; }
      `}</style>
        </div>
    );
}
