import './admin.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-body">
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <div className="admin-logo">
                        <div className="live-dot" style={{ backgroundColor: 'var(--admin-accent)' }}></div>
                        CENTRAL COMMAND
                    </div>
                    <nav className="admin-nav">
                        <li><a href="/admin" className="nav-item active">Dashboard</a></li>
                        <li><a href="/admin/security" className="nav-item">Security & Fraud</a></li>
                        <li><a href="#" className="nav-item">Monitor AI</a></li>
                        <li><a href="#" className="nav-item">Fleet Operators</a></li>
                        <li><a href="#" className="nav-item">Corporate Accounts</a></li>
                        <li><a href="#" className="nav-item">Pricing & Surge</a></li>
                        <li><a href="#" className="nav-item">User Management</a></li>
                        <li><a href="#" className="nav-item">Reporting</a></li>
                    </nav>
                    <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--admin-border)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-muted)' }}>Powered by EXL Solutions</p>
                    </div>
                </aside>
                <main className="admin-main">
                    <header className="admin-header">
                        <div>
                            <h3>System Overview</h3>
                            <p style={{ color: 'var(--admin-muted)', fontSize: '0.875rem' }}>Global Command Center | All Regions</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: 600 }}>System Status</p>
                                <p style={{ color: '#10b981', fontSize: '0.75rem' }}>9 Services Online</p>
                            </div>
                        </div>
                    </header>
                    {children}
                </main>
            </div>
        </div>
    );
}
