import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  DollarSign, ShoppingCart, Package, Users, Activity, 
  CheckCircle, XCircle, AlertTriangle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("Not logged in");
      return;
    }
    
    const fetchDashboard = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/dashboard`, config);
        setData(response.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Session expired or unauthorized. Please log out and log in again.");
        } else {
          setError("Error loading dashboard data.");
        }
      }
    };
    
    fetchDashboard();

    // Real-Time Features
    import('../socket').then(({ socket }) => {
      socket.on('kpi_update', fetchDashboard);
      socket.on('new_order', fetchDashboard);
      socket.on('new_product', fetchDashboard);
      socket.on('update_product', fetchDashboard);
      socket.on('delete_product', fetchDashboard);
    });

    return () => {
      import('../socket').then(({ socket }) => {
        socket.off('kpi_update', fetchDashboard);
        socket.off('new_order', fetchDashboard);
        socket.off('new_product', fetchDashboard);
        socket.off('update_product', fetchDashboard);
        socket.off('delete_product', fetchDashboard);
      });
    };
  }, [user]);

  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
  if (!data) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;

  const { kpis, charts, lists } = data;

  const statCards = [
    { title: 'Total Revenue', value: `$${kpis.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Sales (Items)', value: kpis.totalSales || 0, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Total Orders', value: kpis.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Customers', value: kpis.totalCustomers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Products', value: kpis.totalProducts || 0, icon: Package, color: 'text-primary-600', bg: 'bg-primary-100' },
    { title: 'Pending Orders', value: kpis.pendingOrders || 0, icon: ShoppingCart, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Completed Orders', value: kpis.completedOrders || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Cancelled Orders', value: kpis.cancelledOrders || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Low Stock Products', value: kpis.lowStockProducts || 0, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border p-6 flex items-center shadow-sm">
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Sales Chart */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Sales & Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={10} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Overview & Category Sales */}
        <div className="bg-white rounded-xl border shadow-sm p-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Orders Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.ordersOverviewData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {charts.ordersOverviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Category Sales</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.categoryChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {charts.categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top-Selling Products</h3>
          <div className="space-y-4">
            {lists.topProducts.map(product => (
              <div key={product._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-4">
                  <img src={product.imageUrl} alt={product.title} className="w-12 h-12 rounded object-cover border" />
                  <div>
                    <h4 className="font-medium text-slate-800">{product.title}</h4>
                    <p className="text-sm text-slate-500">${product.price} • {product.stock} in stock</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
                    {product.totalSold} Sold
                  </span>
                </div>
              </div>
            ))}
            {lists.topProducts.length === 0 && <p className="text-slate-500">No sales data yet.</p>}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {lists.recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <h4 className="font-medium text-slate-800">{order.user?.name || 'Guest'}</h4>
                  <p className="text-sm text-slate-500 text-xs font-mono">{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${order.totalPrice?.toFixed(2)}</p>
                  <span className={`text-xs font-medium ${order.status === 'Pending' ? 'text-yellow-600' : order.status === 'Delivered' ? 'text-green-600' : 'text-slate-500'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {lists.recentOrders.length === 0 && <p className="text-slate-500">No recent orders.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
