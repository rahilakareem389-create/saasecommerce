import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Users, Activity, MessageSquare, Sliders, Tags } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // If not logged in, or not an admin, redirect to login
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Activity },
    { name: 'Sales', path: '/admin/sales', icon: Activity },
    { name: 'Inventory', path: '/admin/inventory', icon: Package },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            Admin Panel
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary-50 text-primary-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-primary-600" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            Back to Store
          </Link>
          <button onClick={handleLogout} className="flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
            <LogOut size={18} className="text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center px-8 sticky top-0 z-10 justify-between">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {location.pathname.split('/').pop() === 'admin' ? 'Dashboard Overview' : location.pathname.split('/').pop()}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
