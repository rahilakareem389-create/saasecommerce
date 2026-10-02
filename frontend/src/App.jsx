import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import StoreLayout from './components/StoreLayout';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminCoupons from './pages/AdminCoupons';
import AdminInventory from './pages/AdminInventory';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserDashboard from './pages/UserDashboard';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';

import AdminPlaceholder from './pages/AdminPlaceholder';
import AdminCustomers from './pages/AdminCustomers';
import AdminSales from './pages/AdminSales';
import AdminReviews from './pages/AdminReviews';
import AdminSettings from './pages/AdminSettings';

import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';

import ErrorBoundary from './components/ErrorBoundary';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Storefront */}
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<StoreFront />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin" element={<StoreLayout />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="sales" element={<AdminSales />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
        <CookieConsent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
