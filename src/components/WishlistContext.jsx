// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import axios from "axios";

// const WishlistContext = createContext({
//   wishlistItems: [], toggleWishlist: () => {}, removeFromWishlist: () => {},
//   isWishlisted: () => false, wishlistCount: 0, loading: false,
// });

// // ── NO trailing slash — your backend uses /api/wishlist (not /api/wishlist/) ──
// const API = axios.create({
//   baseURL: "http://localhost:6055/api/wishlist",
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

// export const WishlistProvider = ({ children }) => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading,       setLoading]       = useState(false);

  
//   const loadWishlist = useCallback(async () => {
//     const token = getToken();
//     if (!token) return; 

//     setLoading(true);
//     try {
//       const { data } = await API.get("");
//       setWishlistItems(Array.isArray(data) ? data : []);
//     } catch (err) {
//       // 401 means session expired — clear stale data
//       if (err.response?.status === 401) {
//         setWishlistItems([]);
//       } else {
//         console.error("Wishlist load error:", err.response?.data || err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { loadWishlist(); }, [loadWishlist]);

//   const toggleWishlist = async (product) => {
//     const token = getToken();
//     if (!token) {
//       console.warn("Login required to use wishlist");
//       return;
//     }

//     const productId = String(product._id || product.id);
//     const exists    = wishlistItems.some((i) => String(i._id || i.id) === productId);

//     // 1. Optimistic UI update (instant)
//     setWishlistItems((prev) =>
//       exists
//         ? prev.filter((i) => String(i._id || i.id) !== productId)
//         : [...prev, { ...product, _id: product._id || product.id }]
//     );

//     try {
//       if (exists) {
//         // DELETE /api/wishlist/:productId  — remove from wishlist
//         const { data } = await API.delete(`/${productId}`);
//         if (Array.isArray(data)) setWishlistItems(data);
//       } else {
//         // POST /api/wishlist  body: { productId }  — add to wishlist
//         // Note: NO trailing slash → hits /api/wishlist exactly
//         const { data } = await API.post("", { productId });
//         if (Array.isArray(data)) setWishlistItems(data);
//       }
//     } catch (err) {
//       console.error("Wishlist toggle error:", err.response?.data || err.message);
//       // Revert optimistic update — reload from server
//       try {
//         const { data } = await API.get("");
//         setWishlistItems(Array.isArray(data) ? data : []);
//       } catch {
//         // If reload also fails, keep optimistic state
//       }
//     }
//   };

//   // ── Remove by productId ───────────────────────────────────────────
//   const removeFromWishlist = async (productId) => {
//     const token = getToken();
//     if (!token) return;

//     const id = String(productId);

//     // Optimistic update
//     setWishlistItems((prev) => prev.filter((i) => String(i._id || i.id) !== id));

//     try {
//       // DELETE /api/wishlist/:productId
//       const { data } = await API.delete(`/${id}`);
//       if (Array.isArray(data)) setWishlistItems(data);
//     } catch (err) {
//       console.error("Remove wishlist error:", err.response?.data || err.message);
//     }
//   };

//   const isWishlisted  = (productId) =>
//     wishlistItems.some((i) => String(i._id || i.id) === String(productId));

//   const wishlistCount = wishlistItems.length;

//   return (
//     <WishlistContext.Provider value={{
//       wishlistItems, toggleWishlist, removeFromWishlist,
//       isWishlisted, wishlistCount, loading,
//       reloadWishlist: loadWishlist, // expose for post-login reload
//     }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => useContext(WishlistContext);
// export default WishlistContext;


import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const WishlistContext = createContext();

const API_BASE = "http://localhost:6055/api";

const getAuthHeader = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // ── Fetch wishlist from DB on mount ──────────────────────────────
  // GET /api/wishlist  → { items: [{ product: {...}, _id }] }
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user.token) { setLoading(false); return; }

    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/wishlist`, {
          headers: getAuthHeader(),
        });
        const items = data.items?.map((i) => i.product || i) || data || [];
        setWishlistItems(items);
        setWishlistIds(new Set(items.map((p) => String(p._id))));
      } catch (err) {
        console.warn("Wishlist fetch:", err.message);
        // Fall back to localStorage if API unavailable
        const local = JSON.parse(localStorage.getItem("lyra_wishlist") || "[]");
        setWishlistItems(local);
        setWishlistIds(new Set(local.map((p) => String(p._id))));
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const isWishlisted = useCallback((id) => wishlistIds.has(String(id)), [wishlistIds]);

  // ── Toggle wishlist (add or remove) ─────────────────────────────
  // POST /api/wishlist/toggle  { productId }
  // → { action: "added"|"removed", wishlist: [...] }
  const toggleWishlist = useCallback(async (product) => {
    const id = String(product._id || product.id);
    const wasWishlisted = wishlistIds.has(id);

    // Optimistic update
    if (wasWishlisted) {
      setWishlistIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setWishlistItems((prev) => prev.filter((p) => String(p._id) !== id));
    } else {
      setWishlistIds((prev) => new Set([...prev, id]));
      setWishlistItems((prev) => [...prev, product]);
    }

    try {
      await axios.post(
        `${API_BASE}/wishlist/toggle`,
        { productId: id },
        { headers: getAuthHeader() }
      );
    } catch (err) {
      // Revert on failure
      if (wasWishlisted) {
        setWishlistIds((prev) => new Set([...prev, id]));
        setWishlistItems((prev) => [...prev, product]);
      } else {
        setWishlistIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
        setWishlistItems((prev) => prev.filter((p) => String(p._id) !== id));
      }
      console.error("Wishlist toggle failed:", err.message);
    }

    // Sync localStorage as fallback
    const updated = wasWishlisted
      ? wishlistItems.filter((p) => String(p._id) !== id)
      : [...wishlistItems, product];
    localStorage.setItem("lyra_wishlist", JSON.stringify(updated));
  }, [wishlistIds, wishlistItems]);

  // ── Remove from wishlist ─────────────────────────────────────────
  // DELETE /api/wishlist/:productId
  const removeFromWishlist = useCallback(async (productId) => {
    const id = String(productId);
    setWishlistIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setWishlistItems((prev) => prev.filter((p) => String(p._id) !== id));

    try {
      await axios.delete(`${API_BASE}/wishlist/${id}`, { headers: getAuthHeader() });
    } catch (err) {
      console.error("Wishlist remove:", err.message);
    }
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      loading,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;
