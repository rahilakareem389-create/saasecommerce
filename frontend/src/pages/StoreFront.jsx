import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, X } from 'lucide-react';

export default function StoreFront() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  const initialSort = queryParams.get('sort') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState(initialSort);
  
  const [priceRange, setPriceRange] = useState(1000);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Listen to URL changes to update category and sort
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedCategory(params.get('category') || '');
    setSortOption(params.get('sort') || '');
  }, [location.search]);

  const defaultCategories = [
    { _id: 'pre-order', name: 'PRE ORDER' },
    { _id: 'graphic', name: 'GRAPHIC' },
    { _id: 'tops', name: 'TOPS' },
    { _id: 'dresses', name: 'DRESSES' },
    { _id: 'two-piece-sets', name: 'TWO PIECE SETS' },
    { _id: 'sweaters-cardigans', name: 'SWEATERS & CARDIGANS' },
    { _id: 'outerwear', name: 'OUTERWEAR' },
    { _id: 'bottoms', name: 'BOTTOMS' },
    { _id: 'loungewear-sleepwear', name: 'LOUNGEWEAR & SLEEPWEAR' },
    { _id: 'plus-size', name: 'PLUS SIZE' },
    { _id: 'swimwear', name: 'SWIMWEAR' },
    { _id: 'shoes-bags', name: 'SHOES & BAGS' },
    { _id: 'activewear', name: 'ACTIVEWEAR' }
  ];

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/products`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/categories`).then(r => r.json()).catch(() => [])
    ]).then(([prodData, catData]) => {
      setProducts(prodData);
      setCategories([...defaultCategories, ...(Array.isArray(catData) ? catData : [])]);
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


  const adjectives = ["Elegant", "Casual", "Premium", "Classic", "Modern", "Luxury", "Chic", "Trendy", "Vintage", "Boho"];
  const fashionImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80",
    "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",
    "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80",
    "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=400&q=80",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
    "https://images.unsplash.com/photo-1550639524-a6f58345a278?w=400&q=80",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80",
    "https://images.unsplash.com/photo-1434389678369-130a08e647c0?w=400&q=80",
    "https://images.unsplash.com/photo-1485230895905-ef4a5c54e7d8?w=400&q=80"
  ];

  const generateDummyProducts = () => {
    let prods = [];
    defaultCategories.forEach((catObj, catIdx) => {
      for (let i = 0; i < 10; i++) { // 10 products per category as requested
        const randomImg = fashionImages[(catIdx * 10 + i) % fashionImages.length];
        prods.push({
          _id: `d_${catIdx}_${i}`,
          title: `${adjectives[i % adjectives.length]} ${catObj.name} Item ${i+1}`,
          price: (Math.floor(Math.random() * 150) + 20) - 0.01,
          category: { _id: catObj._id, name: catObj.name }, 
          imageUrl: randomImg
        });
      }
    });
    return prods;
  };

  const dummyProducts = generateDummyProducts();
  const displayProducts = [...products, ...dummyProducts];

  const filteredProducts = displayProducts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? (p.category?._id === selectedCategory || p.category?.name?.toLowerCase() === selectedCategory.toLowerCase() || p.category === selectedCategory) : true;
    const matchPrice = p.price <= priceRange;
    return matchSearch && matchCategory && matchPrice;
  }).sort((a, b) => {
    if (sortOption === 'newest') return (b._id > a._id) ? 1 : -1;
    if (sortOption === 'bestselling') return (b.price - a.price); // Dummy logic: sort by higher price for best selling
    if (sortOption === 'sale') return (a.price - b.price); // Dummy logic: sort by lower price for sale
    return 0; // Default or 'all'
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange]);

  // Pagination calculation
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading products...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8 bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Products Catalog</h1>
            <p className="text-slate-600 text-sm">Browse our real-time updated catalog.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Price Range Dropdown / Slider */}
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white w-full sm:w-auto">
              <span className="text-sm text-slate-500 whitespace-nowrap">Up to ${priceRange}</span>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange} 
                onChange={e => setPriceRange(Number(e.target.value))}
                className="accent-primary-600 w-24" 
              />
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentProducts.map(product => (
            <div key={product._id} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col border">
              <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </Link>
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">SOLD OUT</div>
                )}
                
                {/* Hover Actions (Up to Down Animation at the bottom) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 opacity-0 -translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none z-10">
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 hover:text-primary-600 hover:bg-white shadow-md transition-all pointer-events-auto group/btn relative"
                  >
                    <Heart size={20} className={isInWishlist(product._id) ? "fill-primary-600 text-primary-600" : ""} />
                    {/* Tooltip */}
                    <span className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">Heart</span>
                  </button>
                  <button 
                    onClick={() => setQuickViewProduct(product)}
                    className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 hover:text-primary-600 hover:bg-white shadow-md transition-all pointer-events-auto group/btn relative"
                  >
                    <ShoppingBag size={20} />
                    {/* Tooltip */}
                    <span className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Quick View</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/product/${product._id}`} className="font-medium text-sm text-slate-800 mb-1 hover:text-primary-600 line-clamp-2 leading-snug">{product.title}</Link>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="font-bold text-base text-primary-600">${product.price}</span>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-3 h-3 border rounded-full inline-block"></span>
                    {Math.floor(Math.random() * 200) + 50}
                  </div>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg bg-white text-slate-600 hover:bg-slate-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNumber => {
                  if (totalPages <= 3) return true;
                  if (currentPage === 1) return pageNumber <= 3;
                  if (currentPage === totalPages) return pageNumber >= totalPages - 2;
                  return pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1;
                })
                .map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold transition-colors ${
                      currentPage === pageNumber 
                        ? 'bg-primary-600 border-primary-600 text-white shadow-sm' 
                        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg bg-white text-slate-600 hover:bg-slate-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] bg-slate-100">
              {quickViewProduct.imageUrl ? (
                <img src={quickViewProduct.imageUrl} alt={quickViewProduct.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
            </div>
            
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{quickViewProduct.title}</h2>
              <div className="text-2xl font-bold text-primary-600 mb-6">${quickViewProduct.price}</div>
              
              <p className="text-slate-600 mb-8 flex-1 overflow-y-auto pr-2">{quickViewProduct.description}</p>
              
              <div className="mt-auto pt-6 border-t flex items-center gap-4">
                <button 
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className="w-12 h-12 flex items-center justify-center border-2 border-slate-200 rounded-xl text-slate-500 hover:text-primary-600 hover:border-primary-600 transition-colors"
                >
                  <Heart size={24} className={isInWishlist(quickViewProduct._id) ? "fill-primary-600 text-primary-600" : ""} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
