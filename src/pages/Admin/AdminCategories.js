import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminCategories = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    if (searchParams.get('action') === 'create') {
      setShowCreateForm(true);
    }
    fetchCategories();
  }, [user, navigate, searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      name,
      slug: generateSlug(name)
    });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/categories', formData);
      alert('Category created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', slug: '' });
      fetchCategories();
    } catch (error) {
      alert('Error creating category: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Categories</h1>
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
            <a href="/admin/users" className="admin-nav-item">
              <i className="fas fa-users"></i> Users
            </a>
            <a href="/admin/categories" className="admin-nav-item active">
              <i className="fas fa-tags"></i> Categories
            </a>
          </nav>
        </div>

        <div className="admin-content">
          <div className="admin-toolbar">
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="admin-btn primary">
              <i className="fas fa-plus"></i> {showCreateForm ? 'Cancel' : 'Create New Category'}
            </button>
          </div>

          {showCreateForm && (
            <div className="admin-form-card">
              <h2>Create New Category</h2>
              <form onSubmit={handleCreateCategory}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g., iPhone 16 Pro Max"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleFormChange}
                    placeholder="e.g., iphone-16-pro-max"
                    required
                  />
                  <small>URL-friendly identifier (auto-generated from name)</small>
                </div>
                <button type="submit" className="admin-btn primary">Create Category</button>
              </form>
            </div>
          )}

          <div className="admin-stats-bar">
            <div className="stat-badge">
              <span className="stat-label">Total Categories:</span>
              <span className="stat-value">{categories.length}</span>
            </div>
          </div>

          <div className="categories-grid">
            {categories.map(category => (
              <div key={category._id || category.id} className="category-card-admin">
                <div className="category-card-header">
                  <h3>{category.name}</h3>
                  <span className="category-badge">{category.ad_count || 0} Ads</span>
                </div>
                <div className="category-card-body">
                  <p><strong>Slug:</strong> {category.slug}</p>
                  <a href={`/category/${category.slug}`} target="_blank" rel="noopener noreferrer" className="admin-link">
                    View Category <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
          {categories.length === 0 && <p className="no-data">No categories found</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;

