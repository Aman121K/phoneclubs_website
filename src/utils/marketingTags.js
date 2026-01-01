/**
 * Marketing Tags Utility
 * 
 * Initialize all marketing and tracking tags
 * Make sure to add the corresponding IDs to your .env file
 */

// Initialize Google Tag Manager Data Layer
export const initializeGTM = () => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
};

// Track custom events for GTM
export const trackGTMEvent = (eventName, eventData = {}) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }
};

// Track page views for GTM
export const trackGTMPageView = (pagePath, pageTitle) => {
  trackGTMEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// Facebook Pixel Events
export const trackFacebookEvent = (eventName, parameters = {}) => {
  if (window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Google Ads Conversion Tracking
export const trackGoogleAdsConversion = (conversionLabel, value = null, currency = 'INR') => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': conversionLabel,
      'value': value,
      'currency': currency,
    });
  }
};

// LinkedIn Insight Tag
export const trackLinkedInEvent = (eventName, eventParams = {}) => {
  if (window.lintrk) {
    window.lintrk('track', { conversion_id: eventName });
  }
};

// Twitter Pixel
export const trackTwitterEvent = (eventName, parameters = {}) => {
  if (window.twq) {
    window.twq('event', eventName, parameters);
  }
};

// Microsoft Clarity
export const trackClarityEvent = (eventName, eventData = {}) => {
  if (window.clarity) {
    window.clarity('event', eventName);
  }
};

// TikTok Pixel
export const trackTikTokEvent = (eventName, parameters = {}) => {
  if (window.ttq) {
    window.ttq.track(eventName, parameters);
  }
};

