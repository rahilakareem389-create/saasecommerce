import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => { const savedCart = localStorage.getItem('cart'); return savedCart ? JSON.parse(savedCart) : []; });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === product._id && (item.selectedVariant?.color === product.selectedVariant?.color));
      if (existing) {
        const qtyToAdd = product.qty || 1;
        return prev.map(item => (item._id === product._id && item.selectedVariant?.color === product.selectedVariant?.color) ? { ...item, qty: item.qty + qtyToAdd } : item);
      }
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, variantColor, newQty) => {
    if (newQty < 1) return;
    setCart((prev) => 
      prev.map(item => 
        (item._id === productId && item.selectedVariant?.color === variantColor) 
          ? { ...item, qty: newQty } 
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

