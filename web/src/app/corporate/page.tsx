export default function CorporateDashboard() {
    return (
        <div>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Rides (MTD)</div>
                    <div className="stat-value">1,284</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Spending (AED)</div>
                    <div className="stat-value">42,500.00</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Active Employees</div>
                    <div className="stat-value">450</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Compliance Rate</div>
                    <div className="stat-value">98.2%</div>
                </div>
            </div>

            <div className="data-card">
                <div className="card-header">
                    <h3>Recent Corporate Rides</h3>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 600 }}>View All</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Dept</th>
                            <th>Route</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Fare</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>Sales</td>
                            <td>DIFC → Dubai Airport</td>
                            <td>LIMO</td>
                            <td><span className="status-badge status-active">Completed</span></td>
                            <td>AED 150.00</td>
                        </tr>
                        <tr>
                            <td>Sarah Smith</td>
                            <td>IT</td>
                            <td>Media City → Marina</td>
                            <td>TAXI</td>
                            <td><span className="status-badge status-active">In Progress</span></td>
                            <td>AED 45.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
