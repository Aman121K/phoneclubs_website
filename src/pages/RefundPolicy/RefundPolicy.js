import React from 'react';
import './RefundPolicy.css';

const RefundPolicy = () => {
  return (
    <div className="policy-page">
      <div className="page-hero">
        <h1>Refund and Returns Policy</h1>
        <p>Understanding our refund and return procedures</p>
      </div>
      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>Overview</h2>
            <p>
              PhoneClubs is a marketplace platform that connects buyers and sellers. We facilitate 
              transactions but do not directly handle payments or product delivery. This policy 
              outlines the guidelines for refunds and returns on our platform.
            </p>
          </section>

          <section className="policy-section">
            <h2>Transaction Responsibility</h2>
            <p>
              All transactions on PhoneClubs are conducted directly between buyers and sellers. 
              PhoneClubs acts as a platform to facilitate connections but is not a party to the 
              transaction itself.
            </p>
          </section>

          <section className="policy-section">
            <h2>Refund Eligibility</h2>
            <div className="policy-item">
              <h3>Buyer Protection</h3>
              <p>
                Buyers may be eligible for a refund if:
              </p>
              <ul>
                <li>The item received does not match the listing description</li>
                <li>The item is significantly different from what was advertised</li>
                <li>The item is damaged or non-functional (unless stated in listing)</li>
                <li>The seller fails to deliver the item as agreed</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Refund Process</h3>
              <p>
                To request a refund:
              </p>
              <ol>
                <li>Contact the seller directly through our messaging system within 7 days of receiving the item</li>
                <li>Provide clear evidence (photos, videos) of the issue</li>
                <li>If the seller agrees, arrange for return and refund</li>
                <li>If the seller does not respond or refuses, contact our support team</li>
              </ol>
            </div>
          </section>

          <section className="policy-section">
            <h2>Return Conditions</h2>
            <div className="policy-item">
              <h3>Acceptable Return Reasons</h3>
              <ul>
                <li>Item not as described</li>
                <li>Item is damaged or defective</li>
                <li>Wrong item received</li>
                <li>Item missing parts or accessories mentioned in listing</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Return Timeframe</h3>
              <p>
                Returns must be requested within <strong>7 days</strong> of receiving the item. 
                The item must be returned in the same condition it was received, with all original 
                packaging and accessories.
              </p>
            </div>

            <div className="policy-item">
              <h3>Return Shipping</h3>
              <p>
                Return shipping costs are typically the responsibility of the buyer, unless the 
                return is due to seller error (wrong item, damaged item, etc.). This should be 
                discussed and agreed upon between buyer and seller.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>Non-Refundable Items</h2>
            <p>
              The following situations are generally not eligible for refunds:
            </p>
            <ul>
              <li>Buyer's remorse (changed mind)</li>
              <li>Item purchased at auction (unless misrepresented)</li>
              <li>Items damaged by buyer after receipt</li>
              <li>Items returned after 7 days</li>
              <li>Items without original packaging or accessories</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Dispute Resolution</h2>
            <p>
              If you cannot reach an agreement with the seller:
            </p>
            <ol>
              <li>Contact PhoneClubs support at phonesclubs@gmail.com</li>
              <li>Provide all relevant information including listing details, messages, photos, and transaction proof</li>
              <li>Our team will review the case and mediate between parties</li>
              <li>We reserve the right to suspend accounts that violate our policies</li>
            </ol>
          </section>

          <section className="policy-section">
            <h2>Seller Responsibilities</h2>
            <p>
              Sellers are responsible for:
            </p>
            <ul>
              <li>Accurately describing items in listings</li>
              <li>Providing clear, honest photos</li>
              <li>Disclosing any defects or issues</li>
              <li>Responding to buyer inquiries promptly</li>
              <li>Honoring agreed-upon transactions</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Contact Us</h2>
            <p>
              For questions about refunds or returns, please contact us:
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

export default RefundPolicy;

