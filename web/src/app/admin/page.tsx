import FleetMap from './components/FleetMap';

export default function AdminDashboard() {
    return (
        <div>
            <div className="admin-grid">
                <div className="admin-card">
                    <div className="admin-stat-label">Active Rides</div>
                    <div className="admin-stat-value">4,128</div>
                    <div style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.5rem' }}>↑ 12% vs last hour</div>
                </div>
                <div className="admin-card">
                    <div className="admin-stat-label">Drivers Online</div>
                    <div className="admin-stat-value">1,890</div>
                    <div style={{ color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.5rem' }}>High Demand in Dubai</div>
                </div>
                <div className="admin-card">
                    <div className="admin-stat-label">Revenue (24h)</div>
                    <div className="admin-stat-value">AED 842.5k</div>
                    <div style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.5rem' }}>↑ 8.4% growth</div>
                </div>
                <div className="admin-card">
                    <div className="admin-stat-label">AI Dispatch Avg</div>
                    <div className="admin-stat-value"><span>4.2m ETA</span></div>
                    <div style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.5rem' }}>Highly Optimized</div>
                </div>
            </div>

            <FleetMap />

            <div className="admin-table-container">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Active Dispatch Requests</h4>
                    <span style={{ color: 'var(--admin-accent)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>View Live Queue</span>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Category</th>
                            <th>Region</th>
                            <th>Optimization</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#RID-2940</td>
                            <td>LIMO (Pre-book)</td>
                            <td>Riyadh</td>
                            <td>Max Driver Rating</td>
                            <td><span className="badge-status badge-success">Matched</span></td>
                            <td><button style={{ background: 'transparent', border: 'none', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 600 }}>Track</button></td>
                        </tr>
                        <tr>
                            <td>#RID-2941</td>
                            <td>TAXI</td>
                            <td>Dubai</td>
                            <td>Shortest ETA</td>
                            <td><span className="badge-status badge-warning">Searching</span></td>
                            <td><button style={{ background: 'transparent', border: 'none', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 600 }}>Details</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
