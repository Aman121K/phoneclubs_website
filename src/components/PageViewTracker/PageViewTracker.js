import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFirebase } from '../../context/FirebaseContext';

const PageViewTracker = () => {
  const location = useLocation();
  const { trackPageView } = useFirebase();

  useEffect(() => {
    // Track page view on route change
    const pageName = document.title || location.pathname;
    trackPageView(pageName, location.pathname);
  }, [location, trackPageView]);

  return null;
};

export default PageViewTracker;

