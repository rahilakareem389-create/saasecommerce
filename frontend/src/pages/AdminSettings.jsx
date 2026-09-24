import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Store, CreditCard, Truck, Receipt, DollarSign, 
  Bell, User, Globe, Shield, Save, LogOut 
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('store');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // For Admin Profile tab
  const [adminProfile, setAdminProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/settings`, config);
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/settings`, settings, config);
      alert('Settings saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, adminProfile, config);
      alert('Admin Profile updated successfully!');
      setAdminProfile({ ...adminProfile, password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading || !settings) return <div className="text-center py-20 text-slate-500">Loading Settings...</div>;

  const tabs = [
    { id: 'store', label: 'Store', icon: Store },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'tax', label: 'Tax', icon: Receipt },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-1">
        <h2 className="text-xl font-bold text-slate-800 mb-6 px-3">Settings</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <tab.icon size={18} className={activeTab === tab.id ? 'text-primary-600' : 'text-slate-400'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1">
        <div className="bg-white rounded-xl border shadow-sm p-6 lg:p-8">
          
          {/* 1. Store Settings */}
          {activeTab === 'store' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Store Settings</h3>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Store Name</label>
                <input type="text" value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Store Email</label>
                <input type="email" value={settings.storeEmail} onChange={e => setSettings({...settings, storeEmail: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <input type="text" value={settings.phoneNumber} onChange={e => setSettings({...settings, phoneNumber: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Store Address</label>
                <textarea rows="3" value={settings.storeAddress} onChange={e => setSettings({...settings, storeAddress: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
              </div>
              
              <div className="pt-4">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* 2. Payment Settings */}
          {activeTab === 'payment' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Payment Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" checked={settings.codEnabled} onChange={e => setSettings({...settings, codEnabled: e.target.checked})} className="w-5 h-5 text-primary-600 rounded" />
                  <div>
                    <p className="font-medium text-slate-900">Cash on Delivery (COD)</p>
                    <p className="text-sm text-slate-500">Allow customers to pay when they receive the order.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" checked={settings.onlinePaymentEnabled} onChange={e => setSettings({...settings, onlinePaymentEnabled: e.target.checked})} className="w-5 h-5 text-primary-600 rounded" />
                  <div>
                    <p className="font-medium text-slate-900">Online Payment</p>
                    <p className="text-sm text-slate-500">Enable credit card and online banking gateways.</p>
                  </div>
                </label>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* 3. Shipping Settings */}
          {activeTab === 'shipping' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Shipping Settings</h3>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Standard Shipping Charges ($)</label>
                <input type="number" min="0" value={settings.shippingCharges} onChange={e => setSettings({...settings, shippingCharges: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div className="pt-4 border-t">
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input type="checkbox" checked={settings.freeShippingEnabled} onChange={e => setSettings({...settings, freeShippingEnabled: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="font-medium text-slate-900">Enable Free Shipping</span>
                </label>
                
                {settings.freeShippingEnabled && (
                  <div className="space-y-1 pl-7">
                    <label className="text-sm font-medium text-slate-700">Free Shipping Minimum Threshold ($)</label>
                    <input type="number" min="0" value={settings.freeShippingThreshold} onChange={e => setSettings({...settings, freeShippingThreshold: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    <p className="text-xs text-slate-500">Orders above this amount will get free shipping.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* 4. Tax Settings */}
          {activeTab === 'tax' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Tax Settings</h3>
              
              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input type="checkbox" checked={settings.taxEnabled} onChange={e => setSettings({...settings, taxEnabled: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                <span className="font-medium text-slate-900">Enable Order Tax</span>
              </label>

              {settings.taxEnabled && (
                <div className="space-y-1 pl-7">
                  <label className="text-sm font-medium text-slate-700">Tax Percentage (%)</label>
                  <input type="number" min="0" max="100" value={settings.taxPercentage} onChange={e => setSettings({...settings, taxPercentage: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              )}

              <div className="pt-4 border-t">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* 5. Currency Settings */}
          {activeTab === 'currency' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Currency Settings</h3>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Store Currency</label>
                <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="USD">USD ($)</option>
                  <option value="PKR">PKR (Rs)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* 6. Notifications */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Notification Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings.notifyNewOrder} onChange={e => setSettings({...settings, notifyNewOrder: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="font-medium text-slate-900">Email me when a new order is placed</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings.notifyLowStock} onChange={e => setSettings({...settings, notifyLowStock: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="font-medium text-slate-900">Email me when product stock is low</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings.notifyNewCustomer} onChange={e => setSettings({...settings, notifyNewCustomer: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="font-medium text-slate-900">Email me when a new customer registers</span>
                </label>
              </div>

              <div className="pt-4 border-t mt-6">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* 7. Website Settings */}
          {activeTab === 'website' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Website Preferences</h3>
              
              <label className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl cursor-pointer">
                <div>
                  <p className="font-bold text-orange-900">Maintenance Mode</p>
                  <p className="text-sm text-orange-700">Disable storefront access for customers.</p>
                </div>
                <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})} className="w-5 h-5 text-orange-600 rounded" />
              </label>

              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input type="checkbox" checked={settings.reviewsEnabled} onChange={e => setSettings({...settings, reviewsEnabled: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                <span className="font-medium text-slate-900">Enable Customer Reviews on Storefront</span>
              </label>

              <div className="space-y-1 mt-6">
                <label className="text-sm font-medium text-slate-700">Products Per Page</label>
                <input type="number" min="4" max="100" value={settings.productsPerPage} onChange={e => setSettings({...settings, productsPerPage: Number(e.target.value)})} className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div className="pt-4 border-t mt-6">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* 8. Admin Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Admin Profile</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold">
                  {adminProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{user?.name}</h4>
                  <p className="text-slate-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Admin Name</label>
                <input type="text" value={adminProfile.name} onChange={e => setAdminProfile({...adminProfile, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" value={adminProfile.email} onChange={e => setAdminProfile({...adminProfile, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={saving} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  {saving ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          )}

          {/* 9. Security */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Security Settings</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Change Password</h4>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <input type="password" value={adminProfile.password} onChange={e => setAdminProfile({...adminProfile, password: e.target.value})} placeholder="Leave blank to keep current" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <button type="submit" disabled={saving} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                    Change Password
                  </button>
                </form>
              </div>

              <div className="pt-8 border-t">
                <h4 className="font-semibold text-red-600 mb-4">Admin Session</h4>
                <p className="text-sm text-slate-500 mb-4">You are currently logged in as {user?.email}. Click below to securely log out of the admin panel.</p>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2.5 rounded-lg font-medium hover:bg-red-100 transition-colors">
                  <LogOut size={18} /> Secure Logout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
