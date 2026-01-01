import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

const ListingCardSkeleton = () => {
  return (
    <Card
      sx={{
        width: '240px',
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
        sx={{ borderRadius: '12px 12px 0 0' }}
      />

      <CardContent sx={{ p: '0.65rem', '&:last-child': { pb: '0.65rem' } }}>
        {/* Title Skeleton */}
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: '0.5rem' }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: '0.8rem' }} />

        {/* Attributes Skeleton */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', mb: '0.3rem' }}>
          <Skeleton variant="text" width="70%" height={16} />
          <Skeleton variant="text" width="65%" height={16} />
          <Skeleton variant="text" width="55%" height={16} />
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', backgroundColor: '#e5e7eb', my: '0.4rem' }} />

        {/* Seller and Location Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '0.4rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={60} height={16} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
            <Skeleton variant="text" width={50} height={14} />
            <Skeleton variant="text" width={40} height={12} />
          </Box>
        </Box>

        {/* Price Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '0.3rem' }}>
          <Skeleton variant="text" width={80} height={20} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ListingCardSkeleton;

