import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { cachedGet, getCachedDataSync } from '../utils/apiCache';
import { useAuth } from '../context/AuthContext';
import { Eye, Edit2, Trash2, Ban, CheckCircle, X } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(() => getCachedDataSync(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/customers`) || null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCustomers();
    
    // Real-Time Features
    import('../socket').then(({ socket }) => {
      socket.on('new_order', () => {
        if (!selectedCustomer) fetchCustomers();
      });
    });

    return () => {
      import('../socket').then(({ socket }) => {
        socket.off('new_order');
      });
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await cachedGet(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/customers`, config);
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await cachedGet(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/customers/${id}`, config);
      setSelectedCustomer(data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/customers/${id}/status`, {}, config);
      fetchCustomers();
      if (selectedCustomer && selectedCustomer._id === id) {
        fetchCustomerDetails(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!(await Swal.fire({title: 'Are you sure?', text: 'Are you sure you want to delete this customer? This action cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes'})).isConfirmed) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/customers/${id}`, config);
      fetchCustomers();
      if (selectedCustomer && selectedCustomer._id === id) {
        setSelectedCustomer(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Customers Management</h2>
      </div>

      <div className="bg-white dark:bg-[#2a2a3c] rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-[#1f1f2e] text-slate-700 dark:text-slate-300 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Orders</th>
              <th className="px-6 py-4 font-semibold">Total Spent</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers === null ? (
               [...Array(5)].map((_, i) => (
                 <tr key={i} className="animate-pulse hover:bg-slate-50 dark:bg-[#1f1f2e]">
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-32"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-40"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-12"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-20"></div></td>
                   <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-[#3d3d5c] rounded-full w-16"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-24"></div></td>
                   <td className="px-6 py-4"><div className="h-8 bg-slate-200 dark:bg-[#3d3d5c] rounded w-24 ml-auto"></div></td>
                 </tr>
               ))
            ) : ((customers || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)).map(customer => (
              <tr key={customer._id} className="hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">{customer.name}</td>
                <td className="px-6 py-4 text-blue-600 hover:underline">
                  <a href={`mailto:${customer.email}`}>{customer.email}</a>
                </td>
                <td className="px-6 py-4">{customer.totalOrders || 0}</td>
                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">${(customer.totalSpent || 0).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {customer.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(customer.createdAt)}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => fetchCustomerDetails(customer._id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Details">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => toggleStatus(customer._id)} className={`p-2 rounded-lg transition-colors ${customer.status === 'Blocked' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`} title={customer.status === 'Blocked' ? 'Unblock' : 'Block'}>
                    {customer.status === 'Blocked' ? <CheckCircle size={18} /> : <Ban size={18} />}
                  </button>
                  <button onClick={() => handleDelete(customer._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Customer">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>{customers && customers.length === 0 && <div className="text-center py-8 text-slate-500 dark:text-slate-400">No customers found.</div>}{customers && customers.length > itemsPerPage && (<div className="flex justify-between items-center mt-4 p-4 border-t"><div className="text-sm text-slate-500">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, customers.length)} of {customers.length} entries</div><div className="flex gap-2"><button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Previous</button>{(() => {
  const total = Math.ceil(customers.length / itemsPerPage);
  const pages = [];
  for(let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(currentPage - i) <= 1) {
      if (pages.length > 0 && pages[pages.length - 1] !== i - 1) pages.push('...');
      pages.push(i);
    }
  }
  return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded ${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}`}>{p}</button>);
})()}<button disabled={currentPage === Math.ceil(customers.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Next</button></div></div>)}</div>{/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#2a2a3c] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 dark:bg-[#1f1f2e]">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Customer Details</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div className="bg-slate-50 dark:bg-[#1f1f2e] p-5 rounded-xl border border-slate-100 dark:border-[#3d3d5c]">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2">Customer Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Name:</span> <span className="font-medium text-slate-900 dark:text-slate-50">{selectedCustomer.name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Email:</span> <span className="font-medium text-slate-900 dark:text-slate-50">{selectedCustomer.email}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Phone:</span> <span className="font-medium text-slate-900 dark:text-slate-50">{selectedCustomer.phone || 'N/A'}</span></div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Address:</span> 
                      <span className="font-medium text-slate-900 dark:text-slate-50 text-right">
                        {selectedCustomer.address ? 
                          `${selectedCustomer.address.street || ''}, ${selectedCustomer.address.city || ''}, ${selectedCustomer.address.country || ''}`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Account Status:</span> 
                      <span className={`px-2 py-1 rounded text-xs font-bold ${selectedCustomer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedCustomer.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="bg-slate-50 dark:bg-[#1f1f2e] p-5 rounded-xl border border-slate-100 dark:border-[#3d3d5c]">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2">Order Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Total Orders:</span> <span className="font-bold text-slate-900 dark:text-slate-50">{selectedCustomer.totalOrders}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Pending Orders:</span> <span className="font-medium text-yellow-600">{selectedCustomer.pendingOrders}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Completed Orders:</span> <span className="font-medium text-green-600">{selectedCustomer.completedOrders}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Cancelled Orders:</span> <span className="font-medium text-red-600">{selectedCustomer.cancelledOrders}</span></div>
                    <div className="flex justify-between pt-2 border-t"><span className="text-slate-500 dark:text-slate-400 font-medium">Total Spending:</span> <span className="font-bold text-lg text-primary-600">${(selectedCustomer.totalSpent || 0).toFixed(2)}</span></div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Recent Orders</h4>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-[#1f1f2e] text-slate-700 dark:text-slate-300 border-b">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Order ID</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Products</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCustomer.ordersList?.map(order => (
                        <tr key={order._id} className="hover:bg-slate-50 dark:bg-[#1f1f2e]">
                          <td className="px-4 py-3 font-mono text-xs">{order._id.substring(order._id.length - 8)}</td>
                          <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                          <td className="px-4 py-3">
                            <div className="max-w-[200px] truncate" title={order.orderItems.map(item => item.name).join(', ')}>
                              {order.orderItems.length} items
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">${order.totalPrice.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${order.status === 'Pending' ? 'text-yellow-600' : order.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!selectedCustomer.ordersList?.length && (
                        <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">No orders found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t bg-slate-50 dark:bg-[#1f1f2e] flex justify-end">
              <button onClick={() => setSelectedCustomer(null)} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

