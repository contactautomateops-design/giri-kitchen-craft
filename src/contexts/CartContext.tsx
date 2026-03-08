import React, { createContext, useContext, useState, useCallback } from "react";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  addToCart: (name: string, price: number) => void;
}

const CartContext = createContext<CartContextType>({ items: [], count: 0, addToCart: () => {} });

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

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
