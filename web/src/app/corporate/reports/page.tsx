import React from 'react';

const reportData = [
    { id: 1, name: 'Monthly Expense Summary', date: 'Feb 2026', type: 'Financial', status: 'Ready' },
    { id: 2, name: 'Departmental Breakdown', date: 'Jan 2026', type: 'Analytics', status: 'Ready' },
    { id: 3, name: 'Sustainability & ESG Carbon Footprint', date: 'Q1 2026', type: 'ESG', status: 'In Progress' },
];

export default function CorporateReportsPage() {
    const handleExport = (name: string) => {
        alert(`Generating PDF Export for: ${name}\nYour download will begin shortly...`);
    };

    return (
        <div className="reports-container">
            <div className="portal-card">
                <h3>Corporate Intelligence & Reports</h3>
                <p className="description">Generate and export detailed analytics for your workforce logistics.</p>

                <div className="reports-grid mt-6">
                    <div className="report-config">
                        <h4>Generate Custom Report</h4>
                        <div className="form-group mt-4">
                            <label>Select Period</label>
                            <select>
                                <option>Last 30 Days</option>
                                <option>Last Quarter</option>
                                <option>Custom Range</option>
                            </select>
                        </div>
                        <div className="form-group mt-3">
                            <label>Report Type</label>
                            <select>
                                <option>Expense Audit (VAT Inclusive)</option>
                                <option>Employee Utilization</option>
                                <option>Sustainability Report</option>
                            </select>
                        </div>
                        <button className="btn-primary mt-4 w-full" onClick={() => handleExport('Custom Audit Report')}>
                            Generate & Export PDF
                        </button>
                    </div>

                    <div className="report-stats">
                        <div className="mini-stat">
                            <span className="label">Total Reports Generated</span>
                            <span className="val">142</span>
                        </div>
                        <div className="mini-stat">
                            <span className="label">Scheduled Exports</span>
                            <span className="val">4 Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="portal-card mt-6">
                <h3>Recent Generated Reports</h3>
                <div className="report-list mt-4">
                    {reportData.map(report => (
                        <div key={report.id} className="report-row">
                            <div className="report-info">
                                <span className="report-icon">📄</span>
                                <div>
                                    <span className="report-name">{report.name}</span>
                                    <span className="report-meta">{report.date} • {report.type}</span>
                                </div>
                            </div>
                            <div className="report-actions">
                                <span className={`status-pill ${report.status === 'Ready' ? 'ready' : 'processing'}`}>
                                    {report.status}
                                </span>
                                <button
                                    className="btn-link"
                                    disabled={report.status !== 'Ready'}
                                    onClick={() => handleExport(report.name)}
                                >
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .reports-container { padding: 20px 0; }
        .mt-3 { margin-top: 12px; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 32px; }
        .w-full { width: 100%; }
        
        .reports-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 700; color: #1e293b; }
        .form-group select { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; }
        
        .report-stats { display: flex; flex-direction: column; gap: 16px; }
        .mini-stat { padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
        .mini-stat .label { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; }
        .mini-stat .val { font-size: 24px; font-weight: 800; color: #1e293b; }
        
        .report-list { border-top: 1px solid #f1f5f9; }
        .report-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
        .report-info { display: flex; gap: 16px; align-items: center; }
        .report-icon { font-size: 24px; }
        .report-name { display: block; font-weight: 700; color: #1e293b; }
        .report-meta { font-size: 12px; color: #64748b; }
        
        .report-actions { display: flex; align-items: center; gap: 16px; }
        .status-pill { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .status-pill.ready { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.processing { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .btn-link { background: none; border: none; color: #3b82f6; cursor: pointer; font-weight: 700; font-size: 13px; }
        .btn-link:disabled { color: #cbd5e1; cursor: not-allowed; }
      `}</style>
        </div>
    );
}
