import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'An error occurred. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="login-left">
          <h1>Reset Your Password</h1>
          <p className="login-intro">
            Enter your email address and we'll send you a link to reset your password. 
            The link will expire in 15 minutes for security purposes.
          </p>
          <ul className="login-benefits">
            <li>
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Secure password reset process
            </li>
            <li>
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Link expires in 15 minutes
            </li>
            <li>
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Check your email inbox
            </li>
            <li>
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Follow the link to reset
            </li>
          </ul>
        </div>
        <div className="login-right">
          <h2>Forgot Password</h2>
          
          {success ? (
            <div className="success-message">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', marginBottom: '0.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={{ margin: 0, fontWeight: 600 }}>Reset Link Sent!</p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', opacity: 0.9 }}>
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your email and click the link to reset your password.
              </p>
              <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                <strong>Note:</strong> The link will expire in 15 minutes.
              </p>
            </div>
          ) : (
            <>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="info-box">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>We'll send you a secure link to reset your password. The link expires in 15 minutes.</p>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
          
          <p className="auth-link">
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
          <p className="auth-link" style={{ marginTop: '0.5rem' }}>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

