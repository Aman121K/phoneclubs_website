import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

const AuctionCardSkeleton = () => {
  return (
    <Card
      sx={{
        width: '240px',
        height: 'auto',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        flexShrink: 0,
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={180}
      />

      <CardContent sx={{ p: '0.75rem', '&:last-child': { pb: '0.75rem' } }}>
        {/* Title Skeleton */}
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: '0.5rem' }} />
        <Skeleton variant="text" width="65%" height={20} sx={{ mb: '0.8rem' }} />

        {/* Bid Info Skeleton */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', mb: '0.5rem' }}>
          <Skeleton variant="text" width="70%" height={18} />
          <Skeleton variant="text" width="50%" height={16} />
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', backgroundColor: '#e5e7eb', my: '0.35rem' }} />

        {/* Seller Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem', mb: '0.5rem' }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={60} height={16} />
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', backgroundColor: '#e5e7eb', my: '0.35rem' }} />

        {/* Location Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', mb: '0.5rem' }}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width={50} height={16} />
        </Box>
      </CardContent>

      {/* Bid Input Section Skeleton */}
      <Box
        sx={{
          p: '0.75rem',
          pt: 0,
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Skeleton variant="text" width="60%" height={16} sx={{ mb: '0.5rem' }} />
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Skeleton variant="rectangular" width="70%" height={36} sx={{ borderRadius: '4px' }} />
          <Skeleton variant="rectangular" width="30%" height={36} sx={{ borderRadius: '4px' }} />
        </Box>
      </Box>
    </Card>
  );
};

export default AuctionCardSkeleton;

