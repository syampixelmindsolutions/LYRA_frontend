// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useCart } from "./components/CartContext";
// import { useWishlist } from "./components/WishlistContext";
// import AddToCartModal from "./components/AddToCartModal";
// import axios from "axios";

// // ── API instances ─────────────────────────────────────────────────
// const AUTH_HEADER = () => {
//   const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const token = user.token || "";
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const ORDER_API   = axios.create({ baseURL: "http://localhost:6055/api/orders" });
// const ADDRESS_API = axios.create({ baseURL: "http://localhost:6055/api/addresses" });
// const USER_API    = axios.create({ baseURL: "http://localhost:6055/api/users" });

// [ORDER_API, ADDRESS_API, USER_API].forEach((api) => {
//   api.interceptors.request.use((config) => {
//     Object.assign(config.headers, AUTH_HEADER());
//     return config;
//   });
// });

// // ── Status styles ─────────────────────────────────────────────────
// const STATUS_STYLE = {
//   Delivered:  "text-green-700 bg-green-50 border border-green-200",
//   Shipped:    "text-blue-700 bg-blue-50 border border-blue-200",
//   Processing: "text-amber-700 bg-amber-50 border border-amber-200",
//   Pending:    "text-gray-600 bg-gray-50 border border-gray-200",
//   Cancelled:  "text-red-600 bg-red-50 border border-red-200",
// };

// const TABS = [
//   { id: "profile",   label: "My Profile",  icon: "👤" },
//   { id: "orders",    label: "My Orders",   icon: "📦" },
//   { id: "wishlist",  label: "Wishlist",    icon: "♥" },
//   { id: "addresses", label: "Addresses",   icon: "📍" },
// ];

// // ── Skeleton ──────────────────────────────────────────────────────
// const Skeleton = ({ className = "" }) => <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />;

// const ProfilePage = () => {
//   const navigate  = useNavigate();
//   const location  = useLocation();
//   const { cartCount } = useCart();
//   const { wishlistItems, removeFromWishlist } = useWishlist();

//   const [activeTab, setActiveTab] = useState(() => {
//     const p = new URLSearchParams(location.search);
//     return p.get("tab") || "profile";
//   });

//   // ── Auth ──────────────────────────────────────────────────────────
//   const [user, setUser] = useState({});

//   useEffect(() => {
//     const stored = sessionStorage.getItem("user");
//     if (!stored) { navigate("/"); return; }
//     setUser(JSON.parse(stored));
//   }, [navigate]);

//   const handleLogout = () => { sessionStorage.removeItem("user"); navigate("/"); };

//   // ══ PROFILE ══════════════════════════════════════════════════════
//   const [editMode,  setEditMode]  = useState(false);
//   const [editForm,  setEditForm]  = useState({});
//   const [savedMsg,  setSavedMsg]  = useState("");
//   const [profSaving,setProfSaving]= useState(false);

//   useEffect(() => {
//     setEditForm({
//       fullName: user.fullName || "",
//       email:    user.email    || "",
//       phone:    user.mobileNumber || user.phone || "",
//       gender:   user.gender   || "",
//     });
//   }, [user]);

//   // PUT /api/users/profile  or  PUT /api/users/me
//   const handleSaveProfile = async () => {
//     setProfSaving(true);
//     try {
//       const { data } = await USER_API.put("/profile", editForm);
//       const updated = data.user || data;
//       const newSession = { ...user, ...updated };
//       sessionStorage.setItem("user", JSON.stringify(newSession));
//       setUser(newSession);
//       setEditMode(false);
//       setSavedMsg("Profile updated successfully!");
//       setTimeout(() => setSavedMsg(""), 3000);
//     } catch (err) {
//       console.error("Profile update error:", err.response?.data || err.message);
//       // If endpoint not ready, update locally
//       const newSession = { ...user, ...editForm };
//       sessionStorage.setItem("user", JSON.stringify(newSession));
//       setUser(newSession);
//       setEditMode(false);
//       setSavedMsg("Profile updated!");
//       setTimeout(() => setSavedMsg(""), 3000);
//     } finally {
//       setProfSaving(false);
//     }
//   };

//   // ══ ORDERS ═══════════════════════════════════════════════════════
//   const [orders,        setOrders]        = useState([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [expandedOrder, setExpandedOrder] = useState(null);

//   const loadOrders = useCallback(async () => {
//     setOrdersLoading(true);
//     try {
//       // GET /api/orders/my  — returns orders for logged-in user
//       const { data } = await ORDER_API.get("/my");
//       setOrders(Array.isArray(data) ? data : data.orders || []);
//     } catch (err) {
//       console.error("Orders load error:", err.response?.data || err.message);
//       setOrders([]);
//     } finally {
//       setOrdersLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (activeTab === "orders") loadOrders();
//   }, [activeTab, loadOrders]);

//   // Cancel order: PATCH /api/orders/:id/cancel
//   const handleCancelOrder = async (orderId) => {
//     if (!window.confirm("Cancel this order?")) return;
//     try {
//       const { data } = await ORDER_API.patch(`/${orderId}/cancel`);
//       setOrders((prev) =>
//         prev.map((o) => (o._id || o.id) === orderId ? { ...o, status: "Cancelled", ...(data.order || {}) } : o)
//       );
//     } catch (err) {
//       console.error("Cancel order error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to cancel order.");
//     }
//   };

//   // ══ ADDRESSES ════════════════════════════════════════════════════
//   const [addresses,    setAddresses]    = useState([]);
//   const [addrLoading,  setAddrLoading]  = useState(false);
//   const [addrSaving,   setAddrSaving]   = useState(false);
//   const [showAddrForm, setShowAddrForm] = useState(false);
//   const [editingAddr,  setEditingAddr]  = useState(null);
//   const [addrForm,     setAddrForm]     = useState({ label: "Home", fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });

//   const loadAddresses = useCallback(async () => {
//     setAddrLoading(true);
//     try {
//       const { data } = await ADDRESS_API.get("");
//       setAddresses(Array.isArray(data) ? data : data.addresses || []);
//     } catch (err) {
//       console.error("Address load error:", err.response?.data || err.message);
//     } finally {
//       setAddrLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (activeTab === "addresses") loadAddresses();
//   }, [activeTab, loadAddresses]);

//   // POST /api/addresses
//   const handleSaveAddr = async () => {
//     if (!addrForm.fullName || !addrForm.street || !addrForm.city || !addrForm.pincode) return;
//     setAddrSaving(true);
//     try {
//       if (editingAddr) {
//         const id = editingAddr._id || editingAddr.id;
//         const { data } = await ADDRESS_API.put(`/${id}`, addrForm);
//         const updated = data.address || data;
//         setAddresses((prev) => prev.map((a) => (a._id || a.id) === id ? updated : a));
//       } else {
//         const { data } = await ADDRESS_API.post("", addrForm);
//         const newAddr = data.address || data;
//         setAddresses((prev) => [...prev, newAddr]);
//       }
//       setShowAddrForm(false);
//       setEditingAddr(null);
//       setAddrForm({ label: "Home", fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });
//     } catch (err) {
//       console.error("Save address error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to save address.");
//     } finally {
//       setAddrSaving(false);
//     }
//   };

//   // DELETE /api/addresses/:id
//   const handleDeleteAddr = async (id) => {
//     try {
//       await ADDRESS_API.delete(`/${id}`);
//       setAddresses((prev) => prev.filter((a) => (a._id || a.id) !== id));
//     } catch (err) {
//       console.error("Delete address error:", err.response?.data || err.message);
//     }
//   };

//   // PATCH /api/addresses/:id/default
//   const handleSetDefault = async (id) => {
//     try {
//       await ADDRESS_API.patch(`/${id}/default`);
//       setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: (a._id || a.id) === id, default: (a._id || a.id) === id })));
//     } catch (err) {
//       // Update locally if endpoint not ready
//       setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: (a._id || a.id) === id, default: (a._id || a.id) === id })));
//     }
//   };

//   // ══ WISHLIST ══════════════════════════════════════════════════════
//   const [modalProduct, setModalProduct] = useState(null);

//   // ── Computed ──────────────────────────────────────────────────────
//   const initials     = (user.fullName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
//   const totalSpent   = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + (o.total || 0), 0);

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">

//       {/* TOPBAR */}
//       <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
//         <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
//         <span className="font-serif text-base text-purple-200 tracking-wide">My Account</span>
//         <div className="ml-auto flex gap-2">
//           <button onClick={() => navigate("/wishlist")} className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">♡</button>
//           <button onClick={() => navigate("/cart")} className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
//             🛒
//             {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
//           </button>
//         </div>
//       </div>

//       {/* BREADCRUMB */}
//       <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
//         <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
//         <span>›</span>
//         <span className="text-gray-700 font-medium">My Account</span>
//       </div>

//       <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-6 items-start flex-col lg:flex-row">

//         {/* ══ SIDEBAR ══ */}
//         <aside className="w-full lg:w-72 flex-shrink-0">
//           {/* Profile card */}
//           <div className="bg-gradient-to-br from-[#1e0a3c] to-violet-700 rounded-2xl p-6 mb-4 text-center">
//             <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white font-serif border-2 border-white/30">
//               {initials}
//             </div>
//             <p className="text-white font-semibold text-base">{user.fullName || "Guest"}</p>
//             <p className="text-purple-300 text-xs mt-1">{user.email || ""}</p>
//             {(user.mobileNumber || user.phone) && <p className="text-purple-300 text-xs">{user.mobileNumber || user.phone}</p>}
//             <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10">
//               <div className="text-center">
//                 <p className="text-white font-bold text-lg">{orders.length}</p>
//                 <p className="text-purple-300 text-xs">Orders</p>
//               </div>
//               <div className="w-px bg-white/10" />
//               <div className="text-center">
//                 <p className="text-white font-bold text-lg">{wishlistItems.length}</p>
//                 <p className="text-purple-300 text-xs">Wishlist</p>
//               </div>
//               <div className="w-px bg-white/10" />
//               <div className="text-center">
//                 <p className="text-white font-bold text-lg">{addresses.length}</p>
//                 <p className="text-purple-300 text-xs">Addresses</p>
//               </div>
//             </div>
//           </div>

//           {/* Nav tabs */}
//           <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
//             {TABS.map((tab) => (
//               <button key={tab.id} onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all border-b border-purple-50 last:border-0 ${activeTab === tab.id ? "bg-violet-50 text-violet-700 font-semibold border-l-4 border-l-violet-600" : "text-gray-600 hover:bg-gray-50 hover:text-violet-600 border-l-4 border-l-transparent"}`}>
//                 <span className="text-lg">{tab.icon}</span>
//                 {tab.label}
//                 {tab.id === "wishlist" && wishlistItems.length > 0 && (
//                   <span className="ml-auto bg-pink-100 text-pink-600 text-xs font-bold px-2 py-0.5 rounded-full">{wishlistItems.length}</span>
//                 )}
//                 {tab.id === "orders" && orders.length > 0 && (
//                   <span className="ml-auto bg-violet-100 text-violet-600 text-xs font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
//                 )}
//               </button>
//             ))}
//             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-all border-t border-purple-50 border-l-4 border-l-transparent">
//               <span className="text-lg">🚪</span> Sign Out
//             </button>
//           </div>
//         </aside>

//         {/* ══ MAIN ══ */}
//         <main className="flex-1 min-w-0">

//           {/* ════ PROFILE ════ */}
//           {activeTab === "profile" && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Profile</span></h2>
//                 {!editMode ? (
//                   <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">✏️ Edit Profile</button>
//                 ) : (
//                   <div className="flex gap-2">
//                     <button onClick={handleSaveProfile} disabled={profSaving} className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-60">{profSaving ? "Saving..." : "Save"}</button>
//                     <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">Cancel</button>
//                   </div>
//                 )}
//               </div>

//               {savedMsg && (
//                 <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-semibold flex items-center gap-2">✓ {savedMsg}</div>
//               )}

//               <div className="bg-white rounded-2xl border border-purple-100 p-6">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Information</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   {[
//                     { label: "Full Name", key: "fullName",  type: "text",  placeholder: "Your full name" },
//                     { label: "Email",     key: "email",     type: "email", placeholder: "your@email.com" },
//                     { label: "Phone",     key: "phone",     type: "tel",   placeholder: "10-digit number" },
//                     { label: "Gender",    key: "gender",    type: "select", options: ["", "Male", "Female", "Other", "Prefer not to say"] },
//                   ].map(({ label, key, type, placeholder, options }) => (
//                     <div key={key}>
//                       <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
//                       {!editMode ? (
//                         <p className="text-sm font-medium text-gray-900 py-2.5 px-4 bg-gray-50 rounded-xl">{editForm[key] || <span className="text-gray-400 italic">Not set</span>}</p>
//                       ) : type === "select" ? (
//                         <select value={editForm[key]} onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
//                           className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500 bg-white">
//                           {options.map((o) => <option key={o} value={o}>{o || "Select"}</option>)}
//                         </select>
//                       ) : (
//                         <input type={type} value={editForm[key]} placeholder={placeholder}
//                           onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
//                           className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500 transition-all" />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-3 gap-4">
//                 {[
//                   { icon: "📦", label: "Total Orders",  value: orders.length,            color: "bg-violet-50 border-violet-100" },
//                   { icon: "♥",  label: "Wishlist Items", value: wishlistItems.length,     color: "bg-pink-50 border-pink-100" },
//                   { icon: "💰", label: "Total Spent",   value: `₹${totalSpent.toLocaleString()}`, color: "bg-green-50 border-green-100" },
//                 ].map((s) => (
//                   <div key={s.label} className={`${s.color} border rounded-2xl p-5 text-center`}>
//                     <p className="text-3xl mb-2">{s.icon}</p>
//                     <p className="font-bold text-gray-900 text-xl">{s.value}</p>
//                     <p className="text-xs text-gray-500 mt-1">{s.label}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Quick actions */}
//               <div className="bg-white rounded-2xl border border-purple-100 p-5">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</p>
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                   {[
//                     { icon: "📦", label: "My Orders",  action: () => setActiveTab("orders") },
//                     { icon: "♥",  label: "Wishlist",   action: () => setActiveTab("wishlist") },
//                     { icon: "📍", label: "Addresses",  action: () => setActiveTab("addresses") },
//                     { icon: "🛒", label: "Go to Cart", action: () => navigate("/cart") },
//                   ].map((q) => (
//                     <button key={q.label} onClick={q.action} className="flex flex-col items-center gap-2 py-4 rounded-xl bg-violet-50 hover:bg-violet-100 transition-all border border-violet-100">
//                       <span className="text-2xl">{q.icon}</span>
//                       <span className="text-xs font-semibold text-violet-700">{q.label}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ════ ORDERS ════ */}
//           {activeTab === "orders" && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Orders</span></h2>
//                 <button onClick={loadOrders} className="text-sm text-violet-600 hover:underline font-medium">↻ Refresh</button>
//               </div>

//               {ordersLoading ? (
//                 <div className="space-y-3">
//                   {[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
//                 </div>
//               ) : orders.length === 0 ? (
//                 <div className="bg-white rounded-2xl border border-purple-100 p-16 text-center">
//                   <p className="text-5xl mb-4">📦</p>
//                   <p className="font-serif text-xl text-gray-700 mb-2">No orders yet</p>
//                   <p className="text-gray-400 text-sm mb-5">Start shopping to see your orders here.</p>
//                   <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Browse Products →</button>
//                 </div>
//               ) : (
//                 orders.map((order) => {
//                   const orderId = order._id || order.id;
//                   const isExpanded = expandedOrder === orderId;
//                   return (
//                     <div key={orderId} className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
//                       {/* Order header */}
//                       <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50 cursor-pointer hover:bg-violet-50/30 transition-colors"
//                         onClick={() => setExpandedOrder(isExpanded ? null : orderId)}>
//                         <div className="flex items-center gap-4">
//                           <div>
//                             <p className="font-mono font-bold text-violet-600 text-sm">{String(orderId).slice(-8).toUpperCase()}</p>
//                             <p className="text-xs text-gray-400 mt-0.5">
//                               {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : order.date}
//                             </p>
//                           </div>
//                           <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[order.status] || STATUS_STYLE.Pending}`}>{order.status || "Pending"}</span>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className="text-right">
//                             <p className="font-bold text-gray-900">₹{(order.total || 0).toLocaleString()}</p>
//                             <p className="text-xs text-gray-400">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</p>
//                           </div>
//                           <span className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>▾</span>
//                         </div>
//                       </div>

//                       {/* Order items */}
//                       {isExpanded && (
//                         <div className="p-5 space-y-4">
//                           {/* Item list */}
//                           <div className="space-y-3">
//                             {(order.items || []).map((item, idx) => (
//                               <div key={idx} className="flex gap-4 items-center">
//                                 <img src={item.image || item.images?.[0]} alt={item.name || item.product?.name}
//                                   className="w-16 h-16 rounded-xl object-cover bg-purple-50 flex-shrink-0"
//                                   onError={(e) => { e.target.src = "https://placehold.co/64x64/f3f4f6/9ca3af?text=L"; }} />
//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">{item.brand || item.product?.brand}</p>
//                                   <p className="font-medium text-gray-900 text-sm truncate">{item.name || item.product?.name}</p>
//                                   <div className="flex gap-2 mt-1 flex-wrap">
//                                     <span className="text-xs bg-purple-50 text-violet-600 px-2 py-0.5 rounded-lg border border-purple-100">Size: {item.size}</span>
//                                     <span className="text-xs bg-purple-50 text-violet-600 px-2 py-0.5 rounded-lg border border-purple-100">{item.color}</span>
//                                     <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
//                                   </div>
//                                 </div>
//                                 <p className="font-bold text-gray-900 flex-shrink-0">₹{(item.price || 0).toLocaleString()}</p>
//                               </div>
//                             ))}
//                           </div>

//                           {/* Delivery address */}
//                           {order.address && (
//                             <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
//                               <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">📍 Delivered to</p>
//                               <p className="text-sm text-gray-700">
//                                 <span className="font-semibold">{order.address.fullName}</span> · {order.address.phone}<br />
//                                 {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
//                               </p>
//                             </div>
//                           )}

//                           {/* Order summary */}
//                           <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
//                             <div className="flex justify-between text-xs text-gray-600">
//                               <span>Subtotal</span><span>₹{(order.subtotal || order.total || 0).toLocaleString()}</span>
//                             </div>
//                             {(order.discount || 0) > 0 && (
//                               <div className="flex justify-between text-xs text-green-600">
//                                 <span>Discount</span><span>− ₹{order.discount.toLocaleString()}</span>
//                               </div>
//                             )}
//                             <div className="flex justify-between text-xs text-gray-600">
//                               <span>Shipping</span><span className={order.shippingFee === 0 ? "text-green-600 font-semibold" : ""}>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee || 0}`}</span>
//                             </div>
//                             <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
//                               <span>Total</span><span>₹{(order.total || 0).toLocaleString()}</span>
//                             </div>
//                             <div className="flex justify-between text-xs text-gray-500">
//                               <span>Payment</span>
//                               <span className="capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "—"}</span>
//                             </div>
//                           </div>

//                           {/* Actions */}
//                           <div className="flex gap-3 pt-1">
//                             {order.status === "Delivered" && (
//                               <button className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">Rate & Review</button>
//                             )}
//                             {order.status === "Shipped" && (
//                               <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">Track Order</button>
//                             )}
//                             {(order.status === "Pending" || order.status === "Processing") && (
//                               <button onClick={() => handleCancelOrder(orderId)} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">Cancel Order</button>
//                             )}
//                             <button className="flex-1 py-2.5 rounded-xl border border-purple-100 text-violet-600 text-sm font-semibold hover:bg-violet-50 transition-colors">View Invoice</button>
//                             {order.status === "Delivered" && (
//                               <button onClick={() => navigate("/dashboard")} className="flex-1 py-2.5 rounded-xl border border-purple-100 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">Buy Again</button>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           )}

//           {/* ════ WISHLIST ════ */}
//           {activeTab === "wishlist" && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Wishlist</span></h2>
//                 <span className="text-sm text-gray-400">{wishlistItems.length} saved items</span>
//               </div>

//               {wishlistItems.length === 0 ? (
//                 <div className="bg-white rounded-2xl border border-purple-100 p-16 text-center">
//                   <p className="text-5xl mb-4">♡</p>
//                   <p className="font-serif text-xl text-gray-700 mb-2">Your wishlist is empty</p>
//                   <p className="text-gray-400 text-sm mb-5">Tap ♡ on any product to save it here.</p>
//                   <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Explore Products →</button>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {wishlistItems.map((product) => {
//                     const id   = product._id || product.id;
//                     const disc = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
//                     return (
//                       <div key={id} className="bg-white rounded-2xl border border-purple-100 overflow-hidden group hover:border-violet-300 hover:shadow-lg hover:shadow-purple-50 hover:-translate-y-1 transition-all duration-300 relative">
//                         <button onClick={() => removeFromWishlist(id)} className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg text-pink-500 hover:text-red-500 hover:scale-110 transition-all">♥</button>
//                         <div className="h-44 overflow-hidden bg-purple-50 cursor-pointer" onClick={() => navigate(`/product/${id}`)}>
//                           <img src={product.images?.[0] || product.image} alt={product.name}
//                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                             onError={(e) => { e.target.src = "https://placehold.co/300x300/f3f4f6/9ca3af?text=L"; }} />
//                         </div>
//                         <div className="p-3">
//                           <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{product.brand}</p>
//                           <p className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-violet-600" onClick={() => navigate(`/product/${id}`)}>{product.name}</p>
//                           <div className="flex items-center gap-2 mt-2 flex-wrap">
//                             <span className="font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
//                             {product.originalPrice && <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>}
//                             {disc > 0 && <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{disc}% off</span>}
//                           </div>
//                           <button onClick={() => setModalProduct(product)}
//                             className="w-full mt-3 py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all">
//                             🛒 Add to Cart
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ════ ADDRESSES ════ */}
//           {activeTab === "addresses" && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Addresses</span></h2>
//                 <button onClick={() => { setShowAddrForm((v) => !v); setEditingAddr(null); setAddrForm({ label:"Home",fullName:"",phone:"",street:"",city:"",state:"",pincode:"" }); }}
//                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
//                   {showAddrForm ? "✕ Cancel" : "+ Add Address"}
//                 </button>
//               </div>

//               {/* Address form */}
//               {showAddrForm && (
//                 <div className="bg-white rounded-2xl border border-purple-100 p-6">
//                   <p className="font-serif text-lg text-gray-900 mb-4">{editingAddr ? "Edit Address" : "New Address"}</p>
//                   <div className="flex gap-2 mb-4">
//                     {["Home","Work","Other"].map((l) => (
//                       <button key={l} onClick={() => setAddrForm((f) => ({ ...f, label: l }))}
//                         className={`px-4 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${addrForm.label === l ? "border-violet-600 bg-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300"}`}>
//                         {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
//                       </button>
//                     ))}
//                   </div>
//                   <div className="space-y-4">
//                     <div className="flex gap-3">
//                       {[["Full Name","fullName","text"],["Phone","phone","tel"]].map(([lbl, key, type]) => (
//                         <div key={key} className="flex-1">
//                           <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{lbl}</label>
//                           <input type={type} value={addrForm[key]} onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))}
//                             className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
//                         </div>
//                       ))}
//                     </div>
//                     <div>
//                       <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Street / Flat / Area</label>
//                       <input type="text" value={addrForm.street} onChange={(e) => setAddrForm((f) => ({ ...f, street: e.target.value }))}
//                         className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
//                     </div>
//                     <div className="flex gap-3">
//                       {[["City","city"],["State","state"],["Pincode","pincode"]].map(([lbl, key]) => (
//                         <div key={key} className="flex-1">
//                           <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{lbl}</label>
//                           <input type="text" value={addrForm[key]} onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))}
//                             className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
//                         </div>
//                       ))}
//                     </div>
//                     <button onClick={handleSaveAddr} disabled={addrSaving}
//                       className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-60">
//                       {addrSaving ? "Saving..." : "Save Address"}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {addrLoading ? (
//                 <div className="space-y-3">{[1,2].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
//               ) : addresses.length === 0 && !showAddrForm ? (
//                 <div className="bg-white rounded-2xl border border-purple-100 p-16 text-center">
//                   <p className="text-5xl mb-4">📍</p>
//                   <p className="font-serif text-xl text-gray-700 mb-2">No addresses saved</p>
//                   <button onClick={() => setShowAddrForm(true)} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">+ Add Address</button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {addresses.map((addr) => {
//                     const id = addr._id || addr.id;
//                     return (
//                       <div key={id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${addr.isDefault || addr.default ? "border-violet-400 shadow-md shadow-violet-100" : "border-purple-100"}`}>
//                         <div className="flex items-start justify-between gap-3">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-2 flex-wrap">
//                               <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg">{addr.label || "Home"}</span>
//                               {(addr.isDefault || addr.default) && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-lg">✓ Default</span>}
//                               <span className="font-semibold text-gray-900 text-sm">{addr.fullName}</span>
//                               <span className="text-xs text-gray-500">{addr.phone}</span>
//                             </div>
//                             <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
//                           </div>
//                           <div className="flex flex-col gap-1.5 flex-shrink-0">
//                             <button onClick={() => { setEditingAddr(addr); setAddrForm({ label:addr.label||"Home", fullName:addr.fullName||"", phone:addr.phone||"", street:addr.street||"", city:addr.city||"", state:addr.state||"", pincode:addr.pincode||"" }); setShowAddrForm(true); }}
//                               className="text-xs text-violet-600 hover:underline font-semibold px-2 py-1">Edit</button>
//                             {!(addr.isDefault || addr.default) && (
//                               <button onClick={() => handleSetDefault(id)} className="text-xs text-violet-600 hover:underline font-semibold px-2 py-1">Set Default</button>
//                             )}
//                             <button onClick={() => handleDeleteAddr(id)} className="text-xs text-red-400 hover:underline font-semibold px-2 py-1">Delete</button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//         </main>
//       </div>

//       {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./components/CartContext";
import { useWishlist } from "./components/WishlistContext";
import AddToCartModal from "./components/AddToCartModal";
import axios from "axios";

// ══════════════════════════════════════════════════════════════════
// API INSTANCES
// Base: http://localhost:6055  (matches server.js PORT)
//
// Routes mounted in server.js:
//   app.use("/api/users",    userRoutes)   ← PUT /profile lives here
//   app.use("/api/orders",   orderRoutes)
//   app.use("/api/addresses",addressRoutes)
// ══════════════════════════════════════════════════════════════════
const API_BASE = "http://localhost:6055";

const getAuthHeader = () => {
  const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = user.token || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const makeAPI = (base) => {
  const instance = axios.create({ baseURL: base });
  instance.interceptors.request.use((config) => {
    Object.assign(config.headers, getAuthHeader());
    return config;
  });
  return instance;
};

const USER_API    = makeAPI(`${API_BASE}/api/users`);
// PUT /api/users/profile    { fullName, email, phone, gender }  → { message, user }

const ORDER_API   = makeAPI(`${API_BASE}/api/orders`);
// GET   /api/orders/my              → array of orders
// GET   /api/orders/:id             → single order
// PATCH /api/orders/:id/cancel      → { reason? } → { message, order }

const ADDRESS_API = makeAPI(`${API_BASE}/api/addresses`);
// GET    /api/addresses              → array of addresses
// POST   /api/addresses              → { label, fullName, phone, street, city, state, pincode } → { message, address }
// PUT    /api/addresses/:id          → partial/full address → { message, address }
// DELETE /api/addresses/:id          → { message }
// PATCH  /api/addresses/:id/default  → { message, address }

// ── Status badge styles ────────────────────────────────────────────
const STATUS_STYLE = {
  Delivered:  "text-green-700 bg-green-50 border border-green-200",
  Shipped:    "text-blue-700 bg-blue-50 border border-blue-200",
  Processing: "text-amber-700 bg-amber-50 border border-amber-200",
  Pending:    "text-gray-600 bg-gray-50 border border-gray-200",
  Cancelled:  "text-red-600 bg-red-50 border border-red-200",
};

const TABS = [
  { id: "profile",   label: "My Profile",  icon: "👤" },
  { id: "orders",    label: "My Orders",   icon: "📦" },
  { id: "wishlist",  label: "Wishlist",    icon: "♥"  },
  { id: "addresses", label: "Addresses",   icon: "📍" },
];

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

// ══════════════════════════════════════════════════════════════════
const ProfilePage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { cartCount } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState(() => {
    const p = new URLSearchParams(location.search);
    return p.get("tab") || "profile";
  });

  // ── Auth ───────────────────────────────────────────────────────
  const [user, setUser] = useState({});

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) { navigate("/"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // ════════════════════════════════════════════════════════════════
  // PROFILE — PUT /api/users/profile
  // body:    { fullName, email, phone, gender }
  // returns: { message, user: { fullName, email, mobileNumber, gender, ... } }
  // ════════════════════════════════════════════════════════════════
  const [editMode,   setEditMode]   = useState(false);
  const [editForm,   setEditForm]   = useState({});
  const [savedMsg,   setSavedMsg]   = useState("");
  const [profSaving, setProfSaving] = useState(false);

  useEffect(() => {
    setEditForm({
      fullName: user.fullName         || "",
      email:    user.email            || "",
      phone:    user.mobileNumber || user.phone || "",
      gender:   user.gender           || "",
    });
  }, [user]);

  const handleSaveProfile = async () => {
    setProfSaving(true);
    try {
      // PUT /api/users/profile
      const { data } = await USER_API.put("/profile", editForm);
      const updated  = data.user || data;
      const newSession = { ...user, ...updated };
      sessionStorage.setItem("user", JSON.stringify(newSession));
      setUser(newSession);
      setEditMode(false);
      setSavedMsg("Profile updated successfully!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      console.error("Profile update:", err.response?.data || err.message);
      // Graceful fallback — update locally if endpoint isn't wired yet
      const newSession = { ...user, ...editForm };
      sessionStorage.setItem("user", JSON.stringify(newSession));
      setUser(newSession);
      setEditMode(false);
      setSavedMsg("Profile updated!");
      setTimeout(() => setSavedMsg(""), 3000);
    } finally {
      setProfSaving(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // ORDERS — GET /api/orders/my
  // returns: array of order objects with { _id, orderNumber, status,
  //          items, address, total, subtotal, discount, shippingFee,
  //          paymentMethod, createdAt, statusTimeline, estimatedDelivery }
  // ════════════════════════════════════════════════════════════════
  const [orders,        setOrders]        = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      // GET /api/orders/my
      const { data } = await ORDER_API.get("/my");
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error("Load orders:", err.response?.data || err.message);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "orders") loadOrders();
  }, [activeTab, loadOrders]);

  // ════════════════════════════════════════════════════════════════
  // CANCEL ORDER — PATCH /api/orders/:id/cancel
  // body:    { reason? }
  // returns: { message, order: { ...updated order } }
  // Only allowed when status is "Pending" or "Processing"
  // ════════════════════════════════════════════════════════════════
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      // PATCH /api/orders/:id/cancel
      const { data } = await ORDER_API.patch(`/${orderId}/cancel`, {
        reason: "Cancelled by customer",
      });
      const updatedOrder = data.order || { status: "Cancelled" };
      setOrders((prev) =>
        prev.map((o) =>
          String(o._id) === String(orderId) ? { ...o, ...updatedOrder } : o
        )
      );
    } catch (err) {
      console.error("Cancel order:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to cancel order.");
    }
  };

  // ════════════════════════════════════════════════════════════════
  // ADDRESSES — GET /api/addresses
  // returns: array of address objects, default first
  // ════════════════════════════════════════════════════════════════
  const [addresses,    setAddresses]    = useState([]);
  const [addrLoading,  setAddrLoading]  = useState(false);
  const [addrSaving,   setAddrSaving]   = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr,  setEditingAddr]  = useState(null);
  const [addrForm,     setAddrForm]     = useState({
    label: "Home", fullName: "", phone: "", street: "", city: "", state: "", pincode: "",
  });

  const loadAddresses = useCallback(async () => {
    setAddrLoading(true);
    try {
      // GET /api/addresses
      const { data } = await ADDRESS_API.get("/");
      setAddresses(Array.isArray(data) ? data : data.addresses || []);
    } catch (err) {
      console.error("Load addresses:", err.response?.data || err.message);
    } finally {
      setAddrLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "addresses") loadAddresses();
  }, [activeTab, loadAddresses]);

  // ════════════════════════════════════════════════════════════════
  // SAVE ADDRESS
  // POST /api/addresses        → create
  //   body: { label, fullName, phone, street, city, state, pincode }
  //   returns: { message, address }
  //
  // PUT  /api/addresses/:id    → update
  //   body: same fields (partial allowed)
  //   returns: { message, address }
  // ════════════════════════════════════════════════════════════════
  const handleSaveAddr = async () => {
    if (!addrForm.fullName || !addrForm.street || !addrForm.city || !addrForm.pincode) {
      alert("Please fill in all required fields.");
      return;
    }
    setAddrSaving(true);
    try {
      if (editingAddr) {
        // PUT /api/addresses/:id
        const id = String(editingAddr._id);
        const { data } = await ADDRESS_API.put(`/${id}`, addrForm);
        const updated  = data.address || data;
        setAddresses((prev) =>
          prev.map((a) => String(a._id) === id ? updated : a)
        );
      } else {
        // POST /api/addresses
        const { data } = await ADDRESS_API.post("/", addrForm);
        const newAddr  = data.address || data;
        setAddresses((prev) => [...prev, newAddr]);
      }
      setShowAddrForm(false);
      setEditingAddr(null);
      setAddrForm({ label:"Home", fullName:"", phone:"", street:"", city:"", state:"", pincode:"" });
    } catch (err) {
      console.error("Save address:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to save address.");
    } finally {
      setAddrSaving(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // DELETE ADDRESS — DELETE /api/addresses/:id
  // returns: { message }
  // If deleted was default, backend auto-promotes the next one
  // ════════════════════════════════════════════════════════════════
  const handleDeleteAddr = async (id) => {
    try {
      // DELETE /api/addresses/:id
      await ADDRESS_API.delete(`/${id}`);
      setAddresses((prev) => prev.filter((a) => String(a._id) !== String(id)));
    } catch (err) {
      console.error("Delete address:", err.response?.data || err.message);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // SET DEFAULT ADDRESS — PATCH /api/addresses/:id/default
  // returns: { message, address }
  // Backend unsets all others; no body required
  // ════════════════════════════════════════════════════════════════
  const handleSetDefault = async (id) => {
    try {
      // PATCH /api/addresses/:id/default
      await ADDRESS_API.patch(`/${id}/default`);
      // Reflect locally: mark only this one as default
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: String(a._id) === String(id) }))
      );
    } catch (err) {
      console.error("Set default address:", err.response?.data || err.message);
      // Optimistic fallback even if request failed
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: String(a._id) === String(id) }))
      );
    }
  };

  // ── Wishlist ───────────────────────────────────────────────────
  // removeFromWishlist calls DELETE /api/wishlist/:productId (via WishlistContext)
  const [modalProduct, setModalProduct] = useState(null);

  // ── Computed stats ─────────────────────────────────────────────
  const initials   = (user.fullName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const totalSpent = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* TOPBAR */}
      <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
          ← Back
        </button>
        <span className="font-serif text-base text-purple-200 tracking-wide">My Account</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => navigate("/wishlist")}
            className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
            ♡
          </button>
          <button onClick={() => navigate("/cart")}
            className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">My Account</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-6 items-start flex-col lg:flex-row">

        {/* ══ SIDEBAR ══ */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-gradient-to-br from-[#1e0a3c] to-violet-700 rounded-2xl p-6 mb-4 text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white font-serif border-2 border-white/30">
              {initials}
            </div>
            <p className="text-white font-semibold text-base">{user.fullName || "Guest"}</p>
            <p className="text-purple-300 text-xs mt-1">{user.email || ""}</p>
            {(user.mobileNumber || user.phone) && (
              <p className="text-purple-300 text-xs">{user.mobileNumber || user.phone}</p>
            )}
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10">
              {[
                { label: "Orders",    value: orders.length },
                { label: "Wishlist",  value: wishlistItems.length },
                { label: "Addresses", value: addresses.length },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="w-px bg-white/10" />}
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{s.value}</p>
                    <p className="text-purple-300 text-xs">{s.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all border-b border-purple-50 last:border-0 ${
                  activeTab === tab.id
                    ? "bg-violet-50 text-violet-700 font-semibold border-l-4 border-l-violet-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-violet-600 border-l-4 border-l-transparent"
                }`}>
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
                {tab.id === "wishlist" && wishlistItems.length > 0 && (
                  <span className="ml-auto bg-pink-100 text-pink-600 text-xs font-bold px-2 py-0.5 rounded-full">{wishlistItems.length}</span>
                )}
                {tab.id === "orders" && orders.length > 0 && (
                  <span className="ml-auto bg-violet-100 text-violet-600 text-xs font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
                )}
              </button>
            ))}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-all border-t border-purple-50 border-l-4 border-l-transparent">
              <span className="text-lg">🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main className="flex-1 min-w-0">

          {/* ════ PROFILE ════ */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Profile</span></h2>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} disabled={profSaving}
                      className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-60">
                      {profSaving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setEditMode(false)}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {savedMsg && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-semibold flex items-center gap-2">
                  ✓ {savedMsg}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-purple-100 p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", key: "fullName", type: "text",   placeholder: "Your full name" },
                    { label: "Email",     key: "email",    type: "email",  placeholder: "your@email.com" },
                    { label: "Phone",     key: "phone",    type: "tel",    placeholder: "10-digit number" },
                    { label: "Gender",    key: "gender",   type: "select", options: ["","Male","Female","Other","Prefer not to say"] },
                  ].map(({ label, key, type, placeholder, options }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                      {!editMode ? (
                        <p className="text-sm font-medium text-gray-900 py-2.5 px-4 bg-gray-50 rounded-xl">
                          {editForm[key] || <span className="text-gray-400 italic">Not set</span>}
                        </p>
                      ) : type === "select" ? (
                        <select value={editForm[key]} onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500 bg-white">
                          {options.map((o) => <option key={o} value={o}>{o || "Select"}</option>)}
                        </select>
                      ) : (
                        <input type={type} value={editForm[key]} placeholder={placeholder}
                          onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500 transition-all" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "📦", label: "Total Orders",   value: orders.length,                          color: "bg-violet-50 border-violet-100" },
                  { icon: "♥",  label: "Wishlist Items",  value: wishlistItems.length,                   color: "bg-pink-50 border-pink-100" },
                  { icon: "💰", label: "Total Spent",    value: `₹${totalSpent.toLocaleString()}`,        color: "bg-green-50 border-green-100" },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} border rounded-2xl p-5 text-center`}>
                    <p className="text-3xl mb-2">{s.icon}</p>
                    <p className="font-bold text-gray-900 text-xl">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-purple-100 p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: "📦", label: "My Orders",  action: () => setActiveTab("orders") },
                    { icon: "♥",  label: "Wishlist",   action: () => setActiveTab("wishlist") },
                    { icon: "📍", label: "Addresses",  action: () => setActiveTab("addresses") },
                    { icon: "🛒", label: "Go to Cart", action: () => navigate("/cart") },
                  ].map((q) => (
                    <button key={q.label} onClick={q.action}
                      className="flex flex-col items-center gap-2 py-4 rounded-xl bg-violet-50 hover:bg-violet-100 transition-all border border-violet-100">
                      <span className="text-2xl">{q.icon}</span>
                      <span className="text-xs font-semibold text-violet-700">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ ORDERS ════ */}
          {/* Data from GET /api/orders/my */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Orders</span></h2>
                <button onClick={loadOrders} className="text-sm text-violet-600 hover:underline font-medium">↻ Refresh</button>
              </div>

              {ordersLoading ? (
                <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-purple-100 p-16 text-center">
                  <p className="text-5xl mb-4">📦</p>
                  <p className="font-serif text-xl text-gray-700 mb-2">No orders yet</p>
                  <p className="text-gray-400 text-sm mb-5">Start shopping to see your orders here.</p>
                  <button onClick={() => navigate("/dashboard")}
                    className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                    Browse Products →
                  </button>
                </div>
              ) : (
                orders.map((order) => {
                  const orderId    = String(order._id);
                  const isExpanded = expandedOrder === orderId;
                  const displayId  = order.orderNumber || orderId.slice(-8).toUpperCase();

                  return (
                    <div key={orderId} className="bg-white rounded-2xl border border-purple-100 overflow-hidden">

                      {/* Order header row */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50 cursor-pointer hover:bg-violet-50/30 transition-colors"
                        onClick={() => setExpandedOrder(isExpanded ? null : orderId)}>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-mono font-bold text-violet-600 text-sm">{displayId}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
                                : "—"}
                            </p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[order.status] || STATUS_STYLE.Pending}`}>
                            {order.status || "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₹{(order.total || 0).toLocaleString()}</p>
                            <p className="text-xs text-gray-400">
                              {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <span className={`text-gray-400 transition-transform inline-block ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                        </div>
                      </div>

                      {/* Expanded order details */}
                      {isExpanded && (
                        <div className="p-5 space-y-4">

                          {/* Items list */}
                          <div className="space-y-3">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center">
                                <img src={item.image || item.images?.[0]}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-xl object-cover bg-purple-50 flex-shrink-0"
                                  onError={(e) => { e.target.src = "https://placehold.co/64x64/f3f4f6/9ca3af?text=L"; }} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">{item.brand}</p>
                                  <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    <span className="text-xs bg-purple-50 text-violet-600 px-2 py-0.5 rounded-lg border border-purple-100">Size: {item.size}</span>
                                    <span className="text-xs bg-purple-50 text-violet-600 px-2 py-0.5 rounded-lg border border-purple-100">{item.color}</span>
                                    <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                                  </div>
                                </div>
                                <p className="font-bold text-gray-900 flex-shrink-0">₹{(item.price || 0).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>

                          {/* Delivery address snapshot */}
                          {order.address && (
                            <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
                              <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">📍 Delivered to</p>
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">{order.address.fullName}</span> · {order.address.phone}<br />
                                {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                              </p>
                            </div>
                          )}

                          {/* Price breakdown */}
                          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Subtotal</span>
                              <span>₹{(order.subtotal || order.total || 0).toLocaleString()}</span>
                            </div>
                            {(order.discount || 0) > 0 && (
                              <div className="flex justify-between text-xs text-green-600">
                                <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                                <span>− ₹{order.discount.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Shipping</span>
                              <span className={(order.shippingFee || 0) === 0 ? "text-green-600 font-semibold" : ""}>
                                {(order.shippingFee || 0) === 0 ? "FREE" : `₹${order.shippingFee}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                              <span>Total</span>
                              <span>₹{(order.total || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Payment</span>
                              <span className="capitalize">
                                {{ cod:"Cash on Delivery", upi:"UPI", card:"Card", netbanking:"Net Banking", wallet:"Wallet" }[order.paymentMethod] || order.paymentMethod || "—"}
                              </span>
                            </div>
                          </div>

                          {/* Status timeline (from order.statusTimeline array) */}
                          {order.statusTimeline && order.statusTimeline.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status Timeline</p>
                              <div className="space-y-2">
                                {order.statusTimeline.map((ev, i) => (
                                  <div key={i} className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <div className="w-2 h-2 rounded-full bg-violet-600" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-semibold text-gray-700">{ev.status}</span>
                                      {ev.message && <span className="text-xs text-gray-400 ml-2">— {ev.message}</span>}
                                      <p className="text-xs text-gray-400">
                                        {ev.timestamp ? new Date(ev.timestamp).toLocaleString("en-IN") : ""}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="flex gap-3 pt-1 flex-wrap">
                            {order.status === "Delivered" && (
                              <button className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                                Rate & Review
                              </button>
                            )}
                            {order.status === "Shipped" && (
                              <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                                Track Order
                              </button>
                            )}
                            {/* PATCH /api/orders/:id/cancel */}
                            {(order.status === "Pending" || order.status === "Processing") && (
                              <button onClick={() => handleCancelOrder(orderId)}
                                className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">
                                Cancel Order
                              </button>
                            )}
                            <button className="flex-1 py-2.5 rounded-xl border border-purple-100 text-violet-600 text-sm font-semibold hover:bg-violet-50 transition-colors">
                              View Invoice
                            </button>
                            {order.status === "Delivered" && (
                              <button onClick={() => navigate("/dashboard")}
                                className="flex-1 py-2.5 rounded-xl border border-purple-100 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                                Buy Again
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ════ WISHLIST ════ */}
          {/* Uses WishlistContext — removeFromWishlist calls DELETE /api/wishlist/:productId */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Wishlist</span></h2>
                <span className="text-sm text-gray-400">{wishlistItems.length} saved items</span>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-purple-100 p-16 text-center">
                  <p className="text-5xl mb-4">♡</p>
                  <p className="font-serif text-xl text-gray-700 mb-2">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mb-5">Tap ♡ on any product to save it here.</p>
                  <button onClick={() => navigate("/dashboard")}
                    className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                    Explore Products →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {wishlistItems.map((product) => {
                    const id   = product._id || product.id;
                    const disc = product.originalPrice
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;
                    return (
                      <div key={id} className="bg-white rounded-2xl border border-purple-100 overflow-hidden group hover:border-violet-300 hover:shadow-lg hover:shadow-purple-50 hover:-translate-y-1 transition-all duration-300 relative">
                        {/* DELETE /api/wishlist/:productId via WishlistContext */}
                        <button onClick={() => removeFromWishlist(id)}
                          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg text-pink-500 hover:text-red-500 hover:scale-110 transition-all">
                          ♥
                        </button>
                        <div className="h-44 overflow-hidden bg-purple-50 cursor-pointer" onClick={() => navigate(`/product/${id}`)}>
                          <img src={product.images?.[0] || product.image} alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = "https://placehold.co/300x300/f3f4f6/9ca3af?text=L"; }} />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{product.brand}</p>
                          <p className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-violet-600"
                            onClick={() => navigate(`/product/${id}`)}>
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                            {disc > 0 && (
                              <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{disc}% off</span>
                            )}
                          </div>
                          {/* Opens AddToCartModal → addToCart calls POST /api/cart */}
                          <button onClick={() => setModalProduct(product)}
                            className="w-full mt-3 py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all">
                            🛒 Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ ADDRESSES ════ */}
          {/* Data from GET /api/addresses — default address shown first */}
          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Addresses</span></h2>
                <button onClick={() => {
                  setShowAddrForm((v) => !v);
                  setEditingAddr(null);
                  setAddrForm({ label:"Home", fullName:"", phone:"", street:"", city:"", state:"", pincode:"" });
                }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                  {showAddrForm ? "✕ Cancel" : "+ Add Address"}
                </button>
              </div>

              {/* Address form — POST/PUT /api/addresses */}
              {showAddrForm && (
                <div className="bg-white rounded-2xl border border-purple-100 p-6">
                  <p className="font-serif text-lg text-gray-900 mb-4">{editingAddr ? "Edit Address" : "New Address"}</p>
                  <div className="flex gap-2 mb-4">
                    {["Home","Work","Other"].map((l) => (
                      <button key={l} onClick={() => setAddrForm((f) => ({ ...f, label: l }))}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                          addrForm.label === l ? "border-violet-600 bg-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300"
                        }`}>
                        {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      {[["Full Name","fullName","text"],["Phone","phone","tel"]].map(([lbl, key, type]) => (
                        <div key={key} className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{lbl}</label>
                          <input type={type} value={addrForm[key]}
                            onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Street / Flat / Area</label>
                      <input type="text" value={addrForm.street}
                        onChange={(e) => setAddrForm((f) => ({ ...f, street: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                    </div>
                    <div className="flex gap-3">
                      {[["City","city"],["State","state"],["Pincode","pincode"]].map(([lbl, key]) => (
                        <div key={key} className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{lbl}</label>
                          <input type="text" value={addrForm[key]}
                            onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                        </div>
                      ))}
                    </div>
                    <button onClick={handleSaveAddr} disabled={addrSaving}
                      className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-60">
                      {addrSaving ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </div>
              )}

              {/* Address list */}
              {addrLoading ? (
                <div className="space-y-3">{[1,2].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
              ) : addresses.length === 0 && !showAddrForm ? (
                <div className="bg-white rounded-2xl border border-purple-100 p-16 text-center">
                  <p className="text-5xl mb-4">📍</p>
                  <p className="font-serif text-xl text-gray-700 mb-2">No addresses saved</p>
                  <button onClick={() => setShowAddrForm(true)}
                    className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                    + Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const id = String(addr._id);
                    return (
                      <div key={id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${addr.isDefault ? "border-violet-400 shadow-md shadow-violet-100" : "border-purple-100"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg">{addr.label || "Home"}</span>
                              {addr.isDefault && (
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-lg">✓ Default</span>
                              )}
                              <span className="font-semibold text-gray-900 text-sm">{addr.fullName}</span>
                              <span className="text-xs text-gray-500">{addr.phone}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            {/* PUT /api/addresses/:id */}
                            <button onClick={() => {
                              setEditingAddr(addr);
                              setAddrForm({
                                label: addr.label || "Home", fullName: addr.fullName || "",
                                phone: addr.phone || "",     street:   addr.street   || "",
                                city:  addr.city  || "",     state:    addr.state    || "",
                                pincode: addr.pincode || "",
                              });
                              setShowAddrForm(true);
                            }} className="text-xs text-violet-600 hover:underline font-semibold px-2 py-1">
                              Edit
                            </button>
                            {/* PATCH /api/addresses/:id/default */}
                            {!addr.isDefault && (
                              <button onClick={() => handleSetDefault(id)}
                                className="text-xs text-violet-600 hover:underline font-semibold px-2 py-1">
                                Set Default
                              </button>
                            )}
                            {/* DELETE /api/addresses/:id */}
                            <button onClick={() => handleDeleteAddr(id)}
                              className="text-xs text-red-400 hover:underline font-semibold px-2 py-1">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* AddToCartModal → POST /api/cart via CartContext */}
      {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </div>
  );
};

export default ProfilePage;