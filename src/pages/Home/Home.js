import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import ListingCard from '../../components/ListingCard/ListingCard';
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import './Home.css';

// Small helper to guarantee array operations don't explode in production (e.g. Vercel)
const toArray = (value) => (Array.isArray(value) ? value : []);

const Home = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [latestListings, setLatestListings] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);
  const [singleSellListings, setSingleSellListings] = useState([]);
  const [bulkSellListings, setBulkSellListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');

  // Mock data for testing
  const mockCategories = [
    { id: '1', name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', ad_count: 45 },
    { id: '2', name: 'iPhone 15 Pro', slug: 'iphone-15-pro', ad_count: 38 },
    { id: '3', name: 'iPhone 14 Pro Max', slug: 'iphone-14-pro-max', ad_count: 52 },
    { id: '4', name: 'iPhone 13 Pro', slug: 'iphone-13-pro', ad_count: 67 },
    { id: '5', name: 'iPhone 12', slug: 'iphone-12', ad_count: 89 },
    { id: '6', name: 'iPhone 11 Pro Max', slug: 'iphone-11-pro-max', ad_count: 34 },
    { id: '7', name: 'iPhone 15', slug: 'iphone-15', ad_count: 42 },
    { id: '8', name: 'iPhone 14', slug: 'iphone-14', ad_count: 56 },
    { id: '9', name: 'iPhone 13', slug: 'iphone-13', ad_count: 71 },
    { id: '10', name: 'iPhone XS Max', slug: 'iphone-xs-max', ad_count: 23 },
    { id: '11', name: 'iPhone XR', slug: 'iphone-xr', ad_count: 19 },
    { id: '12', name: 'iPhone SE', slug: 'iphone-se', ad_count: 15 }
  ];

  const mockFeaturedListings = [
    {
      _id: '1',
      title: 'iPhone 15 Pro Max 256GB - Brand New',
      price: 4500,
      condition: 'Brand New',
      storage: '256GB',
      city: 'Dubai',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
      ],
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
      images: [
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
      ],
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
      images: [
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
      ],
      user: { name: 'Mohammed Hassan', city: 'Sharjah' },
      category: { name: 'iPhone 13 Pro Max', slug: 'iphone-13-pro-max' },
      createdAt: new Date('2025-01-13')
    },
    {
      _id: '4',
      title: 'iPhone 12 64GB - Fair Condition',
      price: 1800,
      condition: 'Fair',
      storage: '64GB',
      city: 'Dubai',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop'
      ],
      user: { name: 'Ahmed Al Maktoum', city: 'Dubai' },
      category: { name: 'iPhone 12', slug: 'iphone-12' },
      createdAt: new Date('2025-01-12')
    },
    {
      _id: '5',
      title: 'iPhone 15 Pro 1TB - Premium',
      price: 5200,
      condition: 'Brand New',
      storage: '1TB',
      city: 'Abu Dhabi',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
      ],
      user: { name: 'Sarah Johnson', city: 'Abu Dhabi' },
      category: { name: 'iPhone 15 Pro', slug: 'iphone-15-pro' },
      createdAt: new Date('2025-01-11')
    },
    {
      _id: '6',
      title: 'iPhone 14 256GB - Very Good',
      price: 2500,
      condition: 'Very Good',
      storage: '256GB',
      city: 'Dubai',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'
      ],
      user: { name: 'Ahmed Al Maktoum', city: 'Dubai' },
      category: { name: 'iPhone 14', slug: 'iphone-14' },
      createdAt: new Date('2025-01-10')
    },
    {
      _id: '7',
      title: 'iPhone 11 Pro 256GB - Good',
      price: 2200,
      condition: 'Good',
      storage: '256GB',
      city: 'Sharjah',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop'
      ],
      user: { name: 'Mohammed Hassan', city: 'Sharjah' },
      category: { name: 'iPhone 11 Pro', slug: 'iphone-11-pro' },
      createdAt: new Date('2025-01-09')
    },
    {
      _id: '8',
      title: 'iPhone XS Max 256GB - Fair',
      price: 1500,
      condition: 'Fair',
      storage: '256GB',
      city: 'Ajman',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'
      ],
      user: { name: 'Ali Ahmed', city: 'Ajman' },
      category: { name: 'iPhone XS Max', slug: 'iphone-xs-max' },
      createdAt: new Date('2025-01-08')
    }
  ];


  const mockLocations = [
    { city: 'Dubai', listing_count: 245 },
    { city: 'Abu Dhabi', listing_count: 189 },
    { city: 'Sharjah', listing_count: 156 },
    { city: 'Ajman', listing_count: 98 },
    { city: 'Ras al Khaimah', listing_count: 67 },
    { city: 'Fujairah', listing_count: 45 }
  ];

  const mockSimilarProducts = [
    {
      _id: 'sp1',
      title: 'iPhone 15 Pro Max 512GB - Excellent',
      price: 5000,
      condition: 'Excellent',
      storage: '512GB',
      city: 'Abu Dhabi',
      color: 'Other',
      warranty: 'Yes',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop'
      ],
      user: { name: 'Sarah Johnson', city: 'Abu Dhabi' },
      category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
      createdAt: new Date('2025-01-15')
    },
    {
      _id: 'sp2',
      title: 'iPhone 15 Pro Max 1TB - Premium',
      price: 5500,
      condition: 'Brand New',
      storage: '1TB',
      city: 'Dubai',
      color: 'Other',
      warranty: 'Yes',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
      ],
      user: { name: 'Mohammed Ali', city: 'Dubai' },
      category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
      createdAt: new Date('2025-01-14')
    },
    {
      _id: 'sp3',
      title: 'iPhone 15 Pro Max 256GB - Good',
      price: 4200,
      condition: 'Good',
      storage: '256GB',
      city: 'Sharjah',
      color: 'Other',
      warranty: 'Yes',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
      ],
      user: { name: 'Fatima Hassan', city: 'Sharjah' },
      category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
      createdAt: new Date('2025-01-13')
    },
    {
      _id: 'sp4',
      title: 'iPhone 15 Pro Max 512GB - Brand New',
      price: 5200,
      condition: 'Brand New',
      storage: '512GB',
      city: 'Dubai',
      color: 'Other',
      warranty: 'Yes',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'
      ],
      user: { name: 'Omar Al Zaabi', city: 'Dubai' },
      category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
      createdAt: new Date('2025-01-12')
    },
    {
      _id: 'sp5',
      title: 'iPhone 15 Pro Max 256GB - Excellent',
      price: 4400,
      condition: 'Excellent',
      storage: '256GB',
      city: 'Abu Dhabi',
      color: 'Other',
      warranty: 'Yes',
      listingType: 'fixed_price',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
      ],
      user: { name: 'Layla Ahmed', city: 'Abu Dhabi' },
      category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
      createdAt: new Date('2025-01-11')
    }
  ];

  useEffect(() => {
    // Get user location first, then fetch data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Store in localStorage for use across the app
          localStorage.setItem('userLatitude', latitude);
          localStorage.setItem('userLongitude', longitude);
          // Fetch data with location
          fetchData(latitude, longitude);
        },
        (error) => {
          console.log('Location access denied or unavailable:', error);
          // Fallback: fetch without location
          fetchData();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Geolocation not supported, fetch without location
      fetchData();
    }
  }, []);

  const fetchData = async (latitude = null, longitude = null) => {
    try {
      // Build query params with location if available
      const locationParams = latitude && longitude 
        ? `?latitude=${latitude}&longitude=${longitude}&maxDistance=50`
        : '';
      
      const [featuredRes, latestRes, auctionsRes, categoriesRes, locationsRes, singleSellRes, bulkSellRes] = await Promise.all([
        axios.get(`/api/listings/featured${locationParams}`).catch(() => ({ data: [] })),
        axios.get(`/api/listings/latest${locationParams}`).catch(() => ({ data: [] })),
        axios.get('/api/auctions').catch(() => ({ data: [] })),
        axios.get('/api/categories').catch(() => ({ data: [] })),
        axios.get('/api/categories/locations').catch(() => ({ data: [] })),
        axios.get(`/api/listings?type=single_sell${latitude && longitude ? `&latitude=${latitude}&longitude=${longitude}&maxDistance=50` : ''}`).catch(() => ({ data: [] })),
        axios.get(`/api/listings?type=bulk_sell${latitude && longitude ? `&latitude=${latitude}&longitude=${longitude}&maxDistance=50` : ''}`).catch(() => ({ data: [] }))
      ]);

      // Normalize API responses - handle new pagination format
      const featuredData = toArray(featuredRes.data?.listings || featuredRes.data);
      const latestData = toArray(latestRes.data?.listings || latestRes.data);
      
      // Handle auctions response - could be array or object with auctions property
      let auctionsData = [];
      if (auctionsRes.data && auctionsRes.data.auctions && Array.isArray(auctionsRes.data.auctions)) {
        auctionsData = auctionsRes.data.auctions;
      } else if (Array.isArray(auctionsRes.data)) {
        auctionsData = auctionsRes.data;
      }
      
      const categoriesData = toArray(categoriesRes.data);
      const locationsData = toArray(locationsRes.data);
      const singleSellData = toArray(singleSellRes.data?.listings || singleSellRes.data);
      const bulkSellData = toArray(bulkSellRes.data?.listings || bulkSellRes.data);

      // Use API data only - no mock data fallback
      setFeaturedListings(featuredData);
      setLatestListings(latestData);
      setSimilarProducts([]);
      setAuctions(auctionsData);
      setCategories(categoriesData);
      setPopularLocations(locationsData);
      setSingleSellListings(singleSellData);
      setBulkSellListings(bulkSellData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // On error, set empty arrays
      setFeaturedListings([]);
      setLatestListings([]);
      setSimilarProducts([]);
      setAuctions([]);
      setCategories([]);
      setPopularLocations([]);
      setSingleSellListings([]);
      setBulkSellListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results page
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedModel) params.append('model', selectedModel);
    if (selectedStorage) params.append('storage', selectedStorage);
    navigate(`/search?${params.toString()}`);
  };

  const handleQuickFilter = (filter) => {
    setSearchQuery(filter);
  };

  const safeCategories = toArray(categories);
  const safeAuctions = toArray(auctions);
  const safeLocations = toArray(popularLocations);
  const safeLatest = toArray(latestListings);
  const safeSingleSell = toArray(singleSellListings);
  const safeBulkSell = toArray(bulkSellListings);

  const handleBidSuccess = (auctionId, bidAmount) => {
    // Update the auction in the list with new bid
    setAuctions(prevAuctions =>
      prevAuctions.map(auction => {
        if ((auction._id || auction.id) === auctionId) {
          return {
            ...auction,
            current_price: bidAmount,
            bid_count: (auction.bid_count || 0) + 1
          };
        }
        return auction;
      })
    );
  };

  if (loading) {
    return (
      <div className="home">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading amazing deals near you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Ultimate Hero Section */}
      <section className="ultimate-hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-star"></i>
              India's #1 Phone Marketplace
            </div>

            <h1 className="hero-title">
              Buy & Sell Phones
              <span> Directly from Verified Sellers</span>
            </h1>

            <p className="hero-subtitle">
              Connect with trusted sellers in your area. Buy and sell iPhones, Android phones with complete confidence. 
              No middleman, no hidden fees. Just honest deals between real people.
            </p>
          </div>

          {/* Mega Search Component */}
          <div className="mega-search">
            <div className="search-header">
              <h3 className="search-title">Find Your Perfect Phone</h3>
              <div className="quick-filters">
                <div className="filter-tag" onClick={() => handleQuickFilter('iPhone 15')}>
                  iPhone 15
                </div>
                <div className="filter-tag" onClick={() => handleQuickFilter('Samsung')}>
                  Samsung
                </div>
                <div className="filter-tag" onClick={() => handleQuickFilter('OnePlus')}>
                  OnePlus
                </div>
                <div className="filter-tag" onClick={() => handleQuickFilter('Under ₹20000')}>
                  Under ₹20,000
                </div>
              </div>
            </div>

            <form className="search-grid" onSubmit={handleSearch}>
              <div className="search-group">
                <label className="search-label">Search Phones</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="iPhone 15, Samsung Galaxy, OnePlus, Xiaomi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="search-group">
                <label className="search-label">Model</label>
                <select
                  className="search-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="">All Models</option>
                  {safeCategories.slice(0, 10).map((cat) => (
                    <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="search-group">
                <label className="search-label">Storage</label>
                <select
                  className="search-select"
                  value={selectedStorage}
                  onChange={(e) => setSelectedStorage(e.target.value)}
                >
                  <option value="">Any Storage</option>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
              </div>

              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
                Search
              </button>
            </form>
          </div>

          {/* Hero Stats */}
          {/* <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15K+</span>
              <span className="stat-label">iPhones Sold</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24h</span>
              <span className="stat-label">Fast Delivery</span>
            </div>
          </div> */}

          {/* Trust Badges */}
          {/* <div className="trust-bar">
            <div className="trust-item">
              <div className="trust-icon">
                <i className="fas fa-shield-check"></i>
              </div>
              Certified Quality
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <i className="fas fa-lock"></i>
              </div>
              Secure Payment
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <i className="fas fa-truck"></i>
              </div>
              Free Delivery
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <i className="fas fa-undo"></i>
              </div>
              7-Day Return
            </div>
          </div> */}
        </div>
      </section>

      {/* Browse Categories Section */}
      <section className="categories-section">
        <div className="section-header section-header-row">
          <div>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Browse Phone Categories
            </Typography>
            {/* <p className="section-subtitle">Find what you're looking for</p> */}
          </div>
          <Link to="/categories" className="view-all-link">
            View All
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="home-listings-grid">
          {safeCategories.slice(0, 4).map((category) => (
            <Card
              key={category.id || category._id}
              component={Link}
              to={`/category/${category.slug}`}
              className="category-card"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                background: '#2563eb',
                color: '#fff',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.3s ease',
                border: '2px solid #2563eb',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                width: '240px',
                minWidth: '240px',
                maxWidth: '240px',
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#fff',
                  mb: '0.5rem',
                  lineHeight: 1.3,
                }}
              >
                {category.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: 600,
                }}
              >
                {category.ad_count || 0} Ads
              </Typography>
            </Card>
          ))}
          {safeCategories.length > 5 && (
            <Card
              component={Link}
              to={`/category/${safeCategories[5].slug}`}
              className="category-card blur-card"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                background: '#2563eb',
                color: '#fff',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.3s ease',
                border: '2px solid #2563eb',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                width: '240px',
                minWidth: '240px',
                maxWidth: '240px',
                opacity: 0.5,
                filter: 'blur(2px)',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#fff',
                  mb: '0.5rem',
                }}
              >
                {safeCategories[5].name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500,
                }}
              >
                {safeCategories[5].ad_count || 0} Ads
              </Typography>
            </Card>
          )}
        </div>
      </section>

      {/* Single Sell Section */}
      <section className="single-sell-section">
        <div className="section-header section-header-row">
          <div>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif",
                mb: '0.5rem',
              }}
            >
              Single Phone Listings
            </Typography>
            {/* <p className="section-subtitle">Sell Your iPhone Individually</p> */}
          </div>
          <Link to="/single-sell" className="view-all-link">
            View All
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="home-listings-grid">
          {safeSingleSell.length > 0 ? (
            <>
              {safeSingleSell.slice(0, 4).map((listing) => (
                <ListingCard isHome={true} key={listing._id || listing.id} listing={listing} />
              ))}
              {safeSingleSell.length > 5 && (
                <ListingCard
                  listing={safeSingleSell[5]}
                  className="blur-card"
                />
              )}
            </>
          ) : (
            <div className="no-listings">
              <p>No single sell listings available</p>
            </div>
          )}
        </div>
      </section>

      {/* Bulk Sell Section */}
      <section className="bulk-sell-section">
        <div className="section-header section-header-row">
          <div>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif",
                mb: '0.5rem',
              }}
            >
              Bulk Phone Listings
            </Typography>
            {/* <p className="section-subtitle">Sell Multiple iPhones at Once</p> */}
          </div>
          <Link to="/bulk-sell" className="view-all-link">
            View All
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="home-listings-grid">
          {safeBulkSell.length > 0 ? (
            <>
              {safeBulkSell.slice(0, 4).map((listing) => (
                <ListingCard isHome={true} key={listing._id || listing.id} listing={listing} />
              ))}
              {safeBulkSell.length > 5 && (
                <ListingCard isHome={true}
                  listing={safeBulkSell[5]}
                  className="blur-card"
                />
              )}
            </>
          ) : (
            <div className="no-listings">
              <p>No bulk iphone listings available</p>
            </div>
          )}
        </div>
      </section>

      {/* Auction Section */}
      <section className="auction-section">
        <div className="section-header section-header-row">
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1e293b',
              fontFamily: "'Inter', sans-serif",
              mb: '0.5rem',
            }}
          >
            Auction
          </Typography>
          <Link to="/auctions" className="view-all-link">
            View All
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="home-listings-grid">
          {safeAuctions.length > 0 ? (
            <>
              {safeAuctions.slice(0, 4).map((auction) => (
                <AuctionCard
                  key={auction._id || auction.id}
                  auction={auction}
                  onBidSuccess={handleBidSuccess}
                />
              ))}
              {safeAuctions.length > 5 && (
                <AuctionCard
                  auction={safeAuctions[5]}
                  className="blur-card"
                  onBidSuccess={handleBidSuccess}
                />
              )}
            </>
          ) : (
            <div className="no-auctions">
              <div className="no-auctions-content">
                <div className="no-auctions-emoji">🔨</div>
                <h3>No Live Auctions</h3>
                <p>There are no live auctions at the moment.</p>
                <p className="no-auctions-suggestion">Check back later or create your own auction!</p>
              </div>
            </div>
          )}
        </div>

        {/* Trust Section */}
        <div className="trust-features-section">
          <div className="trust-features-container">
            <div className="trust-features-header">
              <h2>Why Choose PhoneClubs?</h2>
              <p>Your trusted marketplace for buying and selling phones</p>
            </div>
            <div className="trust-features-grid">
              <div className="trust-feature-card">
                <div className="trust-feature-icon trust-icon-verified">
                  <i className="fas fa-shield-check"></i>
                </div>
                <h3>Verified Sellers</h3>
                <p>All sellers are phone verified for your safety and peace of mind</p>
              </div>
              <div className="trust-feature-card">
                <div className="trust-feature-icon trust-icon-location">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Location Based</h3>
                <p>Find phones near you, meet in person for safe transactions</p>
              </div>
              <div className="trust-feature-card">
                <div className="trust-feature-icon trust-icon-communication">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>Direct Communication</h3>
                <p>Chat directly with sellers, no middleman or hidden fees</p>
              </div>
              <div className="trust-feature-card">
                <div className="trust-feature-icon trust-icon-prices">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <h3>Best Prices</h3>
                <p>No commission fees, get the best deal directly from sellers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="locations-section">
        <div className="section-header section-header-row">
          <div>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif",
                mb: '0.5rem',
              }}
            >
              Popular Locations
            </Typography>
            {/* <p className="section-subtitle">Explore Your Desire Places</p> */}
          </div>
          <Link to="/locations" className="view-all-link">
            View All
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="home-listings-grid">
          {safeLocations.slice(0, 4).map((location, index) => {
            // Convert city name to URL-friendly format (e.g., "Abu Dhabi" -> "abu-dhabi")
            const citySlug = location.city.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                key={index}
                to={`/location/${citySlug}`}
                className="location-card"
              >
                <div style={{ width: '100%' }}>
                  <h3>{location.city}</h3>
                  <div className="location-stats">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{location.listing_count} Listings</span>
                  </div>
                </div>
              </Link>
            );
          })}
          {safeLocations.length > 5 && (() => {
            const citySlug = safeLocations[5].city.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                to={`/location/${citySlug}`}
                className="location-card"
              >
                <h3>{safeLocations[5].city}</h3>
                <div className="location-stats">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{safeLocations[5].listing_count} Listings</span>
                </div>
              </Link>
            );
          })()}
        </div>
      </section>

      {/* Latest Ads Section */}
      <section className="latest-section">
        <div className="section-header section-header-row">
          <div>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif",
                mb: '0.5rem',
              }}
            >
              Latest Ads
            </Typography>
            {/* <p className="section-subtitle">Buy & Sell Any Iphone</p> */}
          </div>
          <Link to="/single-sell" className="view-all-link">
            View All
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="home-listings-grid">
          {safeLatest.length > 0 ? (
            <>
              {safeLatest.slice(0, 4).map((listing) => (
                <ListingCard isHome={true} key={listing._id || listing.id} listing={listing} />
              ))}
              {safeLatest.length > 5 && (
                <ListingCard
                  isHome={true}
                  listing={safeLatest[5]}
                  className="blur-card"
                />
              )}
            </>
          ) : (
            <div className="no-listings">
              <p>No listings available</p>
            </div>
          )}
        </div>

        {/* Post New Ad Section */}
        <div className="post-ad-section">
          <div className="post-ad-content">
            <h3>Want to Sell Your Phone?</h3>
            <p>Post your listing now and connect with buyers in your area. It's free and takes just 2 minutes!</p>
            <Link to="/post-ad" className="post-ad-btn">
              <i className="fas fa-plus-circle"></i> Post Your Phone Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
