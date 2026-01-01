import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { trackGTMEvent, trackFacebookEvent, trackLinkedInEvent, trackGoogleAdsConversion } from '../../utils/marketingTags';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { trackEvent } = useFirebase();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    latitude: null,
    longitude: null,
    userType: 'buyer',
    sellerType: '',
    businessName: '',
    tradeLicense: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [locationStatus, setLocationStatus] = useState('detecting'); // detecting, detected, failed

  // Reverse geocode coordinates to get city name
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'PhoneClubs/1.0'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.address) {
        // Try to get city from various possible fields
        const city = data.address.city || 
                    data.address.town || 
                    data.address.village || 
                    data.address.county ||
                    data.address.state_district ||
                    data.address.state ||
                    'Unknown';
        return city;
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  // Detect user location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Store coordinates
            setFormData(prev => ({
              ...prev,
              latitude,
              longitude
            }));
            
            // Reverse geocode to get city
            const city = await reverseGeocode(latitude, longitude);
            if (city) {
              setFormData(prev => ({
                ...prev,
                city
              }));
              setLocationStatus('detected');
            } else {
              setLocationStatus('detected'); // Still mark as detected even if city not found
            }
            
            // Store in localStorage for later use
            localStorage.setItem('userLatitude', latitude);
            localStorage.setItem('userLongitude', longitude);
          },
          (error) => {
            console.error('Location access denied or unavailable:', error);
            setLocationStatus('failed');
            // Try to use previously stored location
            const storedLat = localStorage.getItem('userLatitude');
            const storedLng = localStorage.getItem('userLongitude');
            if (storedLat && storedLng) {
              setFormData(prev => ({
                ...prev,
                latitude: parseFloat(storedLat),
                longitude: parseFloat(storedLng)
              }));
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setLocationStatus('failed');
        // Try to use previously stored location
        const storedLat = localStorage.getItem('userLatitude');
        const storedLng = localStorage.getItem('userLongitude');
        if (storedLat && storedLng) {
          setFormData(prev => ({
            ...prev,
            latitude: parseFloat(storedLat),
            longitude: parseFloat(storedLng)
          }));
        }
      }
    };

    detectLocation();
  }, []);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Validate city if location detection failed
    if (locationStatus === 'failed' && !formData.city) {
      setError('Please enter your city name');
      return;
    }

    setLoading(true);

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      city: formData.city || 'Unknown',
      latitude: formData.latitude,
      longitude: formData.longitude,
      userType: formData.userType,
      sellerType: formData.userType === 'seller' ? formData.sellerType : null,
      businessName: formData.userType === 'seller' && formData.sellerType === 'business' ? formData.businessName : null
    };

    const result = await register(registerData);
    
    if (result.success) {
      const eventData = {
        method: 'email',
        user_type: formData.userType,
        seller_type: formData.sellerType || null,
        success: true,
      };
      trackEvent('sign_up', eventData);
      
      // Track to marketing platforms
      trackGTMEvent('sign_up', eventData);
      trackFacebookEvent('CompleteRegistration', {
        content_name: 'User Registration',
        status: true,
      });
      trackLinkedInEvent('sign_up');
      
      // Track conversion if configured
      const conversionLabel = process.env.REACT_APP_GOOGLE_ADS_CONVERSION_LABEL;
      if (conversionLabel) {
        trackGoogleAdsConversion(conversionLabel);
      }
      
      navigate('/');
    } else {
      const eventData = { method: 'email', error: result.error };
      trackEvent('sign_up_failed', eventData);
      trackGTMEvent('sign_up_failed', eventData);
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Join Our Marketplace</h1>
          <p>Buy and sell phones from thousands of verified sellers across India. iPhones, Android phones, and more.</p>
          <ul className="register-benefits">
            <li>
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Access to millions of buyers.
            </li>
            <li>
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Fast and secure transactions.
            </li>
            <li>
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              24/7 customer support.
            </li>
            <li>
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free listing for new users
            </li>
          </ul>
        </div>

        <div className="register-form-section">
          <h2>Create Account</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              {locationStatus === 'detecting' && (
                <div className="location-detecting">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Detecting your location...</span>
                </div>
              )}
              {locationStatus === 'detected' && formData.city && (
                <div className="location-detected">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{formData.city}</span>
                  {formData.latitude && formData.longitude && (
                    <small>📍 {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</small>
                  )}
                </div>
              )}
              {locationStatus === 'failed' && (
                <>
                  <div className="location-failed">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Location not available. Please enter your city manually.</span>
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city name"
                    required
                    className="city-input-fallback"
                    style={{ marginTop: '0.75rem' }}
                  />
                </>
              )}
            </div>
            <div className="form-group">
              <label>Are you a</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="buyer"
                    checked={formData.userType === 'buyer'}
                    onChange={handleChange}
                  />
                  <span>Buyer</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="seller"
                    checked={formData.userType === 'seller'}
                    onChange={handleChange}
                  />
                  <span>Seller</span>
                </label>
              </div>
            </div>
            {formData.userType === 'seller' && (
              <>
                <div className="form-group">
                  <label>Seller Type</label>
                  <select
                    name="sellerType"
                    value={formData.sellerType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Seller Type</option>
                    <option value="individual">Individual Seller</option>
                    <option value="business">Business Seller</option>
                  </select>
                </div>
                {formData.sellerType === 'business' && (
                  <>
                    <div className="form-group">
                      <label>Business Name</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {/* Trade License field commented out as per client requirement */}
                    {/* <div className="form-group">
                      <label>Trade License</label>
                      <div className="file-upload">
                        <input
                          type="file"
                          name="tradeLicense"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleChange}
                          required
                          id="tradeLicense"
                        />
                        <label htmlFor="tradeLicense" className="file-upload-label">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Click to upload trade license (PDF, JPG, PNG)
                        </label>
                        {formData.tradeLicense && (
                          <span className="file-name">{formData.tradeLicense.name}</span>
                        )}
                      </div>
                    </div> */}
                  </>
                )}
              </>
            )}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

