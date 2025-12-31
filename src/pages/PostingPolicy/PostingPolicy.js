import React from 'react';
import './PostingPolicy.css';

const PostingPolicy = () => {
  return (
    <div className="policy-page">
      <div className="page-hero">
        <h1>Posting Policy</h1>
        <p>Guidelines for creating and managing listings</p>
      </div>
      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>Overview</h2>
            <p>
              This policy outlines the rules and guidelines for posting listings on PhoneClubs. 
              All users must comply with these policies to maintain a safe and trustworthy 
              marketplace environment.
            </p>
          </section>

          <section className="policy-section">
            <h2>Listing Requirements</h2>
            <div className="policy-item">
              <h3>Required Information</h3>
              <p>All listings must include:</p>
              <ul>
                <li><strong>Accurate Title:</strong> Clear description of the phone model and key features</li>
                <li><strong>Detailed Description:</strong> Honest description of condition, features, and any defects</li>
                <li><strong>High-Quality Photos:</strong> Clear images showing the actual item from multiple angles</li>
                <li><strong>Accurate Pricing:</strong> Fair and reasonable price that reflects the item's condition</li>
                <li><strong>Correct Specifications:</strong> Accurate storage, model, year, and condition information</li>
                <li><strong>Location:</strong> Valid city/location where the item is available</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Photo Requirements</h3>
              <ul>
                <li>Minimum 3 photos per listing</li>
                <li>Photos must show the actual item being sold</li>
                <li>Include front, back, and sides of the phone</li>
                <li>Show any damage, scratches, or defects clearly</li>
                <li>No stock photos or images from other sources</li>
                <li>Photos must be clear and in focus</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>Prohibited Content</h2>
            <p>You may NOT post listings that contain:</p>
            <ul>
              <li><strong>Stolen Items:</strong> Any phone that has been stolen or obtained illegally</li>
              <li><strong>Counterfeit Products:</strong> Fake, replica, or counterfeit phones</li>
              <li><strong>Misleading Information:</strong> False descriptions, fake photos, or incorrect specifications</li>
              <li><strong>Prohibited Items:</strong> Items that violate local laws or regulations</li>
              <li><strong>Spam or Duplicate Listings:</strong> Multiple identical listings or spam content</li>
              <li><strong>Inappropriate Content:</strong> Offensive, discriminatory, or inappropriate language or images</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Listing Categories</h2>
            <div className="policy-item">
              <h3>Fixed Price Listings</h3>
              <ul>
                <li>Set a clear, fixed price for your phone</li>
                <li>Price must be in INR (Indian Rupees)</li>
                <li>Be open to reasonable negotiations through messaging</li>
                <li>Update listing if item is sold or no longer available</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Auction Listings</h3>
              <ul>
                <li>Set a starting price (minimum bid amount)</li>
                <li>Set a clear end date and time for the auction</li>
                <li>All bids are binding - buyers cannot retract bids</li>
                <li>You must honor the auction result and sell to the highest bidder</li>
                <li>Cannot cancel auction after bids have been placed</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>Condition Guidelines</h2>
            <p>When describing condition, use these guidelines:</p>
            <ul>
              <li><strong>Brand New:</strong> Unopened, in original packaging with all accessories</li>
              <li><strong>Excellent:</strong> Like new, minimal wear, fully functional</li>
              <li><strong>Very Good:</strong> Minor wear, fully functional, well-maintained</li>
              <li><strong>Good:</strong> Some wear and scratches, fully functional</li>
              <li><strong>Fair:</strong> Visible wear, scratches, or minor issues, still functional</li>
            </ul>
            <p>
              Always disclose any defects, damage, or issues honestly. Buyers appreciate transparency, 
              and it helps avoid disputes.
            </p>
          </section>

          <section className="policy-section">
            <h2>Listing Management</h2>
            <div className="policy-item">
              <h3>Updating Listings</h3>
              <ul>
                <li>Update listing status if item is sold</li>
                <li>Mark listing as "Sold" when transaction is complete</li>
                <li>Update price if you change your asking price</li>
                <li>Respond to inquiries within 24-48 hours</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Removing Listings</h3>
              <ul>
                <li>You can delete your own listings at any time</li>
                <li>Listings with active bids cannot be deleted</li>
                <li>PhoneClubs may remove listings that violate policies</li>
                <li>Repeated violations may result in account suspension</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>Best Practices</h2>
            <ul>
              <li>Take photos in good lighting</li>
              <li>Write detailed, honest descriptions</li>
              <li>Respond to messages promptly</li>
              <li>Be transparent about item condition</li>
              <li>Set reasonable prices based on market value</li>
              <li>Include all relevant information (storage, color, accessories, etc.)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Violations and Consequences</h2>
            <p>
              Violations of this posting policy may result in:
            </p>
            <ul>
              <li>Removal of the violating listing</li>
              <li>Warning notification</li>
              <li>Temporary account suspension</li>
              <li>Permanent account ban for repeated violations</li>
            </ul>
            <p>
              PhoneClubs reserves the right to remove any listing that violates our policies or 
              harms the marketplace community.
            </p>
          </section>

          <section className="policy-section">
            <h2>Contact Us</h2>
            <p>
              If you have questions about posting policies or need assistance, contact us:
            </p>
            <ul className="contact-info">
              <li><strong>Email:</strong> phonesclubs@gmail.com</li>
              <li><strong>Contact Form:</strong> <a href="/contact">Visit Contact Page</a></li>
            </ul>
          </section>

          <section className="policy-section">
            <p className="last-updated">
              <strong>Last Updated:</strong> January 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PostingPolicy;

