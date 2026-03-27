// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useWishlist } from "./WishlistContext";
// // import { useCart } from "./CartContext";
// // import AddToCartModal from "./AddToCartModal";

// // const WishlistPage = () => {
// //   const navigate = useNavigate();
// //   const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
// //   const { cartCount } = useCart();
// //   const [modalProduct, setModalProduct] = useState(null);
// //   const [removingId,   setRemovingId]   = useState(null);

// //   const handleRemove = (productId) => {
// //     setRemovingId(productId);
// //     setTimeout(() => {
// //       removeFromWishlist(productId);
// //       setRemovingId(null);
// //     }, 300);
// //   };

// //   const handleMoveToCart = (product) => {
// //     setModalProduct(product);
// //   };

// //   // ── Empty state ──
// //   if (wishlistItems.length === 0) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 font-sans">
// //         <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
// //           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
// //             ← Back
// //           </button>
// //           <span className="font-serif text-base text-purple-200 tracking-wide">My Wishlist</span>
// //           <button onClick={() => navigate("/cart")} className="ml-auto relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
// //             🛒
// //             {cartCount > 0 && (
// //               <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
// //             )}
// //           </button>
// //         </div>

// //         <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5 px-4 text-center">
// //           <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center">
// //             <span className="text-6xl">♡</span>
// //           </div>
// //           <div>
// //             <h2 className="font-serif text-2xl text-gray-900 mb-2">Your wishlist is empty</h2>
// //             <p className="text-gray-400 text-sm">Save items you love by clicking the ♡ on any product.</p>
// //           </div>
// //           <button
// //             onClick={() => navigate("/dashboard")}
// //             className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all"
// //           >
// //             Explore Products →
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 font-sans">

// //       {/* ── TOPBAR ── */}
// //       <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
// //         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
// //           ← Back
// //         </button>
// //         <span className="font-serif text-base text-purple-200 tracking-wide">
// //           My Wishlist <span className="text-white/40 font-sans text-sm">({wishlistCount} items)</span>
// //         </span>
// //         <button onClick={() => navigate("/cart")} className="ml-auto relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
// //           🛒
// //           {cartCount > 0 && (
// //             <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
// //           )}
// //         </button>
// //       </div>

// //       {/* ── BREADCRUMB ── */}
// //       <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
// //         <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
// //         <span>›</span>
// //         <span className="text-gray-700 font-medium">Wishlist</span>
// //       </div>

// //       <div className="max-w-screen-xl mx-auto px-4 py-6">

// //         {/* Header */}
// //         <div className="flex items-center justify-between mb-6">
// //           <h1 className="font-serif text-2xl text-gray-900">
// //             My <span className="text-violet-600">Wishlist</span>
// //           </h1>
// //           <span className="text-sm text-gray-400">{wishlistCount} saved items</span>
// //         </div>

// //         {/* Grid */}
// //         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
// //           {wishlistItems.map((product) => {
// //             const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
// //             const isRemoving = removingId === product.id;

// //             return (
// //               <div
// //                 key={product.id}
// //                 className={`bg-white rounded-2xl border border-purple-100 overflow-hidden group transition-all duration-300 relative ${isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100 hover:border-violet-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1"}`}
// //               >
// //                 {/* Remove from wishlist */}
// //                 <button
// //                   onClick={() => handleRemove(product.id)}
// //                   className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform text-pink-500 hover:text-red-500"
// //                 >
// //                   ♥
// //                 </button>

// //                 {/* Badge */}
// //                 {product.badge && (
// //                   <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
// //                     {product.badge}
// //                   </span>
// //                 )}

// //                 {/* Image */}
// //                 <div
// //                   className="h-52 overflow-hidden bg-purple-50 cursor-pointer"
// //                   onClick={() => navigate(`/product/${product.id}`)}
// //                 >
// //                   <img
// //                     src={product.images?.[0] || product.image}
// //                     alt={product.name}
// //                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
// //                     onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }}
// //                   />
// //                 </div>

// //                 {/* Info */}
// //                 <div className="p-3">
// //                   <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{product.brand}</p>
// //                   <p
// //                     className="text-sm font-medium text-gray-900 truncate mb-1 cursor-pointer hover:text-violet-600"
// //                     onClick={() => navigate(`/product/${product.id}`)}
// //                   >
// //                     {product.name}
// //                   </p>

// //                   {/* Stars */}
// //                   <div className="flex items-center gap-1 mb-2">
// //                     <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
// //                     <span className="text-gray-400 text-xs">{product.rating}</span>
// //                   </div>

// //                   {/* Price */}
// //                   <div className="flex items-center gap-2 flex-wrap mb-3">
// //                     <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
// //                     <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
// //                     <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{discount}% off</span>
// //                   </div>

// //                   {/* Add to Cart button */}
// //                   <button
// //                     onClick={() => handleMoveToCart(product)}
// //                     className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all"
// //                   >
// //                     🛒 Add to Cart
// //                   </button>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* Add to Cart Modal */}
// //       {modalProduct && (
// //         <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />
// //       )}
// //     </div>
// //   );
// // };

// // export default WishlistPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import AddToCartModal from "./AddToCartModal";

// const API = axios.create({
//   baseURL: "http://localhost:6055/api/admin",
// });

// const WishlistPage = () => {
//   const navigate = useNavigate();

//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [cartCount, setCartCount] = useState(0);
//   const [modalProduct, setModalProduct] = useState(null);
//   const [removingId, setRemovingId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔥 Load data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [wishRes, cartRes] = await Promise.all([
//           API.get("/wishlist"),
//           API.get("/cart"),
//         ]);

//         setWishlistItems(wishRes.data);
//         setCartCount(cartRes.data.reduce((s, i) => s + i.quantity, 0));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // 🔥 Remove item
//   const handleRemove = async (productId) => {
//     setRemovingId(productId);

//     try {
//       await API.delete(`/wishlist/${productId}`);

//       setWishlistItems((prev) =>
//         prev.filter((i) => i._id !== productId)
//       );
//     } catch (err) {
//       console.error(err);
//     }

//     setTimeout(() => setRemovingId(null), 300);
//   };

//   const handleMoveToCart = (product) => {
//     setModalProduct(product);
//   };

//   // 🔥 Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="animate-spin w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   // 🔥 Empty UI (same premium feel)
//   if (wishlistItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg">
//           <button onClick={() => navigate(-1)} className="text-white">← Back</button>
//           <span className="text-purple-200">My Wishlist</span>
//         </div>

//         <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5 text-center">
//           <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center">
//             <span className="text-6xl">♡</span>
//           </div>
//           <h2 className="text-2xl font-serif">Your wishlist is empty</h2>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl"
//           >
//             Explore Products →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">

//       {/* 🔥 TOPBAR */}
//       <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg">
//         <button onClick={() => navigate(-1)} className="text-white">← Back</button>

//         <span className="text-purple-200">
//           My Wishlist ({wishlistItems.length})
//         </span>

//         <button
//           onClick={() => navigate("/cart")}
//           className="ml-auto relative text-white"
//         >
//           🛒
//           {cartCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-pink-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
//               {cartCount}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* 🔥 BREADCRUMB */}
//       <div className="bg-white border-b px-6 py-3 text-xs text-gray-400">
//         Home › Wishlist
//       </div>

//       <div className="max-w-screen-xl mx-auto px-4 py-6">

//         {/* HEADER */}
//         <div className="flex justify-between mb-6">
//           <h1 className="text-2xl font-serif">
//             My <span className="text-violet-600">Wishlist</span>
//           </h1>
//         </div>

//         {/* 🔥 GRID */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {wishlistItems.map((product) => {
//             const discount = Math.round(
//               ((product.originalPrice - product.price) /
//                 product.originalPrice) * 100
//             );

//             const isRemoving = removingId === product._id;

//             return (
//               <div
//                 key={product._id}
//                 className={`bg-white rounded-2xl border border-purple-100 overflow-hidden group transition-all duration-300 relative ${
//                   isRemoving
//                     ? "opacity-0 scale-95"
//                     : "hover:border-violet-300 hover:shadow-xl hover:-translate-y-1"
//                 }`}
//               >
//                 {/* ❤️ REMOVE */}
//                 <button
//                   onClick={() => handleRemove(product._id)}
//                   className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-pink-500 hover:scale-110"
//                 >
//                   ♥
//                 </button>

//                 {/* 🖼 IMAGE */}
//                 <div
//                   className="h-52 overflow-hidden bg-purple-50 cursor-pointer"
//                   onClick={() => navigate(`/product/${product._id}`)}
//                 >
//                   <img
//                     src={product.images?.[0]}
//                     alt={product.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition"
//                   />
//                 </div>

//                 {/* 📦 INFO */}
//                 <div className="p-3">
//                   <p className="text-xs text-violet-400 uppercase">
//                     {product.brand}
//                   </p>

//                   <p
//                     className="text-sm font-medium cursor-pointer hover:text-violet-600"
//                     onClick={() => navigate(`/product/${product._id}`)}
//                   >
//                     {product.name}
//                   </p>

//                   {/* ⭐ */}
//                   <div className="text-xs text-amber-400">
//                     {"★".repeat(Math.floor(product.rating))}
//                   </div>

//                   {/* 💰 PRICE */}
//                   <div className="flex gap-2 mt-2">
//                     <span className="font-bold">₹{product.price}</span>
//                     <span className="line-through text-xs text-gray-400">
//                       ₹{product.originalPrice}
//                     </span>
//                     <span className="text-green-600 text-xs">
//                       {discount}% off
//                     </span>
//                   </div>

//                   {/* 🛒 BUTTON */}
//                   <button
//                     onClick={() => handleMoveToCart(product)}
//                     className="w-full mt-3 py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-xs font-semibold hover:shadow-lg"
//                   >
//                     🛒 Add to Cart
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* MODAL */}
//       {modalProduct && (
//         <AddToCartModal
//           product={modalProduct}
//           onClose={() => setModalProduct(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default WishlistPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import AddToCartModal from "./AddToCartModal";
// import { useCart } from "./CartContext";

// // ── Wishlist API ────────────────────────────────────────────────────
// const WISH_API = axios.create({ baseURL: "http://localhost:6055/api/wishlist" });
// const CART_API = axios.create({ baseURL: "http://localhost:6055/api/cart" });

// const addAuthHeader = (config) => {
//   const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const token = user.token || "";
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// };
// WISH_API.interceptors.request.use(addAuthHeader);
// CART_API.interceptors.request.use(addAuthHeader);

// // ── Skeleton ────────────────────────────────────────────────────────
// const CardSkeleton = () => (
//   <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden animate-pulse">
//     <div className="h-52 bg-purple-50" />
//     <div className="p-3 space-y-2">
//       <div className="h-3 bg-gray-200 rounded w-1/2" />
//       <div className="h-4 bg-gray-200 rounded w-3/4" />
//       <div className="h-3 bg-gray-200 rounded w-1/3" />
//       <div className="h-8 bg-gray-200 rounded-xl mt-3" />
//     </div>
//   </div>
// );

// const WishlistPage = () => {
//   const navigate          = useNavigate();
//   const { cartCount }     = useCart();

//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [modalProduct,  setModalProduct]  = useState(null);
//   const [removingId,    setRemovingId]    = useState(null);
//   const [loading,       setLoading]       = useState(true);
//   const [error,         setError]         = useState(null);

//   // ── Load wishlist ─────────────────────────────────────────────────
//   // GET /api/wishlist → array of populated product objects
//   useEffect(() => {
//     const loadWishlist = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const { data } = await WISH_API.get("/");
//         setWishlistItems(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Wishlist load error:", err.response?.data || err.message);
//         setError("Failed to load wishlist. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadWishlist();
//   }, []);

//   // ── Remove from wishlist ──────────────────────────────────────────
//   // DELETE /api/wishlist/:productId
//   const handleRemove = async (productId) => {
//     setRemovingId(productId);
//     // Optimistic update — remove from UI immediately
//     setWishlistItems((prev) =>
//       prev.filter((i) => (i._id || i.id) !== productId)
//     );

//     try {
//       await WISH_API.delete(`/${productId}`);
//     } catch (err) {
//       console.error("Remove from wishlist error:", err.response?.data || err.message);
//       // Reload to restore state on error
//       const { data } = await WISH_API.get("/").catch(() => ({ data: [] }));
//       setWishlistItems(Array.isArray(data) ? data : []);
//     }

//     setTimeout(() => setRemovingId(null), 300);
//   };

//   // ── Open AddToCartModal ───────────────────────────────────────────
//   const handleMoveToCart = (product) => {
//     setModalProduct(product);
//   };

//   // ── Loading skeleton ──────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg">
//           <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
//           <span className="text-purple-200 font-serif">My Wishlist</span>
//         </div>
//         <div className="max-w-screen-xl mx-auto px-4 py-6">
//           <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse mb-6" />
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Error state ───────────────────────────────────────────────────
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg">
//           <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-sm">← Back</button>
//           <span className="text-purple-200 font-serif">My Wishlist</span>
//         </div>
//         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//           <p className="text-4xl">⚠️</p>
//           <p className="text-gray-500">{error}</p>
//           <button onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-violet-600 text-white rounded-xl text-sm hover:bg-violet-700 transition-colors">
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── Empty state ───────────────────────────────────────────────────
//   if (wishlistItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
//           <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
//           <span className="font-serif text-base text-purple-200 tracking-wide">My Wishlist</span>
//         </div>
//         <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5 text-center px-4">
//           <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center">
//             <span className="text-6xl">♡</span>
//           </div>
//           <h2 className="font-serif text-2xl text-gray-900">Your wishlist is empty</h2>
//           <p className="text-gray-400 text-sm">Save items you love to come back to them later.</p>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all"
//           >
//             Explore Products →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── Main wishlist grid ────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">

//       {/* TOPBAR */}
//       <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-1 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
//         >
//           ← Back
//         </button>
//         <span className="font-serif text-base text-purple-200 tracking-wide">
//           My Wishlist ({wishlistItems.length})
//         </span>
//         <button
//           onClick={() => navigate("/cart")}
//           className="ml-auto relative text-white/70 hover:text-white w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all"
//         >
//           <span className="text-lg">🛒</span>
//           {cartCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
//               {cartCount}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* BREADCRUMB */}
//       <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
//         <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
//         <span>›</span>
//         <span className="text-gray-700 font-medium">Wishlist</span>
//       </div>

//       <div className="max-w-screen-xl mx-auto px-4 py-6">

//         {/* Header row */}
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="font-serif text-2xl text-gray-900">
//             My <span className="text-violet-600">Wishlist</span>
//           </h1>
//           <p className="text-sm text-gray-400">{wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}</p>
//         </div>

//         {/* Product grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {wishlistItems.map((product) => {
//             const id       = product._id || product.id;
//             const discount = product.originalPrice
//               ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//               : 0;
//             const thumb    = product.images?.[0] || product.image;
//             const isRemoving = removingId === id;

//             return (
//               <div
//                 key={id}
//                 className={`bg-white rounded-2xl border border-purple-100 overflow-hidden group transition-all duration-300 relative ${
//                   isRemoving
//                     ? "opacity-0 scale-95 pointer-events-none"
//                     : "hover:border-violet-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1"
//                 }`}
//               >
//                 {/* ♥ Remove button */}
//                 <button
//                   onClick={() => handleRemove(id)}
//                   title="Remove from wishlist"
//                   className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-pink-500 hover:scale-110 hover:bg-pink-50 transition-all"
//                 >
//                   ♥
//                 </button>

//                 {/* Badge */}
//                 {product.badge && (
//                   <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
//                     {product.badge}
//                   </span>
//                 )}

//                 {/* Image */}
//                 <div
//                   className="h-52 overflow-hidden bg-purple-50 cursor-pointer"
//                   onClick={() => navigate(`/product/${id}`)}
//                 >
//                   <img
//                     src={thumb}
//                     alt={product.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }}
//                   />
//                 </div>

//                 {/* Info */}
//                 <div className="p-3">
//                   <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
//                     {product.brand}
//                   </p>
//                   <p
//                     className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-violet-600 transition-colors"
//                     onClick={() => navigate(`/product/${id}`)}
//                   >
//                     {product.name}
//                   </p>

//                   {/* Stars */}
//                   {product.rating > 0 && (
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-amber-400 text-xs">
//                         {"★".repeat(Math.floor(product.rating))}
//                         {"☆".repeat(5 - Math.floor(product.rating))}
//                       </span>
//                       <span className="text-gray-400 text-xs">{product.rating}</span>
//                     </div>
//                   )}

//                   {/* Price */}
//                   <div className="flex items-center gap-2 mt-2 flex-wrap">
//                     <span className="font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
//                     {product.originalPrice && (
//                       <span className="text-xs text-gray-400 line-through">
//                         ₹{product.originalPrice.toLocaleString()}
//                       </span>
//                     )}
//                     {discount > 0 && (
//                       <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
//                         {discount}% off
//                       </span>
//                     )}
//                   </div>

//                   {/* Add to Cart button */}
//                   <button
//                     onClick={() => handleMoveToCart(product)}
//                     className="w-full mt-3 py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-xs font-semibold hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all"
//                   >
//                     🛒 Add to Cart
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Add to Cart Modal */}
//       {modalProduct && (
//         <AddToCartModal
//           product={modalProduct}
//           onClose={() => setModalProduct(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default WishlistPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import AddToCartModal from "./AddToCartModal";

// ── Skeleton card ─────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-purple-50" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded-xl mt-3" />
    </div>
  </div>
);

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, toggleWishlist, wishlistCount, loading } = useWishlist();
  const { cartCount } = useCart();
  const [modalProduct, setModalProduct] = useState(null);
  const [removingId,   setRemovingId]   = useState(null);

  // ── Remove with animation ─────────────────────────────────────────
  const handleRemove = async (productId) => {
    setRemovingId(productId);
    await removeFromWishlist(productId);
    setTimeout(() => setRemovingId(null), 350);
  };

  // ── Loading skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
          <span className="font-serif text-base text-purple-200 tracking-wide">My Wishlist</span>
        </div>
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
          <span className="font-serif text-base text-purple-200 tracking-wide">My Wishlist</span>
          <button onClick={() => navigate("/cart")} className="ml-auto relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
            🛒
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5 text-center px-4">
          <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center">
            <span className="text-6xl">♡</span>
          </div>
          <h2 className="font-serif text-2xl text-gray-900">Your wishlist is empty</h2>
          <p className="text-gray-400 text-sm">Tap the ♡ on any product to save it here.</p>
          <button onClick={() => navigate("/dashboard")}
            className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
            Explore Products →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* TOPBAR */}
      <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
        <span className="font-serif text-base text-purple-200 tracking-wide">
          My Wishlist <span className="text-white/40 font-sans text-sm">({wishlistCount} items)</span>
        </span>
        <button onClick={() => navigate("/cart")} className="ml-auto relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
          🛒
          {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
        </button>
      </div>

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">Wishlist</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Wishlist</span></h1>
          <p className="text-sm text-gray-400">{wishlistCount} saved items</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlistItems.map((product) => {
            const id       = product._id || product.id;
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            const thumb    = product.images?.[0] || product.image;

            return (
              <div key={id}
                className={`bg-white rounded-2xl border border-purple-100 overflow-hidden group transition-all duration-300 relative ${
                  removingId === id
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "hover:border-violet-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1"
                }`}>

                {/* ♥ Remove button — calls toggleWishlist which hits DELETE API */}
                <button
                  onClick={() => handleRemove(id)}
                  title="Remove from wishlist"
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-pink-500 hover:scale-110 hover:bg-pink-50 transition-all text-lg"
                >♥</button>

                {product.badge && (
                  <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.badge}
                  </span>
                )}

                {/* Image → navigate to product page */}
                <div className="h-52 overflow-hidden bg-purple-50 cursor-pointer" onClick={() => navigate(`/product/${id}`)}>
                  <img src={thumb} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }} />
                </div>

                <div className="p-3">
                  <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{product.brand}</p>
                  <p className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-violet-600" onClick={() => navigate(`/product/${id}`)}>
                    {product.name}
                  </p>

                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
                      <span className="text-gray-400 text-xs">{product.rating}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                    {discount > 0 && (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{discount}% off</span>
                    )}
                  </div>

                  {/* Add to Cart → opens modal to select size/color */}
                  <button
                    onClick={() => setModalProduct(product)}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-xs font-semibold hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AddToCartModal — size + color selection before adding */}
      {modalProduct && (
        <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
    </div>
  );
};

export default WishlistPage;