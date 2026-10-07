import { useState, useEffect } from 'react';
import axios from 'axios';
import { cachedGet, getCachedDataSync } from '../utils/apiCache';
import { useAuth } from '../context/AuthContext';
import { PackageOpen, Eye, X } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState(() => getCachedDataSync(`${import.meta.env.VITE_BACKEND_URL || (`http://${window.location.hostname}:5000`)}/api/orders`) || null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      if (!user) return;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await cachedGet(`${import.meta.env.VITE_BACKEND_URL || (`http://${window.location.hostname}:5000`)}/api/orders`, config);
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || (`http://${window.location.hostname}:5000`)}/api/orders/${id}/status`, { status }, config);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Orders Management</h2>
      <div className="bg-white dark:bg-[#2a2a3c] rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-[#1f1f2e] text-slate-700 dark:text-slate-300 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders === null ? (
               [...Array(5)].map((_, i) => (
                 <tr key={i} className="animate-pulse hover:bg-slate-50 dark:bg-[#1f1f2e]">
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-24"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-32"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-20"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-16"></div></td>
                   <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-[#3d3d5c] rounded-full w-20"></div></td>
                   <td className="px-6 py-4"><div className="h-8 bg-slate-200 dark:bg-[#3d3d5c] rounded w-24 ml-auto"></div></td>
                 </tr>
               ))
            ) : ((orders || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)).map(order => (
              <tr key={order._id} className="hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">{order.user?.name || 'Guest'}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <select 
                    value={order.status || 'Pending'}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {orders && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  <PackageOpen size={32} className="mx-auto mb-2 text-slate-400" />
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>{orders && orders.length > itemsPerPage && (<div className="flex justify-between items-center mt-4 p-4 border-t"><div className="text-sm text-slate-500">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length} entries</div><div className="flex gap-2"><button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Previous</button>{(() => {
  const total = Math.ceil(orders.length / itemsPerPage);
  const pages = [];
  for(let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(currentPage - i) <= 1) {
      if (pages.length > 0 && pages[pages.length - 1] !== i - 1) pages.push('...');
      pages.push(i);
    }
  }
  return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded ${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}`}>{p}</button>);
})()}<button disabled={currentPage === Math.ceil(orders.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Next</button></div></div>)}</div>{/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2a2a3c] rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white dark:bg-[#2a2a3c]">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Shipping Information</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">Name:</span> {selectedOrder.user?.name || 'Guest'}</p>
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">Address:</span> {selectedOrder.shippingAddress?.address}</p>
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">City:</span> {selectedOrder.shippingAddress?.city}</p>
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">Postal Code:</span> {selectedOrder.shippingAddress?.postalCode}</p>
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">Country:</span> {selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Order Summary</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">Order ID:</span> {selectedOrder._id}</p>
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    <p><span className="font-medium text-slate-800 dark:text-slate-200">Status:</span> <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Items Ordered</h4>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover border" />
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 dark:bg-[#2a2a3c]/50 rounded flex items-center justify-center text-xs text-slate-400 border">No Img</div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
                          {item.variant && <p className="text-xs text-slate-500 dark:text-slate-400">Variant: {item.variant}</p>}
                          <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <div className="text-right">
                  <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Amount</div>
                  <div className="text-3xl font-bold text-primary-600">${selectedOrder.totalPrice?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

