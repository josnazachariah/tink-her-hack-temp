import { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus, getUsers, deleteUser } from '../store';
import { CheckCircle, Clock, CheckSquare, FileText, MapPin, Tag, Users, ArrowUpDown, Trash2, Filter } from 'lucide-react';
import './Dashboard.css';

function AdminDashboard({ user }) {
    const [complaints, setComplaints] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'users'
    const [sortBy, setSortBy] = useState('priority'); // 'priority' or 'date'

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        loadComplaints();
        setUsers(getUsers());
    };

    const loadComplaints = () => {
        const data = getComplaints();
        const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };

        let sortedData = [...data];

        if (sortBy === 'priority') {
            sortedData.sort((a, b) => {
                const weightA = priorityWeight[a.priority] || 0;
                const weightB = priorityWeight[b.priority] || 0;
                if (weightA !== weightB) return weightB - weightA;
                return new Date(b.date) - new Date(a.date);
            });
        } else {
            sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        setComplaints(sortedData);
    };

    useEffect(() => {
        loadComplaints();
    }, [sortBy]);

    const handleStatusChange = (id, newStatus) => {
        updateComplaintStatus(id, newStatus);
        loadComplaints();
    };

    const handleDeleteUser = (email) => {
        if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
            deleteUser(email);
            setUsers(getUsers());
        }
    };

    const pendingCount = complaints.filter(c => c.status === 'Pending').length;
    const progressCount = complaints.filter(c => c.status === 'In Progress').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="badge badge-pending">Pending</span>;
            case 'In Progress': return <span className="badge badge-progress">In Progress</span>;
            case 'Resolved': return <span className="badge badge-resolved">Resolved</span>;
            default: return null;
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'High': return <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>High Priority</span>;
            case 'Medium': return <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>Medium Priority</span>;
            case 'Low': return <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>Low Priority</span>;
            default: return null;
        }
    };

    return (
        <div className="dashboard-page page-container animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h2>Admin Management</h2>
                    <p className="text-light">Operational overview and user control center.</p>
                </div>
                <div className="admin-header-stats">
                    <div className="stat-box">
                        <span className="stat-num">{pendingCount}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-num">{progressCount}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-num">{resolvedCount}</span>
                        <span className="stat-label">Resolved</span>
                    </div>
                </div>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    <FileText size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    Reports & Urgency
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    User Directory
                </button>
            </div>

            {activeTab === 'reports' ? (
                <div className="reports-section">
                    <div className="sort-controls">
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-light)' }}>
                            <Filter size={14} style={{ marginRight: '4px' }} /> Sort by:
                        </span>
                        <select
                            className="select"
                            style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 1rem' }}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="priority">Urgency (High First)</option>
                            <option value="date">Newest Date</option>
                        </select>
                    </div>

                    <div className="complaints-list">
                        {complaints.length === 0 ? (
                            <div className="empty-state card text-center">
                                <FileText size={48} className="empty-icon" />
                                <h3>No reports found</h3>
                                <p className="text-light">The city is running smoothly!</p>
                            </div>
                        ) : (
                            <div className="complaints-grid">
                                {complaints.map(complaint => (
                                    <div key={complaint.id} className="complaint-card card">
                                        <div className="complaint-header">
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                {getStatusBadge(complaint.status)}
                                                {getPriorityBadge(complaint.priority)}
                                            </div>
                                            <span className="complaint-date">
                                                {new Date(complaint.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="complaint-title">{complaint.title}</h4>
                                        <div className="complaint-meta">
                                            <span className="meta-item"><Tag size={14} /> {complaint.category}</span>
                                            <span className="meta-item"><MapPin size={14} /> {complaint.location}</span>
                                        </div>
                                        <p className="complaint-desc">{complaint.description}</p>

                                        <div className="complaint-footer admin-footer">
                                            <span className="complaint-user">By: {complaint.userEmail}</span>
                                            <span className="complaint-id">#{complaint.id.slice(-6)}</span>
                                        </div>

                                        <div className="admin-controls">
                                            <label className="text-light mb-1" style={{ display: 'block', fontSize: '0.8rem' }}>Update Progress:</label>
                                            <select
                                                className="select"
                                                value={complaint.status}
                                                onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending Review</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="users-section animate-fade-in">
                    <div className="user-table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.email}>
                                        <td>{u.name || 'Anonymous'}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'admin' ? 'badge-progress' : 'badge-pending'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            {u.role !== 'admin' && (
                                                <button
                                                    className="btn-link text-red"
                                                    onClick={() => handleDeleteUser(u.email)}
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
