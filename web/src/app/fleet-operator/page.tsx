export default function FleetDashboard() {
    return (
        <div>
            <div className="fleet-grid">
                <div className="fleet-card">
                    <div className="fleet-stat-label">Total Vehicles</div>
                    <div className="fleet-stat-value">124</div>
                </div>
                <div className="fleet-card">
                    <div className="fleet-stat-label">Drivers Online</div>
                    <div className="fleet-stat-value">86</div>
                </div>
                <div className="fleet-card">
                    <div className="fleet-stat-label">Fleet Utilization</div>
                    <div className="fleet-stat-value">92%</div>
                </div>
                <div className="fleet-card">
                    <div className="fleet-stat-label">Daily Earnings (AED)</div>
                    <div className="fleet-stat-value">18,450.00</div>
                </div>
            </div>

            <div className="fleet-table-container">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--fleet-border)', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Active Driver Tracking</h3>
                    <span style={{ color: 'var(--fleet-accent)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>View Live Map</span>
                </div>
                <table className="fleet-table">
                    <thead>
                        <tr>
                            <th>Driver Name</th>
                            <th>Vehicle</th>
                            <th>Plate Number</th>
                            <th>Last Location</th>
                            <th>Status</th>
                            <th>Ride Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Ahmed Hassan</td>
                            <td>Lexus ES 300h</td>
                            <td>A 29384</td>
                            <td>Downtown Dubai</td>
                            <td><span className="status-indicator status-online">Available</span></td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>Mohammad Ali</td>
                            <td>Toyota Camry</td>
                            <td>B 10492</td>
                            <td>DXB Airport T3</td>
                            <td><span className="status-indicator status-busy">On Trip</span></td>
                            <td>#RID-2940 (DIFC)</td>
                        </tr>
                        <tr>
                            <td>Zaid Khan</td>
                            <td>Tesla Model 3</td>
                            <td>D 88392</td>
                            <td>Media City</td>
                            <td><span className="status-indicator status-online">Available</span></td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
