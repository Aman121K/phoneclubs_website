import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlogDetailSkeleton from '../../components/SkeletonLoaders/BlogDetailSkeleton';
import './BlogDetail.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/blogs/${slug}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      if (error.response?.status === 404) {
        // Blog not found
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <div className="error-message">
            <h2>Blog Not Found</h2>
            <p>The blog post you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/blog')} className="back-btn">
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <button onClick={() => navigate('/blog')} className="back-btn">
          ← Back to Blog
        </button>

        {blog.featuredImage && (
          <div className="blog-detail-image">
            <img src={blog.featuredImage} alt={blog.title} />
          </div>
        )}

        <article className="blog-detail-content">
          <div className="blog-detail-header">
            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-detail-category">
                {blog.tags[0].toUpperCase()}
              </div>
            )}
            <h1>{blog.title}</h1>
            <div className="blog-detail-meta">
              {blog.author && (
                <span className="blog-author">
                  By {blog.author.name || 'Admin'}
                </span>
              )}
              <span className="blog-date">
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
              {blog.views !== undefined && (
                <span className="blog-views">
                  {blog.views} {blog.views === 1 ? 'view' : 'views'}
                </span>
              )}
            </div>
          </div>

          <div
            className="blog-detail-body"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-detail-tags">
              <strong>Tags: </strong>
              {blog.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;

