import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User as UserIcon, LogOut, Heart, Moon, Sun, ChevronDown, Search, X, Globe, MessageCircle, MapPin, Phone, Mail, Truck, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function StoreLayout() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || false
  );

  const promos = [
    { icon: <Truck size={14} className="text-primary-500" />, text: "Free Shipping on Orders Over $50!" },
    { icon: <Flame size={14} className="text-red-500" />, text: "Special Offers Are Here! Get Up to 30% Off — Shop Now" },
    { icon: <Sparkles size={14} className="text-amber-500" />, text: "Discover New Arrivals — Shop the Latest Trends Today!" }
  ];
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
    fetch(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/categories`)
      .then(r => r.json())
      .then(data => setCategories([...defaultCategories, ...(Array.isArray(data) ? data : [])]))
      .catch(err => {
        console.error(err);
        setCategories(defaultCategories);
      });
  }, []);

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
      <header className={`sticky top-0 z-50 flex flex-col transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        {/* Top Promo Bar */}
        <div className="bg-primary-100 text-slate-800 text-xs py-2 px-4 flex justify-between items-center text-center overflow-hidden h-9">
          <div className="flex-1 flex items-center justify-center w-full">
            <div 
              key={promoIndex} 
              className="font-medium animate-[slideUpBounce_0.4s_ease-out_forwards] flex items-center justify-center gap-2"
            >
              {promos[promoIndex].icon}
              <span>{promos[promoIndex].text}</span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-700 z-10"><X size={14} /></button>
        </div>

        {/* Middle Header Area */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end items-center text-[10px] text-slate-500 mb-2 gap-4">
            <div>Wholesale warehouse total: <span className="text-primary-500 font-bold">9,395</span> items</div>
            <div className="font-bold flex items-center gap-1 cursor-pointer hover:text-primary-600"><Globe size={12}/> DROPSHIPPING</div>
          </div>
          
          <div className="flex justify-between items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex flex-col">
              <img src="/logo-transparent.png" alt="SaaSCommerce" className={`h-16 md:h-20 object-contain transition-all ${isDarkMode ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : ""}`} />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex relative border-2 border-primary-200 rounded-md overflow-hidden focus-within:border-primary-400 transition-colors">
              <input type="text" placeholder="Search products..." className="w-full px-4 py-2 outline-none bg-transparent" />
              <button className="bg-primary-400 text-white px-6 hover:bg-primary-500 transition-colors flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/user-dashboard" className="text-sm font-bold text-slate-700 hover:text-primary-600 flex items-center gap-1">
                    <UserIcon size={16} /> {user.name}
                  </Link>
                  <button onClick={handleLogout} className="hover:text-red-500 transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-primary-600">SIGN IN / REGISTER</Link>
              )}
              
              <div className="flex items-center gap-4 text-slate-600">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="hover:text-primary-600 transition-colors">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                <Link to="/wishlist" className="hover:text-primary-600 transition-colors">
                  <Heart size={20} />
                </Link>
                
                <Link to="/cart" className="relative hover:text-primary-600 transition-colors flex items-center gap-1">
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {cart.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Area */}
        <div className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className={`container mx-auto px-4 flex items-center gap-6 text-sm font-semibold flex-wrap relative ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            <Link to="/" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors whitespace-nowrap">HOME</Link>
            {/* Mega Menu Dropdown */}
            <div className="group">
              <button className="flex items-center gap-1 py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors">
                CATEGORIES <ChevronDown size={16} />
              </button>
              
              <div className={`absolute top-full left-0 w-[600px] shadow-xl border hidden group-hover:flex ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  {/* Sidebar */}
                  <div className={`w-1/3 border-r py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <Link to="/products" className="block px-4 text-xs font-bold text-primary-600 mb-2 hover:underline cursor-pointer">ALL CATEGORIES</Link>
                    <ul className="max-h-[400px] overflow-y-auto">
                      {categories.map(cat => (
                        <li key={cat._id}>
                          <Link 
                            to={`/products?category=${cat._id}`}
                            className={`block px-4 py-2 text-sm hover:text-primary-600 transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-primary-50'}`}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                      {categories.length === 0 && (
                        <li className="px-4 py-2 text-slate-400 text-sm">No categories found</li>
                      )}
                    </ul>
                  </div>
                  {/* Right Content */}
                  <div className={`w-2/3 p-6 flex flex-col justify-center items-center text-center ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                     <ShoppingBag size={48} className="text-primary-200 mb-4" />
                     <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Explore Our Collections</h3>
                     <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Find the best deals on top quality wholesale products across all categories.</p>
                     <Link to="/products" className="bg-primary-600 text-white px-6 py-2 rounded font-bold hover:bg-primary-700 transition-colors">SHOP NOW</Link>
                  </div>
                </div>
            </div>

            {/* NEW IN Dropdown */}
            <div className="group">
              <Link to="/products" className="flex items-center gap-1 py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors whitespace-nowrap">
                NEW IN {'>'}
              </Link>
              
              <div className={`absolute top-full left-0 right-0 mx-auto w-[850px] shadow-xl border hidden group-hover:flex p-6 gap-8 z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                {/* Left Columns (Dates & Categories) */}
                <div className={`flex gap-8 border-r pr-8 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  {/* Dates Column */}
                  <div className="flex flex-col gap-2">
                    <span className={`font-bold text-xs mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>VIEW ALL</span>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">09/27/2026</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">09/26/2026</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">09/25/2026</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">09/24/2026</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">09/23/2026</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">09/22/2026</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">09/21/2026</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">09/20/2026</Link>
                  </div>
                  
                  {/* Shop By Category Column */}
                  <div className="flex flex-col gap-2 w-48">
                    <span className={`font-bold text-xs mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>SHOP BY CATEGORY</span>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">New Tops</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">New Dresses</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">New Bottoms</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">New Plus Size</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">New Outerwear</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">New Two Piece Sets</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">New Sweatshirts & Hoodies</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">New Sweaters & Cardigans</Link>
                  </div>
                </div>

                {/* Right Image Grid */}
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center group/item cursor-pointer">
                    <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                      <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80" alt="Blouses & Shirts" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                    </div>
                    <span className={`text-[11px] font-medium text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Blouses & Shirts</span>
                  </div>
                  <div className="flex flex-col items-center group/item cursor-pointer">
                    <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                      <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&q=80" alt="Sweatshirts & Hoodies" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                    </div>
                    <span className={`text-[11px] font-medium text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Sweatshirts & Hoodies</span>
                  </div>
                  <div className="flex flex-col items-center group/item cursor-pointer">
                    <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                      <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&q=80" alt="Bottoms" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                    </div>
                    <span className={`text-[11px] font-medium text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Bottoms</span>
                  </div>
                  <div className="flex flex-col items-center group/item cursor-pointer">
                    <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                      <img src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=300&q=80" alt="Two Piece Sets" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                    </div>
                    <span className={`text-[11px] font-medium text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Two Piece Sets</span>
                  </div>
                </div>
              </div>
            </div>
            {/* COLLECTION Dropdown */}
            <div className="group">
              <Link to="/products" className="flex items-center gap-1 py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors whitespace-nowrap">
                COLLECTION {'>'}
              </Link>
              
              <div className={`absolute top-full left-0 right-0 mx-auto w-[900px] shadow-xl border hidden group-hover:flex p-6 gap-8 z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                {/* Left Image */}
                <div className="w-48 flex flex-col items-center">
                  <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                    <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80" alt="Original Design" className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-[12px] font-bold text-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Original Design</span>
                </div>

                {/* Middle Columns */}
                <div className={`flex-1 flex gap-8 px-4 border-x ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  {/* Shop by Occasion */}
                  <div className="flex flex-col gap-2 flex-1">
                    <span className={`font-bold text-xs mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>SHOP BY OCCASION</span>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Daily Essentials</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Vacation Vibes</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Work Outfits</Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Homewear</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Holiday Party</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Wedding Guest</Link>
                  </div>
                  
                  {/* Shop by Trend */}
                  <div className="flex flex-col gap-2 flex-1">
                    <span className={`font-bold text-xs mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>SHOP BY TREND</span>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Mock Neck</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Contrast Trim</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Bow Collection</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Embroidery Edit</Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Acid Washed</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Applique Graphic</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Sequins & Pearls</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Puff Sleeves</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Ruffle Sleeves</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Smocked Fashion</Link>
                  </div>

                  {/* Shop by Fabric */}
                  <div className="flex flex-col gap-2 flex-1">
                    <span className={`font-bold text-xs mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>SHOP BY FABRIC</span>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">Denim Edit <span className="bg-primary-600 text-white text-[9px] px-1 rounded-sm leading-tight">HOT</span></Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ribbed Knit</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Cotton & Linen</Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Mesh & Sheer</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Twist Ribbed Knit</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Waffle Knit</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Velvet</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Corduroy</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Fleece & Plush</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Crochet</Link>
                  </div>
                </div>

                {/* Right Image */}
                <div className="w-48 flex flex-col items-center">
                  <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                    <img src="https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=300&q=80" alt="Spiritual" className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-[12px] font-bold text-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Spiritual</span>
                </div>
              </div>
            </div>
            {/* BEST SELLERS Dropdown */}
            <div className="group">
              <Link to="/products" className="flex items-center gap-1 py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors whitespace-nowrap">
                BEST SELLERS <span className="bg-primary-600 text-white text-[9px] px-1 rounded-sm leading-tight">HOT</span>
              </Link>
              
              <div className={`absolute top-full left-0 right-0 mx-auto w-[950px] shadow-xl border hidden group-hover:flex p-6 gap-8 z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                
                {/* Left Columns */}
                <div className={`flex gap-8 pr-8 border-r ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  {/* Shop by Style */}
                  <div className="flex flex-col gap-2 w-36">
                    <span className={`font-bold text-xs mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>SHOP BY STYLE</span>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Country Romance</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Elegant Fashion</Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Western Trends</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Bohemian Style</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Casual Style</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Activewear</Link>
                  </div>
                  
                  {/* Shop by Category */}
                  <div className="flex flex-col gap-2 w-36">
                    <span className={`font-bold text-xs mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>SHOP BY CATEGORY</span>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Basic Tops</Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Barrel Edit</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Transitional Knits</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Curvy Fashion</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Wide Leg Pants</Link>
                  </div>

                  {/* Shop by Pattern */}
                  <div className="flex flex-col gap-2 w-40">
                    <span className={`font-bold text-xs mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>SHOP BY PATTERN</span>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">Leopard <span className="bg-primary-600 text-white text-[9px] px-1 rounded-sm leading-tight">HOT</span></Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Polka Dot</Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Camo Collection</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Haute Pink</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Floral Print</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Color Block</Link>
                    <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600">Abstract Print</Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Stripe Print</Link>
                    <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Gingham & Plaid</Link>
                  </div>
                </div>

                {/* Right Images */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center group/item cursor-pointer">
                    <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                      <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80" alt="Stripe Print" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                    </div>
                    <span className={`text-[12px] font-bold text-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Stripe Print</span>
                  </div>
                  <div className="flex flex-col items-center group/item cursor-pointer">
                    <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                      <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&q=80" alt="Western Trends" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                    </div>
                    <span className={`text-[12px] font-bold text-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Western Trends</span>
                  </div>
                  <div className="flex flex-col items-center group/item cursor-pointer">
                    <div className="w-full aspect-[3/4] bg-slate-100 mb-2 overflow-hidden rounded">
                      <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&q=80" alt="Camo" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                    </div>
                    <span className={`text-[12px] font-bold text-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Camo</span>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/products?category=pre-order" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">PRE ORDER</Link>
            <Link to="/products" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">RESTOCK</Link>
            <Link to="/products" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">2026 F/W</Link>
            <Link to="/products?category=plus-size" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">PLUS SIZE</Link>
            <Link to="/products" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">HOLIDAY</Link>
            <Link to="/products?sort=sale" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">SALE</Link>
            <Link to="/products" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">CUSTOMIZE</Link>
            <Link to="/about" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">ABOUT US</Link>
            <Link to="/contact" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">CONTACT</Link>
            <Link to="/faq" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap">FAQ</Link>
            
            {user?.role === 'admin' && (
              <Link to="/admin" className="py-4 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 whitespace-nowrap text-primary-600">ADMIN AREA</Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'} border-t pt-16 pb-8 transition-colors`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            
            {/* Column 1: Brand & Social */}
            <div>
              <Link to="/" className="mb-6 inline-block">
                <img src="/logo-transparent.png" alt="SaaSCommerce" className={`h-16 object-contain transition-all ${isDarkMode ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0" : "filter grayscale hover:grayscale-0"}`} />
              </Link>
              <p className={`mb-6 text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Elevating your everyday style with premium quality apparel. Discover the latest trends directly from our state-of-the-art warehouses.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-primary-600' : 'bg-white shadow-sm hover:bg-primary-50 hover:text-primary-600'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-primary-600' : 'bg-white shadow-sm hover:bg-primary-50 hover:text-primary-600'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-primary-600' : 'bg-white shadow-sm hover:bg-primary-50 hover:text-primary-600'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Categories</h3>
              <ul className="space-y-3">
                <li><Link to="/products?category=dresses" className="text-sm hover:text-primary-600 transition-colors">Dresses</Link></li>
                <li><Link to="/products?category=outerwear" className="text-sm hover:text-primary-600 transition-colors">Outerwear</Link></li>
                <li><Link to="/products?category=activewear" className="text-sm hover:text-primary-600 transition-colors">Activewear</Link></li>
                <li><Link to="/products?category=swimwear" className="text-sm hover:text-primary-600 transition-colors">Swimwear</Link></li>
                <li><Link to="/products?category=accessories" className="text-sm hover:text-primary-600 transition-colors">Accessories</Link></li>
              </ul>
            </div>

            {/* Column 3: Products */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Products</h3>
              <ul className="space-y-3">
                <li><Link to="/products?sort=newest" className="text-sm hover:text-primary-600 transition-colors">New Arrivals</Link></li>
                <li><Link to="/products?sort=bestselling" className="text-sm hover:text-primary-600 transition-colors">Best Sellers <span className="ml-1 text-[10px] bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded font-bold">HOT</span></Link></li>
                <li><Link to="/products?sort=trending" className="text-sm hover:text-primary-600 transition-colors">Trending Now</Link></li>
                <li><Link to="/products?sort=sale" className="text-sm hover:text-primary-600 transition-colors">Sale Items</Link></li>
                <li><Link to="/products" className="text-sm hover:text-primary-600 transition-colors">All Collections</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm">
                  <MapPin size={20} className="text-primary-600 mt-0.5 shrink-0" />
                  <span>Lahore, Pakistan</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Phone size={20} className="text-primary-600 shrink-0" />
                  <a href="https://wa.me/923217812265" target="_blank" rel="noreferrer" className="hover:text-primary-600 transition-colors">+92 321 7812265</a>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Mail size={20} className="text-primary-600 shrink-0" />
                  <a href="mailto:wordpressrahila@gmail.com" className="hover:text-primary-600 transition-colors">wordpressrahila@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* Column 5: Company Pages */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm hover:text-primary-600 transition-colors">About Us</Link></li>
                <li><Link to="/faq" className="text-sm hover:text-primary-600 transition-colors">FAQ & Help</Link></li>
                <li><Link to="/terms" className="text-sm hover:text-primary-600 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-sm hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/careers" className="text-sm hover:text-primary-600 transition-colors">Careers</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className={`border-t pt-8 text-center text-sm flex flex-col md:flex-row justify-between items-center ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
            <p>&copy; {new Date().getFullYear()} SaaSCommerce. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span className="flex gap-2">
                <div className={`w-10 h-6 rounded flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>Visa</div>
                <div className={`w-10 h-6 rounded flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>MC</div>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/923217812265" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 group"
        aria-label="Contact us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.22 5.22 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        {/* Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-slate-800 text-sm font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100 pointer-events-none">
          Chat with us
        </span>
      </a>
    </div>
  );
}
