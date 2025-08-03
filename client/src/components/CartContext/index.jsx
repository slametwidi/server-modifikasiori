import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ products: [] });

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  const fetchCart = async () => {
    try {
      const res = await fetch(`${base}/api/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error('Fetch cart gagal:', err);
      setCart({ products: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const refreshCart = fetchCart;

  const clearCart = () => {
    setCart({ products: [] });
  };

  return (
    <CartContext.Provider value={{ cart, setCart, refreshCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
