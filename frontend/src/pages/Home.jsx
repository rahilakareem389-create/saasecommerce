import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Phone, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Home() {
  const [realReviews, setRealReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'https://saasecommerce-production.up.railway.app'}/api/products`);
        let extracted = [];
        const fetchedProducts = Array.isArray(data) ? data : (data.products || []);
        
        setProducts(fetchedProducts);

        fetchedProducts.forEach(p => {
          if (p.reviews && p.reviews.length > 0) {
            extracted = [...extracted, ...p.reviews.map(r => ({
              name: r.name,
              role: 'Verified Buyer',
              text: r.comment,
              rating: r.rating,
              img: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=random`
            }))];
          }
        });
        setRealReviews(extracted);
      } catch (error) {
        console.error("Failed to fetch product data", error);
      }
    };
    fetchProducts();
  }, []);

  const dummyReviews = [
    { name: "Sarah J.", role: "Verified Buyer", text: "Absolutely love the dresses here! The quality is amazing and fits perfectly. Will definitely order again.", img: "https://i.pravatar.cc/150?img=1", rating: 5 },
    { name: "Emily R.", role: "Fashion Blogger", text: "Their new outerwear collection is a must-have for the winter season. So cozy and stylish!", img: "https://i.pravatar.cc/150?img=5", rating: 5 },
    { name: "Jessica T.", role: "Verified Buyer", text: "Fast shipping and the material feels so premium. Highly recommended!", img: "https://i.pravatar.cc/150?img=9", rating: 5 },
    { name: "Amanda K.", role: "Verified Buyer", text: "I bought a 2-piece set and it's my new favorite outfit. Customer service was also very helpful.", img: "https://i.pravatar.cc/150?img=12", rating: 4 },
    { name: "Michelle B.", role: "Loyal Customer", text: "I've been shopping here for years. The activewear is better than most expensive brands.", img: "https://i.pravatar.cc/150?img=16", rating: 5 },
    { name: "Laura M.", role: "Verified Buyer", text: "The fit is just right! Plus size options are actually cute and trendy.", img: "https://i.pravatar.cc/150?img=20", rating: 5 },
    { name: "Chloe S.", role: "Verified Buyer", text: "Obsessed with the accessories. They elevate any basic outfit instantly.", img: "https://i.pravatar.cc/150?img=24", rating: 5 },
    { name: "Diana P.", role: "Verified Buyer", text: "Everything I ordered exceeded my expectations. 5 stars all the way!", img: "https://i.pravatar.cc/150?img=32", rating: 5 },
  ];

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
      for (let i = 0; i < 10; i++) { // 10 products
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

  // Generate 400 dummy products with images
  const dummyProducts = generateDummyProducts();

  const allReviews = [...realReviews, ...dummyReviews];
  const displayProducts = [...products, ...dummyProducts];

  const catScrollRef = useRef(null);
  const prodScrollRef = useRef(null);
  const [isCatPaused, setIsCatPaused] = useState(false);
  const [isProdPaused, setIsProdPaused] = useState(false);

  useEffect(() => {
    let catInterval;
    if (!isCatPaused) {
      catInterval = setInterval(() => {
        if (catScrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = catScrollRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 1) {
            catScrollRef.current.scrollLeft = 0;
          } else {
            catScrollRef.current.scrollLeft += 1;
          }
        }
      }, 30);
    }
    return () => clearInterval(catInterval);
  }, [isCatPaused]);

  useEffect(() => {
    let prodInterval;
    if (!isProdPaused) {
      prodInterval = setInterval(() => {
        if (prodScrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = prodScrollRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 1) {
            prodScrollRef.current.scrollLeft = 0;
          } else {
            prodScrollRef.current.scrollLeft += 1;
          }
        }
      }, 30);
    }
    return () => clearInterval(prodInterval);
  }, [isProdPaused]);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const amount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div 
        className="min-h-[80vh] flex items-center justify-center py-12 relative bg-gradient-to-br from-[#f8f5fd] via-[#efe8fa] to-[#f3ebff] dark:from-[#1a1a26] dark:via-[#201c2e] dark:to-[#1a1a26]"
        
      >
        
        
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative z-10">
        
        {/* Left Side: Text and Buttons */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-primary-600 text-white rounded-full text-sm font-bold tracking-wide mb-2 shadow-md animate__animated animate__fadeInUp">
            NEW COLLECTION 2026
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight animate__animated animate__fadeInUp drop-shadow-md" style={{animationDelay: '0.2s'}}>
            <span className="font-serif italic text-4xl lg:text-6xl text-primary-600 block mb-2 font-medium">Elevate Your</span>
            <span 
              className="uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-black dark:to-white drop-shadow-sm"
            >
              Everyday Style
            </span>
          </h1>
          
          <p className="text-lg text-black dark:text-white max-w-xl mx-auto md:mx-0 leading-relaxed font-medium drop-shadow-sm animate__animated animate__fadeInUp" style={{animationDelay: '0.4s'}}>
            Discover the latest trends in fashion and apparel. We bring you high-quality, sustainable production directly from our state-of-the-art warehouses.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4 animate__animated animate__fadeInUp" style={{animationDelay: '0.6s'}}>
            <Link 
              to="/products" 
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 backdrop-blur-md border-2 border-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 hover:border-primary-700 transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              Order Now <ShoppingBag size={18} />
            </Link>
            
            <Link 
              to="/products" 
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#2a2a3c] backdrop-blur-md border-2 border-primary-200 text-primary-700 rounded-xl font-bold hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              See Collection <ArrowRight size={18} />
            </Link>

            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:bg-[#2a2a3c]/50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              Contact Us <Phone size={18} />
            </Link>
          </div>
          
          {/* Stats Cards */}
          <div className="pt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
            <div className="bg-white dark:bg-[#2a2a3c]/60 backdrop-blur-md border border-primary-100 px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[160px] animate__animated animate__fadeInUp hover:-translate-y-2 transition-transform cursor-pointer shadow-xl" style={{animationDelay: '0.8s'}}>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-50 drop-shadow-sm">50K+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Happy Customers</div>
            </div>
            
            <div className="bg-white dark:bg-[#2a2a3c]/60 backdrop-blur-md border border-primary-100 px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[160px] animate__animated animate__fadeInUp hover:-translate-y-2 transition-transform cursor-pointer shadow-xl" style={{animationDelay: '1.0s'}}>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-50 drop-shadow-sm">99%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Quality Guaranteed</div>
            </div>
          </div>
        </div>

        {/* Right Side: Circular Video */}
        <div className="flex-1 flex justify-center items-center w-full max-w-lg mx-auto relative group mt-10 md:mt-0">
          {/* Decorative background circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-primary-200 to-pink-200 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none"></div>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-pink-500 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>
          
          {/* Main Video Circle */}
          <div className="relative w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full overflow-hidden border-8 border-white shadow-2xl z-10 ring-4 ring-primary-100">
            <video 
              className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 object-cover" 
              src="https://v16-vod.capcutvod.com/33a97070f069c547a6787a7bfa571e33/6abcadfe/video/tos/alisg/tos-alisg-ve-8fe9aq-sg/o0zSuBuEtQEfRqhv6gQuXEQbICRlftDTg3sBFB/?a=3006&bti=cHJ3bzFmc3dmZEBvY15taF4rcm1gYA%3D%3D&&bt=913&ft=GNvlXInz7Th.qNTGXq8Zmo&mime_type=video_mp4&rc=aWY8Ojc1ODRlNGk4aGU4ZkBpamx3O3A5cmdobzMzOGVkNEAzLy5eYzE0XzIxMF5fLzU2YSNrL2doMmRzaWtgLS1kYi1zcw%3D%3D&vvpl=1&l=202609231334430BD7B83D3A2AB3E96C8D&btag=e000b0000" 
              autoPlay 
              loop 
              muted 
              playsInline
            ></video>
            
            {/* Color Overlay */}
            <div className="absolute inset-0 bg-primary-900/10 mix-blend-overlay pointer-events-none"></div>
          </div>
          
          {/* Floating Clickable Star/Badge */}
          <a href="#" className="absolute top-4 -left-6 sm:top-10 sm:-left-12 w-28 h-28 bg-white dark:bg-[#2a2a3c] rounded-full shadow-2xl z-20 flex flex-col items-center justify-center animate-[spin_10s_linear_infinite] hover:scale-110 transition-transform group/badge border-4 border-primary-50">
            {/* Inner content that counter-spins so text stays upright */}
            <div className="animate-[spin_10s_linear_reverse_infinite] flex flex-col items-center justify-center text-center">
              <svg className="w-8 h-8 text-primary-600 mb-1 group-hover/badge:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div className="font-extrabold text-[10px] text-slate-800 dark:text-slate-200 leading-tight uppercase tracking-wider">Watch<br/>Video</div>
            </div>
          </a>
        </div>
        
      </div>
      </div>

      {/* Category Section */}
      <div className="w-full bg-slate-50 dark:bg-[#1f1f2e] border-y border-slate-200 dark:border-[#3d3d5c] pt-24 pb-16 relative flex flex-col mt-12 md:mt-24 overflow-hidden">
        
        {/* Centered Heading */}
        <div className="text-center px-4 relative z-10 mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-pink-500 drop-shadow-sm">Categories</h2>
          <div className="w-12 h-1 bg-primary-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Scrollable Container with Overlay Arrows */}
        <div 
          className="w-full relative group"
          onMouseEnter={() => setIsCatPaused(true)}
          onMouseLeave={() => setIsCatPaused(false)}
          onTouchStart={() => setIsCatPaused(true)}
          onTouchEnd={() => setIsCatPaused(false)}
        >
          <button onClick={() => scrollContainer(catScrollRef, 'left')} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#2a2a3c] shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-primary-900 hover:text-primary-600 hover:scale-110 transition-all md:opacity-0 md:group-hover:opacity-100 border border-slate-100 dark:border-[#3d3d5c]">
            <ChevronLeft size={28} />
          </button>
          
          <button onClick={() => scrollContainer(catScrollRef, 'right')} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#2a2a3c] shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-primary-900 hover:text-primary-600 hover:scale-110 transition-all md:opacity-0 md:group-hover:opacity-100 border border-slate-100 dark:border-[#3d3d5c]">
            <ChevronRight size={28} />
          </button>

          <div 
            ref={catScrollRef}
            className="w-full overflow-x-auto pb-6 px-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative scroll-smooth"
          >
            <div className="flex gap-8 sm:gap-12 w-max mx-auto md:mx-0">
            {[
                  { name: 'DRESSES', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80' },
                  { name: 'TOPS', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80' },
                  { name: 'BOTTOMS', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&q=80' },
                  { name: 'OUTERWEAR', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80' },
                  { name: 'SHOES', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80' },
                  { name: 'ACCESSORIES', img: 'https://images.unsplash.com/photo-1599643478524-fb66f7240078?w=200&q=80' },
                  { name: 'ACTIVEWEAR', img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&q=80' },
                  { name: 'SWIMWEAR', img: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=200&q=80' },
                  { name: 'LINGERIE', img: 'https://images.unsplash.com/photo-1592548232675-9252c1e7841c?w=200&q=80' },
                  { name: 'SLEEPWEAR', img: 'https://images.unsplash.com/photo-1616781442111-e408ec9ccbb2?w=200&q=80' },
                  { name: 'PLUS SIZE', img: 'https://images.unsplash.com/photo-1611042553365-9b101441c135?w=200&q=80' },
                  { name: 'MATERNITY', img: 'https://images.unsplash.com/photo-1560505167-2708304910eb?w=200&q=80' },
                  { name: 'DENIM', img: 'https://images.unsplash.com/photo-1542272604-780c8d9e7943?w=200&q=80' },
                  { name: 'SWEATERS', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&q=80' },
                  { name: 'JUMPSUITS', img: 'https://images.unsplash.com/photo-1618212133465-9d3cc136f32e?w=200&q=80' },
                  { name: 'ROMPERS', img: 'https://images.unsplash.com/photo-1622513233630-17e92ceee9e9?w=200&q=80' },
                  { name: 'SKIRTS', img: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=200&q=80' },
                  { name: 'SHORTS', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&q=80' },
                  { name: 'INTIMATES', img: 'https://images.unsplash.com/photo-1510212351239-0158bcbb879b?w=200&q=80' },
                  { name: 'JEWELRY', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80' },
            ].map((cat, idx) => (
              <Link to={`/products?category=${cat.name.toLowerCase()}`} key={idx} className="flex flex-col items-center gap-4 group/cat w-28 sm:w-32 shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[3px] border-white shadow-md group-hover/cat:border-primary-500 group-hover/cat:shadow-xl group-hover/cat:-translate-y-2 transition-all duration-300">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover/cat:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300 group-hover/cat:text-primary-600 tracking-wider uppercase">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="w-full bg-white dark:bg-[#2a2a3c] py-16 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-2">Featured Products</h2>
          <p className="text-slate-500 dark:text-slate-400">Discover what's trending in our catalog right now.</p>
        </div>

        <div 
          className="w-full relative group"
          onMouseEnter={() => setIsProdPaused(true)}
          onMouseLeave={() => setIsProdPaused(false)}
          onTouchStart={() => setIsProdPaused(true)}
          onTouchEnd={() => setIsProdPaused(false)}
        >
          <button onClick={() => scrollContainer(prodScrollRef, 'left')} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#2a2a3c] shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-primary-900 hover:text-primary-600 hover:scale-110 transition-all md:opacity-0 md:group-hover:opacity-100 border border-slate-100 dark:border-[#3d3d5c]">
            <ChevronLeft size={28} />
          </button>
          
          <button onClick={() => scrollContainer(prodScrollRef, 'right')} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#2a2a3c] shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-primary-900 hover:text-primary-600 hover:scale-110 transition-all md:opacity-0 md:group-hover:opacity-100 border border-slate-100 dark:border-[#3d3d5c]">
            <ChevronRight size={28} />
          </button>

          <div 
            ref={prodScrollRef}
            className="w-full overflow-x-auto pb-6 px-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative scroll-smooth"
          >
            <div className="flex gap-4 w-max mx-auto md:mx-0">
            {displayProducts.map((prod, idx) => (
              <Link to={`/products`} key={idx} className="w-48 sm:w-52 bg-slate-50 dark:bg-[#1f1f2e] border border-slate-100 dark:border-[#3d3d5c] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all shrink-0 group flex flex-col">
                <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  {prod.imageUrl ? (
                    <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                  )}
                  {/* Hover Actions */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 opacity-0 -translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none z-10">
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleWishlist(prod); }}
                      className="w-10 h-10 bg-white dark:bg-[#2a2a3c]/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary-600 hover:bg-white dark:bg-[#2a2a3c] shadow-md transition-all pointer-events-auto group/btn relative"
                    >
                      <Heart size={20} className={isInWishlist(prod._id) ? "fill-primary-600 text-primary-600" : ""} />
                      {/* Tooltip */}
                      <span className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">Heart</span>
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); setQuickViewProduct(prod); }}
                      className="w-10 h-10 bg-white dark:bg-[#2a2a3c]/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary-600 hover:bg-white dark:bg-[#2a2a3c] shadow-md transition-all pointer-events-auto group/btn relative"
                    >
                      <ShoppingBag size={20} />
                      {/* Tooltip */}
                      <span className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Quick View</span>
                    </button>
                  </div>
                </div>
                <div className="p-3 flex flex-col items-center text-center">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-1 mb-1 group-hover:text-primary-600">{prod.title}</span>
                  <span className="text-primary-600 font-bold text-sm">${prod.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Testimonials / Reviews Section */}
      <div className="w-full relative pt-32 pb-40 mb-12 flex flex-col items-center justify-center overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-20 mt-12">
        
        {/* Background Image (Original State) */}
        <div className="absolute inset-0 bg-[url('/testimonial-bg.jpg')] bg-cover bg-center bg-fixed"></div>
        {/* Very subtle gradient just for text readability at the top, otherwise original */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4 flex flex-col items-center justify-center mb-12 relative z-10">
          <div className="text-center w-full">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">What Our Customers Say</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto font-medium drop-shadow-md">Real experiences from our beautiful community.</p>
          </div>
        </div>

        {/* Reviews Ticker Container */}
        <div className="w-full relative flex flex-col gap-8 overflow-hidden z-10">
          <style>
            {`
              @keyframes review-ticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes review-ticker-reverse {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0); }
              }
              .review-marquee-bar {
                display: flex;
                width: max-content;
                animation: review-ticker 35s linear infinite;
              }
              .review-marquee-bar-reverse {
                display: flex;
                width: max-content;
                animation: review-ticker-reverse 35s linear infinite;
              }
              .review-marquee-bar:hover, .review-marquee-bar-reverse:hover {
                animation-play-state: paused;
              }
              .star-icon {
                color: #fbbf24;
                width: 18px;
                height: 18px;
              }
            `}
          </style>
          
          {/* Top Bar (Right to Left) */}
          <div className="review-marquee-bar py-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 px-3">
                {allReviews.slice(0, Math.ceil(allReviews.length / 2)).map((review, idx) => (
                  <div key={idx} className="w-80 sm:w-96 bg-black/50 dark:bg-black/70 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl hover:bg-black/60 dark:hover:bg-black/80 transition-all shrink-0">
                    <div className="flex gap-1 mb-4">
                      {/* Rating Stars */}
                      {[...Array(5)].map((_, s) => (
                        <svg key={s} className="star-icon" style={{ color: s < review.rating ? '#fbbf24' : 'rgba(255,255,255,0.2)' }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      ))}
                    </div>
                    <p className="text-white mb-6 italic text-sm leading-relaxed line-clamp-3 font-medium ">"{review.text}"</p>
                    <div className="flex items-center gap-4">
                      <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover bg-slate-800 border-2 border-white/50 shadow-sm" />
                      <div>
                        <div className="font-bold text-white text-sm line-clamp-1 ">{review.name}</div>
                        <div className="text-xs text-white/80 font-medium">{review.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom Bar (Left to Right) */}
          <div className="review-marquee-bar-reverse py-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 px-3">
                {allReviews.slice(Math.ceil(allReviews.length / 2)).map((review, idx) => (
                  <div key={idx} className="w-80 sm:w-96 bg-black/50 dark:bg-black/70 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl hover:bg-black/60 dark:hover:bg-black/80 transition-all shrink-0">
                    <div className="flex gap-1 mb-4">
                      {/* Rating Stars */}
                      {[...Array(5)].map((_, s) => (
                        <svg key={s} className="star-icon" style={{ color: s < review.rating ? '#fbbf24' : 'rgba(255,255,255,0.2)' }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      ))}
                    </div>
                    <p className="text-white mb-6 italic text-sm leading-relaxed line-clamp-3 font-medium ">"{review.text}"</p>
                    <div className="flex items-center gap-4">
                      <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover bg-slate-800 border-2 border-white/50 shadow-sm" />
                      <div>
                        <div className="font-bold text-white text-sm line-clamp-1 ">{review.name}</div>
                        <div className="text-xs text-white/80 font-medium">{review.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Fading Edges for the Dark Background */}
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#f3ebff] dark:from-[#1f1f2e] to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#f3ebff] dark:from-[#1f1f2e] to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-[100]">
          <div className="bg-white dark:bg-[#2a2a3c] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white dark:bg-[#2a2a3c]/80 backdrop-blur rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-[#2a2a3c]/50 transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] bg-slate-100 dark:bg-[#2a2a3c]/50">
              {quickViewProduct.imageUrl ? (
                <img src={quickViewProduct.imageUrl} alt={quickViewProduct.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
            </div>
            
            <div className="w-full md:w-1/2 p-8 flex flex-col text-left">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">{quickViewProduct.title}</h2>
              <div className="text-2xl font-bold text-primary-600 mb-6">${quickViewProduct.price}</div>
              
              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1 overflow-y-auto pr-2">{quickViewProduct.description || "Beautiful design and premium materials make this a must-have addition to your collection."}</p>
              
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
                  className="w-12 h-12 flex items-center justify-center border-2 border-slate-200 dark:border-[#3d3d5c] rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-colors"
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
