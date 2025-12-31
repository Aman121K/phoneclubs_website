import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMessages();
  }, [user, navigate]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/users/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <h1>Messages</h1>
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id || message._id}
                className={`message-item ${(message.receiver_id || message.receiver?._id) === (user.id || user._id) ? 'received' : 'sent'}`}
              >
                <div className="message-header">
                  <strong>
                    {(message.receiver_id || message.receiver?._id) === (user.id || user._id)
                      ? message.sender_name || message.sender?.name
                      : message.receiver_name || message.receiver?.name}
                  </strong>
                  {message.listing_title && (
                    <span className="listing-link">Re: {message.listing_title}</span>
                  )}
                </div>
                <div className="message-content">{message.message}</div>
                <div className="message-time">
                  {new Date(message.created_at || message.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

