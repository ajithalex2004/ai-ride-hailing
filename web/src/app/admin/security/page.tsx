import React from 'react';

const alerts = [
    { id: 1, entity: 'USR-8821', type: 'Velocity Anomaly', score: 0.92, status: 'BLOCKED', time: '2 mins ago' },
    { id: 2, entity: 'RIDE-PK-90', type: 'Payment Velocity', score: 0.65, status: 'FLAGGED', time: '15 mins ago' },
    { id: 3, entity: 'USR-1102', type: 'GPS Spoofing', score: 0.88, status: 'BLOCKED', time: '1 hour ago' },
    { id: 4, entity: 'FLEET-AX-01', type: 'Multi-account Abuse', score: 0.45, status: 'FLAGGED', time: '3 hours ago' },
];

export default function SecurityDashboard() {
    return (
        <div className="security-container">
            <div className="admin-header">
                <h1 className="admin-title">Security & Fraud Hub</h1>
                <p className="admin-subtitle">Real-time AI Guard monitoring all GCC transactions</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Active Flags</span>
                    <span className="stat-value text-warning">24</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Blocked Entities</span>
                    <span className="stat-value text-danger">12</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">System Health</span>
                    <span className="stat-value text-success">99.2%</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">AI Confidence</span>
                    <span className="stat-value">High</span>
                </div>
            </div>

            <div className="admin-card mt-6">
                <h2 className="card-title">Real-time Fraud Alerts</h2>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Entity ID</th>
                                <th>Violation Type</th>
                                <th>Risk Score</th>
                                <th>Status</th>
                                <th>Detected</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((alert) => (
                                <tr key={alert.id}>
                                    <td className="font-mono text-sm" style={{fontFamily:"var(--font-mono)"}}>{alert.entity}</td>
                                    <td>{alert.type}</td>
                                    <td>
                                        <div className="risk-bar-bg">
                                            <div
                                                className={`risk-bar-fill ${alert.score > 0.8 ? 'bg-danger' : 'bg-warning'}`}
                                                style={{ width: `${alert.score * 100}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${alert.status === 'BLOCKED' ? 'status-danger' : 'status-warning'}`}>
                                            {alert.status}
                                        </span>
                                    </td>
                                    <td className="text-muted text-sm">{alert.time}</td>
                                    <td>
                                        <button className="btn-action">Review</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .security-container {
          padding: 24px;
        }
        .mt-6 { margin-top: 24px; }
        .risk-bar-bg {
          width: 100px;
          height: 6px;
          background: #333;
          border-radius: 3px;
          overflow: hidden;
        }
        .risk-bar-fill {
          height: 100%;
        }
        .bg-danger { background: #ef4444; }
        .bg-warning { background: #f59e0b; }
        .status-pill {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }
        .status-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .status-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .btn-action {
          background: #101113;
          border: 1px solid #333;
          color: #fff;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-action:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }
      `}</style>
        </div>
    );
}

