import './portal.css';

export default function CorporateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="portal-container">
            <aside className="sidebar">
                <div className="sidebar-logo">AI RIDE CORPORATE</div>
                <nav>
                    <ul className="nav-links">
                        <li><a href="/corporate" className="nav-item">Dashboard</a></li>
                        <li className="nav-item">Departments</li>
                        <li><a href="/corporate/employees" className="nav-item">Employees & Onboarding</a></li>
                        <li className="nav-item">Ride History</li>
                        <li className="nav-item">Invoices</li>
                        <li><a href="/corporate/reports" className="nav-item">Reports & PDF Export</a></li>
                        <li><a href="/corporate/billing" className="nav-item">Wallet & Billing</a></li>
                        <li><a href="/corporate/security" className="nav-item">Corporate Security</a></li>
                        <li className="nav-item">Travel Rules</li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <header className="header">
                    <div>
                        <h1>Corporate Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back, EXL Solutions Admin</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary">Book a Ride</button>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
