// Cart state. For guests we keep it in localStorage.
// For logged-in users we sync with the backend.
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Keep guest cart in localStorage
  useEffect(() => {
    if (!user) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, user]);

  // When user logs in, load their server cart
  useEffect(() => {
    if (user) {
      api.get("/cart").then(({ data }) => {
        const mapped = data.items.map((i) => ({
          product: i.product,
          qty: i.qty,
        }));
        setItems(mapped);
      });
    }
  }, [user]);

  const addToCart = async (product, qty = 1) => {
    if (user) {
      const { data } = await api.post("/cart", { productId: product._id, qty });
      setItems(data.items.map((i) => ({ product: i.product, qty: i.qty })));
    } else {
      setItems((prev) => {
        const existing = prev.find((i) => i.product._id === product._id);
        if (existing)
          return prev.map((i) =>
            i.product._id === product._id ? { ...i, qty: i.qty + qty } : i
          );
        return [...prev, { product, qty }];
      });
    }
  };

  const updateQty = async (productId, qty) => {
    if (user) {
      const { data } = await api.put(`/cart/${productId}`, { qty });
      setItems(data.items.map((i) => ({ product: i.product, qty: i.qty })));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product._id === productId ? { ...i, qty: Math.max(1, qty) } : i))
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      const { data } = await api.delete(`/cart/${productId}`);
      setItems(data.items.map((i) => ({ product: i.product, qty: i.qty })));
    } else {
      setItems((prev) => prev.filter((i) => i.product._id !== productId));
    }
  };

  const clearCart = () => setItems([]);

  // Derived totals
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * (i.product?.price || 0), 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}
