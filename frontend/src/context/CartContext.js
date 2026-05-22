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

  // Save guest cart
  useEffect(() => {

    if (!user) {
      localStorage.setItem("cart", JSON.stringify(items));
    }

  }, [items, user]);

  // Load cart from backend
  useEffect(() => {

    const fetchCart = async () => {

      try {

        if (!user?.token) return;

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await api.get("/cart", config);

        const mappedItems = data.items.map((item) => ({
          product: item.product,
          qty: item.qty,
        }));

        setItems(mappedItems);

      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();

  }, [user]);

  // Add item
  const addToCart = async (product, qty = 1) => {

    if (user) {

      try {

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await api.post(
          "/cart",
          {
            productId: product._id,
            qty,
          },
          config
        );

        setItems(
          data.items.map((item) => ({
            product: item.product,
            qty: item.qty,
          }))
        );

      } catch (error) {
        console.log(error);
      }

    } else {

      setItems((prev) => {

        const existing = prev.find(
          (item) => item.product._id === product._id
        );

        if (existing) {

          return prev.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  qty: item.qty + qty,
                }
              : item
          );
        }

        return [...prev, { product, qty }];
      });
    }
  };

  // Update quantity
  const updateQty = async (productId, qty) => {

    if (user) {

      try {

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await api.put(
          `/cart/${productId}`,
          { qty },
          config
        );

        setItems(
          data.items.map((item) => ({
            product: item.product,
            qty: item.qty,
          }))
        );

      } catch (error) {
        console.log(error);
      }

    } else {

      setItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? {
                ...item,
                qty: Math.max(1, qty),
              }
            : item
        )
      );
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {

    if (user) {

      try {

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await api.delete(
          `/cart/${productId}`,
          config
        );

        setItems(
          data.items.map((item) => ({
            product: item.product,
            qty: item.qty,
          }))
        );

      } catch (error) {
        console.log(error);
      }

    } else {

      setItems((prev) =>
        prev.filter(
          (item) => item.product._id !== productId
        )
      );
    }
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Total items
  const itemCount = items.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  // Subtotal
  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.qty * (item.product?.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}