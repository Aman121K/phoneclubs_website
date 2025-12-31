import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-page">
      <div className="page-hero">
        <h1>Help Desk</h1>
        <p>Get assistance with your questions</p>
      </div>
      <div className="help-container">
        <div className="help-content">
          <section className="help-section">
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-item">
              <h3>How do I create an account?</h3>
              <p>
                Click on "Sign Up" in the header, fill in your details including name, email, password, 
                phone number, and city. Once registered, you can start browsing and posting listings.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I post a listing?</h3>
              <p>
                After logging in, click on "Sell iPhone" or "Post Ad" button. Fill in all the required 
                information including iPhone model, condition, storage, price, and upload images. 
                Choose between fixed price or auction listing.
              </p>
            </div>

            <div className="faq-item">
              <h3>What is the difference between Fixed Price and Auction?</h3>
              <p>
                <strong>Fixed Price:</strong> You set a specific price for your iPhone. Buyers can contact 
                you directly to purchase at that price.<br/>
                <strong>Auction:</strong> You set a starting price and end date. Buyers place bids, and 
                the highest bidder wins when the auction ends.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I contact a seller?</h3>
              <p>
                Click on "View Details" on any listing, then use the "Contact Seller" button to send a 
                message. You can also access all your messages from the "Messages" section in your profile.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I place a bid on an auction?</h3>
              <p>
                Navigate to the auction listing, enter your bid amount (must be higher than the current bid), 
                and click "Place Bid". You'll be notified if someone outbids you.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I edit or delete my listing?</h3>
              <p>
                Yes, you can manage your listings from your profile page. Go to "My Listings" section 
                where you can view, edit, or delete your posted listings.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I search for specific iPhone models?</h3>
              <p>
                Use the search bar on the homepage, or browse by categories. You can filter by model, 
                storage capacity, city, and price range to find exactly what you're looking for.
              </p>
            </div>

            <div className="faq-item">
              <h3>What payment methods are accepted?</h3>
              <p>
                PhoneClubs facilitates connections between buyers and sellers. Payment methods are agreed 
                upon directly between the parties. We recommend using secure payment methods and meeting 
                in safe, public locations for transactions.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I report a problem or suspicious listing?</h3>
              <p>
                If you encounter any issues or suspicious activity, please contact us immediately through 
                our <a href="/contact">Contact page</a> or email phonesclubs@gmail.com. We take all reports 
                seriously and will investigate promptly.
              </p>
            </div>
          </section>

          <section className="help-section">
            <h2>Contact Support</h2>
            <p>
              Still need help? Our support team is here to assist you. Reach out to us through:
            </p>
            <ul className="contact-methods">
              <li><strong>Email:</strong> phonesclubs@gmail.com</li>
              <li><strong>Contact Form:</strong> <a href="/contact">Visit Contact Page</a></li>
              <li><strong>Response Time:</strong> We typically respond within 24-48 hours</li>
            </ul>
          </section>

          <section className="help-section">
            <h2>Quick Links</h2>
            <div className="quick-links">
              <a href="/about">About PhoneClubs</a>
              <a href="/terms">Terms of Services</a>
              <a href="/refund-policy">Refund Policy</a>
              <a href="/posting-policy">Posting Policy</a>
              <a href="/auction-policy">Auction Policy</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;

