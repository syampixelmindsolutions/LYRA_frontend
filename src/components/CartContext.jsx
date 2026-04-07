
// import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
// import axios from "axios";

// const CartContext = createContext({
//   cartItems: [], addToCart: () => {}, removeFromCart: () => {},
//   updateQuantity: () => {}, clearCart: () => {},
//   cartCount: 0, cartTotal: 0, shippingFee: 0, grandTotal: 0, loadingCart: false,
// });

// // ── NO trailing slash ─────────────────────────────────────────────
// const API = axios.create({
//   baseURL: "http://localhost:6055/api/cart",
// });

// // 🔥 FIXED INTERCEPTOR
// API.interceptors.request.use((config) => {
//   const stored = sessionStorage.getItem("user");

//   if (stored) {
//     const user = JSON.parse(stored);

//     if (user?.token) {
//       config.headers = {
//         ...config.headers,
//         Authorization: `Bearer ${user.token}`,
//       };
//     } 
//   } 

//   return config;
// });

// const getToken = () => {
//   try {
//     const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//     return user.token || null;
//   } catch {
//     return null;
//   }
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems,   setCartItems]   = useState([]);
//   const [loadingCart, setLoadingCart] = useState(false);

//   // ── Load cart — ONLY if token exists ────────────────────────────
//   // Same reason as WishlistContext: providers mount before login happens.
//   // Without this check every page load triggers a 401.
//   const loadCart = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       // Not logged in — load from localStorage (guest cart)
//       const stored = localStorage.getItem("cart");
//       if (stored) {
//         try { setCartItems(JSON.parse(stored)); } catch {}
//       }
//       return;
//     }

//     setLoadingCart(true);
//     try {
//       // GET /api/cart  (no trailing slash)
//       const { data } = await API.get("");
//       setCartItems(Array.isArray(data) ? data : data.items || []);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setCartItems([]);
//       } else {
//         console.error("Cart load error:", err.response?.data || err.message);
//         // Fallback to localStorage
//         const stored = localStorage.getItem("cart");
//         if (stored) {
//           try { setCartItems(JSON.parse(stored)); } catch {}
//         }
//       }
//     } finally {
//       setLoadingCart(false);
//     }
//   }, []);

//   useEffect(() => { loadCart(); }, [loadCart]);

//   // ── Add to cart ──────────────────────────────────────────────────
//   // POST /api/cart  body: { productId, size, color, quantity }
//   const addToCart = async (product, size, color, quantity = 1) => {
//     const productId = String(product._id || product.id);

//     // Optimistic update
//     setCartItems((prev) => {
//       const exists = prev.find(
//         (i) => String(i.productId || i._id || i.id) === productId &&
//                i.size === size && i.color === color
//       );
//       if (exists) {
//         return prev.map((i) =>
//           String(i.productId || i._id || i.id) === productId && i.size === size && i.color === color
//             ? { ...i, quantity: i.quantity + quantity }
//             : i
//         );
//       }
//       const localId = `local-${productId}-${size}-${color}-${Date.now()}`;
//       return [...prev, { ...product, productId, size, color, quantity, _id: localId, cartItemId: localId }];
//     });

//     const token = getToken();
//     if (!token) {
//       // Guest: persist to localStorage
//       setCartItems((current) => {
//         localStorage.setItem("cart", JSON.stringify(current));
//         return current;
//       });
//       return;
//     }

//     try {
//       // POST /api/cart  (no trailing slash)
//       const { data } = await API.post("", { productId, size, color, quantity });
//       setCartItems(Array.isArray(data) ? data : data.items || []);
//     } catch (err) {
//       console.error("Add to cart error:", err.response?.data || err.message);
//     }
//   };

//   // ── Update quantity ──────────────────────────────────────────────
//   // PUT /api/cart/:cartItemId  body: { quantity }
//   const updateQuantity = async (cartItemId, quantity) => {
//     if (quantity <= 0) { removeFromCart(cartItemId); return; }

//     // Optimistic update
//     setCartItems((prev) =>
//       prev.map((i) =>
//         String(i._id || i.cartItemId) === String(cartItemId) ? { ...i, quantity } : i
//       )
//     );

//     if (!getToken()) return;

//     try {
//       const { data } = await API.put(`/${cartItemId}`, { quantity });
//       setCartItems(Array.isArray(data) ? data : data.items || []);
//     } catch (err) {
//       console.error("Update cart error:", err.response?.data || err.message);
//     }
//   };

//   // ── Remove item ──────────────────────────────────────────────────
//   // DELETE /api/cart/:cartItemId
//   const removeFromCart = async (cartItemId) => {
//     // Optimistic update
//     setCartItems((prev) =>
//       prev.filter((i) => String(i._id || i.cartItemId) !== String(cartItemId))
//     );

//     if (!getToken()) return;

//     try {
//       const { data } = await API.delete(`/${cartItemId}`);
//       setCartItems(Array.isArray(data) ? data : data.items || []);
//     } catch (err) {
//       console.error("Remove from cart error:", err.response?.data || err.message);
//     }
//   };

//   // ── Clear cart ───────────────────────────────────────────────────
//   // DELETE /api/cart
//   const clearCart = async () => {
//     setCartItems([]);
//     localStorage.removeItem("cart");

//     if (!getToken()) return;

//     try {
//       // DELETE /api/cart  (no trailing slash)
//       await API.delete("");
//     } catch (err) {
//       console.error("Clear cart error:", err.response?.data || err.message);
//     }
//   };

//   // ── Computed values ──────────────────────────────────────────────
//   const cartCount   = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);
//   const cartTotal   = useMemo(
//     () => cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0),
//     [cartItems]
//   );
//   const shippingFee = cartTotal >= 999 ? 0 : cartTotal === 0 ? 0 : 60;
//   const grandTotal  = cartTotal + shippingFee;

//   return (
//     <CartContext.Provider value={{
//       cartItems, loadingCart, addToCart, removeFromCart,
//       updateQuantity, clearCart, cartCount, cartTotal, shippingFee, grandTotal,
//       reloadCart: loadCart, // expose for post-login reload
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);


import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const CartContext = createContext();

const API_BASE = "http://localhost:6055/api";

const getAuthHeader = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems]   = useState([]);
  const [loading,   setLoading]     = useState(true);

  // ── Load cart from DB ────────────────────────────────────────────
  // GET /api/cart  → { items: [{ _id, product:{...}, size, color, quantity }] }
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user.token) { setLoading(false); return; }

    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/cart`, { headers: getAuthHeader() });
        const raw = data.items || data || [];
        // Flatten: merge product fields into item
        const items = raw.map((item) => {
          const p = item.product || {};
          return {
            _id:           String(item._id || item.cartItemId),
            cartItemId:    String(item._id || item.cartItemId),
            productId:     String(p._id || item.productId),
            name:          p.name    || item.name,
            brand:         p.brand   || item.brand,
            price:         p.price   || item.price,
            originalPrice: p.originalPrice || item.originalPrice,
            image:         p.image   || item.image,
            images:        p.images  || item.images || [],
            size:          item.size,
            color:         item.color,
            quantity:      item.quantity,
          };
        });
        setCartItems(items);
      } catch (err) {
        console.warn("Cart fetch:", err.message);
        const local = JSON.parse(localStorage.getItem("lyra_cart") || "[]");
        setCartItems(local);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // ── Add to cart ──────────────────────────────────────────────────
  // POST /api/cart  { productId, size, color, quantity }
  // → { message, cart: { items: [...] } }
  const addToCart = useCallback(async (product, size, color, qty = 1) => {
    const tempId = `temp-${Date.now()}`;
    const newItem = {
      _id: tempId, cartItemId: tempId,
      productId: String(product._id),
      name: product.name, brand: product.brand,
      price: product.price, originalPrice: product.originalPrice,
      image: product.image, images: product.images || [],
      size, color, quantity: qty,
    };

    // Optimistic
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === String(product._id) && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map((i) =>
          i._id === existing._id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, newItem];
    });

    try {
      const { data } = await axios.post(
        `${API_BASE}/cart`,
        { productId: String(product._id), size, color, quantity: qty },
        { headers: getAuthHeader() }
      );
      // Re-fetch to get real IDs
      const raw = data.cart?.items || data.items || [];
      const items = raw.map((item) => {
        const p = item.product || {};
        return {
          _id: String(item._id), cartItemId: String(item._id),
          productId: String(p._id || item.productId),
          name: p.name || item.name, brand: p.brand || item.brand,
          price: p.price || item.price, originalPrice: p.originalPrice || item.originalPrice,
          image: p.image || item.image, images: p.images || item.images || [],
          size: item.size, color: item.color, quantity: item.quantity,
        };
      });
      setCartItems(items);
    } catch (err) {
      console.error("Add to cart:", err.message);
    }
  }, []);

  // ── Update quantity ──────────────────────────────────────────────
  // PUT /api/cart/:cartItemId  { quantity }
  const updateQuantity = useCallback(async (cartItemId, qty) => {
    if (qty < 1) { removeFromCart(cartItemId); return; }
    setCartItems((prev) =>
      prev.map((i) => String(i._id) === String(cartItemId) ? { ...i, quantity: qty } : i)
    );
    try {
      await axios.put(
        `${API_BASE}/cart/${cartItemId}`,
        { quantity: qty },
        { headers: getAuthHeader() }
      );
    } catch (err) {
      console.error("Update qty:", err.message);
    }
  }, []);

  // ── Remove from cart ─────────────────────────────────────────────
  // DELETE /api/cart/:cartItemId
  const removeFromCart = useCallback(async (cartItemId) => {
    setCartItems((prev) => prev.filter((i) => String(i._id) !== String(cartItemId)));
    try {
      await axios.delete(`${API_BASE}/cart/${cartItemId}`, { headers: getAuthHeader() });
    } catch (err) {
      console.error("Remove from cart:", err.message);
    }
  }, []);

  // ── Clear cart ───────────────────────────────────────────────────
  // DELETE /api/cart  or  POST /api/cart/clear
  const clearCart = useCallback(async () => {
    setCartItems([]);
    try {
      await axios.delete(`${API_BASE}/cart`, { headers: getAuthHeader() });
    } catch {
      try {
        await axios.post(`${API_BASE}/cart/clear`, {}, { headers: getAuthHeader() });
      } catch (err) {
        console.error("Clear cart:", err.message);
      }
    }
  }, []);

  const cartTotal   = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = cartTotal > 999 ? 0 : 79;
  const grandTotal  = cartTotal + shippingFee;

  return (
    <CartContext.Provider value={{
      cartItems, cartCount: cartItems.reduce((s, i) => s + i.quantity, 0),
      cartTotal, shippingFee, grandTotal,
      addToCart, removeFromCart, updateQuantity, clearCart, loading,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;