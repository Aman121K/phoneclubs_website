import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalUsers: 0,
    totalCategories: 0,
    singleSell: 0,
    bulkSell: 0,
    auctions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const [listingsRes, usersRes, categoriesRes] = await Promise.all([
        axios.get('/api/admin/listings?limit=1000'),
        axios.get('/api/admin/users'),
        axios.get('/api/categories')
      ]);

      const listings = listingsRes.data;
      const users = usersRes.data;
      const categories = categoriesRes.data;

      setStats({
        totalListings: listings.length,
        activeListings: listings.filter(l => l.status === 'active').length,
        totalUsers: users.length,
        totalCategories: categories.length,
        singleSell: listings.filter(l => l.sellType === 'single').length,
        bulkSell: listings.filter(l => l.sellType === 'bulk').length,
        auctions: listings.filter(l => l.listingType === 'auction').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-header-actions">
            <span className="admin-user">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <Link to="/admin" className="admin-nav-item active">
              <i className="fas fa-chart-line"></i> Dashboard
            </Link>
            <Link to="/admin/listings" className="admin-nav-item">
              <i className="fas fa-list"></i> Listings
            </Link>
            <Link to="/admin/users" className="admin-nav-item">
              <i className="fas fa-users"></i> Users
            </Link>
            <Link to="/admin/categories" className="admin-nav-item">
              <i className="fas fa-tags"></i> Categories
            </Link>
          </nav>
        </div>

        <div className="admin-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fas fa-list"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.totalListings}</h3>
                <p>Total Listings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.activeListings}</h3>
                <p>Active Listings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-tags"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.totalCategories}</h3>
                <p>Categories</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon teal">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.singleSell}</h3>
                <p>Single Sell</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">
                <i className="fas fa-boxes"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.bulkSell}</h3>
                <p>Bulk Sell</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow">
                <i className="fas fa-gavel"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.auctions}</h3>
                <p>Auctions</p>
              </div>
            </div>
          </div>

          <div className="admin-quick-actions">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <Link to="/admin/listings?action=create" className="quick-action-card">
                <i className="fas fa-plus-circle"></i>
                <h3>Create New Listing</h3>
                <p>Add a new phone listing (single or bulk)</p>
              </Link>
              <Link to="/admin/categories?action=create" className="quick-action-card">
                <i className="fas fa-tag"></i>
                <h3>Add Category</h3>
                <p>Create a new phone category</p>
              </Link>
              <Link to="/admin/listings?filter=featured" className="quick-action-card">
                <i className="fas fa-star"></i>
                <h3>Manage Featured</h3>
                <p>Mark listings as featured</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

