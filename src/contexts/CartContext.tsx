import React, { createContext, useContext, useState, useCallback } from "react";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (name: string, price: number) => void;
  removeFromCart: (name: string) => void;
  updateQuantity: (name: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({ items: [], count: 0, total: 0, addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {} });

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((name: string, price: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.name === name);
      if (existing) {
        return prev.map(i => i.name === name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { name, price, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((name: string) => {
    setItems(prev => prev.filter(i => i.name !== name));
  }, []);

  const updateQuantity = useCallback((name: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.name !== name));
    } else {
      setItems(prev => prev.map(i => i.name === name ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
