import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  LocationOn,
  Share,
  Flag,
  Visibility,
} from '@mui/icons-material';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { trackGTMEvent, trackFacebookEvent } from '../../utils/marketingTags';
import axios from 'axios';
import './ListingCard.css';

const ListingCard = ({ listing, className, isHome = false }) => {
  const { info, success, error: showError } = useToast();
  const { user } = useAuth();
  const { trackEvent } = useFirebase();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reporting, setReporting] = useState(false);

  // Get all images for the listing
  const getImages = () => {
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      return listing.images.filter(img => img);
    }
    if (listing.imageUrl || listing.image_url) {
      return [listing.imageUrl || listing.image_url];
    }
    return [];
  };

  const images = getImages();
  const hasMultipleImages = images.length > 1;
  const displayImage = imageError || images.length === 0 ? '/logo.png' : images[currentImageIndex];

  const handlePrevious = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageError(false);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageError(false);
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasMultipleImages) {
      handleNext(e);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getSellerInitial = (name) => {
    return name ? name.charAt(0).toLowerCase() : 's';
  };

  const getSellerColor = (name) => {
    const colors = ['#2563eb', '#f97316']; // Blue and Orange only
    const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const listingUrl = `${window.location.origin}${listing.listingType === 'auction' ? '/auction' : '/listing'}/${listing._id || listing.id}`;
    
    const eventData = {
      listing_id: listing._id || listing.id,
      listing_type: listing.listingType || 'fixed_price',
      method: navigator.share ? 'native_share' : 'clipboard',
    };
    
    trackEvent('share_listing', eventData);
    trackGTMEvent('share_listing', eventData);
    trackFacebookEvent('Share', {
      content_name: listing.title,
      content_type: 'listing',
    });
    
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description || listing.title,
        url: listingUrl
      }).catch(() => {
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(listingUrl);
        info('Link copied to clipboard!');
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(listingUrl);
      info('Link copied to clipboard!');
    }
  };

  const handleReportClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.id === (listing.user?._id || listing.user_id)) {
      showError('You cannot report your own listing');
      return;
    }
    setShowReportDialog(true);
  };

  const handleReportSubmit = async (e) => {
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
      setShowReportDialog(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      showError(error.response?.data?.error || 'Error submitting report. Please try again.');
    } finally {
      setReporting(false);
    }
  };

  // Determine the correct route based on listing type
  const listingRoute = listing.listingType === 'auction' 
    ? `/auction/${listing._id || listing.id}` 
    : `/listing/${listing._id || listing.id}`;

  const handleCardClick = () => {
    const eventData = {
      listing_id: listing._id || listing.id,
      listing_type: listing.listingType || 'fixed_price',
      category: listing.category?.name || 'unknown',
      price: listing.price || 0,
      is_home: isHome,
    };
    
    trackEvent('view_listing', eventData);
    
    // Track to marketing platforms
    trackGTMEvent('view_listing', eventData);
    trackFacebookEvent('ViewContent', {
      content_name: listing.title,
      content_category: listing.category?.name,
      content_ids: [listing._id || listing.id],
      value: listing.price || 0,
      currency: 'INR',
    });
  };

  return (
    <Card
      component={showReportDialog ? 'div' : Link}
      to={showReportDialog ? undefined : listingRoute}
      onClick={handleCardClick}
      className={isHome ? `home-listing-card listing-card ${className || ''}` : `listing-card ${className || ''}`}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        transition: 'none',
        flexShrink: 0,
        position: 'relative',
      }}
      onClick={(e) => {
        if (showReportDialog) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '180px',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px 12px 0 0',
        }}
      >
        {/* Report Button - Left Side */}
        <IconButton
          onClick={handleReportClick}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            width: 32,
            height: 32,
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
            },
          }}
          aria-label="Report listing"
          title="Report this listing"
        >
          <Flag sx={{ fontSize: '0.9rem', color: '#dc2626' }} />
        </IconButton>
        
        {/* Share Button - Right Side */}
        <IconButton
          onClick={handleShare}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            width: 32,
            height: 32,
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
          aria-label="Share listing"
          title="Share listing"
        >
          <Share sx={{ fontSize: '1rem', color: '#1e293b' }} />
        </IconButton>
        <CardMedia
          component="img"
          image={displayImage}
          alt={listing.title}
          onError={handleImageError}
          onClick={handleImageClick}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: hasMultipleImages ? 'pointer' : 'default',
            ...(imageError && {
              objectFit: 'contain',
              padding: '1rem',
              maxWidth: '80%',
              maxHeight: '80%',
            }),
          }}
        />
        
        {hasMultipleImages && !imageError && (
          <>
            <IconButton
              className="carousel-btn carousel-btn-left"
              onClick={handlePrevious}
              aria-label="Previous image"
              size="small"
              sx={{
                position: 'absolute',
                left: 4,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                width: 24,
                height: 24,
                // '&:hover': {
                //   backgroundColor: 'rgba(255, 255, 255, 1)',
                // },
                zIndex: 2,
                '& svg': {
                  fontSize: '1rem',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              className="carousel-btn carousel-btn-right"
              onClick={handleNext}
              aria-label="Next image"
              size="small"
              sx={{
                position: 'absolute',
                right: 4,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                width: 24,
                height: 24,
                // '&:hover': {
                //   backgroundColor: 'rgba(255, 255, 255, 1)',
                // },
                zIndex: 2,
                '& svg': {
                  fontSize: '1rem',
                },
              }}
            >
              <ChevronRight />
            </IconButton>
            <Chip
              label={`${currentImageIndex + 1} / ${images.length}`}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 4,
                left: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                fontSize: '0.65rem',
                height: '18px',
                '& .MuiChip-label': {
                  padding: '0 6px',
                },
              }}
            />
          </>
        )}
      </Box>
      
      <CardContent 
        component={showReportDialog ? 'div' : Link}
        to={showReportDialog ? undefined : listingRoute}
        sx={{ 
          flexGrow: 1, 
          p: '0.65rem', 
          '&:last-child': { pb: '0.65rem' },
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          overflow: 'visible',
          textDecoration: 'none',
          color: 'inherit',
          ...(showReportDialog && {
            pointerEvents: 'none',
            '& > *': {
              pointerEvents: 'auto',
            },
          }),
        }}
        onClick={(e) => {
          if (showReportDialog) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#000000',
            mb: '0.3rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            minHeight: '2.4em',
          }}
        >
          {listing.title}
        </Typography>
        
        {/* Product Attributes */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', mb: '0.15rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Typography variant="body2" sx={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 400 }}>
              Age
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#000000' }}>
              {listing.condition || 'Brand New'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Typography variant="body2" sx={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 400 }}>
              Storage
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#000000' }}>
              {listing.storage || 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Typography variant="body2" sx={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 400 }}>
              Warranty
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#000000' }}>
              {listing.warranty || 'Yes'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: '0.1rem', borderColor: '#e5e7eb' }} />

        {/* Seller and Location */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom:2 }}>
          {/* Seller Information */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: getSellerColor(listing.user?.name),
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {getSellerInitial(listing.user?.name)}
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 500, 
                  color: '#000000',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {listing.user?.name || 'Seller'}
              </Typography>
              {(listing.user?.isVerifiedSeller || listing.user?.phoneVerified) && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '0.6rem',
                  }}
                  title={listing.user?.isVerifiedSeller ? 'Verified Seller' : 'Phone Verified'}
                >
                  ✓
                </Box>
              )}
            </Box>
          </Box>

          {/* Location Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <LocationOn sx={{ fontSize: '0.75rem', color: '#f97316' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.7rem', 
                  color: '#6b7280', 
                  textTransform: 'capitalize',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {listing.user?.city || listing.city || 'Location'}
              </Typography>
            </Box>
            {listing.distance && (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.65rem', 
                  color: '#6b7280',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {listing.distance} km away
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* Price and Views */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '0.25rem' }}>
          {/* View Count */}
          {listing.viewCount !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Visibility sx={{ fontSize: '0.7rem', color: '#6b7280' }} />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.65rem',
                  color: '#6b7280',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {listing.viewCount || 0} views
              </Typography>
            </Box>
          )}
          {/* Price */}
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#008556',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            ₹ {Number(listing.price).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 })}
          </Typography>
        </Box>
      </CardContent>

      {/* Report Dialog - Rendered in portal to prevent navigation */}
      <Dialog
        open={showReportDialog}
        onClose={() => {
          setShowReportDialog(false);
          setReportReason('');
          setReportDescription('');
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={false}
        PaperProps={{
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          onMouseDown: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
        }}
      >
        <form 
          onSubmit={handleReportSubmit}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DialogTitle 
            sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            Report This Listing
          </DialogTitle>
          <DialogContent
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', mt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Reason for Reporting</InputLabel>
                <Select
                  value={reportReason}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setReportReason(e.target.value);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  label="Reason for Reporting"
                >
                  <MenuItem 
                    value="Spam or Scam"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Spam or Scam</MenuItem>
                  <MenuItem 
                    value="Inappropriate Content"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Inappropriate Content</MenuItem>
                  <MenuItem 
                    value="Pornography or Adult Content"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Pornography or Adult Content</MenuItem>
                  <MenuItem 
                    value="Drugs or Illegal Items"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Drugs or Illegal Items</MenuItem>
                  <MenuItem 
                    value="Misleading Information"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Misleading Information</MenuItem>
                  <MenuItem 
                    value="Duplicate Listing"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Duplicate Listing</MenuItem>
                  <MenuItem 
                    value="Wrong Category"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Wrong Category</MenuItem>
                  <MenuItem 
                    value="Fake Product"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Fake Product</MenuItem>
                  <MenuItem 
                    value="Other"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Details (Optional)"
                value={reportDescription}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setReportDescription(e.target.value);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                placeholder="Provide more information about why you're reporting this listing..."
              />
            </Box>
          </DialogContent>
          <DialogActions 
            sx={{ p: 2, gap: 1 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowReportDialog(false);
                setReportReason('');
                setReportDescription('');
              }}
              disabled={reporting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={reporting || !reportReason}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              sx={{
                backgroundColor: '#dc2626',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                },
              }}
            >
              {reporting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
};

export default ListingCard;

