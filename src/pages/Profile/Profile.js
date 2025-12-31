import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import ListingCard from '../../components/ListingCard/ListingCard';
import { IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchMyListings();
    fetchMyBids();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyListings = async () => {
    try {
      const response = await axios.get('/api/listings/user/my-listings');
      setMyListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const fetchMyBids = async () => {
    try {
      const response = await axios.get('/api/auctions/my-bids');
      setMyBids(response.data);
    } catch (error) {
      console.error('Error fetching my bids:', error);
    }
  };

  const handleDeleteListing = (listingId) => {
    setListingToDelete(listingId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteListing = async () => {
    setShowDeleteConfirm(false);
    try {
      await axios.delete(`/api/listings/${listingToDelete}`);
      success('Listing deleted successfully');
      fetchMyListings(); // Refresh the list
    } catch (error) {
      console.error('Error deleting listing:', error);
      showError(error.response?.data?.error || 'Error deleting listing');
    } finally {
      setListingToDelete(null);
    }
  };

  const handleEditListing = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header Section */}
        <div className="profile-header-section">
          <div className="profile-header-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-badge">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <div className="profile-header-info">
              <h1>{profile?.name || 'User'}</h1>
              <p className="profile-email">{profile?.email}</p>
              {profile?.city && (
                <div className="profile-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{profile.city}</span>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon listings-icon">
              <i className="fas fa-list"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{myListings.length}</div>
              <div className="stat-label">My Listings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bids-icon">
              <i className="fas fa-gavel"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{myBids.length}</div>
              <div className="stat-label">My Bids</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon profile-icon">
              <i className="fas fa-user"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{profile?.userType === 'seller' ? 'Seller' : 'Buyer'}</div>
              <div className="stat-label">Account Type</div>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        {profile && (
          <div className="profile-details-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-user-circle"></i>
                Profile Information
              </h2>
            </div>
            <div className="profile-details-grid">
              <div className="detail-item">
                <div className="detail-icon">
                  <i className="fas fa-user"></i>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Full Name</div>
                  <div className="detail-value">{profile.name}</div>
            </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Email Address</div>
                  <div className="detail-value">{profile.email}</div>
                </div>
              </div>
              {profile.phone && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Phone Number</div>
                    <div className="detail-value">{profile.phone}</div>
                  </div>
                </div>
            )}
            {profile.city && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Location</div>
                    <div className="detail-value">{profile.city}</div>
                  </div>
              </div>
            )}
            </div>
          </div>
        )}

        <div className="my-listings-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-list"></i>
              <h2>My Listings</h2>
              <span className="section-count">({myListings.length})</span>
            </div>
            {user.userType !== 'buyer' && (
              <Link to="/post-ad" className="add-listing-btn">
                <i className="fas fa-plus"></i>
                <span>Create New Listing</span>
              </Link>
            )}
          </div>
          {myListings.length === 0 ? (
            <div className="no-listings">
              <div className="no-listings-content">
                <div className="no-listings-emoji">📱</div>
                <h3>No Listings Yet</h3>
              <p>You haven't posted any listings yet.</p>
              {user.userType !== 'buyer' && (
                  <Link to="/post-ad" className="post-ad-btn">
                    <i className="fas fa-plus"></i>
                    Post Your First Ad
                  </Link>
              )}
              </div>
            </div>
          ) : (
            <div className="listings-grid">
              {myListings.map((listing) => (
                <Box key={listing._id || listing.id} sx={{ position: 'relative' }}>
                  <ListingCard listing={listing} />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      display: 'flex',
                      gap: '0.5rem',
                      zIndex: 10,
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditListing(listing._id || listing.id);
                      }}
                      sx={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        '&:hover': {
                          backgroundColor: '#1d4ed8',
                        },
                      }}
                      aria-label="Edit listing"
                    >
                      <Edit sx={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteListing(listing._id || listing.id);
                      }}
                      sx={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        '&:hover': {
                          backgroundColor: '#dc2626',
                        },
                      }}
                      aria-label="Delete listing"
                    >
                      <Delete sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </div>
          )}
        </div>

        <div className="my-bids-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-gavel"></i>
              <h2>My Bids</h2>
              <span className="section-count">({myBids.length})</span>
            </div>
            <Link to="/auctions" className="browse-auctions-btn">
              <i className="fas fa-search"></i>
              <span>Browse Auctions</span>
            </Link>
          </div>
          {myBids.length === 0 ? (
            <div className="no-listings">
              <div className="no-listings-content">
                <div className="no-listings-emoji">🔨</div>
                <h3>No Bids Yet</h3>
              <p>You haven't placed any bids yet.</p>
                <Link to="/auctions" className="post-ad-btn">
                  <i className="fas fa-gavel"></i>
                  Browse Auctions
                </Link>
              </div>
            </div>
          ) : (
            <div className="listings-grid">
              {myBids.map((auction) => {
                // Convert auction to listing format for ListingCard
                const listingFormat = {
                  _id: auction.id || auction._id, // Use auction ID for linking to auction detail
                  id: auction.id || auction._id,
                  title: auction.title,
                  price: auction.current_price,
                  city: auction.city,
                  listingType: 'auction',
                  imageUrl: auction.image_url,
                  images: auction.images || (auction.image_url ? [auction.image_url] : []),
                  description: auction.description,
                  user: {
                    name: auction.seller_name,
                    city: auction.city
                  },
                  category: auction.category_name ? { name: auction.category_name } : null,
                  // Add auction-specific info
                  auctionInfo: {
                    startPrice: auction.start_price,
                    currentPrice: auction.current_price,
                    endDate: auction.end_date,
                    status: auction.status,
                    myHighestBid: auction.my_highest_bid,
                    myBidDate: auction.my_bid_date
                  }
                };
                return (
                  <div key={auction.id || auction._id} style={{ position: 'relative' }}>
                    <ListingCard listing={listingFormat} />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(249, 115, 22, 0.95)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      pointerEvents: 'none'
                    }}>
                      My Bid: AED {auction.my_highest_bid}
                    </div>
                    {auction.status === 'live' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: '#2563eb',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        pointerEvents: 'none'
                      }}>
                        Live Auction
                      </div>
                    )}
                    {auction.status === 'ended' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: '#6b7280',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        pointerEvents: 'none'
                      }}>
                        Ended
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setListingToDelete(null);
        }}
        onConfirm={confirmDeleteListing}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Profile;

