import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, HeartOff } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <HeartOff size={48} className="mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl text-slate-600 mb-4">Your wishlist is empty</h2>
          <Link to="/" className="text-primary-600 font-medium hover:underline">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all flex flex-col relative group">
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </Link>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <Link to={`/product/${product._id}`} className="font-semibold text-lg text-slate-900 mb-1 hover:text-primary-600">{product.title}</Link>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-xl text-primary-600">${product.price}</span>
                  <button 
                    onClick={() => {
                      addToCart(product);
                      toggleWishlist(product);
                    }}
                    className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1"
                  >
                    <ShoppingCart size={16} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
