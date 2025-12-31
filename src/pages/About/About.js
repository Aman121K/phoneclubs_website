import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-hero">
        <h1>About PhoneClubs</h1>
        <p>Learn more about our platform</p>
      </div>
      <div className="about-container">
        <div className="about-content">
          <h2>Welcome to PhoneClubs</h2>
          <p>
            PhoneClubs is India's premier marketplace for buying and selling phones. Whether you're looking 
            for the latest iPhone, a premium Android device, or want to sell your current phone, we provide 
            a safe, simple, and efficient platform that connects buyers and sellers directly.
          </p>
          
          <h3>Our Mission</h3>
          <p>
            Our mission is to provide a trusted, user-friendly platform where phone enthusiasts can easily 
            buy and sell their devices. We focus on creating the best experience for our community by 
            supporting all major phone brands including iPhone, Samsung, OnePlus, Xiaomi, and more.
          </p>

          <h3>Why Choose PhoneClubs?</h3>
          <ul>
            <li><strong>All Phone Brands:</strong> Browse and sell iPhones, Android phones, and all major brands</li>
            <li><strong>Safe Transactions:</strong> Secure platform with verified sellers and phone verification</li>
            <li><strong>Easy to Use:</strong> Simple interface for posting and browsing listings</li>
            <li><strong>Multiple Options:</strong> Choose between fixed price listings or auctions</li>
            <li><strong>Wide Selection:</strong> Browse thousands of phones from budget to premium models</li>
            <li><strong>Location-Based:</strong> Find phones near you, meet in person for safe transactions</li>
          </ul>

          <h3>How It Works</h3>
          <div className="how-it-works">
            <div className="step">
              <h4>1. Create an Account</h4>
              <p>Sign up for free and create your profile</p>
            </div>
            <div className="step">
              <h4>2. Browse or List</h4>
              <p>Browse available phones or post your own listing</p>
            </div>
            <div className="step">
              <h4>3. Connect</h4>
              <p>Contact sellers directly through our messaging system</p>
            </div>
            <div className="step">
              <h4>4. Complete Transaction</h4>
              <p>Meet and complete your phone transaction safely</p>
            </div>
          </div>

          <h3>Contact Us</h3>
          <p>
            Have questions? Feel free to reach out to us through our <a href="/contact">Contact page</a> 
            or email us at phonesclubs@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

