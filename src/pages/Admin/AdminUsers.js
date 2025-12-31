import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Users</h1>
          <div className="admin-header-actions">
            <span className="admin-user">Welcome, {user?.name}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="admin-logout-btn">Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <a href="/admin" className="admin-nav-item">
              <i className="fas fa-chart-line"></i> Dashboard
            </a>
            <a href="/admin/listings" className="admin-nav-item">
              <i className="fas fa-list"></i> Listings
            </a>
            <a href="/admin/users" className="admin-nav-item active">
              <i className="fas fa-users"></i> Users
            </a>
            <a href="/admin/categories" className="admin-nav-item">
              <i className="fas fa-tags"></i> Categories
            </a>
          </nav>
        </div>

        <div className="admin-content">
          <div className="admin-stats-bar">
            <div className="stat-badge">
              <span className="stat-label">Total Users:</span>
              <span className="stat-value">{users.length}</span>
            </div>
            <div className="stat-badge">
              <span className="stat-label">Buyers:</span>
              <span className="stat-value">{users.filter(u => u.userType === 'buyer').length}</span>
            </div>
            <div className="stat-badge">
              <span className="stat-label">Sellers:</span>
              <span className="stat-value">{users.filter(u => u.userType === 'seller').length}</span>
            </div>
            <div className="stat-badge">
              <span className="stat-label">Admins:</span>
              <span className="stat-value">{users.filter(u => u.role === 'admin').length}</span>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>User Type</th>
                  <th>Seller Type</th>
                  <th>Business Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(userItem => (
                  <tr key={userItem._id || userItem.id}>
                    <td>{userItem.name}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.city || 'N/A'}</td>
                    <td>
                      <span className={`badge ${userItem.userType === 'seller' ? 'badge-seller' : 'badge-buyer'}`}>
                        {userItem.userType || 'buyer'}
                      </span>
                    </td>
                    <td>{userItem.sellerType || 'N/A'}</td>
                    <td>{userItem.businessName || 'N/A'}</td>
                    <td>
                      <span className={`badge ${userItem.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {userItem.role || 'user'}
                      </span>
                    </td>
                    <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="no-data">No users found</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

