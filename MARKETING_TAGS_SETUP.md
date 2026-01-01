# Marketing Tags Setup Guide

This guide will help you configure all marketing and tracking tags for your PhoneClubs website.

## Overview

The following marketing tools are integrated:
- ✅ Google Tag Manager (GTM) - Centralized tag management
- ✅ Google Analytics 4 (via GTM)
- ✅ Google Search Console - Verification meta tag
- ✅ Facebook Pixel (Meta Pixel)
- ✅ Google Ads Conversion Tracking
- ✅ LinkedIn Insight Tag
- ✅ Twitter Pixel
- ✅ TikTok Pixel
- ✅ Microsoft Clarity
- ✅ Pinterest Tag

## Environment Variables Setup

Create or update your `.env` file in the `frontend` directory with the following variables:

```env
# Google Tag Manager
REACT_APP_GTM_ID=GTM-XXXXXXX

# Google Search Console Verification
REACT_APP_GOOGLE_SEARCH_CONSOLE_VERIFICATION=your_verification_code_here

# Facebook Pixel (Meta Pixel)
REACT_APP_FACEBOOK_PIXEL_ID=your_facebook_pixel_id

# Google Ads Conversion IDs
REACT_APP_GOOGLE_ADS_ID=AW-XXXXXXXXX
REACT_APP_GOOGLE_ADS_CONVERSION_LABEL=your_conversion_label

# LinkedIn Insight Tag
REACT_APP_LINKEDIN_PARTNER_ID=your_linkedin_partner_id

# Twitter Pixel (Twitter Ads)
REACT_APP_TWITTER_PIXEL_ID=your_twitter_pixel_id

# TikTok Pixel
REACT_APP_TIKTOK_PIXEL_ID=your_tiktok_pixel_id

# Microsoft Clarity
REACT_APP_MICROSOFT_CLARITY_ID=your_clarity_project_id

# Pinterest Tag
REACT_APP_PINTEREST_TAG_ID=your_pinterest_tag_id
```

## Step-by-Step Setup

### 1. Google Tag Manager

**Why:** Centralized tag management - manage all other tags from one place

**Setup Steps:**
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account or select existing
3. Create a container for your website
4. Copy the Container ID (format: GTM-XXXXXXX)
5. Add to `.env`: `REACT_APP_GTM_ID=GTM-XXXXXXX`

**What's Already Done:**
- GTM script added to `index.html`
- Data Layer initialized
- Page view tracking configured
- Custom event tracking utility functions created

### 2. Google Analytics 4 (GA4)

**Why:** Track website traffic, user behavior, conversions

**Setup Steps:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property if you don't have one
3. In GTM, create a new tag:
   - Tag Type: Google Analytics: GA4 Configuration
   - Measurement ID: G-XXXXXXXXXX
   - Trigger: All Pages
4. Or add directly to GTM container via GA4 Configuration Tag

**Note:** We're already using Firebase Analytics which is similar, but GA4 via GTM gives more flexibility.

### 3. Google Search Console

**Why:** Monitor search performance, indexing status, search analytics

**Setup Steps:**
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Add your property (website URL)
3. Choose "HTML tag" verification method
4. Copy the `content` value from the meta tag
5. Add to `.env`: `REACT_APP_GOOGLE_SEARCH_CONSOLE_VERIFICATION=your_code`
6. The meta tag will be automatically added to your site

**Alternative:** You can also verify via DNS or file upload.

### 4. Facebook Pixel (Meta Pixel)

**Why:** Track conversions, optimize ads, create custom audiences

**Setup Steps:**
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Create a new Pixel or use existing
3. Copy your Pixel ID (format: numbers like 123456789012345)
4. Add to `.env`: `REACT_APP_FACEBOOK_PIXEL_ID=your_pixel_id`

**Tracked Events:**
- PageView (automatic)
- ViewContent (listing views)
- Search (searches)
- AddToCart (adding to favorites)
- InitiateCheckout (starting purchase process)
- Purchase (completed purchases)
- Lead (form submissions)

### 5. Google Ads Conversion Tracking

**Why:** Track ad conversions, optimize campaigns

**Setup Steps:**
1. Go to [Google Ads](https://ads.google.com/)
2. Tools & Settings → Conversions
3. Create a new conversion action
4. Copy your Conversion ID (format: AW-XXXXXXXXX) and Conversion Label
5. Add to `.env`:
   - `REACT_APP_GOOGLE_ADS_ID=AW-XXXXXXXXX`
   - `REACT_APP_GOOGLE_ADS_CONVERSION_LABEL=your_label`

### 6. LinkedIn Insight Tag

**Why:** Track conversions from LinkedIn ads, retargeting

**Setup Steps:**
1. Go to [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager/)
2. Account Assets → Insight Tag
3. Copy the Partner ID (format: numbers)
4. Add to `.env`: `REACT_APP_LINKEDIN_PARTNER_ID=your_partner_id`

### 7. Twitter Pixel (Twitter Ads)

**Why:** Track conversions, optimize Twitter ad campaigns

**Setup Steps:**
1. Go to [Twitter Ads Manager](https://ads.twitter.com/)
2. Tools → Website tag
3. Create a new website tag
4. Copy the Pixel ID
5. Add to `.env`: `REACT_APP_TWITTER_PIXEL_ID=your_pixel_id`

### 8. TikTok Pixel

**Why:** Track TikTok ad performance and conversions

**Setup Steps:**
1. Go to [TikTok Ads Manager](https://ads.tiktok.com/)
2. Assets → Events → Web Events
3. Create a new pixel
4. Copy the Pixel ID
5. Add to `.env`: `REACT_APP_TIKTOK_PIXEL_ID=your_pixel_id`

### 9. Microsoft Clarity

**Why:** Free heatmaps, session recordings, user behavior analytics

**Setup Steps:**
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Create a new project
3. Copy the Project ID
4. Add to `.env`: `REACT_APP_MICROSOFT_CLARITY_ID=your_project_id`

### 10. Pinterest Tag

**Why:** Track Pinterest ad conversions and create audiences

**Setup Steps:**
1. Go to [Pinterest Ads Manager](https://ads.pinterest.com/)
2. Conversions → Set up tag
3. Copy the Tag ID
4. Add to `.env`: `REACT_APP_PINTEREST_TAG_ID=your_tag_id`

## Using Tracking Functions

Import and use tracking functions in your components:

```javascript
import { 
  trackGTMEvent, 
  trackFacebookEvent, 
  trackGoogleAdsConversion,
  trackLinkedInEvent,
  trackTwitterEvent,
  trackTikTokEvent 
} from '../utils/marketingTags';

// Track a custom event
const handleButtonClick = () => {
  trackGTMEvent('button_click', {
    button_name: 'Get Started',
    page: 'homepage'
  });
  
  trackFacebookEvent('ButtonClick', {
    content_name: 'Get Started Button'
  });
};

// Track a conversion
const handlePurchase = (value) => {
  trackGTMEvent('purchase', {
    value: value,
    currency: 'INR'
  });
  
  trackFacebookEvent('Purchase', {
    value: value,
    currency: 'INR'
  });
  
  trackGoogleAdsConversion('AW-XXXXXXXXX/ABC123', value, 'INR');
};
```

## Event Tracking Integration

Key events are already tracked:
- Page views (automatic)
- User sign-ups
- Login events
- Listing views
- Searches
- Bid placements
- Share actions

## Testing

1. **Google Tag Manager:**
   - Use GTM Preview mode to test tags
   - Check Data Layer in browser console

2. **Facebook Pixel:**
   - Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
   - Verify pixel fires on your site

3. **Google Ads:**
   - Use Google Ads Tag Assistant extension
   - Check conversion tracking in Google Ads dashboard

4. **Microsoft Clarity:**
   - Visit Clarity dashboard after 1-2 hours
   - You should see sessions being recorded

## Privacy & GDPR Compliance

Make sure to:
1. Add cookie consent banner (recommended: Cookiebot, OneTrust, or similar)
2. Update privacy policy to mention all tracking tools
3. Allow users to opt-out of non-essential tracking
4. Disclose tracking in Terms of Service

## Troubleshooting

**Tags not loading?**
- Check browser console for errors
- Verify environment variables are set correctly
- Make sure `.env` file is in the `frontend` directory
- Restart development server after adding env variables

**Events not tracking?**
- Check if tag IDs are correct
- Verify tags are loading (use browser DevTools → Network tab)
- Use tag assistant extensions to debug

**Production build issues?**
- Make sure to add env variables to your hosting platform
- For Vercel: Add to Environment Variables in project settings
- For Netlify: Add to Site settings → Build & deploy → Environment

## Recommended Marketing Stack Priority

**Essential (Start with these):**
1. Google Tag Manager
2. Google Analytics 4
3. Google Search Console
4. Facebook Pixel

**Important (Add next):**
5. Google Ads Conversion Tracking
6. Microsoft Clarity (Free!)

**Optional (Add as needed):**
7. LinkedIn Insight Tag (if using LinkedIn ads)
8. Twitter Pixel (if using Twitter ads)
9. TikTok Pixel (if using TikTok ads)
10. Pinterest Tag (if using Pinterest ads)

## Support

For issues or questions:
- Check each platform's documentation
- Use browser DevTools to debug
- Contact support for each platform if needed

