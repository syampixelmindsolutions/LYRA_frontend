
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart }     from "./CartContext";
// import { useWishlist } from "./WishlistContext";
// import AddToCartModal  from "./AddToCartModal";
// import axios           from "axios";
// import LyraFooter      from "./Footer";

// const API     = axios.create({ baseURL: "http://localhost:6055/api/admin" });
// const CAT_API = axios.create({ baseURL: "http://localhost:6055/api" });

// const SHOWCASE_IMGS = {
//   men:         "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
//   women:       "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
//   kids:        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
//   beauty:      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
//   home:        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
//   electronics: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
//   sports:      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
//   watches:     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
//   sale:        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
// };

// const FEATURED_IMGS = {
//   men:         { img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", label: "New Arrivals"    },
//   women:       { img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", label: "Trending Now"    },
//   kids:        { img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80", label: "Back to School"  },
//   beauty:      { img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", label: "Bestsellers"     },
//   home:        { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",   label: "Trending Décor"  },
//   electronics: { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80", label: "Tech Picks"      },
//   sports:      { img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80", label: "New Season Gear" },
// };

// const BRANDS_LOOP = (() => {
//   const raw = [
//     { name: "Nike",           logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",                                                                   bg: "#f8f8f8" },
//     { name: "Adidas",         logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",                                                                  bg: "#f8f8f8" },
//     { name: "Zara",           logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",                                                                    bg: "#f8f8f8" },
//     { name: "H&M",            logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",                                                                   bg: "#fff5f5" },
//     { name: "Puma",           logo: "https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg",                                                                    bg: "#f8f8f8" },
//     { name: "Levi's",         logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Levi%27s_logo_red.svg",                                                            bg: "#fff5f5" },
//     { name: "Gucci",          logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1000x1000_Gucci_logo.svg",                                                         bg: "#fafaf8" },
//     { name: "Rolex",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Rolex_Logo.png/640px-Rolex_Logo.png",                                        bg: "#f5faf5" },
//     { name: "Ray-Ban",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Ray-Ban_logo.svg/640px-Ray-Ban_logo.svg.png",                                bg: "#fff8f5" },
//     { name: "Tommy Hilfiger", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Tommy_Hilfiger_logo.svg/640px-Tommy_Hilfiger_logo.svg.png",                  bg: "#f5f5ff" },
//     { name: "Calvin Klein",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Calvin_Klein_color_logo.svg/640px-Calvin_Klein_color_logo.svg.png",          bg: "#f8f8f8" },
//     { name: "Lyra Studio",    logoText: "LYRA",  color: "#6d28d9", bg: "#f5f3ff" },
//     { name: "Elliot & Co",    logoText: "E&Co",  color: "#047857", bg: "#ecfdf5" },
//     { name: "BloomWear",      logoText: "bloom", color: "#be185d", bg: "#fdf2f8" },
//     { name: "TimeLux",        logoText: "TL",    color: "#92400e", bg: "#fffbeb" },
//     { name: "FlexFit",        logoText: "FF",    color: "#0f766e", bg: "#f0fdfa" },
//   ];
//   return [...raw, ...raw];
// })();

// const normaliseCategory = (cat) => {
//   const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "";
//   const fallback      = FEATURED_IMGS[slug] || { img: "", label: "New Arrivals" };
//   const featuredImg   = cat.featuredImg   || cat.heroImg   || fallback.img;
//   const featuredLabel = cat.featuredLabel || cat.heroLabel || fallback.label;
//   const columns = (cat.columns || [])
//     .map((col) => {
//       const rawLinks =
//         Array.isArray(col.subCategories) ? col.subCategories :
//         Array.isArray(col.links)         ? col.links         : [];
//       const links = rawLinks
//         .map((item) => (typeof item === "string" ? { name: item } : item))
//         .filter((item) => item && typeof item.name === "string" && item.name.trim());
//       return { ...col, links };
//     })
//     .filter((col) => col.links.length > 0);
//   return { ...cat, slug, featuredImg, featuredLabel, columns, noMenu: Boolean(cat.noMenu) };
// };

// // ── UNIQUE PROFILE PANEL ──────────────────────────────────────────────────────
// const ProfilePanel = ({ user, onClose, navigate, handleLogout }) => {
//   const firstName = user.fullName?.split(" ")[0] || "Guest";
//   const initials  = (user.fullName || "G").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

//   const menuItems = [
//     { icon: "📦", label: "My Orders",   sublabel: "Track & manage",   path: "/profile?tab=orders",    accent: "#7c3aed" },
//     { icon: "👤", label: "My Profile",  sublabel: "Edit details",      path: "/profile?tab=profile",   accent: "#0891b2" },
//     { icon: "♡",  label: "Wishlist",    sublabel: "Saved items",       path: "/wishlist",               accent: "#e11d48" },
//     { icon: "📍", label: "Addresses",   sublabel: "Delivery locations", path: "/profile?tab=addresses", accent: "#059669" },
//     { icon: "🎁", label: "Rewards",     sublabel: "Points & offers",   path: "/profile?tab=rewards",   accent: "#d97706" },
//   ];

//   return (
//     <>
//       <div className="lyra-overlay" onClick={onClose} />
//       <div className="lyra-profile-panel slide-in-right">
//         {/* Header */}
//         <div className="lpp-header">
//           <div className="lpp-avatar-ring">
//             <div className="lpp-avatar">{initials}</div>
//           </div>
//           <div className="lpp-header-info">
//             <p className="lpp-name">{user.fullName || "Guest"}</p>
//             <p className="lpp-contact">{user.email || user.mobileNumber || ""}</p>
//             <span className="lpp-badge">✦ Lyra Member</span>
//           </div>
//           <button onClick={onClose} className="lpp-close">✕</button>
//         </div>

//         {/* Stats row */}
//         <div className="lpp-stats">
//           {[["0", "Orders"], ["0", "Wishlist"], ["0", "Points"]].map(([n, l]) => (
//             <div key={l} className="lpp-stat">
//               <span className="lpp-stat-num">{n}</span>
//               <span className="lpp-stat-lbl">{l}</span>
//             </div>
//           ))}
//         </div>

//         {/* Menu items */}
//         <div className="lpp-menu">
//           {menuItems.map((item) => (
//             <button key={item.label} onClick={() => { onClose(); navigate(item.path); }} className="lpp-item">
//               <span className="lpp-item-icon" style={{ background: item.accent + "18", color: item.accent }}>
//                 {item.icon}
//               </span>
//               <div className="lpp-item-text">
//                 <span className="lpp-item-label">{item.label}</span>
//                 <span className="lpp-item-sub">{item.sublabel}</span>
//               </div>
//               <span className="lpp-item-arrow">›</span>
//             </button>
//           ))}
//         </div>

//         {/* Logout */}
//         <div className="lpp-footer">
//           <button onClick={() => { onClose(); handleLogout(); }} className="lpp-logout">
//             <span>🚪</span> Sign Out
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// // ── CINEMATIC HERO ──────────────────────────────────────────────────────────
// const CinematicHero = ({ slide, currentIndex, total, onDotClick, onShopClick }) => {
//   if (!slide) return null;
//   return (
//     <div className="relative w-full overflow-hidden lyra-hero">
//       <div className="absolute inset-0">
//         <img src={slide.image} alt={slide.title}
//           className="w-full h-full object-cover"
//           onError={(e) => { e.target.style.opacity = "0"; }} />
//         <div className="absolute inset-0" style={{ background: slide.overlay }} />
//       </div>
//       <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-12 lg:px-24">
//         <p className="text-[10px] sm:text-xs tracking-[0.4em] text-white/40 uppercase mb-3 sm:mb-5 font-light">✦ Lyra Collection</p>
//         <h1 className="font-light text-white leading-none mb-4 sm:mb-5 lyra-serif" style={{ fontSize: "clamp(2.2rem,7vw,6rem)" }}>
//           {slide.title}<br />
//           <span style={{ background: "linear-gradient(135deg,#f3e8ff,#e879f9,#fbcfe8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//             {slide.titleAccent}
//           </span>
//         </h1>
//         <p className="text-white/55 text-sm sm:text-base max-w-xs sm:max-w-lg mb-7 sm:mb-9 font-light leading-relaxed">{slide.subtitle}</p>
//         <div className="flex flex-wrap gap-3">
//           <button onClick={onShopClick} className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#1e0a3c] text-xs sm:text-sm font-bold rounded-2xl hover:bg-violet-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">{slide.cta} →</button>
//           <button onClick={onShopClick} className="px-5 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white text-xs sm:text-sm font-semibold rounded-2xl hover:bg-white/10 hover:border-white/60 transition-all duration-300">View Collections</button>
//         </div>
//         <div className="flex gap-2 mt-7 sm:mt-10">
//           {Array.from({ length: total }).map((_, i) => (
//             <button key={i} onClick={() => onDotClick(i)} className={`rounded-full transition-all ${i === currentIndex ? "w-8 h-1.5 bg-white" : "w-4 h-1.5 bg-white/35"}`} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── EDITORIAL STRIP ──────────────────────────────────────────────────────────
// const EditorialStrip = ({ onShopClick }) => {
//   const items = ["New Season", "Men's Edit", "Women's Edit", "Beauty Drop", "Tech Essentials", "Home Luxe"];
//   return (
//     <div className="lyra-editorial-strip overflow-hidden relative" style={{ background: "linear-gradient(135deg,#0f0820,#1e0a3c 40%,#2d1060 70%,#0f0820)" }}>
//       <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")", backgroundSize: "128px" }} />
//       <div className="relative z-10 flex flex-col lg:flex-row items-stretch" style={{ minHeight: "400px" }}>
//         <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-16">
//           <div className="inline-flex items-center gap-2 mb-5 self-start">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//             <span className="text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase">SS 2025 Collection</span>
//           </div>
//           <h2 className="lyra-serif text-white font-light leading-[0.95] mb-5" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
//             Style That<br />
//             <span style={{ background: "linear-gradient(90deg,#f9a8d4,#c084fc,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Speaks First.</span>
//           </h2>
//           <p className="text-white/40 text-sm sm:text-base max-w-sm mb-8 leading-relaxed font-light">Curated collections for every occasion.</p>
//           <div className="flex flex-wrap gap-3 mb-10">
//             {["Explore Men", "Explore Women", "New Arrivals"].map((label, i) => (
//               <button key={label} onClick={onShopClick} className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${i === 0 ? "bg-white text-[#1e0a3c] hover:bg-violet-100" : "border border-white/20 text-white/70 hover:border-white/50 hover:text-white"}`}>{label}</button>
//             ))}
//           </div>
//           <div className="flex items-center gap-6 sm:gap-10">
//             {[["50K+", "Products"], ["200+", "Brands"], ["4.9★", "Rating"]].map(([num, lbl]) => (
//               <div key={lbl}><p className="lyra-serif text-white font-semibold text-xl sm:text-2xl">{num}</p><p className="text-white/30 text-[10px] tracking-widest uppercase">{lbl}</p></div>
//             ))}
//           </div>
//         </div>
//         <div className="w-full lg:w-2/5 flex-shrink-0 grid grid-cols-2 gap-2 p-4 lg:p-6 self-center">
//           {[
//             { img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80", tall: true,  label: "Women's" },
//             { img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", tall: false, label: "Men's"   },
//             { img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", tall: false, label: "Watches" },
//           ].map((tile, i) => (
//             <div key={i} onClick={onShopClick} className={`relative overflow-hidden rounded-xl cursor-pointer group ${tile.tall ? "row-span-2" : ""}`} style={{ minHeight: tile.tall ? "220px" : "104px" }}>
//               <img src={tile.img} alt={tile.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//               <span className="absolute bottom-2 left-3 text-white text-[10px] font-bold tracking-widest uppercase opacity-80">{tile.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="border-t border-white/5 overflow-hidden py-3">
//         <div className="lyra-marquee-track flex items-center whitespace-nowrap" style={{ width: "max-content" }}>
//           {[...items, ...items, ...items].map((item, i) => (
//             <React.Fragment key={i}>
//               <span className="text-white/15 text-[11px] font-bold uppercase tracking-[0.3em] px-6">{item}</span>
//               <span className="text-violet-700/30 text-[10px]">✦</span>
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── BRAND SCROLL ──────────────────────────────────────────────────────────────
// const BrandScrollBar = ({ onBrandClick }) => {
//   const trackRef  = useRef(null);
//   const animRef   = useRef(null);
//   const posRef    = useRef(0);
//   const pausedRef = useRef(false);
//   useEffect(() => {
//     const track = trackRef.current;
//     if (!track) return;
//     const step = () => {
//       if (!pausedRef.current) { posRef.current += 0.4; if (posRef.current >= track.scrollWidth / 2) posRef.current = 0; track.style.transform = `translateX(-${posRef.current}px)`; }
//       animRef.current = requestAnimationFrame(step);
//     };
//     animRef.current = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(animRef.current);
//   }, []);
//   return (
//     <div className="mb-12">
//       <div className="flex items-center justify-between mb-5">
//         <div><p className="text-[10px] tracking-[0.35em] text-slate-400 uppercase mb-1.5">Partners</p><h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Top <span className="text-violet-600">Brands</span></h2></div>
//         <button className="text-xs text-violet-600 font-semibold border border-violet-200 hover:border-violet-400 px-4 py-1.5 rounded-full transition-colors">View All →</button>
//       </div>
//       <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 py-5 shadow-sm" onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }}>
//         <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: "linear-gradient(to right,white,transparent)" }} />
//         <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: "linear-gradient(to left,white,transparent)" }} />
//         <div ref={trackRef} className="flex items-center gap-3 px-4" style={{ width: "max-content", willChange: "transform" }}>
//           {BRANDS_LOOP.map((b, i) => (
//             <button key={`${b.name}-${i}`} onClick={() => onBrandClick(b.name)} className="flex-shrink-0 flex flex-col items-center gap-2 group">
//               <div className="w-24 h-12 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-violet-300 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all overflow-hidden px-3" style={{ background: b.bg }}>
//                 {b.logo ? <img src={b.logo} alt={b.name} className="max-w-full max-h-8 object-contain" onError={(e) => { e.target.style.display = "none"; }} /> : <span style={{ color: b.color || "#1e0a3c", fontFamily: "Georgia,serif", fontWeight: "bold", fontSize: "0.82rem" }}>{b.logoText || b.name}</span>}
//               </div>
//               <span className="text-[10px] text-gray-400 group-hover:text-violet-600 transition-colors font-medium">{b.name}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── PRODUCT CARD ──────────────────────────────────────────────────────────────
// const ProductCard = ({ product, onAddToCart }) => {
//   const navigate = useNavigate();
//   const { toggleWishlist, isWishlisted } = useWishlist();
//   const wishlisted = isWishlisted(product._id);
//   const disc = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
//   return (
//     <div onClick={() => navigate(`/product/${product._id}`)} className="lyra-card group cursor-pointer">
//       {product.badge && <span className="lyra-badge-hot">{product.badge}</span>}
//       {disc >= 30 && !product.badge && <span className="lyra-badge-sale">{disc}% OFF</span>}
//       <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} className="lyra-wish-btn" style={{ color: wishlisted ? "#ef4444" : "#cbd5e1" }}>
//         {wishlisted ? "♥" : "♡"}
//       </button>
//       <div className="lyra-card-img">
//         <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = "https://placehold.co/300x400/f8f9fa/9ca3af?text=Lyra"; }} />
//       </div>
//       <div className="p-3 sm:p-4">
//         <p className="lyra-card-brand">{product.brand || product.category}</p>
//         <p className="text-xs sm:text-sm font-medium text-gray-900 truncate mb-1.5">{product.name}</p>
//         <div className="flex items-center gap-0.5 mb-2">
//           {Array.from({ length: 5 }).map((_, i) => (<span key={i} className={`text-[10px] ${i < Math.floor(product.rating || 0) ? "text-amber-400" : "text-gray-200"}`}>★</span>))}
//           <span className="text-gray-400 text-[10px] ml-1">({(product.reviews || 0).toLocaleString()})</span>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-sm sm:text-base font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
//           {product.originalPrice && product.originalPrice > product.price && (<span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>)}
//           {disc > 0 && disc < 30 && (<span className="lyra-disc-tag">{disc}% off</span>)}
//         </div>
//         <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="lyra-card-atc">Add to Cart</button>
//       </div>
//     </div>
//   );
// };

// // ── COUNTDOWN ──────────────────────────────────────────────────────────────────
// const useCountdown = () => {
//   const [time, setTime] = useState({ h: "08", m: "23", s: "47" });
//   useEffect(() => {
//     const id = setInterval(() => setTime((prev) => {
//       let s = parseInt(prev.s) - 1, m = parseInt(prev.m), h = parseInt(prev.h);
//       if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; m = 59; s = 59; }
//       return { h: String(h).padStart(2, "0"), m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0") };
//     }), 1000);
//     return () => clearInterval(id);
//   }, []);
//   return time;
// };

// // ── MOBILE DRAWER ──────────────────────────────────────────────────────────────
// const MobileDrawer = ({ open, onClose, navigate, user, handleLogout, categories }) => {
//   if (!open) return null;
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />
//       <div className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white z-[70] overflow-y-auto shadow-2xl lyra-drawer">
//         <div className="bg-gradient-to-br from-[#1e0a3c] to-violet-700 px-6 py-8">
//           <div className="flex items-center justify-between mb-4">
//             <span className="lyra-serif text-white text-xl tracking-widest">LY<span className="text-pink-400">R</span>A</span>
//             <button onClick={onClose} className="text-white/60 hover:text-white text-xl">✕</button>
//           </div>
//           <p className="text-white font-semibold">{user.fullName || "Guest"}</p>
//           <p className="text-purple-300 text-xs mt-0.5">{user.email || user.mobileNumber || ""}</p>
//         </div>
//         <div className="p-4">
//           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 px-2">Shop</p>
//           {(categories || []).map((cat) => (
//             <button key={cat._id || cat.slug} onClick={() => { navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`); onClose(); }}
//               className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
//               <span className="flex items-center gap-2">{cat.icon && <span>{cat.icon}</span>}<span>{cat.label || cat.name}</span></span>
//               {cat.badge && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{cat.badge}</span>}
//             </button>
//           ))}
//           <div className="border-t border-slate-100 mt-3 pt-3">
//             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 px-2">Account</p>
//             {[{ label: "📦 My Orders", path: "/profile?tab=orders" }, { label: "👤 My Profile", path: "/profile?tab=profile" }, { label: "♡  Wishlist", path: "/wishlist" }, { label: "📍 Addresses", path: "/profile?tab=addresses" }].map((item) => (
//               <button key={item.label} onClick={() => { navigate(item.path); onClose(); }} className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">{item.label}</button>
//             ))}
//             <button onClick={handleLogout} className="w-full text-left px-3 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-1">🚪 Sign Out</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ── MEGA NAV ──────────────────────────────────────────────────────────────────
// const MegaNav = ({ categories, navigate }) => {
//   const [activeMega, setActiveMega] = useState(null);
//   const activeRef = useRef(null);
//   const timers    = useRef({});
//   const openMega  = useCallback((key) => { Object.values(timers.current).forEach(clearTimeout); timers.current = {}; activeRef.current = key; setActiveMega(key); }, []);
//   const closeMega = useCallback((key) => { timers.current[key] = setTimeout(() => { if (activeRef.current === key) { activeRef.current = null; setActiveMega(null); } }, 200); }, []);
//   const goTo      = useCallback((path) => { activeRef.current = null; setActiveMega(null); navigate(path); }, [navigate]);
//   return (
//     <div className="lyra-mega-nav relative z-[1000] border-t border-white/[0.06]" style={{ background: "rgba(0,0,0,0.18)" }}>
//       <div className="flex items-stretch justify-center max-w-screen-xl mx-auto overflow-x-visible scrollbar-none">
//         {(categories || []).map((item, idx) => {
//           const itemKey    = item.slug || item.name;
//           const isOpen     = activeMega === itemKey;
//           const isNoMenu   = item.noMenu;
//           const isSale     = item.slug === "sale" || item.name?.toLowerCase() === "sale";
//           const anchorRight = idx >= Math.floor((categories || []).length / 2);
//           const visibleCols = (item.columns || []).slice(0, 4);
//           const colCount    = visibleCols.length;
//           const panelWidth  = colCount === 0 ? 0 : colCount === 1 ? 280 : colCount === 2 ? 420 : colCount === 3 ? 560 : 700;
//           const hasDropdown = !isNoMenu && colCount > 0;
//           return (
//             <div key={itemKey} className="mega-parent relative" onMouseEnter={() => hasDropdown && openMega(itemKey)} onMouseLeave={() => hasDropdown && closeMega(itemKey)}>
//               <button onClick={() => { if (!hasDropdown) { goTo(`/category/${encodeURIComponent(item.slug || item.name)}`); } else { setActiveMega((v) => (v === itemKey ? null : itemKey)); } }} className={["nav-item", isSale ? "sale-item" : "", isOpen ? "active" : ""].filter(Boolean).join(" ")}>
//                 {item.icon && <span className="mr-1 opacity-70">{item.icon}</span>}
//                 {item.label || item.name}
//                 {item.badge && (<span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: item.badgeColor || "#ef4444" }}>{item.badge}</span>)}
//                 {hasDropdown && (<svg className={`ml-1 w-3 h-3 opacity-30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>)}
//               </button>
//               {hasDropdown && isOpen && (
//                 <div className={`mega-drop mega-panel bg-white shadow-2xl shadow-black/15 border-t-2 border-violet-500 ${anchorRight ? "anchor-right" : ""}`} style={{ minWidth: `${panelWidth}px`, position: "absolute", top: "100%", left: 0, zIndex: 100 }} onMouseEnter={() => openMega(itemKey)} onMouseLeave={() => closeMega(itemKey)}>
//                   <div className="flex">
//                     <div className="flex-1 grid gap-0 px-5 py-5" style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)`, columnGap: "16px" }}>
//                       {visibleCols.map((col) => (
//                         <div key={col._id || col.title} className="py-1">
//                           <p className="text-[9px] font-bold text-violet-600 uppercase tracking-[0.2em] mb-3 pb-2 border-b border-violet-100">{col.title}</p>
//                           <div className="space-y-1.5">
//                             {col.links.map((link) => (<span key={link._id || link.name} className="mega-link" onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}?sub=${encodeURIComponent(link.name)}`)}>{link.name}</span>))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     {item.featuredImg && (
//                       <div className="w-44 flex-shrink-0 relative overflow-hidden border-l border-gray-100">
//                         <img src={item.featuredImg} alt={item.featuredLabel || item.label || item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.parentElement.style.display = "none"; }} />
//                         <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,5,30,0.75) 0%, transparent 55%)" }} />
//                         <div className="absolute bottom-0 left-0 right-0 p-3">
//                           <p className="text-[9px] tracking-widest text-white/50 uppercase mb-1">Featured</p>
//                           <p className="text-white font-semibold text-xs">{item.featuredLabel || "New Arrivals"}</p>
//                           <button onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)} className="mt-1.5 text-[10px] text-white/70 hover:text-white transition-colors">Shop Now →</button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center gap-3 flex-wrap">
//                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Quick Shop:</span>
//                     {["New Arrivals", "Best Sellers", "Under ₹999", "Premium Picks"].map((q) => (
//                       <button key={q} onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)} className="text-[11px] text-violet-600 font-semibold hover:text-violet-800 px-3 py-1 rounded-full bg-violet-50 hover:bg-violet-100 transition-colors">{q}</button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════════════════
// // DASHBOARD
// // ══════════════════════════════════════════════════════════════════════════════
// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { cartCount }     = useCart();
//   const { wishlistCount } = useWishlist();
//   const countdown = useCountdown();

//   const [user,         setUser]         = useState({});
//   const [search,       setSearch]       = useState("");
//   const [showMenu,     setShowMenu]     = useState(false);
//   const [showDrawer,   setShowDrawer]   = useState(false);
//   const [activeBrand,  setActiveBrand]  = useState(null);
//   const [activeTab,    setActiveTab]    = useState("All");
//   const [modalProduct, setModalProduct] = useState(null);
//   const [products,     setProducts]     = useState([]);
//   const [scrolled,     setScrolled]     = useState(false);
//   const [currentSlide, setCurrent]      = useState(0);
//   const [heroSlides,   setHeroSlides]   = useState([]);
//   const [heroLoading,  setHeroLoading]  = useState(true);
//   const [categories,   setCategories]   = useState([]);

//   const shopRef = useRef(null);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const load = async () => {
//       const stored = sessionStorage.getItem("user");
//       if (!stored) { navigate("/"); return; }
//       setUser(JSON.parse(stored));
//       try { const { data } = await API.get("/products"); setProducts(Array.isArray(data) ? data : data.products || []); } catch (e) { console.error("Products:", e.message); }
//       try { const { data } = await API.get("/hero-slides/active"); setHeroSlides(data.slides || data || []); } catch (e) { console.warn("Hero slides:", e.message); } finally { setHeroLoading(false); }
//       try {
//         const { data } = await CAT_API.get("/categories");
//         const raw = Array.isArray(data) ? data : Array.isArray(data.categories) ? data.categories : Array.isArray(data?.data?.categories) ? data.data.categories : [];
//         setCategories(raw.filter((c) => c.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0)).map(normaliseCategory));
//       } catch (e) { console.warn("Categories:", e.message); }
//     };
//     load();
//   }, [navigate]);

//   useEffect(() => {
//     if (!heroSlides.length) return;
//     const t = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 5000);
//     return () => clearInterval(t);
//   }, [heroSlides.length]);

//   const scrollTo      = useCallback((ref) => { ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }); setShowMenu(false); }, []);
//   const handleLogout  = () => { sessionStorage.removeItem("user"); navigate("/"); };
//   const handleBrand   = (n) => { setActiveBrand(n); setActiveTab("All"); setSearch(""); scrollTo(shopRef); };

//   const filtered = products.filter((p) => {
//     if (activeTab !== "All" && p.category !== activeTab) return false;
//     if (activeBrand && (p.brand || "").toLowerCase() !== activeBrand.toLowerCase()) return false;
//     if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });

//   const dealsProducts = products.filter((p) => p.originalPrice && ((p.originalPrice - p.price) / p.originalPrice) >= 0.3).slice(0, 10);
//   const safeIdx       = heroSlides.length ? currentSlide % heroSlides.length : 0;
//   const firstName     = user.fullName?.split(" ")[0] || "Account";
//   const initials      = (user.fullName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

//   const showcaseCats = categories.slice(0, 8).map((cat) => ({
//     label: cat.label || cat.name,
//     sub:   (cat.columns || []).slice(0, 3).map((c) => c.title).join(" · "),
//     img:   cat.featuredImg || SHOWCASE_IMGS[cat.slug] || "",
//     route: `/category/${encodeURIComponent(cat.slug || cat.name)}`,
//   }));

//   return (
//     <div className="min-h-screen bg-[#f9f9fb]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
//         .lyra-body,.lyra-body*{font-family:'DM Sans',system-ui,sans-serif;box-sizing:border-box;}
//         .lyra-serif{font-family:'Cormorant Garamond',Georgia,serif!important;}
//         .lyra-hero{height:88vh;max-height:800px;}
//         @media(max-width:640px){.lyra-hero{height:75vh;max-height:600px;}}
//         .lyra-editorial-strip{min-height:400px;}
//         .lyra-drawer{animation:drawerSlide 0.28s cubic-bezier(0.16,1,0.3,1) forwards;}
//         @keyframes drawerSlide{from{transform:translateX(-100%)}to{transform:translateX(0)}}
//         @keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
//         .shimmer-text{background:linear-gradient(90deg,#c084fc,#f472b6,#fb923c,#c084fc);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite;}
//         @keyframes megaFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
//         .mega-panel{animation:megaFade 0.18s cubic-bezier(0.16,1,0.3,1) forwards;position:absolute;top:100%;left:0;}
//         @keyframes slideDown{from{opacity:0;transform:translateY(-8px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
//         .slide-down{animation:slideDown 0.2s cubic-bezier(0.16,1,0.3,1) forwards;}
//         .mega-link{position:relative;color:#4b5563;font-size:12px;font-weight:400;padding:3px 0;display:block;transition:color 0.15s;cursor:pointer;}
//         .mega-link:hover{color:#7c3aed;}
//         .mega-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#7c3aed;transition:width 0.2s ease;}
//         .mega-link:hover::after{width:100%;}
//         .nav-item{position:relative;padding:0 14px;height:42px;display:flex;align-items:center;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;cursor:pointer;transition:color 0.2s,background 0.2s;color:rgba(255,255,255,0.5);white-space:nowrap;}
//         .nav-item:hover{color:white;background:rgba(255,255,255,0.05);}
//         .nav-item.active{color:white;background:rgba(255,255,255,0.05);}
//         .nav-item::after{content:'';position:absolute;bottom:0;left:14px;right:14px;height:2px;background:white;transform:scaleX(0);transition:transform 0.2s ease;border-radius:2px 2px 0 0;}
//         .nav-item:hover::after,.nav-item.active::after{transform:scaleX(1);}
//         .nav-item.sale-item{color:#f87171;}
//         .nav-item.sale-item:hover{color:#fca5a5;}
//         .nav-item.sale-item::after{background:#ef4444;}
//         .mega-parent{position:relative;flex-shrink:0;}
//         .mega-drop{position:absolute;top:100%;left:0;z-index:200;}
//         .mega-drop.anchor-right{left:auto;right:0;}
//         @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
//         .lyra-marquee-track{animation:marquee 30s linear infinite;}
//         @media(max-width:1023px){.lyra-mega-nav{display:none!important}}
//         .lyra-mobile-hamburger{display:none;}
//         @media(max-width:1023px){.lyra-mobile-hamburger{display:flex!important}}
//         .lyra-trust-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-trust-grid{grid-template-columns:repeat(4,1fr)}}
//         .lyra-showcase-top{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-showcase-top{grid-template-columns:repeat(4,1fr)}}
//         .lyra-showcase-bottom{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-showcase-bottom{grid-template-columns:repeat(4,1fr)}}
//         .lyra-products-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:640px){.lyra-products-grid{grid-template-columns:repeat(3,1fr)}}
//         @media(min-width:1024px){.lyra-products-grid{grid-template-columns:repeat(4,1fr)}}
//         @media(min-width:1280px){.lyra-products-grid{grid-template-columns:repeat(5,1fr)}}
//         .lyra-editorial-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:1024px){.lyra-editorial-grid{grid-template-columns:repeat(4,1fr)}}
//         .scrollbar-none::-webkit-scrollbar{display:none;}
//         .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none;}

//         /* ── Product Card ── */
//         .lyra-card{background:white;border-radius:16px;border:1px solid #f1f5f9;overflow:hidden;position:relative;transition:all 0.3s;}
//         .lyra-card:hover{border-color:#ddd6fe;box-shadow:0 20px 40px -8px rgba(124,58,237,0.12);transform:translateY(-4px);}
//         .lyra-badge-hot{position:absolute;top:12px;left:12px;z-index:10;background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;}
//         .lyra-badge-sale{position:absolute;top:12px;left:12px;z-index:10;background:#10b981;color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;}
//         .lyra-wish-btn{position:absolute;top:12px;right:12px;z-index:10;width:32px;height:32px;background:rgba(255,255,255,0.9);backdrop-filter:blur(4px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:none;cursor:pointer;transition:transform 0.2s;}
//         .lyra-wish-btn:hover{transform:scale(1.15);}
//         .lyra-card-img{height:208px;overflow:hidden;background:linear-gradient(to bottom,#f8fafc,#f1f5f9);}
//         @media(min-width:640px){.lyra-card-img{height:240px;}}
//         .lyra-card-brand{font-size:10px;font-weight:600;color:#a78bfa;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;}
//         .lyra-disc-tag{font-size:10px;font-weight:600;color:#059669;background:#ecfdf5;padding:2px 8px;border-radius:8px;}
//         .lyra-card-atc{width:100%;margin-top:12px;padding:8px 0;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;font-size:10px;font-weight:600;border-radius:12px;border:none;cursor:pointer;opacity:0;transform:translateY(-4px);transition:all 0.3s;}
//         .lyra-card:hover .lyra-card-atc{opacity:1;transform:translateY(0);}
//         @media(min-width:640px){.lyra-card-atc{font-size:12px;padding:10px 0;}}

//         /* ── PROFILE PANEL ── */
//         .lyra-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(4px);z-index:998;}
//         .lyra-profile-panel{
//           position:fixed;top:0;right:0;bottom:0;width:320px;
//           background:white;z-index:999;
//           display:flex;flex-direction:column;
//           box-shadow:-20px 0 60px rgba(15,5,30,0.25);
//           overflow:hidden;
//         }
//         @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
//         .slide-in-right{animation:slideInRight 0.32s cubic-bezier(0.16,1,0.3,1) forwards;}
//         .lpp-header{
//           background:linear-gradient(145deg,#0f0820 0%,#1e0a3c 45%,#2d1060 100%);
//           padding:28px 20px 24px;
//           display:flex;align-items:flex-start;gap:14px;
//           position:relative;
//           flex-shrink:0;
//         }
//         .lpp-avatar-ring{
//           width:56px;height:56px;border-radius:50%;
//           background:linear-gradient(135deg,#a855f7,#ec4899);
//           padding:2px;flex-shrink:0;
//         }
//         .lpp-avatar{
//           width:100%;height:100%;border-radius:50%;
//           background:linear-gradient(135deg,#1e0a3c,#4c1d95);
//           display:flex;align-items:center;justify-content:center;
//           font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;
//           color:white;letter-spacing:0.05em;
//         }
//         .lpp-header-info{flex:1;min-width:0;}
//         .lpp-name{color:white;font-size:15px;font-weight:600;margin:0 0 3px;truncate:true;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lpp-contact{color:rgba(216,180,254,0.6);font-size:11px;margin:0 0 8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lpp-badge{
//           display:inline-flex;align-items:center;gap:4px;
//           background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.35);
//           color:#d8b4fe;font-size:9px;font-weight:700;
//           padding:3px 8px;border-radius:20px;letter-spacing:0.08em;text-transform:uppercase;
//         }
//         .lpp-close{
//           position:absolute;top:16px;right:16px;
//           width:28px;height:28px;border-radius:50%;
//           background:rgba(255,255,255,0.08);border:none;
//           color:rgba(255,255,255,0.5);font-size:14px;cursor:pointer;
//           display:flex;align-items:center;justify-content:center;
//           transition:all 0.2s;
//         }
//         .lpp-close:hover{background:rgba(255,255,255,0.18);color:white;}
//         .lpp-stats{
//           display:grid;grid-template-columns:repeat(3,1fr);
//           border-bottom:1px solid #f1f5f9;
//           flex-shrink:0;
//         }
//         .lpp-stat{display:flex;flex-direction:column;align-items:center;padding:14px 8px;gap:2px;}
//         .lpp-stat:not(:last-child){border-right:1px solid #f1f5f9;}
//         .lpp-stat-num{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:#1e0a3c;line-height:1;}
//         .lpp-stat-lbl{font-size:10px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;}
//         .lpp-menu{flex:1;overflow-y:auto;padding:12px;}
//         .lpp-item{
//           width:100%;display:flex;align-items:center;gap:12px;
//           padding:12px;border-radius:14px;border:none;background:transparent;
//           cursor:pointer;transition:all 0.2s;text-align:left;
//           margin-bottom:4px;
//         }
//         .lpp-item:hover{background:#faf5ff;}
//         .lpp-item-icon{
//           width:38px;height:38px;border-radius:11px;
//           display:flex;align-items:center;justify-content:center;
//           font-size:16px;flex-shrink:0;transition:transform 0.2s;
//         }
//         .lpp-item:hover .lpp-item-icon{transform:scale(1.1);}
//         .lpp-item-text{flex:1;min-width:0;}
//         .lpp-item-label{display:block;font-size:13px;font-weight:600;color:#1e1033;margin-bottom:1px;}
//         .lpp-item-sub{display:block;font-size:11px;color:#94a3b8;}
//         .lpp-item-arrow{color:#cbd5e1;font-size:18px;font-weight:300;flex-shrink:0;transition:transform 0.2s;}
//         .lpp-item:hover .lpp-item-arrow{transform:translateX(3px);color:#7c3aed;}
//         .lpp-footer{flex-shrink:0;padding:16px;border-top:1px solid #f1f5f9;}
//         .lpp-logout{
//           width:100%;padding:12px;border-radius:14px;
//           background:#fef2f2;border:1px solid #fee2e2;
//           color:#dc2626;font-size:13px;font-weight:600;
//           cursor:pointer;display:flex;align-items:center;justify-content:center;gap-8px;gap:8px;
//           transition:all 0.2s;
//         }
//         .lpp-logout:hover{background:#fee2e2;border-color:#fca5a5;}

//         /* ── Navbar Avatar Button ── */
//         .lyra-avatar-btn{
//           display:flex;align-items:center;gap:8px;
//           padding:6px 10px 6px 6px;
//           border-radius:24px;
//           background:rgba(255,255,255,0.08);
//           border:1px solid rgba(255,255,255,0.1);
//           cursor:pointer;transition:all 0.2s;
//         }
//         .lyra-avatar-btn:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.22);}
//         .lyra-avatar-circle{
//           width:28px;height:28px;border-radius:50%;
//           background:linear-gradient(135deg,#a855f7,#ec4899);
//           display:flex;align-items:center;justify-content:center;
//           font-size:10px;font-weight:700;color:white;letter-spacing:0.03em;
//           flex-shrink:0;
//         }
//         .lyra-avatar-name{font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.04em;text-transform:uppercase;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lyra-avatar-chevron{color:rgba(255,255,255,0.35);font-size:10px;margin-left:2px;}
//       `}</style>

//       <div className="lyra-body">

//         {/* ─── NAVBAR ─── */}
//         <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0c0618]/97 backdrop-blur-2xl shadow-2xl shadow-violet-950/40" : "bg-[#1e0a3c]"}`} onClick={() => setShowMenu(false)}>
//           <div className="bg-gradient-to-r from-[#1a0836] via-violet-800 to-[#1a0836] py-1.5 text-center border-b border-violet-800/20">
//             <span className="shimmer-text text-[10px] sm:text-xs font-semibold tracking-[0.12em]">✦ FREE DELIVERY ON ORDERS ABOVE ₹999 · NEW ARRIVALS EVERY FRIDAY · LYRA MEMBERS GET 10% OFF ✦</span>
//           </div>

//           <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3 sm:gap-5 border-b border-white/[0.06]">
//             <button onClick={(e) => { e.stopPropagation(); setShowDrawer(true); }} className="lyra-mobile-hamburger flex-shrink-0 w-9 h-9 items-center justify-center text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
//             </button>

//             <button onClick={() => { navigate("/dashboard"); setActiveTab("All"); setActiveBrand(null); }} className="lyra-serif text-xl sm:text-2xl tracking-[0.35em] text-white flex-shrink-0 select-none hover:opacity-90 transition-opacity">
//               LY<span className="text-pink-400">R</span>A
//               <sup className="text-white/20 ml-0.5 hidden sm:inline" style={{ fontSize: "7px", letterSpacing: "0.4em", verticalAlign: "top", marginTop: "6px" }}>FASHION</sup>
//             </button>

//             <div className="flex-1 max-w-2xl relative hidden sm:block">
//               <div className="flex items-center bg-white/8 border border-white/10 rounded-xl hover:bg-white/12 focus-within:bg-white focus-within:border-violet-400 transition-all group">
//                 <svg className="ml-3.5 w-4 h-4 text-white/30 group-focus-within:text-violet-600 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
//                 <input className="flex-1 py-2.5 px-3 text-sm bg-transparent outline-none text-white group-focus-within:text-gray-900 placeholder-white/30 group-focus-within:placeholder-gray-400 transition-colors" placeholder="Search fashion, footwear, beauty, electronics..." value={search} onChange={(e) => { setSearch(e.target.value); setActiveBrand(null); }} />
//                 {search && (<button onClick={() => setSearch("")} className="mr-3 w-5 h-5 rounded-full bg-white/15 text-white/60 flex items-center justify-center text-xs">✕</button>)}
//               </div>
//             </div>

//             <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
//               {/* Mobile search */}
//               <button className="sm:hidden flex items-center justify-center w-9 h-9 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
//               </button>

//               {/* Wishlist */}
//               <button onClick={() => navigate("/wishlist")} className="relative flex flex-col items-center px-2 sm:px-3 py-1.5 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill={wishlistCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
//                 <span className="hidden sm:block mt-0.5 text-white/35 text-[9px] tracking-wider">WISHLIST</span>
//                 {wishlistCount > 0 && (<span className="absolute -top-1 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ fontSize: "8px" }}>{wishlistCount}</span>)}
//               </button>

//               {/* Cart */}
//               <button onClick={() => navigate("/cart")} className="relative flex flex-col items-center px-2 sm:px-3 py-1.5 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
//                 <span className="hidden sm:block mt-0.5 text-white/35 text-[9px] tracking-wider">CART</span>
//                 {cartCount > 0 && (<span className="absolute -top-1 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ fontSize: "8px" }}>{cartCount}</span>)}
//               </button>

//               {/* ── UNIQUE PROFILE BUTTON ── */}
//               <div onClick={(e) => e.stopPropagation()}>
//                 <button onClick={() => setShowMenu((v) => !v)} className="lyra-avatar-btn ml-1">
//                   <div className="lyra-avatar-circle">{initials}</div>
//                   <span className="lyra-avatar-name hidden sm:block">{firstName}</span>
//                   <svg className="lyra-avatar-chevron w-3 h-3 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {categories.length > 0 && <MegaNav categories={categories} navigate={navigate} />}
//         </nav>

//         {/* ── PROFILE PANEL OVERLAY ── */}
//         {showMenu && (
//           <ProfilePanel
//             user={user}
//             onClose={() => setShowMenu(false)}
//             navigate={navigate}
//             handleLogout={handleLogout}
//           />
//         )}

//         <MobileDrawer open={showDrawer} onClose={() => setShowDrawer(false)} navigate={navigate} user={user} handleLogout={handleLogout} categories={categories} />

//         <div onClick={() => setShowMenu(false)}>
//           {!heroLoading && heroSlides.length > 0 && (<CinematicHero slide={heroSlides[safeIdx]} currentIndex={safeIdx} total={heroSlides.length} onDotClick={setCurrent} onShopClick={() => scrollTo(shopRef)} />)}
//           {!heroLoading && <EditorialStrip onShopClick={() => scrollTo(shopRef)} />}

//           <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
//             {/* Trust badges */}
//             <div className="lyra-trust-grid mb-10 sm:mb-14">
//               {[
//                 { icon: "🚚", title: "Free Delivery",   sub: "On orders above ₹999",  from: "from-violet-600", to: "to-purple-600" },
//                 { icon: "↩",  title: "30-Day Returns",  sub: "Hassle-free exchanges",  from: "from-teal-600",   to: "to-cyan-500"   },
//                 { icon: "🔒", title: "Secure Payments", sub: "100% safe & encrypted",  from: "from-amber-500",  to: "to-orange-500" },
//                 { icon: "⭐", title: "Lyra Rewards",    sub: "Earn on every purchase", from: "from-pink-600",   to: "to-rose-500"   },
//               ].map((o) => (
//                 <div key={o.title} className={`bg-gradient-to-r ${o.from} ${o.to} rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-all duration-300 shadow cursor-pointer`}>
//                   <span className="text-2xl sm:text-3xl">{o.icon}</span>
//                   <div><p className="lyra-serif text-white font-semibold text-sm sm:text-base">{o.title}</p><p className="text-white/70 text-[11px] sm:text-xs mt-0.5">{o.sub}</p></div>
//                 </div>
//               ))}
//             </div>

//             {/* Category showcase */}
//             {showcaseCats.length > 0 && (
//               <div className="mb-12 sm:mb-16">
//                 <div className="flex items-end justify-between mb-5 sm:mb-7">
//                   <div><p className="text-[10px] tracking-[0.3em] text-violet-400 uppercase mb-1.5">✦ All Categories</p><h2 className="lyra-serif text-3xl sm:text-4xl text-gray-900">Shop by <span className="text-violet-600">World</span></h2></div>
//                   <button className="text-xs sm:text-sm text-violet-600 font-semibold hover:underline">View All →</button>
//                 </div>
//                 <div className="lyra-showcase-top mb-3 sm:mb-4">
//                   {showcaseCats.slice(0, 4).map((cat) => (
//                     <div key={cat.label} onClick={() => navigate(cat.route)} className="relative overflow-hidden rounded-2xl cursor-pointer group" style={{ height: "clamp(180px,22vw,280px)" }}>
//                       <img src={cat.img} alt={cat.label} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.parentElement.style.background = "linear-gradient(135deg,#1e0a3c,#7c3aed)"; e.target.style.display = "none"; }} />
//                       <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(10,3,25,0.85) 0%,rgba(10,3,25,0.25) 55%,transparent 100%)" }} />
//                       <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
//                         <p className="lyra-serif text-white text-lg sm:text-2xl font-light leading-none mb-1">{cat.label}</p>
//                         <p className="text-white/50 text-[10px] sm:text-xs font-medium tracking-wide hidden sm:block">{cat.sub}</p>
//                         <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"><span className="text-[10px] sm:text-xs font-bold text-white bg-violet-600 px-2 sm:px-3 py-1 rounded-full">Shop Now</span></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="lyra-showcase-bottom">
//                   {showcaseCats.slice(4, 8).map((cat) => (
//                     <div key={cat.label} onClick={() => navigate(cat.route)} className="relative overflow-hidden rounded-2xl cursor-pointer group bg-white border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 flex" style={{ height: "90px" }}>
//                       <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden"><img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" style={{ maskImage: "linear-gradient(to right,transparent 0%,black 40%)", WebkitMaskImage: "linear-gradient(to right,transparent 0%,black 40%)" }} onError={(e) => { e.target.style.display = "none"; }} /></div>
//                       <div className="relative z-10 p-3 sm:p-4 flex flex-col justify-center flex-1"><p className="font-bold text-gray-900 text-xs sm:text-sm">{cat.label}</p><p className="text-gray-400 text-[10px] mt-0.5 leading-tight hidden sm:block">{cat.sub}</p><span className="mt-1.5 text-[10px] font-bold text-violet-600 tracking-wide">Explore →</span></div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Flash sale */}
//             <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5 mb-10 sm:mb-12 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 shadow-lg" style={{ background: "linear-gradient(135deg,#1e0a3c,#4c1d95,#6d28d9)" }}>
//               <div className="flex-1 min-w-0"><h3 className="lyra-serif text-white text-xl sm:text-2xl">Flash Sale</h3><p className="text-white/40 text-xs mt-0.5 hidden sm:block">Limited quantities — ends soon</p></div>
//               <span className="bg-pink-500 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full animate-pulse">⚡ LIVE</span>
//               <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
//                 {[[countdown.h, "HRS"], [countdown.m, "MIN"], [countdown.s, "SEC"]].map(([n, l], i) => (
//                   <React.Fragment key={l}>
//                     {i > 0 && <span className="text-violet-400 font-bold text-sm">:</span>}
//                     <div className="bg-white/10 border border-white/10 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-center min-w-[40px] sm:min-w-[48px]">
//                       <span className="lyra-serif text-white font-bold text-lg sm:text-xl block">{n}</span>
//                       <span className="text-white/30 text-[7px] sm:text-[8px] uppercase tracking-widest">{l}</span>
//                     </div>
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>

//             <BrandScrollBar onBrandClick={handleBrand} />

//             {/* Deals */}
//             {dealsProducts.length > 0 && (
//               <div className="mb-10 sm:mb-14">
//                 <div className="flex items-end justify-between mb-4 sm:mb-6">
//                   <div><p className="text-[10px] tracking-[0.3em] text-pink-400 uppercase mb-1">✦ Limited Time</p><h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Best <span className="text-pink-600">Deals</span></h2></div>
//                   <button className="text-xs sm:text-sm text-violet-600 font-semibold hover:underline">View All Deals →</button>
//                 </div>
//                 <div className="lyra-products-grid">
//                   {dealsProducts.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}
//                 </div>
//               </div>
//             )}

//             {/* Main product grid */}
//             <section ref={shopRef} id="shop">
//               <div className="flex items-center justify-between mb-5 sm:mb-7">
//                 <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">
//                   {activeBrand ? <>{activeBrand} <span className="text-violet-600">Collection</span></> : <>New <span className="text-violet-600">Arrivals</span></>}
//                 </h2>
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   {activeBrand && (<button onClick={() => setActiveBrand(null)} className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full hover:bg-violet-200 transition-colors">{activeBrand} <span className="font-bold">×</span></button>)}
//                   <button className="text-xs sm:text-sm text-violet-600 font-medium hover:underline">View All →</button>
//                 </div>
//               </div>
//               {filtered.length > 0 ? (
//                 <div className="lyra-products-grid">{filtered.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}</div>
//               ) : products.length === 0 ? (
//                 <div className="lyra-products-grid">{Array.from({ length: 10 }).map((_, i) => (<div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"><div className="h-52 sm:h-60 bg-slate-50" /><div className="p-4 space-y-2"><div className="h-2 bg-gray-100 rounded w-1/3" /><div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div></div>))}</div>
//               ) : (
//                 <div className="text-center py-20 sm:py-24 bg-white rounded-3xl border border-slate-100">
//                   <p className="text-4xl sm:text-5xl mb-4">🔍</p>
//                   <p className="lyra-serif text-xl text-gray-700 mb-2">No products found</p>
//                   <button onClick={() => { setSearch(""); setActiveBrand(null); setActiveTab("All"); }} className="mt-5 text-sm text-violet-600 font-medium hover:underline">Clear filters</button>
//                 </div>
//               )}
//             </section>

//             {/* Explore strip */}
//             <div className="mt-14 sm:mt-20 mb-10">
//               <div className="flex items-end justify-between mb-5 sm:mb-7">
//                 <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Explore <span className="text-violet-600">Collections</span></h2>
//               </div>
//               <div className="lyra-editorial-grid">
//                 {categories.slice(0, 4).map((cat, i) => {
//                   const overlays = ["#5b21b6", "#9d174d", "#1f2937", "#78350f"];
//                   const badges   = ["New Arrivals", "Editor Picks", "Best Sellers", "Luxury Picks"];
//                   return (
//                     <div key={cat._id || cat.slug} onClick={() => navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`)} className="relative rounded-2xl overflow-hidden cursor-pointer group shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ height: "clamp(140px,16vw,220px)" }}>
//                       <img src={cat.featuredImg || SHOWCASE_IMGS[cat.slug] || ""} alt={cat.label || cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display = "none"; }} />
//                       <div className="absolute inset-0 opacity-80" style={{ background: `linear-gradient(to top,${overlays[i]},transparent 65%)` }} />
//                       <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5">
//                         <span className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-1">{badges[i] || "Collection"}</span>
//                         <p className="lyra-serif text-white font-light text-base sm:text-xl leading-tight">{cat.label || cat.name}</p>
//                         <span className="text-white/45 text-[10px] sm:text-xs mt-1 group-hover:text-white transition-colors">Shop now →</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         <LyraFooter />
//         {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart }     from "./CartContext";
// import { useWishlist } from "./WishlistContext";
// import AddToCartModal  from "./AddToCartModal";
// import axios           from "axios";
// import LyraFooter      from "./Footer";

// // ── API instances ────────────────────────────────────────────────
// const API     = axios.create({ baseURL: "http://localhost:6055/api/admin" });
// const CAT_API = axios.create({ baseURL: "http://localhost:6055/api" });

// // Attach JWT from sessionStorage to every request automatically
// const attachToken = (instance) =>
//   instance.interceptors.request.use((cfg) => {
//     try {
//       const u = JSON.parse(sessionStorage.getItem("user") || "{}");
//       if (u.token) cfg.headers.Authorization = `Bearer ${u.token}`;
//     } catch {}
//     return cfg;
//   });
// attachToken(API);
// attachToken(CAT_API);

// // ── Fallback images keyed by category slug ───────────────────────
// const SHOWCASE_IMGS = {
//   men:         "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
//   women:       "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
//   kids:        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
//   beauty:      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
//   home:        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
//   electronics: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
//   sports:      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
//   watches:     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
//   sale:        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
// };

// const FEATURED_IMGS = {
//   men:         { img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", label: "New Arrivals"    },
//   women:       { img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", label: "Trending Now"    },
//   kids:        { img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80", label: "Back to School"  },
//   beauty:      { img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", label: "Bestsellers"     },
//   home:        { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",   label: "Trending Décor"  },
//   electronics: { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80", label: "Tech Picks"      },
//   sports:      { img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80", label: "New Season Gear" },
// };

// const BRANDS_LOOP = (() => {
//   const raw = [
//     { name:"Nike",           logo:"https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",                                                                   bg:"#f8f8f8" },
//     { name:"Adidas",         logo:"https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",                                                                  bg:"#f8f8f8" },
//     { name:"Zara",           logo:"https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",                                                                    bg:"#f8f8f8" },
//     { name:"H&M",            logo:"https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",                                                                   bg:"#fff5f5" },
//     { name:"Puma",           logo:"https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg",                                                                    bg:"#f8f8f8" },
//     { name:"Levi's",         logo:"https://upload.wikimedia.org/wikipedia/commons/7/7d/Levi%27s_logo_red.svg",                                                            bg:"#fff5f5" },
//     { name:"Gucci",          logo:"https://upload.wikimedia.org/wikipedia/commons/7/79/1000x1000_Gucci_logo.svg",                                                         bg:"#fafaf8" },
//     { name:"Rolex",          logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Rolex_Logo.png/640px-Rolex_Logo.png",                                        bg:"#f5faf5" },
//     { name:"Ray-Ban",        logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Ray-Ban_logo.svg/640px-Ray-Ban_logo.svg.png",                                bg:"#fff8f5" },
//     { name:"Tommy Hilfiger", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Tommy_Hilfiger_logo.svg/640px-Tommy_Hilfiger_logo.svg.png",                  bg:"#f5f5ff" },
//     { name:"Calvin Klein",   logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Calvin_Klein_color_logo.svg/640px-Calvin_Klein_color_logo.svg.png",          bg:"#f8f8f8" },
//     { name:"Lyra Studio",    logoText:"LYRA",  color:"#6d28d9", bg:"#f5f3ff" },
//     { name:"Elliot & Co",    logoText:"E&Co",  color:"#047857", bg:"#ecfdf5" },
//     { name:"BloomWear",      logoText:"bloom", color:"#be185d", bg:"#fdf2f8" },
//     { name:"TimeLux",        logoText:"TL",    color:"#92400e", bg:"#fffbeb" },
//     { name:"FlexFit",        logoText:"FF",    color:"#0f766e", bg:"#f0fdfa" },
//   ];
//   return [...raw, ...raw];
// })();

// // ══════════════════════════════════════════════════════════════════
// // NORMALISE CATEGORY — converts DB shape to a single canonical shape
// // Works with both static links[] and DB subCategories[{name}]
// // ══════════════════════════════════════════════════════════════════
// const normaliseCategory = (cat) => {
//   const slug          = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "";
//   const fallback      = FEATURED_IMGS[slug] || { img: "", label: "New Arrivals" };
//   const featuredImg   = cat.featuredImg   || cat.heroImg   || fallback.img;
//   const featuredLabel = cat.featuredLabel || cat.heroLabel || fallback.label;
//   const columns = (cat.columns || [])
//     .map((col) => {
//       const rawLinks =
//         Array.isArray(col.subCategories) ? col.subCategories :
//         Array.isArray(col.links)         ? col.links         : [];
//       const links = rawLinks
//         .map((item) => (typeof item === "string" ? { name: item } : item))
//         .filter((item) => item && typeof item.name === "string" && item.name.trim());
//       return { ...col, links };
//     })
//     .filter((col) => col.links.length > 0);
//   return { ...cat, slug, featuredImg, featuredLabel, columns, noMenu: Boolean(cat.noMenu) };
// };

// // ══════════════════════════════════════════════════════════════════
// // PROFILE PANEL — slide-in panel from right side of screen
// // Props:
// //   user           — sessionStorage user object
// //   orderCount     — live count from GET /api/orders/my
// //   wishlistCount  — live count from WishlistContext
// //   rewardPoints   — default 0 (extend when rewards system is built)
// //   loading        — true while order count is being fetched
// // ══════════════════════════════════════════════════════════════════
// const ProfilePanel = ({ user, onClose, navigate, handleLogout, orderCount, wishlistCount, rewardPoints, statsLoading }) => {
//   const initials = (user.fullName || "G").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

//   const menuItems = [
//     { icon:"📦", label:"My Orders",   sublabel:"Track & manage",    path:"/profile?tab=orders",    accent:"#7c3aed" },
//     { icon:"👤", label:"My Profile",  sublabel:"Edit details",       path:"/profile?tab=profile",   accent:"#0891b2" },
//     { icon:"♡",  label:"Wishlist",    sublabel:"Saved items",        path:"/wishlist",               accent:"#e11d48" },
//     { icon:"📍", label:"Addresses",   sublabel:"Delivery locations", path:"/profile?tab=addresses", accent:"#059669" },
//     { icon:"🎁", label:"Rewards",     sublabel:"Points & offers",    path:"/profile?tab=rewards",   accent:"#d97706" },
//   ];

//   // Stat tiles — data driven from props
//   const stats = [
//     { label:"Orders",  value: statsLoading ? "…" : String(orderCount)  },
//     { label:"Wishlist",value: statsLoading ? "…" : String(wishlistCount) },
//     { label:"Points",  value: statsLoading ? "…" : String(rewardPoints) },
//   ];

//   return (
//     <>
//       {/* Backdrop */}
//       <div className="lyra-overlay" onClick={onClose} />

//       {/* Panel */}
//       <div className="lyra-profile-panel slide-in-right">

//         {/* Header */}
//         <div className="lpp-header">
//           <div className="lpp-avatar-ring">
//             <div className="lpp-avatar">{initials}</div>
//           </div>
//           <div className="lpp-header-info">
//             <p className="lpp-name">{user.fullName || "Guest"}</p>
//             <p className="lpp-contact">{user.email || user.mobileNumber || ""}</p>
//             <span className="lpp-badge">✦ Lyra Member</span>
//           </div>
//           <button onClick={onClose} className="lpp-close">✕</button>
//         </div>

//         {/* Stats row — live data */}
//         <div className="lpp-stats">
//           {stats.map(({ label, value }) => (
//             <div key={label} className="lpp-stat">
//               <span className="lpp-stat-num">{value}</span>
//               <span className="lpp-stat-lbl">{label}</span>
//             </div>
//           ))}
//         </div>

//         {/* Menu */}
//         <div className="lpp-menu">
//           {menuItems.map((item) => (
//             <button key={item.label} onClick={() => { onClose(); navigate(item.path); }} className="lpp-item">
//               <span className="lpp-item-icon" style={{ background: item.accent + "18", color: item.accent }}>
//                 {item.icon}
//               </span>
//               <div className="lpp-item-text">
//                 <span className="lpp-item-label">{item.label}</span>
//                 <span className="lpp-item-sub">{item.sublabel}</span>
//               </div>
//               <span className="lpp-item-arrow">›</span>
//             </button>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="lpp-footer">
//           <button onClick={() => { onClose(); handleLogout(); }} className="lpp-logout">
//             <span>🚪</span> Sign Out
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // CINEMATIC HERO
// // ══════════════════════════════════════════════════════════════════
// const CinematicHero = ({ slide, currentIndex, total, onDotClick, onShopClick }) => {
//   if (!slide) return null;
//   return (
//     <div className="relative w-full overflow-hidden lyra-hero">
//       <div className="absolute inset-0">
//         <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.opacity="0"; }} />
//         <div className="absolute inset-0" style={{ background: slide.overlay }} />
//       </div>
//       <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-12 lg:px-24">
//         <p className="text-[10px] sm:text-xs tracking-[0.4em] text-white/40 uppercase mb-3 sm:mb-5 font-light">✦ Lyra Collection</p>
//         <h1 className="font-light text-white leading-none mb-4 sm:mb-5 lyra-serif" style={{ fontSize:"clamp(2.2rem,7vw,6rem)" }}>
//           {slide.title}<br />
//           <span style={{ background:"linear-gradient(135deg,#f3e8ff,#e879f9,#fbcfe8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
//             {slide.titleAccent}
//           </span>
//         </h1>
//         <p className="text-white/55 text-sm sm:text-base max-w-xs sm:max-w-lg mb-7 sm:mb-9 font-light leading-relaxed">{slide.subtitle}</p>
//         <div className="flex flex-wrap gap-3">
//           <button onClick={onShopClick} className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#1e0a3c] text-xs sm:text-sm font-bold rounded-2xl hover:bg-violet-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">{slide.cta} →</button>
//           <button onClick={onShopClick} className="px-5 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white text-xs sm:text-sm font-semibold rounded-2xl hover:bg-white/10 hover:border-white/60 transition-all duration-300">View Collections</button>
//         </div>
//         <div className="flex gap-2 mt-7 sm:mt-10">
//           {Array.from({ length: total }).map((_, i) => (
//             <button key={i} onClick={() => onDotClick(i)} className={`rounded-full transition-all ${i === currentIndex ? "w-8 h-1.5 bg-white" : "w-4 h-1.5 bg-white/35"}`} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // EDITORIAL STRIP
// // ══════════════════════════════════════════════════════════════════
// const EditorialStrip = ({ onShopClick }) => {
//   const marqueeItems = ["New Season","Men's Edit","Women's Edit","Beauty Drop","Tech Essentials","Home Luxe"];
//   return (
//     <div className="lyra-editorial-strip overflow-hidden relative"
//       style={{ background:"linear-gradient(135deg,#0f0820,#1e0a3c 40%,#2d1060 70%,#0f0820)" }}>
//       <div className="absolute inset-0 opacity-20 pointer-events-none"
//         style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")", backgroundSize:"128px" }} />
//       <div className="relative z-10 flex flex-col lg:flex-row items-stretch" style={{ minHeight:"400px" }}>
//         <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-16">
//           <div className="inline-flex items-center gap-2 mb-5 self-start">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//             <span className="text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase">SS 2025 Collection</span>
//           </div>
//           <h2 className="lyra-serif text-white font-light leading-[0.95] mb-5" style={{ fontSize:"clamp(2.4rem,5.5vw,4.8rem)" }}>
//             Style That<br />
//             <span style={{ background:"linear-gradient(90deg,#f9a8d4,#c084fc,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
//               Speaks First.
//             </span>
//           </h2>
//           <p className="text-white/40 text-sm sm:text-base max-w-sm mb-8 leading-relaxed font-light">
//             Curated collections for every occasion. Discover pieces that define your story this season.
//           </p>
//           <div className="flex flex-wrap gap-3 mb-10">
//             {["Explore Men","Explore Women","New Arrivals"].map((label, i) => (
//               <button key={label} onClick={onShopClick}
//                 className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
//                   i === 0 ? "bg-white text-[#1e0a3c] hover:bg-violet-100" : "border border-white/20 text-white/70 hover:border-white/50 hover:text-white"
//                 }`}>
//                 {label}
//               </button>
//             ))}
//           </div>
//           <div className="flex items-center gap-6 sm:gap-10">
//             {[["50K+","Products"],["200+","Brands"],["4.9★","Rating"]].map(([num, lbl]) => (
//               <div key={lbl}>
//                 <p className="lyra-serif text-white font-semibold text-xl sm:text-2xl">{num}</p>
//                 <p className="text-white/30 text-[10px] tracking-widest uppercase">{lbl}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="w-full lg:w-2/5 flex-shrink-0 grid grid-cols-2 gap-2 p-4 lg:p-6 self-center">
//           {[
//             { img:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80", tall:true,  label:"Women's" },
//             { img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", tall:false, label:"Men's"   },
//             { img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", tall:false, label:"Watches" },
//           ].map((tile, i) => (
//             <div key={i} onClick={onShopClick}
//               className={`relative overflow-hidden rounded-xl cursor-pointer group ${tile.tall ? "row-span-2" : ""}`}
//               style={{ minHeight:tile.tall ? "220px" : "104px" }}>
//               <img src={tile.img} alt={tile.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//               <span className="absolute bottom-2 left-3 text-white text-[10px] font-bold tracking-widest uppercase opacity-80">{tile.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Marquee strip */}
//       <div className="border-t border-white/5 overflow-hidden py-3">
//         <div className="lyra-marquee-track flex items-center whitespace-nowrap" style={{ width:"max-content" }}>
//           {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
//             <React.Fragment key={i}>
//               <span className="text-white/15 text-[11px] font-bold uppercase tracking-[0.3em] px-6">{item}</span>
//               <span className="text-violet-700/30 text-[10px]">✦</span>
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // BRAND SCROLL
// // ══════════════════════════════════════════════════════════════════
// const BrandScrollBar = ({ onBrandClick }) => {
//   const trackRef  = useRef(null);
//   const animRef   = useRef(null);
//   const posRef    = useRef(0);
//   const pausedRef = useRef(false);
//   useEffect(() => {
//     const track = trackRef.current;
//     if (!track) return;
//     const step = () => {
//       if (!pausedRef.current) {
//         posRef.current += 0.4;
//         if (posRef.current >= track.scrollWidth / 2) posRef.current = 0;
//         track.style.transform = `translateX(-${posRef.current}px)`;
//       }
//       animRef.current = requestAnimationFrame(step);
//     };
//     animRef.current = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(animRef.current);
//   }, []);
//   return (
//     <div className="mb-12">
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <p className="text-[10px] tracking-[0.35em] text-slate-400 uppercase mb-1.5">Partners</p>
//           <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Top <span className="text-violet-600">Brands</span></h2>
//         </div>
//         <button className="text-xs text-violet-600 font-semibold border border-violet-200 hover:border-violet-400 px-4 py-1.5 rounded-full transition-colors">View All →</button>
//       </div>
//       <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 py-5 shadow-sm"
//         onMouseEnter={() => { pausedRef.current = true; }}
//         onMouseLeave={() => { pausedRef.current = false; }}>
//         <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background:"linear-gradient(to right,white,transparent)" }} />
//         <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background:"linear-gradient(to left,white,transparent)" }} />
//         <div ref={trackRef} className="flex items-center gap-3 px-4" style={{ width:"max-content", willChange:"transform" }}>
//           {BRANDS_LOOP.map((b, i) => (
//             <button key={`${b.name}-${i}`} onClick={() => onBrandClick(b.name)} className="flex-shrink-0 flex flex-col items-center gap-2 group">
//               <div className="w-24 h-12 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-violet-300 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all overflow-hidden px-3"
//                 style={{ background:b.bg }}>
//                 {b.logo
//                   ? <img src={b.logo} alt={b.name} className="max-w-full max-h-8 object-contain" onError={(e) => { e.target.style.display="none"; }} />
//                   : <span style={{ color:b.color||"#1e0a3c", fontFamily:"Georgia,serif", fontWeight:"bold", fontSize:"0.82rem" }}>{b.logoText||b.name}</span>
//                 }
//               </div>
//               <span className="text-[10px] text-gray-400 group-hover:text-violet-600 transition-colors font-medium">{b.name}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // PRODUCT CARD
// // ══════════════════════════════════════════════════════════════════
// const ProductCard = ({ product, onAddToCart }) => {
//   const navigate = useNavigate();
//   const { toggleWishlist, isWishlisted } = useWishlist();
//   const wishlisted = isWishlisted(product._id);
//   const disc = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
//   return (
//     <div onClick={() => navigate(`/product/${product._id}`)} className="lyra-card group cursor-pointer">
//       {product.badge && <span className="lyra-badge-hot">{product.badge}</span>}
//       {disc >= 30 && !product.badge && <span className="lyra-badge-sale">{disc}% OFF</span>}
//       <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} className="lyra-wish-btn" style={{ color:wishlisted?"#ef4444":"#cbd5e1" }}>
//         {wishlisted ? "♥" : "♡"}
//       </button>
//       <div className="lyra-card-img">
//         <img src={product.image || product.images?.[0]} alt={product.name}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//           onError={(e) => { e.target.src="https://placehold.co/300x400/f8f9fa/9ca3af?text=Lyra"; }} />
//       </div>
//       <div className="p-3 sm:p-4">
//         <p className="lyra-card-brand">{product.brand || product.category}</p>
//         <p className="text-xs sm:text-sm font-medium text-gray-900 truncate mb-1.5">{product.name}</p>
//         <div className="flex items-center gap-0.5 mb-2">
//           {Array.from({ length:5 }).map((_, i) => (<span key={i} className={`text-[10px] ${i < Math.floor(product.rating||0) ? "text-amber-400" : "text-gray-200"}`}>★</span>))}
//           <span className="text-gray-400 text-[10px] ml-1">({(product.reviews||0).toLocaleString()})</span>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-sm sm:text-base font-bold text-gray-900">₹{(product.price||0).toLocaleString()}</span>
//           {product.originalPrice && product.originalPrice > product.price && <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>}
//           {disc > 0 && disc < 30 && <span className="lyra-disc-tag">{disc}% off</span>}
//         </div>
//         <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="lyra-card-atc">Add to Cart</button>
//       </div>
//     </div>
//   );
// };

// // ── Countdown ──────────────────────────────────────────────────────
// const useCountdown = () => {
//   const [time, setTime] = useState({ h:"08", m:"23", s:"47" });
//   useEffect(() => {
//     const id = setInterval(() => setTime((prev) => {
//       let s = parseInt(prev.s)-1, m=parseInt(prev.m), h=parseInt(prev.h);
//       if (s<0){s=59;m--;} if (m<0){m=59;h--;} if (h<0){h=23;m=59;s=59;}
//       return { h:String(h).padStart(2,"0"), m:String(m).padStart(2,"0"), s:String(s).padStart(2,"0") };
//     }), 1000);
//     return () => clearInterval(id);
//   }, []);
//   return time;
// };

// // ══════════════════════════════════════════════════════════════════
// // MOBILE DRAWER
// // ══════════════════════════════════════════════════════════════════
// const MobileDrawer = ({ open, onClose, navigate, user, handleLogout, categories }) => {
//   if (!open) return null;
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />
//       <div className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white z-[70] overflow-y-auto shadow-2xl lyra-drawer">
//         <div className="bg-gradient-to-br from-[#1e0a3c] to-violet-700 px-6 py-8">
//           <div className="flex items-center justify-between mb-4">
//             <span className="lyra-serif text-white text-xl tracking-widest">LY<span className="text-pink-400">R</span>A</span>
//             <button onClick={onClose} className="text-white/60 hover:text-white text-xl">✕</button>
//           </div>
//           <p className="text-white font-semibold">{user.fullName || "Guest"}</p>
//           <p className="text-purple-300 text-xs mt-0.5">{user.email || user.mobileNumber || ""}</p>
//         </div>
//         <div className="p-4">
//           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 px-2">Shop</p>
//           {(categories || []).map((cat) => (
//             <button key={cat._id || cat.slug} onClick={() => { navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`); onClose(); }}
//               className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
//               <span className="flex items-center gap-2">{cat.icon && <span>{cat.icon}</span>}<span>{cat.label || cat.name}</span></span>
//               {cat.badge && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{cat.badge}</span>}
//             </button>
//           ))}
//           <div className="border-t border-slate-100 mt-3 pt-3">
//             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 px-2">Account</p>
//             {[
//               { label:"📦 My Orders",  path:"/profile?tab=orders"    },
//               { label:"👤 My Profile", path:"/profile?tab=profile"   },
//               { label:"♡  Wishlist",   path:"/wishlist"              },
//               { label:"📍 Addresses",  path:"/profile?tab=addresses" },
//             ].map((item) => (
//               <button key={item.label} onClick={() => { navigate(item.path); onClose(); }}
//                 className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
//                 {item.label}
//               </button>
//             ))}
//             <button onClick={handleLogout} className="w-full text-left px-3 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-1">🚪 Sign Out</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // MEGA NAV — fully backend-driven
// // ══════════════════════════════════════════════════════════════════
// const MegaNav = ({ categories, navigate }) => {
//   const [activeMega, setActiveMega] = useState(null);
//   const activeRef = useRef(null);
//   const timers    = useRef({});

//   const openMega = useCallback((key) => {
//     Object.values(timers.current).forEach(clearTimeout);
//     timers.current = {};
//     activeRef.current = key;
//     setActiveMega(key);
//   }, []);

//   const closeMega = useCallback((key) => {
//     timers.current[key] = setTimeout(() => {
//       if (activeRef.current === key) { activeRef.current = null; setActiveMega(null); }
//     }, 200);
//   }, []);

//   const goTo = useCallback((path) => {
//     activeRef.current = null;
//     setActiveMega(null);
//     navigate(path);
//   }, [navigate]);

//   return (
//     <div className="lyra-mega-nav relative z-[1000] border-t border-white/[0.06]"
//       style={{ background:"rgba(0,0,0,0.18)" }}>
//       <div className="flex items-stretch justify-center max-w-screen-xl mx-auto overflow-x-visible scrollbar-none">
//         {(categories || []).map((item, idx) => {
//           const itemKey     = item.slug || item.name;
//           const isOpen      = activeMega === itemKey;
//           const isNoMenu    = item.noMenu;
//           const isSale      = (item.slug || item.name || "").toLowerCase() === "sale";
//           const anchorRight = idx >= Math.floor((categories || []).length / 2);
//           const visibleCols = (item.columns || []).slice(0, 4);
//           const colCount    = visibleCols.length;
//           const panelWidth  = colCount === 0 ? 0 : colCount === 1 ? 280 : colCount === 2 ? 420 : colCount === 3 ? 560 : 700;
//           const hasDropdown = !isNoMenu && colCount > 0;

//           return (
//             <div key={itemKey} className="mega-parent relative"
//               onMouseEnter={() => hasDropdown && openMega(itemKey)}
//               onMouseLeave={() => hasDropdown && closeMega(itemKey)}>

//               <button
//                 onClick={() => {
//                   if (!hasDropdown) { goTo(`/category/${encodeURIComponent(item.slug || item.name)}`); }
//                   else { setActiveMega((v) => v === itemKey ? null : itemKey); }
//                 }}
//                 className={["nav-item", isSale ? "sale-item" : "", isOpen ? "active" : ""].filter(Boolean).join(" ")}>
//                 {item.label || item.name}
//                 {item.badge && (
//                   <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
//                     style={{ background:item.badgeColor || "#ef4444" }}>
//                     {item.badge}
//                   </span>
//                 )}
//                 {hasDropdown && (
//                   <svg className={`ml-1 w-3 h-3 opacity-30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//                     fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 )}
//               </button>

//               {/* ── Mega dropdown ── */}
//               {hasDropdown && isOpen && (
//                 <div
//                   className={`mega-drop mega-panel bg-white shadow-2xl shadow-black/15 border-t-2 border-violet-500 ${anchorRight ? "anchor-right" : ""}`}
//                   style={{ minWidth:`${panelWidth}px`, position:"absolute", top:"100%", left:0, zIndex:100 }}
//                   onMouseEnter={() => openMega(itemKey)}
//                   onMouseLeave={() => closeMega(itemKey)}
//                 >
//                   {/* Invisible gap bridge — prevents mouseleave when cursor travels into panel */}
//                   <div style={{ position:"absolute", top:"-8px", left:0, right:0, height:"8px" }}
//                     onMouseEnter={() => openMega(itemKey)} />

//                   <div className="flex">
//                     {/* Columns */}
//                     <div className="flex-1 grid gap-0 px-5 py-5"
//                       style={{ gridTemplateColumns:`repeat(${colCount}, 1fr)`, columnGap:"16px" }}>
//                       {visibleCols.map((col) => (
//                         <div key={col._id || col.title} className="py-1">
//                           <p className="text-[9px] font-bold text-violet-600 uppercase tracking-[0.2em] mb-3 pb-2 border-b border-violet-100">
//                             {col.title}
//                           </p>
//                           <div className="space-y-1.5">
//                             {col.links.map((link) => (
//                               <span key={link._id || link.name} className="mega-link"
//                                 onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}?sub=${encodeURIComponent(link.name)}`)}>
//                                 {link.name}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Featured image panel */}
//                     {item.featuredImg && (
//                       <div className="w-44 flex-shrink-0 relative overflow-hidden border-l border-gray-100">
//                         <img src={item.featuredImg} alt={item.featuredLabel || item.label || item.name}
//                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                           onError={(e) => { e.target.parentElement.style.display="none"; }} />
//                         <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(15,5,30,0.75) 0%, transparent 55%)" }} />
//                         <div className="absolute bottom-0 left-0 right-0 p-3">
//                           <p className="text-[9px] tracking-widest text-white/50 uppercase mb-1">Featured</p>
//                           <p className="text-white font-semibold text-xs">{item.featuredLabel || "New Arrivals"}</p>
//                           <button onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)}
//                             className="mt-1.5 text-[10px] text-white/70 hover:text-white transition-colors">Shop Now →</button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Quick shop footer */}
//                   <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center gap-3 flex-wrap">
//                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Quick Shop:</span>
//                     {["New Arrivals","Best Sellers","Under ₹999","Premium Picks"].map((q) => (
//                       <button key={q} onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)}
//                         className="text-[11px] text-violet-600 font-semibold hover:text-violet-800 px-3 py-1 rounded-full bg-violet-50 hover:bg-violet-100 transition-colors">
//                         {q}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // DASHBOARD
// // ══════════════════════════════════════════════════════════════════
// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { cartCount }                   = useCart();
//   const { wishlistCount, wishlistItems } = useWishlist();
//   const countdown = useCountdown();

//   const [user,         setUser]         = useState({});
//   const [search,       setSearch]       = useState("");
//   const [showMenu,     setShowMenu]     = useState(false);
//   const [showDrawer,   setShowDrawer]   = useState(false);
//   const [activeBrand,  setActiveBrand]  = useState(null);
//   const [activeTab,    setActiveTab]    = useState("All");
//   const [modalProduct, setModalProduct] = useState(null);
//   const [products,     setProducts]     = useState([]);
//   const [scrolled,     setScrolled]     = useState(false);
//   const [currentSlide, setCurrent]      = useState(0);
//   const [heroSlides,   setHeroSlides]   = useState([]);
//   const [heroLoading,  setHeroLoading]  = useState(true);
//   const [categories,   setCategories]   = useState([]);

//   // ── Profile panel stats ── fetched when panel opens
//   const [orderCount,   setOrderCount]   = useState(0);
//   const [rewardPoints, setRewardPoints] = useState(0); // default 0, extend later
//   const [statsLoading, setStatsLoading] = useState(false);

//   const shopRef = useRef(null);

//   // ── Scroll ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60);
//     window.addEventListener("scroll", onScroll, { passive:true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // ── Main data load ──────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       const stored = sessionStorage.getItem("user");
//       if (!stored) { navigate("/"); return; }
//       setUser(JSON.parse(stored));

//       // Products
//       try {
//         const { data } = await API.get("/products");
//         setProducts(Array.isArray(data) ? data : data.products || []);
//       } catch (e) { console.error("Products:", e.message); }

//       // Hero slides (from admin hero-slides endpoint)
//       try {
//         const { data } = await API.get("/hero-slides/active");
//         setHeroSlides(data.slides || data || []);
//       } catch (e) { console.warn("Hero slides:", e.message); }
//       finally { setHeroLoading(false); }

//       // Categories — normalise every item to one consistent shape
//       try {
//         const { data } = await CAT_API.get("/categories");
//         const raw = Array.isArray(data) ? data
//           : Array.isArray(data.categories)        ? data.categories
//           : Array.isArray(data?.data?.categories) ? data.data.categories
//           : [];
//         setCategories(
//           raw.filter((c) => c.active !== false)
//              .sort((a, b) => (a.order || 0) - (b.order || 0))
//              .map(normaliseCategory)
//         );
//       } catch (e) { console.warn("Categories:", e.message); }
//     };
//     load();
//   }, [navigate]);

//   // ── Hero auto-advance ───────────────────────────────────────────
//   useEffect(() => {
//     if (!heroSlides.length) return;
//     const t = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 5000);
//     return () => clearInterval(t);
//   }, [heroSlides.length]);

//   // ── Fetch profile stats when panel opens ────────────────────────
//   // Orders  : GET /api/orders/my   (requires Bearer token)
//   // Wishlist: already live via WishlistContext (wishlistItems.length)
//   // Rewards : default 0 until a rewards endpoint exists
//   const fetchProfileStats = useCallback(async () => {
//     const stored = sessionStorage.getItem("user");
//     if (!stored) return;
//     const { token } = JSON.parse(stored);
//     if (!token) return;
//     setStatsLoading(true);
//     try {
//       const res = await fetch("http://localhost:6055/api/orders/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         const orders = Array.isArray(data) ? data : data.orders || [];
//         setOrderCount(orders.length);
//       }
//       // Rewards: placeholder — set to 0 or fetch from /api/users/me when available
//       setRewardPoints(0);
//     } catch (e) { console.error("Stats fetch:", e.message); }
//     finally { setStatsLoading(false); }
//   }, []);

//   // Open profile panel — fetch stats
//   const handleOpenMenu = useCallback((e) => {
//     e.stopPropagation();
//     setShowMenu((v) => {
//       if (!v) fetchProfileStats(); // fetch on open
//       return !v;
//     });
//   }, [fetchProfileStats]);

//   const scrollTo     = useCallback((ref) => { ref.current?.scrollIntoView({ behavior:"smooth", block:"start" }); setShowMenu(false); }, []);
//   const handleLogout = () => { sessionStorage.removeItem("user"); navigate("/"); };
//   const handleBrand  = (n) => { setActiveBrand(n); setActiveTab("All"); setSearch(""); scrollTo(shopRef); };

//   const filtered      = products.filter((p) => {
//     if (activeTab !== "All" && p.category !== activeTab) return false;
//     if (activeBrand && (p.brand||"").toLowerCase() !== activeBrand.toLowerCase()) return false;
//     if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });
//   const dealsProducts = products.filter((p) => p.originalPrice && ((p.originalPrice - p.price) / p.originalPrice) >= 0.3).slice(0, 10);
//   const safeIdx       = heroSlides.length ? currentSlide % heroSlides.length : 0;
//   const firstName     = user.fullName?.split(" ")[0] || "Account";
//   const initials      = (user.fullName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

//   const showcaseCats = categories.slice(0, 8).map((cat) => ({
//     label: cat.label || cat.name,
//     sub:   (cat.columns || []).slice(0, 3).map((c) => c.title).join(" · "),
//     img:   cat.featuredImg || SHOWCASE_IMGS[cat.slug] || "",
//     route: `/category/${encodeURIComponent(cat.slug || cat.name)}`,
//   }));

//   return (
//     <div className="min-h-screen bg-[#f9f9fb]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
//         .lyra-body,.lyra-body*{font-family:'DM Sans',system-ui,sans-serif;box-sizing:border-box;}
//         .lyra-serif{font-family:'Cormorant Garamond',Georgia,serif!important;}
//         .lyra-hero{height:88vh;max-height:800px;}
//         @media(max-width:640px){.lyra-hero{height:75vh;max-height:600px;}}
//         .lyra-editorial-strip{min-height:400px;}
//         .lyra-drawer{animation:drawerSlide 0.28s cubic-bezier(0.16,1,0.3,1) forwards;}
//         @keyframes drawerSlide{from{transform:translateX(-100%)}to{transform:translateX(0)}}
//         @keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
//         .shimmer-text{background:linear-gradient(90deg,#c084fc,#f472b6,#fb923c,#c084fc);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite;}
//         @keyframes megaFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
//         .mega-panel{animation:megaFade 0.18s cubic-bezier(0.16,1,0.3,1) forwards;}
//         @keyframes slideDown{from{opacity:0;transform:translateY(-8px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
//         .slide-down{animation:slideDown 0.2s cubic-bezier(0.16,1,0.3,1) forwards;}
//         .mega-link{position:relative;color:#4b5563;font-size:12px;font-weight:400;padding:3px 0;display:block;transition:color 0.15s;cursor:pointer;}
//         .mega-link:hover{color:#7c3aed;}
//         .mega-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#7c3aed;transition:width 0.2s ease;}
//         .mega-link:hover::after{width:100%;}
//         .nav-item{position:relative;padding:0 14px;height:42px;display:flex;align-items:center;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;cursor:pointer;transition:color 0.2s,background 0.2s;color:rgba(255,255,255,0.5);white-space:nowrap;}
//         .nav-item:hover{color:white;background:rgba(255,255,255,0.05);}
//         .nav-item.active{color:white;background:rgba(255,255,255,0.05);}
//         .nav-item::after{content:'';position:absolute;bottom:0;left:14px;right:14px;height:2px;background:white;transform:scaleX(0);transition:transform 0.2s ease;border-radius:2px 2px 0 0;}
//         .nav-item:hover::after,.nav-item.active::after{transform:scaleX(1);}
//         .nav-item.sale-item{color:#f87171;}
//         .nav-item.sale-item:hover{color:#fca5a5;}
//         .nav-item.sale-item::after{background:#ef4444;}
//         .mega-parent{position:relative;flex-shrink:0;}
//         .mega-drop{position:absolute;top:100%;left:0;z-index:200;}
//         .mega-drop.anchor-right{left:auto;right:0;}
//         @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
//         .lyra-marquee-track{animation:marquee 30s linear infinite;}
//         @media(max-width:1023px){.lyra-mega-nav{display:none!important}}
//         .lyra-mobile-hamburger{display:none;}
//         @media(max-width:1023px){.lyra-mobile-hamburger{display:flex!important}}
//         .lyra-trust-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-trust-grid{grid-template-columns:repeat(4,1fr)}}
//         .lyra-showcase-top{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-showcase-top{grid-template-columns:repeat(4,1fr)}}
//         .lyra-showcase-bottom{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-showcase-bottom{grid-template-columns:repeat(4,1fr)}}
//         .lyra-products-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:640px){.lyra-products-grid{grid-template-columns:repeat(3,1fr)}}
//         @media(min-width:1024px){.lyra-products-grid{grid-template-columns:repeat(4,1fr)}}
//         @media(min-width:1280px){.lyra-products-grid{grid-template-columns:repeat(5,1fr)}}
//         .lyra-editorial-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:1024px){.lyra-editorial-grid{grid-template-columns:repeat(4,1fr)}}
//         .scrollbar-none::-webkit-scrollbar{display:none;}
//         .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none;}

//         /* ── Product Card ── */
//         .lyra-card{background:white;border-radius:16px;border:1px solid #f1f5f9;overflow:hidden;position:relative;transition:all 0.3s;}
//         .lyra-card:hover{border-color:#ddd6fe;box-shadow:0 20px 40px -8px rgba(124,58,237,0.12);transform:translateY(-4px);}
//         .lyra-badge-hot{position:absolute;top:12px;left:12px;z-index:10;background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;}
//         .lyra-badge-sale{position:absolute;top:12px;left:12px;z-index:10;background:#10b981;color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;}
//         .lyra-wish-btn{position:absolute;top:12px;right:12px;z-index:10;width:32px;height:32px;background:rgba(255,255,255,0.9);backdrop-filter:blur(4px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:none;cursor:pointer;transition:transform 0.2s;}
//         .lyra-wish-btn:hover{transform:scale(1.15);}
//         .lyra-card-img{height:208px;overflow:hidden;background:linear-gradient(to bottom,#f8fafc,#f1f5f9);}
//         @media(min-width:640px){.lyra-card-img{height:240px;}}
//         .lyra-card-brand{font-size:10px;font-weight:600;color:#a78bfa;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;}
//         .lyra-disc-tag{font-size:10px;font-weight:600;color:#059669;background:#ecfdf5;padding:2px 8px;border-radius:8px;}
//         .lyra-card-atc{width:100%;margin-top:12px;padding:8px 0;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;font-size:10px;font-weight:600;border-radius:12px;border:none;cursor:pointer;opacity:0;transform:translateY(-4px);transition:all 0.3s;}
//         .lyra-card:hover .lyra-card-atc{opacity:1;transform:translateY(0);}
//         @media(min-width:640px){.lyra-card-atc{font-size:12px;padding:10px 0;}}

//         /* ── Profile Panel ── */
//         .lyra-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(4px);z-index:998;}
//         .lyra-profile-panel{position:fixed;top:0;right:0;bottom:0;width:320px;background:white;z-index:999;display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(15,5,30,0.25);overflow:hidden;}
//         @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
//         .slide-in-right{animation:slideInRight 0.32s cubic-bezier(0.16,1,0.3,1) forwards;}
//         .lpp-header{background:linear-gradient(145deg,#0f0820 0%,#1e0a3c 45%,#2d1060 100%);padding:28px 20px 24px;display:flex;align-items:flex-start;gap:14px;position:relative;flex-shrink:0;}
//         .lpp-avatar-ring{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);padding:2px;flex-shrink:0;}
//         .lpp-avatar{width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#1e0a3c,#4c1d95);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:white;letter-spacing:0.05em;}
//         .lpp-header-info{flex:1;min-width:0;}
//         .lpp-name{color:white;font-size:15px;font-weight:600;margin:0 0 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lpp-contact{color:rgba(216,180,254,0.6);font-size:11px;margin:0 0 8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lpp-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.35);color:#d8b4fe;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:0.08em;text-transform:uppercase;}
//         .lpp-close{position:absolute;top:16px;right:16px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.08);border:none;color:rgba(255,255,255,0.5);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
//         .lpp-close:hover{background:rgba(255,255,255,0.18);color:white;}
//         /* Stats row */
//         .lpp-stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #f1f5f9;flex-shrink:0;}
//         .lpp-stat{display:flex;flex-direction:column;align-items:center;padding:14px 8px;gap:2px;}
//         .lpp-stat:not(:last-child){border-right:1px solid #f1f5f9;}
//         .lpp-stat-num{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:#1e0a3c;line-height:1;}
//         .lpp-stat-lbl{font-size:10px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;}
//         /* Menu */
//         .lpp-menu{flex:1;overflow-y:auto;padding:12px;}
//         .lpp-item{width:100%;display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;border:none;background:transparent;cursor:pointer;transition:all 0.2s;text-align:left;margin-bottom:4px;}
//         .lpp-item:hover{background:#faf5ff;}
//         .lpp-item-icon{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;transition:transform 0.2s;}
//         .lpp-item:hover .lpp-item-icon{transform:scale(1.1);}
//         .lpp-item-text{flex:1;min-width:0;}
//         .lpp-item-label{display:block;font-size:13px;font-weight:600;color:#1e1033;margin-bottom:1px;}
//         .lpp-item-sub{display:block;font-size:11px;color:#94a3b8;}
//         .lpp-item-arrow{color:#cbd5e1;font-size:18px;font-weight:300;flex-shrink:0;transition:transform 0.2s;}
//         .lpp-item:hover .lpp-item-arrow{transform:translateX(3px);color:#7c3aed;}
//         /* Footer */
//         .lpp-footer{flex-shrink:0;padding:16px;border-top:1px solid #f1f5f9;}
//         .lpp-logout{width:100%;padding:12px;border-radius:14px;background:#fef2f2;border:1px solid #fee2e2;color:#dc2626;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;}
//         .lpp-logout:hover{background:#fee2e2;border-color:#fca5a5;}

//         /* ── Avatar Button in navbar ── */
//         .lyra-avatar-btn{display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;border-radius:24px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);cursor:pointer;transition:all 0.2s;}
//         .lyra-avatar-btn:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.22);}
//         .lyra-avatar-circle{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:white;letter-spacing:0.03em;flex-shrink:0;}
//         .lyra-avatar-name{font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.04em;text-transform:uppercase;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lyra-avatar-chevron{color:rgba(255,255,255,0.35);font-size:10px;margin-left:2px;}
//       `}</style>

//       <div className="lyra-body">

//         {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
//         <nav
//           className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0c0618]/97 backdrop-blur-2xl shadow-2xl shadow-violet-950/40" : "bg-[#1e0a3c]"}`}
//           onClick={() => setShowMenu(false)}
//         >
//           {/* Announcement bar */}
//           <div className="bg-gradient-to-r from-[#1a0836] via-violet-800 to-[#1a0836] py-1.5 text-center border-b border-violet-800/20">
//             <span className="shimmer-text text-[10px] sm:text-xs font-semibold tracking-[0.12em]">
//               ✦ FREE DELIVERY ON ORDERS ABOVE ₹999 · NEW ARRIVALS EVERY FRIDAY · LYRA MEMBERS GET 10% OFF ✦
//             </span>
//           </div>

//           {/* Logo + Search + Icons */}
//           <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3 sm:gap-5 border-b border-white/[0.06]">

//             {/* Hamburger (mobile) */}
//             <button onClick={(e) => { e.stopPropagation(); setShowDrawer(true); }}
//               className="lyra-mobile-hamburger flex-shrink-0 w-9 h-9 items-center justify-center text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>

//             {/* Logo */}
//             <button onClick={() => { navigate("/dashboard"); setActiveTab("All"); setActiveBrand(null); }}
//               className="lyra-serif text-xl sm:text-2xl tracking-[0.35em] text-white flex-shrink-0 select-none hover:opacity-90 transition-opacity">
//               LY<span className="text-pink-400">R</span>A
//               <sup className="text-white/20 ml-0.5 hidden sm:inline" style={{ fontSize:"7px", letterSpacing:"0.4em", verticalAlign:"top", marginTop:"6px" }}>FASHION</sup>
//             </button>

//             {/* Search (desktop) */}
//             <div className="flex-1 max-w-2xl relative hidden sm:block">
//               <div className="flex items-center bg-white/8 border border-white/10 rounded-xl hover:bg-white/12 focus-within:bg-white focus-within:border-violet-400 transition-all group">
//                 <svg className="ml-3.5 w-4 h-4 text-white/30 group-focus-within:text-violet-600 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//                 </svg>
//                 <input
//                   className="flex-1 py-2.5 px-3 text-sm bg-transparent outline-none text-white group-focus-within:text-gray-900 placeholder-white/30 group-focus-within:placeholder-gray-400 transition-colors"
//                   placeholder="Search fashion, footwear, beauty, electronics..."
//                   value={search}
//                   onChange={(e) => { setSearch(e.target.value); setActiveBrand(null); }}
//                 />
//                 {search && (
//                   <button onClick={() => setSearch("")} className="mr-3 w-5 h-5 rounded-full bg-white/15 text-white/60 flex items-center justify-center text-xs">✕</button>
//                 )}
//               </div>
//             </div>

//             {/* Icon group */}
//             <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">

//               {/* Mobile search icon */}
//               <button className="sm:hidden flex items-center justify-center w-9 h-9 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//                 </svg>
//               </button>

//               {/* Wishlist */}
//               <button onClick={() => navigate("/wishlist")}
//                 className="relative flex flex-col items-center px-2 sm:px-3 py-1.5 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill={wishlistCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//                 <span className="hidden sm:block mt-0.5 text-white/35 text-[9px] tracking-wider">WISHLIST</span>
//                 {wishlistCount > 0 && (
//                   <span className="absolute -top-1 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ fontSize:"8px" }}>{wishlistCount}</span>
//                 )}
//               </button>

//               {/* Cart */}
//               <button onClick={() => navigate("/cart")}
//                 className="relative flex flex-col items-center px-2 sm:px-3 py-1.5 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 <span className="hidden sm:block mt-0.5 text-white/35 text-[9px] tracking-wider">CART</span>
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ fontSize:"8px" }}>{cartCount}</span>
//                 )}
//               </button>

//               {/* ── Premium Avatar Button → opens Profile Panel ── */}
//               <div onClick={(e) => e.stopPropagation()}>
//                 <button onClick={handleOpenMenu} className="lyra-avatar-btn ml-1">
//                   <div className="lyra-avatar-circle">{initials}</div>
//                   <span className="lyra-avatar-name hidden sm:block">{firstName}</span>
//                   <svg className="lyra-avatar-chevron w-3 h-3 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Mega nav — renders once categories are loaded from API */}
//           {categories.length > 0 && <MegaNav categories={categories} navigate={navigate} />}
//         </nav>

//         {/* ── PROFILE PANEL (slide-in right) ── */}
//         {showMenu && (
//           <ProfilePanel
//             user={user}
//             onClose={() => setShowMenu(false)}
//             navigate={navigate}
//             handleLogout={handleLogout}
//             orderCount={orderCount}
//             wishlistCount={wishlistItems.length}
//             rewardPoints={rewardPoints}
//             statsLoading={statsLoading}
//           />
//         )}

//         {/* Mobile drawer */}
//         <MobileDrawer
//           open={showDrawer}
//           onClose={() => setShowDrawer(false)}
//           navigate={navigate}
//           user={user}
//           handleLogout={handleLogout}
//           categories={categories}
//         />

//         {/* ═══════════════════════ PAGE BODY ═══════════════════════ */}
//         <div onClick={() => setShowMenu(false)}>

//           {/* Hero */}
//           {!heroLoading && heroSlides.length > 0 && (
//             <CinematicHero
//               slide={heroSlides[safeIdx]}
//               currentIndex={safeIdx}
//               total={heroSlides.length}
//               onDotClick={setCurrent}
//               onShopClick={() => scrollTo(shopRef)}
//             />
//           )}

//           {/* Editorial strip */}
//           {!heroLoading && <EditorialStrip onShopClick={() => scrollTo(shopRef)} />}

//           <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

//             {/* Trust badges */}
//             <div className="lyra-trust-grid mb-10 sm:mb-14">
//               {[
//                 { icon:"🚚", title:"Free Delivery",   sub:"On orders above ₹999",  from:"from-violet-600", to:"to-purple-600" },
//                 { icon:"↩",  title:"30-Day Returns",  sub:"Hassle-free exchanges",  from:"from-teal-600",   to:"to-cyan-500"   },
//                 { icon:"🔒", title:"Secure Payments", sub:"100% safe & encrypted",  from:"from-amber-500",  to:"to-orange-500" },
//                 { icon:"⭐", title:"Lyra Rewards",    sub:"Earn on every purchase", from:"from-pink-600",   to:"to-rose-500"   },
//               ].map((o) => (
//                 <div key={o.title} className={`bg-gradient-to-r ${o.from} ${o.to} rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-all duration-300 shadow cursor-pointer`}>
//                   <span className="text-2xl sm:text-3xl">{o.icon}</span>
//                   <div>
//                     <p className="lyra-serif text-white font-semibold text-sm sm:text-base">{o.title}</p>
//                     <p className="text-white/70 text-[11px] sm:text-xs mt-0.5">{o.sub}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Category showcase */}
//             {showcaseCats.length > 0 && (
//               <div className="mb-12 sm:mb-16">
//                 <div className="flex items-end justify-between mb-5 sm:mb-7">
//                   <div>
//                     <p className="text-[10px] tracking-[0.3em] text-violet-400 uppercase mb-1.5">✦ All Categories</p>
//                     <h2 className="lyra-serif text-3xl sm:text-4xl text-gray-900">Shop by <span className="text-violet-600">World</span></h2>
//                   </div>
//                   <button className="text-xs sm:text-sm text-violet-600 font-semibold hover:underline">View All →</button>
//                 </div>
//                 {/* Row 1 — 4 tall editorial cards */}
//                 <div className="lyra-showcase-top mb-3 sm:mb-4">
//                   {showcaseCats.slice(0, 4).map((cat) => (
//                     <div key={cat.label} onClick={() => navigate(cat.route)}
//                       className="relative overflow-hidden rounded-2xl cursor-pointer group"
//                       style={{ height:"clamp(180px,22vw,280px)" }}>
//                       <img src={cat.img} alt={cat.label}
//                         className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
//                         onError={(e) => { e.target.parentElement.style.background="linear-gradient(135deg,#1e0a3c,#7c3aed)"; e.target.style.display="none"; }} />
//                       <div className="absolute inset-0"
//                         style={{ background:"linear-gradient(to top,rgba(10,3,25,0.85) 0%,rgba(10,3,25,0.25) 55%,transparent 100%)" }} />
//                       <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
//                         <p className="lyra-serif text-white text-lg sm:text-2xl font-light leading-none mb-1">{cat.label}</p>
//                         <p className="text-white/50 text-[10px] sm:text-xs font-medium tracking-wide hidden sm:block">{cat.sub}</p>
//                         <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
//                           <span className="text-[10px] sm:text-xs font-bold text-white bg-violet-600 px-2 sm:px-3 py-1 rounded-full">Shop Now</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {/* Row 2 — 4 horizontal mini cards */}
//                 <div className="lyra-showcase-bottom">
//                   {showcaseCats.slice(4, 8).map((cat) => (
//                     <div key={cat.label} onClick={() => navigate(cat.route)}
//                       className="relative overflow-hidden rounded-2xl cursor-pointer group bg-white border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 flex"
//                       style={{ height:"90px" }}>
//                       <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden">
//                         <img src={cat.img} alt={cat.label}
//                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                           style={{ maskImage:"linear-gradient(to right,transparent 0%,black 40%)", WebkitMaskImage:"linear-gradient(to right,transparent 0%,black 40%)" }}
//                           onError={(e) => { e.target.style.display="none"; }} />
//                       </div>
//                       <div className="relative z-10 p-3 sm:p-4 flex flex-col justify-center flex-1">
//                         <p className="font-bold text-gray-900 text-xs sm:text-sm">{cat.label}</p>
//                         <p className="text-gray-400 text-[10px] mt-0.5 leading-tight hidden sm:block">{cat.sub}</p>
//                         <span className="mt-1.5 text-[10px] font-bold text-violet-600 tracking-wide">Explore →</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Flash sale countdown */}
//             <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5 mb-10 sm:mb-12 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 shadow-lg"
//               style={{ background:"linear-gradient(135deg,#1e0a3c,#4c1d95,#6d28d9)" }}>
//               <div className="flex-1 min-w-0">
//                 <h3 className="lyra-serif text-white text-xl sm:text-2xl">Flash Sale</h3>
//                 <p className="text-white/40 text-xs mt-0.5 hidden sm:block">Limited quantities — ends soon</p>
//               </div>
//               <span className="bg-pink-500 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full animate-pulse">⚡ LIVE</span>
//               <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
//                 {[[countdown.h,"HRS"],[countdown.m,"MIN"],[countdown.s,"SEC"]].map(([n, l], i) => (
//                   <React.Fragment key={l}>
//                     {i > 0 && <span className="text-violet-400 font-bold text-sm">:</span>}
//                     <div className="bg-white/10 border border-white/10 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-center min-w-[40px] sm:min-w-[48px]">
//                       <span className="lyra-serif text-white font-bold text-lg sm:text-xl block">{n}</span>
//                       <span className="text-white/30 text-[7px] sm:text-[8px] uppercase tracking-widest">{l}</span>
//                     </div>
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>

//             <BrandScrollBar onBrandClick={handleBrand} />

//             {/* Deals products */}
//             {dealsProducts.length > 0 && (
//               <div className="mb-10 sm:mb-14">
//                 <div className="flex items-end justify-between mb-4 sm:mb-6">
//                   <div>
//                     <p className="text-[10px] tracking-[0.3em] text-pink-400 uppercase mb-1">✦ Limited Time</p>
//                     <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Best <span className="text-pink-600">Deals</span></h2>
//                   </div>
//                   <button className="text-xs sm:text-sm text-violet-600 font-semibold hover:underline">View All Deals →</button>
//                 </div>
//                 <div className="lyra-products-grid">
//                   {dealsProducts.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}
//                 </div>
//               </div>
//             )}

//             {/* Main product grid */}
//             <section ref={shopRef} id="shop">
//               <div className="flex items-center justify-between mb-5 sm:mb-7">
//                 <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">
//                   {activeBrand
//                     ? <>{activeBrand} <span className="text-violet-600">Collection</span></>
//                     : <>New <span className="text-violet-600">Arrivals</span></>}
//                 </h2>
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   {activeBrand && (
//                     <button onClick={() => setActiveBrand(null)} className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full hover:bg-violet-200 transition-colors">
//                       {activeBrand} <span className="font-bold">×</span>
//                     </button>
//                   )}
//                   <button className="text-xs sm:text-sm text-violet-600 font-medium hover:underline">View All →</button>
//                 </div>
//               </div>
//               {filtered.length > 0 ? (
//                 <div className="lyra-products-grid">
//                   {filtered.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}
//                 </div>
//               ) : products.length === 0 ? (
//                 <div className="lyra-products-grid">
//                   {Array.from({ length:10 }).map((_, i) => (
//                     <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
//                       <div className="h-52 sm:h-60 bg-slate-50" />
//                       <div className="p-4 space-y-2">
//                         <div className="h-2 bg-gray-100 rounded w-1/3" />
//                         <div className="h-4 bg-gray-100 rounded w-3/4" />
//                         <div className="h-3 bg-gray-100 rounded w-1/2" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-20 sm:py-24 bg-white rounded-3xl border border-slate-100">
//                   <p className="text-4xl sm:text-5xl mb-4">🔍</p>
//                   <p className="lyra-serif text-xl text-gray-700 mb-2">No products found</p>
//                   <button onClick={() => { setSearch(""); setActiveBrand(null); setActiveTab("All"); }}
//                     className="mt-5 text-sm text-violet-600 font-medium hover:underline">Clear filters</button>
//                 </div>
//               )}
//             </section>

//             {/* Explore collections strip */}
//             <div className="mt-14 sm:mt-20 mb-10">
//               <div className="flex items-end justify-between mb-5 sm:mb-7">
//                 <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Explore <span className="text-violet-600">Collections</span></h2>
//               </div>
//               <div className="lyra-editorial-grid">
//                 {categories.slice(0, 4).map((cat, i) => {
//                   const overlays = ["#5b21b6","#9d174d","#1f2937","#78350f"];
//                   const badges   = ["New Arrivals","Editor Picks","Best Sellers","Luxury Picks"];
//                   return (
//                     <div key={cat._id || cat.slug}
//                       onClick={() => navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`)}
//                       className="relative rounded-2xl overflow-hidden cursor-pointer group shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//                       style={{ height:"clamp(140px,16vw,220px)" }}>
//                       <img src={cat.featuredImg || SHOWCASE_IMGS[cat.slug] || ""}
//                         alt={cat.label || cat.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         onError={(e) => { e.target.style.display="none"; }} />
//                       <div className="absolute inset-0 opacity-80"
//                         style={{ background:`linear-gradient(to top,${overlays[i]},transparent 65%)` }} />
//                       <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5">
//                         <span className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-1">{badges[i] || "Collection"}</span>
//                         <p className="lyra-serif text-white font-light text-base sm:text-xl leading-tight">{cat.label || cat.name}</p>
//                         <span className="text-white/45 text-[10px] sm:text-xs mt-1 group-hover:text-white transition-colors">Shop now →</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         <LyraFooter />
//         {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart }     from "./CartContext";
// import { useWishlist } from "./WishlistContext";
// import AddToCartModal  from "./AddToCartModal";
// import axios           from "axios";
// import LyraFooter      from "./Footer";

// // ── API instances ────────────────────────────────────────────────
// const API     = axios.create({ baseURL: "http://localhost:6055/api/admin" });
// const CAT_API = axios.create({ baseURL: "http://localhost:6055/api" });

// // Attach JWT from sessionStorage to every request automatically
// const attachToken = (instance) =>
//   instance.interceptors.request.use((cfg) => {
//     try {
//       const u = JSON.parse(sessionStorage.getItem("user") || "{}");
//       if (u.token) cfg.headers.Authorization = `Bearer ${u.token}`;
//     } catch {}
//     return cfg;
//   });
// attachToken(API);
// attachToken(CAT_API);

// // ── Fallback images keyed by category slug ───────────────────────
// const SHOWCASE_IMGS = {
//   men:         "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
//   women:       "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
//   kids:        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
//   beauty:      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
//   home:        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
//   electronics: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
//   sports:      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
//   watches:     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
//   sale:        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
// };

// const FEATURED_IMGS = {
//   men:         { img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", label: "New Arrivals"    },
//   women:       { img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", label: "Trending Now"    },
//   kids:        { img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80", label: "Back to School"  },
//   beauty:      { img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", label: "Bestsellers"     },
//   home:        { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",   label: "Trending Décor"  },
//   electronics: { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80", label: "Tech Picks"      },
//   sports:      { img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80", label: "New Season Gear" },
// };

// const BRANDS_LOOP = (() => {
//   const raw = [
//     { name:"Nike",           logo:"https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",                                                                   bg:"#f8f8f8" },
//     { name:"Adidas",         logo:"https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",                                                                  bg:"#f8f8f8" },
//     { name:"Zara",           logo:"https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",                                                                    bg:"#f8f8f8" },
//     { name:"H&M",            logo:"https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",                                                                   bg:"#fff5f5" },
//     { name:"Puma",           logo:"https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg",                                                                    bg:"#f8f8f8" },
//     { name:"Levi's",         logo:"https://upload.wikimedia.org/wikipedia/commons/7/7d/Levi%27s_logo_red.svg",                                                            bg:"#fff5f5" },
//     { name:"Gucci",          logo:"https://upload.wikimedia.org/wikipedia/commons/7/79/1000x1000_Gucci_logo.svg",                                                         bg:"#fafaf8" },
//     { name:"Rolex",          logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Rolex_Logo.png/640px-Rolex_Logo.png",                                        bg:"#f5faf5" },
//     { name:"Ray-Ban",        logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Ray-Ban_logo.svg/640px-Ray-Ban_logo.svg.png",                                bg:"#fff8f5" },
//     { name:"Tommy Hilfiger", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Tommy_Hilfiger_logo.svg/640px-Tommy_Hilfiger_logo.svg.png",                  bg:"#f5f5ff" },
//     { name:"Calvin Klein",   logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Calvin_Klein_color_logo.svg/640px-Calvin_Klein_color_logo.svg.png",          bg:"#f8f8f8" },
//     { name:"Lyra Studio",    logoText:"LYRA",  color:"#6d28d9", bg:"#f5f3ff" },
//     { name:"Elliot & Co",    logoText:"E&Co",  color:"#047857", bg:"#ecfdf5" },
//     { name:"BloomWear",      logoText:"bloom", color:"#be185d", bg:"#fdf2f8" },
//     { name:"TimeLux",        logoText:"TL",    color:"#92400e", bg:"#fffbeb" },
//     { name:"FlexFit",        logoText:"FF",    color:"#0f766e", bg:"#f0fdfa" },
//   ];
//   return [...raw, ...raw];
// })();

// // ══════════════════════════════════════════════════════════════════
// // NORMALISE CATEGORY — converts DB shape to a single canonical shape
// // Works with both static links[] and DB subCategories[{name}]
// // ══════════════════════════════════════════════════════════════════
// const normaliseCategory = (cat) => {
//   const slug          = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "";
//   const fallback      = FEATURED_IMGS[slug] || { img: "", label: "New Arrivals" };
//   const featuredImg   = cat.featuredImg   || cat.heroImg   || fallback.img;
//   const featuredLabel = cat.featuredLabel || cat.heroLabel || fallback.label;
//   const columns = (cat.columns || [])
//     .map((col) => {
//       const rawLinks =
//         Array.isArray(col.subCategories) ? col.subCategories :
//         Array.isArray(col.links)         ? col.links         : [];
//       const links = rawLinks
//         .map((item) => (typeof item === "string" ? { name: item } : item))
//         .filter((item) => item && typeof item.name === "string" && item.name.trim());
//       return { ...col, links };
//     })
//     .filter((col) => col.links.length > 0);
//   return { ...cat, slug, featuredImg, featuredLabel, columns, noMenu: Boolean(cat.noMenu) };
// };

// // ══════════════════════════════════════════════════════════════════
// // PROFILE PANEL — slide-in panel from right side of screen
// // Props:
// //   user           — sessionStorage user object
// //   orderCount     — live count from GET /api/orders/my
// //   wishlistCount  — live count from WishlistContext
// //   rewardPoints   — default 0 (extend when rewards system is built)
// //   loading        — true while order count is being fetched
// // ══════════════════════════════════════════════════════════════════
// const ProfilePanel = ({ user, onClose, navigate, handleLogout, orderCount, wishlistCount, rewardPoints, statsLoading }) => {
//   const initials = (user.fullName || "G").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

//   const menuItems = [
//     { icon:"📦", label:"My Orders",   sublabel:"Track & manage",    path:"/profile?tab=orders",    accent:"#7c3aed" },
//     { icon:"👤", label:"My Profile",  sublabel:"Edit details",       path:"/profile?tab=profile",   accent:"#0891b2" },
//     { icon:"♡",  label:"Wishlist",    sublabel:"Saved items",        path:"/wishlist",               accent:"#e11d48" },
//     { icon:"📍", label:"Addresses",   sublabel:"Delivery locations", path:"/profile?tab=addresses", accent:"#059669" },
//     { icon:"🎁", label:"Rewards",     sublabel:"Points & offers",    path:"/profile?tab=rewards",   accent:"#d97706" },
//   ];

//   // Stat tiles — data driven from props
//   const stats = [
//     { label:"Orders",  value: statsLoading ? "…" : String(orderCount)  },
//     { label:"Wishlist",value: statsLoading ? "…" : String(wishlistCount) },
//     { label:"Points",  value: statsLoading ? "…" : String(rewardPoints) },
//   ];

//   return (
//     <>
//       {/* Backdrop */}
//       <div className="lyra-overlay" onClick={onClose} />

//       {/* Panel */}
//       <div className="lyra-profile-panel slide-in-right">

//         {/* Header */}
//         <div className="lpp-header">
//           <div className="lpp-avatar-ring">
//             <div className="lpp-avatar">{initials}</div>
//           </div>
//           <div className="lpp-header-info">
//             <p className="lpp-name">{user.fullName || "Guest"}</p>
//             <p className="lpp-contact">{user.email || user.mobileNumber || ""}</p>
//             <span className="lpp-badge">✦ Lyra Member</span>
//           </div>
//           <button onClick={onClose} className="lpp-close">✕</button>
//         </div>

//         {/* Stats row — live data */}
//         <div className="lpp-stats">
//           {stats.map(({ label, value }) => (
//             <div key={label} className="lpp-stat">
//               <span className="lpp-stat-num">{value}</span>
//               <span className="lpp-stat-lbl">{label}</span>
//             </div>
//           ))}
//         </div>

//         {/* Menu */}
//         <div className="lpp-menu">
//           {menuItems.map((item) => (
//             <button key={item.label} onClick={() => { onClose(); navigate(item.path); }} className="lpp-item">
//               <span className="lpp-item-icon" style={{ background: item.accent + "18", color: item.accent }}>
//                 {item.icon}
//               </span>
//               <div className="lpp-item-text">
//                 <span className="lpp-item-label">{item.label}</span>
//                 <span className="lpp-item-sub">{item.sublabel}</span>
//               </div>
//               <span className="lpp-item-arrow">›</span>
//             </button>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="lpp-footer">
//           <button onClick={() => { onClose(); handleLogout(); }} className="lpp-logout">
//             <span>🚪</span> Sign Out
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // CINEMATIC HERO
// // ══════════════════════════════════════════════════════════════════
// const CinematicHero = ({ slide, currentIndex, total, onDotClick, onShopClick }) => {
//   if (!slide) return null;
//   return (
//     <div className="relative w-full overflow-hidden lyra-hero">
//       <div className="absolute inset-0">
//         <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.opacity="0"; }} />
//         <div className="absolute inset-0" style={{ background: slide.overlay }} />
//       </div>
//       <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-12 lg:px-24">
//         <p className="text-[10px] sm:text-xs tracking-[0.4em] text-white/40 uppercase mb-3 sm:mb-5 font-light">✦ Lyra Collection</p>
//         <h1 className="font-light text-white leading-none mb-4 sm:mb-5 lyra-serif" style={{ fontSize:"clamp(2.2rem,7vw,6rem)" }}>
//           {slide.title}<br />
//           <span style={{ background:"linear-gradient(135deg,#f3e8ff,#e879f9,#fbcfe8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
//             {slide.titleAccent}
//           </span>
//         </h1>
//         <p className="text-white/55 text-sm sm:text-base max-w-xs sm:max-w-lg mb-7 sm:mb-9 font-light leading-relaxed">{slide.subtitle}</p>
//         <div className="flex flex-wrap gap-3">
//           <button onClick={onShopClick} className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#1e0a3c] text-xs sm:text-sm font-bold rounded-2xl hover:bg-violet-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">{slide.cta} →</button>
//           <button onClick={onShopClick} className="px-5 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white text-xs sm:text-sm font-semibold rounded-2xl hover:bg-white/10 hover:border-white/60 transition-all duration-300">View Collections</button>
//         </div>
//         <div className="flex gap-2 mt-7 sm:mt-10">
//           {Array.from({ length: total }).map((_, i) => (
//             <button key={i} onClick={() => onDotClick(i)} className={`rounded-full transition-all ${i === currentIndex ? "w-8 h-1.5 bg-white" : "w-4 h-1.5 bg-white/35"}`} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // EDITORIAL STRIP
// // ══════════════════════════════════════════════════════════════════
// const EditorialStrip = ({ onShopClick }) => {
//   const marqueeItems = ["New Season","Men's Edit","Women's Edit","Beauty Drop","Tech Essentials","Home Luxe"];
//   return (
//     <div className="lyra-editorial-strip overflow-hidden relative"
//       style={{ background:"linear-gradient(135deg,#0f0820,#1e0a3c 40%,#2d1060 70%,#0f0820)" }}>
//       <div className="absolute inset-0 opacity-20 pointer-events-none"
//         style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")", backgroundSize:"128px" }} />
//       <div className="relative z-10 flex flex-col lg:flex-row items-stretch" style={{ minHeight:"400px" }}>
//         <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-16">
//           <div className="inline-flex items-center gap-2 mb-5 self-start">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//             <span className="text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase">SS 2025 Collection</span>
//           </div>
//           <h2 className="lyra-serif text-white font-light leading-[0.95] mb-5" style={{ fontSize:"clamp(2.4rem,5.5vw,4.8rem)" }}>
//             Style That<br />
//             <span style={{ background:"linear-gradient(90deg,#f9a8d4,#c084fc,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
//               Speaks First.
//             </span>
//           </h2>
//           <p className="text-white/40 text-sm sm:text-base max-w-sm mb-8 leading-relaxed font-light">
//             Curated collections for every occasion. Discover pieces that define your story this season.
//           </p>
//           <div className="flex flex-wrap gap-3 mb-10">
//             {["Explore Men","Explore Women","New Arrivals"].map((label, i) => (
//               <button key={label} onClick={onShopClick}
//                 className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
//                   i === 0 ? "bg-white text-[#1e0a3c] hover:bg-violet-100" : "border border-white/20 text-white/70 hover:border-white/50 hover:text-white"
//                 }`}>
//                 {label}
//               </button>
//             ))}
//           </div>
//           <div className="flex items-center gap-6 sm:gap-10">
//             {[["50K+","Products"],["200+","Brands"],["4.9★","Rating"]].map(([num, lbl]) => (
//               <div key={lbl}>
//                 <p className="lyra-serif text-white font-semibold text-xl sm:text-2xl">{num}</p>
//                 <p className="text-white/30 text-[10px] tracking-widest uppercase">{lbl}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="w-full lg:w-2/5 flex-shrink-0 grid grid-cols-2 gap-2 p-4 lg:p-6 self-center">
//           {[
//             { img:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80", tall:true,  label:"Women's" },
//             { img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", tall:false, label:"Men's"   },
//             { img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", tall:false, label:"Watches" },
//           ].map((tile, i) => (
//             <div key={i} onClick={onShopClick}
//               className={`relative overflow-hidden rounded-xl cursor-pointer group ${tile.tall ? "row-span-2" : ""}`}
//               style={{ minHeight:tile.tall ? "220px" : "104px" }}>
//               <img src={tile.img} alt={tile.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//               <span className="absolute bottom-2 left-3 text-white text-[10px] font-bold tracking-widest uppercase opacity-80">{tile.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Marquee strip */}
//       <div className="border-t border-white/5 overflow-hidden py-3">
//         <div className="lyra-marquee-track flex items-center whitespace-nowrap" style={{ width:"max-content" }}>
//           {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
//             <React.Fragment key={i}>
//               <span className="text-white/15 text-[11px] font-bold uppercase tracking-[0.3em] px-6">{item}</span>
//               <span className="text-violet-700/30 text-[10px]">✦</span>
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // BRAND SCROLL
// // ══════════════════════════════════════════════════════════════════
// const BrandScrollBar = ({ onBrandClick }) => {
//   const trackRef  = useRef(null);
//   const animRef   = useRef(null);
//   const posRef    = useRef(0);
//   const pausedRef = useRef(false);
//   useEffect(() => {
//     const track = trackRef.current;
//     if (!track) return;
//     const step = () => {
//       if (!pausedRef.current) {
//         posRef.current += 0.4;
//         if (posRef.current >= track.scrollWidth / 2) posRef.current = 0;
//         track.style.transform = `translateX(-${posRef.current}px)`;
//       }
//       animRef.current = requestAnimationFrame(step);
//     };
//     animRef.current = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(animRef.current);
//   }, []);
//   return (
//     <div className="mb-12">
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <p className="text-[10px] tracking-[0.35em] text-slate-400 uppercase mb-1.5">Partners</p>
//           <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Top <span className="text-violet-600">Brands</span></h2>
//         </div>
//         <button className="text-xs text-violet-600 font-semibold border border-violet-200 hover:border-violet-400 px-4 py-1.5 rounded-full transition-colors">View All →</button>
//       </div>
//       <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 py-5 shadow-sm"
//         onMouseEnter={() => { pausedRef.current = true; }}
//         onMouseLeave={() => { pausedRef.current = false; }}>
//         <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background:"linear-gradient(to right,white,transparent)" }} />
//         <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background:"linear-gradient(to left,white,transparent)" }} />
//         <div ref={trackRef} className="flex items-center gap-3 px-4" style={{ width:"max-content", willChange:"transform" }}>
//           {BRANDS_LOOP.map((b, i) => (
//             <button key={`${b.name}-${i}`} onClick={() => onBrandClick(b.name)} className="flex-shrink-0 flex flex-col items-center gap-2 group">
//               <div className="w-24 h-12 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-violet-300 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all overflow-hidden px-3"
//                 style={{ background:b.bg }}>
//                 {b.logo
//                   ? <img src={b.logo} alt={b.name} className="max-w-full max-h-8 object-contain" onError={(e) => { e.target.style.display="none"; }} />
//                   : <span style={{ color:b.color||"#1e0a3c", fontFamily:"Georgia,serif", fontWeight:"bold", fontSize:"0.82rem" }}>{b.logoText||b.name}</span>
//                 }
//               </div>
//               <span className="text-[10px] text-gray-400 group-hover:text-violet-600 transition-colors font-medium">{b.name}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // PRODUCT CARD
// // ══════════════════════════════════════════════════════════════════
// const ProductCard = ({ product, onAddToCart }) => {
//   const navigate = useNavigate();
//   const { toggleWishlist, isWishlisted } = useWishlist();
//   const wishlisted = isWishlisted(product._id);
//   const disc = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
//   return (
//     <div onClick={() => navigate(`/product/${product._id}`)} className="lyra-card group cursor-pointer">
//       {product.badge && <span className="lyra-badge-hot">{product.badge}</span>}
//       {disc >= 30 && !product.badge && <span className="lyra-badge-sale">{disc}% OFF</span>}
//       <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} className="lyra-wish-btn" style={{ color:wishlisted?"#ef4444":"#cbd5e1" }}>
//         {wishlisted ? "♥" : "♡"}
//       </button>
//       <div className="lyra-card-img">
//         <img src={product.image || product.images?.[0]} alt={product.name}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//           onError={(e) => { e.target.src="https://placehold.co/300x400/f8f9fa/9ca3af?text=Lyra"; }} />
//       </div>
//       <div className="p-3 sm:p-4">
//         <p className="lyra-card-brand">{product.brand || product.category}</p>
//         <p className="text-xs sm:text-sm font-medium text-gray-900 truncate mb-1.5">{product.name}</p>
//         <div className="flex items-center gap-0.5 mb-2">
//           {Array.from({ length:5 }).map((_, i) => (<span key={i} className={`text-[10px] ${i < Math.floor(product.rating||0) ? "text-amber-400" : "text-gray-200"}`}>★</span>))}
//           <span className="text-gray-400 text-[10px] ml-1">({(product.reviews||0).toLocaleString()})</span>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-sm sm:text-base font-bold text-gray-900">₹{(product.price||0).toLocaleString()}</span>
//           {product.originalPrice && product.originalPrice > product.price && <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>}
//           {disc > 0 && disc < 30 && <span className="lyra-disc-tag">{disc}% off</span>}
//         </div>
//         <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="lyra-card-atc">Add to Cart</button>
//       </div>
//     </div>
//   );
// };

// // ── Countdown ──────────────────────────────────────────────────────
// const useCountdown = () => {
//   const [time, setTime] = useState({ h:"08", m:"23", s:"47" });
//   useEffect(() => {
//     const id = setInterval(() => setTime((prev) => {
//       let s = parseInt(prev.s)-1, m=parseInt(prev.m), h=parseInt(prev.h);
//       if (s<0){s=59;m--;} if (m<0){m=59;h--;} if (h<0){h=23;m=59;s=59;}
//       return { h:String(h).padStart(2,"0"), m:String(m).padStart(2,"0"), s:String(s).padStart(2,"0") };
//     }), 1000);
//     return () => clearInterval(id);
//   }, []);
//   return time;
// };

// // ══════════════════════════════════════════════════════════════════
// // MOBILE DRAWER
// // ══════════════════════════════════════════════════════════════════
// const MobileDrawer = ({ open, onClose, navigate, user, handleLogout, categories }) => {
//   if (!open) return null;
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />
//       <div className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white z-[70] overflow-y-auto shadow-2xl lyra-drawer">
//         <div className="bg-gradient-to-br from-[#1e0a3c] to-violet-700 px-6 py-8">
//           <div className="flex items-center justify-between mb-4">
//             <span className="lyra-serif text-white text-xl tracking-widest">LY<span className="text-pink-400">R</span>A</span>
//             <button onClick={onClose} className="text-white/60 hover:text-white text-xl">✕</button>
//           </div>
//           <p className="text-white font-semibold">{user.fullName || "Guest"}</p>
//           <p className="text-purple-300 text-xs mt-0.5">{user.email || user.mobileNumber || ""}</p>
//         </div>
//         <div className="p-4">
//           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 px-2">Shop</p>
//           {(categories || []).map((cat) => (
//             <button key={cat._id || cat.slug} onClick={() => { navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`); onClose(); }}
//               className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
//               <span className="flex items-center gap-2">{cat.icon && <span>{cat.icon}</span>}<span>{cat.label || cat.name}</span></span>
//               {cat.badge && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{cat.badge}</span>}
//             </button>
//           ))}
//           <div className="border-t border-slate-100 mt-3 pt-3">
//             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 px-2">Account</p>
//             {[
//               { label:"📦 My Orders",  path:"/profile?tab=orders"    },
//               { label:"👤 My Profile", path:"/profile?tab=profile"   },
//               { label:"♡  Wishlist",   path:"/wishlist"              },
//               { label:"📍 Addresses",  path:"/profile?tab=addresses" },
//             ].map((item) => (
//               <button key={item.label} onClick={() => { navigate(item.path); onClose(); }}
//                 className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
//                 {item.label}
//               </button>
//             ))}
//             <button onClick={handleLogout} className="w-full text-left px-3 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-1">🚪 Sign Out</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // MEGA NAV — fully backend-driven
// // ══════════════════════════════════════════════════════════════════
// const MegaNav = ({ categories, navigate }) => {
//   const [activeMega, setActiveMega] = useState(null);
//   const activeRef = useRef(null);
//   const timers = useRef({});

//   const openMega = useCallback((key) => {
//     Object.values(timers.current).forEach(clearTimeout);
//     timers.current = {};
//     activeRef.current = key;
//     setActiveMega(key);
//   }, []);

//   const closeMega = useCallback((key) => {
//     timers.current[key] = setTimeout(() => {
//       if (activeRef.current === key) { activeRef.current = null; setActiveMega(null); }
//     }, 200);
//   }, []);

//   const goTo = useCallback((path) => {
//     activeRef.current = null;
//     setActiveMega(null);
//     navigate(path);
//   }, [navigate]);

//   return (
//     <div className="hidden lg:block lyra-mega-nav relative z-[1000] border-t border-white/[0.06]"
//       style={{ background: "rgba(0,0,0,0.18)" }}>
//       <div className="flex items-stretch justify-center max-w-screen-xl mx-auto overflow-x-visible scrollbar-none">
//         {(categories || []).map((item, idx) => {
//           const itemKey = item.slug || item.name;
//           const isOpen = activeMega === itemKey;
//           const isNoMenu = item.noMenu;
//           const isSale = (item.slug || item.name || "").toLowerCase() === "sale";
//           const anchorRight = idx >= Math.floor((categories || []).length / 2);
//           const visibleCols = (item.columns || []).slice(0, 4);
//           const colCount = visibleCols.length;
//           const panelWidth = colCount === 0 ? 0 : colCount === 1 ? 280 : colCount === 2 ? 420 : colCount === 3 ? 560 : 700;
//           const hasDropdown = !isNoMenu && colCount > 0;

//           return (
//             <div 
//               key={itemKey} 
//               className="mega-parent relative"
//               onMouseEnter={() => hasDropdown && openMega(itemKey)}
//               onMouseLeave={() => hasDropdown && closeMega(itemKey)}
//             >
//               <button
//                 onClick={() => {
//                   if (!hasDropdown) { goTo(`/category/${encodeURIComponent(item.slug || item.name)}`); }
//                   else { setActiveMega((v) => v === itemKey ? null : itemKey); }
//                 }}
//                 className={["nav-item", isSale ? "sale-item" : "", isOpen ? "active" : ""].filter(Boolean).join(" ")}>
//                 {item.label || item.name}
//                 {item.badge && (
//                   <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
//                     style={{ background: item.badgeColor || "#ef4444" }}>
//                     {item.badge}
//                   </span>
//                 )}
//                 {hasDropdown && (
//                   <svg className={`ml-1 w-3 h-3 opacity-30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//                     fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 )}
//               </button>

//               {hasDropdown && isOpen && (
//                 <div
//                   className={`mega-drop mega-panel bg-white shadow-2xl shadow-black/15 border-t-2 border-violet-500 ${anchorRight ? "anchor-right" : ""}`}
//                   style={{ 
//                     minWidth: `${panelWidth}px`, 
//                     position: "absolute", 
//                     top: "100%", 
//                     left: "50%", 
//                     transform: "translateX(-50%)",
//                     zIndex: 2000 
//                   }}
//                   onMouseEnter={() => openMega(itemKey)}
//                   onMouseLeave={() => closeMega(itemKey)}
//                 >
//                   {/* Invisible gap bridge */}
//                   <div style={{ position: "absolute", top: "-8px", left: 0, right: 0, height: "8px" }}
//                     onMouseEnter={() => openMega(itemKey)} />

//                   <div className="flex">
//                     {/* Columns */}
//                     <div className="flex-1 grid gap-0 px-5 py-5"
//                       style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)`, columnGap: "16px" }}>
//                       {visibleCols.map((col) => (
//                         <div key={col._id || col.title} className="py-1">
//                           <p className="text-[9px] font-bold text-violet-600 uppercase tracking-[0.2em] mb-3 pb-2 border-b border-violet-100">
//                             {col.title}
//                           </p>
//                           <div className="space-y-1.5">
//                             {col.links.map((link) => (
//                               <span key={link._id || link.name} className="mega-link"
//                                 onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}?sub=${encodeURIComponent(link.name)}`)}>
//                                 {link.name}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Featured image panel */}
//                     {item.featuredImg && (
//                       <div className="w-44 flex-shrink-0 relative overflow-hidden border-l border-gray-100">
//                         <img src={item.featuredImg} alt={item.featuredLabel || item.label || item.name}
//                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                           onError={(e) => { e.target.parentElement.style.display = "none"; }} />
//                         <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,5,30,0.75) 0%, transparent 55%)" }} />
//                         <div className="absolute bottom-0 left-0 right-0 p-3">
//                           <p className="text-[9px] tracking-widest text-white/50 uppercase mb-1">Featured</p>
//                           <p className="text-white font-semibold text-xs">{item.featuredLabel || "New Arrivals"}</p>
//                           <button onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)}
//                             className="mt-1.5 text-[10px] text-white/70 hover:text-white transition-colors">Shop Now →</button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Quick shop footer */}
//                   <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center gap-3 flex-wrap">
//                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Quick Shop:</span>
//                     {["New Arrivals", "Best Sellers", "Under ₹999", "Premium Picks"].map((q) => (
//                       <button key={q} onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)}
//                         className="text-[11px] text-violet-600 font-semibold hover:text-violet-800 px-3 py-1 rounded-full bg-violet-50 hover:bg-violet-100 transition-colors">
//                         {q}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // DASHBOARD
// // ══════════════════════════════════════════════════════════════════
// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { cartCount }                   = useCart();
//   const { wishlistCount, wishlistItems } = useWishlist();
//   const countdown = useCountdown();

//   const [user,         setUser]         = useState({});
//   const [search,         setSearch]         = useState("");
//   const [searchFocused,  setSearchFocused]  = useState(false);
//   const [mobileSearch,   setMobileSearch]   = useState(false); // mobile search overlay
//   const searchRef = useRef(null);
//   const blurTimer = useRef(null);
//   const [showMenu,     setShowMenu]     = useState(false);
//   const [showDrawer,   setShowDrawer]   = useState(false);
//   const [activeBrand,  setActiveBrand]  = useState(null);
//   const [activeTab,    setActiveTab]    = useState("All");
//   const [modalProduct, setModalProduct] = useState(null);
//   const [products,     setProducts]     = useState([]);
//   const [scrolled,     setScrolled]     = useState(false);
//   const [currentSlide, setCurrent]      = useState(0);
//   const [heroSlides,   setHeroSlides]   = useState([]);
//   const [heroLoading,  setHeroLoading]  = useState(true);
//   const [categories,   setCategories]   = useState([]);

//   // ── Profile panel stats ── fetched when panel opens
//   const [orderCount,   setOrderCount]   = useState(0);
//   const [rewardPoints, setRewardPoints] = useState(0); // default 0, extend later
//   const [statsLoading, setStatsLoading] = useState(false);

//   const shopRef = useRef(null);

//   // ── Scroll ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60);
//     window.addEventListener("scroll", onScroll, { passive:true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // ── Main data load ──────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       const stored = sessionStorage.getItem("user");
//       if (!stored) { navigate("/"); return; }
//       setUser(JSON.parse(stored));

//       // Products
//       try {
//         const { data } = await API.get("/products");
//         setProducts(Array.isArray(data) ? data : data.products || []);
//       } catch (e) { console.error("Products:", e.message); }

//       // Hero slides (from admin hero-slides endpoint)
//       try {
//         const { data } = await API.get("/hero-slides/active");
//         setHeroSlides(data.slides || data || []);
//       } catch (e) { console.warn("Hero slides:", e.message); }
//       finally { setHeroLoading(false); }

//       // Categories — normalise every item to one consistent shape
//       try {
//         const { data } = await CAT_API.get("/categories");
//         const raw = Array.isArray(data) ? data
//           : Array.isArray(data.categories)        ? data.categories
//           : Array.isArray(data?.data?.categories) ? data.data.categories
//           : [];
//         setCategories(
//           raw.filter((c) => c.active !== false)
//              .sort((a, b) => (a.order || 0) - (b.order || 0))
//              .map(normaliseCategory)
//         );
//       } catch (e) { console.warn("Categories:", e.message); }
//     };
//     load();
//   }, [navigate]);

//   // ── Hero auto-advance ───────────────────────────────────────────
//   useEffect(() => {
//     if (!heroSlides.length) return;
//     const t = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 5000);
//     return () => clearInterval(t);
//   }, [heroSlides.length]);

//   // ── Fetch profile stats when panel opens ────────────────────────
//   // Orders  : GET /api/orders/my   (requires Bearer token)
//   // Wishlist: already live via WishlistContext (wishlistItems.length)
//   // Rewards : default 0 until a rewards endpoint exists
//   const fetchProfileStats = useCallback(async () => {
//     const stored = sessionStorage.getItem("user");
//     if (!stored) return;
//     const { token } = JSON.parse(stored);
//     if (!token) return;
//     setStatsLoading(true);
//     try {
//       const res = await fetch("http://localhost:6055/api/orders/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         const orders = Array.isArray(data) ? data : data.orders || [];
//         setOrderCount(orders.length);
//       }
//       // Rewards: placeholder — set to 0 or fetch from /api/users/me when available
//       setRewardPoints(0);
//     } catch (e) { console.error("Stats fetch:", e.message); }
//     finally { setStatsLoading(false); }
//   }, []);

//   // Open profile panel — fetch stats
//   const handleOpenMenu = useCallback((e) => {
//     e.stopPropagation();
//     setShowMenu((v) => {
//       if (!v) fetchProfileStats(); // fetch on open
//       return !v;
//     });
//   }, [fetchProfileStats]);

//   const scrollTo     = useCallback((ref) => { ref.current?.scrollIntoView({ behavior:"smooth", block:"start" }); setShowMenu(false); }, []);
//   const handleLogout = () => { sessionStorage.removeItem("user"); navigate("/"); };
//   const handleBrand  = (n) => { setActiveBrand(n); setActiveTab("All"); setSearch(""); scrollTo(shopRef); };

//   const filtered      = products.filter((p) => {
//     if (activeTab !== "All" && p.category !== activeTab) return false;
//     if (activeBrand && (p.brand||"").toLowerCase() !== activeBrand.toLowerCase()) return false;
//     if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });
//   const dealsProducts = products.filter((p) => p.originalPrice && ((p.originalPrice - p.price) / p.originalPrice) >= 0.3).slice(0, 10);

//   // ── Live search results for dropdown ─────────────────────────────
//   // Shows up to 8 matching products in the navbar search dropdown
//   // Navigation: click a result → /product/:id   |   "View all" → /search?q=...
//   const searchResults = React.useMemo(() => {
//     if (!search.trim() || search.length < 2) return [];
//     const q = search.toLowerCase();
//     return products.filter((p) =>
//       p.name?.toLowerCase().includes(q) ||
//       p.brand?.toLowerCase().includes(q) ||
//       p.category?.toLowerCase().includes(q) ||
//       p.description?.toLowerCase().includes(q)
//     ).slice(0, 8);
//   }, [products, search]);

//   const handleSearchNav = (productId) => {
//     setSearch("");
//     setSearchFocused(false);
//     setMobileSearch(false);
//     navigate(`/product/${productId}`);
//   };
//   const handleViewAll = () => {
//     const q = search.trim();
//     setSearchFocused(false);
//     setMobileSearch(false);
//     // Scroll to shop section which is already filtered
//     scrollTo(shopRef);
//   };
//   const safeIdx       = heroSlides.length ? currentSlide % heroSlides.length : 0;
//   const firstName     = user.fullName?.split(" ")[0] || "Account";
//   const initials      = (user.fullName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

//   const showcaseCats = categories.slice(0, 8).map((cat) => ({
//     label: cat.label || cat.name,
//     sub:   (cat.columns || []).slice(0, 3).map((c) => c.title).join(" · "),
//     img:   cat.featuredImg || SHOWCASE_IMGS[cat.slug] || "",
//     route: `/category/${encodeURIComponent(cat.slug || cat.name)}`,
//   }));

//   return (
//     <div className="min-h-screen bg-[#f9f9fb]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
//         .lyra-body,.lyra-body*{font-family:'DM Sans',system-ui,sans-serif;box-sizing:border-box;}
//         .lyra-serif{font-family:'Cormorant Garamond',Georgia,serif!important;}
//         .lyra-hero{height:88vh;max-height:800px;}
//         @media(max-width:640px){.lyra-hero{height:75vh;max-height:600px;}}
//         .lyra-editorial-strip{min-height:400px;}
//         .lyra-drawer{animation:drawerSlide 0.28s cubic-bezier(0.16,1,0.3,1) forwards;}
//         @keyframes drawerSlide{from{transform:translateX(-100%)}to{transform:translateX(0)}}
//         @keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
//         .shimmer-text{background:linear-gradient(90deg,#c084fc,#f472b6,#fb923c,#c084fc);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite;}
//         @keyframes megaFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
//         .mega-panel{animation:megaFade 0.18s cubic-bezier(0.16,1,0.3,1) forwards; z-index: 2000;}
//         @keyframes slideDown{from{opacity:0;transform:translateY(-8px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
//         .slide-down{animation:slideDown 0.2s cubic-bezier(0.16,1,0.3,1) forwards;}
//         .mega-link{position:relative;color:#4b5563;font-size:12px;font-weight:400;padding:3px 0;display:block;transition:color 0.15s;cursor:pointer;}
//         .mega-link:hover{color:#7c3aed;}
//         .mega-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#7c3aed;transition:width 0.2s ease;}
//         .mega-link:hover::after{width:100%;}
//         .nav-item{position:relative;padding:0 14px;height:42px;display:flex;align-items:center;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;cursor:pointer;transition:color 0.2s,background 0.2s;color:rgba(255,255,255,0.5);white-space:nowrap;}
//         .nav-item:hover{color:white;background:rgba(255,255,255,0.05);}
//         .nav-item.active{color:white;background:rgba(255,255,255,0.05);}
//         .nav-item::after{content:'';position:absolute;bottom:0;left:14px;right:14px;height:2px;background:white;transform:scaleX(0);transition:transform 0.2s ease;border-radius:2px 2px 0 0;}
//         .nav-item:hover::after,.nav-item.active::after{transform:scaleX(1);}
//         .nav-item.sale-item{color:#f87171;}
//         .nav-item.sale-item:hover{color:#fca5a5;}
//         .nav-item.sale-item::after{background:#ef4444;}
//         .mega-parent{position:relative;flex-shrink:0;}
//         .mega-drop{position:absolute;top:100%;left:50%;transform:translateX(-50%);z-index:200;}
//         .mega-drop.anchor-right{left:auto;right:50%; transform:translateX(50%);}
//         @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
//         .lyra-marquee-track{animation:marquee 30s linear infinite;}
//         @media(max-width:903px){.lyra-mega-nav{display:none!important}}
//         .lyra-mega-nav {position: relative; z-index: 1000;}
//         .lyra-mobile-hamburger{display:none;}
//         @media(max-width:1023px){.lyra-mobile-hamburger{display:flex!important}}
//         .lyra-trust-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-trust-grid{grid-template-columns:repeat(4,1fr)}}
//         .lyra-showcase-top{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-showcase-top{grid-template-columns:repeat(4,1fr)}}
//         .lyra-showcase-bottom{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:768px){.lyra-showcase-bottom{grid-template-columns:repeat(4,1fr)}}
//         .lyra-products-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
//           gap: 12px;
//         }

//         @media (min-width: 640px) {
//           .lyra-products-grid {
//             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           }
//         }

//         @media(max-width: 640px){
//           .search-dropdown {
//             max-height: 60vh;
//           }
//         }
//         .lyra-editorial-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
//         @media(min-width:1024px){.lyra-editorial-grid{grid-template-columns:repeat(4,1fr)}}
//         .scrollbar-none::-webkit-scrollbar{display:none;}
//         .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none;}

//         /* ── Product Card ── */
//         .lyra-card{background:white;border-radius:16px;border:1px solid #f1f5f9;overflow:hidden;position:relative;transition:all 0.3s;}
//         .lyra-card:hover{border-color:#ddd6fe;box-shadow:0 20px 40px -8px rgba(124,58,237,0.12);transform:translateY(-4px);}
//         .lyra-badge-hot{position:absolute;top:12px;left:12px;z-index:10;background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;}
//         .lyra-badge-sale{position:absolute;top:12px;left:12px;z-index:10;background:#10b981;color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;}
//         .lyra-wish-btn{position:absolute;top:12px;right:12px;z-index:10;width:32px;height:32px;background:rgba(255,255,255,0.9);backdrop-filter:blur(4px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:none;cursor:pointer;transition:transform 0.2s;}
//         .lyra-wish-btn:hover{transform:scale(1.15);}
//         .lyra-card-img{height:208px;overflow:hidden;background:linear-gradient(to bottom,#f8fafc,#f1f5f9);}
//         @media(min-width:640px){.lyra-card-img{height:240px;}}
//         .lyra-card-brand{font-size:10px;font-weight:600;color:#a78bfa;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;}
//         .lyra-disc-tag{font-size:10px;font-weight:600;color:#059669;background:#ecfdf5;padding:2px 8px;border-radius:8px;}
//         .lyra-card-atc{width:100%;margin-top:12px;padding:8px 0;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;font-size:10px;font-weight:600;border-radius:12px;border:none;cursor:pointer;opacity:0;transform:translateY(-4px);transition:all 0.3s;}
//         .lyra-card:hover .lyra-card-atc{opacity:1;transform:translateY(0);}
//         @media(min-width:640px){.lyra-card-atc{font-size:12px;padding:10px 0;}}

//         /* ── Profile Panel ── */
//         .lyra-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(4px);z-index:998;}
//         .lyra-profile-panel{position:fixed;top:0;right:0;bottom:0;width:320px;background:white;z-index:999;display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(15,5,30,0.25);overflow:hidden;}
//         @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
//         .slide-in-right{animation:slideInRight 0.32s cubic-bezier(0.16,1,0.3,1) forwards;}
//         .lpp-header{background:linear-gradient(145deg,#0f0820 0%,#1e0a3c 45%,#2d1060 100%);padding:28px 20px 24px;display:flex;align-items:flex-start;gap:14px;position:relative;flex-shrink:0;}
//         .lpp-avatar-ring{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);padding:2px;flex-shrink:0;}
//         .lpp-avatar{width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#1e0a3c,#4c1d95);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:white;letter-spacing:0.05em;}
//         .lpp-header-info{flex:1;min-width:0;}
//         .lpp-name{color:white;font-size:15px;font-weight:600;margin:0 0 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lpp-contact{color:rgba(216,180,254,0.6);font-size:11px;margin:0 0 8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lpp-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.35);color:#d8b4fe;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:0.08em;text-transform:uppercase;}
//         .lpp-close{position:absolute;top:16px;right:16px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.08);border:none;color:rgba(255,255,255,0.5);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
//         .lpp-close:hover{background:rgba(255,255,255,0.18);color:white;}
//         /* Stats row */
//         .lpp-stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #f1f5f9;flex-shrink:0;}
//         .lpp-stat{display:flex;flex-direction:column;align-items:center;padding:14px 8px;gap:2px;}
//         .lpp-stat:not(:last-child){border-right:1px solid #f1f5f9;}
//         .lpp-stat-num{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:#1e0a3c;line-height:1;}
//         .lpp-stat-lbl{font-size:10px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;}
//         /* Menu */
//         .lpp-menu{flex:1;overflow-y:auto;padding:12px;}
//         .lpp-item{width:100%;display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;border:none;background:transparent;cursor:pointer;transition:all 0.2s;text-align:left;margin-bottom:4px;}
//         .lpp-item:hover{background:#faf5ff;}
//         .lpp-item-icon{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;transition:transform 0.2s;}
//         .lpp-item:hover .lpp-item-icon{transform:scale(1.1);}
//         .lpp-item-text{flex:1;min-width:0;}
//         .lpp-item-label{display:block;font-size:13px;font-weight:600;color:#1e1033;margin-bottom:1px;}
//         .lpp-item-sub{display:block;font-size:11px;color:#94a3b8;}
//         .lpp-item-arrow{color:#cbd5e1;font-size:18px;font-weight:300;flex-shrink:0;transition:transform 0.2s;}
//         .lpp-item:hover .lpp-item-arrow{transform:translateX(3px);color:#7c3aed;}
//         /* Footer */
//         .lpp-footer{flex-shrink:0;padding:16px;border-top:1px solid #f1f5f9;}
//         .lpp-logout{width:100%;padding:12px;border-radius:14px;background:#fef2f2;border:1px solid #fee2e2;color:#dc2626;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;}
//         .lpp-logout:hover{background:#fee2e2;border-color:#fca5a5;}

//         /* ── Avatar Button in navbar ── */
//         .lyra-avatar-btn{display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;border-radius:24px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);cursor:pointer;transition:all 0.2s;}
//         .lyra-avatar-btn:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.22);}
//         .lyra-avatar-circle{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:white;letter-spacing:0.03em;flex-shrink:0;}
//         .lyra-avatar-name{font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.04em;text-transform:uppercase;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
//         .lyra-avatar-chevron{color:rgba(255,255,255,0.35);font-size:10px;margin-left:2px;}
//       `}</style>

//       <div className="lyra-body">

//         {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
//         <nav
//           className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0c0618]/97 backdrop-blur-2xl shadow-2xl shadow-violet-950/40" : "bg-[#1e0a3c]"}`}
//           onClick={() => setShowMenu(false)}
//         >
//           {/* Announcement bar */}
//           <div className="bg-gradient-to-r from-[#1a0836] via-violet-800 to-[#1a0836] py-1.5 text-center border-b border-violet-800/20">
//             <span className="shimmer-text text-[10px] sm:text-xs font-semibold tracking-[0.12em]">
//               ✦ FREE DELIVERY ON ORDERS ABOVE ₹999 · NEW ARRIVALS EVERY FRIDAY · LYRA MEMBERS GET 10% OFF ✦
//             </span>
//           </div>

//           {/* Logo + Search + Icons */}
//           <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3 sm:gap-5 border-b border-white/[0.06]">

//             {/* Hamburger (mobile) */}
//             <button onClick={(e) => { e.stopPropagation(); setShowDrawer(true); }}
//               className="lyra-mobile-hamburger flex-shrink-0 w-9 h-9 items-center justify-center text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>

//             {/* Logo */}
//             <button onClick={() => { navigate("/dashboard"); setActiveTab("All"); setActiveBrand(null); }}
//               className="lyra-serif text-xl sm:text-2xl tracking-[0.35em] text-white flex-shrink-0 select-none hover:opacity-90 transition-opacity">
//               LY<span className="text-pink-400">R</span>A
//               <sup className="text-white/20 ml-0.5 hidden sm:inline" style={{ fontSize:"7px", letterSpacing:"0.4em", verticalAlign:"top", marginTop:"6px" }}>FASHION</sup>
//             </button>

//             {/* ── DESKTOP SEARCH with live dropdown ── */}
//             <div className="flex-1 max-w-2xl relative hidden sm:block" ref={searchRef}>
//               <div className={`flex items-center rounded-xl transition-all duration-200 ${
//                 searchFocused ? "bg-white shadow-xl shadow-black/15" : "bg-white/8 border border-white/10 hover:bg-white/12"
//               }`}>
//                 <svg className={`ml-3.5 w-4 h-4 flex-shrink-0 transition-colors ${searchFocused ? "text-violet-600" : "text-white/30"}`}
//                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//                 </svg>
//                 <input
//                   className={`flex-1 py-2.5 px-3 text-sm sm: text-base bg-transparent outline-none transition-colors ${
//                     searchFocused ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-white/30"
//                   }`}
//                   placeholder="Search fashion, footwear, beauty, electronics..."
//                   value={search}
//                   onChange={(e) => { setSearch(e.target.value); setActiveBrand(null); }}
//                   onFocus={() => { clearTimeout(blurTimer.current); setSearchFocused(true); }}
//                   onBlur={() => { blurTimer.current = setTimeout(() => setSearchFocused(false), 200); }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Escape") { setSearch(""); setSearchFocused(false); }
//                     if (e.key === "Enter" && search.trim()) { handleViewAll(); e.target.blur(); }
//                   }}
//                 />
//                 {search && (
//                   <button onMouseDown={(e) => e.preventDefault()} onClick={() => setSearch("")}
//                     className={`mr-3 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${searchFocused ? "bg-gray-200 text-gray-500" : "bg-white/15 text-white/60"}`}>
//                     ✕
//                   </button>
//                 )}
//               </div>

//               {/* ── Live search dropdown ── */}
//               {searchFocused && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-black/15 border border-purple-100 overflow-hidden z-[200]"
//                   onMouseDown={(e) => e.preventDefault()}>

//                   {/* No query → trending suggestions */}
//                   {!search.trim() && (
//                     <>
//                       <div className="px-4 py-3 border-b border-gray-50">
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trending Searches</p>
//                       </div>
//                       <div className="flex flex-wrap gap-2 p-3">
//                         {["Silk Dress","Sneakers","Watches","Handbags","Ethnic Wear","Sunglasses","Lipstick","Earrings","Sports Shoes","Smart Watch"].map((s) => (
//                           <button key={s} onMouseDown={(e) => e.preventDefault()}
//                             onClick={() => { setSearch(s); }}
//                             className="px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-full border border-violet-100 transition-all">
//                             🔍 {s}
//                           </button>
//                         ))}
//                       </div>
//                       {/* Recent categories quick-access */}
//                       <div className="px-4 py-3 border-t border-gray-50">
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Browse Categories</p>
//                         <div className="flex gap-2 flex-wrap">
//                           {categories.slice(0, 6).map((cat) => (
//                             <button key={cat.slug} onClick={() => { navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`); setSearchFocused(false); }}
//                               className="text-xs text-gray-600 hover:text-violet-700 hover:bg-violet-50 px-3 py-1.5 rounded-xl border border-gray-100 transition-all">
//                               {cat.label || cat.name}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {/* Has query → product results */}
//                   {search.trim() && searchResults.length > 0 && (
//                     <>
//                       <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                           {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{search}"
//                         </p>
//                         <button onClick={handleViewAll}
//                           className="text-xs text-violet-600 font-semibold hover:underline">
//                           View all →
//                         </button>
//                       </div>
//                       <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
//                         {searchResults.map((p) => {
//                           const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
//                           return (
//                             <button key={p._id} onClick={() => handleSearchNav(p._id)}
//                               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50/50 transition-colors text-left group">
//                               {/* Product thumbnail */}
//                               <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
//                                 <img src={p.image || p.images?.[0]} alt={p.name}
//                                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                                   onError={(e) => { e.target.src = "https://placehold.co/48x48/f3f4f6/9ca3af?text=L"; }} />
//                               </div>
//                               {/* Product info */}
//                               <div className="flex-1 min-w-0">
//                                 <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider truncate">{p.brand || p.category}</p>
//                                 <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
//                                 <div className="flex items-center gap-2 mt-0.5">
//                                   <span className="text-sm font-bold text-gray-900">₹{(p.price || 0).toLocaleString()}</span>
//                                   {p.originalPrice && p.originalPrice > p.price && (
//                                     <span className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
//                                   )}
//                                   {disc >= 10 && <span className="text-xs text-emerald-600 font-semibold">{disc}% off</span>}
//                                 </div>
//                               </div>
//                               {/* Category tag */}
//                               <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 flex-shrink-0 hidden sm:block">
//                                 {p.category}
//                               </span>
//                               <svg className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                               </svg>
//                             </button>
//                           );
//                         })}
//                       </div>
//                       <div className="px-4 py-3 border-t border-gray-100 bg-violet-50/30">
//                         <button onClick={handleViewAll}
//                           className="w-full text-center text-xs font-semibold text-violet-600 hover:text-violet-800 py-1 transition-colors">
//                           See all results for "{search}" ↓
//                         </button>
//                       </div>
//                     </>
//                   )}

//                   {/* Has query but no results */}
//                   {search.trim() && search.length >= 2 && searchResults.length === 0 && (
//                     <div className="px-4 py-8 text-center">
//                       <p className="text-2xl mb-2">🔍</p>
//                       <p className="text-sm font-semibold text-gray-700 mb-1">No results for "{search}"</p>
//                       <p className="text-xs text-gray-400">Try a different keyword or browse categories</p>
//                       <div className="flex gap-2 justify-center mt-4 flex-wrap">
//                         {categories.slice(0, 4).map((cat) => (
//                           <button key={cat.slug} onClick={() => { navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`); setSearchFocused(false); setSearch(""); }}
//                             className="text-xs text-violet-600 px-3 py-1.5 bg-violet-50 rounded-full border border-violet-100 hover:bg-violet-100 transition-colors">
//                             {cat.label || cat.name}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Icon group */}
//             <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">

//               {/* ── Mobile search icon → opens full-screen overlay ── */}
//               <button onClick={(e) => { e.stopPropagation(); setMobileSearch(true); }}
//                 className="sm:hidden flex items-center justify-center w-9 h-9 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//                 </svg>
//               </button>

//               {/* Wishlist */}
//               <button onClick={() => navigate("/wishlist")}
//                 className="relative flex flex-col items-center px-2 sm:px-3 py-1.5 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill={wishlistCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//                 <span className="hidden sm:block mt-0.5 text-white/35 text-[9px] tracking-wider">WISHLIST</span>
//                 {wishlistCount > 0 && (
//                   <span className="absolute -top-1 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ fontSize:"8px" }}>{wishlistCount}</span>
//                 )}
//               </button>

//               {/* Cart */}
//               <button onClick={() => navigate("/cart")}
//                 className="relative flex flex-col items-center px-2 sm:px-3 py-1.5 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 <span className="hidden md:block mt-0.5 text-white/35 text-[9px]">CART</span>
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ fontSize:"8px" }}>{cartCount}</span>
//                 )}
//               </button>

//               {/* ── Premium Avatar Button → opens Profile Panel ── */}
//               <div onClick={(e) => e.stopPropagation()}>
//                 <button onClick={handleOpenMenu} className="lyra-avatar-btn ml-1">
//                   <div className="lyra-avatar-circle">{initials}</div>
//                   <span className="lyra-avatar-name hidden sm:block">{firstName}</span>
//                   <svg className="lyra-avatar-chevron w-3 h-3 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Mega nav — renders once categories are loaded from API */}
//           {categories.length > 0 && <MegaNav categories={categories} navigate={navigate} />}
//         </nav>

//         {/* ── PROFILE PANEL (slide-in right) ── */}
//         {showMenu && (
//           <ProfilePanel
//             user={user}
//             onClose={() => setShowMenu(false)}
//             navigate={navigate}
//             handleLogout={handleLogout}
//             orderCount={orderCount}
//             wishlistCount={wishlistItems.length}
//             rewardPoints={rewardPoints}
//             statsLoading={statsLoading}
//           />
//         )}

//         {/* ── MOBILE SEARCH OVERLAY ── */}
//         {mobileSearch && (
//           <div className="fixed inset-0 z-[300] bg-[#1e0a3c]/97 backdrop-blur-xl flex flex-col">
//             {/* Top bar */}
//             <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
//               <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2.5 gap-2">
//                 <svg className="w-4 h-4 text-violet-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//                 </svg>
//                 <input
//                   autoFocus
//                   className="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400"
//                   placeholder="Search fashion, footwear, beauty..."
//                   value={search}
//                   onChange={(e) => { setSearch(e.target.value); setActiveBrand(null); }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Escape") { setMobileSearch(false); setSearch(""); }
//                     if (e.key === "Enter" && search.trim()) { handleViewAll(); }
//                   }}
//                 />
//                 {search && (
//                   <button onClick={() => setSearch("")}
//                     className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs flex-shrink-0">✕</button>
//                 )}
//               </div>
//               <button onClick={() => { setMobileSearch(false); setSearch(""); }}
//                 className="text-white/70 hover:text-white text-sm font-semibold px-2 py-1.5 flex-shrink-0">
//                 Cancel
//               </button>
//             </div>

//             {/* Results / suggestions */}
//             <div className="flex-1 overflow-y-auto">
//               {!search.trim() ? (
//                 <div className="p-4">
//                   <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Trending Searches</p>
//                   <div className="flex flex-wrap gap-2 mb-6">
//                     {["Silk Dress","Sneakers","Watches","Handbags","Ethnic Wear","Sunglasses","Lipstick","Earrings","Sports Shoes","Smart Watch"].map((s) => (
//                       <button key={s} onClick={() => setSearch(s)}
//                         className="px-3 py-2 text-xs font-medium text-white/70 bg-white/8 hover:bg-white/15 rounded-full border border-white/10 transition-all">
//                         🔍 {s}
//                       </button>
//                     ))}
//                   </div>
//                   <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Categories</p>
//                   <div className="grid grid-cols-2 gap-2">
//                     {categories.slice(0, 8).map((cat) => (
//                       <button key={cat.slug} onClick={() => { navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`); setMobileSearch(false); setSearch(""); }}
//                         className="flex items-center gap-2 px-3 py-3 bg-white/5 hover:bg-white/12 rounded-xl border border-white/8 transition-all text-left">
//                         <span className="text-lg">{cat.icon}</span>
//                         <span className="text-sm text-white/70 font-medium">{cat.label || cat.name}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ) : searchResults.length === 0 && search.length >= 2 ? (
//                 <div className="flex flex-col items-center justify-center py-20 px-4">
//                   <p className="text-4xl mb-4">🔍</p>
//                   <p className="text-white font-semibold text-base mb-2">No results for "{search}"</p>
//                   <p className="text-white/40 text-sm text-center">Try a different keyword or browse categories above</p>
//                 </div>
//               ) : (
//                 <div>
//                   <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between sticky top-0 bg-[#1e0a3c]/95 backdrop-blur-sm">
//                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
//                       {searchResults.length} results for "{search}"
//                     </p>
//                     <button onClick={handleViewAll}
//                       className="text-xs text-violet-400 font-semibold hover:text-violet-300">
//                       View all ↓
//                     </button>
//                   </div>
//                   {searchResults.map((p) => {
//                     const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
//                     return (
//                       <button key={p._id} onClick={() => handleSearchNav(p._id)}
//                         className="w-full flex items-center gap-4 px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left">
//                         <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/8 flex-shrink-0">
//                           <img src={p.image || p.images?.[0]} alt={p.name}
//                             className="w-full h-full object-cover"
//                             onError={(e) => { e.target.src = "https://placehold.co/64x64/1e0a3c/a855f7?text=L"; }} />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">{p.brand || p.category}</p>
//                           <p className="text-sm font-medium text-white truncate mt-0.5">{p.name}</p>
//                           <div className="flex items-center gap-2 mt-1">
//                             <span className="text-sm font-bold text-white">₹{(p.price || 0).toLocaleString()}</span>
//                             {p.originalPrice && p.originalPrice > p.price && (
//                               <span className="text-xs text-white/30 line-through">₹{p.originalPrice.toLocaleString()}</span>
//                             )}
//                             {disc >= 10 && <span className="text-xs text-emerald-400 font-semibold">{disc}% off</span>}
//                           </div>
//                         </div>
//                         <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                         </svg>
//                       </button>
//                     );
//                   })}
//                   {search.trim() && (
//                     <button onClick={handleViewAll}
//                       className="w-full py-4 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors border-t border-white/8">
//                       See all results for "{search}" →
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Mobile drawer */}
//         <MobileDrawer
//           open={showDrawer}
//           onClose={() => setShowDrawer(false)}
//           navigate={navigate}
//           user={user}
//           handleLogout={handleLogout}
//           categories={categories}
//         />

//         {/* ═══════════════════════ PAGE BODY ═══════════════════════ */}
//         <div onClick={() => setShowMenu(false)}>

//           {/* Hero */}
//           {!heroLoading && heroSlides.length > 0 && (
//             <CinematicHero
//               slide={heroSlides[safeIdx]}
//               currentIndex={safeIdx}
//               total={heroSlides.length}
//               onDotClick={setCurrent}
//               onShopClick={() => scrollTo(shopRef)}
//             />
//           )}

//           {/* Editorial strip */}
//           {!heroLoading && <EditorialStrip onShopClick={() => scrollTo(shopRef)} />}

//           <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

//             {/* Trust badges */}
//             <div className="lyra-trust-grid mb-10 sm:mb-14">
//               {[
//                 { icon:"🚚", title:"Free Delivery",   sub:"On orders above ₹999",  from:"from-violet-600", to:"to-purple-600" },
//                 { icon:"↩",  title:"30-Day Returns",  sub:"Hassle-free exchanges",  from:"from-teal-600",   to:"to-cyan-500"   },
//                 { icon:"🔒", title:"Secure Payments", sub:"100% safe & encrypted",  from:"from-amber-500",  to:"to-orange-500" },
//                 { icon:"⭐", title:"Lyra Rewards",    sub:"Earn on every purchase", from:"from-pink-600",   to:"to-rose-500"   },
//               ].map((o) => (
//                 <div key={o.title} className={`bg-gradient-to-r ${o.from} ${o.to} rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-all duration-300 shadow cursor-pointer`}>
//                   <span className="text-2xl sm:text-3xl">{o.icon}</span>
//                   <div>
//                     <p className="lyra-serif text-white font-semibold text-sm sm:text-base">{o.title}</p>
//                     <p className="text-white/70 text-[11px] sm:text-xs mt-0.5">{o.sub}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Category showcase */}
//             {showcaseCats.length > 0 && (
//               <div className="mb-12 sm:mb-16">
//                 <div className="flex items-end justify-between mb-5 sm:mb-7">
//                   <div>
//                     <p className="text-[10px] tracking-[0.3em] text-violet-400 uppercase mb-1.5">✦ All Categories</p>
//                     <h2 className="lyra-serif text-3xl sm:text-4xl text-gray-900">Shop by <span className="text-violet-600">World</span></h2>
//                   </div>
//                   <button className="text-xs sm:text-sm text-violet-600 font-semibold hover:underline">View All →</button>
//                 </div>
//                 {/* Row 1 — 4 tall editorial cards */}
//                 <div className="lyra-showcase-top mb-3 sm:mb-4">
//                   {showcaseCats.slice(0, 4).map((cat) => (
//                     <div key={cat.label} onClick={() => navigate(cat.route)}
//                       className="relative overflow-hidden rounded-2xl cursor-pointer group"
//                       style={{ height:"clamp(180px,22vw,280px)" }}>
//                       <img src={cat.img} alt={cat.label}
//                         className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
//                         onError={(e) => { e.target.parentElement.style.background="linear-gradient(135deg,#1e0a3c,#7c3aed)"; e.target.style.display="none"; }} />
//                       <div className="absolute inset-0"
//                         style={{ background:"linear-gradient(to top,rgba(10,3,25,0.85) 0%,rgba(10,3,25,0.25) 55%,transparent 100%)" }} />
//                       <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
//                         <p className="lyra-serif text-white text-lg sm:text-2xl font-light leading-none mb-1">{cat.label}</p>
//                         <p className="text-white/50 text-[10px] sm:text-xs font-medium tracking-wide hidden sm:block">{cat.sub}</p>
//                         <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
//                           <span className="text-[10px] sm:text-xs font-bold text-white bg-violet-600 px-2 sm:px-3 py-1 rounded-full">Shop Now</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {/* Row 2 — 4 horizontal mini cards */}
//                 <div className="lyra-showcase-bottom">
//                   {showcaseCats.slice(4, 8).map((cat) => (
//                     <div key={cat.label} onClick={() => navigate(cat.route)}
//                       className="relative overflow-hidden rounded-2xl cursor-pointer group bg-white border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 flex"
//                       style={{ height:"90px" }}>
//                       <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden">
//                         <img src={cat.img} alt={cat.label}
//                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                           style={{ maskImage:"linear-gradient(to right,transparent 0%,black 40%)", WebkitMaskImage:"linear-gradient(to right,transparent 0%,black 40%)" }}
//                           onError={(e) => { e.target.style.display="none"; }} />
//                       </div>
//                       <div className="relative z-10 p-3 sm:p-4 flex flex-col justify-center flex-1">
//                         <p className="font-bold text-gray-900 text-xs sm:text-sm">{cat.label}</p>
//                         <p className="text-gray-400 text-[10px] mt-0.5 leading-tight hidden sm:block">{cat.sub}</p>
//                         <span className="mt-1.5 text-[10px] font-bold text-violet-600 tracking-wide">Explore →</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Flash sale countdown */}
//             <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5 mb-10 sm:mb-12 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 shadow-lg"
//               style={{ background:"linear-gradient(135deg,#1e0a3c,#4c1d95,#6d28d9)" }}>
//               <div className="flex-1 min-w-0">
//                 <h3 className="lyra-serif text-white text-xl sm:text-2xl">Flash Sale</h3>
//                 <p className="text-white/40 text-xs mt-0.5 hidden sm:block">Limited quantities — ends soon</p>
//               </div>
//               <span className="bg-pink-500 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full animate-pulse">⚡ LIVE</span>
//               <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
//                 {[[countdown.h,"HRS"],[countdown.m,"MIN"],[countdown.s,"SEC"]].map(([n, l], i) => (
//                   <React.Fragment key={l}>
//                     {i > 0 && <span className="text-violet-400 font-bold text-sm">:</span>}
//                     <div className="bg-white/10 border border-white/10 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-center min-w-[40px] sm:min-w-[48px]">
//                       <span className="lyra-serif text-white font-bold text-lg sm:text-xl block">{n}</span>
//                       <span className="text-white/30 text-[7px] sm:text-[8px] uppercase tracking-widest">{l}</span>
//                     </div>
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>

//             <BrandScrollBar onBrandClick={handleBrand} />

//             {/* Deals products */}
//             {dealsProducts.length > 0 && (
//               <div className="mb-10 sm:mb-14">
//                 <div className="flex items-end justify-between mb-4 sm:mb-6">
//                   <div>
//                     <p className="text-[10px] tracking-[0.3em] text-pink-400 uppercase mb-1">✦ Limited Time</p>
//                     <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Best <span className="text-pink-600">Deals</span></h2>
//                   </div>
//                   <button className="text-xs sm:text-sm text-violet-600 font-semibold hover:underline">View All Deals →</button>
//                 </div>
//                 <div className="lyra-products-grid">
//                   {dealsProducts.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}
//                 </div>
//               </div>
//             )}

//             {/* ── SEARCH RESULTS PANEL ── shown when user has typed a query */}
//             {search.trim() && (
//               <div className="mb-10 sm:mb-14">
//                 {/* Header */}
//                 <div className="flex items-end justify-between mb-5 sm:mb-6">
//                   <div>
//                     <p className="text-[10px] tracking-[0.3em] text-violet-400 uppercase mb-1.5">Search Results</p>
//                     <h2 className="lyra-serif text-3xl sm:text-4xl text-gray-900">
//                       Results for <em className="text-violet-600">"{search}"</em>
//                     </h2>
//                     <p className="text-sm text-gray-400 mt-1 font-light">
//                       {filtered.length === 0 ? "No products found" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
//                     </p>
//                   </div>
//                   <button onClick={() => { setSearch(""); setActiveBrand(null); }}
//                     className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-violet-200 transition-colors">
//                     Clear ✕
//                   </button>
//                 </div>

//                 {filtered.length > 0 ? (
//                   <div className="lyra-products-grid">
//                     {filtered.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}
//                   </div>
//                 ) : (
//                   <div className="bg-white rounded-3xl border border-slate-100 py-20 text-center shadow-sm">
//                     <p className="text-5xl mb-4">🔍</p>
//                     <p className="lyra-serif text-2xl text-gray-700 mb-2">No results for "{search}"</p>
//                     <p className="text-gray-400 text-sm mb-6">Try a different keyword, or browse by category</p>
//                     <div className="flex gap-3 justify-center flex-wrap">
//                       <button onClick={() => setSearch("")}
//                         className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
//                         Clear Search
//                       </button>
//                       {categories.slice(0, 4).map((cat) => (
//                         <button key={cat.slug} onClick={() => { navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`); setSearch(""); }}
//                           className="px-4 py-2.5 border border-violet-100 text-violet-600 rounded-xl text-sm font-medium hover:bg-violet-50 transition-colors">
//                           {cat.label || cat.name}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Main product grid */}
//             <section ref={shopRef} id="shop">
//               <div className="flex items-center justify-between mb-5 sm:mb-7">
//                 <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">
//                   {activeBrand
//                     ? <>{activeBrand} <span className="text-violet-600">Collection</span></>
//                     : <>New <span className="text-violet-600">Arrivals</span></>}
//                 </h2>
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   {activeBrand && (
//                     <button onClick={() => setActiveBrand(null)} className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full hover:bg-violet-200 transition-colors">
//                       {activeBrand} <span className="font-bold">×</span>
//                     </button>
//                   )}
//                   <button className="text-xs sm:text-sm text-violet-600 font-medium hover:underline">View All →</button>
//                 </div>
//               </div>
//               {filtered.length > 0 ? (
//                 <div className="lyra-products-grid">
//                   {filtered.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}
//                 </div>
//               ) : products.length === 0 ? (
//                 <div className="lyra-products-grid">
//                   {Array.from({ length:10 }).map((_, i) => (
//                     <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
//                       <div className="h-52 sm:h-60 bg-slate-50" />
//                       <div className="p-4 space-y-2">
//                         <div className="h-2 bg-gray-100 rounded w-1/3" />
//                         <div className="h-4 bg-gray-100 rounded w-3/4" />
//                         <div className="h-3 bg-gray-100 rounded w-1/2" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-20 sm:py-24 bg-white rounded-3xl border border-slate-100">
//                   <p className="text-4xl sm:text-5xl mb-4">🔍</p>
//                   <p className="lyra-serif text-xl text-gray-700 mb-2">No products found</p>
//                   <button onClick={() => { setSearch(""); setActiveBrand(null); setActiveTab("All"); }}
//                     className="mt-5 text-sm text-violet-600 font-medium hover:underline">Clear filters</button>
//                 </div>
//               )}
//             </section>

//             {/* Explore collections strip */}
//             <div className="mt-14 sm:mt-20 mb-10">
//               <div className="flex items-end justify-between mb-5 sm:mb-7">
//                 <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Explore <span className="text-violet-600">Collections</span></h2>
//               </div>
//               <div className="lyra-editorial-grid">
//                 {categories.slice(0, 4).map((cat, i) => {
//                   const overlays = ["#5b21b6","#9d174d","#1f2937","#78350f"];
//                   const badges   = ["New Arrivals","Editor Picks","Best Sellers","Luxury Picks"];
//                   return (
//                     <div key={cat._id || cat.slug}
//                       onClick={() => navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`)}
//                       className="relative rounded-2xl overflow-hidden cursor-pointer group shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//                       style={{ height:"clamp(140px,16vw,220px)" }}>
//                       <img src={cat.featuredImg || SHOWCASE_IMGS[cat.slug] || ""}
//                         alt={cat.label || cat.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         onError={(e) => { e.target.style.display="none"; }} />
//                       <div className="absolute inset-0 opacity-80"
//                         style={{ background:`linear-gradient(to top,${overlays[i]},transparent 65%)` }} />
//                       <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5">
//                         <span className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-1">{badges[i] || "Collection"}</span>
//                         <p className="lyra-serif text-white font-light text-base sm:text-xl leading-tight">{cat.label || cat.name}</p>
//                         <span className="text-white/45 text-[10px] sm:text-xs mt-1 group-hover:text-white transition-colors">Shop now →</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         <LyraFooter />
//         {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart }     from "./CartContext";
import { useWishlist } from "./WishlistContext";
import AddToCartModal  from "./AddToCartModal";
import SearchOverlay   from "./Searchoverlay";
import axios           from "axios";
import LyraFooter      from "./Footer";

// ── API instances ────────────────────────────────────────────────
const API     = axios.create({ baseURL: "https://lyra-backend-gilt.vercel.app/api/admin" });
const CAT_API = axios.create({ baseURL: "https://lyra-backend-gilt.vercel.app/api" });

// Attach JWT from sessionStorage to every request automatically
const attachToken = (instance) =>
  instance.interceptors.request.use((cfg) => {
    try {
      const u = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (u.token) cfg.headers.Authorization = `Bearer ${u.token}`;
    } catch {}
    return cfg;
  });
attachToken(API);
attachToken(CAT_API);



// ── Fallback images keyed by category slug ───────────────────────
const SHOWCASE_IMGS = {
  men:         "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
  women:       "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  kids:        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
  beauty:      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
  home:        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  electronics: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  sports:      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
  watches:     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  sale:        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
};

const FEATURED_IMGS = {
  men:         { img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", label: "New Arrivals"    },
  women:       { img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", label: "Trending Now"    },
  kids:        { img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80", label: "Back to School"  },
  beauty:      { img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", label: "Bestsellers"     },
  home:        { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",   label: "Trending Décor"  },
  electronics: { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80", label: "Tech Picks"      },
  sports:      { img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80", label: "New Season Gear" },
};

const BRANDS_LOOP = (() => {
  const raw = [
    { name:"Nike",           logo:"https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",                                                                   bg:"#f8f8f8" },
    { name:"Adidas",         logo:"https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",                                                                  bg:"#f8f8f8" },
    { name:"Zara",           logo:"https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",                                                                    bg:"#f8f8f8" },
    { name:"H&M",            logo:"https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",                                                                   bg:"#fff5f5" },
    { name:"Puma",           logo:"https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg",                                                                    bg:"#f8f8f8" },
    { name:"Levi's",         logo:"https://upload.wikimedia.org/wikipedia/commons/7/7d/Levi%27s_logo_red.svg",                                                            bg:"#fff5f5" },
    { name:"Gucci",          logo:"https://upload.wikimedia.org/wikipedia/commons/7/79/1000x1000_Gucci_logo.svg",                                                         bg:"#fafaf8" },
    { name:"Rolex",          logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Rolex_Logo.png/640px-Rolex_Logo.png",                                        bg:"#f5faf5" },
    { name:"Ray-Ban",        logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Ray-Ban_logo.svg/640px-Ray-Ban_logo.svg.png",                                bg:"#fff8f5" },
    { name:"Tommy Hilfiger", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Tommy_Hilfiger_logo.svg/640px-Tommy_Hilfiger_logo.svg.png",                  bg:"#f5f5ff" },
    { name:"Calvin Klein",   logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Calvin_Klein_color_logo.svg/640px-Calvin_Klein_color_logo.svg.png",          bg:"#f8f8f8" },
    { name:"Lyra Studio",    logoText:"LYRA",  color:"#6d28d9", bg:"#f5f3ff" },
    { name:"Elliot & Co",    logoText:"E&Co",  color:"#047857", bg:"#ecfdf5" },
    { name:"BloomWear",      logoText:"bloom", color:"#be185d", bg:"#fdf2f8" },
    { name:"TimeLux",        logoText:"TL",    color:"#92400e", bg:"#fffbeb" },
    { name:"FlexFit",        logoText:"FF",    color:"#0f766e", bg:"#f0fdfa" },
  ];
  return [...raw, ...raw];
})();

// ══════════════════════════════════════════════════════════════════
// NORMALISE CATEGORY — converts DB shape to a single canonical shape
// Works with both static links[] and DB subCategories[{name}]
// ══════════════════════════════════════════════════════════════════
const normaliseCategory = (cat) => {
  const slug          = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "";
  const fallback      = FEATURED_IMGS[slug] || { img: "", label: "New Arrivals" };
  const featuredImg   = cat.featuredImg   || cat.heroImg   || fallback.img;
  const featuredLabel = cat.featuredLabel || cat.heroLabel || fallback.label;
  const columns = (cat.columns || [])
    .map((col) => {
      const rawLinks =
        Array.isArray(col.subCategories) ? col.subCategories :
        Array.isArray(col.links)         ? col.links         : [];
      const links = rawLinks
        .map((item) => (typeof item === "string" ? { name: item } : item))
        .filter((item) => item && typeof item.name === "string" && item.name.trim());
      return { ...col, links };
    })
    .filter((col) => col.links.length > 0);
  return { ...cat, slug, featuredImg, featuredLabel, columns, noMenu: Boolean(cat.noMenu) };
};

// ══════════════════════════════════════════════════════════════════
// PROFILE PANEL — slide-in panel from right side of screen
// Props:
//   user           — sessionStorage user object
//   orderCount     — live count from GET /api/orders/my
//   wishlistCount  — live count from WishlistContext
//   rewardPoints   — default 0 (extend when rewards system is built)
//   loading        — true while order count is being fetched
// ══════════════════════════════════════════════════════════════════
const ProfilePanel = ({ user, onClose, navigate, handleLogout, orderCount, wishlistCount, rewardPoints, statsLoading }) => {
  const initials = (user.fullName || "G").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const menuItems = [
    { icon:"📦", label:"My Orders",   sublabel:"Track & manage",    path:"/profile?tab=orders",    accent:"#7c3aed" },
    { icon:"👤", label:"My Profile",  sublabel:"Edit details",       path:"/profile?tab=profile",   accent:"#0891b2" },
    { icon:"♡",  label:"Wishlist",    sublabel:"Saved items",        path:"/wishlist",               accent:"#e11d48" },
    { icon:"📍", label:"Addresses",   sublabel:"Delivery locations", path:"/profile?tab=addresses", accent:"#059669" },
    { icon:"🎁", label:"Rewards",     sublabel:"Points & offers",    path:"/profile?tab=rewards",   accent:"#d97706" },
  ];

  // Stat tiles — data driven from props
  const stats = [
    { label:"Orders",  value: statsLoading ? "…" : String(orderCount)  },
    { label:"Wishlist",value: statsLoading ? "…" : String(wishlistCount) },
    { label:"Points",  value: statsLoading ? "…" : String(rewardPoints) },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="lyra-overlay" onClick={onClose} />

      {/* Panel */}
      <div className="lyra-profile-panel slide-in-right">

        {/* Header */}
        <div className="lpp-header">
          <div className="lpp-avatar-ring">
            <div className="lpp-avatar">{initials}</div>
          </div>
          <div className="lpp-header-info">
            <p className="lpp-name">{user.fullName || "Guest"}</p>
            <p className="lpp-contact">{user.email || user.mobileNumber || ""}</p>
            <span className="lpp-badge">✦ Lyra Member</span>
          </div>
          <button onClick={onClose} className="lpp-close">✕</button>
        </div>

        {/* Stats row — live data */}
        <div className="lpp-stats">
          {stats.map(({ label, value }) => (
            <div key={label} className="lpp-stat">
              <span className="lpp-stat-num">{value}</span>
              <span className="lpp-stat-lbl">{label}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="lpp-menu">
          {menuItems.map((item) => (
            <button key={item.label} onClick={() => { onClose(); navigate(item.path); }} className="lpp-item">
              <span className="lpp-item-icon" style={{ background: item.accent + "18", color: item.accent }}>
                {item.icon}
              </span>
              <div className="lpp-item-text">
                <span className="lpp-item-label">{item.label}</span>
                <span className="lpp-item-sub">{item.sublabel}</span>
              </div>
              <span className="lpp-item-arrow">›</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="lpp-footer">
          <button onClick={() => { onClose(); handleLogout(); }} className="lpp-logout">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════
// CINEMATIC HERO
// ══════════════════════════════════════════════════════════════════
const CinematicHero = ({ slide, currentIndex, total, onDotClick, onShopClick }) => {
  if (!slide) return null;
  return (
    <div className="relative w-full overflow-hidden lyra-hero">
      <div className="absolute inset-0">
        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.opacity="0"; }} />
        <div className="absolute inset-0" style={{ background: slide.overlay }} />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-12 lg:px-24">
        <p className="text-[10px] sm:text-xs tracking-[0.4em] text-white/40 uppercase mb-3 sm:mb-5 font-light">✦ Lyra Collection</p>
        <h1 className="font-light text-white leading-none mb-4 sm:mb-5 lyra-serif" style={{ fontSize:"clamp(2.2rem,7vw,6rem)" }}>
          {slide.title}<br />
          <span style={{ background:"linear-gradient(135deg,#f3e8ff,#e879f9,#fbcfe8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {slide.titleAccent}
          </span>
        </h1>
        <p className="text-white/55 text-sm sm:text-base max-w-xs sm:max-w-lg mb-7 sm:mb-9 font-light leading-relaxed">{slide.subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onShopClick} className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#1e0a3c] text-xs sm:text-sm font-bold rounded-2xl hover:bg-violet-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">{slide.cta} →</button>
          <button onClick={onShopClick} className="px-5 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white text-xs sm:text-sm font-semibold rounded-2xl hover:bg-white/10 hover:border-white/60 transition-all duration-300">View Collections</button>
        </div>
        <div className="flex gap-2 mt-7 sm:mt-10">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => onDotClick(i)} className={`rounded-full transition-all ${i === currentIndex ? "w-8 h-1.5 bg-white" : "w-4 h-1.5 bg-white/35"}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// EDITORIAL STRIP
// ══════════════════════════════════════════════════════════════════
const EditorialStrip = ({ onShopClick }) => {
  const marqueeItems = ["New Season","Men's Edit","Women's Edit","Beauty Drop","Tech Essentials","Home Luxe"];
  return (
    <div className="lyra-editorial-strip overflow-hidden relative"
      style={{ background:"linear-gradient(135deg,#0f0820,#1e0a3c 40%,#2d1060 70%,#0f0820)" }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")", backgroundSize:"128px" }} />
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch" style={{ minHeight:"400px" }}>
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-16">
          <div className="inline-flex items-center gap-2 mb-5 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase">SS 2025 Collection</span>
          </div>
          <h2 className="lyra-serif text-white font-light leading-[0.95] mb-5" style={{ fontSize:"clamp(2.4rem,5.5vw,4.8rem)" }}>
            Style That<br />
            <span style={{ background:"linear-gradient(90deg,#f9a8d4,#c084fc,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Speaks First.
            </span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-sm mb-8 leading-relaxed font-light">
            Curated collections for every occasion. Discover pieces that define your story this season.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            {["Explore Men","Explore Women","New Arrivals"].map((label, i) => (
              <button key={label} onClick={onShopClick}
                className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
                  i === 0 ? "bg-white text-[#1e0a3c] hover:bg-violet-100" : "border border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                }`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6 sm:gap-10">
            {[["50K+","Products"],["200+","Brands"],["4.9★","Rating"]].map(([num, lbl]) => (
              <div key={lbl}>
                <p className="lyra-serif text-white font-semibold text-xl sm:text-2xl">{num}</p>
                <p className="text-white/30 text-[10px] tracking-widest uppercase">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-2/5 flex-shrink-0 grid grid-cols-2 gap-2 p-4 lg:p-6 self-center">
          {[
            { img:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80", tall:true,  label:"Women's" },
            { img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", tall:false, label:"Men's"   },
            { img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", tall:false, label:"Watches" },
          ].map((tile, i) => (
            <div key={i} onClick={onShopClick}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${tile.tall ? "row-span-2" : ""}`}
              style={{ minHeight:tile.tall ? "220px" : "104px" }}>
              <img src={tile.img} alt={tile.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-3 text-white text-[10px] font-bold tracking-widest uppercase opacity-80">{tile.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Marquee strip */}
      <div className="border-t border-white/5 overflow-hidden py-3">
        <div className="lyra-marquee-track flex items-center whitespace-nowrap" style={{ width:"max-content" }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <React.Fragment key={i}>
              <span className="text-white/15 text-[11px] font-bold uppercase tracking-[0.3em] px-6">{item}</span>
              <span className="text-violet-700/30 text-[10px]">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// BRAND SCROLL
// ══════════════════════════════════════════════════════════════════
const BrandScrollBar = ({ onBrandClick }) => {
  const trackRef  = useRef(null);
  const animRef   = useRef(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = () => {
      if (!pausedRef.current) {
        posRef.current += 0.4;
        if (posRef.current >= track.scrollWidth / 2) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-slate-400 uppercase mb-1.5">Partners</p>
          <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Top <span className="text-violet-600">Brands</span></h2>
        </div>
        <button className="text-xs text-violet-600 font-semibold border border-violet-200 hover:border-violet-400 px-4 py-1.5 rounded-full transition-colors">View All →</button>
      </div>
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 py-5 shadow-sm"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}>
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background:"linear-gradient(to right,white,transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background:"linear-gradient(to left,white,transparent)" }} />
        <div ref={trackRef} className="flex items-center gap-3 px-4" style={{ width:"max-content", willChange:"transform" }}>
          {BRANDS_LOOP.map((b, i) => (
            <button key={`${b.name}-${i}`} onClick={() => onBrandClick(b.name)} className="flex-shrink-0 flex flex-col items-center gap-2 group">
              <div className="w-24 h-12 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-violet-300 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all overflow-hidden px-3"
                style={{ background:b.bg }}>
                {b.logo
                  ? <img src={b.logo} alt={b.name} className="max-w-full max-h-8 object-contain" onError={(e) => { e.target.style.display="none"; }} />
                  : <span style={{ color:b.color||"#1e0a3c", fontFamily:"Georgia,serif", fontWeight:"bold", fontSize:"0.82rem" }}>{b.logoText||b.name}</span>
                }
              </div>
              <span className="text-[10px] text-gray-400 group-hover:text-violet-600 transition-colors font-medium">{b.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// PRODUCT CARD
// ══════════════════════════════════════════════════════════════════
const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const disc = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  return (
    <div onClick={() => navigate(`/product/${product._id}`)} className="lyra-card group cursor-pointer">
      {product.badge && <span className="lyra-badge-hot">{product.badge}</span>}
      {disc >= 30 && !product.badge && <span className="lyra-badge-sale">{disc}% OFF</span>}
      <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} className="lyra-wish-btn" style={{ color:wishlisted?"#ef4444":"#cbd5e1" }}>
        {wishlisted ? "♥" : "♡"}
      </button>
      <div className="lyra-card-img">
        <img src={product.image || product.images?.[0]} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { e.target.src="https://placehold.co/300x400/f8f9fa/9ca3af?text=Lyra"; }} />
      </div>
      <div className="p-3 sm:p-4">
        <p className="lyra-card-brand">{product.brand || product.category}</p>
        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate mb-1.5">{product.name}</p>
        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length:5 }).map((_, i) => (<span key={i} className={`text-[10px] ${i < Math.floor(product.rating||0) ? "text-amber-400" : "text-gray-200"}`}>★</span>))}
          <span className="text-gray-400 text-[10px] ml-1">({(product.reviews||0).toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm sm:text-base font-bold text-gray-900">₹{(product.price||0).toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>}
          {disc > 0 && disc < 30 && <span className="lyra-disc-tag">{disc}% off</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="lyra-card-atc">Add to Cart</button>
      </div>
    </div>
  );
};

// ── Countdown ──────────────────────────────────────────────────────
const useCountdown = () => {
  const [time, setTime] = useState({ h:"08", m:"23", s:"47" });
  useEffect(() => {
    const id = setInterval(() => setTime((prev) => {
      let s = parseInt(prev.s)-1, m=parseInt(prev.m), h=parseInt(prev.h);
      if (s<0){s=59;m--;} if (m<0){m=59;h--;} if (h<0){h=23;m=59;s=59;}
      return { h:String(h).padStart(2,"0"), m:String(m).padStart(2,"0"), s:String(s).padStart(2,"0") };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

// ══════════════════════════════════════════════════════════════════
// MOBILE DRAWER
// ══════════════════════════════════════════════════════════════════
const MobileDrawer = ({ open, onClose, navigate, user, handleLogout, categories }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white z-[70] overflow-y-auto shadow-2xl lyra-drawer">
        <div className="bg-gradient-to-br from-[#1e0a3c] to-violet-700 px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <span className="lyra-serif text-white text-xl tracking-widest">LY<span className="text-pink-400">R</span>A</span>
            <button onClick={onClose} className="text-white/60 hover:text-white text-xl">✕</button>
          </div>
          <p className="text-white font-semibold">{user.fullName || "Guest"}</p>
          <p className="text-purple-300 text-xs mt-0.5">{user.email || user.mobileNumber || ""}</p>
        </div>
        <div className="p-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 px-2">Shop</p>
          {(categories || []).map((cat) => (
            <button key={cat._id || cat.slug} onClick={() => { navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
              <span className="flex items-center gap-2">{cat.icon && <span>{cat.icon}</span>}<span>{cat.label || cat.name}</span></span>
              {cat.badge && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{cat.badge}</span>}
            </button>
          ))}
          <div className="border-t border-slate-100 mt-3 pt-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 px-2">Account</p>
            {[
              { label:"📦 My Orders",  path:"/profile?tab=orders"    },
              { label:"👤 My Profile", path:"/profile?tab=profile"   },
              { label:"♡  Wishlist",   path:"/wishlist"              },
              { label:"📍 Addresses",  path:"/profile?tab=addresses" },
            ].map((item) => (
              <button key={item.label} onClick={() => { navigate(item.path); onClose(); }}
                className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                {item.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full text-left px-3 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-1">🚪 Sign Out</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════
// MEGA NAV — premium viewport-aware dropdowns
// ══════════════════════════════════════════════════════════════════

// ─── Single nav item with viewport-corrected panel ───────────────
const MegaNavItem = ({ item, isOpen, onOpen, onClose, onToggle, goTo }) => {
  const tabRef      = React.useRef(null);
  const itemKey     = item.slug || item.name;
  const isSale      = (item.slug || item.name || "").toLowerCase() === "sale";
  const visibleCols = (item.columns || []).slice(0, 4);
  const colCount    = visibleCols.length;
  const panelW      = colCount === 0 ? 0 : colCount === 1 ? 260 : colCount === 2 ? 400 : colCount === 3 ? 540 : 680;
  const hasDropdown = !item.noMenu && colCount > 0;

  // Compute left offset so panel never overflows viewport
  const [panelLeft, setPanelLeft] = React.useState(0);
  React.useEffect(() => {
    if (!isOpen || !tabRef.current || !hasDropdown) return;
    const rect = tabRef.current.getBoundingClientRect();
    const margin = 12;
    let left = 0;
    const overflow = rect.left + panelW - (window.innerWidth - margin);
    if (overflow > 0) left = -overflow;
    const maxShift = -(rect.left - margin);
    left = Math.max(left, maxShift);
    setPanelLeft(left);
  }, [isOpen, panelW, hasDropdown]);

  return (
    <div ref={tabRef} className="mega-parent"
      onMouseEnter={() => hasDropdown && onOpen(itemKey)}
      onMouseLeave={() => hasDropdown && onClose(itemKey)}>

      <button
        onClick={() => hasDropdown ? onToggle(itemKey) : goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)}
        className={["nav-item", isSale ? "sale-item" : "", isOpen ? "active" : ""].filter(Boolean).join(" ")}>
        {item.label || item.name}
        {item.badge && (
          <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
            style={{ background: item.badgeColor || "#ef4444" }}>
            {item.badge}
          </span>
        )}
        {hasDropdown && (
          <svg className={`ml-1 w-3 h-3 opacity-25 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* ─── Premium dropdown panel ─── */}
      {hasDropdown && isOpen && (
        <div className="mega-panel"
          style={{
            position: "absolute", top: "100%", left: `${panelLeft}px`,
            minWidth: `${panelW}px`, maxWidth: "min(96vw, 720px)",
            zIndex: 2000,
            background: "linear-gradient(160deg, #0d0622 0%, #120830 55%, #0a0518 100%)",
            borderTop: "1px solid rgba(124,58,237,0.5)",
            borderRadius: "0 0 20px 20px",
            boxShadow: "0 32px 80px -8px rgba(5,2,15,0.75), 0 0 0 1px rgba(124,58,237,0.12)",
            overflow: "hidden",
          }}
          onMouseEnter={() => onOpen(itemKey)}
          onMouseLeave={() => onClose(itemKey)}>

          {/* Invisible gap bridge */}
          <div style={{ position:"absolute", top:"-8px", left:0, right:0, height:"8px" }}
            onMouseEnter={() => onOpen(itemKey)} />

          {/* Subtle noise texture */}
          <div style={{
            position:"absolute", inset:0, opacity:0.04, pointerEvents:"none",
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')",
            backgroundSize:"128px"
          }} />

          {/* Ambient glow */}
          <div style={{
            position:"absolute", top:-80, left:-80, width:300, height:300,
            borderRadius:"50%", background:"rgba(109,40,217,0.14)", filter:"blur(80px)", pointerEvents:"none"
          }} />

          <div className="relative flex" style={{ minHeight: "180px" }}>
            {/* ── Columns ── */}
            <div className="flex-1 p-5 grid"
              style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)`, columnGap: "20px" }}>
              {visibleCols.map((col) => (
                <div key={col._id || col.title} className="py-1 min-w-0">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-3.5 pb-2.5"
                    style={{ borderBottom: "1px solid rgba(124,58,237,0.2)" }}>
                    <div className="w-0.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ background: "linear-gradient(to bottom, #a855f7, #7c3aed)" }} />
                    <p style={{
                      fontSize:"9px", fontWeight:700, color:"#a78bfa",
                      textTransform:"uppercase", letterSpacing:"0.2em"
                    }}>{col.title}</p>
                  </div>
                  {/* Links */}
                  <div className="space-y-0.5">
                    {col.links.map((link) => (
                      <button key={link._id || link.name}
                        onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}?sub=${encodeURIComponent(link.name)}`)}
                        className="mega-link-dark">
                        {link.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Featured image panel ── */}
            {item.featuredImg && (
              <div className="flex-shrink-0 relative overflow-hidden"
                style={{ width: "148px", borderLeft: "1px solid rgba(124,58,237,0.1)" }}>
                <img src={item.featuredImg} alt={item.featuredLabel || item.label || item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-600"
                  style={{ minHeight: "180px" }}
                  onError={(e) => { e.target.parentElement.style.display = "none"; }} />
                {/* Dark overlay */}
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(6,2,15,0.92) 0%, rgba(6,2,15,0.35) 55%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <p style={{ fontSize:"8px", letterSpacing:"0.22em", color:"rgba(167,139,250,0.5)", textTransform:"uppercase", fontWeight:700, marginBottom:"4px" }}>Featured</p>
                  <p style={{ color:"rgba(255,255,255,0.92)", fontWeight:600, fontSize:"11px", lineHeight:1.35, marginBottom:"8px" }}>
                    {item.featuredLabel || "New Arrivals"}
                  </p>
                  <button onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)}
                    style={{
                      fontSize:"10px", color:"rgba(167,139,250,0.8)", fontWeight:600,
                      background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.3)",
                      borderRadius:"8px", padding:"5px 10px", cursor:"pointer", transition:"all 0.18s"
                    }}
                    onMouseEnter={(e) => { e.target.style.background="rgba(124,58,237,0.35)"; e.target.style.color="rgba(196,181,253,1)"; }}
                    onMouseLeave={(e) => { e.target.style.background="rgba(124,58,237,0.2)"; e.target.style.color="rgba(167,139,250,0.8)"; }}>
                    Shop Now →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Quick shop footer ── */}
          <div style={{
            padding:"10px 20px", display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap",
            borderTop:"1px solid rgba(124,58,237,0.12)",
            background:"rgba(0,0,0,0.3)"
          }}>
            <span style={{ fontSize:"8px", fontWeight:700, color:"rgba(255,255,255,0.2)", letterSpacing:"0.22em", textTransform:"uppercase", marginRight:"4px" }}>
              Quick Shop
            </span>
            {["New Arrivals","Best Sellers","Under ₹999","Premium"].map((q) => (
              <button key={q} onClick={() => goTo(`/category/${encodeURIComponent(item.slug || item.name)}`)}
                style={{
                  fontSize:"10px", fontWeight:600, cursor:"pointer", transition:"all 0.18s",
                  padding:"4px 10px", borderRadius:"99px",
                  background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.18)",
                  color:"rgba(167,139,250,0.8)"
                }}
                onMouseEnter={(e) => { e.target.style.background="rgba(124,58,237,0.25)"; e.target.style.color="#c4b5fd"; }}
                onMouseLeave={(e) => { e.target.style.background="rgba(124,58,237,0.1)"; e.target.style.color="rgba(167,139,250,0.8)"; }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MegaNav = ({ categories, navigate }) => {
  const [activeMega, setActiveMega] = useState(null);
  const activeRef = useRef(null);
  const timers    = useRef({});
  const openMega  = useCallback((key) => { Object.values(timers.current).forEach(clearTimeout); timers.current = {}; activeRef.current = key; setActiveMega(key); }, []);
  const closeMega = useCallback((key) => { timers.current[key] = setTimeout(() => { if (activeRef.current === key) { activeRef.current = null; setActiveMega(null); } }, 200); }, []);
  const toggleMega = useCallback((key) => { setActiveMega((v) => { const n = v === key ? null : key; activeRef.current = n; return n; }); }, []);
  const goTo      = useCallback((path) => { activeRef.current = null; setActiveMega(null); navigate(path); }, [navigate]);
  return (
    <div className="hidden lg:block border-t border-white/[0.06]" style={{ background:"rgba(0,0,0,0.2)", position:"relative", zIndex:100 }}>
      <div className="flex items-stretch justify-center max-w-screen-xl mx-auto">
        {(categories || []).map((item) => (
          <MegaNavItem key={item.slug || item.name} item={item}
            isOpen={activeMega === (item.slug || item.name)}
            onOpen={openMega} onClose={closeMega} onToggle={toggleMega} goTo={goTo} />
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const navigate = useNavigate();
  const { cartCount }                   = useCart();
  const { wishlistCount, wishlistItems } = useWishlist();
  const countdown = useCountdown();

  const [user,         setUser]         = useState({});
  const [search,         setSearch]         = useState("");
  const [showMenu,     setShowMenu]     = useState(false);
  const [showDrawer,   setShowDrawer]   = useState(false);
  const [activeBrand,  setActiveBrand]  = useState(null);
  const [activeTab,    setActiveTab]    = useState("All");
  const [modalProduct, setModalProduct] = useState(null);
  const [products,     setProducts]     = useState([]);
  const [scrolled,     setScrolled]     = useState(false);
  const [currentSlide, setCurrent]      = useState(0);
  const [heroSlides,   setHeroSlides]   = useState([]);
  const [heroLoading,  setHeroLoading]  = useState(true);
  const [categories,   setCategories]   = useState([]);

  // ── Search overlay ──────────────────────────────────────────────
  const [searchOpen,   setSearchOpen]   = useState(false);

  // ── Profile panel stats ── fetched when panel opens
  const [orderCount,   setOrderCount]   = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0); // default 0, extend later
  const [statsLoading, setStatsLoading] = useState(false);

  const shopRef = useRef(null);

  // ── Scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Main data load ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const stored = sessionStorage.getItem("user");
      if (!stored) { navigate("/"); return; }
      setUser(JSON.parse(stored));

      // Products
      try {
        const { data } = await API.get("/products");
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (e) { console.error("Products:", e.message); }

      // Hero slides (from admin hero-slides endpoint)
      try {
        const { data } = await API.get("/hero-slides/active");
        setHeroSlides(data.slides || data || []);
      } catch (e) { console.warn("Hero slides:", e.message); }
      finally { setHeroLoading(false); }

      // Categories — normalise every item to one consistent shape
      try {
        const { data } = await CAT_API.get("/categories");
        const raw = Array.isArray(data) ? data
          : Array.isArray(data.categories)        ? data.categories
          : Array.isArray(data?.data?.categories) ? data.data.categories
          : [];
        setCategories(
          raw.filter((c) => c.active !== false)
             .sort((a, b) => (a.order || 0) - (b.order || 0))
             .map(normaliseCategory)
        );
      } catch (e) { console.warn("Categories:", e.message); }
    };
    load();
  }, [navigate]);

  // ── Hero auto-advance ───────────────────────────────────────────
  useEffect(() => {
    if (!heroSlides.length) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  // ── Fetch profile stats when panel opens ────────────────────────
  // Orders  : GET /api/orders/my   (requires Bearer token)
  // Wishlist: already live via WishlistContext (wishlistItems.length)
  // Rewards : default 0 until a rewards endpoint exists
  const fetchProfileStats = useCallback(async () => {
    const stored = sessionStorage.getItem("user");
    if (!stored) return;
    const { token } = JSON.parse(stored);
    if (!token) return;
    setStatsLoading(true);
    try {
      const res = await fetch("https://lyra-backend-gilt.vercel.app/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const orders = Array.isArray(data) ? data : data.orders || [];
        setOrderCount(orders.length);
      }
      // Rewards: placeholder — set to 0 or fetch from /api/users/me when available
      setRewardPoints(0);
    } catch (e) { console.error("Stats fetch:", e.message); }
    finally { setStatsLoading(false); }
  }, []);

  // Open search overlay
  const openSearch = useCallback((e) => {
    e?.stopPropagation();
    setSearchOpen(true);
  }, []);

  // Open profile panel — fetch stats
  const handleOpenMenu = useCallback((e) => {
    e.stopPropagation();
    setShowMenu((v) => {
      if (!v) fetchProfileStats(); // fetch on open
      return !v;
    });
  }, [fetchProfileStats]);

  const scrollTo     = useCallback((ref) => { ref.current?.scrollIntoView({ behavior:"smooth", block:"start" }); setShowMenu(false); }, []);
  const handleLogout = () => { sessionStorage.removeItem("user"); navigate("/"); };
  const handleBrand  = (n) => { setActiveBrand(n); setActiveTab("All"); setSearch(""); scrollTo(shopRef); };

  const filtered      = products.filter((p) => {
    if (activeTab !== "All" && p.category !== activeTab) return false;
    if (activeBrand && (p.brand||"").toLowerCase() !== activeBrand.toLowerCase()) return false;
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const dealsProducts = products.filter((p) => p.originalPrice && ((p.originalPrice - p.price) / p.originalPrice) >= 0.3).slice(0, 10);

  // ── Live search results for dropdown ─────────────────────────────
  // Shows up to 8 matching products in the navbar search dropdown
  // Navigation: click a result → /product/:id   |   "View all" → /search?q=...
  const searchResults = React.useMemo(() => {
    if (!search.trim() || search.length < 2) return [];
    const q = search.toLowerCase();
    return products.filter((p) =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [products, search]);

  const handleSearchNav = (productId) => {
    setSearch("");
    setSearchFocused(false);
    navigate(`/product/${productId}`);
  };
  const handleViewAll = () => {
    const q = search.trim();
    setSearchFocused(false);
    // Scroll to shop section which is already filtered
    scrollTo(shopRef);
  };
  const safeIdx       = heroSlides.length ? currentSlide % heroSlides.length : 0;
  const firstName     = user.fullName?.split(" ")[0] || "Account";
  const initials      = (user.fullName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const showcaseCats = categories.slice(0, 8).map((cat) => ({
    label: cat.label || cat.name,
    sub:   (cat.columns || []).slice(0, 3).map((c) => c.title).join(" · "),
    img:   cat.featuredImg || SHOWCASE_IMGS[cat.slug] || "",
    route: `/category/${encodeURIComponent(cat.slug || cat.name)}`,
  }));

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .lyra-body,.lyra-body*{font-family:'DM Sans',system-ui,sans-serif;box-sizing:border-box;}
        .lyra-serif{font-family:'Cormorant Garamond',Georgia,serif!important;}
        .lyra-hero{height:88vh;max-height:800px;}
        @media(max-width:640px){.lyra-hero{height:75vh;max-height:600px;}}
        .lyra-editorial-strip{min-height:400px;}
        .lyra-drawer{animation:drawerSlide 0.28s cubic-bezier(0.16,1,0.3,1) forwards;}
        @keyframes drawerSlide{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
        .shimmer-text{background:linear-gradient(90deg,#c084fc,#f472b6,#fb923c,#c084fc);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite;}
        @keyframes megaFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .mega-panel{animation:megaFade 0.18s cubic-bezier(0.16,1,0.3,1) forwards;}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        .slide-down{animation:slideDown 0.2s cubic-bezier(0.16,1,0.3,1) forwards;}
        .mega-link{position:relative;color:#4b5563;font-size:12px;font-weight:400;padding:3px 0;display:block;transition:color 0.15s;cursor:pointer;}
        .mega-link:hover{color:#7c3aed;}
        .mega-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#7c3aed;transition:width 0.2s ease;}
        .mega-link:hover::after{width:100%;}
        .nav-item{position:relative;padding:0 14px;height:42px;display:flex;align-items:center;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;cursor:pointer;transition:color 0.2s,background 0.2s;color:rgba(255,255,255,0.5);white-space:nowrap;}
        .nav-item:hover{color:white;background:rgba(255,255,255,0.05);}
        .nav-item.active{color:white;background:rgba(255,255,255,0.05);}
        .nav-item::after{content:'';position:absolute;bottom:0;left:14px;right:14px;height:2px;background:white;transform:scaleX(0);transition:transform 0.2s ease;border-radius:2px 2px 0 0;}
        .nav-item:hover::after,.nav-item.active::after{transform:scaleX(1);}
        .nav-item.sale-item{color:#f87171;}
        .nav-item.sale-item:hover{color:#fca5a5;}
        .nav-item.sale-item::after{background:#ef4444;}
        .mega-parent{position:relative;flex-shrink:0;}
        .mega-drop{position:absolute;top:100%;left:0;z-index:200;}
        .mega-drop.anchor-right{left:auto;right:0;}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .lyra-marquee-track{animation:marquee 30s linear infinite;}
        @media(max-width:1023px){.lyra-mega-nav{display:none!important}}
        .lyra-mobile-hamburger{display:none;}
        @media(max-width:1023px){.lyra-mobile-hamburger{display:flex!important}}
        .lyra-trust-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
        @media(min-width:768px){.lyra-trust-grid{grid-template-columns:repeat(4,1fr)}}
        .lyra-showcase-top{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
        @media(min-width:768px){.lyra-showcase-top{grid-template-columns:repeat(4,1fr)}}
        .lyra-showcase-bottom{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
        @media(min-width:768px){.lyra-showcase-bottom{grid-template-columns:repeat(4,1fr)}}
        .lyra-products-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
        @media(min-width:640px){.lyra-products-grid{grid-template-columns:repeat(3,1fr)}}
        @media(min-width:1024px){.lyra-products-grid{grid-template-columns:repeat(4,1fr)}}
        @media(min-width:1280px){.lyra-products-grid{grid-template-columns:repeat(5,1fr)}}
        .lyra-editorial-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
        @media(min-width:1024px){.lyra-editorial-grid{grid-template-columns:repeat(4,1fr)}}
        .scrollbar-none::-webkit-scrollbar{display:none;}
        .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none;}

        /* ── Dark mega-link (inside dark dropdown) ── */
        .mega-link-dark{
          display:block;width:100%;text-align:left;padding:5px 6px;border-radius:8px;
          font-size:12px;font-weight:400;color:rgba(255,255,255,0.45);
          background:transparent;border:none;cursor:pointer;
          transition:color 0.15s, background 0.15s, padding-left 0.15s;
          letter-spacing:0.01em;line-height:1.45;
        }
        .mega-link-dark:hover{color:rgba(196,181,253,0.95);background:rgba(124,58,237,0.14);padding-left:10px;}

        /* ── Search trigger (looks like an input, clicks open overlay) ── */
        .lyra-search-trigger{
          display:flex;align-items:center;gap:10px;flex:1;max-width:540px;
          background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);
          border-radius:13px;padding:9px 14px;cursor:pointer;transition:all 0.22s;text-align:left;
        }
        .lyra-search-trigger:hover{
          background:rgba(255,255,255,0.1);border-color:rgba(124,58,237,0.45);
          box-shadow:0 0 0 3px rgba(124,58,237,0.1);
        }
        .lyra-search-trigger-text{font-size:13px;color:rgba(255,255,255,0.25);flex:1;font-weight:400;letter-spacing:0.01em;}
        .lyra-search-kbd{
          font-size:10px;color:rgba(255,255,255,0.18);
          background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
          border-radius:6px;padding:2px 7px;white-space:nowrap;font-weight:500;
          display:none;
        }
        @media(min-width:1024px){.lyra-search-kbd{display:inline;}}

        /* ── Product Card ── */
        .lyra-card{background:white;border-radius:16px;border:1px solid #f1f5f9;overflow:hidden;position:relative;transition:all 0.3s;}
        .lyra-card:hover{border-color:#ddd6fe;box-shadow:0 20px 40px -8px rgba(124,58,237,0.12);transform:translateY(-4px);}
        .lyra-badge-hot{position:absolute;top:12px;left:12px;z-index:10;background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;}
        .lyra-badge-sale{position:absolute;top:12px;left:12px;z-index:10;background:#10b981;color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;}
        .lyra-wish-btn{position:absolute;top:12px;right:12px;z-index:10;width:32px;height:32px;background:rgba(255,255,255,0.9);backdrop-filter:blur(4px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:none;cursor:pointer;transition:transform 0.2s;}
        .lyra-wish-btn:hover{transform:scale(1.15);}
        .lyra-card-img{height:208px;overflow:hidden;background:linear-gradient(to bottom,#f8fafc,#f1f5f9);}
        @media(min-width:640px){.lyra-card-img{height:240px;}}
        .lyra-card-brand{font-size:10px;font-weight:600;color:#a78bfa;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;}
        .lyra-disc-tag{font-size:10px;font-weight:600;color:#059669;background:#ecfdf5;padding:2px 8px;border-radius:8px;}
        .lyra-card-atc{width:100%;margin-top:12px;padding:8px 0;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;font-size:10px;font-weight:600;border-radius:12px;border:none;cursor:pointer;opacity:0;transform:translateY(-4px);transition:all 0.3s;}
        .lyra-card:hover .lyra-card-atc{opacity:1;transform:translateY(0);}
        @media(min-width:640px){.lyra-card-atc{font-size:12px;padding:10px 0;}}

        /* ── Profile Panel ── */
        .lyra-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(4px);z-index:998;}
        .lyra-profile-panel{position:fixed;top:0;right:0;bottom:0;width:320px;background:white;z-index:999;display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(15,5,30,0.25);overflow:hidden;}
        @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        .slide-in-right{animation:slideInRight 0.32s cubic-bezier(0.16,1,0.3,1) forwards;}
        .lpp-header{background:linear-gradient(145deg,#0f0820 0%,#1e0a3c 45%,#2d1060 100%);padding:28px 20px 24px;display:flex;align-items:flex-start;gap:14px;position:relative;flex-shrink:0;}
        .lpp-avatar-ring{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);padding:2px;flex-shrink:0;}
        .lpp-avatar{width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#1e0a3c,#4c1d95);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:white;letter-spacing:0.05em;}
        .lpp-header-info{flex:1;min-width:0;}
        .lpp-name{color:white;font-size:15px;font-weight:600;margin:0 0 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .lpp-contact{color:rgba(216,180,254,0.6);font-size:11px;margin:0 0 8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .lpp-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.35);color:#d8b4fe;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:0.08em;text-transform:uppercase;}
        .lpp-close{position:absolute;top:16px;right:16px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.08);border:none;color:rgba(255,255,255,0.5);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
        .lpp-close:hover{background:rgba(255,255,255,0.18);color:white;}
        /* Stats row */
        .lpp-stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #f1f5f9;flex-shrink:0;}
        .lpp-stat{display:flex;flex-direction:column;align-items:center;padding:14px 8px;gap:2px;}
        .lpp-stat:not(:last-child){border-right:1px solid #f1f5f9;}
        .lpp-stat-num{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:#1e0a3c;line-height:1;}
        .lpp-stat-lbl{font-size:10px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;}
        /* Menu */
        .lpp-menu{flex:1;overflow-y:auto;padding:12px;}
        .lpp-item{width:100%;display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;border:none;background:transparent;cursor:pointer;transition:all 0.2s;text-align:left;margin-bottom:4px;}
        .lpp-item:hover{background:#faf5ff;}
        .lpp-item-icon{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;transition:transform 0.2s;}
        .lpp-item:hover .lpp-item-icon{transform:scale(1.1);}
        .lpp-item-text{flex:1;min-width:0;}
        .lpp-item-label{display:block;font-size:13px;font-weight:600;color:#1e1033;margin-bottom:1px;}
        .lpp-item-sub{display:block;font-size:11px;color:#94a3b8;}
        .lpp-item-arrow{color:#cbd5e1;font-size:18px;font-weight:300;flex-shrink:0;transition:transform 0.2s;}
        .lpp-item:hover .lpp-item-arrow{transform:translateX(3px);color:#7c3aed;}
        /* Footer */
        .lpp-footer{flex-shrink:0;padding:16px;border-top:1px solid #f1f5f9;}
        .lpp-logout{width:100%;padding:12px;border-radius:14px;background:#fef2f2;border:1px solid #fee2e2;color:#dc2626;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;}
        .lpp-logout:hover{background:#fee2e2;border-color:#fca5a5;}

        /* ── Avatar Button in navbar ── */
        .lyra-avatar-btn{display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;border-radius:24px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);cursor:pointer;transition:all 0.2s;}
        .lyra-avatar-btn:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.22);}
        .lyra-avatar-circle{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:white;letter-spacing:0.03em;flex-shrink:0;}
        .lyra-avatar-name{font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.04em;text-transform:uppercase;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .lyra-avatar-chevron{color:rgba(255,255,255,0.35);font-size:10px;margin-left:2px;}
      `}</style>

      <div className="lyra-body">

        {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
        <nav
          className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0c0618]/97 backdrop-blur-2xl shadow-2xl shadow-violet-950/40" : "bg-[#1e0a3c]"}`}
          onClick={() => setShowMenu(false)}
        >
          {/* Announcement bar */}
          <div className="bg-gradient-to-r from-[#1a0836] via-violet-800 to-[#1a0836] py-1.5 text-center border-b border-violet-800/20">
            <span className="shimmer-text text-[10px] sm:text-xs font-semibold tracking-[0.12em]">
              ✦ FREE DELIVERY ON ORDERS ABOVE ₹999 · NEW ARRIVALS EVERY FRIDAY · LYRA MEMBERS GET 10% OFF ✦
            </span>
          </div>

          {/* Logo + Search + Icons */}
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3 sm:gap-5 border-b border-white/[0.06]">

            {/* Hamburger (mobile) */}
            <button onClick={(e) => { e.stopPropagation(); setShowDrawer(true); }}
              className="lyra-mobile-hamburger flex-shrink-0 w-9 h-9 items-center justify-center text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <button onClick={() => { navigate("/dashboard"); setActiveTab("All"); setActiveBrand(null); }}
              className="lyra-serif text-xl sm:text-2xl tracking-[0.35em] text-white flex-shrink-0 select-none hover:opacity-90 transition-opacity">
              LY<span className="text-pink-400">R</span>A
              <sup className="text-white/20 ml-0.5 hidden sm:inline" style={{ fontSize:"7px", letterSpacing:"0.4em", verticalAlign:"top", marginTop:"6px" }}>FASHION</sup>
            </button>

            {/* ─── Premium search trigger (desktop) — click opens SearchOverlay ─── */}
            <button className="lyra-search-trigger hidden sm:flex" onClick={openSearch}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ color:"rgba(255,255,255,0.25)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <span className="lyra-search-trigger-text">Search fashion, footwear, beauty…</span>
              <span className="lyra-search-kbd">⌘ K</span>
            </button>

            {/* Icon group */}
            <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">

              {/* ── Mobile search icon → opens full-screen overlay ── */}
              <button onClick={openSearch}
                className="sm:hidden flex items-center justify-center w-9 h-9 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>

              {/* Wishlist */}
              <button onClick={() => navigate("/wishlist")}
                className="relative flex flex-col items-center px-2 sm:px-3 py-1.5 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
                <svg className="w-5 h-5" fill={wishlistCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:block mt-0.5 text-white/35 text-[9px] tracking-wider">WISHLIST</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ fontSize:"8px" }}>{wishlistCount}</span>
                )}
              </button>

              {/* Cart */}
              <button onClick={() => navigate("/cart")}
                className="relative flex flex-col items-center px-2 sm:px-3 py-1.5 text-white/55 hover:text-white hover:bg-white/8 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:block mt-0.5 text-white/35 text-[9px] tracking-wider">CART</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ fontSize:"8px" }}>{cartCount}</span>
                )}
              </button>

              {/* ── Premium Avatar Button → opens Profile Panel ── */}
              <div onClick={(e) => e.stopPropagation()}>
                <button onClick={handleOpenMenu} className="lyra-avatar-btn ml-1">
                  <div className="lyra-avatar-circle">{initials}</div>
                  <span className="lyra-avatar-name hidden sm:block">{firstName}</span>
                  <svg className="lyra-avatar-chevron w-3 h-3 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mega nav — renders once categories are loaded from API */}
          {categories.length > 0 && <MegaNav categories={categories} navigate={navigate} />}
        </nav>

        {/* ─── Keyboard shortcut ⌘K / Ctrl+K opens search ─── */}
        {React.useEffect(() => {
          const handler = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); } };
          window.addEventListener("keydown", handler);
          return () => window.removeEventListener("keydown", handler);
        }, [])}

        {/* ─── SEARCH OVERLAY ─── */}
        <SearchOverlay
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onAddToCart={setModalProduct}
        />

        {/* ── PROFILE PANEL (slide-in right) ── */}
        {showMenu && (
          <ProfilePanel
            user={user}
            onClose={() => setShowMenu(false)}
            navigate={navigate}
            handleLogout={handleLogout}
            orderCount={orderCount}
            wishlistCount={wishlistItems.length}
            rewardPoints={rewardPoints}
            statsLoading={statsLoading}
          />
        )}


        {/* Mobile drawer */}
        <MobileDrawer
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          navigate={navigate}
          user={user}
          handleLogout={handleLogout}
          categories={categories}
        />

        {/* ═══════════════════════ PAGE BODY ═══════════════════════ */}
        <div onClick={() => setShowMenu(false)}>

          {/* Hero */}
          {!heroLoading && heroSlides.length > 0 && (
            <CinematicHero
              slide={heroSlides[safeIdx]}
              currentIndex={safeIdx}
              total={heroSlides.length}
              onDotClick={setCurrent}
              onShopClick={() => scrollTo(shopRef)}
            />
          )}

          {/* Editorial strip */}
          {!heroLoading && <EditorialStrip onShopClick={() => scrollTo(shopRef)} />}

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

            {/* Trust badges */}
            <div className="lyra-trust-grid mb-10 sm:mb-14">
              {[
                { icon:"🚚", title:"Free Delivery",   sub:"On orders above ₹999",  from:"from-violet-600", to:"to-purple-600" },
                { icon:"↩",  title:"30-Day Returns",  sub:"Hassle-free exchanges",  from:"from-teal-600",   to:"to-cyan-500"   },
                { icon:"🔒", title:"Secure Payments", sub:"100% safe & encrypted",  from:"from-amber-500",  to:"to-orange-500" },
                { icon:"⭐", title:"Lyra Rewards",    sub:"Earn on every purchase", from:"from-pink-600",   to:"to-rose-500"   },
              ].map((o) => (
                <div key={o.title} className={`bg-gradient-to-r ${o.from} ${o.to} rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-all duration-300 shadow cursor-pointer`}>
                  <span className="text-2xl sm:text-3xl">{o.icon}</span>
                  <div>
                    <p className="lyra-serif text-white font-semibold text-sm sm:text-base">{o.title}</p>
                    <p className="text-white/70 text-[11px] sm:text-xs mt-0.5">{o.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Category showcase */}
            {showcaseCats.length > 0 && (
              <div className="mb-12 sm:mb-16">
                <div className="flex items-end justify-between mb-5 sm:mb-7">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-violet-400 uppercase mb-1.5">✦ All Categories</p>
                    <h2 className="lyra-serif text-3xl sm:text-4xl text-gray-900">Shop by <span className="text-violet-600">World</span></h2>
                  </div>
                  <button className="text-xs sm:text-sm text-violet-600 font-semibold hover:underline">View All →</button>
                </div>
                {/* Row 1 — 4 tall editorial cards */}
                <div className="lyra-showcase-top mb-3 sm:mb-4">
                  {showcaseCats.slice(0, 4).map((cat) => (
                    <div key={cat.label} onClick={() => navigate(cat.route)}
                      className="relative overflow-hidden rounded-2xl cursor-pointer group"
                      style={{ height:"clamp(180px,22vw,280px)" }}>
                      <img src={cat.img} alt={cat.label}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.target.parentElement.style.background="linear-gradient(135deg,#1e0a3c,#7c3aed)"; e.target.style.display="none"; }} />
                      <div className="absolute inset-0"
                        style={{ background:"linear-gradient(to top,rgba(10,3,25,0.85) 0%,rgba(10,3,25,0.25) 55%,transparent 100%)" }} />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                        <p className="lyra-serif text-white text-lg sm:text-2xl font-light leading-none mb-1">{cat.label}</p>
                        <p className="text-white/50 text-[10px] sm:text-xs font-medium tracking-wide hidden sm:block">{cat.sub}</p>
                        <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span className="text-[10px] sm:text-xs font-bold text-white bg-violet-600 px-2 sm:px-3 py-1 rounded-full">Shop Now</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Row 2 — 4 horizontal mini cards */}
                <div className="lyra-showcase-bottom">
                  {showcaseCats.slice(4, 8).map((cat) => (
                    <div key={cat.label} onClick={() => navigate(cat.route)}
                      className="relative overflow-hidden rounded-2xl cursor-pointer group bg-white border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 flex"
                      style={{ height:"90px" }}>
                      <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden">
                        <img src={cat.img} alt={cat.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          style={{ maskImage:"linear-gradient(to right,transparent 0%,black 40%)", WebkitMaskImage:"linear-gradient(to right,transparent 0%,black 40%)" }}
                          onError={(e) => { e.target.style.display="none"; }} />
                      </div>
                      <div className="relative z-10 p-3 sm:p-4 flex flex-col justify-center flex-1">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm">{cat.label}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5 leading-tight hidden sm:block">{cat.sub}</p>
                        <span className="mt-1.5 text-[10px] font-bold text-violet-600 tracking-wide">Explore →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flash sale countdown */}
            <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5 mb-10 sm:mb-12 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 shadow-lg"
              style={{ background:"linear-gradient(135deg,#1e0a3c,#4c1d95,#6d28d9)" }}>
              <div className="flex-1 min-w-0">
                <h3 className="lyra-serif text-white text-xl sm:text-2xl">Flash Sale</h3>
                <p className="text-white/40 text-xs mt-0.5 hidden sm:block">Limited quantities — ends soon</p>
              </div>
              <span className="bg-pink-500 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full animate-pulse">⚡ LIVE</span>
              <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                {[[countdown.h,"HRS"],[countdown.m,"MIN"],[countdown.s,"SEC"]].map(([n, l], i) => (
                  <React.Fragment key={l}>
                    {i > 0 && <span className="text-violet-400 font-bold text-sm">:</span>}
                    <div className="bg-white/10 border border-white/10 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-center min-w-[40px] sm:min-w-[48px]">
                      <span className="lyra-serif text-white font-bold text-lg sm:text-xl block">{n}</span>
                      <span className="text-white/30 text-[7px] sm:text-[8px] uppercase tracking-widest">{l}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <BrandScrollBar onBrandClick={handleBrand} />

            {/* Deals products */}
            {dealsProducts.length > 0 && (
              <div className="mb-10 sm:mb-14">
                <div className="flex items-end justify-between mb-4 sm:mb-6">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-pink-400 uppercase mb-1">✦ Limited Time</p>
                    <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Best <span className="text-pink-600">Deals</span></h2>
                  </div>
                  <button className="text-xs sm:text-sm text-violet-600 font-semibold hover:underline">View All Deals →</button>
                </div>
                <div className="lyra-products-grid">
                  {dealsProducts.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}
                </div>
              </div>
            )}


            {/* Main product grid */}
            <section ref={shopRef} id="shop">
              <div className="flex items-center justify-between mb-5 sm:mb-7">
                <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">
                  {activeBrand
                    ? <>{activeBrand} <span className="text-violet-600">Collection</span></>
                    : <>New <span className="text-violet-600">Arrivals</span></>}
                </h2>
                <div className="flex items-center gap-2 sm:gap-3">
                  {activeBrand && (
                    <button onClick={() => setActiveBrand(null)} className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full hover:bg-violet-200 transition-colors">
                      {activeBrand} <span className="font-bold">×</span>
                    </button>
                  )}
                  <button className="text-xs sm:text-sm text-violet-600 font-medium hover:underline">View All →</button>
                </div>
              </div>
              {filtered.length > 0 ? (
                <div className="lyra-products-grid">
                  {filtered.map((p) => <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="lyra-products-grid">
                  {Array.from({ length:10 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                      <div className="h-52 sm:h-60 bg-slate-50" />
                      <div className="p-4 space-y-2">
                        <div className="h-2 bg-gray-100 rounded w-1/3" />
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 sm:py-24 bg-white rounded-3xl border border-slate-100">
                  <p className="text-4xl sm:text-5xl mb-4">🔍</p>
                  <p className="lyra-serif text-xl text-gray-700 mb-2">No products found</p>
                  <button onClick={() => { setSearch(""); setActiveBrand(null); setActiveTab("All"); }}
                    className="mt-5 text-sm text-violet-600 font-medium hover:underline">Clear filters</button>
                </div>
              )}
            </section>

            {/* Explore collections strip */}
            <div className="mt-14 sm:mt-20 mb-10">
              <div className="flex items-end justify-between mb-5 sm:mb-7">
                <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">Explore <span className="text-violet-600">Collections</span></h2>
              </div>
              <div className="lyra-editorial-grid">
                {categories.slice(0, 4).map((cat, i) => {
                  const overlays = ["#5b21b6","#9d174d","#1f2937","#78350f"];
                  const badges   = ["New Arrivals","Editor Picks","Best Sellers","Luxury Picks"];
                  return (
                    <div key={cat._id || cat.slug}
                      onClick={() => navigate(`/category/${encodeURIComponent(cat.slug || cat.name)}`)}
                      className="relative rounded-2xl overflow-hidden cursor-pointer group shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      style={{ height:"clamp(140px,16vw,220px)" }}>
                      <img src={cat.featuredImg || SHOWCASE_IMGS[cat.slug] || ""}
                        alt={cat.label || cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display="none"; }} />
                      <div className="absolute inset-0 opacity-80"
                        style={{ background:`linear-gradient(to top,${overlays[i]},transparent 65%)` }} />
                      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5">
                        <span className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-1">{badges[i] || "Collection"}</span>
                        <p className="lyra-serif text-white font-light text-base sm:text-xl leading-tight">{cat.label || cat.name}</p>
                        <span className="text-white/45 text-[10px] sm:text-xs mt-1 group-hover:text-white transition-colors">Shop now →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <LyraFooter />
        {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
      </div>
    </div>
  );
};

export default Dashboard;