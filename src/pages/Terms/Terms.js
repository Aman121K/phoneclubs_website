import React from 'react';
import './Terms.css';

const Terms = () => {
  return (
    <div className="policy-page">
      <div className="page-hero">
        <h1>Terms of Services</h1>
        <p>Please read our terms and conditions carefully</p>
      </div>
      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using PhoneClubs, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to these Terms of Service, please 
              do not use our platform.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Description of Service</h2>
            <p>
              PhoneClubs is an online marketplace platform that connects buyers and sellers of phones. 
              We provide a platform for users to list, browse, and transact phone devices including iPhones, 
              Android phones, and other brands. PhoneClubs 
              does not own, sell, or guarantee any items listed on the platform.
            </p>
          </section>

          <section className="policy-section">
            <h2>3. User Accounts</h2>
            <div className="policy-item">
              <h3>Account Creation</h3>
              <p>
                To use certain features of PhoneClubs, you must create an account. You agree to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Account Restrictions</h3>
              <p>You may not:</p>
              <ul>
                <li>Create multiple accounts to circumvent platform restrictions</li>
                <li>Share your account credentials with others</li>
                <li>Use another user's account without permission</li>
                <li>Create accounts for fraudulent purposes</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Listing and Selling</h2>
            <div className="policy-item">
              <h3>Listing Requirements</h3>
              <p>When creating a listing, you agree to:</p>
              <ul>
                <li>Provide accurate and complete information about the item</li>
                <li>Upload clear, accurate photos of the actual item</li>
                <li>Set a fair and reasonable price</li>
                <li>Respond promptly to buyer inquiries</li>
                <li>Honor the terms of your listing</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Prohibited Items</h3>
              <p>You may not list:</p>
              <ul>
                <li>Stolen or illegally obtained items</li>
                <li>Counterfeit or replica phones</li>
                <li>Items that violate any laws or regulations</li>
                <li>Items with misleading or false descriptions</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Buying and Transactions</h2>
            <p>
              When purchasing items on PhoneClubs:
            </p>
            <ul>
              <li>You are entering into a contract directly with the seller</li>
              <li>PhoneClubs is not a party to the transaction</li>
              <li>You are responsible for verifying the item before purchase</li>
              <li>Payment terms are agreed upon between buyer and seller</li>
              <li>PhoneClubs does not process payments or handle disputes directly</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Auctions</h2>
            <div className="policy-item">
              <h3>Bidding Rules</h3>
              <ul>
                <li>Bids are binding and cannot be retracted</li>
                <li>You must bid higher than the current highest bid</li>
                <li>Winning bidders are obligated to complete the purchase</li>
                <li>Sellers must honor the auction results</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Auction Completion</h3>
              <p>
                When an auction ends, the highest bidder and seller are responsible for completing 
                the transaction. Failure to complete may result in account suspension.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the platform for any illegal purpose</li>
              <li>Post false, misleading, or fraudulent information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Interfere with the platform's operation</li>
              <li>Use automated systems to access the platform</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>8. Intellectual Property</h2>
            <p>
              All content on PhoneClubs, including text, graphics, logos, and software, is the property 
              of PhoneClubs or its content suppliers. You may not reproduce, distribute, or create 
              derivative works without permission.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. Limitation of Liability</h2>
            <p>
              PhoneClubs provides the platform "as is" without warranties. We are not responsible for:
            </p>
            <ul>
              <li>The quality, safety, or legality of items listed</li>
              <li>The accuracy of listings or user information</li>
              <li>The ability of users to complete transactions</li>
              <li>Any damages resulting from use of the platform</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>10. Account Termination</h2>
            <p>
              PhoneClubs reserves the right to suspend or terminate accounts that violate these terms, 
              engage in fraudulent activity, or harm the platform or its users. We may remove listings 
              or content that violates our policies.
            </p>
          </section>

          <section className="policy-section">
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the platform 
              after changes constitutes acceptance of the new terms. We will notify users of significant 
              changes.
            </p>
          </section>

          <section className="policy-section">
            <h2>12. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us:
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

export default Terms;

