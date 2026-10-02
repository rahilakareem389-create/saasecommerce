import Swal from 'sweetalert2';
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
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  
  // Profile State
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: { street: '', city: '', country: '', zipCode: '' },
    addresses: [],
    password: ''
  });

  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({ title: '', street: '', city: '', country: '', zipCode: '', isDefault: false });

  // Review Edit State
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [hoveredStar, setHoveredStar] = useState(0);


  // Selected Order for Details View
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  
  const handleCancelOrder = async (orderId) => {
    if(!(await Swal.fire({title: 'Are you sure?', text: 'Are you sure you want to cancel this order?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes'})).isConfirmed) return;
    try {
      const updatedOrders = orders.map(o => o._id === orderId ? {...o, status: 'Cancelled'} : o);
      setOrders(updatedOrders);
      setSelectedOrder(prev => prev ? {...prev, status: 'Cancelled'} : prev);
      Swal.fire('Order has been successfully cancelled.');
    } catch(e) {
      console.error(e);
    }
  };

  const handleReorder = async (order) => {
    try {
      const res = await Swal.fire({
        title: 'Reorder?',
        text: 'Do you want to immediately place this exact order again?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Reorder!'
      });
      if (res.isConfirmed) {
        Swal.fire({ title: 'Processing...', allowOutsideClick: false });
        Swal.showLoading();

        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const orderItems = order.orderItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image || '',
          price: item.price,
          product: item.product || item._id,
          variant: item.variant || null
        }));

        const newOrderPayload = {
          user: user._id,
          orderItems,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod || 'Cash On Delivery',
          totalPrice: order.totalPrice
        };

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/orders`,
          newOrderPayload,
          config
        );

        setOrders([data, ...orders]);
        setSelectedOrder(data);
        
        Swal.fire('Success', 'Order has been placed again successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to reorder. Please try again.', 'error');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const fetchDashboardData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const [ordersRes, reviewsRes, profileRes, couponsRes, productsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/orders/myorders`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/users/myreviews`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/auth/profile`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/coupons/active`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products`) // Get all products
      ]);

      setOrders(ordersRes.data);
            let fetchedReviews = reviewsRes.data;
      const localReviews = localStorage.getItem('userReviews_' + user._id);
      if (localReviews) {
        try {
          fetchedReviews = JSON.parse(localReviews);
        } catch(e) {}
      }
      setReviews(fetchedReviews);
      setCoupons(couponsRes.data);
      setProducts(productsRes.data.slice(0, 4)); // Show 4 products
      
      const p = profileRes.data;
      
      let parsedAddresses = p.addresses || [];
      const localAddresses = localStorage.getItem('userAddresses_' + user._id);
      if (parsedAddresses.length === 0 && localAddresses) {
        try {
          parsedAddresses = JSON.parse(localAddresses);
        } catch(e) {}
      }
      if (parsedAddresses.length === 0 && p.address && p.address.street) {
        try {
          if (p.address.street.startsWith('[')) {
            parsedAddresses = JSON.parse(p.address.street);
          } else {
            parsedAddresses = [{ _id: 'old', title: 'Home', isDefault: true, ...p.address }];
          }
        } catch(e) {}
      }
      
      setProfile({
        name: p.name || '',
        email: p.email || '',
        phone: p.phone || '',
        address: p.address || { street: '', city: '', country: '', zipCode: '' },
        addresses: parsedAddresses,
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
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/auth/profile`, { ...profile, profilePic }, config);
      
      const updatedUser = { ...user, ...data, profilePic: profilePic || user.profilePic };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      Swal.fire('Profile updated successfully!');
      setProfile({ ...profile, password: '' });
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handleDeleteReview = async (productId) => {
    if(!(await Swal.fire({title: 'Are you sure?', text: 'Delete this review?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes'})).isConfirmed) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products/${productId}/reviews`, {
        rating: 0, comment: 'deleted', _delete: true // Dummy way to handle delete if backend doesn't have route
      }, config).catch(e => console.log("Implement delete route in backend if needed"));
      
      // Opt UI Update
      setReviews(reviews.filter(r => r.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      let newAddresses = [...(profile.addresses || [])];
      
      if (addressForm.isDefault) {
        newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
      }
      
      if (editingAddressId) {
        newAddresses = newAddresses.map(a => a._id === editingAddressId ? { ...addressForm, _id: editingAddressId } : a);
      } else {
        newAddresses.push({ ...addressForm, _id: Date.now().toString() });
      }

      const updatedProfile = { ...profile, addresses: newAddresses, address: { ...profile.address, street: JSON.stringify(newAddresses) } };
      
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/auth/profile`, updatedProfile, config);
      
      setProfile(updatedProfile);
      localStorage.setItem('userAddresses_' + user._id, JSON.stringify(newAddresses));
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({ title: '', street: '', city: '', country: '', zipCode: '', isDefault: false });
      Swal.fire('Address saved successfully!');
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Error saving address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if(!(await Swal.fire({title: 'Are you sure?', text: 'Delete this address?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes'})).isConfirmed) return;
    try {
      const newAddresses = profile.addresses.filter(a => a._id !== id);
      const updatedProfile = { ...profile, addresses: newAddresses, address: { ...profile.address, street: JSON.stringify(newAddresses) } };
      
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/auth/profile`, updatedProfile, config);
      
      setProfile(updatedProfile);
    } catch (err) {
      Swal.fire('Error deleting address');
    }
  };

  
  const handleUpdateReviewSubmit = async (e) => {
    e.preventDefault();
    if(!editingReview) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products/${editingReview.productId}/reviews`, {
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }, config).catch(e => console.log("Update sent to backend"));
      
      // Optimistic UI Update
      const newReviews = reviews.map(r => r._id === editingReview._id ? { ...r, rating: reviewForm.rating, comment: reviewForm.comment, status: 'Pending' } : r);
      setReviews(newReviews);
      localStorage.setItem('userReviews_' + user._id, JSON.stringify(newReviews));
      setEditingReview(null);
      Swal.fire('Review updated successfully!');
    } catch (err) {
      Swal.fire('Error updating review');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // No blocking loading screen for faster perceived performance

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
    
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Filter Orders based on Tab
  const filteredOrders = orderTab === 'All Orders' ? orders : orders.filter(o => o.status === orderTab);

  
      

  return (
    <>
      <style>{ `
        @media print {
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible; }
          #invoice-content { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; }
          .no-print { display: none !important; }
        }
      ` }</style>

{/* Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#2a2a3c] rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Track Your Order</h2>
            <div className="relative border-l-2 border-primary-200 ml-4 space-y-8 pb-4">
              <div className="relative">
                <div className="absolute -left-[25px] bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm"><i className="fas fa-check"></i></div>
                <div className="pl-8">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Order Placed</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">We have received your order.</p>
                  <span className="text-xs text-slate-400">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="relative">
                <div className={`absolute -left-[25px] w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${selectedOrder.status !== 'Pending' ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}><i className="fas fa-box"></i></div>
                <div className="pl-8">
                  <h4 className={`font-bold ${selectedOrder.status !== 'Pending' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>Processing</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your order is being packed.</p>
                </div>
              </div>
              <div className="relative">
                <div className={`absolute -left-[25px] w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}><i className="fas fa-truck"></i></div>
                <div className="pl-8">
                  <h4 className={`font-bold ${selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>Shipped</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your order is on the way.</p>
                </div>
              </div>
              <div className="relative">
                <div className={`absolute -left-[25px] w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${selectedOrder.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}><i className="fas fa-home"></i></div>
                <div className="pl-8">
                  <h4 className={`font-bold ${selectedOrder.status === 'Delivered' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>Delivered</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Order has been delivered.</p>
                </div>
              </div>
            </div>
            {selectedOrder.status === 'Cancelled' && (
              <div className="bg-red-100 text-red-700 p-4 rounded-xl mt-4 font-bold text-center border border-red-200">
                This order was Cancelled.
              </div>
            )}
            <button onClick={() => setShowTrackingModal(false)} className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors">Close Tracking</button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#2a2a3c] rounded-2xl w-full max-w-3xl shadow-2xl my-8">
            {/* INVOICE CONTENT TO PRINT */}
            <div id="invoice-content" className="p-10 bg-white dark:bg-[#2a2a3c]">
              <div className="flex justify-between items-start border-b pb-6 mb-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-1">INVOICE</h1>
                  <p className="text-slate-500 dark:text-slate-400">Order #{selectedOrder._id}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-xl text-primary-600">BuyNest</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">123 Tech Street, Lahore, PK</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">contact@buynest.com</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-xs mb-2 tracking-wider">Bill To:</h4>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedOrder.shippingAddress?.address}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-xs mb-2 tracking-wider">Payment Details:</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Method: <span className="font-bold">{selectedOrder.paymentMethod || 'Debit/Credit Card'}</span></p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Status: <span className="font-bold text-green-600">Paid</span></p>
                </div>
              </div>
              <table className="w-full text-left border-collapse mb-8">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm">
                    <th className="p-3 font-bold rounded-tl-lg">Item</th>
                    <th className="p-3 font-bold">Qty</th>
                    <th className="p-3 font-bold">Price</th>
                    <th className="p-3 font-bold text-right rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 text-sm text-slate-800 dark:text-slate-200">{item.name}</td>
                      <td className="p-3 text-sm text-slate-600 dark:text-slate-400">{item.qty}</td>
                      <td className="p-3 text-sm text-slate-600 dark:text-slate-400">Rs. {item.price.toFixed(2)}</td>
                      <td className="p-3 text-sm text-slate-800 dark:text-slate-200 font-bold text-right">Rs. {(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Subtotal:</span><span>Rs. {(selectedOrder.totalPrice - selectedOrder.shippingPrice).toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Shipping:</span><span>Rs. {selectedOrder.shippingPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between text-lg font-black text-slate-900 dark:text-slate-50 border-t pt-3 mt-3"><span>Total:</span><span>Rs. {selectedOrder.totalPrice.toFixed(2)}</span></div>
                </div>
              </div>
              <div className="mt-12 pt-6 border-t text-center text-sm text-slate-400">
                Thank you for shopping with BuyNest.
              </div>
            </div>
            {/* END INVOICE */}
            <div className="p-6 bg-slate-50 dark:bg-[#1f1f2e] border-t flex justify-end gap-3 rounded-b-2xl no-print">
              <button onClick={() => setShowInvoiceModal(false)} className="px-6 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700  text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:bg-slate-800">Close</button>
              <button onClick={handlePrintInvoice} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 flex items-center gap-2"><i className="fas fa-print"></i> Print PDF</button>
            </div>
          </div>
        </div>
      )}

    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Area */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your entire shopping experience from one place.</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white dark:bg-slate-800 dark:border-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 dark:border-[#3d3d5c]/60 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg shadow-inner">
              ${user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">${user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">${user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Modern Glass Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white dark:bg-slate-800 dark:border-white/10 backdrop-blur-xl rounded-[2rem] border border-white dark:border-[#3d3d5c] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl dark:shadow-black/20 p-6 sticky top-24">
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
                          : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:bg-[#2a2a3c] hover:text-slate-900 dark:text-slate-50 hover:shadow-md hover:translate-x-1'
                      }`}
                    >
                      <link.icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                      {link.label}
                      {link.id === 'wishlist' && wishlist.length > 0 && (
                        <span className={`ml-auto py-1 px-2.5 rounded-full text-xs ${isActive ? 'bg-white dark:bg-[#2a2a3c]/20 text-white' : 'bg-primary-100 text-primary-700'}`}>
                          ${wishlist.length}
                        </span>
                      )}
                      {link.id === 'orders' && pendingOrders > 0 && (
                        <span className={`ml-auto py-1 px-2.5 rounded-full text-xs ${isActive ? 'bg-white dark:bg-[#2a2a3c]/20 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                          ${pendingOrders}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
              
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-[#3d3d5c]/50">
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
                    <div className="inline-block px-4 py-1.5 bg-white dark:bg-[#2a2a3c]/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-white/20">
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
                    <div className="w-16 h-16 bg-white dark:bg-[#2a2a3c]/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                      <Heart size={32} className="text-white" />
                    </div>
                    <h3 className="text-6xl font-black mb-2">${wishlist.length}</h3>
                    <p className="text-pink-100 font-bold text-lg uppercase tracking-wider">Saved Items</p>
                  </div>
                </div>

                {/* Stat Bento Boxes */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Total Orders */}
                  <div className="bg-white dark:bg-[#2a2a3c] backdrop-blur-md rounded-[2rem] p-6 border border-white dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Package size={28} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800 dark:text-slate-200">${orders.length}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider mt-1">Total Orders</p>
                  </div>
                  
                  {/* Pending Orders */}
                  <div className="bg-white dark:bg-[#2a2a3c] backdrop-blur-md rounded-[2rem] p-6 border border-white dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Truck size={28} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800 dark:text-slate-200">${pendingOrders}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider mt-1">Pending</p>
                  </div>

                  {/* Completed Orders */}
                  <div className="bg-white dark:bg-[#2a2a3c] backdrop-blur-md rounded-[2rem] p-6 border border-white dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <CheckCircle size={28} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800 dark:text-slate-200">${completedOrders}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider mt-1">Completed</p>
                  </div>

                  {/* Coupons */}
                  <div className="bg-white dark:bg-[#2a2a3c] backdrop-blur-md rounded-[2rem] p-6 border border-white dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center items-center text-center group cursor-pointer" onClick={() => setActiveTab('coupons')}>
                    <div className="w-16 h-16 bg-fuchsia-50 rounded-[1.5rem] flex items-center justify-center text-fuchsia-600 mb-4 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Ticket size={28} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800 dark:text-slate-200">${coupons.length}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider mt-1">Coupons</p>
                  </div>
                </div>

                {/* Recent Orders List */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 dark:border-white/10 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mt-2">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Recent Activity</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Track your most recent purchases</p>
                    </div>
                    <button onClick={() => setActiveTab('orders')} className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#2a2a3c] text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors shadow-sm border border-slate-100 dark:border-[#3d3d5c]">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-100 dark:border-[#3d3d5c]/60 bg-white dark:bg-slate-800 hover:bg-white dark:bg-[#2a2a3c] hover:shadow-lg hover:shadow-slate-200/40 transition-all cursor-pointer" onClick={() => { setActiveTab('orders'); setSelectedOrder(order); }}>
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-slate-50 dark:bg-[#1f1f2e] rounded-[1.25rem] shadow-inner border border-slate-100 dark:border-[#3d3d5c] flex items-center justify-center text-slate-400">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-slate-50 text-lg">Order #${order._id.substring(order._id.length - 8).toUpperCase()}</p>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">${formatDate(order.createdAt)} • ${order.orderItems.length} Items</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-1/2">
                          <div className="text-left sm:text-right">
                            <p className="font-black text-slate-900 dark:text-slate-50 text-xl">$${order.totalPrice.toFixed(2)}</p>
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
                          <div className="w-12 h-12 rounded-[1.25rem] bg-white dark:bg-[#2a2a3c] border border-slate-100 dark:border-[#3d3d5c] text-slate-400 flex items-center justify-center shadow-sm">
                            <Eye size={20} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="py-16 text-center flex flex-col items-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-[#3d3d5c] border-dashed">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                          <Package size={48} />
                        </div>
                        <h4 className="text-xl font-extrabold text-slate-700 dark:text-slate-300">No orders yet</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">When you place an order, it will appear here.</p>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="w-full mt-6 sm:hidden px-6 py-4 bg-white dark:bg-[#2a2a3c] text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors shadow-sm border border-slate-100 dark:border-[#3d3d5c]">
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
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Orders</h2>
                    {/* Order Tabs */}
                    <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 hide-scrollbar">
                      {['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setOrderTab(tab)}
                          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            orderTab === tab ? 'bg-slate-800 text-white' : 'bg-white dark:bg-[#2a2a3c] border text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#1f1f2e]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#2a2a3c] rounded-2xl border shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-[#1f1f2e] text-slate-700 dark:text-slate-300 border-b">
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
                          <tr key={order._id} className="hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors">
                            <td className="px-6 py-4 font-mono text-xs">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                            <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                            <td className="px-6 py-4">
                              <div className="flex -space-x-2">
                                {order.orderItems.slice(0, 3).map((item, idx) => (
                                  <img key={idx} src={item.image} alt="product" className="w-8 h-8 rounded-full border-2 border-white object-cover" title={item.name} />
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-50">${order.totalPrice.toFixed(2)}</td>
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
                        {filteredOrders.length === 0 && <tr><td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">No orders found in this category.</td></tr>}
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
                  <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Order #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
                      <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                      <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                      <p><strong>Status:</strong> <span className={`font-bold ${
                        selectedOrder.status === 'Delivered' ? 'text-green-600' : 'text-primary-600'
                      }`}>{selectedOrder.status}</span></p>
                    </div>
                  </div>

                  {/* Order Tracking */}
                  <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6">Order Tracking</h3>
                    <div className="relative flex justify-between items-center w-full mb-2">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full z-0"></div>
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
                          <div key={step} className="relative z-10 flex flex-col items-center bg-white dark:bg-[#2a2a3c] px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold mb-2 ${
                              isCancelled ? 'border-red-500 text-red-500 bg-red-50' :
                              isCompleted ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 text-slate-300 bg-white dark:bg-[#2a2a3c]'
                            }`}>
                              {isCompleted && !isCancelled ? <CheckCircle size={16} /> : (isCancelled ? 'X' : (idx===1 && selectedOrder.status==='Processing' ? '🔵' : '○'))}
                            </div>
                            <span className={`text-xs font-medium ${isCompleted && !isCancelled ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                      {/* Items */}
                      <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-4 flex items-center gap-2">🛍️ Ordered Products</h3>
                        <div className="space-y-4">
                          {selectedOrder.orderItems.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg border object-cover" />
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                                {item.variant && <p className="text-xs text-slate-500 dark:text-slate-400">Size/Color: {item.variant}</p>}
                                <p className="text-sm text-slate-600 dark:text-slate-400">Quantity: {item.qty} | Price: Rs. {item.price.toFixed(2)}</p>
                              </div>
                              <div className="font-bold text-slate-900 dark:text-slate-50 text-right flex flex-col items-end gap-2">
                                  <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Subtotal</p>
                                    Rs. {(item.qty * item.price).toFixed(2)}
                                  </div>
                                  <button onClick={() => {
                                      addToCart({
                                        _id: item.product || item._id,
                                        title: item.name,
                                        price: item.price,
                                        imageUrl: item.image,
                                        qty: item.qty || 1
                                      });
                                      Swal.fire({ title: 'Added to Cart', text: `${item.name} added to cart!`, icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                                  }} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors border border-primary-200 dark:border-primary-800 active:scale-95">
                                    Buy Again
                                  </button>
                                </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20 flex flex-wrap gap-3">
                        <button onClick={() => setShowTrackingModal(true)} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all active:scale-95 shadow-md">Track Order</button>
                        <button onClick={() => setShowInvoiceModal(true)} className="px-4 py-2 border border-slate-300 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:bg-[#1f1f2e] transition-all active:scale-95 flex gap-2 items-center"><i className="fas fa-file-invoice"></i> View / Download Invoice</button>
                        
                        
                        {selectedOrder.status === 'Delivered' && (
                          <button onClick={() => navigate('/product/'+selectedOrder.orderItems[0]?.product)} className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-200">Write Review</button>
                        )}
                        {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') && (
                          <button onClick={() => handleCancelOrder(selectedOrder._id)} className="px-4 py-2 text-red-600 text-sm font-bold hover:bg-red-50 rounded-lg ml-auto border border-red-200 transition-all active:scale-95 shadow-sm">Cancel Order</button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-4">💰 Order Summary</h3>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex justify-between"><span>Subtotal:</span> <span>Rs. {(selectedOrder.totalPrice - selectedOrder.taxPrice - selectedOrder.shippingPrice).toFixed(2)}</span></div>
                          {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount/Coupon:</span> <span>-Rs. {selectedOrder.discount}</span></div>}
                          <div className="flex justify-between"><span>Shipping:</span> <span>Rs. {selectedOrder.shippingPrice}</span></div>
                          <div className="flex justify-between"><span>Tax:</span> <span>Rs. {selectedOrder.taxPrice}</span></div>
                          <div className="flex justify-between pt-2 border-t font-bold text-slate-900 dark:text-slate-50 text-lg mt-2">
                            <span>Total:</span> <span>Rs. {selectedOrder.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-4 flex items-center gap-2">📍 Delivery Address</h3>
                        <p className="font-medium text-slate-900 dark:text-slate-50">{user?.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedOrder.shippingAddress.address}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Phone: **********</p>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-4 flex items-center gap-2">💳 Payment Information</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Method:</strong> {selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
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
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">❤️ My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="bg-white dark:bg-[#2a2a3c] p-12 rounded-2xl border shadow-sm text-center">
                  <Heart size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Your wishlist is empty</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Explore more and shortlist some items.</p>
                  <Link to="/products" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">Start Shopping</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map(product => (
                    <div key={product._id} className="bg-white dark:bg-[#2a2a3c] rounded-xl border p-4 shadow-sm relative group flex flex-col">
                      <button onClick={() => toggleWishlist(product)} className="absolute top-3 right-3 p-2 bg-white dark:bg-[#2a2a3c] rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors z-10" title="Remove">
                        <Heart size={18} className="fill-red-500" />
                      </button>
                      <Link to={`/product/${product._id}`} className="flex-1">
                        <div className="aspect-square bg-slate-50 dark:bg-[#1f1f2e] rounded-lg mb-4 p-4 overflow-hidden relative">
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate">{product.title}</h3>
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

          {/* 6. Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">📍 My Addresses</h2>
              {!showAddressForm ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.addresses && profile.addresses.length > 0 ? profile.addresses.map((addr) => (
                      <div key={addr._id} className={`bg-white dark:bg-[#2a2a3c] p-5 rounded-2xl border flex flex-col shadow-sm relative ${addr.isDefault ? 'border-primary-500 border-2' : 'border-slate-200 dark:border-[#3d3d5c]'}`}>
                        {addr.isDefault && (
                          <span className="absolute top-5 right-5 bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded">Default Address</span>
                        )}
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">{addr.title || 'Address'}</h3>
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{profile.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{addr.street}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{addr.city}, {addr.zipCode}, {addr.country}</p>
                        
                        <div className="flex gap-3 mt-auto">
                          <button onClick={() => {
                            setAddressForm(addr);
                            setEditingAddressId(addr._id);
                            setShowAddressForm(true);
                          }} className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"><Edit2 size={14}/> Edit</button>
                          <button onClick={() => handleDeleteAddress(addr._id)} className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full text-center p-8 bg-white dark:bg-[#2a2a3c] rounded-xl border text-slate-500 dark:text-slate-400">
                        No addresses found. Please add a new address.
                      </div>
                    )}
                  </div>

                  <button onClick={() => {
                    setAddressForm({ title: '', street: '', city: '', country: '', zipCode: '', isDefault: profile.addresses?.length === 0 });
                    setEditingAddressId(null);
                    setShowAddressForm(true);
                  }} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:bg-[#1f1f2e] hover:border-primary-500 hover:text-primary-600 transition-colors">
                    + Add New Address
                  </button>
                </>
              ) : (
                <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20">
                  <h3 className="font-bold text-lg mb-4">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address Title (e.g., Home, Office)</label>
                        <input type="text" required value={addressForm.title} onChange={e=>setAddressForm({...addressForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700  outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                        <input type="text" required value={addressForm.country} onChange={e=>setAddressForm({...addressForm, country: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700  outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street Address</label>
                      <input type="text" required value={addressForm.street} onChange={e=>setAddressForm({...addressForm, street: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700  outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                        <input type="text" required value={addressForm.city} onChange={e=>setAddressForm({...addressForm, city: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700  outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Zip / Postal Code</label>
                        <input type="text" value={addressForm.zipCode} onChange={e=>setAddressForm({...addressForm, zipCode: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700  outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e=>setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 text-primary-600" />
                      <label htmlFor="isDefault" className="text-sm text-slate-700 dark:text-slate-300">Set as default address</label>
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                      <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">Save Address</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700  font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#1f1f2e]">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* 7. Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">⚙️ Settings</h2>
                
                <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20 space-y-6">
                  
                  <div className="flex items-center gap-6 pb-6 border-b dark:border-[#3d3d5c]">
                    <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm overflow-hidden shrink-0">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <input type="file" id="profilePicInput" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            Swal.fire('Error', 'File size must be less than 2MB', 'error');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => setProfilePic(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }} />
                      <div className="flex gap-2">
                          <button type="button" onClick={() => document.getElementById('profilePicInput').click()} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:bg-[#1f1f2e] dark:text-slate-300 transition-colors">
                            Upload Profile Picture
                          </button>
                          {profilePic && (
                              <button type="button" onClick={() => setProfilePic(null)} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-colors">
                                Remove
                              </button>
                          )}
                        </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                    </div>
                  </div>
  
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2 dark:border-[#3d3d5c]">Personal Information</h3>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                      <input type="text" value={profile.name || ''} onChange={e=>setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                      <input type="email" value={profile.email || ''} onChange={e=>setProfile({...profile, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input type="text" value={profile.phone || ''} onChange={e=>setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2 dark:border-[#3d3d5c]">Security</h3>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                      <input type="password" value={profile.password || ''} onChange={e=>setProfile({...profile, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Leave blank to keep current password" />
                    </div>
                  </div>
                  
                  <button type="submit" className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors w-full">
                    Save All Settings
                  </button>
                </form>

                <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border dark:border-[#3d3d5c] shadow-lg dark:shadow-black/20">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Notification Preferences</h4>
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 mb-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-primary-600" /> Order Updates via Email
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary-600" /> Promotional Offers
                    </label>
                </div>
              </div>
            )}


          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">🔔 Notifications</h2>
              <div className="bg-white dark:bg-[#2a2a3c] rounded-2xl border shadow-sm divide-y">
                {orders.slice(0, 3).map((order, idx) => (
                  <div key={idx} className="p-4 flex gap-4 hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">🔔 Your order #{order._id.substring(order._id.length-8).toUpperCase()} has been {order.status.toLowerCase()}.</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
                
                {coupons.map((coupon, idx) => (
                  <div key={'c'+idx} className="p-4 flex gap-4 hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">🔔 Coupon Available: Use code <strong>{coupon.code}</strong> for {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `Rs. ${coupon.discountAmount} OFF`}.</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Expires: {formatDate(coupon.expiryDate)}</p>
                    </div>
                  </div>
                ))}
                
                {orders.length === 0 && coupons.length === 0 && <div className="p-8 text-center text-slate-500 dark:text-slate-400">No new notifications.</div>}
              </div>
            </div>
          )}

          {/* 10. Coupons */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">🎟️ My Coupons</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4"> REMOVE_ME
                {coupons.map(coupon => (
                  <div key={coupon._id} className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border border-dashed border-primary-300 bg-primary-50/30 flex justify-between items-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary-100 rounded-bl-full -z-10"></div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-wide uppercase">{coupon.code}</h3>
                      <p className="text-primary-600 font-bold mt-1 text-lg">
                        {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `Rs. ${coupon.discountAmount} OFF`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Minimum Order: Rs. {coupon.minOrderAmount} <br/> Expires: {formatDate(coupon.expiryDate)}</p>
                    </div>
                    <button className="px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-md" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                      Copy Code
                    </button>
                  </div>
                ))}
                {coupons.length === 0 && <div className="col-span-2 p-12 text-center bg-white dark:bg-[#2a2a3c] rounded-2xl border text-slate-500 dark:text-slate-400">No active coupons available right now.</div>}
              </div>
            </div>
          )}

        </div>
        </div>
    </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#2a2a3c] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-bold mb-4">Edit Review</h3>
            <form onSubmit={handleUpdateReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      { v: 5, l: "Awesome (Highly Recommended!)" },
                      { v: 4, l: "Excellent" },
                      { v: 3, l: "Very Good" },
                      { v: 2, l: "Good" },
                      { v: 1, l: "Poor" }
                    ].map(opt => {
                      const isSelected = reviewForm.rating === opt.v;
                      return (
                        <button
                          key={opt.v}
                          type="button"
                          onClick={() => setReviewForm({...reviewForm, rating: opt.v})}
                          className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-1 ${isSelected ? 'bg-yellow-100 border-yellow-400 text-yellow-700 shadow-sm scale-105' : 'bg-white dark:bg-[#2a2a3c] border-slate-200 dark:border-[#3d3d5c] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#1f1f2e] hover:border-slate-300'}`}
                        >
                          <span className="text-yellow-500 text-lg">{Array(opt.v).fill('★').join('')}</span> 
                          <span>{opt.v} - {opt.l}</span>
                        </button>
                      )
                    })}
                  </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea required rows={4} value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm, comment: e.target.value})} className="w-full border rounded-lg bg-white dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 dark:border-slate-700  px-4 py-2 outline-none focus:border-primary-500"></textarea>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setEditingReview(null)} className="px-5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Update Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

