import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import ListingCard from '../../components/ListingCard/ListingCard';
import './ListingDetail.css';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarListings, setSimilarListings] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reporting, setReporting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { success, error: showError, info } = useToast();

  useEffect(() => {
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (listing) {
      fetchSimilarListings();
      trackView();
    }
  }, [listing]);

  // Track view for this listing
  const trackView = async () => {
    try {
      // Get device token from cookie or localStorage
      let deviceToken = getCookie('deviceToken') || localStorage.getItem('deviceToken');
      
      const config = {
        headers: {}
      };
      
      // Add auth token if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add device token to request body if available
      const body = deviceToken ? { deviceToken } : {};
      
      const response = await axios.post(`/api/listings/${id}/view`, body, config);
      
      // Store device token if returned
      if (response.data.deviceToken) {
        setCookie('deviceToken', response.data.deviceToken, 365);
        localStorage.setItem('deviceToken', response.data.deviceToken);
      }
      
      // Update view count in listing state
      if (response.data.viewCount !== undefined) {
        setListing(prev => prev ? { ...prev, viewCount: response.data.viewCount } : null);
      }
    } catch (error) {
      // Silently fail - don't show error to user
      console.error('Error tracking view:', error);
    }
  };

  // Helper function to get cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Helper function to set cookie
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/api/listings/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      // Mock listing for testing
      const mockListing = {
        _id: id,
        title: 'iPhone 15 Pro Max 256GB - Brand New',
        price: 4500,
        condition: 'Brand New',
        storage: '256GB',
        city: 'Dubai',
        listingType: 'fixed_price',
        description: 'Brand new iPhone 15 Pro Max in Natural Titanium. Still sealed in box. Full warranty. Perfect condition. All accessories included.',
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
        ],
        user: { name: 'Ahmed Al Maktoum', city: 'Dubai', phone: '+971501234567' },
        category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', _id: 'cat1' },
        viewCount: 0,
        createdAt: new Date('2025-01-10')
      };
      setListing(mockListing);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarListings = async () => {
    try {
      const categoryId = listing.category?._id || listing.category_id;
      const categorySlug = listing.category?.slug || listing.category_slug;
      
      if (categorySlug) {
        const response = await axios.get(`/api/listings?category=${categorySlug}&limit=10`);
        // Handle new pagination format
        const listings = response.data?.listings || response.data;
        // Filter out current listing
        const filtered = listings.filter(item => 
          (item._id || item.id) !== (listing._id || listing.id)
        );
        setSimilarListings(filtered.slice(0, 8));
      } else {
        // Use mock similar listings
        const mockSimilar = [
          {
            _id: 'sim1',
            title: 'iPhone 15 Pro Max 512GB - Excellent',
            price: 5000,
            condition: 'Excellent',
            storage: '512GB',
            city: 'Abu Dhabi',
            listingType: 'fixed_price',
            imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
              'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop'
            ],
            user: { name: 'Sarah Johnson', city: 'Abu Dhabi' },
            category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
            createdAt: new Date('2025-01-14')
          },
          {
            _id: 'sim2',
            title: 'iPhone 15 Pro Max 1TB - Premium',
            price: 5500,
            condition: 'Brand New',
            storage: '1TB',
            city: 'Dubai',
            listingType: 'fixed_price',
            imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
              'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
            ],
            user: { name: 'Mohammed Ali', city: 'Dubai' },
            category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
            createdAt: new Date('2025-01-13')
          },
          {
            _id: 'sim3',
            title: 'iPhone 15 Pro Max 256GB - Good',
            price: 4200,
            condition: 'Good',
            storage: '256GB',
            city: 'Sharjah',
            listingType: 'fixed_price',
            imageUrl: 'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
              'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
            ],
            user: { name: 'Fatima Hassan', city: 'Sharjah' },
            category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
            createdAt: new Date('2025-01-12')
          },
          {
            _id: 'sim4',
            title: 'iPhone 15 Pro Max 512GB - Brand New',
            price: 5200,
            condition: 'Brand New',
            storage: '512GB',
            city: 'Dubai',
            listingType: 'fixed_price',
            imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
              'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'
            ],
            user: { name: 'Omar Al Zaabi', city: 'Dubai' },
            category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
            createdAt: new Date('2025-01-11')
          },
          {
            _id: 'sim5',
            title: 'iPhone 15 Pro Max 256GB - Excellent',
            price: 4400,
            condition: 'Excellent',
            storage: '256GB',
            city: 'Abu Dhabi',
            listingType: 'fixed_price',
            imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
              'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
              'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
            ],
            user: { name: 'Layla Ahmed', city: 'Abu Dhabi' },
            category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
            createdAt: new Date('2025-01-09')
          },
          {
            _id: 'sim6',
            title: 'iPhone 15 Pro Max 1TB - Good',
            price: 5300,
            condition: 'Good',
            storage: '1TB',
            city: 'Dubai',
            listingType: 'fixed_price',
            imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
              'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
            ],
            user: { name: 'Khalid Al Mansoori', city: 'Dubai' },
            category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
            createdAt: new Date('2025-01-08')
          }
        ];
        // Filter out current listing
        const filtered = mockSimilar.filter(item => 
          (item._id || item.id) !== (listing._id || listing.id)
        );
        setSimilarListings(filtered);
      }
    } catch (error) {
      console.error('Error fetching similar listings:', error);
      // Use mock similar listings on error
      const mockSimilar = [
        {
          _id: 'sim1',
          title: 'iPhone 15 Pro Max 512GB - Excellent',
          price: 5000,
          condition: 'Excellent',
          storage: '512GB',
          city: 'Abu Dhabi',
          listingType: 'fixed_price',
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop'
          ],
          user: { name: 'Sarah Johnson', city: 'Abu Dhabi' },
          category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
          createdAt: new Date('2025-01-14')
        },
        {
          _id: 'sim2',
          title: 'iPhone 15 Pro Max 1TB - Premium',
          price: 5500,
          condition: 'Brand New',
          storage: '1TB',
          city: 'Dubai',
          listingType: 'fixed_price',
          imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
          ],
          user: { name: 'Mohammed Ali', city: 'Dubai' },
          category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
          createdAt: new Date('2025-01-13')
        },
        {
          _id: 'sim3',
          title: 'iPhone 15 Pro Max 256GB - Good',
          price: 4200,
          condition: 'Good',
          storage: '256GB',
          city: 'Sharjah',
          listingType: 'fixed_price',
          imageUrl: 'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
          ],
          user: { name: 'Fatima Hassan', city: 'Sharjah' },
          category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
          createdAt: new Date('2025-01-12')
        },
        {
          _id: 'sim4',
          title: 'iPhone 15 Pro Max 512GB - Brand New',
          price: 5200,
          condition: 'Brand New',
          storage: '512GB',
          city: 'Dubai',
          listingType: 'fixed_price',
          imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'
          ],
          user: { name: 'Omar Al Zaabi', city: 'Dubai' },
          category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
          createdAt: new Date('2025-01-11')
        },
        {
          _id: 'sim5',
          title: 'iPhone 15 Pro Max 256GB - Excellent',
          price: 4400,
          condition: 'Excellent',
          storage: '256GB',
          city: 'Abu Dhabi',
          listingType: 'fixed_price',
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
          ],
          user: { name: 'Layla Ahmed', city: 'Abu Dhabi' },
          category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
          createdAt: new Date('2025-01-09')
        },
        {
          _id: 'sim6',
          title: 'iPhone 15 Pro Max 1TB - Good',
          price: 5300,
          condition: 'Good',
          storage: '1TB',
          city: 'Dubai',
          listingType: 'fixed_price',
          imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop'
          ],
          user: { name: 'Khalid Al Mansoori', city: 'Dubai' },
          category: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
          createdAt: new Date('2025-01-08')
        }
      ];
      // Filter out current listing
      const filtered = mockSimilar.filter(item => 
        (item._id || item.id) !== (listing._id || listing.id)
      );
      setSimilarListings(filtered);
    }
  };

  // Get listing images - support both images array and single imageUrl
  const getListingImages = () => {
    if (!listing) return [];
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      return listing.images.filter(img => img);
    }
    if (listing.imageUrl || listing.image_url) {
      const singleImage = listing.imageUrl || listing.image_url;
      // Return multiple different images for horizontal scroll effect
      return [
        singleImage,
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
      ];
    }
    // Return placeholder images for scrolling demo
    return [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1632669021382-3e0d1c1b0b4c?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
    ];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/users/messages', {
        receiver_id: listing.user?._id || listing.user_id,
        listing_id: listing._id || listing.id,
        message: message
      });
      success('Message sent successfully!');
      setMessage('');
      setShowMessageForm(false);
    } catch (error) {
      showError('Error sending message. Please try again.');
    }
  };

  const handleMarkAsSold = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmMarkAsSold = async () => {
    setShowConfirmModal(false);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/listings/${id}/mark-sold`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      success('Listing marked as sold successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Error marking as sold:', error);
      showError(error.response?.data?.error || 'Error marking listing as sold');
    }
  };

  const handlePreviousImage = () => {
    const images = getListingImages();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const images = getListingImages();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      info('Link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality with backend
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!listing) {
    return <div className="error">Listing not found</div>;
  }

  const images = getListingImages();

  return (
    <div className="listing-detail-page">
      <div className="listing-detail-container">
        {/* Image Section */}
        <div className="listing-image-section">
          {images.length > 0 ? (
            <div className="main-image-wrapper">
              <img 
                src={images[currentImageIndex]} 
                alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                className="main-product-image"
                onError={(e) => {
                  e.target.src = '/logo.png';
                }}
              />
              
              {/* Floating Action Bar - Share, Favorite, Report */}
              <div className="floating-action-bar">
                <button
                  className="floating-action-btn"
                  onClick={handleShare}
                  title="Share listing"
                  aria-label="Share listing"
                >
                  <i className="fas fa-share-alt"></i>
                </button>
                {user && (
                  <button
                    className={`floating-action-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavorite}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <i className={`fas ${isFavorite ? 'fa-heart' : 'fa-heart'}`} style={!isFavorite ? { opacity: 0.6 } : {}}></i>
                  </button>
                )}
                <button
                  className="floating-action-btn report-btn"
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    if (user.id === (listing.user?._id || listing.user_id)) {
                      showError('You cannot report your own listing');
                      return;
                    }
                    setShowReportForm(true);
                  }}
                  title="Report this listing"
                  aria-label="Report this listing"
                >
                  <i className="fas fa-flag"></i>
                </button>
              </div>

              {images.length > 1 && (
                <>
                  <button 
                    className="image-nav-btn image-nav-left"
                    onClick={handlePreviousImage}
                    aria-label="Previous image"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className="image-nav-btn image-nav-right"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="main-image-wrapper placeholder">
              <img src="/logo.png" alt="PhoneClubs Logo" className="main-product-image" />
              {/* Floating Action Bar for placeholder */}
              <div className="floating-action-bar">
                <button
                  className="floating-action-btn"
                  onClick={handleShare}
                  title="Share listing"
                  aria-label="Share listing"
                >
                  <i className="fas fa-share-alt"></i>
                </button>
                {user && (
                  <button
                    className={`floating-action-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavorite}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <i className={`fas ${isFavorite ? 'fa-heart' : 'fa-heart'}`} style={!isFavorite ? { opacity: 0.6 } : {}}></i>
                  </button>
                )}
                <button
                  className="floating-action-btn report-btn"
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    if (user.id === (listing.user?._id || listing.user_id)) {
                      showError('You cannot report your own listing');
                      return;
                    }
                    setShowReportForm(true);
                  }}
                  title="Report this listing"
                  aria-label="Report this listing"
                >
                  <i className="fas fa-flag"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="listing-details-card">
          {/* Product Title */}
          <h1 className="product-title">{listing.title}</h1>

          {/* Product Attributes */}
          <div className="product-attributes">
            <div className="attribute-item">
              <span className="attribute-label">Condition</span>
              <span className="attribute-value">{listing.condition || 'N/A'}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">Storage</span>
              <span className="attribute-value">{listing.storage || 'N/A'}</span>
            </div>
            {listing.version && (
              <div className="attribute-item">
                <span className="attribute-label">Version</span>
                <span className="attribute-value">{listing.version}</span>
              </div>
            )}
            {listing.colour && (
              <div className="attribute-item">
                <span className="attribute-label">Color</span>
                <span className="attribute-value">{listing.colour}</span>
              </div>
            )}
            <div className="attribute-item">
              <span className="attribute-label">Warranty</span>
              <span className="attribute-value">{listing.warranty ? 'Yes' : 'No'}</span>
            </div>
            {listing.charge !== undefined && (
              <div className="attribute-item">
                <span className="attribute-label">Charger Included</span>
                <span className="attribute-value">{listing.charge === 'Yes' || listing.charge === true ? 'Yes' : 'No'}</span>
              </div>
            )}
            {listing.box !== undefined && (
              <div className="attribute-item">
                <span className="attribute-label">Box Included</span>
                <span className="attribute-value">{listing.box === 'Yes' || listing.box === true ? 'Yes' : 'No'}</span>
              </div>
            )}
            {listing.quantity && (
              <div className="attribute-item">
                <span className="attribute-label">Quantity</span>
                <span className="attribute-value">{listing.quantity}</span>
              </div>
            )}
          </div>

          {/* Seller Information */}
          <div className="seller-info-section">
            <div className="seller-avatar">
              <span className="seller-avatar-text">
                {(listing.user?.name || listing.seller_name || 'Seller').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="seller-details">
              <span className="seller-name">{listing.user?.name || listing.seller_name || 'Seller'}</span>
              {listing.seller_business_name && (
                <span className="seller-business">{listing.seller_business_name}</span>
              )}
              {listing.seller_type && (
                <span className="seller-type">{listing.seller_type === 'business' ? 'Business Seller' : 'Individual Seller'}</span>
              )}
              {listing.seller_city && (
                <span className="seller-city">
                  <i className="fas fa-map-marker-alt"></i> {listing.seller_city}
                </span>
              )}
            </div>
          </div>

          {/* Separator */}
          <div className="detail-separator"></div>

          {/* Location and Price */}
          <div className="location-price-section">
            <div className="location-info">
              <i className="fas fa-map-marker-alt location-icon"></i>
              <span className="location-text">{listing.city || listing.seller_city || 'Dubai'}</span>
            </div>
            <div className="price-info">
              {listing.listingType === 'auction' ? (
                <div className="auction-price-info">
                  {listing.current_price && (
                    <div className="price-row">
                      <span className="price-label">Current Bid:</span>
                      <span className="price-amount">₹ {Number(listing.current_price).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 })}</span>
                    </div>
                  )}
                  {listing.start_price && (
                    <div className="price-row">
                      <span className="price-label">Starting Price:</span>
                      <span className="price-amount-small">₹ {Number(listing.start_price).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 })}</span>
                    </div>
                  )}
                  {listing.bids && Array.isArray(listing.bids) && listing.bids.length > 0 && (
                    <div className="price-row">
                      <span className="price-label">Total Bids:</span>
                      <span className="price-amount-small">{listing.bids.length}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="fixed-price-info">
                  <span className="price-amount">₹ {listing.price || listing.current_price || listing.start_price ? Number(listing.price || listing.current_price || listing.start_price).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 }) : 'N/A'}</span>
                  {listing.perPrice && (
                    <span className="price-per-unit">₹ {Number(listing.perPrice).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 })} per unit</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Category Information */}
          {listing.category_name && (
            <div className="category-info-section">
              <div className="info-item">
                <span className="info-label">Category:</span>
                <span className="info-value">{listing.category_name}</span>
              </div>
              {listing.listingType && (
                <div className="info-item">
                  <span className="info-label">Listing Type:</span>
                  <span className="info-value">{listing.listingType === 'auction' ? 'Auction' : 'Fixed Price'}</span>
                </div>
              )}
              {listing.sellType && (
                <div className="info-item">
                  <span className="info-label">Sell Type:</span>
                  <span className="info-value">{listing.sellType === 'single' ? 'Single Sell' : 'Bulk Sell'}</span>
                </div>
              )}
            </div>
          )}

          {/* Auction Information */}
          {listing.listingType === 'auction' && (
            <div className="auction-info-section">
              <h3 className="section-subtitle">Auction Details</h3>
              {listing.status && (
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={`info-value status-${listing.status}`}>{listing.status}</span>
                </div>
              )}
              {listing.end_date && (
                <div className="info-item">
                  <span className="info-label">End Date:</span>
                  <span className="info-value">{new Date(listing.end_date).toLocaleString()}</span>
                </div>
              )}
              {listing.bids && Array.isArray(listing.bids) && listing.bids.length > 0 && (
                <div className="bids-section">
                  <h4 className="bids-title">Bids ({listing.bids.length})</h4>
                  <div className="bids-list">
                    {listing.bids.slice(0, 5).map((bid, index) => (
                      <div key={index} className="bid-item">
                        <span className="bid-amount">₹ {bid.amount || bid.bidAmount || 'N/A'}</span>
                        {bid.bidder_name && (
                          <span className="bidder-name">by {bid.bidder_name}</span>
                        )}
                        {bid.createdAt && (
                          <span className="bid-date">{new Date(bid.createdAt).toLocaleString()}</span>
                        )}
                      </div>
                    ))}
                    {listing.bids.length > 5 && (
                      <div className="bid-item more-bids">
                        <span>+{listing.bids.length - 5} more bids</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Listing Metadata */}
          <div className="metadata-section">
            {listing.viewCount !== undefined && (
              <div className="info-item">
                <span className="info-label">
                  <i className="fas fa-eye" style={{ marginRight: '0.5rem' }}></i>
                  Views:
                </span>
                <span className="info-value">{listing.viewCount || 0}</span>
              </div>
            )}
            {listing.createdAt && (
              <div className="info-item">
                <span className="info-label">Listed On:</span>
                <span className="info-value">{new Date(listing.createdAt).toLocaleString()}</span>
              </div>
            )}
            {listing.updatedAt && listing.updatedAt !== listing.createdAt && (
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">{new Date(listing.updatedAt).toLocaleString()}</span>
              </div>
            )}
            {listing.listing_id && (
              <div className="info-item">
                <span className="info-label">Listing ID:</span>
                <span className="info-value">{listing.listing_id}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {user && user.id !== (listing.user?._id || listing.user_id) ? (
            <div className="action-buttons-section">
              <button 
                className="send-message-btn"
                onClick={() => setShowMessageForm(true)}
              >
                <i className="fas fa-envelope"></i>
                Send Message
              </button>
              {(listing.user?.phone || listing.seller_phone) && (
                <a 
                  href={`tel:${listing.user?.phone || listing.seller_phone}`}
                  className="call-seller-btn"
                >
                  <i className="fas fa-phone"></i>
                  Call Seller
                </a>
              )}
            </div>
          ) : !user ? (
            <div className="action-buttons-section">
              <Link to="/login" className="send-message-btn">
                <i className="fas fa-envelope"></i>
                Send Message
              </Link>
              {(listing.user?.phone || listing.seller_phone) ? (
                <a 
                  href={`tel:${listing.user?.phone || listing.seller_phone}`}
                  className="call-seller-btn"
                >
                  <i className="fas fa-phone"></i>
                  Call Seller
                </a>
              ) : (
                <Link to="/login" className="call-seller-btn">
                  <i className="fas fa-phone"></i>
                  Call Seller
                </Link>
              )}
            </div>
          ) : null}

          {/* Mark as Sold Button (for seller) */}
          {user && user.id === (listing.user?._id || listing.user_id) && 
           listing.status !== 'sold' && listing.status !== 'sold_by_seller' && (
            <div className="action-buttons-section" style={{ marginTop: '1rem' }}>
              <button 
                className="mark-sold-btn"
                onClick={handleMarkAsSold}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-check-circle"></i>
                Mark as Sold
              </button>
            </div>
          )}


          {/* Description Section */}
          {listing.description && (
              <div className="description-section">
                <h3 className="description-title">Description</h3>
                <p className="description-text">{listing.description}</p>
              </div>
          )}
        </div>

        {/* Message Form Modal */}
        {showMessageForm && user && (
          <div className="message-overlay" onClick={() => setShowMessageForm(false)}>
            <div className="message-form-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Send Message</h3>
              <form onSubmit={handleSendMessage} className="message-form">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  required
                  rows="4"
                />
                <div className="message-actions">
                  <button type="submit" className="send-btn">
                    <i className="fas fa-paper-plane"></i>
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Form Modal */}
        {showReportForm && user && (
          <div className="message-overlay" onClick={() => setShowReportForm(false)}>
            <div className="message-form-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Report This Listing</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!reportReason) {
                  showError('Please select a reason');
                  return;
                }
                setReporting(true);
                try {
                  await axios.post('/api/reports', {
                    listing_id: listing._id || listing.id,
                    reason: reportReason,
                    description: reportDescription
                  });
                  success('Report submitted successfully. Thank you for helping us maintain a safe marketplace.');
                  setShowReportForm(false);
                  setReportReason('');
                  setReportDescription('');
                } catch (error) {
                  showError(error.response?.data?.error || 'Error submitting report');
                } finally {
                  setReporting(false);
                }
              }} className="message-form">
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Reason *</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e5e7eb' }}
                  >
                    <option value="">Select a reason</option>
                    <option value="Spam or Scam">Spam or Scam</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Misleading Information">Misleading Information</option>
                    <option value="Duplicate Listing">Duplicate Listing</option>
                    <option value="Wrong Category">Wrong Category</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description (Optional)</label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Provide additional details..."
                    rows="4"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e5e7eb' }}
                  />
                </div>
                <div className="message-actions">
                  <button type="submit" className="send-btn" disabled={reporting}>
                    <i className="fas fa-flag"></i>
                    {reporting ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReportForm(false);
                      setReportReason('');
                      setReportDescription('');
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Similar Products Section */}
      {similarListings.length > 0 && (
        <div className="similar-products-section">
          <div className="section-header">
            <h2 className="section-title">Similar Products</h2>
            <Link 
              to={`/category/${listing.category?.slug || listing.category_slug || 'iphone'}`} 
              className="view-all-link"
            >
              View All
              <i className="fas fa-chevron-right"></i>
            </Link>
          </div>
          <div className="similar-products-grid">
            {similarListings.map((similarListing) => (
              <ListingCard key={similarListing._id || similarListing.id} listing={similarListing} />
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmMarkAsSold}
        title="Mark as Sold"
        message="Are you sure you want to mark this listing as sold? This action cannot be undone."
        confirmText="Mark as Sold"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default ListingDetail;

