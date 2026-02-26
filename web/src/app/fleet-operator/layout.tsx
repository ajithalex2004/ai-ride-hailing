import './fleet.css';

export default function FleetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fleet-container">
            <aside className="fleet-sidebar">
                <div className="fleet-logo">FLEET MANAGER</div>
                <nav className="fleet-nav">
                    <div className="fleet-nav-item active">Overview</div>
                    <div className="fleet-nav-item">Active Drivers</div>
                    <div className="fleet-nav-item">Vehicle Pool</div>
                    <div className="fleet-nav-item">Dispatch Monitor</div>
                    <div className="fleet-nav-item">Earnings & Payouts</div>
                    <div className="fleet-nav-item">Settings</div>
                </nav>
                <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Fleet ID: FLT-2094</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Region: Dubai</p>
                </div>
            </aside>
            <main className="fleet-main">
                <header className="fleet-header">
                    <div>
                        <h1>Fleet Dashboard</h1>
                        <p style={{ color: 'var(--fleet-muted)' }}>Welcome, Al-Futtaim Logistics Admin</p>
                    </div>
                    <button style={{ backgroundColor: 'var(--fleet-accent)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>
                        Register New Vehicle
                    </button>
                </header>
                {children}
            </main>
        </div>
    );
}
