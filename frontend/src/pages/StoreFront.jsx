import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, X } from 'lucide-react';
import { realisticProducts } from '../utils/productsData';

export default function StoreFront() {
  const [products, setProducts] = useState(realisticProducts);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
    const [quickQty, setQuickQty] = useState(1);
  const [quickColor, setQuickColor] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  const initialSearch = queryParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
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
    { _id: "dresses", name: "DRESSES", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80" },
    { _id: "outerwear", name: "OUTERWEAR", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80" },
    { _id: "accessories", name: "ACCESSORIES", img: "https://images.unsplash.com/photo-1599643478524-fb66f7240078?w=200&q=80" },
    { _id: "shoes", name: "SHOES", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80" },
    { _id: "tops", name: "TOPS", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80" }
  ];

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/products`, { cache: 'no-store' }).then(r => r.json()).catch(() => []), 
      fetch(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/categories`, { cache: 'no-store' }).then(r => r.json()).catch(() => [])
    ]).then(([prodData, catData]) => { 
      if (!prodData || prodData.length === 0) { 
        prodData = generateDummyProducts(); 
      } 
      setProducts(prodData); 
      setCategories(catData); 
      setLoading(false); 
    }).catch((err) => { 
      console.error(err); 
      setProducts(generateDummyProducts()); 
      setLoading(false); 
    });

    import('../socket').then(({ socket }) => {
      socket.on('new_product', (product) => {
        setProducts(prev => [product, ...prev]);
      });

      socket.on('update_product', (updatedProduct) => {
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      });

      socket.on('delete_product', (productId) => {
        setProducts(prev => prev.filter(p => p._id !== productId));
      });
    });

    return () => {
      import('../socket').then(({ socket }) => {
        socket.off('new_product');
        socket.off('update_product');
        socket.off('delete_product');
      });
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

  function generateDummyProducts() {
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
  const displayProducts = products;

  const filteredProducts = displayProducts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory 
        ? (
            p.category?._id === selectedCategory || 
            p.subCategory?._id === selectedCategory ||
            p.category?.name?.toLowerCase().replace(/[-_\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\s]+/g, '') || 
            p.subCategory?.name?.toLowerCase().replace(/[-_\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\s]+/g, '') || 
            (typeof p.category === 'string' && p.category.toLowerCase().replace(/[-_\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\s]+/g, '')) ||
            (typeof p.subCategory === 'string' && p.subCategory.toLowerCase().replace(/[-_\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\s]+/g, ''))
          ) 
        : true;
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

  // Update states if URL query params change while already on the page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
    setSelectedCategory(params.get('category') || '');
  }, [location.search]);

  // Pagination calculation
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Loading products...</div>;

  return (
    <div className="flex flex-col gap-8 w-full px-2 md:px-4 py-8">
      
      {/* Featured Products */}
      {filteredProducts.length > 0 && <div className="mb-8 bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-30"></div>
         <h2 className="text-3xl font-black mb-2 relative z-10"><i className="fas fa-star text-yellow-400"></i> Featured Collection</h2>
         <p className="text-slate-400 mb-8 max-w-lg relative z-10">Discover our most premium quality items crafted with excellence. Perfect for every occasion.</p>
         
         <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x relative z-10">
           {filteredProducts.slice(0, 8).map(fp => (
              <div key={'f'+fp._id} className="min-w-[240px] max-w-[240px] bg-white dark:bg-[#2a2a3c]/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 snap-start hover:-translate-y-2 transition-transform">
                 <div className="aspect-square bg-slate-800 rounded-xl mb-4 overflow-hidden">
                   <img src={fp.imageUrl} className="w-full h-full object-cover" />
                 </div>
                 <h3 className="font-bold text-white line-clamp-1 mb-1">{fp.title}</h3>
                 <p className="text-primary-400 font-black mb-3">Rs. {fp.price}</p>
                 <Link to={`/product/${fp._id}`} className="block text-center w-full py-2 bg-white dark:bg-[#2a2a3c] text-slate-900 dark:text-slate-50 font-bold rounded-lg hover:bg-primary-50 transition-colors">Add to Cart</Link>
              </div>
           ))}
         </div>
      </div>}

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8 bg-white dark:bg-[#2a2a3c] p-6 rounded-xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">Products Catalog</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Browse our real-time updated catalog.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Price Range Dropdown / Slider */}
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white dark:bg-[#2a2a3c] w-full sm:w-auto">
              <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Up to ${priceRange}</span>
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
            <div key={product._id} className="bg-white dark:bg-[#2a2a3c] rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col border">
              <div className="aspect-[3/4] bg-slate-100 dark:bg-[#2a2a3c]/50 relative overflow-hidden">
                  <Link to={`/product/${product._id}`} className="absolute inset-0 z-0">
                  </Link>
                  <div className="w-full h-full pointer-events-none">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                    )}
                  </div>
                  {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">SOLD OUT</div>
                )}
                
                {/* Hover Actions (Up to Down Animation at the bottom) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 opacity-0 -translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none z-10">
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="w-10 h-10 bg-white dark:bg-[#2a2a3c]/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary-600 hover:bg-white dark:bg-[#2a2a3c] shadow-md transition-all pointer-events-auto group/btn relative"
                  >
                    <Heart size={20} className={isInWishlist(product._id) ? "fill-primary-600 text-primary-600" : ""} />
                    {/* Tooltip */}
                    <span className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">Heart</span>
                  </button>
                  <Link 
                        to={`/product/${product._id}`}
                        className="w-10 h-10 bg-white dark:bg-[#2a2a3c]/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary-600 hover:bg-white dark:bg-[#2a2a3c] shadow-md transition-all pointer-events-auto group/btn relative"
                      >
                        <ShoppingBag size={20} />
                        {/* Tooltip */}
                        <span className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Add to Cart</span>
                      </Link>
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                  <Link to={`/product/${product._id}`} className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1 hover:text-primary-600 line-clamp-2 leading-snug">{product.title}</Link>
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
            <div className="col-span-full text-center py-20 bg-white dark:bg-[#2a2a3c] rounded-xl border text-slate-500 dark:text-slate-400">
              <div className="text-4xl mb-4">🛒</div>
              <h2 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">No products found</h2>
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
              className="px-4 py-2 border rounded-lg bg-white dark:bg-[#2a2a3c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#1f1f2e] hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
                        : 'bg-white dark:bg-[#2a2a3c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#1f1f2e] hover:text-primary-600'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-[#2a2a3c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#1f1f2e] hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>

      
    </div>
  );
}































