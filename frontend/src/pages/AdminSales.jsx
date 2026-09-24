import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, Activity, ShoppingBag, Package, Tag, TrendingUp } from 'lucide-react';

export default function AdminSales() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSalesData();
    
    // Real-Time Features
    import('../socket').then(({ socket }) => {
      socket.on('new_order', fetchSalesData);
    });

    return () => {
      import('../socket').then(({ socket }) => {
        socket.off('new_order', fetchSalesData);
      });
    };
  }, []);

  const fetchSalesData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/sales`, config);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <div className="text-center py-20 text-slate-500">Loading Sales Data...</div>;

  const { overview, chartData, categoryChartData, topProducts } = data;

  const statCards = [
    { title: 'Total Sales', value: `$${overview.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: "Today's Sales", value: `$${overview.todaysSales.toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'This Week', value: `$${overview.weeklySales.toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'This Month', value: `$${overview.monthlySales.toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Number of Orders', value: overview.totalSales, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Products Sold', value: overview.productsSold, icon: Package, color: 'text-primary-600', bg: 'bg-primary-100' },
    { title: 'Discount Given', value: `$${overview.discountGiven.toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: Tag, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Coupons Used', value: overview.couponCount, icon: Tag, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Sales Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl border shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Daily Sales Trend (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sales" name="Sales ($)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Pie */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Category-wise Sales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Top-Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Product Name</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold text-right">Units Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map(product => (
                <tr key={product._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <img src={product.imageUrl} alt={product.title} className="w-10 h-10 rounded object-cover border" />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{product.title}</td>
                  <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">
                      {product.totalSold}
                    </span>
                  </td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-slate-500">No sales data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
