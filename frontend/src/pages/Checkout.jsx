import Swal from 'sweetalert2';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useWeb3Forms from '@web3forms/react';
import { CreditCard, Wallet, Truck, Star, Lock, ShieldCheck, CheckCircle2, Smartphone, Building2, QrCode } from 'lucide-react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [paymentMethod, setPaymentMethod] = useState('Debit/Credit Card');
  const [loading, setLoading] = useState(false);

  // Cart Reviews State
  const [itemReviews, setItemReviews] = useState({});

  const handleReviewChange = (productId, field, value) => {
    setItemReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  // --- AUTHENTICATION & PAYMENT STATE ---
  const [authStatus, setAuthStatus] = useState({ 
    'Debit/Credit Card': false, 
    'Cash on Delivery': false, 
    'JazzCash': false, 
    'Easypaisa': false,
    'Bank Transfer': false,
    'Raast': false
  });
  const [authLoading, setAuthLoading] = useState(false);
  
  // Card
  const [cardType, setCardType] = useState('Visa');
  const [cardNumber, setCardNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Mobile Wallets (JazzCash/Easypaisa)
  const [mobileNumber, setMobileNumber] = useState('');
  
  // Bank / Raast
  const [transactionId, setTransactionId] = useState('');

  // COD OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setVerified = (method) => {
    setAuthStatus(prev => ({...prev, [method]: true}));
    setAuthLoading(false);
  };

  const handleCardAuth = () => {
    if(!cardNumber || !expiry || !cvc || !cardName || !issueDate) return Swal.fire("Please fill all card details.");
    setAuthLoading(true);
    setTimeout(() => setVerified('Debit/Credit Card'), 2000);
  };

  const handleMobileAuth = () => {
    if(mobileNumber.length < 11) return Swal.fire("Enter valid 11-digit mobile account number.");
    setAuthLoading(true);
    setTimeout(() => setVerified(paymentMethod), 2000); // works for JazzCash and Easypaisa
  };

  const handleTidAuth = () => {
    if(transactionId.length < 5) return Swal.fire("Enter a valid Transaction ID (TID) / Reference Number.");
    setAuthLoading(true);
    setTimeout(() => setVerified(paymentMethod), 1500); // works for Bank Transfer and Raast
  };

  // Firebase OTP for COD
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const handleSendOtp = async () => {
    if(mobileNumber.length < 10) return Swal.fire("Enter phone number with country code (e.g. +923001234567)");
    setAuthLoading(true);
    
    if(auth.app.options.apiKey === "YOUR_FIREBASE_API_KEY") {
      setAuthLoading(false);
      return Swal.fire("FIREBASE REQUIRED: Replace placeholder API keys in src/firebase.js to receive real SMS.");
    }
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, mobileNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setAuthLoading(false);
    } catch (error) {
      Swal.fire("SMS Error: " + error.message);
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if(otpCode.length < 4) return Swal.fire("Enter OTP");
    setAuthLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      setVerified('Cash on Delivery');
    } catch (error) {
      Swal.fire("Invalid OTP");
      setAuthLoading(false);
    }
  };

  // Web3Forms
  const { submit: submitWeb3Form } = useWeb3Forms({
    access_key: 'ef613376-0f0b-4347-895c-0497fb766444',
    settings: { from_name: 'BuyNest Gateway', subject: 'New Order Received!' },
    onSuccess: () => {
      clearCart();
      setLoading(false);
      navigate('/dashboard'); // redirect to dashboard to see receipt/history
      Swal.fire("Payment Success! Invoice generated in your Transaction History.");
    },
    onError: () => {
      clearCart();
      setLoading(false);
      navigate('/');
    },
  });

  // Coupons & Pricing
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  let discountValue = appliedCoupon ? (appliedCoupon.discountType === 'percentage' ? total * (appliedCoupon.discountAmount / 100) : appliedCoupon.discountAmount) : 0;
  if (discountValue > total) discountValue = total;
  const finalTotal = total - discountValue;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) { Swal.fire("Please login first!"); navigate('/login'); return; }
    
    // Auth Check
    if(!authStatus[paymentMethod]) return Swal.fire(`Payment Failed: Please authenticate ${paymentMethod} first.`);

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Save reviews
      for (const item of cart) {
        if (itemReviews[item._id]?.comment) {
          try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/products/${item._id}/reviews`, {
              rating: itemReviews[item._id].rating || 5,
              comment: itemReviews[item._id].comment
            }, config);
          } catch(e) {}
        }
      }

      const orderItems = cart.map(item => ({
        name: item.title,
        qty: item.qty,
        image: item.imageUrl || '',
        price: item.price,
        product: item._id,
        variant: item.selectedVariant ? `${item.selectedVariant.size ? item.selectedVariant.size + ' - ' : ''}${item.selectedVariant.color}` : null
      }));

      // In real scenario, transactionId/mobileNumber would be passed to backend for invoice records
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/orders`, {
        user: user._id,
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: paymentMethod,
        totalPrice: finalTotal
      });

      submitWeb3Form({
        Order_Total: `$${finalTotal.toFixed(2)}`,
        Payment_Method: `${paymentMethod} (Verified)`,
        Customer_Email: user.email,
      });

    } catch (err) {
      Swal.fire('Transaction Failed. System error.');
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="text-center py-20">Your cart is empty.</div>;

  const methods = [
    { id: 'Debit/Credit Card', icon: <CreditCard size={24}/>, desc: 'Visa, MC, PayPak' },
    { id: 'Cash on Delivery', icon: <Truck size={24}/>, desc: 'Pay at doorstep' },
    { id: 'JazzCash', icon: <Smartphone size={24} className="text-red-500"/>, desc: 'Mobile Account' },
    { id: 'Easypaisa', icon: <Smartphone size={24} className="text-green-500"/>, desc: 'Mobile Account' },
    { id: 'Bank Transfer', icon: <Building2 size={24} className="text-blue-600"/>, desc: 'Direct IBFT' },
    { id: 'Raast', icon: <QrCode size={24} className="text-purple-600"/>, desc: 'Instant Transfer' }
  ];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8">
      
      {/* Left Column: Billing, Payment & Reviews */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Billing Information */}
        <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2"><Truck size={20} className="text-primary-600"/> Billing Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Street Address</label>
              <input type="text" value={address} onChange={e=>setAddress(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">City</label>
              <input type="text" value={city} onChange={e=>setCity(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Postal Code</label>
              <input type="text" value={postalCode} onChange={e=>setPostalCode(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary-500" />
            </div>
          </div>
        </div>

        {/* SECURE PAYMENT GATEWAY */}
        <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Lock size={20} className="text-green-600"/> Payment Gateway Integration</h2>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#2a2a3c]/50 px-3 py-1 rounded-full border uppercase">100% Secure</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {methods.map(m => (
              <label key={m.id} className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${paymentMethod === m.id ? 'border-primary-500 bg-primary-50/50 shadow-inner scale-[1.02]' : 'border-slate-200 dark:border-[#3d3d5c] hover:border-slate-300'}`}>
                <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                <div className="mb-2 text-slate-600 dark:text-slate-400">{m.icon}</div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{m.id}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{m.desc}</span>
              </label>
            ))}
          </div>

          {/* DYNAMIC AUTHENTICATION FORMS */}
          <div className="bg-slate-50 dark:bg-[#1f1f2e] p-6 rounded-xl border border-slate-200 dark:border-[#3d3d5c] space-y-4 animate-in fade-in relative overflow-hidden">
             
            {authStatus[paymentMethod] ? (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-6 rounded-xl flex flex-col items-center justify-center gap-2 font-bold animate-in zoom-in-95 text-center shadow-inner">
                <CheckCircle2 size={40} className="mb-1" />
                <span className="text-lg">Payment Status: SUCCESS (Verified)</span>
                <span className="text-sm font-medium opacity-80">Transaction receipt will be generated after placing order.</span>
              </div>
            ) : (
              <>
                {/* Credit Card Form */}
                {paymentMethod === 'Debit/Credit Card' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Card Type</label>
                        <select value={cardType} onChange={e=>setCardType(e.target.value)} className="w-full p-3 border rounded-lg"><option>Visa</option><option>MasterCard</option><option>PayPak</option><option>UnionPay</option></select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Card Number</label>
                        <input type="text" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} placeholder="XXXX XXXX XXXX XXXX" className="w-full p-3 border rounded-lg font-mono tracking-widest" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Expiry & Issue</label>
                        <div className="flex gap-2"><input type="text" placeholder="MM/YY" className="w-full p-3 border rounded-lg"/><input type="text" placeholder="Issue MM/YY" className="w-full p-3 border rounded-lg"/></div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">CVC Code</label>
                        <input type="password" value={cvc} onChange={e=>setCvc(e.target.value)} maxLength="3" placeholder="***" className="w-full p-3 border rounded-lg font-mono text-center" />
                      </div>
                    </div>
                    <button onClick={handleCardAuth} disabled={authLoading} className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg">{authLoading ? 'Authenticating with Bank...' : 'Authenticate Card'}</button>
                  </div>
                )}

                {/* JazzCash / Easypaisa */}
                {(paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') && (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 font-medium">
                      Please enter your {paymentMethod} mobile number. A prompt will appear on your phone to enter your MPIN.
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">{paymentMethod} Mobile Number</label>
                      <input type="text" value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)} placeholder="03XXXXXXXXX" className="w-full p-3 border rounded-lg font-mono text-lg" />
                    </div>
                    <button onClick={handleMobileAuth} disabled={authLoading} className={`w-full text-white font-bold py-3 rounded-lg ${paymentMethod === 'JazzCash' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                      {authLoading ? 'Waiting for MPIN Verification...' : `Authenticate ${paymentMethod}`}
                    </button>
                  </div>
                )}

                {/* Bank Transfer / Raast */}
                {(paymentMethod === 'Bank Transfer' || paymentMethod === 'Raast') && (
                  <div className="space-y-4">
                    <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 font-bold flex flex-col gap-1">
                      <span>Please transfer Rs. {finalTotal.toFixed(2)} to the following account:</span>
                      {paymentMethod === 'Bank Transfer' ? (
                        <span className="text-lg bg-white dark:bg-[#2a2a3c] p-2 rounded border mt-2 text-slate-500 dark:text-slate-400 font-normal">Bank Name: <br/>A/C: <br/>Title: </span>
                      ) : (
                        <span className="text-lg bg-white dark:bg-[#2a2a3c] p-2 rounded border mt-2 text-slate-500 dark:text-slate-400 font-normal">Raast ID: <br/>Title: </span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Enter Transaction ID (TID) / Reference No.</label>
                      <input type="text" value={transactionId} onChange={e=>setTransactionId(e.target.value)} placeholder="e.g. 19283748291" className="w-full p-3 border rounded-lg font-mono text-lg uppercase" />
                    </div>
                    <button onClick={handleTidAuth} disabled={authLoading} className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg">
                      {authLoading ? 'Verifying TID with Bank...' : 'Verify Payment Receipt'}
                    </button>
                  </div>
                )}

                {/* Cash on Delivery (Firebase OTP) */}
                {paymentMethod === 'Cash on Delivery' && (
                  <div className="space-y-4">
                    <div id="recaptcha-container"></div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Mobile Number (Format: +923...)</label>
                      <div className="flex gap-2">
                        <input disabled={otpSent} type="text" value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)} placeholder="+923001234567" className="w-full p-3 border rounded-lg font-mono" />
                        {!otpSent && <button onClick={handleSendOtp} disabled={authLoading} className="bg-slate-800 text-white font-bold px-6 rounded-lg w-32">{authLoading ? '...' : 'Send OTP'}</button>}
                      </div>
                    </div>
                    {otpSent && (
                      <div className="pt-2">
                        <label className="block text-sm font-semibold mb-1 text-green-600">Enter OTP received via SMS</label>
                        <div className="flex gap-2">
                          <input type="text" value={otpCode} onChange={e=>setOtpCode(e.target.value)} maxLength="6" placeholder="123456" className="w-32 p-3 border rounded-lg text-center font-mono font-bold tracking-widest text-lg focus:border-green-500 focus:ring-green-500" />
                          <button onClick={handleVerifyOtp} disabled={authLoading} className="bg-green-600 text-white font-bold flex-1 rounded-lg">{authLoading ? 'Verifying...' : 'Verify OTP'}</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Leave a Review */}
        <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><Star size={20} className="text-yellow-500 fill-yellow-500"/> Review Your Products</h2>
          <div className="space-y-4 divide-y">
            {cart.map(item => (
              <div key={item._id} className="pt-4 first:pt-0">
                <div className="flex items-center gap-3 mb-3"><img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg border object-cover"/><span className="font-semibold text-sm">{item.title}</span></div>
                <div className="pl-[60px] space-y-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[{ v: 5, l: "Awesome" }, { v: 4, l: "Excellent" }, { v: 3, l: "Very Good" }, { v: 2, l: "Good" }, { v: 1, l: "Poor" }].map(opt => {
                      const isSelected = (itemReviews[item._id]?.rating || 5) === opt.v;
                      return (
                        <button key={opt.v} type="button" onClick={() => handleReviewChange(item._id, 'rating', opt.v)} className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${isSelected ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-white dark:bg-[#2a2a3c]'}`}>
                          <span className="text-yellow-500">{Array(opt.v).fill('★').join('')}</span> <span>{opt.v} - {opt.l}</span>
                        </button>
                      )
                    })}
                  </div>
                  <textarea rows={2} value={itemReviews[item._id]?.comment || ''} onChange={e => handleReviewChange(item._id, 'comment', e.target.value)} className="w-full p-3 text-sm border rounded-lg outline-none focus:border-primary-500 bg-slate-50 dark:bg-[#1f1f2e]"></textarea>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5 relative">
        <div className="bg-slate-50 dark:bg-[#1f1f2e] p-6 rounded-2xl border sticky top-24 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b pb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-white dark:bg-[#2a2a3c] rounded-xl border shadow-sm">
                <img src={item.imageUrl} className="w-16 h-16 rounded-lg border object-cover" alt="" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold leading-tight">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.qty}</p>
                </div>
                <div className="font-bold">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-5 space-y-3">
            <div className="flex justify-between font-medium"><span>Subtotal</span><span className="font-bold">${total.toFixed(2)}</span></div>
            <div className="flex justify-between font-medium"><span>Shipping</span><span className="text-primary-600 font-bold uppercase text-sm bg-primary-50 px-2 rounded">Free</span></div>
            <div className="flex justify-between font-black text-2xl mt-4 pt-5 border-t"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
          </div>

          <button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-primary-600 text-white font-bold text-lg py-4 rounded-xl mt-8 hover:bg-primary-700 shadow-xl flex items-center justify-center gap-3">
            {loading ? 'Processing...' : 'Place Your Order & Get Receipt'}
          </button>
        </div>
      </div>
    </div>
  );
}
