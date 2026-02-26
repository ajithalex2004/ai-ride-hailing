import React, { useState } from 'react';

const initialEmployees = [
    { id: 1, name: 'Zayed bin Rashid', email: 'zayed@exlsolutions.com', dept: 'Engineering', status: 'Active' },
    { id: 2, name: 'Sara Al-Hamer', email: 'sara@exlsolutions.com', dept: 'Marketing', status: 'Pending Invite' },
];

export default function EmployeeOnboardingPage() {
    const [showAdd, setShowAdd] = useState(false);
    const [employees, setEmployees] = useState(initialEmployees);

    const handleAdd = (e: any) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const dept = e.target.dept.value;

        setEmployees([...employees, { id: Date.now(), name, email, dept, status: 'Onboarding' }]);
        setShowAdd(false);
    };

    return (
        <div className="onboarding-container">
            <div className="portal-card flex-between">
                <div>
                    <h3>Employee Directory</h3>
                    <p className="description">Manage access and ride subsidies for your global workforce.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Onboard Employee</button>
            </div>

            {showAdd && (
                <div className="portal-card modal-like mt-6">
                    <h3>Add New Employee</h3>
                    <form className="mt-4 onboarding-form" onSubmit={handleAdd}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input name="name" placeholder="e.g. Ahmed Sulaiman" required />
                        </div>
                        <div className="form-group">
                            <label>Work Email</label>
                            <input name="email" type="email" placeholder="ahmed@exlsolutions.com" required />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <select name="dept">
                                <option>Engineering</option>
                                <option>Sales & Marketing</option>
                                <option>Human Resources</option>
                                <option>Executive</option>
                            </select>
                        </div>
                        <div className="form-actions mt-4">
                            <button type="button" className="btn-sec" onClick={() => setShowAdd(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Send Invite & Onboard</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="portal-card mt-6">
                <table className="portal-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Corporate Email</th>
                            <th>Department</th>
                            <th>Billing Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>
                                    <div className="emp-info">
                                        <div className="avatar-mini">{emp.name[0]}</div>
                                        <span className="font-bold">{emp.name}</span>
                                    </div>
                                </td>
                                <td className="text-muted">{emp.email}</td>
                                <td>{emp.dept}</td>
                                <td>
                                    <span className={`status-tag ${emp.status === 'Active' ? 'tag-success' : 'tag-warning'}`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-sm">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .onboarding-container { padding: 20px 0; }
        .flex-between { display: flex; justify-content: space-between; align-items: start; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 32px; }
        .onboarding-form { display: grid; gap: 16px; max-width: 500px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 700; color: #1e293b; }
        .form-group input, .form-group select { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
        .form-actions { display: flex; gap: 12px; }
        
        .emp-info { display: flex; align-items: center; gap: 10px; }
        .avatar-mini { width: 28px; height: 28px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
        .status-tag { padding: 4px 10px; border-radius: 99px; font-size: 10px; font-weight: 800; }
        .tag-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .tag-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .btn-sm { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
      `}</style>
        </div>
    );
}
