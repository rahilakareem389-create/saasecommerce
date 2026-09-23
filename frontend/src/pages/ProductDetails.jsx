import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart, ShoppingCart, Star } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a review');
    
    setReviewLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
        rating, comment
      }, config);
      fetchProduct();
      setComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-slate-500">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Product Top */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 aspect-square bg-white rounded-2xl border p-4 shadow-sm relative">
          <button 
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 p-3 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm z-10"
          >
            <Heart size={24} className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""} />
          </button>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl">No Image Available</div>
          )}
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="mb-2 text-primary-600 font-medium text-sm tracking-wide uppercase">
            {product.category?.name || 'Category'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.title}</h1>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={20} className={star <= product.rating ? "fill-yellow-400" : "fill-slate-200 text-slate-200"} />
              ))}
            </div>
            <span className="text-slate-500 text-sm">({product.numReviews} reviews)</span>
          </div>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>
          <div className="text-4xl font-bold text-primary-600 mb-8">${product.price}</div>
          
          {product.variants?.length > 0 && (
            <div className="mb-8 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Select Option</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setVariant(v)}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        variant === v 
                          ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600' 
                          : v.stock === 0 
                            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-50' 
                            : 'border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {v.size && `[${v.size}] `}{v.color} {v.stock === 0 ? '(Out of Stock)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-4">
            <button 
              onClick={() => addToCart({...product, selectedVariant: variant})}
              disabled={(product.variants?.length > 0 && !variant) || (variant ? variant.stock === 0 : product.stock === 0)}
              className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Reviews Section */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Reviews & Ratings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Write a review */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Write a Customer Review</h3>
            {user ? (
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                  <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
                  <textarea 
                    required
                    rows="4" 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  ></textarea>
                </div>
                <button disabled={reviewLoading} type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 p-6 rounded-lg text-center border">
                <p className="text-slate-600 mb-4">Please sign in to write a review.</p>
                <Link to="/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 inline-block">Login</Link>
              </div>
            )}
          </div>

          {/* List Reviews */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-700">Customer Reviews ({product.reviews?.length || 0})</h3>
            {product.reviews?.length === 0 ? (
              <p className="text-slate-500">No reviews yet.</p>
            ) : (
              product.reviews?.map((review, idx) => (
                <div key={idx} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-800">{review.name}</span>
                    <span className="text-slate-400 text-sm ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={14} className={star <= review.rating ? "fill-yellow-400" : "fill-slate-200 text-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
