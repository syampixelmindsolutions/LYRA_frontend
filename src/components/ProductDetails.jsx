// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { ALL_PRODUCTS } from "./productsData.js";
// import { useCart } from "./CartContext";
// import { useWishlist } from "./WishlistContext";

// const REVIEWS_DATA = [
//   { id: 1, name: "Priya S.",    avatar: "P", rating: 5, date: "12 Jan 2025", comment: "Absolutely love this! The quality is outstanding and fits perfectly. Will definitely buy again." },
//   { id: 2, name: "Rahul M.",   avatar: "R", rating: 4, date: "8 Feb 2025",  comment: "Great product, very well made. Delivery was fast too. Slightly pricey but worth every rupee." },
//   { id: 3, name: "Aisha K.",   avatar: "A", rating: 5, date: "3 Mar 2025",  comment: "Exactly as described. The material feels premium and the sizing is accurate. Highly recommend!" },
//   { id: 4, name: "Vikram T.",  avatar: "V", rating: 4, date: "20 Mar 2025", comment: "Good quality product. Looks even better in person than in the photos." },
// ];

// const Stars = ({ rating, size = "sm" }) => (
//   <span className={`text-amber-400 ${size === "lg" ? "text-xl" : "text-sm"}`}>
//     {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
//   </span>
// );

// const ProductDetails = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const { addToCart, cartCount } = useCart();
//   const { toggleWishlist, isWishlisted } = useWishlist();

//   const product = ALL_PRODUCTS.find((p) => p.id === Number(productId));
//   const wishlisted = product ? isWishlisted(product.id) : false;

//   const [selectedImage,  setSelectedImage]  = useState(0);
//   const [selectedSize,   setSelectedSize]   = useState("");
//   const [selectedColor,  setSelectedColor]  = useState("");
//   const [quantity,       setQuantity]       = useState(1);
//   const [addedToCart,    setAddedToCart]    = useState(false);
//   const [activeTab,      setActiveTab]      = useState("description");
//   const [pincode,        setPincode]        = useState("");
//   const [pincodeMsg,     setPincodeMsg]     = useState("");

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     if (product) {
//       setSelectedColor(product.colors[0]);
//       setSelectedSize(product.sizes[0]);
//     }
//   }, [product]);

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
//         <p className="text-5xl">🔍</p>
//         <p className="font-serif text-2xl text-gray-700">Product not found</p>
//         <button onClick={() => navigate("/dashboard")} className="px-6 py-2 bg-violet-600 text-white rounded-xl text-sm">
//           Go Home
//         </button>
//       </div>
//     );
//   }

//   const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
//   const related  = ALL_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

//   const handleAddToCart = () => {
//     if (!selectedSize)  return;
//     if (!selectedColor) return;
//     addToCart(product, selectedSize, selectedColor, quantity);
//     setAddedToCart(true);
//     setTimeout(() => setAddedToCart(false), 2500);
//   };

//   const checkPincode = () => {
//     if (pincode.length !== 6) { setPincodeMsg("Enter a valid 6-digit pincode"); return; }
//     setPincodeMsg("✓ Delivery available by " + new Date(Date.now() + 3 * 86400000).toDateString());
//   };

//   const COLOR_MAP = {
//     Black: "#111", White: "#fff", Navy: "#1e3a5f", Grey: "#9ca3af",
//     Blue: "#3b82f6", Red: "#ef4444", Brown: "#92400e", Beige: "#d6c5a3",
//     Gold: "#f59e0b", Silver: "#c0c0c0", Pink: "#ec4899", Green: "#22c55e",
//     Khaki: "#a3885a", Tan: "#c5956a", Cream: "#f5f0e8", Olive: "#65a30d",
//     "Rose Gold": "#d4a0a0", White_: "#f9fafb",
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">

//       {/* ── TOPBAR ── */}
//       <div className="sticky top-0 z-50 bg-[#1e0a3c] shadow-lg shadow-purple-900/30 flex items-center gap-4 px-6 h-14">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
//         >
//           ← Back
//         </button>
//         <span className="font-serif text-base text-purple-200 tracking-wide truncate">{product.name}</span>
//         <div className="ml-auto flex gap-2">
//           <button
//             onClick={() => toggleWishlist(product)}
//             className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all"
//             style={{ color: wishlisted ? "#ef4444" : "rgba(255,255,255,0.6)" }}
//           >
//             {wishlisted ? "♥" : "♡"}
//           </button>
//           <button
//             onClick={() => navigate("/cart")}
//             className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60 relative"
//           >
//             🛒
//             {cartCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
//                 {cartCount}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ── BREADCRUMB ── */}
//       <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
//         <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
//         <span>›</span>
//         <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}>
//           {product.category}
//         </span>
//         <span>›</span>
//         <span className="text-gray-700 font-medium truncate">{product.name}</span>
//       </div>

//       <div className="max-w-screen-xl mx-auto px-4 py-8">

//         {/* ══ MAIN PRODUCT SECTION ══ */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

//           {/* ── LEFT: Images ── */}
//           <div className="flex gap-4">

//             {/* Thumbnail column */}
//             <div className="flex flex-col gap-3 w-20 flex-shrink-0">
//               {product.images.map((img, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setSelectedImage(i)}
//                   className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-violet-500 shadow-md shadow-violet-100" : "border-gray-100 hover:border-violet-200"}`}
//                 >
//                   <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover"
//                     onError={(e) => { e.target.src = "https://placehold.co/80x80/f3f4f6/9ca3af?text=L"; }} />
//                 </button>
//               ))}
//             </div>

//             {/* Main image */}
//             <div className="flex-1 relative">
//               {product.badge && (
//                 <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
//                   {product.badge}
//                 </span>
//               )}
//               <button
//                 onClick={() => toggleWishlist(product)}
//                 className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xl hover:scale-110 transition-transform"
//                 style={{ color: wishlisted ? "#ef4444" : "#d1d5db" }}
//               >
//                 {wishlisted ? "♥" : "♡"}
//               </button>
//               <div className="bg-purple-50 rounded-2xl overflow-hidden aspect-square">
//                 <img
//                   src={product.images[selectedImage]}
//                   alt={product.name}
//                   className="w-full h-full object-cover transition-all duration-300"
//                   onError={(e) => { e.target.src = "https://placehold.co/600x600/f3f4f6/9ca3af?text=Lyra"; }}
//                 />
//               </div>

//               {/* Image nav arrows */}
//               <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full px-2 pointer-events-none">
//                 <button
//                   className="w-8 h-8 bg-white/80 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-white pointer-events-auto transition-all"
//                   onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
//                 >‹</button>
//                 <button
//                   className="w-8 h-8 bg-white/80 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-white pointer-events-auto transition-all"
//                   onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
//                 >›</button>
//               </div>
//             </div>
//           </div>

//           {/* ── RIGHT: Product Info ── */}
//           <div className="flex flex-col gap-5">

//             {/* Brand & Name */}
//             <div>
//               <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">{product.brand}</p>
//               <h1 className="font-serif text-3xl font-light text-gray-900 leading-tight mb-2">{product.name}</h1>
//               <p className="text-xs text-gray-400 uppercase tracking-wider">SKU: {product.sku}</p>
//             </div>

//             {/* Rating */}
//             <div className="flex items-center gap-3">
//               <Stars rating={product.rating} size="lg" />
//               <span className="text-lg font-semibold text-gray-700">{product.rating}</span>
//               <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
//               <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
//             </div>

//             {/* Price */}
//             <div className="flex items-end gap-4 pb-5 border-b border-purple-50">
//               <span className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
//               <div className="flex flex-col">
//                 <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
//                 <span className="text-sm font-bold text-green-600">{discount}% OFF</span>
//               </div>
//               <span className="text-xs text-gray-400 self-end mb-0.5">Inclusive of all taxes</span>
//             </div>

//             {/* Color Selection */}
//             <div>
//               <p className="text-sm font-semibold text-gray-700 mb-3">
//                 Color: <span className="text-violet-600 font-bold">{selectedColor}</span>
//               </p>
//               <div className="flex gap-3 flex-wrap">
//                 {product.colors.map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => setSelectedColor(c)}
//                     title={c}
//                     className={`w-9 h-9 rounded-full transition-all hover:scale-110 ${selectedColor === c ? "ring-2 ring-violet-600 ring-offset-2 scale-110" : "ring-1 ring-gray-200"}`}
//                     style={{
//                       background: COLOR_MAP[c] || "#ccc",
//                       border: c === "White" ? "1px solid #e5e7eb" : "none",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Size Selection */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-semibold text-gray-700">
//                   Size: <span className="text-violet-600 font-bold">{selectedSize}</span>
//                 </p>
//                 <button className="text-xs text-violet-500 hover:underline">Size Guide →</button>
//               </div>
//               <div className="flex gap-2 flex-wrap">
//                 {product.sizes.map((s) => (
//                   <button
//                     key={s}
//                     onClick={() => setSelectedSize(s)}
//                     className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
//                       selectedSize === s
//                         ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200"
//                         : "border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600"
//                     }`}
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//               {!selectedSize && (
//                 <p className="text-xs text-red-500 mt-1">Please select a size</p>
//               )}
//             </div>

//             {/* Quantity */}
//             <div className="flex items-center gap-4">
//               <p className="text-sm font-semibold text-gray-700">Quantity:</p>
//               <div className="flex items-center border-2 border-purple-100 rounded-xl overflow-hidden">
//                 <button
//                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                   className="w-10 h-10 flex items-center justify-center text-xl text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
//                 >−</button>
//                 <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity((q) => Math.min(10, q + 1))}
//                   className="w-10 h-10 flex items-center justify-center text-xl text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
//                 >+</button>
//               </div>
//               <span className="text-xs text-gray-400">Max 10 per order</span>
//             </div>

//             {/* CTA Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={handleAddToCart}
//                 className={`flex-1 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all ${
//                   addedToCart
//                     ? "bg-green-500 text-white shadow-lg shadow-green-200"
//                     : selectedSize
//                     ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5"
//                     : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 {addedToCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
//               </button>
//               <button className="flex-1 py-4 rounded-2xl text-sm font-bold tracking-wide border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-all hover:-translate-y-0.5">
//                 ⚡ Buy Now
//               </button>
//             </div>

//             {/* Delivery Check */}
//             <div className="bg-purple-50 rounded-2xl p-4">
//               <p className="text-sm font-semibold text-gray-700 mb-3">🚚 Check Delivery</p>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   maxLength={6}
//                   value={pincode}
//                   onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setPincodeMsg(""); }}
//                   placeholder="Enter pincode"
//                   className="flex-1 px-4 py-2.5 rounded-xl border border-purple-200 text-sm outline-none focus:border-violet-500 bg-white"
//                 />
//                 <button
//                   onClick={checkPincode}
//                   className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
//                 >
//                   Check
//                 </button>
//               </div>
//               {pincodeMsg && (
//                 <p className={`text-xs mt-2 font-medium ${pincodeMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
//                   {pincodeMsg}
//                 </p>
//               )}
//             </div>

//             {/* Trust badges */}
//             <div className="grid grid-cols-3 gap-3">
//               {[
//                 { icon: "↩", label: "30-Day Returns" },
//                 { icon: "🔒", label: "Secure Payment" },
//                 { icon: "✓",  label: "Genuine Product" },
//               ].map((b) => (
//                 <div key={b.label} className="flex flex-col items-center gap-1 bg-white rounded-xl py-3 px-2 border border-purple-50 text-center">
//                   <span className="text-xl">{b.icon}</span>
//                   <span className="text-xs text-gray-500 font-medium">{b.label}</span>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>

//         {/* ══ TABS: Description / Details / Reviews ══ */}
//         <div className="bg-white rounded-2xl border border-purple-100 mb-16 overflow-hidden">

//           {/* Tab headers */}
//           <div className="flex border-b border-purple-50">
//             {["description", "details", "reviews"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-8 py-4 text-sm font-semibold capitalize tracking-wide transition-all border-b-2 ${
//                   activeTab === tab
//                     ? "border-violet-600 text-violet-700 bg-violet-50"
//                     : "border-transparent text-gray-500 hover:text-violet-600 hover:bg-violet-50/50"
//                 }`}
//               >
//                 {tab === "reviews" ? `Reviews (${product.reviews.toLocaleString()})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Tab content */}
//           <div className="p-8">

//             {/* Description */}
//             {activeTab === "description" && (
//               <div className="max-w-2xl">
//                 <p className="text-gray-600 leading-relaxed text-sm mb-6">{product.description}</p>
//                 <div className="grid grid-cols-2 gap-4">
//                   {[
//                     { label: "Brand",    value: product.brand },
//                     { label: "Category", value: product.category },
//                     { label: "Gender",   value: product.gender },
//                     { label: "SKU",      value: product.sku },
//                   ].map((d) => (
//                     <div key={d.label} className="flex gap-3">
//                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">{d.label}</span>
//                       <span className="text-sm text-gray-700 font-medium">{d.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Details */}
//             {activeTab === "details" && (
//               <div className="max-w-2xl space-y-4">
//                 {[
//                   { label: "Material",      value: product.material },
//                   { label: "Care",          value: product.care },
//                   { label: "Available Sizes", value: product.sizes.join(", ") },
//                   { label: "Available Colors", value: product.colors.join(", ") },
//                   { label: "SKU",           value: product.sku },
//                 ].map((d) => (
//                   <div key={d.label} className="flex gap-4 py-3 border-b border-purple-50 last:border-0">
//                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-36 flex-shrink-0 pt-0.5">{d.label}</span>
//                     <span className="text-sm text-gray-700">{d.value}</span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Reviews */}
//             {activeTab === "reviews" && (
//               <div>
//                 {/* Rating summary */}
//                 <div className="flex items-center gap-8 mb-8 pb-8 border-b border-purple-50">
//                   <div className="text-center">
//                     <p className="font-serif text-6xl font-light text-gray-900">{product.rating}</p>
//                     <Stars rating={product.rating} size="lg" />
//                     <p className="text-xs text-gray-400 mt-1">{product.reviews.toLocaleString()} reviews</p>
//                   </div>
//                   <div className="flex-1 space-y-2">
//                     {[5,4,3,2,1].map((star) => {
//                       const pct = star === 5 ? 62 : star === 4 ? 23 : star === 3 ? 10 : star === 2 ? 3 : 2;
//                       return (
//                         <div key={star} className="flex items-center gap-3">
//                           <span className="text-xs text-gray-500 w-4">{star}★</span>
//                           <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
//                             <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
//                           </div>
//                           <span className="text-xs text-gray-400 w-8">{pct}%</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Review list */}
//                 <div className="space-y-6">
//                   {REVIEWS_DATA.map((r) => (
//                     <div key={r.id} className="flex gap-4">
//                       <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
//                         {r.avatar}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-3 mb-1">
//                           <span className="font-semibold text-sm text-gray-800">{r.name}</span>
//                           <Stars rating={r.rating} />
//                           <span className="text-xs text-gray-400">{r.date}</span>
//                         </div>
//                         <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ══ RELATED PRODUCTS ══ */}
//         {related.length > 0 && (
//           <div>
//             <h2 className="font-serif text-2xl text-gray-900 mb-6">
//               You may also <span className="text-violet-600">like</span>
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               {related.map((p) => {
//                 const disc = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
//                 return (
//                   <div
//                     key={p.id}
//                     onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0,0); }}
//                     className="bg-white rounded-2xl border border-purple-100 overflow-hidden cursor-pointer hover:border-violet-300 hover:shadow-lg hover:shadow-purple-100 hover:-translate-y-1 transition-all duration-300 group"
//                   >
//                     <div className="h-48 overflow-hidden bg-purple-50">
//                       <img src={p.images[0]} alt={p.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         onError={(e) => { e.target.src = "https://placehold.co/300x300/f3f4f6/9ca3af?text=Lyra"; }} />
//                     </div>
//                     <div className="p-3">
//                       <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{p.brand}</p>
//                       <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
//                       <div className="flex items-center gap-2 mt-2">
//                         <span className="font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
//                         <span className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
//                         <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{disc}% off</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── STICKY BOTTOM BAR (mobile) ── */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 px-4 py-3 flex gap-3 lg:hidden z-50 shadow-xl">
//         <button
//           onClick={handleAddToCart}
//           className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
//             addedToCart ? "bg-green-500 text-white" : "bg-gradient-to-r from-violet-600 to-purple-500 text-white"
//           }`}
//         >
//           {addedToCart ? "✓ Added!" : "Add to Cart"}
//         </button>
//         <button className="flex-1 py-3 rounded-xl text-sm font-bold border-2 border-violet-600 text-violet-600">
//           Buy Now
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ProductDetails;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

// ── API base — change this to your backend URL ──────────────────────
const API_BASE = "http://localhost:6055/api";

// ── Fallback: local product data if API not ready ───────────────────
// Once your API is live, remove this import entirely
import { ALL_PRODUCTS } from "./productsData.js";

// ── Color map for swatches ──────────────────────────────────────────
const COLOR_MAP = {
  Black: "#111", White: "#fff", Navy: "#1e3a5f", Grey: "#9ca3af",
  Blue: "#3b82f6", Red: "#ef4444", Brown: "#92400e", Beige: "#d6c5a3",
  Gold: "#f59e0b", Silver: "#c0c0c0", Pink: "#ec4899", Green: "#22c55e",
  Khaki: "#a3885a", Tan: "#c5956a", Cream: "#f5f0e8", Olive: "#65a30d",
  "Rose Gold": "#d4a0a0", Yellow: "#facc15", Floral: "#f9a8d4",
  Tortoise: "#7c5a2a", Natural: "#e5d5b0", Nude: "#d4a897",
};

const Stars = ({ rating, size = "sm" }) => (
  <span className={`text-amber-400 ${size === "lg" ? "text-xl" : "text-sm"}`}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
  </span>
);

// ── Skeleton loader ─────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate      = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.includes(product._id)
        ? prev.filter((id) => id !== product._id)
        : [...prev, product._id]
    );
  };

  const isWishlisted = (id) => wishlist.includes(id);

  const addToCart = () => {
    setCartCount((c) => c + 1);
  };
  

  // ── State ──────────────────────────────────────────────────────────
  const [product,       setProduct]       = useState(null);
  const [reviews,       setReviews]       = useState([]);
  const [related,       setRelated]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [reviewsLoading,setReviewsLoading]= useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize,  setSelectedSize]  = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity,      setQuantity]      = useState(1);
  const [addedToCart,   setAddedToCart]   = useState(false);
  const [activeTab,     setActiveTab]     = useState("description");
  const [pincode,       setPincode]       = useState("");
  const [pincodeMsg,    setPincodeMsg]    = useState("");
  
  

  const wishlisted = product ? isWishlisted(product._id || product.id) : false;

  // ── Fetch product ──────────────────────────────────────────────────
  // GET /api/products/:id
  // Expected response shape:
  // {
  //   _id, name, brand, category, price, originalPrice, rating, reviews,
  //   badge, sizes: [], colors: [], images: [], description,
  //   material, care, sku, gender
  // }
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:6055/api/admin/products");
        const data = await res.json();

        const p = data.find(
          (item) => item._id === productId
        );

        if (!p) throw new Error("Not found");

        // FIX images (your API format)
        const images =
          p.images?.[0]?.split(",").map((i) => i.trim()) || [];

        const formatted = {
          ...p,
          images,
        };

        setProduct(formatted);
        setSelectedColor(formatted.colors?.[0] || "");
        setSelectedSize(formatted.sizes?.[0] || "");

      } catch (err) {
        console.error(err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ── Fetch reviews ──────────────────────────────────────────────────
  // GET /api/products/:id/reviews
  // Expected response shape:
  // [ { _id, name, avatar, rating, date, comment }, ... ]
  // OR { reviews: [...] }
  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const id  = product._id || product.id;
        const res = await fetch(`${API_BASE}/products/${id}/reviews`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : (data.reviews || []));
      } catch {
        // Fallback stub reviews if API not ready
        setReviews([
          { _id: 1, name: "Priya S.",   avatar: "P", rating: 5, date: "12 Jan 2025", comment: "Absolutely love this! Outstanding quality and perfect fit." },
          { _id: 2, name: "Rahul M.",   avatar: "R", rating: 4, date: "8 Feb 2025",  comment: "Great product, very well made. Worth every rupee." },
          { _id: 3, name: "Aisha K.",   avatar: "A", rating: 5, date: "3 Mar 2025",  comment: "Exactly as described. Premium material, accurate sizing." },
          { _id: 4, name: "Vikram T.",  avatar: "V", rating: 4, date: "20 Mar 2025", comment: "Looks even better in person than in the photos." },
        ]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (activeTab === "reviews") fetchReviews();
  }, [product, activeTab]);

  // ── Fetch related products ─────────────────────────────────────────
  // GET /api/products?category=<category>&limit=4
  // Expected: array or { products: [...] }
  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        const id  = product._id || product.id;
        const res = await fetch(`${API_BASE}/products?category=${encodeURIComponent(product.category)}&limit=5`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const arr  = Array.isArray(data) ? data : (data.products || []);
        // Exclude current product
        setRelated(arr.filter((p) => String(p._id || p.id) !== String(id)).slice(0, 4));
      } catch {
        // Fallback to local data
        const local = ALL_PRODUCTS
          .filter((p) => p.category === product.category && String(p.id) !== String(productId))
          .slice(0, 4);
        setRelated(local);
      }
    };
    fetchRelated();
  }, [product]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const checkPincode = () => {
    if (pincode.length !== 6) { setPincodeMsg("Enter a valid 6-digit pincode"); return; }
    setPincodeMsg("✓ Delivery available by " + new Date(Date.now() + 3 * 86400000).toDateString());
  };

  // ── Loading state ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 bg-[#1e0a3c] h-14" />
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">🔍</p>
        <p className="font-serif text-2xl text-gray-700">{error || "Product not found"}</p>
        <button onClick={() => navigate("/dashboard")} className="px-6 py-2 bg-violet-600 text-white rounded-xl text-sm hover:bg-violet-700 transition-colors">
          Go Home
        </button>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.images?.length ? product.images : [product.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-50 bg-[#1e0a3c] shadow-lg shadow-purple-900/30 flex items-center gap-4 px-6 h-14">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
        >
          ← Back
        </button>
        <span className="font-serif text-base text-purple-200 tracking-wide truncate">{product.name}</span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => toggleWishlist(product)}
            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all"
            style={{ color: wishlisted ? "#ef4444" : "rgba(255,255,255,0.6)" }}
          >
            {wishlisted ? "♥" : "♡"}
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60 relative"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}>
          {product.category}
        </span>
        <span>›</span>
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">

        {/* ══ MAIN PRODUCT SECTION ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

          {/* ── LEFT: Images ── */}
          <div className="flex gap-4">
            {/* Thumbnail column */}
            {images.length > 1 && (
              <div className="flex flex-col gap-3 w-20 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-violet-500 shadow-md shadow-violet-100" : "border-gray-100 hover:border-violet-200"}`}
                  >
                    <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://placehold.co/80x80/f3f4f6/9ca3af?text=L"; }} />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xl hover:scale-110 transition-transform"
                style={{ color: wishlisted ? "#ef4444" : "#d1d5db" }}
              >
                {wishlisted ? "♥" : "♡"}
              </button>
              <div className="bg-purple-50 rounded-2xl overflow-hidden aspect-square">
                <img
                  src={images[selectedImage] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => { e.target.src = "https://placehold.co/600x600/f3f4f6/9ca3af?text=Lyra"; }}
                />
              </div>
              {/* Arrow nav */}
              {images.length > 1 && (
                <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full px-2 pointer-events-none">
                  <button
                    className="w-8 h-8 bg-white/80 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-white pointer-events-auto transition-all"
                    onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                  >‹</button>
                  <button
                    className="w-8 h-8 bg-white/80 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-white pointer-events-auto transition-all"
                    onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                  >›</button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col gap-5">

            {/* Brand & Name */}
            <div>
              <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">{product.brand}</p>
              <h1 className="font-serif text-3xl font-light text-gray-900 leading-tight mb-2">{product.name}</h1>
              {product.sku && <p className="text-xs text-gray-400 uppercase tracking-wider">SKU: {product.sku}</p>}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Stars rating={product.rating || 0} size="lg" />
              <span className="text-lg font-semibold text-gray-700">{product.rating || "—"}</span>
              <span className="text-sm text-gray-400">({(product.reviews || 0).toLocaleString()} reviews)</span>
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 pb-5 border-b border-purple-50">
              <span className="text-4xl font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
              {product.originalPrice && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  {discount > 0 && <span className="text-sm font-bold text-green-600">{discount}% OFF</span>}
                </div>
              )}
              <span className="text-xs text-gray-400 self-end mb-0.5">Inclusive of all taxes</span>
            </div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Color: <span className="text-violet-600 font-bold">{selectedColor}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      className={`w-9 h-9 rounded-full transition-all hover:scale-110 ${selectedColor === c ? "ring-2 ring-violet-600 ring-offset-2 scale-110" : "ring-1 ring-gray-200"}`}
                      style={{
                        background: COLOR_MAP[c] || "#ccc",
                        border: c === "White" ? "1px solid #e5e7eb" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">
                    Size: <span className="text-violet-600 font-bold">{selectedSize}</span>
                  </p>
                  <button className="text-xs text-violet-500 hover:underline">Size Guide →</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedSize === s
                          ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200"
                          : "border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {!selectedSize && <p className="text-xs text-red-500 mt-1">Please select a size</p>}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-gray-700">Quantity:</p>
              <div className="flex items-center border-2 border-purple-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                >−</button>
                <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                >+</button>
              </div>
              <span className="text-xs text-gray-400">Max 10 per order</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className={`flex-1 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all ${
                  addedToCart
                    ? "bg-green-500 text-white shadow-lg shadow-green-200"
                    : selectedSize
                    ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {addedToCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
              </button>
              <button className="flex-1 py-4 rounded-2xl text-sm font-bold tracking-wide border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-all hover:-translate-y-0.5">
                ⚡ Buy Now
              </button>
            </div>

            {/* Delivery Check */}
            <div className="bg-purple-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">🚚 Check Delivery</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setPincodeMsg(""); }}
                  placeholder="Enter pincode"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-purple-200 text-sm outline-none focus:border-violet-500 bg-white"
                />
                <button
                  onClick={checkPincode}
                  className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                  Check
                </button>
              </div>
              {pincodeMsg && (
                <p className={`text-xs mt-2 font-medium ${pincodeMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                  {pincodeMsg}
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "↩", label: "30-Day Returns" },
                { icon: "🔒", label: "Secure Payment" },
                { icon: "✓",  label: "Genuine Product" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 bg-white rounded-xl py-3 px-2 border border-purple-50 text-center">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-xs text-gray-500 font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ TABS: Description / Details / Reviews ══ */}
        <div className="bg-white rounded-2xl border border-purple-100 mb-16 overflow-hidden">
          {/* Tab headers */}
          <div className="flex border-b border-purple-50">
            {["description", "details", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-semibold capitalize tracking-wide transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-violet-600 text-violet-700 bg-violet-50"
                    : "border-transparent text-gray-500 hover:text-violet-600 hover:bg-violet-50/50"
                }`}
              >
                {tab === "reviews" ? `Reviews (${(product.reviews || 0).toLocaleString()})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* ── Description tab ── */}
            {activeTab === "description" && (
              <div className="max-w-2xl">
                <p className="text-gray-600 leading-relaxed text-sm mb-6">
                  {product.description || "No description available."}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Brand",    value: product.brand    },
                    { label: "Category", value: product.category },
                    { label: "Gender",   value: product.gender   },
                    { label: "SKU",      value: product.sku      },
                  ].filter((d) => d.value).map((d) => (
                    <div key={d.label} className="flex gap-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">{d.label}</span>
                      <span className="text-sm text-gray-700 font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Details tab ── */}
            {activeTab === "details" && (
              <div className="max-w-2xl space-y-4">
                {[
                  { label: "Material",         value: product.material },
                  { label: "Care",             value: product.care },
                  { label: "Available Sizes",  value: product.sizes?.join(", ") },
                  { label: "Available Colors", value: product.colors?.join(", ") },
                  { label: "SKU",              value: product.sku },
                ].filter((d) => d.value).map((d) => (
                  <div key={d.label} className="flex gap-4 py-3 border-b border-purple-50 last:border-0">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-36 flex-shrink-0 pt-0.5">{d.label}</span>
                    <span className="text-sm text-gray-700">{d.value}</span>
                  </div>
                ))}
                {!product.material && !product.care && (
                  <p className="text-sm text-gray-400">No product details available.</p>
                )}
              </div>
            )}

            {/* ── Reviews tab ── */}
            {activeTab === "reviews" && (
              <div>
                {/* Rating summary */}
                <div className="flex items-center gap-8 mb-8 pb-8 border-b border-purple-50">
                  <div className="text-center">
                    <p className="font-serif text-6xl font-light text-gray-900">{product.rating || "—"}</p>
                    <Stars rating={product.rating || 0} size="lg" />
                    <p className="text-xs text-gray-400 mt-1">{(product.reviews || 0).toLocaleString()} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 62 : star === 4 ? 23 : star === 3 ? 10 : star === 2 ? 3 : 2;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-4">{star}★</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review list */}
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((r) => (
                      <div key={r._id || r.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                          {r.avatar || (r.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-sm text-gray-800">{r.name}</span>
                            <Stars rating={r.rating} />
                            <span className="text-xs text-gray-400">{r.date || r.createdAt?.slice(0, 10)}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{r.comment || r.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ══ RELATED PRODUCTS ══ */}
        {related.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-gray-900 mb-6">
              You may also <span className="text-violet-600">like</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => {
                const disc = p.originalPrice
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;
                const thumb = p.images?.[0] || p.image;
                return (
                  <div
                    key={p._id || p.id}
                    onClick={() => { navigate(`/product/${p._id || p.id}`); window.scrollTo(0, 0); }}
                    className="bg-white rounded-2xl border border-purple-100 overflow-hidden cursor-pointer hover:border-violet-300 hover:shadow-lg hover:shadow-purple-100 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="h-48 overflow-hidden bg-purple-50">
                      <img src={thumb} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = "https://placehold.co/300x300/f3f4f6/9ca3af?text=Lyra"; }} />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{p.brand}</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="font-bold text-gray-900">₹{(p.price || 0).toLocaleString()}</span>
                        {p.originalPrice && <span className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>}
                        {disc > 0 && <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{disc}% off</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── STICKY BOTTOM BAR (mobile) ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 px-4 py-3 flex gap-3 lg:hidden z-50 shadow-xl">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            addedToCart ? "bg-green-500 text-white" : "bg-gradient-to-r from-violet-600 to-purple-500 text-white"
          }`}
        >
          {addedToCart ? "✓ Added!" : "Add to Cart"}
        </button>
        <button className="flex-1 py-3 rounded-xl text-sm font-bold border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-all">
          Buy Now
        </button>
      </div>

    </div>
  );
};

export default ProductDetails;