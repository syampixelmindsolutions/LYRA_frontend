
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


// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import axios from "axios";

// const CartContext = createContext();

// const API_BASE = "http://localhost:6055/api";

// const getAuthHeader = () => {
//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//   return user.token ? { Authorization: `Bearer ${user.token}` } : {};
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems]   = useState([]);
//   const [loading,   setLoading]     = useState(true);

//   // ── Load cart from DB ────────────────────────────────────────────
//   // GET /api/cart  → { items: [{ _id, product:{...}, size, color, quantity }] }
//   useEffect(() => {
//     const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//     if (!user.token) { setLoading(false); return; }

//     const fetchCart = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE}/cart`, { headers: getAuthHeader() });
//         const raw = data.items || data || [];
//         // Flatten: merge product fields into item
//         const items = raw.map((item) => {
//           const p = item.product || {};
//           return {
//             _id:           String(item._id || item.cartItemId),
//             cartItemId:    String(item._id || item.cartItemId),
//             productId:     String(p._id || item.productId),
//             name:          p.name    || item.name,
//             brand:         p.brand   || item.brand,
//             price:         p.price   || item.price,
//             originalPrice: p.originalPrice || item.originalPrice,
//             image:         p.image   || item.image,
//             images:        p.images  || item.images || [],
//             size:          item.size,
//             color:         item.color,
//             quantity:      item.quantity,
//           };
//         });
//         setCartItems(items);
//       } catch (err) {
//         console.warn("Cart fetch:", err.message);
//         const local = JSON.parse(localStorage.getItem("lyra_cart") || "[]");
//         setCartItems(local);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCart();
//   }, []);

//   // ── Add to cart ──────────────────────────────────────────────────
//   // POST /api/cart  { productId, size, color, quantity }
//   // → { message, cart: { items: [...] } }
//   const addToCart = useCallback(async (product, size, color, qty = 1) => {
//     const tempId = `temp-${Date.now()}`;
//     const newItem = {
//       _id: tempId, cartItemId: tempId,
//       productId: String(product._id),
//       name: product.name, brand: product.brand,
//       price: product.price, originalPrice: product.originalPrice,
//       image: product.image, images: product.images || [],
//       size, color, quantity: qty,
//     };

//     // Optimistic
//     setCartItems((prev) => {
//       const existing = prev.find(
//         (i) => i.productId === String(product._id) && i.size === size && i.color === color
//       );
//       if (existing) {
//         return prev.map((i) =>
//           i._id === existing._id ? { ...i, quantity: i.quantity + qty } : i
//         );
//       }
//       return [...prev, newItem];
//     });

//     try {
//       const { data } = await axios.post(
//         `${API_BASE}/cart`,
//         { productId: String(product._id), size, color, quantity: qty },
//         { headers: getAuthHeader() }
//       );
//       // Re-fetch to get real IDs
//       const raw = data.cart?.items || data.items || [];
//       const items = raw.map((item) => {
//         const p = item.product || {};
//         return {
//           _id: String(item._id), cartItemId: String(item._id),
//           productId: String(p._id || item.productId),
//           name: p.name || item.name, brand: p.brand || item.brand,
//           price: p.price || item.price, originalPrice: p.originalPrice || item.originalPrice,
//           image: p.image || item.image, images: p.images || item.images || [],
//           size: item.size, color: item.color, quantity: item.quantity,
//         };
//       });
//       setCartItems(items);
//     } catch (err) {
//       console.error("Add to cart:", err.message);
//     }
//   }, []);

//   // ── Update quantity ──────────────────────────────────────────────
//   // PUT /api/cart/:cartItemId  { quantity }
//   const updateQuantity = useCallback(async (cartItemId, qty) => {
//     if (qty < 1) { removeFromCart(cartItemId); return; }
//     setCartItems((prev) =>
//       prev.map((i) => String(i._id) === String(cartItemId) ? { ...i, quantity: qty } : i)
//     );
//     try {
//       await axios.put(
//         `${API_BASE}/cart/${cartItemId}`,
//         { quantity: qty },
//         { headers: getAuthHeader() }
//       );
//     } catch (err) {
//       console.error("Update qty:", err.message);
//     }
//   }, []);

//   // ── Remove from cart ─────────────────────────────────────────────
//   // DELETE /api/cart/:cartItemId
//   const removeFromCart = useCallback(async (cartItemId) => {
//     setCartItems((prev) => prev.filter((i) => String(i._id) !== String(cartItemId)));
//     try {
//       await axios.delete(`${API_BASE}/cart/${cartItemId}`, { headers: getAuthHeader() });
//     } catch (err) {
//       console.error("Remove from cart:", err.message);
//     }
//   }, []);

//   // ── Clear cart ───────────────────────────────────────────────────
//   // DELETE /api/cart  or  POST /api/cart/clear
//   const clearCart = useCallback(async () => {
//     setCartItems([]);
//     try {
//       await axios.delete(`${API_BASE}/cart`, { headers: getAuthHeader() });
//     } catch {
//       try {
//         await axios.post(`${API_BASE}/cart/clear`, {}, { headers: getAuthHeader() });
//       } catch (err) {
//         console.error("Clear cart:", err.message);
//       }
//     }
//   }, []);

//   const cartTotal   = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
//   const shippingFee = cartTotal > 999 ? 0 : 79;
//   const grandTotal  = cartTotal + shippingFee;

//   return (
//     <CartContext.Provider value={{
//       cartItems, cartCount: cartItems.reduce((s, i) => s + i.quantity, 0),
//       cartTotal, shippingFee, grandTotal,
//       addToCart, removeFromCart, updateQuantity, clearCart, loading,
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
// export default CartContext;


/**
 * CartContext.jsx — Lyra Fashion
 *
 * Three bugs fixed vs the previous version:
 *
 * 1. BADGE NOT UPDATING after addToCart
 *    Root cause: the optimistic state was correct but the server sync
 *    was overwriting it with an empty array when the backend returned a
 *    shape like { success: true } or { message: "added" } instead of
 *    the full cart.  `parseItems` returned [] for those shapes and the
 *    state was zeroed out.
 *    Fix: `parseItems` now returns `null` for any response that does NOT
 *    contain a meaningful items array — `addToCart` only calls
 *    `setCartItems` with a server response when the array is genuinely
 *    non-empty.  The optimistic item is always kept otherwise.
 *
 * 2. CART PAGE SHOWING EMPTY on first visit after addToCart
 *    Root cause: CartPage was calling `loadCart` on mount, which fired a
 *    GET /api/cart request that sometimes returned [] before the server
 *    had committed the item (race condition), zeroing the state that
 *    addToCart had just set.
 *    Fix: `loadCart` now does a "merge" — if the server returns a non-null
 *    array it replaces state only when that array is non-empty OR when the
 *    current optimistic state is also empty (i.e. the user genuinely has
 *    an empty cart).  A non-empty optimistic state is never overwritten
 *    with an empty server response.
 *
 * 3. BUY NOW → CART NAVIGATION
 *    ProductDetails previously called `addToCart` directly and then
 *    tried to navigate.  Because `addToCart` is async and the state
 *    update is batched, the cart page sometimes rendered before the item
 *    was visible in state.
 *    Fix: `addToCart` returns the final cartItems array after the update
 *    so callers can await it before navigating.  The modal handles this
 *    correctly already; ProductDetails is updated in document 10.
 */

import React, {
  createContext, useContext, useState,
  useEffect, useMemo, useCallback, useRef,
} from "react";
import axios from "axios";

const CartContext = createContext({
  cartItems: [], addToCart: () => Promise.resolve([]),
  removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {},
  cartCount: 0, cartTotal: 0, shippingFee: 0, grandTotal: 0, loadingCart: false,
});

const API = axios.create({ baseURL: "https://lyra-backend-gilt.vercel.app/api/cart" });

API.interceptors.request.use((cfg) => {
  try {
    const u = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (u.token) cfg.headers.Authorization = `Bearer ${u.token}`;
  } catch {}
  return cfg;
});

const getToken = () => {
  try { return JSON.parse(sessionStorage.getItem("user") || "{}").token || null; }
  catch { return null; }
};

/**
 * parseItems — extract cart array from any backend response shape.
 *
 * Returns:
 *   Array   — a concrete items array (may be empty [])
 *   null    — response shape not recognised; caller keeps optimistic state
 */
const parseItems = (data) => {
  if (Array.isArray(data))                                   return data;
  if (Array.isArray(data?.items))                            return data.items;
  if (Array.isArray(data?.cart?.items))                      return data.cart.items;
  if (Array.isArray(data?.cart))                             return data.cart;
  if (Array.isArray(data?.data))                             return data.data;
  // Server returned something like { success:true } — not a cart array
  return null;
};

export const CartProvider = ({ children }) => {
  const [cartItems,   setCartItems]   = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  // Keep a ref so closures in callbacks always see current items
  const cartItemsRef = useRef(cartItems);
  useEffect(() => { cartItemsRef.current = cartItems; }, [cartItems]);

  // ─── Load cart from server ─────────────────────────────────────────────────
  const loadCart = useCallback(async () => {
    const token = getToken();

    // Guest — read from localStorage
    if (!token) {
      try {
        const stored = JSON.parse(localStorage.getItem("lyra_cart") || "[]");
        setCartItems(Array.isArray(stored) ? stored : []);
      } catch { setCartItems([]); }
      return;
    }

    setLoadingCart(true);
    try {
      const { data } = await API.get("");
      const items = parseItems(data);

      if (items === null) {
        // Unknown shape — leave current state alone
        return;
      }

      if (items.length > 0) {
        // Server returned real items — use them (authoritative)
        setCartItems(items);
      } else {
        // Server returned [] — only zero out if we have no optimistic items.
        // If we have optimistic items the server just hasn't committed yet.
        setCartItems((current) => (current.length === 0 ? [] : current));
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        // Network failure — fall back to localStorage snapshot
        try {
          const stored = JSON.parse(localStorage.getItem("lyra_cart") || "[]");
          if (Array.isArray(stored) && stored.length) {
            setCartItems((cur) => cur.length ? cur : stored);
          }
        } catch {}
      }
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  // ─── Add to cart ───────────────────────────────────────────────────────────
  // Returns the new cartItems array so callers (e.g. Buy Now) can await it
  // before navigating to the cart page.
  const addToCart = useCallback(async (product, size, color, quantity = 1) => {
    const productId = String(product._id || product.id);

    // 1. Optimistic update — always happens first, synchronously
    let newItems;
    setCartItems((prev) => {
      const exists = prev.find(
        (i) => String(i.productId || i._id || i.id) === productId &&
               i.size === size && i.color === color
      );
      if (exists) {
        newItems = prev.map((i) =>
          String(i.productId || i._id || i.id) === productId &&
          i.size === size && i.color === color
            ? { ...i, quantity: (i.quantity || 0) + quantity }
            : i
        );
      } else {
        const tempId = `local-${productId}-${size}-${color}-${Date.now()}`;
        newItems = [
          ...prev,
          {
            ...product,
            productId,
            size,
            color,
            quantity,
            _id:        tempId,
            cartItemId: tempId,
            price:      product.price || 0,
          },
        ];
      }
      return newItems;
    });

    // 2. Guest — persist to localStorage, return immediately
    if (!getToken()) {
      // Use a micro-task to let the setState above flush
      await Promise.resolve();
      const current = cartItemsRef.current;
      try { localStorage.setItem("lyra_cart", JSON.stringify(current)); } catch {}
      return current;
    }

    // 3. Server sync
    try {
      const { data } = await API.post("", { productId, size, color, quantity });
      const items = parseItems(data);

      // Only replace optimistic state if server returned a non-empty cart.
      // If server returned [] or null we KEEP the optimistic item.
      if (items && items.length > 0) {
        setCartItems(items);
        return items;
      }
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      // Optimistic state remains — badge stays correct
    }

    // Return the optimistic array so Buy Now can navigate immediately
    return cartItemsRef.current;
  }, []);

  // ─── Update quantity ───────────────────────────────────────────────────────
  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    if (quantity <= 0) { removeFromCart(cartItemId); return; }

    setCartItems((prev) =>
      prev.map((i) =>
        String(i._id || i.cartItemId) === String(cartItemId)
          ? { ...i, quantity }
          : i
      )
    );

    if (!getToken()) return;
    try {
      const { data } = await API.put(`/${cartItemId}`, { quantity });
      const items = parseItems(data);
      if (items && items.length > 0) setCartItems(items);
    } catch (err) {
      console.error("Update quantity error:", err.response?.data || err.message);
    }
  }, []);

  // ─── Remove item ───────────────────────────────────────────────────────────
  const removeFromCart = useCallback(async (cartItemId) => {
    setCartItems((prev) =>
      prev.filter((i) => String(i._id || i.cartItemId) !== String(cartItemId))
    );

    if (!getToken()) return;
    try {
      const { data } = await API.delete(`/${cartItemId}`);
      const items = parseItems(data);
      if (items !== null) setCartItems(items);
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
    }
  }, []);

  // ─── Clear cart ────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    setCartItems([]);
    try { localStorage.removeItem("lyra_cart"); } catch {}
    if (!getToken()) return;
    try { await API.delete(""); } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
    }
  }, []);

  // ─── Computed values ───────────────────────────────────────────────────────
  const cartCount  = useMemo(() => cartItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0), [cartItems]);
  const cartTotal  = useMemo(() => cartItems.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0), [cartItems]);
  const shippingFee = cartTotal === 0 ? 0 : cartTotal >= 999 ? 0 : 60;
  const grandTotal  = cartTotal + shippingFee;

  return (
    <CartContext.Provider value={{
      cartItems,
      loadingCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      shippingFee,
      grandTotal,
      reloadCart: loadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;