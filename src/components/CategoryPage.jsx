// import React, { useState, useMemo, useEffect, useCallback, useRef, memo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useCart }     from "./CartContext";
// import { useWishlist } from "./WishlistContext";
// import AddToCartModal  from "./AddToCartModal";
// import axios from "axios";

// // ── API — defined outside component so never re-created ───────────
// const API = axios.create({ baseURL: "http://localhost:6055/api/admin/products" });
// API.interceptors.request.use((config) => {
//   try {
//     const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//     if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
//   } catch {}
//   return config;
// });

// // ── Static data — outside component ──────────────────────────────
// const ALL_CATEGORIES = [
//   { name: "All",         icon: "🏪" },
//   { name: "Fashion",     icon: "👗" },
//   { name: "Footwear",    icon: "👟" },
//   { name: "Watches",     icon: "⌚" },
//   { name: "Accessories", icon: "💍" },
//   { name: "Bags",        icon: "👜" },
//   { name: "Sunglasses",  icon: "🕶️" },
//   { name: "Ethnic Wear", icon: "🥻" },
//   { name: "Activewear",  icon: "🏃" },
// ];

// const SORT_OPTIONS = [
//   { value: "popular",    label: "Most Popular" },
//   { value: "newest",     label: "Newest" },
//   { value: "price_asc",  label: "Price ↑" },
//   { value: "price_desc", label: "Price ↓" },
//   { value: "rating",     label: "Top Rated" },
//   { value: "discount",   label: "Best Discount" },
// ];

// const COLOR_MAP = {
//   Black: "#111827", White: "#f9fafb", Navy: "#1e3a5f", Grey: "#9ca3af",
//   Blue: "#3b82f6", Red: "#ef4444", Brown: "#92400e", Beige: "#d6c5a3",
//   Gold: "#f59e0b", Silver: "#6b7280", Pink: "#ec4899", Green: "#22c55e",
//   Olive: "#65a30d", Nude: "#e8c9a4", Khaki: "#a3885a", Tan: "#c5956a",
//   Cream: "#f5f0e8", Natural: "#d4c5a9", "Rose Gold": "#d4a0a0",
//   Tortoise: "#8b5e3c", Floral: "#f9a8d4", Yellow: "#fbbf24", Purple: "#7c3aed",
//   Orange: "#f97316", Maroon: "#881337",
// };

// // ── Skeleton card ─────────────────────────────────────────────────
// const SkeletonCard = () => (
//   <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden animate-pulse">
//     <div className="h-56 bg-purple-50" />
//     <div className="p-3 space-y-2">
//       <div className="h-2.5 bg-gray-100 rounded w-1/3" />
//       <div className="h-4 bg-gray-100 rounded w-4/5" />
//       <div className="h-3 bg-gray-100 rounded w-1/2" />
//       <div className="h-3 bg-gray-100 rounded w-2/3" />
//     </div>
//   </div>
// );

// // ── Stars ─────────────────────────────────────────────────────────
// const Stars = memo(({ rating }) => (
//   <div className="flex items-center gap-1">
//     <span className="text-amber-400 text-xs">
//       {"★".repeat(Math.floor(rating || 0))}{"☆".repeat(5 - Math.floor(rating || 0))}
//     </span>
//     <span className="text-gray-400 text-xs">{rating || 0}</span>
//   </div>
// ));

// // ── Filter section wrapper ────────────────────────────────────────
// const FilterSection = memo(({ title, children, defaultOpen = true }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div className="border-b border-purple-50 last:border-0">
//       <button onClick={() => setOpen((v) => !v)}
//         className="w-full flex items-center justify-between py-3.5 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-violet-600 transition-colors">
//         {title}
//         <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>
//       {open && <div className="pb-3.5">{children}</div>}
//     </div>
//   );
// });

// // ── Filter chip ───────────────────────────────────────────────────
// const Chip = memo(({ label, onRemove }) => (
//   <span className="flex items-center gap-1 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1 rounded-full">
//     {label}
//     <button onClick={onRemove} className="hover:text-red-500 font-bold ml-0.5">✕</button>
//   </span>
// ));

// // ══════════════════════════════════════════════════════════════════
// // CATEGORY PAGE
// // ══════════════════════════════════════════════════════════════════
// const CategoryPage = () => {
//   const { categoryName } = useParams();
//   const navigate = useNavigate();
//   const navigateRef = useRef(navigate);
//   useEffect(() => { navigateRef.current = navigate; }, [navigate]);

//   const { cartCount }                   = useCart();
//   const { toggleWishlist, isWishlisted } = useWishlist();

//   // ── Active category — can change via sidebar without URL change ─
//   const [activeCategory, setActiveCategory] = useState(() => decodeURIComponent(categoryName || "All"));

//   // Sync if URL changes (e.g. back button)
//   useEffect(() => {
//     setActiveCategory(decodeURIComponent(categoryName || "All"));
//   }, [categoryName]);

//   // ── Filter state ──────────────────────────────────────────────
//   const [search,       setSearch]       = useState("");
//   const [sort,         setSort]         = useState("popular");
//   const [maxPrice,     setMaxPrice]     = useState(20000);
//   const [minRating,    setMinRating]    = useState(0);
//   const [selBrands,    setSelBrands]    = useState([]);
//   const [selGenders,   setSelGenders]   = useState([]);
//   const [selColors,    setSelColors]    = useState([]);
//   const [selSizes,     setSelSizes]     = useState([]);
//   const [onlyDiscount, setOnlyDiscount] = useState(false);
//   const [onlyInStock,  setOnlyInStock]  = useState(false);
//   const [viewMode,     setViewMode]     = useState("grid");
//   const [modalProduct, setModalProduct] = useState(null);
//   const [sidebarOpen,  setSidebarOpen]  = useState(true);

//   // ── Data ──────────────────────────────────────────────────────
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading,     setLoading]     = useState(true);

//   // Load ALL products once — category filtering done client-side
//   useEffect(() => {
//     let cancelled = false;
//     const load = async () => {
//       setLoading(true);
//       try {
//         const { data } = await API.get("");
//         if (!cancelled) setAllProducts(Array.isArray(data) ? data : data.products || []);
//       } catch (e) {
//         console.error("Products load:", e.message);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };
//     load();
//     return () => { cancelled = true; };
//   }, []); // ← empty: load once

//   // ── Derived filter options from the selected category's products ─
//   const categoryProducts = useMemo(() =>
//     activeCategory === "All"
//       ? allProducts
//       : allProducts.filter((p) => p.category === activeCategory),
//   [allProducts, activeCategory]);

//   const availableBrands  = useMemo(() => [...new Set(categoryProducts.map((p) => p.brand).filter(Boolean))].sort(), [categoryProducts]);
//   const availableGenders = useMemo(() => [...new Set(categoryProducts.map((p) => p.gender).filter(Boolean))], [categoryProducts]);
//   const availableColors  = useMemo(() => [...new Set(categoryProducts.flatMap((p) => Array.isArray(p.colors) ? p.colors : []).filter(Boolean))], [categoryProducts]);
//   const availableSizes   = useMemo(() => [...new Set(categoryProducts.flatMap((p) => Array.isArray(p.sizes) ? p.sizes : []).filter(Boolean))], [categoryProducts]);
//   const maxProductPrice  = useMemo(() => Math.max(20000, ...categoryProducts.map((p) => p.price || 0)), [categoryProducts]);

//   // Reset filters when category changes
//   useEffect(() => {
//     setSearch(""); setMaxPrice(20000); setMinRating(0);
//     setSelBrands([]); setSelGenders([]); setSelColors([]); setSelSizes([]);
//     setOnlyDiscount(false); setOnlyInStock(false); setSort("popular");
//   }, [activeCategory]);

//   // ── Filtered + sorted products ─────────────────────────────────
//   const filtered = useMemo(() => {
//     let r = categoryProducts.filter((p) => {
//       if (search) {
//         const q = search.toLowerCase();
//         if (!p.name?.toLowerCase().includes(q) &&
//             !p.brand?.toLowerCase().includes(q) &&
//             !p.description?.toLowerCase().includes(q)) return false;
//       }
//       if (p.price > maxPrice) return false;
//       if (minRating > 0 && (p.rating || 0) < minRating) return false;
//       if (selBrands.length  && !selBrands.includes(p.brand)) return false;
//       if (selGenders.length && !selGenders.includes(p.gender)) return false;
//       if (selColors.length  && !p.colors?.some((c) => selColors.includes(c))) return false;
//       if (selSizes.length   && !p.sizes?.some((s) => selSizes.includes(s))) return false;
//       if (onlyDiscount && !(p.originalPrice > p.price)) return false;
//       if (onlyInStock && p.stock === 0) return false;
//       return true;
//     });

//     switch (sort) {
//       case "price_asc":  r.sort((a, b) => a.price - b.price); break;
//       case "price_desc": r.sort((a, b) => b.price - a.price); break;
//       case "rating":     r.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
//       case "discount":   r.sort((a, b) => {
//         const da = a.originalPrice > 0 ? (a.originalPrice - a.price) / a.originalPrice : 0;
//         const db = b.originalPrice > 0 ? (b.originalPrice - b.price) / b.originalPrice : 0;
//         return db - da;
//       }); break;
//       case "newest":     r.sort((a, b) => (b._id > a._id ? 1 : -1)); break;
//       default:           r.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
//     }
//     return r;
//   }, [categoryProducts, search, maxPrice, minRating, selBrands, selGenders, selColors, selSizes, onlyDiscount, onlyInStock, sort]);

//   // ── Toggle helpers ─────────────────────────────────────────────
//   const toggle = useCallback((setArr, val) =>
//     setArr((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]), []);

//   const clearFilters = useCallback(() => {
//     setSearch(""); setMaxPrice(20000); setMinRating(0);
//     setSelBrands([]); setSelGenders([]); setSelColors([]); setSelSizes([]);
//     setOnlyDiscount(false); setOnlyInStock(false); setSort("popular");
//   }, []);

//   const handleCategoryClick = useCallback((name) => {
//     setActiveCategory(name);
//     navigateRef.current(`/category/${encodeURIComponent(name)}`, { replace: true });
//   }, []);

//   const activeCount = selBrands.length + selGenders.length + selColors.length + selSizes.length
//     + (maxPrice < maxProductPrice ? 1 : 0) + (minRating > 0 ? 1 : 0)
//     + (onlyDiscount ? 1 : 0) + (onlyInStock ? 1 : 0);

//   // ── Render helpers ─────────────────────────────────────────────
//   const renderGridCard = useCallback((p) => {
//     const disc      = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
//     const wishlisted = isWishlisted(p._id);
//     return (
//       <div key={p._id} onClick={() => navigateRef.current(`/product/${p._id}`)}
//         className="bg-white rounded-2xl border border-purple-100 overflow-hidden group hover:border-violet-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer">
//         {p.badge && (
//           <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{p.badge}</span>
//         )}
//         <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
//           className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform"
//           style={{ color: wishlisted ? "#ef4444" : "#d1d5db" }}>
//           {wishlisted ? "♥" : "♡"}
//         </button>
//         <div className="h-56 overflow-hidden bg-purple-50">
//           <img src={p.image || p.images?.[0]} alt={p.name}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//             onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }} />
//         </div>
//         <div className="p-3">
//           <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{p.brand}</p>
//           <p className="text-sm font-medium text-gray-900 truncate mb-1">{p.name}</p>
//           <Stars rating={p.rating} />
//           <p className="text-xs text-gray-400 mt-0.5">({(p.reviews || 0).toLocaleString()} reviews)</p>
//           <div className="flex items-center gap-2 mt-2 flex-wrap">
//             <span className="text-base font-bold text-gray-900">₹{(p.price || 0).toLocaleString()}</span>
//             {p.originalPrice > p.price && <span className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>}
//             {disc > 0 && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{disc}% off</span>}
//           </div>
//           <div className="flex gap-1 mt-2 flex-wrap">
//             {(p.sizes || []).slice(0, 3).map((s) => (
//               <span key={s} className="text-xs border border-purple-100 text-gray-500 px-1.5 py-0.5 rounded">{s}</span>
//             ))}
//             {(p.sizes || []).length > 3 && <span className="text-xs border border-purple-100 text-gray-400 px-1.5 py-0.5 rounded">+{p.sizes.length - 3}</span>}
//           </div>
//           <button onClick={(e) => { e.stopPropagation(); setModalProduct(p); }}
//             className="w-full mt-3 py-2 text-xs font-semibold rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-200">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }, [isWishlisted, toggleWishlist]);

//   const renderListCard = useCallback((p) => {
//     const disc = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
//     const wishlisted = isWishlisted(p._id);
//     return (
//       <div key={p._id} onClick={() => navigateRef.current(`/product/${p._id}`)}
//         className="bg-white rounded-2xl border border-purple-100 hover:border-violet-300 hover:shadow-lg hover:shadow-purple-50 transition-all flex overflow-hidden cursor-pointer">
//         <div className="w-44 flex-shrink-0 bg-purple-50 overflow-hidden">
//           <img src={p.image || p.images?.[0]} alt={p.name} className="w-full h-full object-cover"
//             onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }} />
//         </div>
//         <div className="flex-1 p-5 flex flex-col justify-between">
//           <div>
//             <div className="flex items-start justify-between gap-2">
//               <div>
//                 <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{p.brand}</p>
//                 <p className="font-medium text-gray-900 text-base">{p.name}</p>
//                 {p.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
//               </div>
//               {p.badge && <span className="bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex-shrink-0">{p.badge}</span>}
//             </div>
//             <div className="mt-2 flex items-center gap-2">
//               <Stars rating={p.rating} />
//               <span className="text-xs text-gray-400">({(p.reviews || 0).toLocaleString()})</span>
//             </div>
//             <div className="flex flex-wrap gap-1 mt-2">
//               {(p.sizes || []).slice(0, 6).map((s) => (
//                 <span key={s} className="text-xs border border-purple-100 text-gray-500 px-2 py-0.5 rounded">{s}</span>
//               ))}
//             </div>
//             <div className="flex flex-wrap gap-1.5 mt-2">
//               {(p.colors || []).slice(0, 6).map((c) => (
//                 <span key={c} title={c} className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ background: COLOR_MAP[c] || "#ccc" }} />
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center justify-between mt-3">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-xl font-bold text-gray-900">₹{(p.price || 0).toLocaleString()}</span>
//               {p.originalPrice > p.price && <span className="text-sm text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>}
//               {disc > 0 && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{disc}% off</span>}
//             </div>
//             <div className="flex gap-2">
//               <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
//                 className="w-9 h-9 rounded-xl border border-purple-100 flex items-center justify-center text-lg hover:border-pink-300 transition-colors"
//                 style={{ color: wishlisted ? "#ef4444" : "#d1d5db" }}>
//                 {wishlisted ? "♥" : "♡"}
//               </button>
//               <button onClick={(e) => { e.stopPropagation(); setModalProduct(p); }}
//                 className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-200 transition-all">
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }, [isWishlisted, toggleWishlist]);

//   // ════════════════════════════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">

//       {/* ── TOPBAR ─────────────────────────────────────────────── */}
//       <div className="sticky top-0 z-50 bg-[#1e0a3c] shadow-lg shadow-purple-900/30">

//         {/* Main topbar row */}
//         <div className="flex items-center gap-3 px-6 h-14">
//           <button onClick={() => navigateRef.current("/dashboard")}
//             className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all flex-shrink-0">
//             ← Back
//           </button>

//           <h1 className="font-serif text-lg text-purple-200 tracking-wide flex-shrink-0">
//             {activeCategory === "All" ? "All Products" : activeCategory}
//           </h1>

//           {/* Search bar in topbar */}
//           <div className="flex-1 max-w-md relative mx-2">
//             <div className="flex items-center bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all focus-within:bg-white focus-within:border-violet-400 focus-within:shadow-lg group">
//               <svg className="ml-3 w-4 h-4 text-white/40 group-focus-within:text-violet-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//               </svg>
//               <input
//                 className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-white placeholder-white/40 focus:text-gray-900 focus:placeholder-gray-400 transition-colors"
//                 placeholder={`Search in ${activeCategory === "All" ? "all products" : activeCategory}...`}
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               {search && (
//                 <button onClick={() => setSearch("")} className="mr-3 text-white/50 hover:text-white text-sm transition-colors">✕</button>
//               )}
//             </div>
//           </div>

//           {/* Right icons */}
//           <div className="flex items-center gap-2 ml-auto flex-shrink-0">
//             <span className="text-white/40 text-xs hidden sm:inline">{filtered.length} items</span>
//             <button onClick={() => setSidebarOpen((v) => !v)}
//               className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${sidebarOpen ? "bg-violet-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
//               title="Toggle filters">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 12a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zM9 19a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
//               </svg>
//             </button>
//             <button onClick={() => navigateRef.current("/cart")}
//               className="relative w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-0.5">{cartCount}</span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ── CATEGORY SWITCHER TABS ── */}
//         <div className="flex items-stretch bg-[#150829] border-t border-white/5 overflow-x-auto scrollbar-hide">
//           {ALL_CATEGORIES.map((cat) => (
//             <button key={cat.name} onClick={() => handleCategoryClick(cat.name)}
//               className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold flex-shrink-0 border-b-2 transition-all tracking-wider uppercase whitespace-nowrap ${
//                 activeCategory === cat.name
//                   ? "border-violet-400 text-violet-300 bg-white/5"
//                   : "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5"
//               }`}>
//               <span className="text-sm">{cat.icon}</span>
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── BREADCRUMB ── */}
//       <div className="bg-white border-b border-purple-50 px-6 py-2.5 flex items-center gap-2 text-xs text-gray-400">
//         <span className="cursor-pointer hover:text-violet-600 transition-colors" onClick={() => navigateRef.current("/dashboard")}>Home</span>
//         <span>›</span>
//         <span className="cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleCategoryClick("All")}>Shop</span>
//         {activeCategory !== "All" && (
//           <><span>›</span><span className="text-gray-700 font-medium">{activeCategory}</span></>
//         )}
//         {search && (
//           <><span>›</span><span className="text-violet-600 font-medium">"{search}"</span></>
//         )}
//       </div>

//       <div className="max-w-screen-xl mx-auto flex gap-6 px-4 py-5 items-start">

//         {/* ══ FILTER SIDEBAR ══════════════════════════════════════ */}
//         {sidebarOpen && (
//           <aside className="w-64 flex-shrink-0 bg-white rounded-2xl border border-purple-100 overflow-hidden sticky top-[105px] hidden md:block max-h-[calc(100vh-120px)] overflow-y-auto">

//             {/* Sidebar header */}
//             <div className="bg-gradient-to-r from-[#1e0a3c] to-violet-700 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
//               <span className="text-white text-sm font-semibold tracking-wide">
//                 Filters
//                 {activeCount > 0 && (
//                   <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{activeCount}</span>
//                 )}
//               </span>
//               {activeCount > 0 && (
//                 <button onClick={clearFilters} className="text-purple-300 text-xs hover:text-white transition-colors font-medium">
//                   Clear all
//                 </button>
//               )}
//             </div>

//             <div className="px-5">

//               {/* Price range */}
//               <FilterSection title="Price Range">
//                 <div className="flex justify-between text-xs text-gray-500 mb-2">
//                   <span>₹0</span>
//                   <span className="text-violet-600 font-bold">₹{maxPrice.toLocaleString()}</span>
//                 </div>
//                 <input type="range" min={0} max={maxProductPrice} step={500} value={maxPrice}
//                   onChange={(e) => setMaxPrice(Number(e.target.value))}
//                   className="w-full accent-violet-600 cursor-pointer" />
//                 <div className="flex gap-2 mt-3 flex-wrap">
//                   {[500, 1000, 2000, 5000, 10000].map((v) => (
//                     <button key={v} onClick={() => setMaxPrice(v)}
//                       className={`text-xs px-2.5 py-1 rounded-full border transition-all ${maxPrice === v ? "bg-violet-600 text-white border-violet-600" : "border-purple-100 text-gray-500 hover:border-violet-300"}`}>
//                       ₹{v >= 1000 ? `${v / 1000}k` : v}
//                     </button>
//                   ))}
//                 </div>
//               </FilterSection>

//               {/* Min rating */}
//               <FilterSection title="Customer Rating">
//                 <div className="space-y-2">
//                   {[4, 3, 2, 1].map((r) => (
//                     <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
//                       <input type="radio" name="rating" checked={minRating === r}
//                         onChange={() => setMinRating(minRating === r ? 0 : r)}
//                         className="accent-violet-600 cursor-pointer" />
//                       <span className="text-amber-400 text-sm">{"★".repeat(r)}{"☆".repeat(5 - r)}</span>
//                       <span className="text-xs text-gray-500 group-hover:text-violet-600">& above</span>
//                       <span className="text-xs text-gray-300 ml-auto">
//                         ({categoryProducts.filter((p) => (p.rating || 0) >= r).length})
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </FilterSection>

//               {/* Gender */}
//               {availableGenders.length > 0 && (
//                 <FilterSection title="Gender">
//                   <div className="flex flex-wrap gap-2">
//                     {availableGenders.map((g) => (
//                       <button key={g} onClick={() => toggle(setSelGenders, g)}
//                         className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
//                           selGenders.includes(g) ? "bg-violet-600 text-white border-violet-600" : "border-purple-100 text-gray-600 hover:border-violet-300"
//                         }`}>
//                         {g}
//                       </button>
//                     ))}
//                   </div>
//                 </FilterSection>
//               )}

//               {/* Sizes */}
//               {availableSizes.length > 0 && (
//                 <FilterSection title="Size" defaultOpen={false}>
//                   <div className="flex flex-wrap gap-1.5">
//                     {availableSizes.map((s) => (
//                       <button key={s} onClick={() => toggle(setSelSizes, s)}
//                         className={`min-w-[38px] px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
//                           selSizes.includes(s) ? "bg-violet-600 text-white border-violet-600" : "border-purple-100 text-gray-600 hover:border-violet-300"
//                         }`}>
//                         {s}
//                       </button>
//                     ))}
//                   </div>
//                 </FilterSection>
//               )}

//               {/* Brand */}
//               {availableBrands.length > 0 && (
//                 <FilterSection title="Brand" defaultOpen={false}>
//                   <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
//                     {availableBrands.map((b) => {
//                       const count = categoryProducts.filter((p) => p.brand === b).length;
//                       return (
//                         <label key={b} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
//                           <input type="checkbox" checked={selBrands.includes(b)}
//                             onChange={() => toggle(setSelBrands, b)}
//                             className="accent-violet-600 cursor-pointer w-3.5 h-3.5" />
//                           <span className="text-sm text-gray-700 group-hover:text-violet-600 flex-1 transition-colors">{b}</span>
//                           <span className="text-xs text-gray-300">({count})</span>
//                         </label>
//                       );
//                     })}
//                   </div>
//                 </FilterSection>
//               )}

//               {/* Color */}
//               {availableColors.length > 0 && (
//                 <FilterSection title="Color" defaultOpen={false}>
//                   <div className="flex flex-wrap gap-2.5">
//                     {availableColors.map((c) => (
//                       <button key={c} title={c} onClick={() => toggle(setSelColors, c)}
//                         className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
//                           selColors.includes(c) ? "ring-2 ring-violet-600 ring-offset-2 scale-110" : ""
//                         }`}
//                         style={{ background: COLOR_MAP[c] || "#ccc", border: c === "White" ? "1.5px solid #e5e7eb" : "none" }} />
//                     ))}
//                   </div>
//                   {selColors.length > 0 && (
//                     <div className="flex flex-wrap gap-1 mt-2">
//                       {selColors.map((c) => (
//                         <span key={c} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1">
//                           <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLOR_MAP[c] || "#ccc" }} />{c}
//                           <button onClick={() => toggle(setSelColors, c)} className="hover:text-red-400 font-bold">✕</button>
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </FilterSection>
//               )}

//               {/* Special filters */}
//               <FilterSection title="More Filters" defaultOpen={false}>
//                 <div className="space-y-3">
//                   <label className="flex items-center justify-between cursor-pointer group">
//                     <span className="text-sm text-gray-700 group-hover:text-violet-600 transition-colors">Discounted Only</span>
//                     <div onClick={() => setOnlyDiscount((v) => !v)}
//                       className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${onlyDiscount ? "bg-violet-600" : "bg-gray-200"}`}>
//                       <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: onlyDiscount ? "calc(100% - 18px)" : "2px" }} />
//                     </div>
//                   </label>
//                   <label className="flex items-center justify-between cursor-pointer group">
//                     <span className="text-sm text-gray-700 group-hover:text-violet-600 transition-colors">In Stock Only</span>
//                     <div onClick={() => setOnlyInStock((v) => !v)}
//                       className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${onlyInStock ? "bg-violet-600" : "bg-gray-200"}`}>
//                       <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: onlyInStock ? "calc(100% - 18px)" : "2px" }} />
//                     </div>
//                   </label>
//                 </div>
//               </FilterSection>

//               <div className="pb-4" />
//             </div>
//           </aside>
//         )}

//         {/* ══ MAIN CONTENT ════════════════════════════════════════ */}
//         <main className="flex-1 min-w-0">

//           {/* Sort + view bar */}
//           <div className="bg-white rounded-2xl border border-purple-100 px-5 py-3 mb-4 flex flex-wrap items-center gap-2">
//             <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase flex-shrink-0">Sort:</span>
//             <div className="flex flex-wrap gap-1.5">
//               {SORT_OPTIONS.map((opt) => (
//                 <button key={opt.value} onClick={() => setSort(opt.value)}
//                   className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
//                     sort === opt.value
//                       ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200"
//                       : "border-purple-100 text-gray-500 hover:border-violet-300 hover:text-violet-600"
//                   }`}>
//                   {opt.label}
//                 </button>
//               ))}
//             </div>
//             <div className="ml-auto flex items-center gap-2 flex-shrink-0">
//               <span className="text-xs text-gray-400 font-medium hidden sm:inline">{filtered.length} products</span>
//               <button onClick={() => setViewMode("grid")}
//                 className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${viewMode === "grid" ? "bg-violet-600 text-white border-violet-600" : "border-purple-100 text-gray-400 hover:border-violet-300"}`}>⊞</button>
//               <button onClick={() => setViewMode("list")}
//                 className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${viewMode === "list" ? "bg-violet-600 text-white border-violet-600" : "border-purple-100 text-gray-400 hover:border-violet-300"}`}>☰</button>
//             </div>
//           </div>

//           {/* Active filter chips */}
//           {(activeCount > 0 || search) && (
//             <div className="flex flex-wrap gap-2 mb-4">
//               {search && <Chip label={`"${search}"`} onRemove={() => setSearch("")} />}
//               {maxPrice < maxProductPrice && <Chip label={`Up to ₹${maxPrice.toLocaleString()}`} onRemove={() => setMaxPrice(maxProductPrice)} />}
//               {minRating > 0 && <Chip label={`${"★".repeat(minRating)} & above`} onRemove={() => setMinRating(0)} />}
//               {selBrands.map((b)  => <Chip key={b} label={b} onRemove={() => toggle(setSelBrands, b)} />)}
//               {selGenders.map((g) => <Chip key={g} label={g} onRemove={() => toggle(setSelGenders, g)} />)}
//               {selSizes.map((s)   => <Chip key={s} label={`Size: ${s}`} onRemove={() => toggle(setSelSizes, s)} />)}
//               {selColors.map((c)  => <Chip key={c} label={c} onRemove={() => toggle(setSelColors, c)} />)}
//               {onlyDiscount && <Chip label="Discounted" onRemove={() => setOnlyDiscount(false)} />}
//               {onlyInStock  && <Chip label="In Stock"   onRemove={() => setOnlyInStock(false)} />}
//               <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1 hover:underline transition-colors">
//                 Clear all
//               </button>
//             </div>
//           )}

//           {/* Products grid / list */}
//           {loading ? (
//             <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
//               {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-purple-100 py-20 text-center">
//               <p className="text-5xl mb-4">🔍</p>
//               <p className="font-serif text-xl text-gray-700 mb-1">No products found</p>
//               <p className="text-sm text-gray-400 mb-5">
//                 {search ? `No results for "${search}" in ${activeCategory}` : "Try adjusting your filters"}
//               </p>
//               <div className="flex gap-3 justify-center flex-wrap">
//                 <button onClick={clearFilters} className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors">
//                   Clear Filters
//                 </button>
//                 <button onClick={() => handleCategoryClick("All")} className="px-6 py-2.5 border border-violet-200 text-violet-600 rounded-xl text-sm font-medium hover:bg-violet-50 transition-colors">
//                   Browse All
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className={viewMode === "grid"
//               ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
//               : "flex flex-col gap-4"
//             }>
//               {filtered.map((p) => viewMode === "grid" ? renderGridCard(p) : renderListCard(p))}
//             </div>
//           )}
//         </main>
//       </div>

//       {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
//     </div>
//   );
// };

// export default CategoryPage;



import React, { useState, useMemo, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart }     from "./CartContext";
import { useWishlist } from "./WishlistContext";
import AddToCartModal  from "./AddToCartModal";
import axios from "axios";

// ── API — sessionStorage for user token ───────────────────────────
const API = axios.create({ baseURL: "http://localhost:6055/api/admin/products" });
API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch {}
  return config;
});

// ── Categories with editorial cover images ───────────────────────
const CATEGORIES = [
  { name: "All",         icon: "✦", label: "Everything",  color: "#7c3aed", img: "" },
  { name: "Fashion",     icon: "👗", label: "Fashion",     color: "#9333ea", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
  { name: "Footwear",    icon: "👟", label: "Footwear",    color: "#e11d48", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { name: "Watches",     icon: "⌚", label: "Watches",     color: "#0284c7", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
  { name: "Accessories", icon: "💍", label: "Accessories", color: "#d97706", img: "https://images.unsplash.com/photo-1611923134239-b9be5816a4e8?w=400&q=80" },
  { name: "Bags",        icon: "👜", label: "Bags",        color: "#059669", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
  { name: "Sunglasses",  icon: "🕶️", label: "Sunglasses", color: "#ea580c", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80" },
  { name: "Ethnic Wear", icon: "🥻", label: "Ethnic Wear", color: "#dc2626", img: "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=400&q=80" },
  { name: "Activewear",  icon: "🏃", label: "Activewear",  color: "#0891b2", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" },
];

const SORT_OPTIONS = [
  { value: "popular",   label: "Popular"   },
  { value: "newest",    label: "Newest"    },
  { value: "price_asc", label: "Price ↑"  },
  { value: "price_desc",label: "Price ↓"  },
  { value: "rating",    label: "Top Rated" },
  { value: "discount",  label: "Best Deal" },
];

const COLOR_MAP = {
  Black: "#111827", White: "#f9fafb", Navy: "#1e3a5f", Grey: "#9ca3af",
  Blue: "#3b82f6", Red: "#ef4444", Brown: "#92400e", Beige: "#d6c5a3",
  Gold: "#f59e0b", Silver: "#9ca3af", Pink: "#ec4899", Green: "#22c55e",
  Olive: "#65a30d", Nude: "#e8c9a4", Khaki: "#a3885a", Tan: "#c5956a",
  Cream: "#f5f0e8", Natural: "#d4c5a9", "Rose Gold": "#d4a0a0",
  Tortoise: "#8b5e3c", Floral: "#f9a8d4", Yellow: "#fbbf24", Purple: "#7c3aed",
  Orange: "#f97316", Maroon: "#881337",
};

// ── Skeleton ──────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-64 bg-gray-100" />
    <div className="p-4 space-y-2.5">
      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

// ── Stars ─────────────────────────────────────────────────────────
const Stars = memo(({ rating }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-xs ${i < Math.floor(rating || 0) ? "text-amber-400" : "text-gray-200"}`}>★</span>
    ))}
    <span className="text-gray-400 text-xs ml-0.5">{(rating || 0).toFixed(1)}</span>
  </div>
));

// ── Collapsible filter block ──────────────────────────────────────
const FilterBlock = memo(({ title, children, open: defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-xs font-bold tracking-[0.15em] uppercase text-gray-400 hover:text-gray-700 transition-colors">
        {title}
        <span className={`text-gray-300 transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={{ fontSize: "10px" }}>▾</span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
});

// ── Product grid card (editorial style) ───────────────────────────
const GridCard = memo(({ p, onAddToCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(p._id);
  const disc = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  return (
    <div onClick={() => navigate(`/product/${p._id}`)}
      className="group relative cursor-pointer">
      {/* Image container */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[3/4] mb-3">
        <img src={p.image || p.images?.[0]}  alt={p.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.target.src = "https://placehold.co/300x400/f9f9f9/d1d5db?text=Lyra"; }} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {p.badge && (
            <span className="bg-[#1e0a3c] text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">{p.badge}</span>
          )}
          {disc >= 30 && !p.badge && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{disc}% OFF</span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          style={{ color: wishlisted ? "#ef4444" : "#9ca3af" }}>
          {wishlisted ? "♥" : "♡"}
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
            className="w-full py-2.5 bg-[#1e0a3c] text-white text-xs font-semibold rounded-xl tracking-wider hover:bg-violet-800 transition-colors">
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-xs text-violet-500 font-semibold tracking-widest uppercase mb-0.5">{p.brand}</p>
        <p className="text-sm font-medium text-gray-900 leading-tight truncate mb-1.5">{p.name}</p>
        <Stars rating={p.rating} />
        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
          <span className="font-bold text-gray-900">₹{(p.price || 0).toLocaleString()}</span>
          {p.originalPrice > p.price && (
            <span className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
          )}
          {disc > 0 && disc < 30 && (
            <span className="text-xs text-emerald-600 font-semibold">{disc}% off</span>
          )}
        </div>
      </div>
    </div>
  );
});

// ── Product list card ─────────────────────────────────────────────
const ListCard = memo(({ p, onAddToCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(p._id);
  const disc = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  return (
    <div onClick={() => navigate(`/product/${p._id}`)}
      className="bg-white rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all flex overflow-hidden cursor-pointer group">
      <div className="w-40 sm:w-52 flex-shrink-0 bg-gray-50 overflow-hidden">
        <img src={p.image || p.images?.[0]} alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://placehold.co/200x250/f9f9f9/d1d5db?text=Lyra"; }} />
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-violet-500 font-semibold tracking-widest uppercase mb-1">{p.brand}</p>
              <p className="font-medium text-gray-900 text-base truncate">{p.name}</p>
              {p.description && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>}
            </div>
            {p.badge && (
              <span className="bg-[#1e0a3c] text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">{p.badge}</span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Stars rating={p.rating} />
            <span className="text-xs text-gray-300">({(p.reviews || 0).toLocaleString()})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(p.sizes || []).slice(0, 5).map((s) => (
              <span key={s} className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-lg">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(p.colors || []).slice(0, 6).map((c) => (
              <span key={c} title={c} className="w-4 h-4 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
                style={{ background: COLOR_MAP[c] || "#ccc" }} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">₹{(p.price || 0).toLocaleString()}</span>
            {p.originalPrice > p.price && <span className="text-sm text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>}
            {disc > 0 && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{disc}% off</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-pink-300 transition-colors"
              style={{ color: wishlisted ? "#ef4444" : "#d1d5db" }}>
              {wishlisted ? "♥" : "♡"}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
              className="px-5 py-2 rounded-xl text-xs font-bold tracking-wider bg-[#1e0a3c] text-white hover:bg-violet-800 transition-colors uppercase">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════
// CATEGORY PAGE — Premium editorial design
// ✓ NO top category nav bar — category switching via elegant sidebar cards
// ✓ sessionStorage for user auth
// ✓ All filters: price, rating, gender, size, brand, color, discount, stock
// ✓ Sort options, grid/list view, active filter chips
// ✓ Products navigate to /product/:id
// ✓ Smooth search, real-time filter
// ══════════════════════════════════════════════════════════════════
const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  const { cartCount }                    = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [activeCategory, setActiveCategory] = useState(
    () => decodeURIComponent(categoryName || "All")
  );

  useEffect(() => {
    setActiveCategory(decodeURIComponent(categoryName || "All"));
  }, [categoryName]);

  // ── Filter state ──────────────────────────────────────────────
  const [search,       setSearch]       = useState("");
  const [sort,         setSort]         = useState("popular");
  const [maxPrice,     setMaxPrice]     = useState(20000);
  const [minRating,    setMinRating]    = useState(0);
  const [selBrands,    setSelBrands]    = useState([]);
  const [selGenders,   setSelGenders]   = useState([]);
  const [selColors,    setSelColors]    = useState([]);
  const [selSizes,     setSelSizes]     = useState([]);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock,  setOnlyInStock]  = useState(false);
  const [viewMode,     setViewMode]     = useState("grid");
  const [modalProduct, setModalProduct] = useState(null);
  const [filtersOpen,  setFiltersOpen]  = useState(true);

  // ── Data ──────────────────────────────────────────────────────
  const [allProducts, setAllProducts] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("");
        if (!cancelled) setAllProducts(Array.isArray(data) ? data : data.products || []);
      } catch (e) {
        console.error("Products load:", e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const categoryProducts = useMemo(() =>
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory),
  [allProducts, activeCategory]);

  const availableBrands  = useMemo(() => [...new Set(categoryProducts.map((p) => p.brand).filter(Boolean))].sort(), [categoryProducts]);
  const availableGenders = useMemo(() => [...new Set(categoryProducts.map((p) => p.gender).filter(Boolean))], [categoryProducts]);
  const availableColors  = useMemo(() => [...new Set(categoryProducts.flatMap((p) => Array.isArray(p.colors) ? p.colors : []).filter(Boolean))], [categoryProducts]);
  const availableSizes   = useMemo(() => [...new Set(categoryProducts.flatMap((p) => Array.isArray(p.sizes) ? p.sizes : []).filter(Boolean))], [categoryProducts]);
  const maxProductPrice  = useMemo(() => Math.max(20000, ...categoryProducts.map((p) => p.price || 0)), [categoryProducts]);

  // Reset filters when category changes
  useEffect(() => {
    setSearch(""); setMaxPrice(20000); setMinRating(0);
    setSelBrands([]); setSelGenders([]); setSelColors([]); setSelSizes([]);
    setOnlyDiscount(false); setOnlyInStock(false); setSort("popular");
  }, [activeCategory]);

  // ── Filtered + sorted ─────────────────────────────────────────
  const filtered = useMemo(() => {
    let r = categoryProducts.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name?.toLowerCase().includes(q) && !p.brand?.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) return false;
      }
      if (p.price > maxPrice) return false;
      if (minRating > 0 && (p.rating || 0) < minRating) return false;
      if (selBrands.length  && !selBrands.includes(p.brand)) return false;
      if (selGenders.length && !selGenders.includes(p.gender)) return false;
      if (selColors.length  && !p.colors?.some((c) => selColors.includes(c))) return false;
      if (selSizes.length   && !p.sizes?.some((s) => selSizes.includes(s))) return false;
      if (onlyDiscount && !(p.originalPrice > p.price)) return false;
      if (onlyInStock && p.stock === 0) return false;
      return true;
    });
    switch (sort) {
      case "price_asc":  r.sort((a, b) => a.price - b.price); break;
      case "price_desc": r.sort((a, b) => b.price - a.price); break;
      case "rating":     r.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "discount":   r.sort((a, b) => { const da = a.originalPrice > 0 ? (a.originalPrice - a.price) / a.originalPrice : 0; const db = b.originalPrice > 0 ? (b.originalPrice - b.price) / b.originalPrice : 0; return db - da; }); break;
      case "newest":     r.sort((a, b) => (b._id > a._id ? 1 : -1)); break;
      default:           r.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }
    return r;
  }, [categoryProducts, search, maxPrice, minRating, selBrands, selGenders, selColors, selSizes, onlyDiscount, onlyInStock, sort]);

  const toggle = useCallback((setArr, val) => setArr((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]), []);

  const clearFilters = useCallback(() => {
    setSearch(""); setMaxPrice(20000); setMinRating(0);
    setSelBrands([]); setSelGenders([]); setSelColors([]); setSelSizes([]);
    setOnlyDiscount(false); setOnlyInStock(false); setSort("popular");
  }, []);

  const handleCategory = useCallback((name) => {
    setActiveCategory(name);
    navigateRef.current(`/category/${encodeURIComponent(name)}`, { replace: true });
  }, []);

  const activeCount = selBrands.length + selGenders.length + selColors.length + selSizes.length
    + (maxPrice < maxProductPrice ? 1 : 0) + (minRating > 0 ? 1 : 0)
    + (onlyDiscount ? 1 : 0) + (onlyInStock ? 1 : 0);

  const activeCat = CATEGORIES.find((c) => c.name === activeCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .cat-serif { font-family: 'Cormorant Garamond', Georgia, serif !important; }
        .filter-range::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #7c3aed; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 8px rgba(124,58,237,0.4); }
        .filter-range::-webkit-slider-track { background: linear-gradient(to right, #7c3aed var(--pct, 0%), #e5e7eb var(--pct, 0%)); height: 3px; border-radius: 3px; }
        .filter-range { appearance: none; width: 100%; height: 3px; outline: none; cursor: pointer; border-radius: 3px; background: #e5e7eb; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .product-grid { display: grid; gap: 24px; }
        .product-grid.g4 { grid-template-columns: repeat(4, 1fr); }
        .product-grid.g3 { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 1024px) { .product-grid.g4, .product-grid.g3 { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .product-grid.g4, .product-grid.g3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .product-grid.g4, .product-grid.g3 { grid-template-columns: 1fr; } }
      `}</style>

      {/* ════════════════════════════════════════════════════════
          TOPBAR — minimal, no category tabs
      ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-50 bg-[#1e0a3c]/98 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-violet-950/40">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-4">
          {/* Back */}
          <button onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors px-3 py-1.5 rounded-lg hover:bg-white/8">
            ← Home
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="hover:text-white/60 cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>Lyra</span>
            <span>/</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors" onClick={() => handleCategory("All")}>Shop</span>
            {activeCategory !== "All" && (
              <><span>/</span><span className="text-white/70 font-medium">{activeCategory}</span></>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-auto relative">
            <input
              className="w-full bg-white/8 border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-2 pr-9 text-xs outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:border-violet-400 transition-all duration-300"
              placeholder={`Search ${activeCategory === "All" ? "all products" : activeCategory.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none">⌕</span>
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${filtersOpen ? "bg-violet-600 text-white" : "bg-white/8 text-white/50 hover:text-white"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
              </svg>
              Filters
              {activeCount > 0 && <span className="bg-pink-500 text-white rounded-full px-1.5" style={{ fontSize: "9px" }}>{activeCount}</span>}
            </button>
            <button onClick={() => navigate("/cart")}
              className="relative w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all">
              🛒
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold" style={{ fontSize: "8px" }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8 flex gap-7 items-start">

        {/* ════════════════════════════════════════════════════
            LEFT SIDEBAR — Categories + Filters
        ════════════════════════════════════════════════════ */}
        {filtersOpen && (
          <aside className="w-64 flex-shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-4 scrollbar-thin">

            {/* ── CATEGORIES — editorial card style ── */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-5 pt-5 pb-3">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Categories</p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.name} onClick={() => handleCategory(cat.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left group ${
                        activeCategory === cat.name
                          ? "text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      style={activeCategory === cat.name ? { background: cat.color || "#7c3aed" } : {}}>
                      <span className="text-base flex-shrink-0">{cat.icon}</span>
                      <span className="flex-1 truncate">{cat.label}</span>
                      {activeCategory === cat.name && (
                        <span className="text-white/60 text-xs">{categoryProducts.length}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── FILTERS ── */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">
                  Filters {activeCount > 0 && <span className="ml-2 bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs">{activeCount}</span>}
                </p>
                {activeCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">Clear</button>
                )}
              </div>

              <div className="px-5">
                {/* Price */}
                <FilterBlock title="Price Range">
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>₹0</span>
                    <span className="font-bold text-violet-600">₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input type="range" className="filter-range" min={0} max={maxProductPrice} step={500}
                    value={maxPrice}
                    style={{ "--pct": `${(maxPrice / maxProductPrice) * 100}%` }}
                    onChange={(e) => setMaxPrice(Number(e.target.value))} />
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {[1000, 3000, 5000, 10000].map((v) => (
                      <button key={v} onClick={() => setMaxPrice(v)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${maxPrice === v ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-500 hover:border-violet-300"}`}>
                        ₹{v >= 1000 ? `${v / 1000}K` : v}
                      </button>
                    ))}
                  </div>
                </FilterBlock>

                {/* Rating */}
                <FilterBlock title="Rating">
                  <div className="space-y-2">
                    {[4, 3, 2].map((r) => (
                      <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="rating" checked={minRating === r}
                          onChange={() => setMinRating(minRating === r ? 0 : r)}
                          className="accent-violet-600" />
                        <span className="text-amber-400 text-sm">{"★".repeat(r)}{"☆".repeat(5 - r)}</span>
                        <span className="text-xs text-gray-400 group-hover:text-gray-600">& up</span>
                        <span className="ml-auto text-xs text-gray-300">
                          ({categoryProducts.filter((p) => (p.rating || 0) >= r).length})
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterBlock>

                {/* Gender */}
                {availableGenders.length > 0 && (
                  <FilterBlock title="For">
                    <div className="flex flex-wrap gap-2">
                      {availableGenders.map((g) => (
                        <button key={g} onClick={() => toggle(setSelGenders, g)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            selGenders.includes(g) ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:border-violet-300"
                          }`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </FilterBlock>
                )}

                {/* Sizes */}
                {availableSizes.length > 0 && (
                  <FilterBlock title="Size" open={false}>
                    <div className="flex flex-wrap gap-1.5">
                      {availableSizes.map((s) => (
                        <button key={s} onClick={() => toggle(setSelSizes, s)}
                          className={`min-w-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                            selSizes.includes(s) ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:border-violet-300"
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </FilterBlock>
                )}

                {/* Brands */}
                {availableBrands.length > 0 && (
                  <FilterBlock title="Brand" open={false}>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {availableBrands.map((b) => (
                        <label key={b} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                          <input type="checkbox" checked={selBrands.includes(b)}
                            onChange={() => toggle(setSelBrands, b)}
                            className="accent-violet-600 w-3.5 h-3.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 group-hover:text-violet-600 flex-1 truncate transition-colors">{b}</span>
                          <span className="text-xs text-gray-300 flex-shrink-0">
                            ({categoryProducts.filter((p) => p.brand === b).length})
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterBlock>
                )}

                {/* Colors */}
                {availableColors.length > 0 && (
                  <FilterBlock title="Color" open={false}>
                    <div className="flex flex-wrap gap-2.5">
                      {availableColors.map((c) => (
                        <button key={c} title={c} onClick={() => toggle(setSelColors, c)}
                          className={`w-7 h-7 rounded-full transition-all hover:scale-110 flex-shrink-0 ${
                            selColors.includes(c) ? "ring-2 ring-violet-600 ring-offset-2 scale-110" : ""
                          }`}
                          style={{ background: COLOR_MAP[c] || "#ccc", border: c === "White" ? "1.5px solid #e5e7eb" : "none" }} />
                      ))}
                    </div>
                  </FilterBlock>
                )}

                {/* Toggles */}
                <FilterBlock title="Offers" open={false}>
                  <div className="space-y-3">
                    {[
                      { label: "On Sale", state: onlyDiscount, set: setOnlyDiscount },
                      { label: "In Stock", state: onlyInStock,  set: setOnlyInStock },
                    ].map(({ label, state, set }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{label}</span>
                        <div onClick={() => set((v) => !v)}
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${state ? "bg-violet-600" : "bg-gray-200"}`}>
                          <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                            style={{ left: state ? "calc(100% - 18px)" : "2px" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </FilterBlock>
                <div className="pb-4" />
              </div>
            </div>
          </aside>
        )}

        {/* ════════════════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════════════════ */}
        <main className="flex-1 min-w-0">

          {/* Category hero strip — elegant, no image clutter */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: activeCat.color || "#7c3aed" }}>
                ✦ Lyra · {activeCat.icon} {activeCat.label}
              </p>
              <h1 className="cat-serif text-4xl font-light text-gray-900">
                {activeCategory === "All" ? (
                  <>All <em className="text-violet-600">Products</em></>
                ) : (
                  <>{activeCat.label} <em style={{ color: activeCat.color || "#7c3aed" }}>Collection</em></>
                )}
              </h1>
              <p className="text-sm text-gray-400 mt-1 font-light">
                {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "product" : "products"} found`}
              </p>
            </div>

            {/* Sort + View controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-xl px-3 py-2 outline-none hover:border-violet-300 focus:border-violet-400 transition-colors cursor-pointer">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                {[
                  { mode: "grid", icon: "⊞" },
                  { mode: "list", icon: "☰" },
                ].map(({ mode, icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`w-9 h-9 flex items-center justify-center text-sm transition-all ${
                      viewMode === mode ? "bg-[#1e0a3c] text-white" : "bg-white text-gray-400 hover:text-gray-700"
                    }`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {(activeCount > 0 || search) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {search && (
                <span className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  "{search}"
                  <button onClick={() => setSearch("")} className="hover:text-red-500 font-bold">✕</button>
                </span>
              )}
              {maxPrice < maxProductPrice && (
                <span className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  Up to ₹{maxPrice.toLocaleString()}
                  <button onClick={() => setMaxPrice(maxProductPrice)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  {"★".repeat(minRating)} & up
                  <button onClick={() => setMinRating(0)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              )}
              {selBrands.map((b) => (
                <span key={b} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  {b} <button onClick={() => toggle(setSelBrands, b)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              ))}
              {selGenders.map((g) => (
                <span key={g} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  {g} <button onClick={() => toggle(setSelGenders, g)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              ))}
              {selSizes.map((s) => (
                <span key={s} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  Size {s} <button onClick={() => toggle(setSelSizes, s)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              ))}
              {selColors.map((c) => (
                <span key={c} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLOR_MAP[c] || "#ccc" }} />
                  {c} <button onClick={() => toggle(setSelColors, c)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              ))}
              {onlyDiscount && (
                <span className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  On Sale <button onClick={() => setOnlyDiscount(false)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              )}
              {onlyInStock && (
                <span className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  In Stock <button onClick={() => setOnlyInStock(false)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              )}
              {(activeCount > 1 || (activeCount > 0 && search)) && (
                <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-600 font-semibold px-2 py-1 transition-colors">
                  Clear all
                </button>
              )}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className={`product-grid ${viewMode === "list" ? "" : "g4"}`}
              style={viewMode === "list" ? { display: "flex", flexDirection: "column", gap: "16px" } : {}}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
              <p className="text-5xl mb-5">🔍</p>
              <p className="cat-serif text-3xl text-gray-700 mb-2">Nothing found</p>
              <p className="text-gray-400 text-sm mb-6">
                {search ? `No results for "${search}"` : "Try adjusting your filters"}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={clearFilters}
                  className="px-6 py-2.5 bg-[#1e0a3c] text-white rounded-xl text-sm font-medium hover:bg-violet-800 transition-colors">
                  Clear Filters
                </button>
                <button onClick={() => handleCategory("All")}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:border-violet-300 hover:text-violet-600 transition-colors">
                  Browse All
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="product-grid g4 fade-in">
              {filtered.map((p) => (
                <GridCard key={p._id} p={p} onAddToCart={setModalProduct} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 fade-in">
              {filtered.map((p) => (
                <ListCard key={p._id} p={p} onAddToCart={setModalProduct} />
              ))}
            </div>
          )}
        </main>
      </div>

      {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </div>
  );
};

export default CategoryPage;