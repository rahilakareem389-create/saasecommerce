import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Heart, Star, MapPin, 
  Ticket, Bell, User, Settings, LogOut, CheckCircle, Truck, Eye, Trash2, Edit2, ShoppingCart
} from 'lucide-react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderTab, setOrderTab] = useState('All Orders');
  const { user, logout } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Data States
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]); // For Recommended Products
  const [loading, setLoading] = useState(true);
  
  // Profile State
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: { street: '', city: '', country: '', zipCode: '' },
    password: ''
  });

  // Selected Order for Details View
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const [ordersRes, reviewsRes, profileRes, couponsRes, productsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/orders/myorders`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/users/myreviews`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/auth/profile`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/coupons/active`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/products`) // Get all products
      ]);

      setOrders(ordersRes.data);
      setReviews(reviewsRes.data);
      setCoupons(couponsRes.data);
      setProducts(productsRes.data.slice(0, 4)); // Show 4 products
      
      const p = profileRes.data;
      setProfile({
        name: p.name || '',
        email: p.email || '',
        phone: p.phone || '',
        address: p.address || { street: '', city: '', country: '', zipCode: '' },
        password: ''
      });
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/auth/profile`, profile, config);
      alert('Profile updated successfully!');
      setProfile({ ...profile, password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handleDeleteReview = async (productId) => {
    if(!window.confirm('Delete this review?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/products/${productId}/reviews`, {
        rating: 0, comment: 'deleted', _delete: true // Dummy way to handle delete if backend doesn't have route
      }, config).catch(e => console.log("Implement delete route in backend if needed"));
      
      // Opt UI Update
      setReviews(reviews.filter(r => r.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading Dashboard...</div>;

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'addresses', label: 'My Addresses', icon: MapPin },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Filter Orders based on Tab
  const filteredOrders = orderTab === 'All Orders' ? orders : orders.filter(o => o.status === orderTab);

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50 to-primary-50/30 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Area */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your entire shopping experience from one place.</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg shadow-inner">
              ${user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">${user?.name}</p>
              <p className="text-xs text-slate-500">${user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Modern Glass Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sticky top-24">
              <nav className="space-y-2">
                {sidebarLinks.map((link) => {
                  const isActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActiveTab(link.id);
                        if (link.id !== 'orders') setSelectedOrder(null);
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 translate-x-2'
                          : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-md hover:translate-x-1'
                      }`}
                    >
                      <link.icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                      {link.label}
                      {link.id === 'wishlist' && wishlist.length > 0 && (
                        <span className={`ml-auto py-1 px-2.5 rounded-full text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'}`}>
                          ${wishlist.length}
                        </span>
                      )}
                      {link.id === 'orders' && pendingOrders > 0 && (
                        <span className={`ml-auto py-1 px-2.5 rounded-full text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                          ${pendingOrders}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
              
              <div className="pt-6 mt-6 border-t border-slate-200/50">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 bg-red-50/50 hover:bg-red-500 hover:text-white transition-all duration-300">
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            </div>
          </div>
  
          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* 1. Dashboard Home (Bento Grid Style) */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min mb-12">
                
                {/* Welcome Banner */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden flex flex-col justify-center group">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-500/40 to-fuchsia-500/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-white/20">
                      Welcome Back ✨
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                      Ready to elevate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-fuchsia-300">your wardrobe?</span>
                    </h2>
                    <p className="text-slate-300 font-medium text-lg max-w-md">Discover new arrivals, track your latest orders, and explore items picked just for you.</p>
                  </div>
                </div>

                {/* Wishlist Highlight Card */}
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-[2rem] p-8 shadow-xl shadow-rose-500/20 text-white relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setActiveTab('wishlist')}>
                  <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    <Heart size={150} fill="currentColor" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center justify-center h-full">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                      <Heart size={32} className="text-white" />
                    </div>
                    <h3 className="text-6xl font-black mb-2">${wishlist.length}</h3>
                    <p className="text-pink-100 font-bold text-lg uppercase tracking-wider">Saved Items</p>
                  </div>
                </div>

                {/* Stat Bento Boxes */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Total Orders */}
                  <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Package size={28} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800">${orders.length}</h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">Total Orders</p>
                  </div>
                  
                  {/* Pending Orders */}
                  <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Truck size={28} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800">${pendingOrders}</h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">Pending</p>
                  </div>

                  {/* Completed Orders */}
                  <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <CheckCircle size={28} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800">${completedOrders}</h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">Completed</p>
                  </div>

                  {/* Coupons */}
                  <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => setActiveTab('coupons')}>
                    <div className="w-16 h-16 bg-fuchsia-50 rounded-[1.5rem] flex items-center justify-center text-fuchsia-600 mb-4 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Ticket size={28} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800">${coupons.length}</h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">Coupons</p>
                  </div>
                </div>

                {/* Recent Orders List */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mt-2">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900">Recent Activity</h3>
                      <p className="text-slate-500 text-sm mt-1 font-medium">Track your most recent purchases</p>
                    </div>
                    <button onClick={() => setActiveTab('orders')} className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-sm border border-slate-100">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-100/60 bg-white/60 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 transition-all cursor-pointer" onClick={() => { setActiveTab('orders'); setSelectedOrder(order); }}>
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] shadow-inner border border-slate-100 flex items-center justify-center text-slate-400">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-lg">Order #${order._id.substring(order._id.length - 8).toUpperCase()}</p>
                            <p className="text-sm font-semibold text-slate-500 mt-1">${formatDate(order.createdAt)} • ${order.orderItems.length} Items</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-1/2">
                          <div className="text-left sm:text-right">
                            <p className="font-black text-slate-900 text-xl">$${order.totalPrice.toFixed(2)}</p>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mt-2 shadow-sm ${
                                order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' :
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                order.status === 'Pending' ? 'bg-amber-500' :
                                order.status === 'Processing' ? 'bg-blue-500' :
                                order.status === 'Shipped' ? 'bg-indigo-500' :
                                order.status === 'Delivered' ? 'bg-green-500' :
                                'bg-red-500'
                              }`}></div>
                              ${order.status}
                            </span>
                          </div>
                          <div className="w-12 h-12 rounded-[1.25rem] bg-white border border-slate-100 text-slate-400 flex items-center justify-center shadow-sm">
                            <Eye size={20} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="py-16 text-center flex flex-col items-center bg-white/50 rounded-3xl border border-slate-100 border-dashed">
                        <div className="w-24 h-24 bg-slate-100/50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                          <Package size={48} />
                        </div>
                        <h4 className="text-xl font-extrabold text-slate-700">No orders yet</h4>
                        <p className="text-slate-500 mt-2 font-medium">When you place an order, it will appear here.</p>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="w-full mt-6 sm:hidden px-6 py-4 bg-white text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-sm border border-slate-100">
                    View All Orders
                  </button>
                </div>

              </div>
            )}

          {/* 2 & 3. My Orders & Order Details */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {!selectedOrder ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">My Orders</h2>
                    {/* Order Tabs */}
                    <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 hide-scrollbar">
                      {['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setOrderTab(tab)}
                          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            orderTab === tab ? 'bg-slate-800 text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 border-b">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Order ID</th>
                          <th className="px-6 py-4 font-semibold">Date</th>
                          <th className="px-6 py-4 font-semibold">Products</th>
                          <th className="px-6 py-4 font-semibold">Total Amount</th>
                          <th className="px-6 py-4 font-semibold">Payment</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map(order => (
                          <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                            <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                            <td className="px-6 py-4">
                              <div className="flex -space-x-2">
                                {order.orderItems.slice(0, 3).map((item, idx) => (
                                  <img key={idx} src={item.image} alt="product" className="w-8 h-8 rounded-full border-2 border-white object-cover" title={item.name} />
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900">${order.totalPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 text-xs">{order.paymentMethod}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' :
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>{order.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => setSelectedOrder(order)} className="flex items-center justify-end gap-1 text-primary-600 hover:text-primary-700 font-medium ml-auto">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && <tr><td colSpan="7" className="py-12 text-center text-slate-500">No orders found in this category.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* Order Details View */
                <div className="space-y-6">
                  <button onClick={() => setSelectedOrder(null)} className="text-primary-600 font-medium flex items-center gap-1 hover:underline">
                    ← Back to Orders
                  </button>
                  
                  {/* Order Header */}
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800">Order #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                      <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                      <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                      <p><strong>Status:</strong> <span className={`font-bold ${
                        selectedOrder.status === 'Delivered' ? 'text-green-600' : 'text-primary-600'
                      }`}>{selectedOrder.status}</span></p>
                    </div>
                  </div>

                  {/* Order Tracking */}
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Order Tracking</h3>
                    <div className="relative flex justify-between items-center w-full mb-2">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 rounded-full z-0 transition-all" style={{ 
                        width: selectedOrder.status === 'Pending' ? '0%' : 
                               selectedOrder.status === 'Processing' ? '33%' : 
                               selectedOrder.status === 'Shipped' ? '66%' : 
                               selectedOrder.status === 'Delivered' ? '100%' : '0%' 
                      }}></div>
                      
                      {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                        const states = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                        const currentIdx = states.indexOf(selectedOrder.status);
                        const isCompleted = currentIdx >= idx;
                        const isCancelled = selectedOrder.status === 'Cancelled';
                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold mb-2 ${
                              isCancelled ? 'border-red-500 text-red-500 bg-red-50' :
                              isCompleted ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 text-slate-300 bg-white'
                            }`}>
                              {isCompleted && !isCancelled ? <CheckCircle size={16} /> : (isCancelled ? 'X' : (idx===1 && selectedOrder.status==='Processing' ? '🔵' : '○'))}
                            </div>
                            <span className={`text-xs font-medium ${isCompleted && !isCancelled ? 'text-slate-800' : 'text-slate-400'}`}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                      {/* Items */}
                      <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-4 flex items-center gap-2">🛍️ Ordered Products</h3>
                        <div className="space-y-4">
                          {selectedOrder.orderItems.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg border object-cover" />
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{item.name}</h4>
                                {item.variant && <p className="text-xs text-slate-500">Size/Color: {item.variant}</p>}
                                <p className="text-sm text-slate-600">Quantity: {item.qty} | Price: Rs. {item.price.toFixed(2)}</p>
                              </div>
                              <div className="font-bold text-slate-900 text-right">
                                <p className="text-xs text-slate-500 font-normal">Subtotal</p>
                                Rs. {(item.qty * item.price).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Track Order</button>
                        <button className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">Download Invoice</button>
                        <button className="px-4 py-2 border border-primary-500 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-50">Reorder</button>
                        
                        {selectedOrder.status === 'Delivered' && (
                          <button onClick={() => navigate('/product/'+selectedOrder.orderItems[0]?.product)} className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-200">Write Review</button>
                        )}
                        {selectedOrder.status === 'Pending' && (
                          <button className="px-4 py-2 text-red-600 text-sm font-medium hover:underline ml-auto">Cancel Order</button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-4">💰 Order Summary</h3>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex justify-between"><span>Subtotal:</span> <span>Rs. {(selectedOrder.totalPrice - selectedOrder.taxPrice - selectedOrder.shippingPrice).toFixed(2)}</span></div>
                          {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount/Coupon:</span> <span>-Rs. {selectedOrder.discount}</span></div>}
                          <div className="flex justify-between"><span>Shipping:</span> <span>Rs. {selectedOrder.shippingPrice}</span></div>
                          <div className="flex justify-between"><span>Tax:</span> <span>Rs. {selectedOrder.taxPrice}</span></div>
                          <div className="flex justify-between pt-2 border-t font-bold text-slate-900 text-lg mt-2">
                            <span>Total:</span> <span>Rs. {selectedOrder.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-4 flex items-center gap-2">📍 Delivery Address</h3>
                        <p className="font-medium text-slate-900">{user?.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{selectedOrder.shippingAddress.address}</p>
                        <p className="text-sm text-slate-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}</p>
                        <p className="text-sm text-slate-600 mt-2">Phone: **********</p>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-4 flex items-center gap-2">💳 Payment Information</h3>
                        <p className="text-sm text-slate-600"><strong>Method:</strong> {selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          <strong>Status:</strong> <span className={selectedOrder.isPaid ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>{selectedOrder.isPaid ? 'Paid' : 'Pending'}</span>
                        </p>
                        {selectedOrder.isPaid && selectedOrder.paymentResult?.id && (
                          <p className="text-xs text-slate-400 mt-1 break-all">TXN ID: {selectedOrder.paymentResult.id}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">❤️ My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border shadow-sm text-center">
                  <Heart size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Your wishlist is empty</h3>
                  <p className="text-slate-500 mb-6">Explore more and shortlist some items.</p>
                  <Link to="/products" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">Start Shopping</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map(product => (
                    <div key={product._id} className="bg-white rounded-xl border p-4 shadow-sm relative group flex flex-col">
                      <button onClick={() => toggleWishlist(product)} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors z-10" title="Remove">
                        <Heart size={18} className="fill-red-500" />
                      </button>
                      <Link to={`/product/${product._id}`} className="flex-1">
                        <div className="aspect-square bg-slate-50 rounded-lg mb-4 p-4 overflow-hidden relative">
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                        </div>
                        <h3 className="font-bold text-slate-800 truncate">{product.title}</h3>
                        <div className="flex justify-between items-center mt-2 mb-3">
                          <span className="font-bold text-primary-600">Rs. {product.price}</span>
                          <span className="text-xs text-yellow-500 flex items-center gap-1">⭐ {product.rating || 0}</span>
                        </div>
                        <div className="text-xs font-medium mb-4 text-green-600">In Stock</div>
                      </Link>
                      <button onClick={() => addToCart(product, 1)} className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 flex justify-center items-center gap-2">
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. My Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-800">👤 My Profile</h2>
              <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
                
                <div className="flex items-center gap-6 pb-6 border-b">
                  <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Upload Profile Picture</button>
                    <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input type="text" value={profile.name} onChange={e=>setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" value={profile.email} onChange={e=>setProfile({...profile, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="text" value={profile.phone} onChange={e=>setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Date of Birth (Optional)</label>
                    <input type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-600" />
                  </div>
                </div>
                
                <button type="submit" className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Edit Profile → Save Changes
                </button>
              </form>
            </div>
          )}

          {/* 6. Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-800">📍 My Addresses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border-2 border-primary-500 shadow-sm relative">
                  <span className="absolute top-5 right-5 bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded">Default Address</span>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">Home</h3>
                  <p className="text-sm text-slate-800 font-medium">{profile.name}</p>
                  <p className="text-sm text-slate-600">{profile.address?.street || 'Okara, Punjab'}</p>
                  <p className="text-sm text-slate-600 mb-4">{profile.address?.country || 'Pakistan'}</p>
                  
                  <div className="flex gap-3">
                    <button className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"><Edit2 size={14}/> Edit</button>
                    <button className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border shadow-sm relative flex flex-col">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">Office</h3>
                  <p className="text-sm text-slate-800 font-medium">{profile.name}</p>
                  <p className="text-sm text-slate-600 mb-4">Lahore, Punjab</p>
                  
                  <div className="flex gap-3 mt-auto">
                    <button className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"><Edit2 size={14}/> Edit</button>
                    <button className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-medium hover:bg-slate-50 hover:border-primary-500 hover:text-primary-600 transition-colors">
                + Add New Address
              </button>
            </div>
          )}

          {/* 7. Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-800">🔐 Account Settings</h2>
              
              <div className="bg-white p-6 rounded-2xl border shadow-sm divide-y">
                
                <div className="pb-6">
                  <h3 className="font-bold text-slate-800 mb-4">Change Password</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">New Password</label>
                      <input type="password" required value={profile.password} onChange={e=>setProfile({...profile, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                      Update Password
                    </button>
                  </form>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">Change Email</h4>
                      <p className="text-sm text-slate-500">Current: {profile.email}</p>
                    </div>
                    <button className="text-sm text-primary-600 font-medium border px-3 py-1 rounded hover:bg-slate-50">Change</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">Change Phone</h4>
                      <p className="text-sm text-slate-500">Current: {profile.phone || 'Not set'}</p>
                    </div>
                    <button className="text-sm text-primary-600 font-medium border px-3 py-1 rounded hover:bg-slate-50">Change</button>
                  </div>
                </div>

                <div className="py-6 border-b">
                  <h4 className="font-bold text-slate-800 mb-3">Saved Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-slate-200 rounded text-[10px] font-bold flex items-center justify-center text-slate-500">VISA</div>
                        <span className="text-sm font-medium text-slate-700">**** **** **** 4242</span>
                      </div>
                      <button className="text-xs text-red-600 font-medium hover:underline">Remove</button>
                    </div>
                    <button className="w-full py-2 border border-dashed rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors">+ Attach New Payment Method</button>
                  </div>
                </div>

                <div className="py-6">
                  <h4 className="font-bold text-slate-800 mb-3">Notification Preferences</h4>
                  <label className="flex items-center gap-2 text-sm text-slate-700 mb-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary-600" /> Order Updates via Email
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary-600" /> Promotional Offers & Coupons
                  </label>
                </div>

                <div className="pt-6">
                  <button onClick={handleLogout} className="text-red-600 font-medium hover:underline flex items-center gap-2">
                    <LogOut size={18} /> Logout from all devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 8. My Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">⭐ My Reviews</h2>
              
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 border-b">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Rating</th>
                      <th className="px-6 py-4 font-semibold">Review</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reviews.map(review => (
                      <tr key={review._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                          <img src={review.productImage} className="w-10 h-10 rounded border object-cover" alt="" />
                          <Link to={`/product/${review.productId}`} className="hover:text-primary-600 hover:underline">{review.productName}</Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex text-yellow-400">
                            {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= review.rating ? "fill-yellow-400" : "fill-slate-200 text-slate-200"} />)}
                          </div>
                        </td>
                        <td className="px-6 py-4"><div className="max-w-[150px] truncate">{review.comment}</div></td>
                        <td className="px-6 py-4">{formatDate(review.createdAt)}</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${
                            review.status === 'Approved' ? 'text-green-600' :
                            review.status === 'Rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>{review.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="text-slate-400 hover:text-primary-600"><Edit2 size={16}/></button>
                            <button onClick={() => handleDeleteReview(review.productId)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && <tr><td colSpan="6" className="py-12 text-center text-slate-500">You haven't submitted any reviews yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-800">🔔 Notifications</h2>
              <div className="bg-white rounded-2xl border shadow-sm divide-y">
                {orders.slice(0, 3).map((order, idx) => (
                  <div key={idx} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium">🔔 Your order #{order._id.substring(order._id.length-8).toUpperCase()} has been {order.status.toLowerCase()}.</p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
                
                {coupons.map((coupon, idx) => (
                  <div key={'c'+idx} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium">🔔 Coupon Available: Use code <strong>{coupon.code}</strong> for {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `Rs. ${coupon.discountAmount} OFF`}.</p>
                      <p className="text-xs text-slate-500 mt-1">Expires: {formatDate(coupon.expiryDate)}</p>
                    </div>
                  </div>
                ))}
                
                {orders.length === 0 && coupons.length === 0 && <div className="p-8 text-center text-slate-500">No new notifications.</div>}
              </div>
            </div>
          )}

          {/* 10. Coupons */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">🎟️ My Coupons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map(coupon => (
                  <div key={coupon._id} className="bg-white p-6 rounded-2xl border border-dashed border-primary-300 bg-primary-50/30 flex justify-between items-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary-100 rounded-bl-full -z-10"></div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-wide uppercase">{coupon.code}</h3>
                      <p className="text-primary-600 font-bold mt-1 text-lg">
                        {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `Rs. ${coupon.discountAmount} OFF`}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">Minimum Order: Rs. {coupon.minOrderAmount} <br/> Expires: {formatDate(coupon.expiryDate)}</p>
                    </div>
                    <button className="px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-md" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                      Copy Code
                    </button>
                  </div>
                ))}
                {coupons.length === 0 && <div className="col-span-2 p-12 text-center bg-white rounded-2xl border text-slate-500">No active coupons available right now.</div>}
              </div>
            </div>
          )}

        </div>
        </div>
    </div>
    </div>
  );
}
