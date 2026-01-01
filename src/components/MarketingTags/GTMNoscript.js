import { useEffect } from 'react';

/**
 * GTM Noscript Component
 * Renders Google Tag Manager noscript iframe in the body
 */
const GTMNoscript = () => {
  const gtmId = process.env.REACT_APP_GTM_ID;

  useEffect(() => {
    // Add GTM noscript iframe to body if not already present
    if (gtmId && !document.getElementById('gtm-noscript')) {
      const noscript = document.createElement('noscript');
      noscript.id = 'gtm-noscript';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.insertBefore(noscript, document.body.firstChild);
    }
  }, [gtmId]);

  return null;
};

export default GTMNoscript;

