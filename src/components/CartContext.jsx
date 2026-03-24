import React, { createContext, useContext, useState, useEffect, useMemo } from "react";


// ── Create context with safe defaults ────────
const CartContext = createContext({
  cartItems:      [],
  addToCart:      () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart:      () => {},
  cartCount:      0,
  cartTotal:      0,
  shippingFee:    0,
  grandTotal:     0,
});

// ── Provider ──────────────────────────────────
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

    
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);


  // Add item — merges if same product + size + color
  const addToCart = (product, size, color, quantity = 1) => {
    setCartItems((prev) => {
      const exists = prev.find(
        (i) => i.id === product.id && i.size === size && i.color === color
      );
      if (exists) {
        return prev.map((i) =>
          i.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          ...product,
          size,
          color,
          quantity,
          cartItemId: `${product.id}-${size}-${color}-${Date.now()}`,
        },
      ];
    });
  };

  // Remove one item by cartItemId
  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  // Update quantity — removes if 0
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) { removeFromCart(cartItemId); return; }
    setCartItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    );
  };

  // Clear all
  const clearCart = () => setCartItems([]);

  // Computed values
  const cartCount   = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal   = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems]);
  const shippingFee = cartTotal >= 999 ? 0 : cartTotal === 0 ? 0 : 60;
  const grandTotal  = cartTotal + shippingFee;
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        shippingFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────
export const useCart = () => useContext(CartContext);