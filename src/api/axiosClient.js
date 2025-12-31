import axios from 'axios';

// Central place to manage API base URL.
// Configure REACT_APP_API_URL (preferred) or REACT_APP_BASE_URL in your env.
// Falls back to the provided production URL if env vars are missing.
const baseURL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BASE_URL ||
  'http://localhost:5000';
  // 'https://phoneclubs-backend-pltz.onrender.com';

if (baseURL) {
  axios.defaults.baseURL = baseURL;
}

// Enable sending cookies with requests
axios.defaults.withCredentials = true;

export default axios;

