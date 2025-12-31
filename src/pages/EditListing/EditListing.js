import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './EditListing.css';

const EditListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error: showError, warning } = useToast();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    price: '',
    per_price: '',
    storage: '',
    condition: '',
    city: '',
    listing_type: 'fixed_price',
    sellType: 'single',
    start_price: '',
    end_date: '',
    quantity: 1
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.userType === 'buyer') {
      warning('Buyers can only bid on listings. Please register as a seller to edit listings.');
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    fetchCategories();
    fetchListing();
  }, [user, navigate, id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/api/listings/${id}`);
      const listing = response.data;

      // Check if user is the owner
      if (listing.user?._id !== user.id && listing.user?._id !== user._id) {
        showError('You can only edit your own listings');
        setTimeout(() => navigate('/profile'), 2000);
        return;
      }

      // Set form data
      setFormData({
        category_id: listing.category?._id || '',
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price || '',
        per_price: listing.perPrice || '',
        storage: listing.storage || '',
        condition: listing.condition || '',
        city: listing.city || user.city || '',
        listing_type: listing.listingType || 'fixed_price',
        sellType: listing.sellType || 'single',
        start_price: '',
        end_date: '',
        quantity: listing.quantity || 1
      });

      // Set existing images
      if (listing.images && listing.images.length > 0) {
        setImagePreviews(listing.images);
      } else if (listing.imageUrl) {
        setImagePreviews([listing.imageUrl]);
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      showError('Error loading listing. Please try again.');
      setTimeout(() => navigate('/profile'), 2000);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageError('');

    if (files.length === 0) {
      return;
    }

    if (files.length > 5) {
      setImageError('Maximum 5 images allowed');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setImageError('Only image files are allowed (jpeg, jpg, png, gif, webp)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setImageError('Each image must be less than 5MB');
      return;
    }

    // Add new files to existing images
    const newFiles = files.filter(file => !images.includes(file));
    setImages([...images, ...newFiles]);

    // Create previews for new files
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    // If it's a new file, remove from images array too
    if (index < images.length) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImageError('');

    // Validate images
    const totalImages = imagePreviews.length;
    if (totalImages === 0) {
      setImageError('At least one image is required');
      setLoading(false);
      return;
    }

    if (totalImages > 5) {
      setImageError('Maximum 5 images allowed');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      // Separate existing images (URLs) from new files
      const existingImageUrls = imagePreviews.filter(preview => 
        preview.startsWith('http://') || preview.startsWith('https://')
      );
      const newImageFiles = images;

      // Add existing image URLs as JSON string
      if (existingImageUrls.length > 0) {
        submitData.append('existing_images', JSON.stringify(existingImageUrls));
      }

      // Add new image files
      newImageFiles.forEach((file) => {
        submitData.append('images', file);
      });

      // Update listing
      await axios.put(`/api/listings/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      success('Listing updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Error updating listing:', error);
      showError(error.response?.data?.error || 'Error updating listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-listing-page">
      <div className="edit-listing-container">
        <h1>Edit Listing</h1>
        <form onSubmit={handleSubmit} className="edit-listing-form">
          {/* Category */}
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., iPhone 15 Pro Max 256GB"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe your iPhone..."
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (AED) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Per Price (for bulk) */}
          {formData.sellType === 'bulk' && (
            <div className="form-group">
              <label>Per Price (AED)</label>
              <input
                type="number"
                name="per_price"
                value={formData.per_price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          )}

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          {/* Storage */}
          <div className="form-group">
            <label>Storage *</label>
            <select
              name="storage"
              value={formData.storage}
              onChange={handleChange}
              required
            >
              <option value="">Select Storage</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
          </div>

          {/* Condition */}
          <div className="form-group">
            <label>Condition *</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select Condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          {/* City */}
          <div className="form-group">
            <label>City *</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled
            >
              <option value={formData.city}>{formData.city}</option>
            </select>
          </div>

          {/* Sell Type */}
          <div className="form-group">
            <label>Sell Type *</label>
            <select
              name="sellType"
              value={formData.sellType}
              onChange={handleChange}
              required
            >
              <option value="single">Single</option>
              <option value="bulk">Bulk</option>
            </select>
          </div>

          {/* Images */}
          <div className="form-group">
            <label>Images (1-5 images) *</label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageError && <div className="error-message">{imageError}</div>}
            
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;

