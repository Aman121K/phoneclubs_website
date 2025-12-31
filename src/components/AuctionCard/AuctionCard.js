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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  LocationOn,
  Share,
  Flag,
} from '@mui/icons-material';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import './AuctionCard.css';

const AuctionCard = ({ auction, onBidSuccess }) => {
  const { info, success, error: showError } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState('');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reporting, setReporting] = useState(false);

  // Get all images for the auction
  const getImages = () => {
    if (auction.images && Array.isArray(auction.images) && auction.images.length > 0) {
      return auction.images.filter(img => img);
    }
    if (auction.imageUrl || auction.image_url) {
      return [auction.imageUrl || auction.image_url];
    }
    return [];
  };

  const images = getImages();
  const hasMultipleImages = images.length > 1;
  const displayImage = imageError || images.length === 0 ? '/logo.png' : images[currentImageIndex];
  const currentPrice = auction.current_price || auction.price || auction.start_price || 0;
  const minBid = currentPrice + 1;

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
    const colors = ['#2563eb', '#f97316'];
    const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const auctionUrl = `${window.location.origin}/auction/${auction._id || auction.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: auction.title,
        text: auction.description || auction.title,
        url: auctionUrl
      }).catch(() => {
        navigator.clipboard.writeText(auctionUrl);
        info('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(auctionUrl);
      info('Link copied to clipboard!');
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bidValue = parseFloat(bidAmount);
    
    if (!bidAmount || isNaN(bidValue)) {
      setError('Please enter a valid bid amount');
      return;
    }
    
    if (bidValue < minBid) {
      setError(`Bid must be at least AED ${minBid}`);
      return;
    }
    
    setBidding(true);
    setError('');
    
    try {
      const response = await axios.post(`/api/auctions/${auction._id || auction.id}/bid`, {
        amount: bidValue
      });
      
      if (response.data.success) {
        setBidAmount('');
        setError('');
        if (onBidSuccess) {
          onBidSuccess(auction._id || auction.id, bidValue);
        }
        success('Bid placed successfully!');
      } else {
        setError(response.data.error || 'Failed to place bid');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setError(error.response?.data?.error || 'Failed to place bid. Please try again.');
    } finally {
      setBidding(false);
    }
  };

  const handleReportClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.id === (auction.seller_id || auction.user_id || auction.user?._id)) {
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
        listing_id: auction.listing_id || auction.listing?._id || auction._id,
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

  return (
    <Card
      className="auction-card-component"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        height: 'auto',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        transition: 'none',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      <Box
        component={showReportDialog ? 'div' : Link}
        to={showReportDialog ? '#' : `/auction/${auction._id || auction.id}`}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
        }}
        onClick={(e) => {
          if (showReportDialog) {
            e.preventDefault();
            e.stopPropagation();
            return false;
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
          }}
        >
          {/* Report Button - Left Side */}
          <IconButton
            onClick={handleReportClick}
            sx={{
              position: 'absolute',
              top: auction.status === 'live' ? 48 : 8,
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
            aria-label="Report auction"
            title="Report this auction"
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
            aria-label="Share auction"
            title="Share auction"
          >
            <Share sx={{ fontSize: '1rem', color: '#1e293b' }} />
          </IconButton>
          
          {auction.status === 'live' && (
            <Chip
              label="LIVE"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                zIndex: 10,
                animation: 'pulse 2s infinite',
              }}
            />
          )}
          
          <CardMedia
            component="img"
            image={displayImage}
            alt={auction.title}
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
                  zIndex: 2,
                  '& svg': {
                    fontSize: '1rem',
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
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
          sx={{ 
            flexGrow: 1, 
            p: '0.75rem', 
            '&:last-child': { pb: '0.75rem' },
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            overflow: 'visible',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#000000',
              mb: '0.4rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFamily: "'Inter', sans-serif",
              minHeight: '2.4em',
            }}
          >
            {auction.title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', mb: '0.35rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Typography variant="body2" sx={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 400 }}>
                Current Bid
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#f97316' }}>
                AED {currentPrice.toLocaleString()}
              </Typography>
            </Box>
            {auction.bid_count > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Typography variant="body2" sx={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 400 }}>
                  Bids
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#000000' }}>
                  {auction.bid_count}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: '0.35rem' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem', mb: '0.35rem' }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: getSellerColor(auction.seller_name || auction.user?.name),
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {getSellerInitial(auction.seller_name || auction.user?.name)}
            </Avatar>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.7rem', 
                fontWeight: 500, 
                color: '#000000',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {auction.seller_name || auction.user?.name || 'Seller'}
            </Typography>
          </Box>

          <Divider sx={{ my: '0.35rem' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '0.5rem' }}>
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
                {auction.city || auction.user?.city || 'Ajman'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Box>

      {/* Bid Input Section */}
      <Box
        component="form"
        onSubmit={handleBidSubmit}
        onClick={(e) => e.stopPropagation()}
        sx={{
          p: '0.75rem',
          pt: 0,
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.7rem',
            color: '#64748b',
            mb: '0.5rem',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Place Your Bid (Min: AED {minBid})
        </Typography>
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <TextField
            type="number"
            placeholder={`Min ${minBid}`}
            value={bidAmount}
            onChange={(e) => {
              setBidAmount(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error}
            size="small"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                fontFamily: "'Inter', sans-serif",
              },
              '& .MuiFormHelperText-root': {
                fontSize: '0.65rem',
                marginTop: '0.25rem',
              },
            }}
            inputProps={{
              min: minBid,
              step: 1,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={bidding || !bidAmount}
            sx={{
              backgroundColor: '#dc2626',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              padding: '0.5rem 1rem',
              minWidth: '80px',
              fontFamily: "'Inter', sans-serif",
              '&:hover': {
                backgroundColor: '#b91c1c',
              },
              '&:disabled': {
                backgroundColor: '#94a3b8',
              },
            }}
          >
            {bidding ? 'Bidding...' : 'Bid'}
          </Button>
        </Box>
      </Box>

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
            Report This Auction
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
                    value="Fake Auction"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >Fake Auction</MenuItem>
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
                placeholder="Provide more information about why you're reporting this auction..."
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

export default AuctionCard;

