import React from 'react';
import { Box, Skeleton } from '@mui/material';

const BlogDetailSkeleton = () => {
  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        {/* Back Button Skeleton */}
        <Skeleton
          variant="rectangular"
          width={120}
          height={36}
          sx={{ mb: '2rem', borderRadius: '6px' }}
        />

        {/* Image Skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ mb: '2rem', borderRadius: '12px' }}
        />

        <article className="blog-detail-content">
          {/* Category Skeleton */}
          <Skeleton
            variant="rectangular"
            width={120}
            height={24}
            sx={{ mb: '1rem', borderRadius: '4px' }}
          />

          {/* Title Skeleton */}
          <Skeleton variant="text" width="90%" height={48} sx={{ mb: '1rem' }} />
          <Skeleton variant="text" width="70%" height={48} sx={{ mb: '2rem' }} />

          {/* Meta Skeleton */}
          <Box sx={{ display: 'flex', gap: '1.5rem', mb: '2rem', flexWrap: 'wrap' }}>
            <Skeleton variant="text" width={100} height={16} />
            <Skeleton variant="text" width={100} height={16} />
            <Skeleton variant="text" width={80} height={16} />
          </Box>

          {/* Content Skeleton */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="95%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />
            <Box sx={{ my: '2rem' }}>
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '8px' }} />
            </Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="85%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="95%" height={20} />
          </Box>

          {/* Tags Skeleton */}
          <Box sx={{ mt: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: '4px' }} />
            <Skeleton variant="rectangular" width={100} height={28} sx={{ borderRadius: '4px' }} />
            <Skeleton variant="rectangular" width={90} height={28} sx={{ borderRadius: '4px' }} />
          </Box>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;

