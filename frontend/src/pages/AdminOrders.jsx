import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PackageOpen, Eye, X } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      if (!user) return;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://saasecommerce.vercel.app/api/orders', config);
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
      await axios.put(`https://saasecommerce.vercel.app/api/orders/${id}/status`, { status }, config);
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
      <h2 className="text-xl font-bold text-slate-800">Orders Management</h2>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b">
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
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{order.user?.name || 'Guest'}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
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
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  <PackageOpen size={32} className="mx-auto mb-2 text-slate-400" />
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-xl text-slate-800">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-700 mb-2">Shipping Information</h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-800">Name:</span> {selectedOrder.user?.name || 'Guest'}</p>
                    <p><span className="font-medium text-slate-800">Address:</span> {selectedOrder.shippingAddress?.address}</p>
                    <p><span className="font-medium text-slate-800">City:</span> {selectedOrder.shippingAddress?.city}</p>
                    <p><span className="font-medium text-slate-800">Postal Code:</span> {selectedOrder.shippingAddress?.postalCode}</p>
                    <p><span className="font-medium text-slate-800">Country:</span> {selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 mb-2">Order Summary</h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-800">Order ID:</span> {selectedOrder._id}</p>
                    <p><span className="font-medium text-slate-800">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p><span className="font-medium text-slate-800">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    <p><span className="font-medium text-slate-800">Status:</span> <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-700 mb-4">Items Ordered</h4>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover border" />
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400 border">No Img</div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          {item.variant && <p className="text-xs text-slate-500">Variant: {item.variant}</p>}
                          <p className="text-sm text-slate-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <div className="font-bold text-slate-800">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <div className="text-right">
                  <div className="text-slate-500 text-sm mb-1">Total Amount</div>
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
