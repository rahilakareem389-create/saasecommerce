import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <h2 className="text-xl text-slate-600 mb-4">Your cart is empty</h2>
          <Link to="/" className="text-primary-600 font-medium hover:underline">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item._id} className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
                <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h3>
                  {item.selectedVariant && (
                    <p className="text-sm text-slate-500 mb-2">
                      Variant: {item.selectedVariant.size && `[${item.selectedVariant.size}]`} {item.selectedVariant.color}
                    </p>
                  )}
                  <div className="text-slate-500 text-sm mb-2">Qty: {item.qty}</div>
                  <div className="font-bold text-primary-600">${item.price}</div>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Order Summary</h3>
            <div className="flex justify-between text-slate-600 mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg text-slate-900 mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="w-full block text-center bg-primary-600 text-white font-medium py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
