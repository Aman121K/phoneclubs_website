import React from 'react';
import { Box, Skeleton } from '@mui/material';

const LocationCardSkeleton = () => {
  return (
    <Box
      sx={{
        width: '240px',
        minWidth: '240px',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        flexShrink: 0,
      }}
    >
      <Skeleton variant="text" width="70%" height={24} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: '0.5rem' }}>
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton variant="text" width="60%" height={16} />
      </Box>
    </Box>
  );
};

export default LocationCardSkeleton;

