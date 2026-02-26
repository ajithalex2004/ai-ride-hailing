import React from 'react';

const limits = [
    { id: 1, department: 'Engineering', limit: 'AED 5,000', used: 'AED 1,200', pct: 24 },
    { id: 2, department: 'Sales & Marketing', limit: 'AED 12,000', used: 'AED 8,400', pct: 70 },
    { id: 3, department: 'Executive', limit: 'AED 20,000', used: 'AED 15,000', pct: 75 },
];

export default function CorporateWalletPage() {
    return (
        <div className="billing-container">
            <div className="stats-row">
                <div className="portal-card billing-main">
                    <h3>Centralized Wallet Balance</h3>
                    <div className="balance-box">
                        <span className="balance-val">AED 84,250.00</span>
                        <span className="balance-label">Available Funds</span>
                    </div>
                    <div className="billing-actions">
                        <button className="btn-primary">Top Up Wallet</button>
                        <button className="btn-sec">Download Monthly Statement</button>
                    </div>
                </div>

                <div className="portal-card auto-topup">
                    <h3>Auto Top-Up Settings</h3>
                    <div className="toggle-row">
                        <span>Automatic Recharging</span>
                        <span className="status-badge success">ENABLED</span>
                    </div>
                    <p className="description">Recharge AED 10,000 when balance falls below AED 5,000.</p>
                    <button className="btn-link">Edit Settings</button>
                </div>
            </div>

            <div className="portal-card mt-6">
                <h3 className="mb-4">Departmental Budget Limits</h3>
                <table className="portal-table">
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Monthly Limit</th>
                            <th>Current Spend</th>
                            <th>Utilization</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limits.map((item) => (
                            <tr key={item.id}>
                                <td className="font-bold">{item.department}</td>
                                <td>{item.limit}</td>
                                <td>{item.used}</td>
                                <td>
                                    <div className="progress-bg">
                                        <div
                                            className={`progress-fill ${item.pct > 80 ? 'bg-danger' : 'bg-success'}`}
                                            style={{ width: `${item.pct}%` }}
                                        ></div>
                                    </div>
                                    <span className="pct-text">{item.pct}%</span>
                                </td>
                                <td>
                                    <button className="btn-sm">Adjust Limit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="portal-card mt-6">
                <h3>Ride Subsidy Rules</h3>
                <div className="rules-list">
                    <div className="rule-item">
                        <div className="rule-info">
                            <span className="rule-title">Late Night Work Subsidy</span>
                            <span className="rule-desc">100% covered for rides between 10 PM and 6 AM.</span>
                        </div>
                        <span className="status-badge success">ACTIVE</span>
                    </div>
                    <div className="rule-item">
                        <div className="rule-info">
                            <span className="rule-title">Inter-Office Shuttle</span>
                            <span className="rule-desc">DIFC to Dubai Marina - Subsidized up to AED 40.</span>
                        </div>
                        <span className="status-badge success">ACTIVE</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .billing-container { padding: 20px 0; }
        .stats-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
        .billing-main { background: #101113; color: white; }
        .balance-box { margin: 24px 0; }
        .balance-val { font-size: 36px; font-weight: 800; display: block; }
        .balance-label { color: #64748b; font-size: 14px; }
        .billing-actions { display: flex; gap: 12px; }
        .btn-sec { background: transparent; border: 1px solid #333; color: white; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
        
        .auto-topup .toggle-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .status-badge { padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 800; }
        .status-badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .description { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .btn-link { background: none; border: none; color: #3b82f6; padding: 0; cursor: pointer; text-decoration: underline; font-size: 13px; }
        
        .mt-6 { margin-top: 32px; }
        .mb-4 { margin-bottom: 16px; }
        .progress-bg { width: 100%; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
        .progress-fill { height: 100%; border-radius: 3px; }
        .bg-success { background: #10b981; }
        .bg-danger { background: #ef4444; }
        .pct-text { font-size: 11px; color: #64748b; font-weight: 600; }
        
        .rule-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
        .rule-title { display: block; font-weight: 700; color: #1e293b; }
        .rule-desc { font-size: 13px; color: #64748b; }
        .btn-sm { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
      `}</style>
        </div>
    );
}
