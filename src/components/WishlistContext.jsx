// import React, { createContext, useContext, useState } from "react";

// const WishlistContext = createContext({
//   wishlistItems: [],
//   addToWishlist: () => {},
//   removeFromWishlist: () => {},
//   toggleWishlist: () => {},
//   isWishlisted: () => false,
//   wishlistCount: 0,
// });

// export const WishlistProvider = ({ children }) => {
//   const [wishlistItems, setWishlistItems] = useState([]);

//   // Toggle — add if not present, remove if present
//   const toggleWishlist = (product) => {
//     setWishlistItems((prev) => {
//       const exists = prev.find((i) => i.id === product.id);
//       if (exists) return prev.filter((i) => i.id !== product.id);
//       return [...prev, product];
//     });
//   };

//   const removeFromWishlist = (productId) => {
//     setWishlistItems((prev) => prev.filter((i) => i.id !== productId));
//   };

//   const isWishlisted = (productId) =>
//     wishlistItems.some((i) => i.id === productId);

//   const wishlistCount = wishlistItems.length;

//   return (
//     <WishlistContext.Provider value={{
//       wishlistItems,
//       toggleWishlist,
//       removeFromWishlist,
//       isWishlisted,
//       wishlistCount,
//     }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => useContext(WishlistContext);

// export default WishlistContext;



// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const WishlistContext = createContext();

// const API = axios.create({
//   baseURL: "http://localhost:6055/api/admin",
// });

// export const WishlistProvider = ({ children }) => {
//   const [wishlistItems, setWishlistItems] = useState([]);

//   // 🔥 Load wishlist from backend
//   useEffect(() => {
//     const loadWishlist = async () => {
//       try {
//         const { data } = await API.get("/wishlist");
//         setWishlistItems(data);
//       } catch (err) {
//         console.error("Wishlist load error:", err);
//       }
//     };

//     loadWishlist();
//   }, []);

//   // 🔥 Toggle wishlist (API)
//   const toggleWishlist = async (product) => {
//     try {
//       await API.post("/wishlist/toggle", {
//         productId: product._id,
//       });

//       // Refresh
//       const { data } = await API.get("/wishlist");
//       setWishlistItems(data);

//     } catch (err) {
//       console.error("Wishlist toggle error:", err);
//     }
//   };

//   const removeFromWishlist = async (productId) => {
//     try {
//       await API.delete(`/wishlist/${productId}`);

//       setWishlistItems((prev) =>
//         prev.filter((i) => i.id !== productId)
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const isWishlisted = (productId) =>
//     wishlistItems.some((i) => i.id === productId);

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlistItems,
//         toggleWishlist,
//         removeFromWishlist,
//         isWishlisted,
//         wishlistCount: wishlistItems.length,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => useContext(WishlistContext);

// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const WishlistContext = createContext();

// // ── Wishlist routes are at /api/wishlist (NOT /api/admin/wishlist) ──
// const API = axios.create({
//   baseURL: "http://localhost:6055/api/wishlist",
// });

// // Attach Bearer token to every request automatically
// API.interceptors.request.use((config) => {
//   const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const token = user.token || "";
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const WishlistProvider = ({ children }) => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loadingWishlist, setLoadingWishlist] = useState(false);

//   // ── Load wishlist on mount ──────────────────────────────────────
//   // GET /api/wishlist → returns populated product array
//   useEffect(() => {
//     const loadWishlist = async () => {
//       setLoadingWishlist(true);
//       try {
//         const { data } = await API.get("/");
//         setWishlistItems(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Wishlist load error:", err.response?.data || err.message);
//       } finally {
//         setLoadingWishlist(false);
//       }
//     };
//     loadWishlist();
//   }, []);

//   // ── Toggle (add/remove) ─────────────────────────────────────────
//   // POST /api/wishlist/toggle  body: { productId }
//   // Returns: { wishlisted, wishlist: [...products] }
//   const toggleWishlist = async (product) => {
//     const productId = product._id || product.id;
//     if (!productId) return;

//     // Optimistic update for instant UI response
//     const alreadyIn = isWishlisted(productId);
//     setWishlistItems((prev) =>
//       alreadyIn
//         ? prev.filter((i) => (i._id || i.id) !== productId)
//         : [...prev, product]
//     );

//     try {
//       const { data } = await API.post("/toggle", { productId });
//       // Sync with server truth
//       setWishlistItems(Array.isArray(data.wishlist) ? data.wishlist : []);
//     } catch (err) {
//       console.error("Wishlist toggle error:", err.response?.data || err.message);
//       // Revert optimistic update on failure
//       setWishlistItems((prev) =>
//         alreadyIn
//           ? [...prev, product]
//           : prev.filter((i) => (i._id || i.id) !== productId)
//       );
//     }
//   };

//   // ── Explicit remove ─────────────────────────────────────────────
//   // DELETE /api/wishlist/:productId
//   const removeFromWishlist = async (productId) => {
//     // Optimistic update
//     setWishlistItems((prev) =>
//       prev.filter((i) => (i._id || i.id) !== productId)
//     );
//     try {
//       await API.delete(`/${productId}`);
//     } catch (err) {
//       console.error("Remove from wishlist error:", err.response?.data || err.message);
//     }
//   };

//   // ── isWishlisted: checks both _id and id ────────────────────────
//   const isWishlisted = (productId) =>
//     wishlistItems.some(
//       (i) =>
//         String(i._id || i.id) === String(productId)
//     );

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlistItems,
//         loadingWishlist,
//         toggleWishlist,
//         removeFromWishlist,
//         isWishlisted,
//         wishlistCount: wishlistItems.length,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => useContext(WishlistContext);
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const WishlistContext = createContext({
  wishlistItems: [], toggleWishlist: () => {}, removeFromWishlist: () => {},
  isWishlisted: () => false, wishlistCount: 0, loading: false,
});

// ── NO trailing slash — your backend uses /api/wishlist (not /api/wishlist/) ──
const API = axios.create({
  baseURL: "http://localhost:6055/api/wishlist",
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

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading,       setLoading]       = useState(false);

  
  const loadWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) return; 

    setLoading(true);
    try {
      const { data } = await API.get("");
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (err) {
      // 401 means session expired — clear stale data
      if (err.response?.status === 401) {
        setWishlistItems([]);
      } else {
        console.error("Wishlist load error:", err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadWishlist(); }, [loadWishlist]);

  const toggleWishlist = async (product) => {
    const token = getToken();
    if (!token) {
      console.warn("Login required to use wishlist");
      return;
    }

    const productId = String(product._id || product.id);
    const exists    = wishlistItems.some((i) => String(i._id || i.id) === productId);

    // 1. Optimistic UI update (instant)
    setWishlistItems((prev) =>
      exists
        ? prev.filter((i) => String(i._id || i.id) !== productId)
        : [...prev, { ...product, _id: product._id || product.id }]
    );

    try {
      if (exists) {
        // DELETE /api/wishlist/:productId  — remove from wishlist
        const { data } = await API.delete(`/${productId}`);
        if (Array.isArray(data)) setWishlistItems(data);
      } else {
        // POST /api/wishlist  body: { productId }  — add to wishlist
        // Note: NO trailing slash → hits /api/wishlist exactly
        const { data } = await API.post("", { productId });
        if (Array.isArray(data)) setWishlistItems(data);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err.response?.data || err.message);
      // Revert optimistic update — reload from server
      try {
        const { data } = await API.get("");
        setWishlistItems(Array.isArray(data) ? data : []);
      } catch {
        // If reload also fails, keep optimistic state
      }
    }
  };

  // ── Remove by productId ───────────────────────────────────────────
  const removeFromWishlist = async (productId) => {
    const token = getToken();
    if (!token) return;

    const id = String(productId);

    // Optimistic update
    setWishlistItems((prev) => prev.filter((i) => String(i._id || i.id) !== id));

    try {
      // DELETE /api/wishlist/:productId
      const { data } = await API.delete(`/${id}`);
      if (Array.isArray(data)) setWishlistItems(data);
    } catch (err) {
      console.error("Remove wishlist error:", err.response?.data || err.message);
    }
  };

  const isWishlisted  = (productId) =>
    wishlistItems.some((i) => String(i._id || i.id) === String(productId));

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems, toggleWishlist, removeFromWishlist,
      isWishlisted, wishlistCount, loading,
      reloadWishlist: loadWishlist, // expose for post-login reload
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;