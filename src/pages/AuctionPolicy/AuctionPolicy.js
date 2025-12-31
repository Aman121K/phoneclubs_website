import React from 'react';
import './AuctionPolicy.css';

const AuctionPolicy = () => {
  return (
    <div className="policy-page">
      <div className="page-hero">
        <h1>Auction Policy</h1>
        <p>Rules and guidelines for auction listings</p>
      </div>
      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>Overview</h2>
            <p>
              This policy governs all auction listings on PhoneClubs. Auctions provide an exciting 
              way to buy and sell phones through competitive bidding. All participants must 
              understand and comply with these rules.
            </p>
          </section>

          <section className="policy-section">
            <h2>Creating an Auction</h2>
            <div className="policy-item">
              <h3>Seller Requirements</h3>
              <p>When creating an auction listing, sellers must:</p>
              <ul>
                <li>Set a clear starting price (minimum bid)</li>
                <li>Set a specific end date and time for the auction</li>
                <li>Provide accurate item description and photos</li>
                <li>Specify all terms and conditions clearly</li>
                <li>Be available to complete the transaction if the auction is successful</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Auction Duration</h3>
              <ul>
                <li>Minimum auction duration: 24 hours</li>
                <li>Maximum auction duration: 30 days</li>
                <li>End time is displayed in local time</li>
                <li>Auctions automatically close at the specified end time</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>Bidding Rules</h2>
            <div className="policy-item">
              <h3>For Bidders</h3>
              <ul>
                <li><strong>Binding Bids:</strong> All bids are final and cannot be retracted</li>
                <li><strong>Minimum Increment:</strong> Each bid must be higher than the current highest bid</li>
                <li><strong>Auto-Bidding:</strong> System automatically increases your bid if outbid (up to your maximum)</li>
                <li><strong>Winning Obligation:</strong> Winning bidders must complete the purchase</li>
                <li><strong>Payment:</strong> Payment terms are agreed upon with the seller</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Bid Increments</h3>
              <p>Minimum bid increments are based on current price:</p>
              <ul>
                <li>Under AED 1,000: Minimum AED 50 increment</li>
                <li>AED 1,000 - AED 5,000: Minimum AED 100 increment</li>
                <li>Above AED 5,000: Minimum AED 200 increment</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>Auction Completion</h2>
            <div className="policy-item">
              <h3>When Auction Ends</h3>
              <ul>
                <li>The highest bidder at the end time wins the auction</li>
                <li>Both buyer and seller receive notification</li>
                <li>Seller must contact the winning bidder within 24 hours</li>
                <li>Transaction must be completed within 7 days of auction end</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Seller Responsibilities</h3>
              <ul>
                <li>Honor the auction result and sell to the highest bidder</li>
                <li>Cannot cancel auction after bids have been placed</li>
                <li>Must deliver item as described in the listing</li>
                <li>Respond promptly to winning bidder's contact</li>
                <li>Complete transaction in good faith</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Buyer Responsibilities</h3>
              <ul>
                <li>Complete the purchase if you win the auction</li>
                <li>Contact seller within 24 hours of winning</li>
                <li>Make payment as agreed with seller</li>
                <li>Complete transaction within 7 days</li>
                <li>Cannot retract winning bid</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>Reserve Prices</h2>
            <p>
              Sellers may set a reserve price (minimum acceptable price). If the reserve price is 
              not met by the end of the auction, the seller is not obligated to sell. Reserve 
              prices are not visible to bidders but are indicated if not met.
            </p>
          </section>

          <section className="policy-section">
            <h2>Auction Cancellation</h2>
            <div className="policy-item">
              <h3>Seller Cancellation</h3>
              <ul>
                <li>Sellers can cancel auctions only if no bids have been placed</li>
                <li>Once bids are placed, cancellation is not allowed</li>
                <li>Repeated cancellations may result in account restrictions</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Platform Cancellation</h3>
              <p>
                PhoneClubs may cancel auctions that violate our policies, contain fraudulent 
                information, or harm the marketplace. Affected users will be notified.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>Disputes and Issues</h2>
            <div className="policy-item">
              <h3>Non-Payment</h3>
              <p>
                If a winning bidder fails to complete payment:
              </p>
              <ul>
                <li>Seller may report the issue to PhoneClubs</li>
                <li>Buyer account may be suspended</li>
                <li>Seller may relist the item</li>
                <li>Repeated non-payment results in permanent ban</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>Item Not as Described</h3>
              <p>
                If the item received doesn't match the listing:
              </p>
              <ul>
                <li>Buyer should contact seller immediately</li>
                <li>Provide evidence (photos, videos) of discrepancies</li>
                <li>If unresolved, contact PhoneClubs support</li>
                <li>We will mediate and may require refund or return</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>Prohibited Practices</h2>
            <p>The following practices are strictly prohibited:</p>
            <ul>
              <li><strong>Shill Bidding:</strong> Sellers bidding on their own auctions</li>
              <li><strong>Bid Manipulation:</strong> Coordinating with others to manipulate prices</li>
              <li><strong>False Bidding:</strong> Placing bids with no intention to purchase</li>
              <li><strong>Retracting Bids:</strong> Attempting to cancel or retract placed bids</li>
              <li><strong>Circumventing Fees:</strong> Arranging transactions outside the platform to avoid fees</li>
            </ul>
            <p>
              Violations may result in immediate account suspension or permanent ban.
            </p>
          </section>

          <section className="policy-section">
            <h2>Tips for Successful Auctions</h2>
            <div className="policy-item">
              <h3>For Sellers</h3>
              <ul>
                <li>Set a competitive starting price to attract bidders</li>
                <li>Use high-quality photos and detailed descriptions</li>
                <li>Set reasonable end times (evenings and weekends often get more activity)</li>
                <li>Respond quickly to bidder questions</li>
                <li>Be prepared to complete the transaction promptly</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>For Bidders</h3>
              <ul>
                <li>Read the listing carefully before bidding</li>
                <li>Check seller's history and ratings if available</li>
                <li>Set a maximum bid you're comfortable with</li>
                <li>Monitor the auction as it nears the end</li>
                <li>Be ready to complete payment if you win</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>Contact Us</h2>
            <p>
              For questions about auction policies or to report issues, contact us:
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

export default AuctionPolicy;

