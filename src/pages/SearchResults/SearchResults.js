import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../../components/ListingCard/ListingCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Get initial search params from URL
  const initialSearch = searchParams.get('search') || '';
  const initialModel = searchParams.get('model') || '';
  const initialStorage = searchParams.get('storage') || '';
  
  const [filters, setFilters] = useState({
    search: initialSearch,
    model: initialModel,
    storage: initialStorage,
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    city: searchParams.get('city') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });
  const [appliedFilters, setAppliedFilters] = useState({
    search: initialSearch,
    model: initialModel,
    storage: initialStorage,
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    city: searchParams.get('city') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [appliedFilters]);

  const mockListings = [
    {
      _id: '1',
      title: 'iPhone 15 Pro Max 256GB - Brand New',
      price: 4500,
      condition: 'Brand New',
      storage: '256GB',
      city: 'Dubai',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      user: { name: 'Ahmed Al Maktoum', city: 'Dubai' },
      category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
      createdAt: new Date('2025-01-15')
    },
    {
      _id: '2',
      title: 'iPhone 14 Pro 128GB - Excellent Condition',
      price: 3200,
      condition: 'Excellent',
      storage: '128GB',
      city: 'Abu Dhabi',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
      user: { name: 'Sarah Johnson', city: 'Abu Dhabi' },
      category: { name: 'iPhone 14 Pro', slug: 'iphone-14-pro' },
      createdAt: new Date('2025-01-14')
    },
    {
      _id: '3',
      title: 'iPhone 13 Pro Max 512GB - Good Condition',
      price: 2800,
      condition: 'Good',
      storage: '512GB',
      city: 'Sharjah',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
      user: { name: 'Mohammed Hassan', city: 'Sharjah' },
      category: { name: 'iPhone 13 Pro Max', slug: 'iphone-13-pro-max' },
      createdAt: new Date('2025-01-13')
    }
  ];

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories').catch(() => ({ data: [] }));
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (appliedFilters.search) params.append('search', appliedFilters.search);
      if (appliedFilters.model) params.append('model', appliedFilters.model);
      if (appliedFilters.storage) params.append('storage', appliedFilters.storage);
      if (appliedFilters.minPrice) params.append('minPrice', appliedFilters.minPrice);
      if (appliedFilters.maxPrice) params.append('maxPrice', appliedFilters.maxPrice);
      if (appliedFilters.condition) params.append('condition', appliedFilters.condition);
      if (appliedFilters.city) params.append('city', appliedFilters.city);
      if (appliedFilters.sortBy) params.append('sortBy', appliedFilters.sortBy);

      // Update URL params
      const newParams = new URLSearchParams();
      Object.keys(appliedFilters).forEach(key => {
        if (appliedFilters[key]) {
          newParams.append(key, appliedFilters[key]);
        }
      });
      setSearchParams(newParams);

      const listingsRes = await axios.get(`/api/listings?${params.toString()}`).catch(() => ({ data: [] }));
      let fetchedListings = listingsRes.data.length > 0 ? listingsRes.data : mockListings;

      // Apply client-side filtering if needed
      if (appliedFilters.search) {
        fetchedListings = fetchedListings.filter(listing => 
          listing.title?.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
          listing.category?.name?.toLowerCase().includes(appliedFilters.search.toLowerCase())
        );
      }
      if (appliedFilters.model) {
        fetchedListings = fetchedListings.filter(listing => 
          listing.category?.name === appliedFilters.model
        );
      }
      if (appliedFilters.storage) {
        fetchedListings = fetchedListings.filter(listing => 
          listing.storage === appliedFilters.storage
        );
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
      setListings(mockListings);
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
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      model: '',
      storage: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
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
    <div className="search-results-page">
      <div className="page-header">
        <h1>
          {filters.search || filters.model 
            ? `Search Results${filters.search ? ` for "${filters.search}"` : ''}${filters.model ? ` - ${filters.model}` : ''}`
            : 'Search Results'}
        </h1>
      </div>

      <div className="category-content-wrapper">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h2>Filters</h2>
            <button onClick={clearFilters} className="clear-filters-btn">Clear All</button>
          </div>

          {/* Search Input */}
          <div className="filter-section">
            <h3>Search</h3>
            <input
              type="text"
              name="search"
              placeholder="Search iPhones..."
              value={filters.search}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          {/* Model */}
          <div className="filter-section">
            <h3>Model</h3>
            <select
              name="model"
              value={filters.model}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Models</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
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
        </aside>

        {/* Main Content */}
        <div className="listings-main">
          <div className="listings-header">
            <p className="listings-count">{listings.length} listings found</p>
            <div className="sort-wrapper">
              <label htmlFor="sortBy">Sort by:</label>
              <select
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
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
              <p>No listings found matching your search criteria.</p>
              {/* <Link to="/post-ad" className="post-ad-btn">Post an Ad</Link> */}
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

export default SearchResults;

