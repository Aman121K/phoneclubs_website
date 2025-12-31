import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminListings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    sellType: '',
    listingType: '',
    status: '',
    category: '',
    city: ''
  });
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    price: '',
    storage: '',
    condition: '',
    city: '',
    listing_type: 'fixed_price',
    sellType: 'single',
    image_url: '',
    color: '',
    warranty: false,
    quantity: 1,
    isFeatured: false,
    status: 'active',
    start_price: '',
    end_date: ''
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
    fetchListings();
  }, [user, navigate, searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchListings = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.sellType) queryParams.append('sellType', filters.sellType);
      if (filters.listingType) queryParams.append('listingType', filters.listingType);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.city) queryParams.append('city', filters.city);

      const response = await axios.get(`/api/admin/listings?${queryParams.toString()}`);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchListings();
    }
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/listings', formData);
      alert('Listing created successfully!');
      setShowCreateForm(false);
      setFormData({
        category_id: '',
        title: '',
        description: '',
        price: '',
        storage: '',
        condition: '',
        city: '',
        listing_type: 'fixed_price',
        sellType: 'single',
        image_url: '',
        color: '',
        warranty: false,
        quantity: 1,
        isFeatured: false,
        status: 'active',
        start_price: '',
        end_date: ''
      });
      fetchListings();
    } catch (error) {
      alert('Error creating listing: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleToggleFeatured = async (listingId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/listings/${listingId}`, {
        isFeatured: !currentStatus
      });
      fetchListings();
    } catch (error) {
      alert('Error updating listing');
    }
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await axios.patch(`/api/admin/listings/${listingId}`, {
        status: newStatus
      });
      fetchListings();
    } catch (error) {
      alert('Error updating listing status');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Listings</h1>
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
            <a href="/admin/listings" className="admin-nav-item active">
              <i className="fas fa-list"></i> Listings
            </a>
            <a href="/admin/users" className="admin-nav-item">
              <i className="fas fa-users"></i> Users
            </a>
            <a href="/admin/categories" className="admin-nav-item">
              <i className="fas fa-tags"></i> Categories
            </a>
          </nav>
        </div>

        <div className="admin-content">
          <div className="admin-toolbar">
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="admin-btn primary">
              <i className="fas fa-plus"></i> {showCreateForm ? 'Cancel' : 'Create New Listing'}
            </button>
          </div>

          {showCreateForm && (
            <div className="admin-form-card">
              <h2>Create New Listing</h2>
              <form onSubmit={handleCreateListing}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category_id" value={formData.category_id} onChange={handleFormChange} required>
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <select name="city" value={formData.city} onChange={handleFormChange} required>
                      <option value="">Select City</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                      <option value="Ras al Khaimah">Ras al Khaimah</option>
                      <option value="Fujairah">Fujairah</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleFormChange} required />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sell Type *</label>
                    <select name="sellType" value={formData.sellType} onChange={handleFormChange} required>
                      <option value="single">Single Sell</option>
                      <option value="bulk">Bulk Sell</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Listing Type *</label>
                    <select name="listing_type" value={formData.listing_type} onChange={handleFormChange} required>
                      <option value="fixed_price">Fixed Price</option>
                      <option value="auction">Auction</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (AED) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleFormChange} required min="0" step="0.01" />
                  </div>
                  {formData.listing_type === 'auction' && (
                    <>
                      <div className="form-group">
                        <label>Start Price (AED) *</label>
                        <input type="number" name="start_price" value={formData.start_price} onChange={handleFormChange} required min="0" step="0.01" />
                      </div>
                      <div className="form-group">
                        <label>End Date *</label>
                        <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleFormChange} required />
                      </div>
                    </>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Storage</label>
                    <select name="storage" value={formData.storage} onChange={handleFormChange}>
                      <option value="">Select Storage</option>
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <select name="condition" value={formData.condition} onChange={handleFormChange}>
                      <option value="">Select Condition</option>
                      <option value="Brand New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} min="1" />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input type="url" name="image_url" value={formData.image_url} onChange={handleFormChange} />
                </div>

                <div className="form-row">
                  <div className="form-group checkbox-group">
                    <label>
                      <input type="checkbox" name="warranty" checked={formData.warranty} onChange={handleFormChange} />
                      Warranty Included
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleFormChange} />
                      Featured Listing
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select name="status" value={formData.status} onChange={handleFormChange} required>
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <button type="submit" className="admin-btn primary">Create Listing</button>
              </form>
            </div>
          )}

          <div className="admin-filters">
            <h3>Filters</h3>
            <div className="filters-grid">
              <select name="sellType" value={filters.sellType} onChange={handleFilterChange}>
                <option value="">All Sell Types</option>
                <option value="single">Single Sell</option>
                <option value="bulk">Bulk Sell</option>
              </select>
              <select name="listingType" value={filters.listingType} onChange={handleFilterChange}>
                <option value="">All Listing Types</option>
                <option value="fixed_price">Fixed Price</option>
                <option value="auction">Auction</option>
              </select>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="expired">Expired</option>
              </select>
              <select name="city" value={filters.city} onChange={handleFilterChange}>
                <option value="">All Cities</option>
                <option value="Dubai">Dubai</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Ajman">Ajman</option>
              </select>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Sell Type</th>
                  <th>Price</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing._id || listing.id}>
                    <td>{listing.title}</td>
                    <td>{listing.listingType}</td>
                    <td>{listing.sellType || 'single'}</td>
                    <td>AED {listing.price}</td>
                    <td>{listing.city}</td>
                    <td>
                      <select 
                        value={listing.status} 
                        onChange={(e) => handleStatusChange(listing._id || listing.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="active">Active</option>
                        <option value="sold">Sold</option>
                        <option value="expired">Expired</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(listing._id || listing.id, listing.isFeatured)}
                        className={`featured-btn ${listing.isFeatured ? 'active' : ''}`}
                      >
                        {listing.isFeatured ? '★ Featured' : '☆ Not Featured'}
                      </button>
                    </td>
                    <td>
                      <a href={`/listing/${listing._id || listing.id}`} target="_blank" rel="noopener noreferrer" className="admin-link">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {listings.length === 0 && <p className="no-data">No listings found</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminListings;

