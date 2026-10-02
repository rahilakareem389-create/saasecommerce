import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart, ShoppingCart, Star, Minus, Plus, CheckCircle, X } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [showAddedModal, setShowAddedModal] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products/${id}`);
      setProduct(data);
      if(data.variants?.length > 0) setVariant(data.variants[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products`);
      setRelatedProducts((Array.isArray(data) ? data : (data.products || [])).filter(p => p._id !== id).slice(0, 4));
    } catch(e) {
      console.error(e);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire('Please login to submit a review');
    setReviewLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products/${id}/reviews`, {
        rating, comment
      }, config);
      fetchProduct();
      setComment('');
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, selectedVariant: variant, qty: qty });
    setShowAddedModal(true);
  };

  if (loading) return <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-bold text-xl">Loading product details...</div>;
  if (!product) return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Product not found</div>;

  return (
    <div className="w-full mx-auto space-y-12 px-4 md:px-8 py-8 bg-slate-50 dark:bg-[#1f1f2e] min-h-screen">
      {/* Product Top */}
      <div className="bg-white dark:bg-[#2a2a3c] p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-[#3d3d5c] flex flex-col lg:flex-row gap-12">
        
        {/* Left: Image */}
        <div className="lg:w-1/2 relative bg-slate-50 dark:bg-[#1f1f2e] rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
          <button 
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 p-3 bg-white dark:bg-[#2a2a3c] rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-md z-10"
          >
            <Heart size={24} className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""} />
          </button>
          {product.imageUrl ? (
            <img src={(variant && variant.imageUrl) ? variant.imageUrl : product.imageUrl} alt={product.title} className="max-h-[500px] object-contain hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="text-slate-400">No Image Available</div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-primary-600 font-bold text-sm tracking-widest uppercase bg-primary-50 px-3 py-1 rounded-full">
              {product.category?.name || 'Premium'}
            </span>
            <div className="flex text-yellow-400 items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Star size={16} className="fill-yellow-400" />
              <span className="text-yellow-700 font-bold text-sm">{product.rating || 5.0} <span className="text-slate-400 font-normal">({product.numReviews || 0})</span></span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-50 mb-4 leading-tight">{product.title}</h1>
          <p className="text-3xl font-black text-primary-600 mb-6">Rs. {product.price.toFixed(2)}</p>
          
          {/* Short Description */}
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed border-b pb-8">
            {product.shortDescription || product.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8 border-b pb-8">
             <div>
               <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Quality / Condition</p>
               <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Brand New (100% Original)</p>
             </div>
             <div>
               <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Weight / Dimensions</p>
               <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Approx. 1.2 KG</p>
             </div>
          </div>

          {/* Variants / Color */}
          {product.variants?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Select Color / Size</h4>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setVariant(v)}
                    disabled={v.stock === 0}
                    className={`px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      variant === v 
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md scale-105' 
                        : v.stock === 0 
                          ? 'border-slate-100 dark:border-[#3d3d5c] bg-slate-50 dark:bg-[#1f1f2e] text-slate-300 cursor-not-allowed' 
                          : 'border-slate-200 dark:border-[#3d3d5c] text-slate-600 dark:text-slate-400 hover:border-slate-400 bg-white dark:bg-[#2a2a3c]'
                    }`}
                  >
                    {v.size && `${v.size} - `}{v.color} {v.stock === 0 ? '(Out of Stock)' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center justify-between border-2 border-slate-200 dark:border-[#3d3d5c] rounded-xl px-4 py-2 bg-white dark:bg-[#2a2a3c] sm:w-1/3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-slate-400 hover:text-primary-600 p-2"><Minus size={20} /></button>
              <span className="font-black text-xl text-slate-800 dark:text-slate-200">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="text-slate-400 hover:text-primary-600 p-2"><Plus size={20} /></button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={(product.variants?.length > 0 && !variant) || (variant ? variant.stock === 0 : product.stock === 0)}
              className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-black text-lg hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <ShoppingCart size={24} />
              {product.variants?.length > 0 && !variant 
                ? 'Select an option' 
                : (variant ? variant.stock > 0 : product.stock > 0) ? 'Add to Cart' : 'Out of Stock'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Long Description Section */}
      <div className="bg-white dark:bg-[#2a2a3c] p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-[#3d3d5c] shadow-sm">
         <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-6">Product Details (Long Description)</h2>
         <div className="prose max-w-none text-slate-600 dark:text-slate-400 text-lg leading-relaxed space-y-4">
           <p>This premium product is crafted with the highest quality materials to ensure durability and comfort. Whether you are using it for daily tasks or special occasions, it delivers exceptional performance.</p>
           <ul className="list-disc pl-6 space-y-2">
              <li>100% Authentic & Certified</li>
              <li>Engineered for maximum efficiency</li>
              <li>Includes standard company warranty</li>
              <li>Easy to use and maintain</li>
           </ul>
           <p>{product.description}</p>
         </div>
      </div>

      {/* Related Products Section */}
      <div className="pt-8">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-8 flex items-center gap-3">
          <i className="fas fa-fire text-orange-500"></i> Related & Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(rp => (
             <Link to={`/product/${rp._id}`} key={rp._id} className="bg-white dark:bg-[#2a2a3c] rounded-2xl p-4 border border-slate-100 dark:border-[#3d3d5c] shadow-sm hover:shadow-xl transition-all group block">
                <div className="aspect-square bg-slate-50 dark:bg-[#1f1f2e] rounded-xl mb-4 overflow-hidden relative">
                  <img src={rp.imageUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{rp.title}</h3>
                <p className="text-primary-600 font-black mt-1">Rs. {rp.price}</p>
             </Link>
          ))}
        </div>
      </div>

      
        {/* Q&A Section */}
        <div className="bg-white dark:bg-[#2a2a3c] p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-[#3d3d5c] shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[120px] opacity-10"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <i className="fas fa-comments text-primary-500"></i> Customer Q&A
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Have a question about this product? Ask our team!</p>
            </div>
          </div>
          
          <div className="space-y-8 relative z-10">
            {/* Ask a Question Box */}
            <div className="bg-slate-50 dark:bg-[#1f1f2e] p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const q = e.target.question.value;
                if(!q) return;
                
                // Show loading
                Swal.fire({
                  title: 'Submitting...',
                  text: 'Please wait while we post your question.',
                  allowOutsideClick: false,
                  didOpen: () => Swal.showLoading()
                });

                try {
                  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products/${product._id}/questions`, { 
                    question: q, 
                    user: user?.name || 'Guest User', userId: user?._id || null 
                  });
                  setProduct(res.data);
                  e.target.reset();
                  
                  Swal.fire({
                    icon: 'success',
                    title: 'Question Posted!',
                    text: 'Your question has been submitted. Our team will answer it shortly.',
                    timer: 2000,
                    showConfirmButton: false
                  });
                } catch(err) { 
                  console.error(err); 
                  Swal.fire('Error', 'Failed to submit question.', 'error');
                }
              }} className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 dark:text-slate-300 text-sm">Post a Question</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    name="question" 
                    type="text" 
                    placeholder="e.g., What is the exact material used in this product?" 
                    className="flex-1 px-5 py-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-[#2a2a3c] dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    required 
                  />
                  <button type="submit" className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 whitespace-nowrap">
                    <i className="fas fa-paper-plane"></i> Ask Question
                  </button>
                </div>
              </form>
            </div>
            
            {/* Questions List */}
            <div className="space-y-6">
              {product.questions?.length > 0 ? [...product.questions].reverse().map((q, idx) => (
                <div key={idx} className="flex gap-4 p-6 rounded-2xl border border-slate-100 dark:border-[#3d3d5c] bg-white dark:bg-[#2a2a3c] shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold shrink-0 text-lg uppercase">
                    {q.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-slate-800 dark:text-slate-200 text-lg">{q.question}</p>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{new Date(q.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">Asked by {q.user}</p>
                    
                    {q.answer ? (
                      <div className="bg-slate-50 dark:bg-[#1f1f2e] p-4 rounded-xl border-l-4 border-primary-500 mt-2 relative">
                        <div className="absolute -left-[2px] top-4 w-4 h-4 bg-primary-500 rounded-full border-4 border-white dark:border-[#2a2a3c] -translate-x-1/2"></div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-wider uppercase">Store Admin</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{q.answer}</p>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                        <i className="fas fa-clock"></i> Waiting for admin reply...
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
                    <i className="fas fa-question"></i>
                  </div>
                  <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Questions Yet</h4>
                  <p className="text-slate-500">Be the first to ask a question about this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
      <div className="bg-white dark:bg-[#2a2a3c] p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-[#3d3d5c] shadow-sm mt-12">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Write a review */}
          <div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-6 border-b pb-4">Write a Customer Review</h3>
            {user ? (
              <form onSubmit={submitReview} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Your Rating</label>
                    <div className="flex flex-wrap gap-2">
                    {[
                      { v: 5, l: "Awesome" },
                      { v: 4, l: "Excellent" },
                      { v: 3, l: "Good" },
                      { v: 2, l: "Fair" },
                      { v: 1, l: "Poor" }
                    ].map(opt => (
                        <button
                          key={opt.v}
                          type="button"
                          onClick={() => setRating(opt.v)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center gap-2 ${rating === opt.v ? 'bg-yellow-100 border-yellow-400 text-yellow-700 shadow-sm scale-105' : 'bg-white dark:bg-[#2a2a3c] border-slate-200 dark:border-[#3d3d5c] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#1f1f2e]'}`}
                        >
                          <span className="text-yellow-500 tracking-widest">{Array(opt.v).fill('★').join('')}</span> 
                        </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Comment</label>
                  <textarea 
                    required
                    rows="4" 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="w-full px-5 py-4 border-2 border-slate-200 dark:border-[#3d3d5c] rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none font-medium"
                  ></textarea>
                </div>
                <button disabled={reviewLoading} type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95 w-full md:w-auto">
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 dark:bg-[#1f1f2e] p-8 rounded-2xl text-center border-2 border-dashed border-slate-200 dark:border-[#3d3d5c]">
                <p className="text-slate-600 dark:text-slate-400 mb-4 font-bold text-lg">Please sign in to write a review.</p>
                <Link to="/login" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 inline-block shadow-md">Login Now</Link>
              </div>
            )}
          </div>

          {/* List Reviews */}
          <div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-6 border-b pb-4">All Reviews ({product.reviews?.length || 0})</h3>
            {product.reviews?.length === 0 ? (
              <div className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#1f1f2e] p-6 rounded-xl italic">No reviews yet. Be the first to review!</div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 hide-scrollbar">
                {product.reviews?.map((review, i) => (
                  <div key={i} className="border-b border-slate-100 dark:border-[#3d3d5c] pb-6 last:border-0 bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl shadow-sm border">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-lg">
                          {review.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{review.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400 bg-yellow-50 px-2 py-1 rounded-lg">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} className={star <= review.rating ? "fill-yellow-400" : "fill-slate-200 text-slate-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Added to Cart Modal (Featured Products Cross-sell) */}
      {showAddedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white dark:bg-[#2a2a3c] rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">
              
              {/* Left: Success State */}
              <div className="md:w-2/5 bg-primary-600 p-8 text-white flex flex-col justify-center items-center text-center relative">
                 <button onClick={() => setShowAddedModal(false)} className="md:hidden absolute top-4 right-4 text-white/70 hover:text-white"><X size={24} /></button>
                 <div className="w-20 h-20 bg-white dark:bg-[#2a2a3c]/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-white" />
                 </div>
                 <h2 className="text-3xl font-black mb-2">Added to Cart!</h2>
                 <p className="text-primary-100 font-medium mb-8">Your product has been added to your shopping cart.</p>
                 
                 <div className="w-full space-y-3">
                   <Link to="/cart" className="block w-full py-3 bg-white dark:bg-[#2a2a3c] text-primary-700 font-bold rounded-xl hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors shadow-lg">View Cart & Checkout</Link>
                   <button onClick={() => setShowAddedModal(false)} className="w-full py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors">Continue Shopping</button>
                 </div>
              </div>

              {/* Right: Featured Slider */}
              <div className="md:w-3/5 bg-slate-50 dark:bg-[#1f1f2e] p-8 relative">
                 <button onClick={() => setShowAddedModal(false)} className="hidden md:block absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:text-slate-300"><X size={24} /></button>
                 <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 mb-6">Frequently Bought Together</h3>
                 
                 <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                    {relatedProducts.slice(0, 3).map(rp => (
                      <Link to={`/product/${rp._id}`} onClick={() => setShowAddedModal(false)} key={rp._id} className="min-w-[160px] max-w-[160px] bg-white dark:bg-[#2a2a3c] p-3 rounded-2xl shadow-sm hover:shadow-md transition-all snap-start border border-slate-100 dark:border-[#3d3d5c]">
                         <div className="w-full aspect-square bg-slate-50 dark:bg-[#1f1f2e] rounded-xl mb-3">
                           <img src={rp.imageUrl} alt={rp.title} className="w-full h-full object-cover rounded-xl" />
                         </div>
                         <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm line-clamp-1">{rp.title}</h4>
                         <p className="text-primary-600 font-black text-xs mt-1">Rs. {rp.price}</p>
                      </Link>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}
