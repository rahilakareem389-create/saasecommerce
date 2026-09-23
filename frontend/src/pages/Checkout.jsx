import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Calculate Discount
  let discountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountValue = total * (appliedCoupon.discountAmount / 100);
      if (appliedCoupon.maxDiscountAmount && discountValue > appliedCoupon.maxDiscountAmount) {
        discountValue = appliedCoupon.maxDiscountAmount;
      }
    } else {
      discountValue = appliedCoupon.discountAmount;
    }
    if (discountValue > total) discountValue = total;
  }
  const finalTotal = total - discountValue;

  const applyCoupon = async () => {
    setCouponError('');
    setCouponLoading(true);
    try {
      const { data } = await axios.post('https://saasecommerce.vercel.app/api/coupons/validate', {
        code: couponCode,
        orderTotal: total
      });
      setAppliedCoupon(data);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        name: item.title,
        qty: item.qty,
        image: item.imageUrl || '',
        price: item.price,
        product: item._id,
        variant: item.selectedVariant ? `${item.selectedVariant.size ? item.selectedVariant.size + ' - ' : ''}${item.selectedVariant.color}` : null
      }));

      await axios.post('https://saasecommerce.vercel.app/api/orders', {
        user: user._id,
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: paymentMethod,
        totalPrice: finalTotal,
        coupon: appliedCoupon ? appliedCoupon.code : null
      });

      clearCart();
      alert('Order placed successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="text-center py-20">Your cart is empty.</div>;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Shipping Address</h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input required type="text" value={address} onChange={e=>setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
            <input required type="text" value={city} onChange={e=>setCity(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
              <input required type="text" value={postalCode} onChange={e=>setPostalCode(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input required type="text" value={country} onChange={e=>setCountry(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div className="pt-4 border-t mt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" name="payment" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                <span className="font-medium text-slate-700">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" name="payment" value="Credit Card" checked={paymentMethod === 'Credit Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                <span className="font-medium text-slate-700">Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" name="payment" value="PayPal" checked={paymentMethod === 'PayPal'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                <span className="font-medium text-slate-700">PayPal</span>
              </label>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-primary-600 text-white font-medium py-3 rounded-lg mt-6 hover:bg-primary-700 transition-colors">
            {loading ? 'Processing...' : `Place Order (${paymentMethod})`}
          </button>
        </form>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-slate-600">
                {item.qty}x {item.title} 
                {item.selectedVariant && ` (${item.selectedVariant.size ? item.selectedVariant.size + ' - ' : ''}${item.selectedVariant.color})`}
              </span>
              <span className="font-medium text-slate-900">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        {/* Coupon Section */}
        <div className="border-t pt-4 mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Have a coupon code?</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={couponCode} 
              onChange={e=>setCouponCode(e.target.value.toUpperCase())} 
              disabled={appliedCoupon !== null}
              className="flex-1 px-3 py-2 border rounded-md uppercase" 
              placeholder="e.g. SUMMER20" 
            />
            {appliedCoupon ? (
              <button onClick={() => setAppliedCoupon(null)} type="button" className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-md">Remove</button>
            ) : (
              <button onClick={applyCoupon} disabled={couponLoading || !couponCode} type="button" className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md">
                {couponLoading ? '...' : 'Apply'}
              </button>
            )}
          </div>
          {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-slate-600 text-sm">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-600 text-sm font-medium">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-${discountValue.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-xl text-slate-900 mt-2 pt-2 border-t">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
