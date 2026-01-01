import React from 'react';
import { Card, Box, Skeleton } from '@mui/material';

const CategoryCardSkeleton = () => {
  return (
    <Card
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        background: '#2563eb',
        color: '#fff',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
        border: '2px solid #2563eb',
        flexShrink: 0,
        width: '240px',
        minWidth: '240px',
        maxWidth: '240px',
      }}
    >
      <Skeleton
        variant="text"
        width="80%"
        height={32}
        sx={{
          mx: 'auto',
          mb: '0.5rem',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      <Skeleton
        variant="text"
        width="50%"
        height={20}
        sx={{
          mx: 'auto',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
    </Card>
  );
};

export default CategoryCardSkeleton;

