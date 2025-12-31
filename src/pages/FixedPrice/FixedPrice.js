import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../../components/ListingCard/ListingCard';
import './FixedPrice.css';

const FixedPrice = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

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
      user: { name: 'Ali Ahmed', city: 'Ajman' },
      category: { name: 'iPhone XS Max', slug: 'iphone-xs-max' },
      createdAt: new Date('2025-01-08')
    }
  ];

  const fetchListings = async () => {
    try {
      const response = await axios.get('/api/listings?type=fixed_price');
      setListings(response.data.length > 0 ? response.data : mockListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings(mockListings);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="fixed-price-page">
      <div className="page-header">
        <h1>Fixed Price Listings</h1>
        <p>Browse all fixed price iPhone listings</p>
      </div>

      {listings.length === 0 ? (
        <div className="no-listings">
          <p>No fixed price listings available at the moment.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <ListingCard key={listing._id || listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FixedPrice;

