import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User as UserIcon, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function StoreLayout() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            SaaSCommerce
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors">Admin Area</Link>
            )}
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative p-2 text-slate-600 hover:text-red-500 transition-colors" title="Wishlist">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary-600 text-white text-[10px] flex items-center justify-center rounded-full">
                  {cart.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/user-dashboard" className="text-sm font-medium text-slate-700 flex items-center gap-1 hover:text-primary-600 transition-colors">
                  <UserIcon size={16} />
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} SaaSCommerce. All rights reserved.</p>
      </footer>
    </div>
  );
}
