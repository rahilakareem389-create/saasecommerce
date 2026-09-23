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
        axios.get('https://saasecommerce.vercel.app/api/orders/myorders', config),
        axios.get('https://saasecommerce.vercel.app/api/users/myreviews', config),
        axios.get('https://saasecommerce.vercel.app/api/auth/profile', config),
        axios.get('https://saasecommerce.vercel.app/api/coupons/active', config),
        axios.get('https://saasecommerce.vercel.app/api/products') // Get all products
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
      await axios.put('https://saasecommerce.vercel.app/api/auth/profile', profile, config);
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
      await axios.post(`https://saasecommerce.vercel.app/api/products/${productId}/reviews`, {
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border shadow-sm p-4 sticky top-6">
            <h2 className="font-bold text-slate-800 mb-4 px-2 flex items-center gap-2">
              <User size={20} className="text-primary-600" /> My Dashboard
            </h2>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    if (link.id !== 'orders') setSelectedOrder(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === link.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <link.icon size={18} className={activeTab === link.id ? 'text-primary-600' : 'text-slate-400'} />
                  {link.label}
                  {link.id === 'wishlist' && wishlist.length > 0 && (
                    <span className="ml-auto bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full text-xs">{wishlist.length}</span>
                  )}
                  {link.id === 'orders' && pendingOrders > 0 && (
                    <span className="ml-auto bg-yellow-100 text-yellow-700 py-0.5 px-2 rounded-full text-xs">{pendingOrders}</span>
                  )}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          
          {/* 1. Dashboard Home */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name.split(' ')[0]} 👋</h2>
                <p className="text-slate-500 mt-1">Manage your profile, orders, wishlist, addresses and account settings.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
                  <h3 className="text-3xl font-bold text-slate-900">{orders.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <p className="text-sm font-medium text-slate-500 mb-1">Pending Orders</p>
                  <h3 className="text-3xl font-bold text-yellow-600">{pendingOrders}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <p className="text-sm font-medium text-slate-500 mb-1">Completed</p>
                  <h3 className="text-3xl font-bold text-green-600">{completedOrders}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <p className="text-sm font-medium text-slate-500 mb-1">Wishlist Items</p>
                  <h3 className="text-3xl font-bold text-red-500">{wishlist.length}</h3>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-primary-600 text-sm font-medium hover:underline">View All Orders →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 border-b">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Order ID</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold text-right">Items</th>
                        <th className="px-4 py-3 font-semibold text-right">Total</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 3).map(order => (
                        <tr key={order._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono text-xs">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                          <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                          <td className="px-4 py-3 text-right">{order.orderItems.length}</td>
                          <td className="px-4 py-3 font-medium text-right">${order.totalPrice.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`font-medium ${
                              order.status === 'Pending' ? 'text-yellow-600' :
                              order.status === 'Processing' ? 'text-blue-600' :
                              order.status === 'Shipped' ? 'text-indigo-600' :
                              order.status === 'Delivered' ? 'text-green-600' :
                              'text-red-600'
                            }`}>{order.status}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => { setActiveTab('orders'); setSelectedOrder(order); }} className="text-primary-600 hover:underline font-medium">View</button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-slate-500">No orders placed yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RECENTLY VIEWED PRODUCTS / SUGGESTIONS (To show products alongside dashboard) */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Products You Might Like</h3>
                  <Link to="/products" className="text-primary-600 text-sm font-medium hover:underline">Continue Shopping →</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {products.map(product => (
                    <div key={product._id} className="bg-white rounded-xl border p-3 hover:shadow-md transition-shadow relative">
                      <Link to={`/product/${product._id}`}>
                        <img src={product.imageUrl} alt={product.title} className="w-full h-32 object-contain mb-3" />
                        <h4 className="font-medium text-sm text-slate-800 truncate">{product.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-bold text-primary-600">${product.price}</span>
                          <span className="text-xs text-yellow-500">⭐ {product.rating || 0}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
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
  );
}
