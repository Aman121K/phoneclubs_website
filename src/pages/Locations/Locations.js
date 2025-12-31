import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Locations.css';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const mockLocations = [
    { city: 'Dubai', listing_count: 245 },
    { city: 'Abu Dhabi', listing_count: 189 },
    { city: 'Sharjah', listing_count: 156 },
    { city: 'Ajman', listing_count: 98 },
    { city: 'Ras al Khaimah', listing_count: 67 },
    { city: 'Fujairah', listing_count: 45 },
    { city: 'Umm al Quwain', listing_count: 32 },
    { city: 'Al Ain', listing_count: 78 },
    { city: 'Khor Fakkan', listing_count: 23 },
    { city: 'Kalba', listing_count: 19 },
    { city: 'Dibba', listing_count: 15 },
    { city: 'Jebel Ali', listing_count: 42 }
  ];

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/locations');
      setLocations(response.data.length > 0 ? response.data : mockLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations(mockLocations);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="locations-page">
      <div className="page-header">
        <h1>Popular Locations</h1>
        <p className="section-subtitle">Explore Your Desire Places</p>
      </div>

      <div className="locations-grid">
        {locations.map((location, index) => (
          <Link
            key={index}
            to={`/?city=${location.city}`}
            className="location-card"
          >
            <h3>{location.city}</h3>
            <div className="location-stats">
              <i className="fas fa-map-marker-alt"></i>
              <span className="listing-count">{location.listing_count} Listings</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Locations;

