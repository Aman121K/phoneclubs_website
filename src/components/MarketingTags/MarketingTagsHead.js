import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * MarketingTagsHead Component
 * Injects all marketing and tracking tags into the HTML head
 */
const MarketingTagsHead = () => {
  const gtmId = process.env.REACT_APP_GTM_ID;
  const facebookPixelId = process.env.REACT_APP_FACEBOOK_PIXEL_ID;
  const googleAdsId = process.env.REACT_APP_GOOGLE_ADS_ID;
  const linkedInPartnerId = process.env.REACT_APP_LINKEDIN_PARTNER_ID;
  const twitterPixelId = process.env.REACT_APP_TWITTER_PIXEL_ID;
  const tiktokPixelId = process.env.REACT_APP_TIKTOK_PIXEL_ID;
  const clarityId = process.env.REACT_APP_MICROSOFT_CLARITY_ID;
  const pinterestTagId = process.env.REACT_APP_PINTEREST_TAG_ID;
  const googleSearchConsoleVerification = process.env.REACT_APP_GOOGLE_SEARCH_CONSOLE_VERIFICATION;

  // Initialize GTM Data Layer
  useEffect(() => {
    if (gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
    }
  }, [gtmId]);

  return (
    <Helmet>
      {/* Google Search Console Verification */}
      {googleSearchConsoleVerification && (
        <meta name="google-site-verification" content={googleSearchConsoleVerification} />
      )}

      {/* Google Tag Manager */}
      {gtmId && (
        <>
          <script>
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');`}
          </script>
        </>
      )}

      {/* Facebook Pixel */}
      {facebookPixelId && (
        <>
          <script>
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebookPixelId}');
            fbq('track', 'PageView');`}
          </script>
          <noscript>
            <img height="1" width="1" style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Google Ads Global Site Tag */}
      {googleAdsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}></script>
          <script>
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAdsId}');`}
          </script>
        </>
      )}

      {/* LinkedIn Insight Tag */}
      {linkedInPartnerId && (
        <>
          <script type="text/javascript">
            {`_linkedin_partner_id = "${linkedInPartnerId}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);`}
          </script>
          <script type="text/javascript">
            {`(function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);`}
          </script>
          <noscript>
            <img height="1" width="1" style={{ display: 'none' }} alt=""
              src={`https://px.ads.linkedin.com/collect/?pid=${linkedInPartnerId}&fmt=gif`}
            />
          </noscript>
        </>
      )}

      {/* Twitter Universal Website Tag */}
      {twitterPixelId && (
        <script>
          {`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','${twitterPixelId}');
          twq('event','tw-nvzbs-odzxi');`}
        </script>
      )}

      {/* TikTok Pixel */}
      {tiktokPixelId && (
        <script>
          {`!function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${tiktokPixelId}');
            ttq.page();
          }(window, document, 'ttq');`}
        </script>
      )}

      {/* Microsoft Clarity */}
      {clarityId && (
        <script type="text/javascript">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");`}
        </script>
      )}

      {/* Pinterest Tag */}
      {pinterestTagId && (
        <>
          <script>
            {`!function(e){if(!window.pintrk){window.pintrk = function () {
            window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
              n=window.pintrk;n.queue=[],n.version="3.0";var
              t=document.createElement("script");t.async=!0,t.src=e;var
              r=document.getElementsByTagName("script")[0];
              r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
            pintrk('load', '${pinterestTagId}', {em: ''});
            pintrk('page');`}
          </script>
          <noscript>
            <img height="1" width="1" style={{ display: 'none' }} alt=""
              src={`https://ct.pinterest.com/v3/?tid=${pinterestTagId}&noscript=1`}
            />
          </noscript>
        </>
      )}
    </Helmet>
  );
};

export default MarketingTagsHead;

