import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Ticket, CheckCircle, XCircle } from 'lucide-react';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const { user } = useAuth();
  
  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountAmount, setDiscountAmount] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchCoupons = async () => {
    try {
      if (!user) return;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/coupons', config);
      setCoupons(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const couponData = { 
        code: code.toUpperCase(),
        discountType,
        discountAmount: Number(discountAmount),
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiryDate,
        isActive
      };

      if (editId) {
        await axios.put(`http://localhost:5000/api/coupons/${editId}`, couponData, config);
      } else {
        await axios.post('http://localhost:5000/api/coupons', couponData, config);
      }
      
      fetchCoupons();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/coupons/${id}`, config);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting coupon');
    }
  };

  const toggleActive = async (coupon) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/coupons/${coupon._id}`, { isActive: !coupon.isActive }, config);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating coupon');
    }
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountAmount(c.discountAmount);
    setMaxDiscountAmount(c.maxDiscountAmount || '');
    setMinOrderAmount(c.minOrderAmount || '');
    setUsageLimit(c.usageLimit || '');
    setExpiryDate(new Date(c.expiryDate).toISOString().split('T')[0]);
    setIsActive(c.isActive);
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditId(null);
    setCode(''); setDiscountType('percentage'); setDiscountAmount('');
    setMaxDiscountAmount(''); setMinOrderAmount(''); setUsageLimit(''); setExpiryDate(''); setIsActive(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Coupon Management</h2>
        <button 
          onClick={() => {
            if (isAdding) {
              resetForm();
            } else {
              resetForm();
              setIsAdding(true);
            }
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus size={18} /> Add Coupon</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4">{editId ? 'Edit Coupon' : 'Create New Discount Coupon'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Coupon Code</label>
                <input required type="text" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} className="w-full px-3 py-2 border rounded-md uppercase" placeholder="e.g. SUMMER50" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Discount Type</label>
                <select value={discountType} onChange={e=>setDiscountType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Discount Amount</label>
                <input required type="number" min="1" step="0.01" value={discountAmount} onChange={e=>setDiscountAmount(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              {discountType === 'percentage' && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Max Discount Amount ($) - Optional</label>
                  <input type="number" min="1" step="0.01" value={maxDiscountAmount} onChange={e=>setMaxDiscountAmount(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 50" />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Minimum Order Amount ($) - Optional</label>
                <input type="number" min="0" step="0.01" value={minOrderAmount} onChange={e=>setMinOrderAmount(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 100" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Usage Limit - Optional</label>
                <input type="number" min="1" value={usageLimit} onChange={e=>setUsageLimit(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 50 (Total times it can be used)" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                <input required type="date" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="space-y-1 md:col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" id="isActive" checked={isActive} onChange={e=>setIsActive(e.target.checked)} className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4" />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Coupon is Active</label>
              </div>
            </div>
            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              {editId ? 'Update Coupon' : 'Save Coupon'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Code</th>
              <th className="px-6 py-4 font-semibold">Discount</th>
              <th className="px-6 py-4 font-semibold">Min Order</th>
              <th className="px-6 py-4 font-semibold">Usage</th>
              <th className="px-6 py-4 font-semibold">Expiry</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map(coupon => {
              const isExpired = new Date() > new Date(coupon.expiryDate);
              return (
                <tr key={coupon._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                    <Ticket size={16} className="text-primary-600" />
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `$${coupon.discountAmount}`}
                  </td>
                  <td className="px-6 py-4">{coupon.minOrderAmount > 0 ? `$${coupon.minOrderAmount}` : 'None'}</td>
                  <td className="px-6 py-4">
                    {coupon.usedCount} / {coupon.usageLimit || '∞'}
                  </td>
                  <td className={`px-6 py-4 ${isExpired ? 'text-red-500 font-medium' : ''}`}>
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleActive(coupon)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${coupon.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                      title="Click to toggle status"
                    >
                      {coupon.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(coupon)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(coupon._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  <Ticket size={32} className="mx-auto mb-2 text-slate-400" />
                  No discount coupons created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
