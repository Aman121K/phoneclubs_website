import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlogCardSkeleton from '../../components/SkeletonLoaders/BlogCardSkeleton';
import './Blog.css';

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blogs');
      setBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
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

  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return 'News';
    // Map common tags to categories
    const tag = tags[0].toLowerCase();
    if (tag.includes('buying') || tag.includes('guide')) return 'BUYING GUIDE';
    if (tag.includes('selling') || tag.includes('tips')) return 'SELLING TIPS';
    if (tag.includes('maintenance')) return 'MAINTENANCE';
    if (tag.includes('market')) return 'MARKET TIPS';
    return tags[0].toUpperCase();
  };

  return (
    <div className="blog-page">
      <div className="page-hero">
        <h1>Our News</h1>
        <p>Stay updated with the latest news and tips about iPhones</p>
      </div>
      <div className="blog-container">
        {loading ? (
          <div className="blog-grid">
            {[...Array(6)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="blog-empty">
            <p>No blog posts available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.map((post) => (
              <article key={post._id || post.id} className="blog-card">
                {post.featuredImage && (
                  <div className="blog-image">
                    <img src={post.featuredImage} alt={post.title} />
                  </div>
                )}
                {/* <div className="blog-category">
                  {getCategoryFromTags(post.tags)}
                </div> */}
                <h2>{post.title}</h2>
                <p className="blog-excerpt">
                Every Android Phone Got Hacked, But Not iPhone?” — The Truth Behind the Claim and bold headline recently made waves:
                  {/* {post.description || post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'No description available.')} */}
                </p>
                <div className="blog-meta">
                  <span className="blog-date">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>
                <button
                  className="read-more-btn"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  Read More
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

