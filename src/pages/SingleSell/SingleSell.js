import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../../components/ListingCard/ListingCard';
import './SingleSell.css';

const SingleSell = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    condition: '',
    storage: '',
    city: '',
    sortBy: 'newest'
  });
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    condition: '',
    storage: '',
    city: '',
    sortBy: 'newest'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [appliedFilters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('type', 'single_sell');
      
      if (appliedFilters.minPrice) params.append('minPrice', appliedFilters.minPrice);
      if (appliedFilters.maxPrice) params.append('maxPrice', appliedFilters.maxPrice);
      if (appliedFilters.condition) params.append('condition', appliedFilters.condition);
      if (appliedFilters.storage) params.append('storage', appliedFilters.storage);
      if (appliedFilters.city) params.append('city', appliedFilters.city);

      const response = await axios.get(`/api/listings?${params.toString()}`);
      
      // Handle API response structure: { listings: [...], pagination: {...} }
      let fetchedListings = [];
      if (response.data && response.data.listings && Array.isArray(response.data.listings)) {
        fetchedListings = response.data.listings;
      } else if (Array.isArray(response.data)) {
        // Fallback for direct array response
        fetchedListings = response.data;
      }

      // Apply sorting
      if (appliedFilters.sortBy === 'newest') {
        fetchedListings.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
      } else if (appliedFilters.sortBy === 'oldest') {
        fetchedListings.sort((a, b) => new Date(a.createdAt || a.created_at) - new Date(b.createdAt || b.created_at));
      } else if (appliedFilters.sortBy === 'price-high') {
        fetchedListings.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (appliedFilters.sortBy === 'price-low') {
        fetchedListings.sort((a, b) => (a.price || 0) - (b.price || 0));
      }

      setListings(fetchedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      // On error, set empty array
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      condition: '',
      storage: '',
      city: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="single-sell-page">
      <div className="page-header">
        <h3>List of ads for Single iPhone Listing</h3>
      </div>

      <div className="category-content-wrapper">
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${showMobileFilters ? 'mobile-open' : ''}`}>
          <div className="filters-sidebar-content">
          <div className="filters-header">
            <h2>Filters</h2>
            <div className="filters-header-actions">
              <button onClick={clearFilters} className="clear-filters-btn">Clear All</button>
              <button 
                className="mobile-filter-close"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h3>Price Range (AED)</h3>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="filter-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="filter-section">
            <h3>Condition</h3>
            <select
              name="condition"
              value={filters.condition}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Conditions</option>
              <option value="Brand New">Brand New</option>
              <option value="Excellent">Excellent</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          {/* Storage */}
          <div className="filter-section">
            <h3>Storage</h3>
            <select
              name="storage"
              value={filters.storage}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Storage</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
          </div>

          {/* City */}
          <div className="filter-section">
            <h3>Location</h3>
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Locations</option>
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Ras al Khaimah">Ras al Khaimah</option>
              <option value="Fujairah">Fujairah</option>
              <option value="Umm al Quwain">Umm al Quwain</option>
              <option value="Al Ain">Al Ain</option>
            </select>
          </div>

          {/* Apply Filter Button */}
          <button onClick={applyFilters} className="apply-filters-btn">
            Apply Filters
          </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="listings-main">
          <div className="listings-header">
            <p className="listings-count">{listings.length} listings found</p>
            {/* Mobile Filter Toggle Button */}
            <button 
              className="mobile-filter-toggle"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              {showMobileFilters ? (
                <>
                  <i className="fas fa-times"></i> Close
                </>
              ) : (
                <>
                  <i className="fas fa-filter"></i> Filter
                </>
              )}
            </button>
            <div className="sort-wrapper">
              <label htmlFor="sortBy">Sort by:</label>
              <select
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={(e) => {
                  handleFilterChange(e);
                  // Sort applies immediately
                  setAppliedFilters(prev => ({ ...prev, sortBy: e.target.value }));
                }}
                className="sort-select"
              >
                <option value="newest">Newest to Oldest</option>
                <option value="oldest">Oldest to Newest</option>
                <option value="price-high">Price Highest to Lowest</option>
                <option value="price-low">Price Lowest to Highest</option>
              </select>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="no-listings">
              <div className="no-listings-content">
                <div className="no-listings-emoji">📱</div>
                <h3>No Listings Found</h3>
                <p>We couldn't find any single sell listings matching your criteria.</p>
                <p className="no-listings-suggestion">Try adjusting your filters or check back later for new listings.</p>
              </div>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <ListingCard key={listing._id || listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleSell;

