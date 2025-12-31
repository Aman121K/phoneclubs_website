import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Unsubscribe.css';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      handleUnsubscribe(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (emailToUnsubscribe) => {
    try {
      const response = await axios.post('/api/subscriptions/unsubscribe', {
        email: emailToUnsubscribe
      });
      setStatus('success');
      setMessage(response.data.message || 'Successfully unsubscribed from notifications');
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.error || 
        'Failed to unsubscribe. Please try again or contact support.'
      );
    }
  };

  const handleManualUnsubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    await handleUnsubscribe(email);
  };

  return (
    <div className="unsubscribe-page">
      <div className="unsubscribe-container">
        <div className="unsubscribe-card">
          <div className="unsubscribe-icon">
            {status === 'success' ? (
              <i className="fas fa-check-circle"></i>
            ) : status === 'error' ? (
              <i className="fas fa-exclamation-circle"></i>
            ) : (
              <i className="fas fa-spinner fa-spin"></i>
            )}
          </div>
          
          {status === 'loading' && (
            <>
              <h1>Unsubscribing...</h1>
              <p>Please wait while we process your request.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <h1>Successfully Unsubscribed</h1>
              <p className="success-message">{message}</p>
              <p className="info-text">
                You will no longer receive email notifications about new listings on PhoneClubs.
                You can resubscribe anytime from our website.
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="home-btn"
              >
                Go to Homepage
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <h1>Unsubscribe</h1>
              <p className="error-message">{message}</p>
              <form onSubmit={handleManualUnsubscribe} className="unsubscribe-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  required
                />
                <button type="submit" className="unsubscribe-btn">
                  Unsubscribe
                </button>
              </form>
              <button 
                onClick={() => navigate('/')} 
                className="home-btn secondary"
              >
                Go to Homepage
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;

