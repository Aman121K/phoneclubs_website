import React from 'react';
import { Box, Skeleton } from '@mui/material';

const BlogCardSkeleton = () => {
  return (
    <article className="blog-card" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        sx={{ borderRadius: '12px 12px 0 0' }}
      />

      <Box sx={{ p: '1.5rem' }}>
        {/* Title Skeleton */}
        <Skeleton variant="text" width="90%" height={28} sx={{ mb: '1rem' }} />
        <Skeleton variant="text" width="70%" height={28} sx={{ mb: '1rem' }} />

        {/* Excerpt Skeleton */}
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: '0.5rem' }} />
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: '0.5rem' }} />
        <Skeleton variant="text" width="80%" height={16} sx={{ mb: '1rem' }} />

        {/* Meta Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mb: '1rem' }}>
          <Skeleton variant="text" width={100} height={14} />
        </Box>

        {/* Button Skeleton */}
        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: '6px' }} />
      </Box>
    </article>
  );
};

export default BlogCardSkeleton;

