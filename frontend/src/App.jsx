import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Storefront */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<StoreFront />} />
          <Route path="/products" element={<StoreFront />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
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
      </Routes>
    </Router>
  );
}

export default App;
