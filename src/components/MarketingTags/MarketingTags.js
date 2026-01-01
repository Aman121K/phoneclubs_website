import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackGTMPageView, trackFacebookEvent } from '../../utils/marketingTags';

/**
 * MarketingTags Component
 * 
 * This component handles page view tracking for all marketing tags
 */

const MarketingTags = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view in all marketing platforms
    const pageTitle = document.title || location.pathname;
    
    // Google Tag Manager
    trackGTMPageView(location.pathname, pageTitle);
    
    // Facebook Pixel
    trackFacebookEvent('PageView');
    
    // TikTok (if available)
    if (window.ttq) {
      window.ttq.page();
    }
    
    // Pinterest (if available)
    if (window.pintrk) {
      window.pintrk('page');
    }
  }, [location]);

  return null;
};

export default MarketingTags;

