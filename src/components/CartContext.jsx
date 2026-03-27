// import React, { createContext, useContext, useState, useEffect, useMemo } from "react";


// // ── Create context with safe defaults ────────
// const CartContext = createContext({
//   cartItems:      [],
//   addToCart:      () => {},
//   removeFromCart: () => {},
//   updateQuantity: () => {},
//   clearCart:      () => {},
//   cartCount:      0,
//   cartTotal:      0,
//   shippingFee:    0,
//   grandTotal:     0,
// });

// // ── Provider ──────────────────────────────────
// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

    
//   useEffect(() => {
//     const stored = localStorage.getItem("cart");
//     if (stored) setCartItems(JSON.parse(stored));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);


//   // Add item — merges if same product + size + color
//   const addToCart = (product, size, color, quantity = 1) => {
//     setCartItems((prev) => {
//       const exists = prev.find(
//         (i) => i.id === product.id && i.size === size && i.color === color
//       );
//       if (exists) {
//         return prev.map((i) =>
//           i.id === product.id && i.size === size && i.color === color
//             ? { ...i, quantity: i.quantity + quantity }
//             : i
//         );
//       }
//       return [
//         ...prev,
//         {
//           ...product,
//           size,
//           color,
//           quantity,
//           cartItemId: `${product.id}-${size}-${color}-${Date.now()}`,
//         },
//       ];
//     });
//   };

//   // Remove one item by cartItemId
//   const removeFromCart = (cartItemId) => {
//     setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
//   };

//   // Update quantity — removes if 0
//   const updateQuantity = (cartItemId, quantity) => {
//     if (quantity <= 0) { removeFromCart(cartItemId); return; }
//     setCartItems((prev) =>
//       prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
//     );
//   };

//   // Clear all
//   const clearCart = () => setCartItems([]);

//   // Computed values
//   const cartCount   = cartItems.reduce((s, i) => s + i.quantity, 0);
//   const cartTotal   = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems]);
//   const shippingFee = cartTotal >= 999 ? 0 : cartTotal === 0 ? 0 : 60;
//   const grandTotal  = cartTotal + shippingFee;
  
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         cartCount,
//         cartTotal,
//         shippingFee,
//         grandTotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // ── Hook ──────────────────────────────────────
// export const useCart = () => useContext(CartContext);


// import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
// import axios from "axios";

// const CartContext = createContext();

// const API = axios.create({
//   baseURL: "http://localhost:6055/api/admin",
// });

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // 🔥 Load cart from backend
//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         const { data } = await API.get("/cart");
//         setCartItems(data);
//       } catch (err) {
//         console.error("Cart load error:", err);
//       }
//     };

//     loadCart();
//   }, []);

//   // 🔥 Add to cart
//   const addToCart = async (product, size, color, quantity = 1) => {
//     try {
//       await API.post("/cart", {
//         productId: product.id,
//         size,
//         color,
//         quantity,
//       });

//       // Refresh cart
//       const { data } = await API.get("/cart");
//       setCartItems(data);

//     } catch (err) {
//       console.error("Add to cart error:", err);
//     }
//   };

//   // 🔥 Remove
//   const removeFromCart = async (cartItemId) => {
//     try {
//       await API.delete(`/cart/${cartItemId}`);

//       setCartItems((prev) =>
//         prev.filter((i) => i._id !== cartItemId)
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🔥 Update quantity
//   const updateQuantity = async (cartItemId, quantity) => {
//     try {
//       if (quantity <= 0) {
//         return removeFromCart(cartItemId);
//       }

//       await API.put(`/cart/${cartItemId}`, { quantity });

//       setCartItems((prev) =>
//         prev.map((i) =>
//           i._id === cartItemId ? { ...i, quantity } : i
//         )
//       );

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       await API.delete("/cart");
//       setCartItems([]);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🔥 Computed values (same)
//   const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

//   const cartTotal = useMemo(
//     () => cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
//     [cartItems]
//   );

//   const shippingFee = cartTotal >= 999 ? 0 : cartTotal === 0 ? 0 : 60;
//   const grandTotal = cartTotal + shippingFee;

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         cartCount,
//         cartTotal,
//         shippingFee,
//         grandTotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);


// import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
// import axios from "axios";

// const CartContext = createContext();

// // ── Cart routes are at /api/cart (NOT /api/admin/cart) ─────────────
// const API = axios.create({
//   baseURL: "http://localhost:6055/api/cart",
// });

// // Attach Bearer token automatically
// API.interceptors.request.use((config) => {
//   const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const token = user.token || "";
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems]       = useState([]);
//   const [loadingCart, setLoadingCart]   = useState(false);

//   // ── Load cart on mount ──────────────────────────────────────────
//   // GET /api/cart → returns flat array of populated cart items
//   useEffect(() => {
//     const loadCart = async () => {
//       setLoadingCart(true);
//       try {
//         const { data } = await API.get("/");
//         setCartItems(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Cart load error:", err.response?.data || err.message);
//       } finally {
//         setLoadingCart(false);
//       }
//     };
//     loadCart();
//   }, []);

//   // ── Add to cart ─────────────────────────────────────────────────
//   // POST /api/cart  body: { productId, size, color, quantity }
//   // Returns: updated flat items array
//   const addToCart = async (product, size, color, quantity = 1) => {
//     const productId = product._id || product.id;
//     try {
//       const { data } = await API.post("/", { productId, size, color, quantity });
//       setCartItems(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Add to cart error:", err.response?.data || err.message);
//     }
//   };

//   // ── Update quantity ─────────────────────────────────────────────
//   // PUT /api/cart/:cartItemId  body: { quantity }
//   // If quantity <= 0 the controller removes the item automatically
//   // Returns: updated flat items array
//   const updateQuantity = async (cartItemId, quantity) => {
//     // Optimistic update
//     if (quantity <= 0) {
//       setCartItems((prev) =>
//         prev.filter((i) => String(i._id || i.cartItemId) !== String(cartItemId))
//       );
//     } else {
//       setCartItems((prev) =>
//         prev.map((i) =>
//           String(i._id || i.cartItemId) === String(cartItemId)
//             ? { ...i, quantity }
//             : i
//         )
//       );
//     }

//     try {
//       const { data } = await API.put(`/${cartItemId}`, { quantity });
//       setCartItems(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Update cart error:", err.response?.data || err.message);
//     }
//   };

//   // ── Remove single item ──────────────────────────────────────────
//   // DELETE /api/cart/:cartItemId
//   // Returns: updated flat items array
//   const removeFromCart = async (cartItemId) => {
//     // Optimistic update
//     setCartItems((prev) =>
//       prev.filter((i) => String(i._id || i.cartItemId) !== String(cartItemId))
//     );

//     try {
//       const { data } = await API.delete(`/${cartItemId}`);
//       setCartItems(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Remove from cart error:", err.response?.data || err.message);
//     }
//   };

//   // ── Clear entire cart ───────────────────────────────────────────
//   // DELETE /api/cart
//   const clearCart = async () => {
//     setCartItems([]); // optimistic
//     try {
//       await API.delete("/");
//     } catch (err) {
//       console.error("Clear cart error:", err.response?.data || err.message);
//     }
//   };

//   // ── Computed values ─────────────────────────────────────────────
//   const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);

//   const cartTotal = useMemo(
//     () => cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0),
//     [cartItems]
//   );

//   const shippingFee = cartTotal >= 999 ? 0 : cartTotal === 0 ? 0 : 60;
//   const grandTotal  = cartTotal + shippingFee;

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         loadingCart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         cartCount,
//         cartTotal,
//         shippingFee,
//         grandTotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

const CartContext = createContext({
  cartItems: [], addToCart: () => {}, removeFromCart: () => {},
  updateQuantity: () => {}, clearCart: () => {},
  cartCount: 0, cartTotal: 0, shippingFee: 0, grandTotal: 0, loadingCart: false,
});

// ── NO trailing slash ─────────────────────────────────────────────
const API = axios.create({
  baseURL: "http://localhost:6055/api/cart",
});

// 🔥 FIXED INTERCEPTOR
API.interceptors.request.use((config) => {
  const stored = sessionStorage.getItem("user");

  if (stored) {
    const user = JSON.parse(stored);

    if (user?.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${user.token}`,
      };
    } 
  } 

  return config;
});

const getToken = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    return user.token || null;
  } catch {
    return null;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems,   setCartItems]   = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  // ── Load cart — ONLY if token exists ────────────────────────────
  // Same reason as WishlistContext: providers mount before login happens.
  // Without this check every page load triggers a 401.
  const loadCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      // Not logged in — load from localStorage (guest cart)
      const stored = localStorage.getItem("cart");
      if (stored) {
        try { setCartItems(JSON.parse(stored)); } catch {}
      }
      return;
    }

    setLoadingCart(true);
    try {
      // GET /api/cart  (no trailing slash)
      const { data } = await API.get("");
      setCartItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setCartItems([]);
      } else {
        console.error("Cart load error:", err.response?.data || err.message);
        // Fallback to localStorage
        const stored = localStorage.getItem("cart");
        if (stored) {
          try { setCartItems(JSON.parse(stored)); } catch {}
        }
      }
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  // ── Add to cart ──────────────────────────────────────────────────
  // POST /api/cart  body: { productId, size, color, quantity }
  const addToCart = async (product, size, color, quantity = 1) => {
    const productId = String(product._id || product.id);

    // Optimistic update
    setCartItems((prev) => {
      const exists = prev.find(
        (i) => String(i.productId || i._id || i.id) === productId &&
               i.size === size && i.color === color
      );
      if (exists) {
        return prev.map((i) =>
          String(i.productId || i._id || i.id) === productId && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      const localId = `local-${productId}-${size}-${color}-${Date.now()}`;
      return [...prev, { ...product, productId, size, color, quantity, _id: localId, cartItemId: localId }];
    });

    const token = getToken();
    if (!token) {
      // Guest: persist to localStorage
      setCartItems((current) => {
        localStorage.setItem("cart", JSON.stringify(current));
        return current;
      });
      return;
    }

    try {
      // POST /api/cart  (no trailing slash)
      const { data } = await API.post("", { productId, size, color, quantity });
      setCartItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
    }
  };

  // ── Update quantity ──────────────────────────────────────────────
  // PUT /api/cart/:cartItemId  body: { quantity }
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) { removeFromCart(cartItemId); return; }

    // Optimistic update
    setCartItems((prev) =>
      prev.map((i) =>
        String(i._id || i.cartItemId) === String(cartItemId) ? { ...i, quantity } : i
      )
    );

    if (!getToken()) return;

    try {
      const { data } = await API.put(`/${cartItemId}`, { quantity });
      setCartItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error("Update cart error:", err.response?.data || err.message);
    }
  };

  // ── Remove item ──────────────────────────────────────────────────
  // DELETE /api/cart/:cartItemId
  const removeFromCart = async (cartItemId) => {
    // Optimistic update
    setCartItems((prev) =>
      prev.filter((i) => String(i._id || i.cartItemId) !== String(cartItemId))
    );

    if (!getToken()) return;

    try {
      const { data } = await API.delete(`/${cartItemId}`);
      setCartItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
    }
  };

  // ── Clear cart ───────────────────────────────────────────────────
  // DELETE /api/cart
  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem("cart");

    if (!getToken()) return;

    try {
      // DELETE /api/cart  (no trailing slash)
      await API.delete("");
    } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
    }
  };

  // ── Computed values ──────────────────────────────────────────────
  const cartCount   = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);
  const cartTotal   = useMemo(
    () => cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0),
    [cartItems]
  );
  const shippingFee = cartTotal >= 999 ? 0 : cartTotal === 0 ? 0 : 60;
  const grandTotal  = cartTotal + shippingFee;

  return (
    <CartContext.Provider value={{
      cartItems, loadingCart, addToCart, removeFromCart,
      updateQuantity, clearCart, cartCount, cartTotal, shippingFee, grandTotal,
      reloadCart: loadCart, // expose for post-login reload
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);