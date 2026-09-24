import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function StoreFront() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(1000);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/products`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/categories`).then(r => r.json())
    ]).then(([prodData, catData]) => {
      setProducts(prodData);
      setCategories(catData);
      setLoading(false);
    }).catch(console.error);

    socket.on('new_product', (product) => {
      setProducts(prev => [product, ...prev]);
    });

    socket.on('update_product', (updatedProduct) => {
      setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    });

    socket.on('delete_product', (productId) => {
      setProducts(prev => prev.filter(p => p._id !== productId));
    });

    return () => {
      socket.off('new_product');
      socket.off('update_product');
      socket.off('delete_product');
    };
  }, []);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? (p.category?._id === selectedCategory || p.category === selectedCategory) : true;
    const matchPrice = p.price <= priceRange;
    return matchSearch && matchCategory && matchPrice;
  });

  if (loading) return <div className="text-center py-20 text-slate-500">Loading products...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Modern Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
          <h2 className="font-bold text-lg text-slate-800 mb-4">Categories</h2>
          <ul className="space-y-3">
            <li>
              <button 
                onClick={() => setSelectedCategory('')}
                className={`${selectedCategory === '' ? 'text-primary-600' : 'text-slate-600'} hover:text-primary-600 font-medium text-sm flex items-center justify-between w-full`}
              >
                All Products
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{products.length}</span>
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat._id}>
                <button 
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`${selectedCategory === cat._id ? 'text-primary-600' : 'text-slate-600'} hover:text-primary-600 font-medium text-sm flex items-center justify-between w-full`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>

          <h2 className="font-bold text-lg text-slate-800 mb-4 mt-8">Price Range</h2>
          <div className="space-y-4">
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={priceRange} 
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full accent-primary-600" 
            />
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>$0</span>
              <span>${priceRange}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8 bg-white p-8 rounded-xl border shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to SaaSCommerce</h1>
            <p className="text-slate-600">Browse our real-time updated catalog.</p>
          </div>
          <div className="mt-4 md:mt-0 relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-64" 
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col">
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </Link>
                {product.stock === 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</div>
                )}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 left-2 p-2 bg-white/80 backdrop-blur rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <Heart size={18} className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""} />
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <Link to={`/product/${product._id}`} className="font-semibold text-lg text-slate-900 mb-1 hover:text-primary-600">{product.title}</Link>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-xl text-primary-600">${product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border text-slate-500">
              <div className="text-4xl mb-4">🛒</div>
              <h2 className="text-xl font-semibold mb-2 text-slate-700">No products found</h2>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
