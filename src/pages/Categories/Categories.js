import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const mockCategories = [
    { id: '1', name: 'iPhone SE', slug: 'iphone-se', ad_count: 15 },
    { id: '2', name: 'iPhone 6', slug: 'iphone-6', ad_count: 8 },
    { id: '3', name: 'iPhone 6s', slug: 'iphone-6s', ad_count: 12 },
    { id: '4', name: 'iPhone 7', slug: 'iphone-7', ad_count: 18 },
    { id: '5', name: 'iPhone 8', slug: 'iphone-8', ad_count: 22 },
    { id: '6', name: 'iPhone X', slug: 'iphone-x', ad_count: 28 },
    { id: '7', name: 'iPhone XR', slug: 'iphone-xr', ad_count: 19 },
    { id: '8', name: 'iPhone XS', slug: 'iphone-xs', ad_count: 25 },
    { id: '9', name: 'iPhone 11', slug: 'iphone-11', ad_count: 42 },
    { id: '10', name: 'iPhone 11 Pro', slug: 'iphone-11-pro', ad_count: 38 },
    { id: '11', name: 'iPhone 11 Pro Max', slug: 'iphone-11-pro-max', ad_count: 34 },
    { id: '12', name: 'iPhone 12', slug: 'iphone-12', ad_count: 89 },
    { id: '13', name: 'iPhone 12 Mini', slug: 'iphone-12-mini', ad_count: 45 },
    { id: '14', name: 'iPhone 12 Pro', slug: 'iphone-12-pro', ad_count: 67 },
    { id: '15', name: 'iPhone 12 Pro Max', slug: 'iphone-12-pro-max', ad_count: 72 },
    { id: '16', name: 'iPhone 13', slug: 'iphone-13', ad_count: 71 },
    { id: '17', name: 'iPhone 13 Mini', slug: 'iphone-13-mini', ad_count: 52 },
    { id: '18', name: 'iPhone 13 Pro', slug: 'iphone-13-pro', ad_count: 64 },
    { id: '19', name: 'iPhone 13 Pro Max', slug: 'iphone-13-pro-max', ad_count: 58 },
    { id: '20', name: 'iPhone 14', slug: 'iphone-14', ad_count: 56 },
    { id: '21', name: 'iPhone 14 Plus', slug: 'iphone-14-plus', ad_count: 48 },
    { id: '22', name: 'iPhone 14 Pro', slug: 'iphone-14-pro', ad_count: 52 },
    { id: '23', name: 'iPhone 14 Pro Max', slug: 'iphone-14-pro-max', ad_count: 49 },
    { id: '24', name: 'iPhone 15', slug: 'iphone-15', ad_count: 42 },
    { id: '25', name: 'iPhone 15 Plus', slug: 'iphone-15-plus', ad_count: 38 },
    { id: '26', name: 'iPhone 15 Pro', slug: 'iphone-15-pro', ad_count: 38 },
    { id: '27', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', ad_count: 45 },
    { id: '28', name: 'iPhone 16', slug: 'iphone-16', ad_count: 32 },
    { id: '29', name: 'iPhone 16 Plus', slug: 'iphone-16-plus', ad_count: 28 },
    { id: '30', name: 'iPhone 16 Pro', slug: 'iphone-16-pro', ad_count: 35 },
    { id: '31', name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', ad_count: 41 }
  ];

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.length > 0 ? response.data : mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Browse iphone series</h1>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.id || category._id}
            to={`/category/${category.slug}`}
            className="category-card"
          >
            <h3>{category.name}</h3>
            <span className="ad-count">{category.ad_count || 0} Ads</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;

