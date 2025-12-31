import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../../components/ListingCard/ListingCard';
import './LocationListings.css';

const LocationListings = () => {
  const { cityName } = useParams();
  // Decode city name from URL (e.g., "abu-dhabi" -> "Abu Dhabi")
  // Convert to proper case: split by space, capitalize first letter of each word
  const citySlug = decodeURIComponent(cityName);
  const cityWords = citySlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  const city = cityWords.join(' ');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    condition: '',
    storage: '',
    sortBy: 'newest'
  });
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    condition: '',
    storage: '',
    sortBy: 'newest'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const mockListings = [
    {
      _id: '1',
      title: 'iPhone 15 Pro Max 256GB - Brand New',
      price: 4500,
      condition: 'Brand New',
      storage: '256GB',
      city: city,
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      user: { name: 'Ahmed Al Maktoum', city: city },
      category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
      createdAt: new Date('2025-01-15')
    }
  ];

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('city', city);
      
      if (appliedFilters.minPrice) params.append('minPrice', appliedFilters.minPrice);
      if (appliedFilters.maxPrice) params.append('maxPrice', appliedFilters.maxPrice);
      if (appliedFilters.condition) params.append('condition', appliedFilters.condition);
      if (appliedFilters.storage) params.append('storage', appliedFilters.storage);
      if (appliedFilters.sortBy) params.append('sortBy', appliedFilters.sortBy);

      const listingsRes = await axios.get(`/api/listings?${params.toString()}`).catch(() => ({ data: [] }));
      let fetchedListings = listingsRes.data.length > 0 ? listingsRes.data : mockListings;

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
      setListings(mockListings);
    } finally {
      setLoading(false);
    }
  }, [city, appliedFilters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

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
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="location-listings-page">
      <div className="page-header">
        <h1>Listings in {city}</h1>
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

          {/* Apply Filter Button */}
          <button onClick={applyFilters} className="apply-filters-btn">
            Apply Filters
          </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="listings-main">
          <div className="listings-header">
            <p className="listings-count">{listings.length} listings found in {city}</p>
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
              <p>No listings found in {city}.</p>
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

export default LocationListings;

