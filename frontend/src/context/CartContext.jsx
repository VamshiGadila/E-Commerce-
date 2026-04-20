import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { isLoggedIn, token } = useAuth();

  const refreshCount = async () => {
    if (!isLoggedIn) {
      setCartCount(0);
      return;
    }

    try {
      const { data } = await cartAPI.getCount();
      setCartCount(data.count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCount();
  }, [isLoggedIn, token]); // ✅ correct dependency

  return (
    <CartContext.Provider value={{ cartCount, refreshCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);