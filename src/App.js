import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import theme from './theme/theme';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BottomNav from './components/BottomNav/BottomNav';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';
import ListingDetail from './pages/ListingDetail/ListingDetail';
import PostAd from './pages/PostAd/PostAd';
import EditListing from './pages/EditListing/EditListing';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import CategoryListings from './pages/CategoryListings/CategoryListings';
import LocationListings from './pages/LocationListings/LocationListings';
import SearchResults from './pages/SearchResults/SearchResults';
import Auctions from './pages/Auctions/Auctions';
import AuctionDetail from './pages/AuctionDetail/AuctionDetail';
import About from './pages/About/About';
import Blog from './pages/Blog/Blog';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import Contact from './pages/Contact/Contact';
import SingleSell from './pages/SingleSell/SingleSell';
import BulkSell from './pages/BulkSell/BulkSell';
import Locations from './pages/Locations/Locations';
import Help from './pages/Help/Help';
import RefundPolicy from './pages/RefundPolicy/RefundPolicy';
import Terms from './pages/Terms/Terms';
import PostingPolicy from './pages/PostingPolicy/PostingPolicy';
import AuctionPolicy from './pages/AuctionPolicy/AuctionPolicy';
import Unsubscribe from './pages/Unsubscribe/Unsubscribe';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ToastProvider>
          <Router>
          <ScrollToTop />
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:slug" element={<CategoryListings />} />
                <Route path="/location/:cityName" element={<LocationListings />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/auction/:id" element={<AuctionDetail />} />
                <Route path="/single-sell" element={<SingleSell />} />
                <Route path="/bulk-sell" element={<BulkSell />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/post-ad" element={<PostAd />} />
                <Route path="/edit-listing/:id" element={<EditListing />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/posting-policy" element={<PostingPolicy />} />
                <Route path="/auction-policy" element={<AuctionPolicy />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
          </div>
        </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

