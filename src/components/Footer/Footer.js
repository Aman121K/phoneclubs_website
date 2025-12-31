import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null); // 'success', 'error', 'loading'
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscribeStatus('error');
      setSubscribeMessage('Please enter your email address');
      return;
    }

    setSubscribeStatus('loading');
    setSubscribeMessage('Subscribing...');

    try {
      const response = await axios.post('/api/subscriptions/subscribe', { email });
      setSubscribeStatus('success');
      setSubscribeMessage(response.data.message || 'Successfully subscribed!');
      setEmail('');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubscribeStatus(null);
        setSubscribeMessage('');
      }, 5000);
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage(
        error.response?.data?.error || 
        error.response?.data?.errors?.[0]?.msg || 
        'Failed to subscribe. Please try again.'
      );
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-section">
            <h3 className="footer-title">PhoneClubs</h3>
            <p className="footer-description">
              Welcome to PhoneClubs - India's trusted marketplace for buying and selling phones. 
              Connect with verified sellers in your area for iPhones, Android phones, and more. 
              Safe, simple, and direct transactions.
            </p>
            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="subscribe-input"
                required
                disabled={subscribeStatus === 'loading'}
              />
              <button 
                type="submit" 
                className="subscribe-btn"
                disabled={subscribeStatus === 'loading'}
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribeStatus && (
              <div className={`subscribe-message ${subscribeStatus}`}>
                {subscribeMessage}
              </div>
            )}
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Get Our App</h3>
            <p className="coming-soon">Coming Soon!</p>
            <div className="app-buttons">
              <a 
                href="https://www.apple.com/app-store/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="app-btn app-store-btn"
                title="Download on the App Store"
              >
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="app-badge-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://linkmaker.itunes.apple.com/en-us/badge-lrg.svg?releaseDate=2011-09-21&kind=iossoftware&bubble=ios_apps';
                  }}
                />
              </a>
              <a 
                href="https://play.google.com/store/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="app-btn play-store-btn"
                title="Get it on Google Play"
              >
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="app-badge-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg';
                  }}
                />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Explore</h3>
            <ul className="footer-links">
              <li><Link to="/profile">My Dashboard</Link></li>
              <li><Link to="/post-ad">Submit Listing</Link></li>
              <li><Link to="/login">Sign in</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/blog">Our News</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Top Series</h3>
            <ul className="footer-links">
              <li><Link to="/category/iphone-16-pro-max">16 Series</Link></li>
              <li><Link to="/category/iphone-15-pro-max">15 Series</Link></li>
              <li><Link to="/category/iphone-14-pro-max">14 Series</Link></li>
              <li><Link to="/category/iphone-13-pro-max">13 Series</Link></li>
              <li><Link to="/category/iphone-12-pro-max">12 Series</Link></li>
              <li><Link to="/category/iphone-11-pro-max">11 Series</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-section">
            <h3 className="footer-title">Top Locations</h3>
            <ul className="footer-links">
              <li><Link to="/?city=Mumbai">Mumbai</Link></li>
              <li><Link to="/?city=Delhi">Delhi</Link></li>
              <li><Link to="/?city=Bangalore">Bangalore</Link></li>
              <li><Link to="/?city=Hyderabad">Hyderabad</Link></li>
              <li><Link to="/?city=Chennai">Chennai</Link></li>
              <li><Link to="/?city=Kolkata">Kolkata</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Important Links</h3>
            <ul className="footer-links">
              <li><Link to="/help">Help Desk</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/refund-policy">Refund and Returns Policy</Link></li>
              <li><Link to="/terms">Terms of Services</Link></li>
              <li><Link to="/posting-policy">Posting Policy</Link></li>
              <li><Link to="/auction-policy">Auction Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Social Links</h3>
            <ul className="footer-links">
              <li>
                <a href="https://www.facebook.com/phoneclubs.ae" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/phoneclubs.ae" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com/phoneclubs_ae" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@phoneclubs.ae" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-tiktok"></i> Tik Tok
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@phoneclubs.ae" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© 2025 - PhoneClubs All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

