import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User as UserIcon, LogOut, Heart, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function StoreLayout() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || false
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-900', 'text-slate-100');
      document.body.classList.remove('bg-white', 'text-slate-900');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-white', 'text-slate-900');
      document.body.classList.remove('bg-slate-900', 'text-slate-100');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-10 transition-colors`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-500 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            SaaSCommerce
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-primary-500 transition-colors">Products</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? 'bg-slate-700 text-primary-400 hover:bg-slate-600' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}>Admin Area</Link>
            )}
          </nav>
          <div className="flex items-center gap-4">
            
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`} title="Toggle Theme">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/wishlist" className="relative p-2 hover:text-red-500 transition-colors" title="Wishlist">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="relative p-2 hover:text-primary-500 transition-colors">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary-600 text-white text-[10px] flex items-center justify-center rounded-full">
                  {cart.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/user-dashboard" className="text-sm font-medium flex items-center gap-1 hover:text-primary-500 transition-colors">
                  <UserIcon size={16} />
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t py-8 text-center text-sm transition-colors`}>
        <p className="opacity-70">&copy; {new Date().getFullYear()} SaaSCommerce. All rights reserved.</p>
      </footer>
    </div>
  );
}
