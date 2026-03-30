// // import React, { useState, useMemo } from "react";
// // import { ALL_PRODUCTS } from "./productsData.js";

// // // ── Mock Data ─────────────────────────────────────────────────────
// // const MOCK_ORDERS = [
// //   { id: "LYR4K9A", customer: "Priya Sharma",    email: "priya@gmail.com",   date: "24 Mar 2026", status: "Delivered", total: 8499,  items: 2, payment: "UPI",         city: "Mumbai" },
// //   { id: "LYRMQ2B", customer: "Rahul Mehta",      email: "rahul@gmail.com",   date: "23 Mar 2026", status: "Shipped",   total: 12999, items: 1, payment: "Card",        city: "Delhi" },
// //   { id: "LYRP7Z3", customer: "Aisha Khan",       email: "aisha@gmail.com",   date: "22 Mar 2026", status: "Processing",total: 3799,  items: 3, payment: "COD",         city: "Hyderabad" },
// //   { id: "LYRT8X1", customer: "Vikram Singh",     email: "vikram@gmail.com",  date: "21 Mar 2026", status: "Pending",   total: 6999,  items: 1, payment: "Net Banking", city: "Bangalore" },
// //   { id: "LYRN5W2", customer: "Sneha Pillai",     email: "sneha@gmail.com",   date: "20 Mar 2026", status: "Cancelled", total: 2299,  items: 1, payment: "Wallet",      city: "Chennai" },
// //   { id: "LYRC3Y4", customer: "Arjun Nair",       email: "arjun@gmail.com",   date: "19 Mar 2026", status: "Delivered", total: 15499, items: 2, payment: "UPI",         city: "Pune" },
// //   { id: "LYRD6K8", customer: "Meera Iyer",       email: "meera@gmail.com",   date: "18 Mar 2026", status: "Shipped",   total: 4599,  items: 1, payment: "Card",        city: "Kochi" },
// //   { id: "LYRB2J5", customer: "Karthik Rajan",    email: "karthik@gmail.com", date: "17 Mar 2026", status: "Processing",total: 9299,  items: 4, payment: "UPI",         city: "Coimbatore" },
// // ];

// // const MOCK_CUSTOMERS = [
// //   { id: 1, name: "Priya Sharma",   email: "priya@gmail.com",   phone: "9876543210", orders: 5, spent: 28400, joined: "Jan 2025", status: "Active",   city: "Mumbai" },
// //   { id: 2, name: "Rahul Mehta",    email: "rahul@gmail.com",   phone: "9845612370", orders: 3, spent: 18999, joined: "Feb 2025", status: "Active",   city: "Delhi" },
// //   { id: 3, name: "Aisha Khan",     email: "aisha@gmail.com",   phone: "9712345678", orders: 8, spent: 42300, joined: "Dec 2024", status: "Active",   city: "Hyderabad" },
// //   { id: 4, name: "Vikram Singh",   email: "vikram@gmail.com",  phone: "9988776655", orders: 1, spent: 6999,  joined: "Mar 2026", status: "New",      city: "Bangalore" },
// //   { id: 5, name: "Sneha Pillai",   email: "sneha@gmail.com",   phone: "9123456789", orders: 2, spent: 5100,  joined: "Feb 2026", status: "Inactive", city: "Chennai" },
// //   { id: 6, name: "Arjun Nair",     email: "arjun@gmail.com",   phone: "9654321098", orders: 6, spent: 35200, joined: "Nov 2024", status: "Active",   city: "Pune" },
// // ];

// // const REVENUE_DATA = [
// //   { month: "Oct", revenue: 142000, orders: 89 },
// //   { month: "Nov", revenue: 168000, orders: 112 },
// //   { month: "Dec", revenue: 245000, orders: 187 },
// //   { month: "Jan", revenue: 189000, orders: 134 },
// //   { month: "Feb", revenue: 212000, orders: 156 },
// //   { month: "Mar", revenue: 278000, orders: 198 },
// // ];

// // const STATUS_STYLES = {
// //   Delivered:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
// //   Shipped:     "bg-blue-50 text-blue-700 border border-blue-200",
// //   Processing:  "bg-amber-50 text-amber-700 border border-amber-200",
// //   Pending:     "bg-gray-50 text-gray-600 border border-gray-200",
// //   Cancelled:   "bg-red-50 text-red-600 border border-red-200",
// // };

// // const CATEGORIES = ["Fashion", "Footwear", "Watches", "Accessories", "Bags", "Sunglasses", "Ethnic Wear", "Activewear"];

// // // ── Mini Chart ─────────────────────────────────────────────────────
// // const SparkBar = ({ data, color = "#7c3aed" }) => {
// //   const max = Math.max(...data);
// //   return (
// //     <div className="flex items-end gap-0.5 h-10">
// //       {data.map((v, i) => (
// //         <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${(v / max) * 100}%`, background: color, opacity: i === data.length - 1 ? 1 : 0.35 + (i / data.length) * 0.5 }} />
// //       ))}
// //     </div>
// //   );
// // };

// // // ── Add/Edit Product Modal ─────────────────────────────────────────
// // const ProductModal = ({ product, onSave, onClose }) => {
// //   const [form, setForm] = useState(product || {
// //     name: "", category: "Fashion", brand: "", price: "", originalPrice: "",
// //     gender: "Unisex", badge: "", description: "", material: "", care: "",
// //     sizes: "", colors: "", image: "", sku: "",
// //   });

// //   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

// //   return (
// //     <div className="fixed inset-0 z-[200] flex items-center justify-center">
// //       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
// //       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 z-10">

// //         {/* Header */}
// //         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
// //           <div>
// //             <h2 className="font-semibold text-gray-900 text-lg">{product ? "Edit Product" : "Add New Product"}</h2>
// //             <p className="text-xs text-gray-400 mt-0.5">Fill in the product details below</p>
// //           </div>
// //           <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-sm">✕</button>
// //         </div>

// //         <div className="p-6 space-y-5">
// //           {/* Row 1 */}
// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="col-span-2">
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
// //               <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Silk Noir Dress"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Brand *</label>
// //               <input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Brand name"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
// //               <select value={form.category} onChange={(e) => set("category", e.target.value)}
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 bg-white transition-all">
// //                 {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
// //               </select>
// //             </div>
// //           </div>

// //           {/* Pricing */}
// //           <div className="grid grid-cols-3 gap-4">
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Selling Price ₹ *</label>
// //               <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="4999"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">MRP ₹ *</label>
// //               <input type="number" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} placeholder="7999"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Badge</label>
// //               <input value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="New / Hot / etc"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //           </div>

// //           {/* Variants */}
// //           <div className="grid grid-cols-3 gap-4">
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sizes (comma separated)</label>
// //               <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="S, M, L, XL"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Colors (comma separated)</label>
// //               <input value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Black, White, Red"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
// //               <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 bg-white transition-all">
// //                 {["Men", "Women", "Unisex"].map((g) => <option key={g}>{g}</option>)}
// //               </select>
// //             </div>
// //           </div>

// //           {/* Image & SKU */}
// //           <div className="grid grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Image URL</label>
// //               <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..."
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SKU</label>
// //               <input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="LYR-XX-001"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //           </div>

// //           {/* Description */}
// //           <div>
// //             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
// //             <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Product description..."
// //               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none" />
// //           </div>

// //           <div className="grid grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Material</label>
// //               <input value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="e.g. 100% Cotton"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Care Instructions</label>
// //               <input value={form.care} onChange={(e) => set("care", e.target.value)} placeholder="e.g. Machine wash cold"
// //                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="flex gap-3 px-6 py-5 border-t border-gray-100 sticky bottom-0 bg-white">
// //           <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">Cancel</button>
// //           <button onClick={() => onSave(form)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-200 transition-all">
// //             {product ? "Save Changes" : "Add Product"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // ══════════════════════════════════════════════════════════════════
// // // MAIN ADMIN PANEL
// // // ══════════════════════════════════════════════════════════════════
// // const AdminPanel = () => {
// //   const [section,       setSection]       = useState("dashboard");
// //   const [products,      setProducts]      = useState(ALL_PRODUCTS);
// //   const [orders,        setOrders]        = useState(MOCK_ORDERS);
// //   const [customers,     setCustomers]     = useState(MOCK_CUSTOMERS);
// //   const [productModal,  setProductModal]  = useState(null); // null | "new" | product obj
// //   const [deleteConfirm, setDeleteConfirm] = useState(null);
// //   const [orderFilter,   setOrderFilter]   = useState("All");
// //   const [searchQuery,   setSearchQuery]   = useState("");
// //   const [sidebarOpen,   setSidebarOpen]   = useState(true);
// //   const [notification,  setNotification]  = useState("");
// //   const [editingOrder,  setEditingOrder]  = useState(null);

// //   const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(""), 3000); };

// //   const handleSaveProduct = (form) => {
// //     const parsed = {
// //       ...form,
// //       id: form.id || Date.now(),
// //       price: Number(form.price),
// //       originalPrice: Number(form.originalPrice),
// //       rating: form.rating || 4.0,
// //       reviews: form.reviews || 0,
// //       sizes:  typeof form.sizes  === "string" ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)  : form.sizes,
// //       colors: typeof form.colors === "string" ? form.colors.split(",").map((c) => c.trim()).filter(Boolean) : form.colors,
// //       images: [form.image],
// //     };
// //     if (form.id) {
// //       setProducts((p) => p.map((x) => x.id === form.id ? parsed : x));
// //       notify("Product updated successfully!");
// //     } else {
// //       setProducts((p) => [...p, parsed]);
// //       notify("Product added successfully!");
// //     }
// //     setProductModal(null);
// //   };

// //   const handleDeleteProduct = (id) => {
// //     setProducts((p) => p.filter((x) => x.id !== id));
// //     setDeleteConfirm(null);
// //     notify("Product deleted.");
// //   };

// //   const handleUpdateOrderStatus = (orderId, status) => {
// //     setOrders((o) => o.map((x) => x.id === orderId ? { ...x, status } : x));
// //     setEditingOrder(null);
// //     notify(`Order ${orderId} status updated to ${status}`);
// //   };

// //   // Stats
// //   const totalRevenue  = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
// //   const totalOrders   = orders.length;
// //   const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
// //   const totalProducts = products.length;

// //   const filteredOrders = useMemo(() => {
// //     let o = orders;
// //     if (orderFilter !== "All") o = o.filter((x) => x.status === orderFilter);
// //     if (searchQuery) o = o.filter((x) => x.customer.toLowerCase().includes(searchQuery.toLowerCase()) || x.id.toLowerCase().includes(searchQuery.toLowerCase()));
// //     return o;
// //   }, [orders, orderFilter, searchQuery]);

// //   const filteredProducts = useMemo(() => {
// //     if (!searchQuery) return products;
// //     return products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
// //   }, [products, searchQuery]);

// //   const filteredCustomers = useMemo(() => {
// //     if (!searchQuery) return customers;
// //     return customers.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));
// //   }, [customers, searchQuery]);

// //   const NAV = [
// //     { id: "dashboard", icon: "◈",  label: "Dashboard" },
// //     { id: "orders",    icon: "◉",  label: "Orders",    badge: pendingOrders },
// //     { id: "products",  icon: "▦",  label: "Products",  badge: totalProducts },
// //     { id: "customers", icon: "◎",  label: "Customers" },
// //     { id: "analytics", icon: "◈",  label: "Analytics" },
// //     { id: "settings",  icon: "◍",  label: "Settings" },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-[#0f0a1a] flex font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

// //       {/* ══ SIDEBAR ══ */}
// //       <aside className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-[#130d24] border-r border-white/5 flex flex-col transition-all duration-300 sticky top-0 h-screen`}>

// //         {/* Logo */}
// //         <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
// //           {sidebarOpen && (
// //             <div className="flex items-center gap-2">
// //               <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">L</div>
// //               <div>
// //                 <p className="text-white font-bold text-sm tracking-widest">LYRA</p>
// //                 <p className="text-white/30 text-xs -mt-0.5">Admin Console</p>
// //               </div>
// //             </div>
// //           )}
// //           <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`${sidebarOpen ? "ml-auto" : "mx-auto"} w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs`}>
// //             {sidebarOpen ? "◀" : "▶"}
// //           </button>
// //         </div>

// //         {/* Nav */}
// //         <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
// //           {NAV.map((item) => (
// //             <button key={item.id} onClick={() => { setSection(item.id); setSearchQuery(""); }}
// //               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
// //                 section === item.id
// //                   ? "bg-gradient-to-r from-violet-600/30 to-purple-600/20 text-violet-300 border border-violet-500/20"
// //                   : "text-white/40 hover:text-white/70 hover:bg-white/5"
// //               }`}>
// //               <span className={`text-lg flex-shrink-0 ${section === item.id ? "text-violet-400" : ""}`}>{item.icon}</span>
// //               {sidebarOpen && (
// //                 <>
// //                   <span className="flex-1 text-left">{item.label}</span>
// //                   {item.badge > 0 && (
// //                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${section === item.id ? "bg-violet-500 text-white" : "bg-white/10 text-white/50"}`}>{item.badge}</span>
// //                   )}
// //                 </>
// //               )}
// //               {!sidebarOpen && item.badge > 0 && (
// //                 <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{item.badge}</span>
// //               )}
// //             </button>
// //           ))}
// //         </nav>

// //         {/* Admin info */}
// //         {sidebarOpen && (
// //           <div className="px-4 py-4 border-t border-white/5">
// //             <div className="flex items-center gap-3">
// //               <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
// //               <div className="min-w-0">
// //                 <p className="text-white text-xs font-semibold truncate">Admin</p>
// //                 <p className="text-white/30 text-xs truncate">admin@lyra.com</p>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </aside>

// //       {/* ══ MAIN ══ */}
// //       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

// //         {/* Top bar */}
// //         <header className="h-16 bg-[#130d24] border-b border-white/5 flex items-center gap-4 px-6 flex-shrink-0">
// //           <div>
// //             <h1 className="text-white font-bold text-base capitalize">{section}</h1>
// //             <p className="text-white/30 text-xs">Lyra Admin Console · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
// //           </div>
// //           <div className="ml-auto flex items-center gap-3">
// //             {/* Search */}
// //             {["orders","products","customers"].includes(section) && (
// //               <div className="relative">
// //                 <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
// //                   placeholder={`Search ${section}...`}
// //                   className="w-56 bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all" />
// //                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">⌕</span>
// //               </div>
// //             )}
// //             {/* Notification bell */}
// //             <div className="relative w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
// //               <span className="text-white/50 text-lg">🔔</span>
// //               <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{pendingOrders}</span>
// //             </div>
// //           </div>
// //         </header>

// //         {/* Notification toast */}
// //         {notification && (
// //           <div className="fixed top-4 right-4 z-[300] bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
// //             ✓ {notification}
// //           </div>
// //         )}

// //         <main className="flex-1 overflow-y-auto p-6">

// //           {/* ════ DASHBOARD SECTION ════ */}
// //           {section === "dashboard" && (
// //             <div className="space-y-6">

// //               {/* KPI Cards */}
// //               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //                 {[
// //                   { label: "Total Revenue",    value: `₹${(totalRevenue / 100000).toFixed(1)}L`,   sub: "+12.4% this month", icon: "💰", color: "from-violet-600 to-purple-600",  chart: REVENUE_DATA.map((r) => r.revenue / 1000) },
// //                   { label: "Total Orders",     value: totalOrders,    sub: "+8 today",              icon: "📦", color: "from-blue-600 to-cyan-600",      chart: [12,18,14,22,19,25,21,28] },
// //                   { label: "Active Products",  value: totalProducts,  sub: "Across 8 categories",   icon: "🛍", color: "from-emerald-600 to-teal-600",   chart: [5,8,6,10,8,12,10,14] },
// //                   { label: "Total Customers",  value: customers.length, sub: "+3 new this week",    icon: "👥", color: "from-pink-600 to-rose-600",      chart: [8,11,9,14,12,16,14,18] },
// //                 ].map((kpi) => (
// //                   <div key={kpi.label} className={`bg-gradient-to-br ${kpi.color} p-5 rounded-2xl relative overflow-hidden`}>
// //                     <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 20%, white, transparent 60%)" }} />
// //                     <div className="relative">
// //                       <div className="flex items-start justify-between mb-3">
// //                         <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{kpi.label}</p>
// //                         <span className="text-2xl">{kpi.icon}</span>
// //                       </div>
// //                       <p className="text-white text-3xl font-bold mb-1">{kpi.value}</p>
// //                       <p className="text-white/60 text-xs mb-3">{kpi.sub}</p>
// //                       <SparkBar data={kpi.chart} color="rgba(255,255,255,0.7)" />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Revenue Chart */}
// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
// //                 <div className="flex items-center justify-between mb-6">
// //                   <div>
// //                     <h3 className="text-white font-semibold">Revenue Overview</h3>
// //                     <p className="text-white/30 text-xs mt-0.5">Last 6 months performance</p>
// //                   </div>
// //                   <span className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/20">Last 6 months</span>
// //                 </div>
// //                 <div className="flex items-end gap-3 h-40">
// //                   {REVENUE_DATA.map((d, i) => {
// //                     const max = Math.max(...REVENUE_DATA.map((r) => r.revenue));
// //                     const h   = (d.revenue / max) * 100;
// //                     return (
// //                       <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
// //                         <div className="w-full relative rounded-lg overflow-hidden" style={{ height: "120px", background: "rgba(255,255,255,0.04)" }}>
// //                           <div className="absolute bottom-0 w-full rounded-lg transition-all duration-500 group-hover:opacity-100"
// //                             style={{ height: `${h}%`, background: i === REVENUE_DATA.length - 1 ? "linear-gradient(to top, #7c3aed, #a855f7)" : "linear-gradient(to top, #3b0764, #6d28d9)" }}>
// //                             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(to top, #7c3aed, #c084fc)" }} />
// //                           </div>
// //                         </div>
// //                         <span className="text-white/30 text-xs">{d.month}</span>
// //                         <span className="text-white/50 text-xs hidden group-hover:block absolute -mt-16 bg-[#1e0a3c] border border-violet-500/20 px-2 py-1 rounded-lg">₹{(d.revenue/1000).toFixed(0)}K</span>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>

// //               {/* Bottom row */}
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

// //                 {/* Recent orders */}
// //                 <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
// //                   <div className="flex items-center justify-between mb-4">
// //                     <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
// //                     <button onClick={() => setSection("orders")} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</button>
// //                   </div>
// //                   <div className="space-y-3">
// //                     {orders.slice(0, 4).map((o) => (
// //                       <div key={o.id} className="flex items-center gap-3">
// //                         <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0">
// //                           {o.customer.charAt(0)}
// //                         </div>
// //                         <div className="flex-1 min-w-0">
// //                           <p className="text-white text-xs font-medium truncate">{o.customer}</p>
// //                           <p className="text-white/30 text-xs">{o.id} · {o.date}</p>
// //                         </div>
// //                         <div className="text-right flex-shrink-0">
// //                           <p className="text-white text-xs font-bold">₹{o.total.toLocaleString()}</p>
// //                           <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Top products */}
// //                 <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
// //                   <div className="flex items-center justify-between mb-4">
// //                     <h3 className="text-white font-semibold text-sm">Top Products</h3>
// //                     <button onClick={() => setSection("products")} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</button>
// //                   </div>
// //                   <div className="space-y-3">
// //                     {products.sort((a, b) => b.reviews - a.reviews).slice(0, 4).map((p) => {
// //                       const disc = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
// //                       return (
// //                         <div key={p.id} className="flex items-center gap-3">
// //                           <img src={p.image || p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-white/5 flex-shrink-0"
// //                             onError={(e) => { e.target.src = "https://placehold.co/40x40/1e0a3c/a855f7?text=L"; }} />
// //                           <div className="flex-1 min-w-0">
// //                             <p className="text-white text-xs font-medium truncate">{p.name}</p>
// //                             <p className="text-white/30 text-xs">{p.category} · {p.reviews.toLocaleString()} reviews</p>
// //                           </div>
// //                           <div className="text-right flex-shrink-0">
// //                             <p className="text-white text-xs font-bold">₹{p.price.toLocaleString()}</p>
// //                             <p className="text-emerald-400 text-xs">{disc}% off</p>
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Order status distribution */}
// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
// //                 <h3 className="text-white font-semibold text-sm mb-4">Order Status Distribution</h3>
// //                 <div className="grid grid-cols-5 gap-3">
// //                   {Object.entries(
// //                     orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {})
// //                   ).map(([status, count]) => (
// //                     <div key={status} className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-violet-500/20 transition-all">
// //                       <p className="text-white font-bold text-xl mb-1">{count}</p>
// //                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>{status}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* ════ ORDERS SECTION ════ */}
// //           {section === "orders" && (
// //             <div className="space-y-4">
// //               {/* Filter pills */}
// //               <div className="flex items-center gap-2 flex-wrap">
// //                 {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((f) => (
// //                   <button key={f} onClick={() => setOrderFilter(f)}
// //                     className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${orderFilter === f ? "bg-violet-600 text-white border-violet-600" : "bg-white/5 text-white/50 border-white/10 hover:border-violet-500/30 hover:text-white/70"}`}>
// //                     {f} {f === "All" ? `(${orders.length})` : `(${orders.filter((o) => o.status === f).length})`}
// //                   </button>
// //                 ))}
// //               </div>

// //               {/* Orders table */}
// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
// //                 <table className="w-full">
// //                   <thead>
// //                     <tr className="border-b border-white/5">
// //                       {["Order ID", "Customer", "Date", "Items", "Total", "Payment", "Status", "Actions"].map((h) => (
// //                         <th key={h} className="text-left px-4 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-white/5">
// //                     {filteredOrders.map((order) => (
// //                       <tr key={order.id} className="hover:bg-white/3 transition-colors group">
// //                         <td className="px-4 py-3.5">
// //                           <span className="font-mono text-violet-400 text-xs font-bold">{order.id}</span>
// //                         </td>
// //                         <td className="px-4 py-3.5">
// //                           <div>
// //                             <p className="text-white text-xs font-medium">{order.customer}</p>
// //                             <p className="text-white/30 text-xs">{order.city}</p>
// //                           </div>
// //                         </td>
// //                         <td className="px-4 py-3.5 text-white/40 text-xs">{order.date}</td>
// //                         <td className="px-4 py-3.5 text-white/60 text-xs">{order.items}</td>
// //                         <td className="px-4 py-3.5 text-white text-xs font-bold">₹{order.total.toLocaleString()}</td>
// //                         <td className="px-4 py-3.5 text-white/50 text-xs">{order.payment}</td>
// //                         <td className="px-4 py-3.5">
// //                           {editingOrder === order.id ? (
// //                             <select onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)} defaultValue={order.status}
// //                               className="bg-[#1e0a3c] border border-violet-500/30 text-white text-xs rounded-lg px-2 py-1 outline-none">
// //                               {["Pending","Processing","Shipped","Delivered","Cancelled"].map((s) => <option key={s}>{s}</option>)}
// //                             </select>
// //                           ) : (
// //                             <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
// //                           )}
// //                         </td>
// //                         <td className="px-4 py-3.5">
// //                           <div className="flex gap-2">
// //                             <button onClick={() => setEditingOrder(editingOrder === order.id ? null : order.id)}
// //                               className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors">
// //                               {editingOrder === order.id ? "Cancel" : "Edit"}
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //                 {filteredOrders.length === 0 && (
// //                   <div className="text-center py-12 text-white/30 text-sm">No orders found</div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* ════ PRODUCTS SECTION ════ */}
// //           {section === "products" && (
// //             <div className="space-y-4">
// //               <div className="flex items-center justify-between">
// //                 <p className="text-white/40 text-sm">{filteredProducts.length} products</p>
// //                 <button onClick={() => setProductModal("new")}
// //                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-900/50 transition-all">
// //                   + Add Product
// //                 </button>
// //               </div>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
// //                 {filteredProducts.map((p) => {
// //                   const disc = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
// //                   return (
// //                     <div key={p.id} className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/20 transition-all group">
// //                       <div className="flex gap-4 p-4">
// //                         <img src={p.image || p.images?.[0]} alt={p.name}
// //                           className="w-20 h-20 rounded-xl object-cover bg-white/5 flex-shrink-0"
// //                           onError={(e) => { e.target.src = "https://placehold.co/80x80/1e0a3c/a855f7?text=L"; }} />
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-start justify-between gap-2">
// //                             <div>
// //                               {p.badge && <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20 font-semibold">{p.badge}</span>}
// //                               <p className="text-white text-sm font-semibold mt-1 truncate">{p.name}</p>
// //                               <p className="text-white/30 text-xs">{p.brand} · {p.category}</p>
// //                             </div>
// //                           </div>
// //                           <div className="flex items-center gap-2 mt-2">
// //                             <span className="text-white font-bold text-sm">₹{p.price.toLocaleString()}</span>
// //                             <span className="text-white/30 text-xs line-through">₹{p.originalPrice.toLocaleString()}</span>
// //                             <span className="text-emerald-400 text-xs font-semibold">{disc}% off</span>
// //                           </div>
// //                           <div className="flex items-center gap-3 mt-2">
// //                             <span className="text-amber-400 text-xs">★ {p.rating}</span>
// //                             <span className="text-white/30 text-xs">{p.reviews.toLocaleString()} reviews</span>
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <div className="flex gap-2 px-4 pb-4">
// //                         <button onClick={() => setProductModal(p)}
// //                           className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-violet-500/20 hover:text-violet-300 transition-all border border-white/5">
// //                           ✏️ Edit
// //                         </button>
// //                         <button onClick={() => setDeleteConfirm(p.id)}
// //                           className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5">
// //                           🗑 Delete
// //                         </button>
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </div>
// //           )}

// //           {/* ════ CUSTOMERS SECTION ════ */}
// //           {section === "customers" && (
// //             <div className="space-y-4">
// //               <p className="text-white/40 text-sm">{filteredCustomers.length} customers</p>
// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
// //                 <table className="w-full">
// //                   <thead>
// //                     <tr className="border-b border-white/5">
// //                       {["Customer", "Email", "Phone", "City", "Orders", "Total Spent", "Joined", "Status"].map((h) => (
// //                         <th key={h} className="text-left px-4 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-white/5">
// //                     {filteredCustomers.map((c) => (
// //                       <tr key={c.id} className="hover:bg-white/3 transition-colors">
// //                         <td className="px-4 py-3.5">
// //                           <div className="flex items-center gap-2.5">
// //                             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
// //                               {c.name.charAt(0)}
// //                             </div>
// //                             <span className="text-white text-xs font-medium">{c.name}</span>
// //                           </div>
// //                         </td>
// //                         <td className="px-4 py-3.5 text-white/40 text-xs">{c.email}</td>
// //                         <td className="px-4 py-3.5 text-white/40 text-xs">{c.phone}</td>
// //                         <td className="px-4 py-3.5 text-white/40 text-xs">{c.city}</td>
// //                         <td className="px-4 py-3.5 text-white text-xs font-bold">{c.orders}</td>
// //                         <td className="px-4 py-3.5 text-emerald-400 text-xs font-bold">₹{c.spent.toLocaleString()}</td>
// //                         <td className="px-4 py-3.5 text-white/30 text-xs">{c.joined}</td>
// //                         <td className="px-4 py-3.5">
// //                           <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
// //                             c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
// //                             c.status === "New"    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
// //                                                    "bg-gray-500/10 text-gray-400 border border-gray-500/20"
// //                           }`}>{c.status}</span>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}

// //           {/* ════ ANALYTICS SECTION ════ */}
// //           {section === "analytics" && (
// //             <div className="space-y-6">
// //               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //                 {[
// //                   { label: "Conversion Rate",    value: "3.8%",  trend: "+0.5%",  up: true },
// //                   { label: "Avg Order Value",     value: "₹7,240", trend: "+12%", up: true },
// //                   { label: "Return Rate",         value: "4.2%",  trend: "-0.8%", up: true },
// //                   { label: "Customer Sat. Score", value: "4.6/5", trend: "+0.2",  up: true },
// //                 ].map((m) => (
// //                   <div key={m.label} className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
// //                     <p className="text-white/30 text-xs uppercase tracking-wider mb-2">{m.label}</p>
// //                     <p className="text-white text-2xl font-bold">{m.value}</p>
// //                     <p className={`text-xs font-semibold mt-1 ${m.up ? "text-emerald-400" : "text-red-400"}`}>{m.trend} vs last month</p>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Category performance */}
// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
// //                 <h3 className="text-white font-semibold mb-5">Category Performance</h3>
// //                 <div className="space-y-4">
// //                   {[
// //                     { cat: "Fashion",     pct: 82, revenue: 98000,  color: "#7c3aed" },
// //                     { cat: "Footwear",    pct: 68, revenue: 76500,  color: "#2563eb" },
// //                     { cat: "Watches",     pct: 54, revenue: 64200,  color: "#d97706" },
// //                     { cat: "Accessories", pct: 43, revenue: 48700,  color: "#db2777" },
// //                     { cat: "Bags",        pct: 37, revenue: 39800,  color: "#059669" },
// //                     { cat: "Ethnic Wear", pct: 29, revenue: 31200,  color: "#dc2626" },
// //                     { cat: "Sunglasses",  pct: 21, revenue: 22600,  color: "#0891b2" },
// //                     { cat: "Activewear",  pct: 18, revenue: 19400,  color: "#7c3aed" },
// //                   ].map((item) => (
// //                     <div key={item.cat} className="flex items-center gap-4">
// //                       <span className="text-white/60 text-xs w-28 flex-shrink-0">{item.cat}</span>
// //                       <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
// //                         <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.pct}%`, background: item.color }} />
// //                       </div>
// //                       <span className="text-white/40 text-xs w-16 text-right flex-shrink-0">₹{(item.revenue / 1000).toFixed(1)}K</span>
// //                       <span className="text-white/20 text-xs w-8 text-right flex-shrink-0">{item.pct}%</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Monthly orders & revenue table */}
// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
// //                 <div className="px-6 py-4 border-b border-white/5">
// //                   <h3 className="text-white font-semibold">Monthly Summary</h3>
// //                 </div>
// //                 <table className="w-full">
// //                   <thead>
// //                     <tr className="border-b border-white/5">
// //                       {["Month", "Orders", "Revenue", "Avg Order", "Growth"].map((h) => (
// //                         <th key={h} className="text-left px-6 py-3 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-white/5">
// //                     {REVENUE_DATA.map((d, i) => {
// //                       const prev    = REVENUE_DATA[i - 1];
// //                       const growth  = prev ? (((d.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : null;
// //                       const isLast  = i === REVENUE_DATA.length - 1;
// //                       return (
// //                         <tr key={d.month} className={`hover:bg-white/3 transition-colors ${isLast ? "bg-violet-500/5" : ""}`}>
// //                           <td className="px-6 py-3 text-white text-sm font-medium">{d.month} 2026</td>
// //                           <td className="px-6 py-3 text-white/60 text-sm">{d.orders}</td>
// //                           <td className="px-6 py-3 text-white text-sm font-bold">₹{d.revenue.toLocaleString()}</td>
// //                           <td className="px-6 py-3 text-white/60 text-sm">₹{Math.round(d.revenue / d.orders).toLocaleString()}</td>
// //                           <td className="px-6 py-3">
// //                             {growth ? <span className={`text-sm font-semibold ${Number(growth) >= 0 ? "text-emerald-400" : "text-red-400"}`}>{Number(growth) >= 0 ? "+" : ""}{growth}%</span> : <span className="text-white/20 text-sm">—</span>}
// //                           </td>
// //                         </tr>
// //                       );
// //                     })}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}

// //           {/* ════ SETTINGS SECTION ════ */}
// //           {section === "settings" && (
// //             <div className="max-w-2xl space-y-5">
// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
// //                 <h3 className="text-white font-semibold mb-5">Store Settings</h3>
// //                 <div className="space-y-4">
// //                   {[
// //                     { label: "Store Name",    val: "Lyra Fashion",       type: "text" },
// //                     { label: "Support Email", val: "support@lyra.com",   type: "email" },
// //                     { label: "Support Phone", val: "+91 98765 43210",     type: "tel" },
// //                     { label: "GST Number",    val: "29AABCT1332L1Z1",    type: "text" },
// //                   ].map(({ label, val, type }) => (
// //                     <div key={label}>
// //                       <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">{label}</label>
// //                       <input type={type} defaultValue={val}
// //                         className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/50 transition-all" />
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
// //                 <h3 className="text-white font-semibold mb-5">Notifications</h3>
// //                 <div className="space-y-3">
// //                   {[
// //                     { label: "New Order Alerts",       sub: "Receive email for each new order",   on: true },
// //                     { label: "Low Stock Alerts",        sub: "Alert when stock falls below 10",    on: true },
// //                     { label: "Customer Review Alerts",  sub: "Get notified of new reviews",        on: false },
// //                     { label: "Weekly Revenue Report",   sub: "Summary sent every Monday morning",  on: true },
// //                   ].map((n, i) => (
// //                     <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
// //                       <div>
// //                         <p className="text-white text-sm font-medium">{n.label}</p>
// //                         <p className="text-white/30 text-xs">{n.sub}</p>
// //                       </div>
// //                       <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${n.on ? "bg-violet-600" : "bg-white/10"}`}>
// //                         <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${n.on ? "left-5.5 translate-x-0.5" : "left-0.5"}`} style={{ left: n.on ? "calc(100% - 22px)" : "2px" }} />
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
// //                 <h3 className="text-white font-semibold mb-5">Delivery Settings</h3>
// //                 <div className="space-y-4">
// //                   {[
// //                     { label: "Free Delivery Threshold (₹)", val: "999" },
// //                     { label: "Standard Delivery Fee (₹)",    val: "60" },
// //                     { label: "Express Delivery Fee (₹)",     val: "150" },
// //                     { label: "Estimated Delivery Days",       val: "5-7" },
// //                   ].map(({ label, val }) => (
// //                     <div key={label}>
// //                       <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">{label}</label>
// //                       <input defaultValue={val}
// //                         className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/50 transition-all" />
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <button onClick={() => notify("Settings saved successfully!")}
// //                 className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-900/50 transition-all">
// //                 Save All Settings
// //               </button>
// //             </div>
// //           )}

// //         </main>
// //       </div>

// //       {/* Product Modal */}
// //       {productModal && (
// //         <ProductModal
// //           product={productModal === "new" ? null : productModal}
// //           onSave={handleSaveProduct}
// //           onClose={() => setProductModal(null)}
// //         />
// //       )}

// //       {/* Delete Confirm */}
// //       {deleteConfirm && (
// //         <div className="fixed inset-0 z-[200] flex items-center justify-center">
// //           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
// //           <div className="relative bg-[#1a0d35] border border-white/10 rounded-2xl p-8 w-96 mx-4 text-center z-10">
// //             <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <span className="text-2xl">🗑</span>
// //             </div>
// //             <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
// //             <p className="text-white/40 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
// //             <div className="flex gap-3">
// //               <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5 transition-all">Cancel</button>
// //               <button onClick={() => handleDeleteProduct(deleteConfirm)} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all">Delete</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminPanel;

// import React, { useState, useMemo, useEffect, useCallback } from "react";

// // ── API Configuration ─────────────────────────────────────────────
// const API_BASE = "http://localhost:6055/api/admin";

// // Shared fetch helper — attaches auth token, returns parsed JSON
// const apiFetch = async (path, options = {}) => {
//   const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const token = user.token || "";
//   const res   = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//       ...(options.headers || {}),
//     },
//   });
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || err.error || `HTTP ${res.status}`);
//   }
//   return res.json();
// };

// // ── Constants ─────────────────────────────────────────────────────
// const STATUS_STYLES = {
//   Delivered:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
//   Shipped:    "bg-blue-50 text-blue-700 border border-blue-200",
//   Processing: "bg-amber-50 text-amber-700 border border-amber-200",
//   Pending:    "bg-gray-50 text-gray-600 border border-gray-200",
//   Cancelled:  "bg-red-50 text-red-600 border border-red-200",
// };

// const CATEGORIES = ["Fashion","Footwear","Watches","Accessories","Bags","Sunglasses","Ethnic Wear","Activewear"];

// // ── Mini Sparkbar ─────────────────────────────────────────────────
// const SparkBar = ({ data = [], color = "#7c3aed" }) => {
//   if (!data.length) return null;
//   const max = Math.max(...data, 1);
//   return (
//     <div className="flex items-end gap-0.5 h-10">
//       {data.map((v, i) => (
//         <div key={i} className="flex-1 rounded-sm transition-all"
//           style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.35 + (i / data.length) * 0.65 }} />
//       ))}
//     </div>
//   );
// };

// // ── Loading Skeleton ──────────────────────────────────────────────
// const Skeleton = ({ className = "" }) => (
//   <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
// );

// // ── Error Banner ──────────────────────────────────────────────────
// const ErrorBanner = ({ msg, onRetry }) => (
//   <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
//     <span>⚠</span>
//     <span className="flex-1">{msg}</span>
//     {onRetry && <button onClick={onRetry} className="text-xs underline hover:text-red-300">Retry</button>}
//   </div>
// );

// // ── Add/Edit Product Modal ─────────────────────────────────────────
// const ProductModal = ({ product, onSave, onClose }) => {
//   const [form, setForm] = useState(product
//     ? {
//         ...product,
//         sizes:  Array.isArray(product.sizes)  ? product.sizes.join(", ")  : product.sizes  || "",
//         colors: Array.isArray(product.colors) ? product.colors.join(", ") : product.colors || "",
//       }
//     : {
//         name: "", category: "Fashion", brand: "", price: "", originalPrice: "",
//         gender: "Unisex", badge: "", description: "", material: "", care: "",
//         sizes: "", colors: "", image: "", sku: "",
//       });
//   const [saving, setSaving] = useState(false);

//   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

//   const handleSave = async () => {
//     setSaving(true);
//     try { await onSave(form); }
//     finally { setSaving(false); }
//   };

//   return (
//     <div className="fixed inset-0 z-[200] flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 z-10">

//         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
//           <div>
//             <h2 className="font-semibold text-gray-900 text-lg">{product ? "Edit Product" : "Add New Product"}</h2>
//             <p className="text-xs text-gray-400 mt-0.5">Fill in the product details below</p>
//           </div>
//           <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-sm">✕</button>
//         </div>

//         <div className="p-6 space-y-5">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-2">
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
//               <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Silk Noir Dress"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Brand *</label>
//               <input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Brand name"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
//               <select value={form.category} onChange={(e) => set("category", e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 bg-white transition-all">
//                 {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Selling Price ₹ *</label>
//               <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="4999"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">MRP ₹ *</label>
//               <input type="number" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} placeholder="7999"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Badge</label>
//               <input value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="New / Hot / etc"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sizes (comma-separated)</label>
//               <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="S, M, L, XL"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Colors (comma-separated)</label>
//               <input value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Black, White, Red"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
//               <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 bg-white transition-all">
//                 {["Men","Women","Unisex"].map((g) => <option key={g}>{g}</option>)}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Image URL</label>
//               <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..."
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SKU</label>
//               <input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="LYR-XX-001"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
//             <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Product description..."
//               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none" />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Material</label>
//               <input value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="e.g. 100% Cotton"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Care Instructions</label>
//               <input value={form.care} onChange={(e) => set("care", e.target.value)} placeholder="e.g. Machine wash cold"
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3 px-6 py-5 border-t border-gray-100 sticky bottom-0 bg-white">
//           <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">Cancel</button>
//           <button onClick={handleSave} disabled={saving}
//             className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-60">
//             {saving ? "Saving…" : product ? "Save Changes" : "Add Product"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // MAIN ADMIN PANEL
// // ══════════════════════════════════════════════════════════════════
// const AdminPanel = () => {
//   const [section,       setSection]       = useState("dashboard");
//   const [sidebarOpen,   setSidebarOpen]   = useState(true);
//   const [notification,  setNotification]  = useState("");
//   const [notifType,     setNotifType]     = useState("success"); // "success" | "error"

//   // ── Data state ──
//   const [products,      setProducts]      = useState([]);
//   const [orders,        setOrders]        = useState([]);
//   const [customers,     setCustomers]     = useState([]);
//   const [analytics,     setAnalytics]     = useState(null);
//   const [settings,      setSettings]      = useState(null);

//   // ── Loading / error per section ──
//   const [loading,  setLoading]  = useState({});
//   const [errors,   setErrors]   = useState({});

//   // ── UI state ──
//   const [productModal,  setProductModal]  = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [orderFilter,   setOrderFilter]   = useState("All");
//   const [searchQuery,   setSearchQuery]   = useState("");
//   const [editingOrder,  setEditingOrder]  = useState(null);

//   // ─────────────────────────────────────────────────────────────────
//   const notify = (msg, type = "success") => {
//     setNotification(msg);
//     setNotifType(type);
//     setTimeout(() => setNotification(""), 3500);
//   };

//   const setLoad  = (key, val) => setLoading((s) => ({ ...s, [key]: val }));
//   const setError = (key, val) => setErrors((s)  => ({ ...s, [key]: val }));

//   // ─────────────────────────────────────────────────────────────────
//   // DATA FETCHERS
//   // ─────────────────────────────────────────────────────────────────

//   // GET /api/admin/products  — expects: array or { products: [...] }
//   const fetchProducts = useCallback(async () => {
//     setLoad("products", true); setError("products", null);
//     try {
//       const data = await apiFetch("/products");
//       setProducts(Array.isArray(data) ? data : (data.products || []));
//     } catch (e) {
//       setError("products", e.message);
//     } finally {
//       setLoad("products", false);
//     }
//   }, []);

//   // GET /api/admin/orders  — expects: array or { orders: [...] }
//   const fetchOrders = useCallback(async () => {
//     setLoad("orders", true); setError("orders", null);
//     try {
//       const data = await apiFetch("/orders");
//       setOrders(Array.isArray(data) ? data : (data.orders || []));
//     } catch (e) {
//       setError("orders", e.message);
//     } finally {
//       setLoad("orders", false);
//     }
//   }, []);

//   // GET /api/admin/users  — expects: array of user/customer objects
//   const fetchCustomers = useCallback(async () => {
//     setLoad("customers", true); setError("customers", null);
//     try {
//       const data = await apiFetch("/users");
//       setCustomers(Array.isArray(data) ? data : (data.users || data.customers || []));
//     } catch (e) {
//       setError("customers", e.message);
//     } finally {
//       setLoad("customers", false);
//     }
//   }, []);

//   // GET /api/admin/dashboard — expects: { revenue, categories, metrics, ... }
//   const fetchAnalytics = useCallback(async () => {
//     setLoad("analytics", true); setError("analytics", null);
//     try {
//       const data = await apiFetch("/dashboard");
//       // Normalise: dashboard may return revenue/categories/metrics directly
//       setAnalytics({
//         revenue:    data.revenue    || data.revenueData    || [],
//         categories: data.categories || data.categoryData   || [],
//         metrics:    data.metrics    || {
//           conversionRate:   data.conversionRate,
//           avgOrderValue:    data.avgOrderValue    ? `₹${Number(data.avgOrderValue).toLocaleString()}` : null,
//           returnRate:       data.returnRate,
//           customerSatScore: data.customerSatScore,
//         },
//       });
//     } catch (e) {
//       setError("analytics", e.message);
//     } finally {
//       setLoad("analytics", false);
//     }
//   }, []);

//   // No /settings endpoint in backend — settings are managed locally
//   const fetchSettings = useCallback(async () => {
//     setLoad("settings", true);
//     // Pre-fill with defaults; extend this when you add a backend settings route
//     setSettingsForm({
//       storeName:              "Lyra Fashion",
//       supportEmail:           "support@lyra.com",
//       supportPhone:           "+91 98765 43210",
//       gstNumber:              "",
//       freeDeliveryThreshold:  "999",
//       standardDeliveryFee:    "60",
//       expressDeliveryFee:     "150",
//       estimatedDeliveryDays:  "5-7",
//       notifications: {
//         newOrderAlerts: true,
//         lowStockAlerts: true,
//         reviewAlerts:   false,
//         weeklyReport:   true,
//       },
//     });
//     setSettings(true); // marks as loaded
//     setLoad("settings", false);
//   }, []);

//   // Fetch dashboard data (orders + products + customers) on mount
//   useEffect(() => {
//     fetchOrders();
//     fetchProducts();
//     fetchCustomers();
//   }, [fetchOrders, fetchProducts, fetchCustomers]);

//   // Lazy-fetch analytics & settings when their tab is first opened
//   useEffect(() => {
//     if (section === "analytics" && !analytics && !loading.analytics) fetchAnalytics();
//     if (section === "settings"  && !settings  && !loading.settings)  fetchSettings();
//   }, [section]); // eslint-disable-line

//   // ─────────────────────────────────────────────────────────────────
//   // PRODUCTS CRUD
//   // ─────────────────────────────────────────────────────────────────

//   // POST /api/products       body: product fields   → returns created product
//   // PUT  /api/products/:id   body: product fields   → returns updated product
//   const handleSaveProduct = async (form) => {
//     const parsed = {
//       ...form,
//       price:         Number(form.price),
//       originalPrice: Number(form.originalPrice),
//       sizes:  typeof form.sizes  === "string" ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : form.sizes,
//       colors: typeof form.colors === "string" ? form.colors.split(",").map((c) => c.trim()).filter(Boolean) : form.colors,
//     };

//     try {
//       if (form._id || form.id) {
//         // PUT /api/admin/products/:id  — update existing product
//         const id      = form._id || form.id;
//         const updated = await apiFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(parsed) });
//         setProducts((prev) => prev.map((p) => (p._id || p.id) === id ? (updated?.product || updated || { ...parsed, _id: id }) : p));
//         notify("Product updated successfully!");
//       } else {
//         // POST /api/admin/products  — add new product
//         const created = await apiFetch("/products", { method: "POST", body: JSON.stringify(parsed) });
//         setProducts((prev) => [...prev, created?.product || created]);
//         notify("Product added successfully!");
//       }
//       setProductModal(null);
//     } catch (e) {
//       notify(`Failed to save product: ${e.message}`, "error");
//     }
//   };

//   // DELETE /api/products/:id
//   const handleDeleteProduct = async (id) => {
//     try {
//       await apiFetch(`/products/${id}`, { method: "DELETE" });
//       setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
//       setDeleteConfirm(null);
//       notify("Product deleted.");
//     } catch (e) {
//       notify(`Failed to delete: ${e.message}`, "error");
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────
//   // ORDERS — update status
//   // PUT /api/admin/orders/:id   body: { status }
//   // ─────────────────────────────────────────────────────────────────
//   const handleUpdateOrderStatus = async (orderId, status) => {
//     try {
//       await apiFetch(`/orders/${orderId}`, {
//         method: "PUT",
//         body:   JSON.stringify({ status }),
//       });
//       setOrders((prev) => prev.map((o) => (o._id || o.id) === orderId ? { ...o, status } : o));
//       setEditingOrder(null);
//       notify(`Order status updated to ${status}`);
//     } catch (e) {
//       notify(`Failed to update order: ${e.message}`, "error");
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────
//   // SETTINGS — local only (no backend route yet)
//   // ─────────────────────────────────────────────────────────────────
//   const [settingsForm, setSettingsForm] = useState({});
//   const [savingSettings, setSavingSettings] = useState(false);

//   useEffect(() => {
//     if (settings) setSettingsForm(settings);
//   }, [settings]);

//   const handleSaveSettings = () => {
//     // No backend /settings route yet — stores locally in component state
//     // When you add PUT /api/admin/settings, replace this body with an apiFetch call
//     setSavingSettings(true);
//     setTimeout(() => {
//       setSavingSettings(false);
//       notify("Settings saved locally! (Add PUT /api/admin/settings to persist)");
//     }, 600);
//   };

//   // ─────────────────────────────────────────────────────────────────
//   // DERIVED STATS
//   // ─────────────────────────────────────────────────────────────────
//   const totalRevenue  = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + (o.total || 0), 0);
//   const totalOrders   = orders.length;
//   const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
//   const totalProducts = products.length;

//   const filteredOrders = useMemo(() => {
//     let o = orders;
//     if (orderFilter !== "All") o = o.filter((x) => x.status === orderFilter);
//     if (searchQuery)           o = o.filter((x) => (x.customer || x.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) || (x._id || x.id || "").toLowerCase().includes(searchQuery.toLowerCase()));
//     return o;
//   }, [orders, orderFilter, searchQuery]);

//   const filteredProducts = useMemo(() => {
//     if (!searchQuery) return products;
//     return products.filter((p) =>
//       (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (p.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [products, searchQuery]);

//   const filteredCustomers = useMemo(() => {
//     if (!searchQuery) return customers;
//     return customers.filter((c) =>
//       (c.name || c.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [customers, searchQuery]);

//   const NAV = [
//     { id: "dashboard", icon: "◈", label: "Dashboard" },
//     { id: "orders",    icon: "◉", label: "Orders",   badge: pendingOrders },
//     { id: "products",  icon: "▦", label: "Products", badge: totalProducts },
//     { id: "customers", icon: "◎", label: "Customers" },
//     { id: "analytics", icon: "◈", label: "Analytics" },
//     { id: "settings",  icon: "◍", label: "Settings" },
//   ];

//   // Revenue chart data (from analytics or derived from orders)
//   const revenueData = analytics?.revenue || [];

//   // ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#0f0a1a] flex font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

//       {/* ══ SIDEBAR ══ */}
//       <aside className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-[#130d24] border-r border-white/5 flex flex-col transition-all duration-300 sticky top-0 h-screen`}>
//         <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
//           {sidebarOpen && (
//             <div className="flex items-center gap-2">
//               <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">L</div>
//               <div>
//                 <p className="text-white font-bold text-sm tracking-widest">LYRA</p>
//                 <p className="text-white/30 text-xs -mt-0.5">Admin Console</p>
//               </div>
//             </div>
//           )}
//           <button onClick={() => setSidebarOpen(!sidebarOpen)}
//             className={`${sidebarOpen ? "ml-auto" : "mx-auto"} w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs`}>
//             {sidebarOpen ? "◀" : "▶"}
//           </button>
//         </div>

//         <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
//           {NAV.map((item) => (
//             <button key={item.id} onClick={() => { setSection(item.id); setSearchQuery(""); }}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
//                 section === item.id
//                   ? "bg-gradient-to-r from-violet-600/30 to-purple-600/20 text-violet-300 border border-violet-500/20"
//                   : "text-white/40 hover:text-white/70 hover:bg-white/5"
//               }`}>
//               <span className={`text-lg flex-shrink-0 ${section === item.id ? "text-violet-400" : ""}`}>{item.icon}</span>
//               {sidebarOpen && (
//                 <>
//                   <span className="flex-1 text-left">{item.label}</span>
//                   {item.badge > 0 && (
//                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${section === item.id ? "bg-violet-500 text-white" : "bg-white/10 text-white/50"}`}>{item.badge}</span>
//                   )}
//                 </>
//               )}
//               {!sidebarOpen && item.badge > 0 && (
//                 <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{item.badge}</span>
//               )}
//             </button>
//           ))}
//         </nav>

//         {sidebarOpen && (
//           <div className="px-4 py-4 border-t border-white/5">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
//               <div className="min-w-0">
//                 <p className="text-white text-xs font-semibold truncate">Admin</p>
//                 <p className="text-white/30 text-xs truncate">admin@lyra.com</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* ══ MAIN ══ */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

//         {/* Top bar */}
//         <header className="h-16 bg-[#130d24] border-b border-white/5 flex items-center gap-4 px-6 flex-shrink-0">
//           <div>
//             <h1 className="text-white font-bold text-base capitalize">{section}</h1>
//             <p className="text-white/30 text-xs">Lyra Admin Console · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
//           </div>
//           <div className="ml-auto flex items-center gap-3">
//             {["orders","products","customers"].includes(section) && (
//               <div className="relative">
//                 <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder={`Search ${section}...`}
//                   className="w-56 bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-violet-500/50 transition-all" />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">⌕</span>
//               </div>
//             )}
//             <div className="relative w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
//               <span className="text-white/50 text-lg">🔔</span>
//               {pendingOrders > 0 && (
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{pendingOrders}</span>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Toast notification */}
//         {notification && (
//           <div className={`fixed top-4 right-4 z-[300] px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 ${
//             notifType === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
//           }`}>
//             {notifType === "error" ? "⚠" : "✓"} {notification}
//           </div>
//         )}

//         <main className="flex-1 overflow-y-auto p-6">

//           {/* ════ DASHBOARD ════ */}
//           {section === "dashboard" && (
//             <div className="space-y-6">

//               {/* KPI Cards */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 {loading.orders || loading.products || loading.customers ? (
//                   Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)
//                 ) : (
//                   [
//                     { label: "Total Revenue",   value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: "from non-cancelled orders", icon: "💰", color: "from-violet-600 to-purple-600", chart: orders.slice(-8).map((o) => o.total || 0) },
//                     { label: "Total Orders",    value: totalOrders,    sub: `${pendingOrders} pending`,              icon: "📦", color: "from-blue-600 to-cyan-600",    chart: orders.slice(-8).map((_, i) => i + 1) },
//                     { label: "Total Products",  value: totalProducts,  sub: "across all categories",                icon: "🛍", color: "from-emerald-600 to-teal-600", chart: products.slice(-8).map((_, i) => i + 1) },
//                     { label: "Customers",       value: customers.length, sub: "registered users",                   icon: "👥", color: "from-pink-600 to-rose-600",    chart: customers.slice(-8).map((_, i) => i + 1) },
//                   ].map((kpi) => (
//                     <div key={kpi.label} className={`bg-gradient-to-br ${kpi.color} p-5 rounded-2xl relative overflow-hidden`}>
//                       <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 20%, white, transparent 60%)" }} />
//                       <div className="relative">
//                         <div className="flex items-start justify-between mb-3">
//                           <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{kpi.label}</p>
//                           <span className="text-2xl">{kpi.icon}</span>
//                         </div>
//                         <p className="text-white text-3xl font-bold mb-1">{kpi.value}</p>
//                         <p className="text-white/60 text-xs mb-3">{kpi.sub}</p>
//                         <SparkBar data={kpi.chart} color="rgba(255,255,255,0.7)" />
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               {/* Revenue Chart — uses analytics data if available, else derived from orders */}
//               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="text-white font-semibold">Revenue Overview</h3>
//                     <p className="text-white/30 text-xs mt-0.5">Monthly performance</p>
//                   </div>
//                   <span className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/20">Last {revenueData.length || "—"} months</span>
//                 </div>
//                 {loading.analytics ? (
//                   <Skeleton className="h-40" />
//                 ) : revenueData.length > 0 ? (
//                   <div className="flex items-end gap-3 h-40">
//                     {revenueData.map((d, i) => {
//                       const max = Math.max(...revenueData.map((r) => r.revenue), 1);
//                       const h   = (d.revenue / max) * 100;
//                       return (
//                         <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
//                           <div className="w-full relative rounded-lg overflow-hidden" style={{ height: "120px", background: "rgba(255,255,255,0.04)" }}>
//                             <div className="absolute bottom-0 w-full rounded-lg transition-all duration-500"
//                               style={{ height: `${h}%`, background: i === revenueData.length - 1 ? "linear-gradient(to top, #7c3aed, #a855f7)" : "linear-gradient(to top, #3b0764, #6d28d9)" }} />
//                           </div>
//                           <span className="text-white/30 text-xs">{d.month}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="h-40 flex items-center justify-center text-white/20 text-sm">
//                     {errors.analytics ? <ErrorBanner msg={errors.analytics} onRetry={fetchAnalytics} /> : "No revenue data available"}
//                   </div>
//                 )}
//               </div>

//               {/* Bottom row */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//                 {/* Recent orders */}
//                 <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
//                     <button onClick={() => setSection("orders")} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</button>
//                   </div>
//                   {loading.orders ? (
//                     <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
//                   ) : errors.orders ? (
//                     <ErrorBanner msg={errors.orders} onRetry={fetchOrders} />
//                   ) : (
//                     <div className="space-y-3">
//                       {orders.slice(0, 4).map((o) => {
//                         const name = o.customer || o.customerName || "Unknown";
//                         const id   = o._id || o.id;
//                         return (
//                           <div key={id} className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0">
//                               {name.charAt(0)}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="text-white text-xs font-medium truncate">{name}</p>
//                               <p className="text-white/30 text-xs">{id} · {o.date || o.createdAt?.slice(0, 10)}</p>
//                             </div>
//                             <div className="text-right flex-shrink-0">
//                               <p className="text-white text-xs font-bold">₹{(o.total || 0).toLocaleString()}</p>
//                               <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status] || STATUS_STYLES.Pending}`}>{o.status}</span>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       {orders.length === 0 && <p className="text-white/20 text-xs text-center py-4">No orders yet</p>}
//                     </div>
//                   )}
//                 </div>

//                 {/* Top products by reviews */}
//                 <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-white font-semibold text-sm">Top Products</h3>
//                     <button onClick={() => setSection("products")} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</button>
//                   </div>
//                   {loading.products ? (
//                     <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
//                   ) : errors.products ? (
//                     <ErrorBanner msg={errors.products} onRetry={fetchProducts} />
//                   ) : (
//                     <div className="space-y-3">
//                       {[...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 4).map((p) => {
//                         const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
//                         return (
//                           <div key={p._id || p.id} className="flex items-center gap-3">
//                             <img src={p.image || p.images?.[0]} alt={p.name}
//                               className="w-10 h-10 rounded-xl object-cover bg-white/5 flex-shrink-0"
//                               onError={(e) => { e.target.src = "https://placehold.co/40x40/1e0a3c/a855f7?text=L"; }} />
//                             <div className="flex-1 min-w-0">
//                               <p className="text-white text-xs font-medium truncate">{p.name}</p>
//                               <p className="text-white/30 text-xs">{p.category} · {(p.reviews || 0).toLocaleString()} reviews</p>
//                             </div>
//                             <div className="text-right flex-shrink-0">
//                               <p className="text-white text-xs font-bold">₹{(p.price || 0).toLocaleString()}</p>
//                               {disc > 0 && <p className="text-emerald-400 text-xs">{disc}% off</p>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                       {products.length === 0 && <p className="text-white/20 text-xs text-center py-4">No products yet</p>}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Order status distribution */}
//               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
//                 <h3 className="text-white font-semibold text-sm mb-4">Order Status Distribution</h3>
//                 {loading.orders ? (
//                   <div className="grid grid-cols-5 gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
//                 ) : (
//                   <div className="grid grid-cols-5 gap-3">
//                     {Object.entries(
//                       orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {})
//                     ).map(([status, count]) => (
//                       <div key={status} className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-violet-500/20 transition-all">
//                         <p className="text-white font-bold text-xl mb-1">{count}</p>
//                         <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}>{status}</span>
//                       </div>
//                     ))}
//                     {orders.length === 0 && <p className="col-span-5 text-white/20 text-xs text-center py-4">No order data</p>}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ════ ORDERS ════ */}
//           {section === "orders" && (
//             <div className="space-y-4">
//               {errors.orders && <ErrorBanner msg={errors.orders} onRetry={fetchOrders} />}
//               <div className="flex items-center gap-2 flex-wrap">
//                 {["All","Pending","Processing","Shipped","Delivered","Cancelled"].map((f) => (
//                   <button key={f} onClick={() => setOrderFilter(f)}
//                     className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${orderFilter === f ? "bg-violet-600 text-white border-violet-600" : "bg-white/5 text-white/50 border-white/10 hover:border-violet-500/30 hover:text-white/70"}`}>
//                     {f} ({f === "All" ? orders.length : orders.filter((o) => o.status === f).length})
//                   </button>
//                 ))}
//                 <button onClick={fetchOrders} className="ml-auto text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-full border border-violet-500/20 hover:border-violet-500/40 transition-all">
//                   ↻ Refresh
//                 </button>
//               </div>

//               <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
//                 {loading.orders ? (
//                   <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
//                 ) : (
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-white/5">
//                         {["Order ID","Customer","Date","Items","Total","Payment","Status","Actions"].map((h) => (
//                           <th key={h} className="text-left px-4 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-white/5">
//                       {filteredOrders.map((order) => {
//                         const id   = order._id || order.id;
//                         const name = order.customer || order.customerName || "Unknown";
//                         return (
//                           <tr key={id} className="hover:bg-white/3 transition-colors">
//                             <td className="px-4 py-3.5"><span className="font-mono text-violet-400 text-xs font-bold">{id}</span></td>
//                             <td className="px-4 py-3.5">
//                               <p className="text-white text-xs font-medium">{name}</p>
//                               <p className="text-white/30 text-xs">{order.city || order.email || ""}</p>
//                             </td>
//                             <td className="px-4 py-3.5 text-white/40 text-xs">{order.date || order.createdAt?.slice(0, 10) || "—"}</td>
//                             <td className="px-4 py-3.5 text-white/60 text-xs">{order.itemCount ?? (Array.isArray(order.items) ? order.items.length : "—")}</td>
//                             <td className="px-4 py-3.5 text-white text-xs font-bold">₹{(order.total || 0).toLocaleString()}</td>
//                             <td className="px-4 py-3.5 text-white/50 text-xs">{order.payment || order.paymentMethod || "—"}</td>
//                             <td className="px-4 py-3.5">
//                               {editingOrder === id ? (
//                                 <select onChange={(e) => handleUpdateOrderStatus(id, e.target.value)} defaultValue={order.status}
//                                   className="bg-[#1e0a3c] border border-violet-500/30 text-white text-xs rounded-lg px-2 py-1 outline-none">
//                                   {["Pending","Processing","Shipped","Delivered","Cancelled"].map((s) => <option key={s}>{s}</option>)}
//                                 </select>
//                               ) : (
//                                 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}>{order.status}</span>
//                               )}
//                             </td>
//                             <td className="px-4 py-3.5">
//                               <button onClick={() => setEditingOrder(editingOrder === id ? null : id)}
//                                 className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors">
//                                 {editingOrder === id ? "Cancel" : "Edit"}
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 )}
//                 {!loading.orders && filteredOrders.length === 0 && (
//                   <div className="text-center py-12 text-white/30 text-sm">No orders found</div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ════ PRODUCTS ════ */}
//           {section === "products" && (
//             <div className="space-y-4">
//               {errors.products && <ErrorBanner msg={errors.products} onRetry={fetchProducts} />}
//               <div className="flex items-center justify-between">
//                 <p className="text-white/40 text-sm">{filteredProducts.length} products</p>
//                 <div className="flex gap-2">
//                   <button onClick={fetchProducts} className="text-xs text-violet-400 hover:text-violet-300 px-3 py-2 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-all">
//                     ↻ Refresh
//                   </button>
//                   <button onClick={() => setProductModal("new")}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-900/50 transition-all">
//                     + Add Product
//                   </button>
//                 </div>
//               </div>

//               {loading.products ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//                   {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//                   {filteredProducts.map((p) => {
//                     const id   = p._id || p.id;
//                     const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
//                     return (
//                       <div key={id} className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/20 transition-all">
//                         <div className="flex gap-4 p-4">
//                           <img src={p.image || p.images?.[0]} alt={p.name}
//                             className="w-20 h-20 rounded-xl object-cover bg-white/5 flex-shrink-0"
//                             onError={(e) => { e.target.src = "https://placehold.co/80x80/1e0a3c/a855f7?text=L"; }} />
//                           <div className="flex-1 min-w-0">
//                             {p.badge && <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20 font-semibold">{p.badge}</span>}
//                             <p className="text-white text-sm font-semibold mt-1 truncate">{p.name}</p>
//                             <p className="text-white/30 text-xs">{p.brand} · {p.category}</p>
//                             <div className="flex items-center gap-2 mt-2">
//                               <span className="text-white font-bold text-sm">₹{(p.price || 0).toLocaleString()}</span>
//                               {p.originalPrice && <span className="text-white/30 text-xs line-through">₹{p.originalPrice.toLocaleString()}</span>}
//                               {disc > 0 && <span className="text-emerald-400 text-xs font-semibold">{disc}% off</span>}
//                             </div>
//                             <div className="flex items-center gap-3 mt-1">
//                               <span className="text-amber-400 text-xs">★ {p.rating || "—"}</span>
//                               <span className="text-white/30 text-xs">{(p.reviews || 0).toLocaleString()} reviews</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex gap-2 px-4 pb-4">
//                           <button onClick={() => setProductModal(p)}
//                             className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-violet-500/20 hover:text-violet-300 transition-all border border-white/5">
//                             ✏️ Edit
//                           </button>
//                           <button onClick={() => setDeleteConfirm(id)}
//                             className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5">
//                             🗑 Delete
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                   {filteredProducts.length === 0 && !loading.products && (
//                     <div className="col-span-3 text-center py-12 text-white/30 text-sm">No products found</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ════ CUSTOMERS ════ */}
//           {section === "customers" && (
//             <div className="space-y-4">
//               {errors.customers && <ErrorBanner msg={errors.customers} onRetry={fetchCustomers} />}
//               <div className="flex items-center justify-between">
//                 <p className="text-white/40 text-sm">{filteredCustomers.length} customers</p>
//                 <button onClick={fetchCustomers} className="text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-full border border-violet-500/20 hover:border-violet-500/40 transition-all">
//                   ↻ Refresh
//                 </button>
//               </div>
//               <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
//                 {loading.customers ? (
//                   <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
//                 ) : (
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-white/5">
//                         {["Customer","Email","Phone","City","Orders","Total Spent","Joined","Status"].map((h) => (
//                           <th key={h} className="text-left px-4 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-white/5">
//                       {filteredCustomers.map((c) => {
//                         const name = c.name || c.fullName || "Unknown";
//                         return (
//                           <tr key={c._id || c.id} className="hover:bg-white/3 transition-colors">
//                             <td className="px-4 py-3.5">
//                               <div className="flex items-center gap-2.5">
//                                 <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//                                   {name.charAt(0)}
//                                 </div>
//                                 <span className="text-white text-xs font-medium">{name}</span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3.5 text-white/40 text-xs">{c.email || "—"}</td>
//                             <td className="px-4 py-3.5 text-white/40 text-xs">{c.phone || c.mobileNumber || "—"}</td>
//                             <td className="px-4 py-3.5 text-white/40 text-xs">{c.city || "—"}</td>
//                             <td className="px-4 py-3.5 text-white text-xs font-bold">{c.orders || c.orderCount || 0}</td>
//                             <td className="px-4 py-3.5 text-emerald-400 text-xs font-bold">₹{(c.spent || c.totalSpent || 0).toLocaleString()}</td>
//                             <td className="px-4 py-3.5 text-white/30 text-xs">{c.joined || c.createdAt?.slice(0, 7) || "—"}</td>
//                             <td className="px-4 py-3.5">
//                               <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
//                                 c.status === "Active"   ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
//                                 c.status === "New"      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
//                                                           "bg-gray-500/10 text-gray-400 border border-gray-500/20"
//                               }`}>{c.status || "Active"}</span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 )}
//                 {!loading.customers && filteredCustomers.length === 0 && (
//                   <div className="text-center py-12 text-white/30 text-sm">No customers found</div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ════ ANALYTICS ════ */}
//           {section === "analytics" && (
//             <div className="space-y-6">
//               {errors.analytics && <ErrorBanner msg={errors.analytics} onRetry={fetchAnalytics} />}

//               {/* Metric cards */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 {loading.analytics ? (
//                   Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
//                 ) : analytics?.metrics ? (
//                   [
//                     { label: "Conversion Rate",    value: analytics.metrics.conversionRate   || "—", trend: analytics.metrics.conversionRateTrend   },
//                     { label: "Avg Order Value",     value: analytics.metrics.avgOrderValue    || "—", trend: analytics.metrics.avgOrderValueTrend    },
//                     { label: "Return Rate",         value: analytics.metrics.returnRate       || "—", trend: analytics.metrics.returnRateTrend       },
//                     { label: "Customer Sat. Score", value: analytics.metrics.customerSatScore || "—", trend: analytics.metrics.customerSatTrend      },
//                   ].map((m) => (
//                     <div key={m.label} className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
//                       <p className="text-white/30 text-xs uppercase tracking-wider mb-2">{m.label}</p>
//                       <p className="text-white text-2xl font-bold">{m.value}</p>
//                       {m.trend && <p className="text-xs font-semibold mt-1 text-emerald-400">{m.trend} vs last month</p>}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="col-span-4 text-center text-white/20 text-sm py-8">Analytics metrics not available</div>
//                 )}
//               </div>

//               {/* Category performance */}
//               <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
//                 <h3 className="text-white font-semibold mb-5">Category Performance</h3>
//                 {loading.analytics ? (
//                   <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6" />)}</div>
//                 ) : analytics?.categories?.length > 0 ? (
//                   <div className="space-y-4">
//                     {analytics.categories.map((item, idx) => {
//                       const COLORS = ["#7c3aed","#2563eb","#d97706","#db2777","#059669","#dc2626","#0891b2","#7c3aed"];
//                       return (
//                         <div key={item.cat || item.category} className="flex items-center gap-4">
//                           <span className="text-white/60 text-xs w-28 flex-shrink-0">{item.cat || item.category}</span>
//                           <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
//                             <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.pct || item.percentage || 0}%`, background: COLORS[idx % COLORS.length] }} />
//                           </div>
//                           <span className="text-white/40 text-xs w-16 text-right flex-shrink-0">₹{((item.revenue || 0) / 1000).toFixed(1)}K</span>
//                           <span className="text-white/20 text-xs w-8 text-right flex-shrink-0">{item.pct || item.percentage || 0}%</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <p className="text-white/20 text-sm text-center py-4">No category data available</p>
//                 )}
//               </div>

//               {/* Monthly summary table */}
//               <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
//                 <div className="px-6 py-4 border-b border-white/5">
//                   <h3 className="text-white font-semibold">Monthly Summary</h3>
//                 </div>
//                 {loading.analytics ? (
//                   <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
//                 ) : revenueData.length > 0 ? (
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-white/5">
//                         {["Month","Orders","Revenue","Avg Order","Growth"].map((h) => (
//                           <th key={h} className="text-left px-6 py-3 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-white/5">
//                       {revenueData.map((d, i) => {
//                         const prev   = revenueData[i - 1];
//                         const growth = prev ? (((d.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : null;
//                         const isLast = i === revenueData.length - 1;
//                         return (
//                           <tr key={d.month} className={`hover:bg-white/3 transition-colors ${isLast ? "bg-violet-500/5" : ""}`}>
//                             <td className="px-6 py-3 text-white text-sm font-medium">{d.month}</td>
//                             <td className="px-6 py-3 text-white/60 text-sm">{d.orders || "—"}</td>
//                             <td className="px-6 py-3 text-white text-sm font-bold">₹{(d.revenue || 0).toLocaleString()}</td>
//                             <td className="px-6 py-3 text-white/60 text-sm">
//                               {d.orders ? `₹${Math.round(d.revenue / d.orders).toLocaleString()}` : "—"}
//                             </td>
//                             <td className="px-6 py-3">
//                               {growth ? (
//                                 <span className={`text-sm font-semibold ${Number(growth) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
//                                   {Number(growth) >= 0 ? "+" : ""}{growth}%
//                                 </span>
//                               ) : <span className="text-white/20 text-sm">—</span>}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="text-white/20 text-sm text-center py-8">No monthly data available</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ════ SETTINGS ════ */}
//           {section === "settings" && (
//             <div className="max-w-2xl space-y-5">
//               {errors.settings && <ErrorBanner msg={errors.settings} onRetry={fetchSettings} />}

//               {loading.settings ? (
//                 <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}</div>
//               ) : (
//                 <>
//                   {/* Store info */}
//                   <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
//                     <h3 className="text-white font-semibold mb-5">Store Settings</h3>
//                     <div className="space-y-4">
//                       {[
//                         { label: "Store Name",    key: "storeName",     type: "text" },
//                         { label: "Support Email", key: "supportEmail",  type: "email" },
//                         { label: "Support Phone", key: "supportPhone",  type: "tel" },
//                         { label: "GST Number",    key: "gstNumber",     type: "text" },
//                       ].map(({ label, key, type }) => (
//                         <div key={key}>
//                           <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">{label}</label>
//                           <input type={type}
//                             value={settingsForm[key] || ""}
//                             onChange={(e) => setSettingsForm((s) => ({ ...s, [key]: e.target.value }))}
//                             placeholder={`Enter ${label.toLowerCase()}`}
//                             className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/50 transition-all" />
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Notifications */}
//                   <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
//                     <h3 className="text-white font-semibold mb-5">Notifications</h3>
//                     <div className="space-y-3">
//                       {[
//                         { label: "New Order Alerts",      sub: "Email for each new order",          key: "newOrderAlerts" },
//                         { label: "Low Stock Alerts",       sub: "Alert when stock falls below 10",   key: "lowStockAlerts" },
//                         { label: "Customer Review Alerts", sub: "Get notified of new reviews",       key: "reviewAlerts" },
//                         { label: "Weekly Revenue Report",  sub: "Summary sent every Monday",         key: "weeklyReport" },
//                       ].map((n) => {
//                         const notifs = settingsForm.notifications || {};
//                         const isOn   = notifs[n.key] ?? false;
//                         return (
//                           <div key={n.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
//                             <div>
//                               <p className="text-white text-sm font-medium">{n.label}</p>
//                               <p className="text-white/30 text-xs">{n.sub}</p>
//                             </div>
//                             <div
//                               onClick={() => setSettingsForm((s) => ({ ...s, notifications: { ...(s.notifications || {}), [n.key]: !isOn } }))}
//                               className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${isOn ? "bg-violet-600" : "bg-white/10"}`}>
//                               <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: isOn ? "calc(100% - 22px)" : "2px" }} />
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* Delivery */}
//                   <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
//                     <h3 className="text-white font-semibold mb-5">Delivery Settings</h3>
//                     <div className="space-y-4">
//                       {[
//                         { label: "Free Delivery Threshold (₹)", key: "freeDeliveryThreshold" },
//                         { label: "Standard Delivery Fee (₹)",    key: "standardDeliveryFee" },
//                         { label: "Express Delivery Fee (₹)",     key: "expressDeliveryFee" },
//                         { label: "Estimated Delivery Days",       key: "estimatedDeliveryDays" },
//                       ].map(({ label, key }) => (
//                         <div key={key}>
//                           <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">{label}</label>
//                           <input value={settingsForm[key] || ""}
//                             onChange={(e) => setSettingsForm((s) => ({ ...s, [key]: e.target.value }))}
//                             className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/50 transition-all" />
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <button onClick={handleSaveSettings} disabled={savingSettings}
//                     className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-900/50 transition-all disabled:opacity-60">
//                     {savingSettings ? "Saving…" : "Save All Settings"}
//                   </button>
//                 </>
//               )}
//             </div>
//           )}

//         </main>
//       </div>

//       {/* Product Modal */}
//       {productModal && (
//         <ProductModal
//           product={productModal === "new" ? null : productModal}
//           onSave={handleSaveProduct}
//           onClose={() => setProductModal(null)}
//         />
//       )}

//       {/* Delete Confirm */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
//           <div className="relative bg-[#1a0d35] border border-white/10 rounded-2xl p-8 w-96 mx-4 text-center z-10">
//             <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">🗑</span>
//             </div>
//             <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
//             <p className="text-white/40 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
//             <div className="flex gap-3">
//               <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5 transition-all">Cancel</button>
//               <button onClick={() => handleDeleteProduct(deleteConfirm)} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPanel;



import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./admin/AdminUtils.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminOrders    from "./admin/AdminOrders.jsx";
import AdminProducts  from "./admin/AdminProducts.jsx";
import AdminCustomers from "./admin/AdminCustomers.jsx";
import AdminAnalytics from "./admin/AdminAnalytics.jsx";
import AdminBanners   from "./admin/AdminBanners.jsx";
import AdminSettings  from "./admin/AdminSettings.jsx";

// ── Toast ─────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-[300] px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-fade-in ${
    type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
  }`}>
    {type === "error" ? "⚠" : "✓"} {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">✕</button>
  </div>
);

// ── Nav items ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", icon: "◈", label: "Dashboard" },
  { id: "orders",    icon: "◉", label: "Orders" },
  { id: "products",  icon: "▦", label: "Products" },
  { id: "customers", icon: "◎", label: "Customers" },
  { id: "analytics", icon: "◈", label: "Analytics" },
  { id: "banners",   icon: "🖼", label: "Banners" },
  { id: "settings",  icon: "◍", label: "Settings" },
];

// ══════════════════════════════════════════════════════════════════
// ADMIN PANEL SHELL
// ══════════════════════════════════════════════════════════════════
const AdminPanel = () => {
  const [section,     setSection]     = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast,       setToast]       = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Shared data state ─────────────────────────────────────────
  const [products,  setProducts]  = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState({});
  const [errors,    setErrors]    = useState({});

  // ── Toast helper ──────────────────────────────────────────────
  const notify = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const setLoad  = (key, val) => setLoading((s) => ({ ...s, [key]: val }));
  const setError = (key, val) => setErrors((s)  => ({ ...s, [key]: val }));

  // ── Fetchers ──────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoad("products", true); setError("products", null);
    try {
      const data = await apiFetch("/products");
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (e) { setError("products", e.message); }
    finally { setLoad("products", false); }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoad("orders", true); setError("orders", null);
    try {
      const data = await apiFetch("/orders");
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (e) { setError("orders", e.message); }
    finally { setLoad("orders", false); }
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoad("customers", true); setError("customers", null);
    try {
      const data = await apiFetch("/users");
      setCustomers(Array.isArray(data) ? data : data.users || data.customers || []);
    } catch (e) { setError("customers", e.message); }
    finally { setLoad("customers", false); }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoad("analytics", true); setError("analytics", null);
    try {
      const data = await apiFetch("/dashboard");
      setAnalytics({
        revenue:    data.revenue    || data.revenueData    || [],
        categories: data.categories || data.categoryData   || [],
        metrics:    data.metrics    || {},
      });
    } catch (e) { setError("analytics", e.message); }
    finally { setLoad("analytics", false); }
  }, []);

  // Load core data on mount
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }, [fetchOrders, fetchProducts, fetchCustomers]);

  // Lazy fetch analytics when needed
  useEffect(() => {
    if (section === "analytics" && !analytics && !loading.analytics) fetchAnalytics();
  }, [section]); // eslint-disable-line

  // Derived
  const pendingOrders = orders.filter((o) => ["Pending","Processing"].includes(o.status)).length;

  // Retry per section
  const handleRetry = (sec) => {
    if (sec === "orders")    fetchOrders();
    if (sec === "products")  fetchProducts();
    if (sec === "customers") fetchCustomers();
    if (sec === "analytics") fetchAnalytics();
  };

  const changeSection = (id) => { setSection(id); setSearchQuery(""); };

  const SEARCH_SECTIONS = ["orders","products","customers"];

  return (
    <div className="min-h-screen bg-[#0f0a1a] flex font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ══ SIDEBAR ══ */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-[#130d24] border-r border-white/5 flex flex-col transition-all duration-300 sticky top-0 h-screen z-50`}>
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">L</div>
              <div>
                <p className="text-white font-bold text-sm tracking-widest">LYRA</p>
                <p className="text-white/30 text-xs -mt-0.5">Admin Console</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`${sidebarOpen ? "ml-auto" : "mx-auto"} w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs`}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const badge =
              item.id === "orders"   ? pendingOrders    :
              item.id === "products" ? products.length  : 0;
            return (
              <button key={item.id} onClick={() => changeSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  section === item.id
                    ? "bg-gradient-to-r from-violet-600/30 to-purple-600/20 text-violet-300 border border-violet-500/20"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}>
                <span className={`text-lg flex-shrink-0 ${section === item.id ? "text-violet-400" : ""}`}>{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {badge > 0 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${section === item.id ? "bg-violet-500 text-white" : "bg-white/10 text-white/50"}`}>{badge}</span>
                    )}
                  </>
                )}
                {!sidebarOpen && badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="px-4 py-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">Admin</p>
                <p className="text-white/30 text-xs truncate">admin@lyra.com</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-[#130d24] border-b border-white/5 flex items-center gap-4 px-6 flex-shrink-0 sticky top-0 z-40">
          <div>
            <h1 className="text-white font-bold text-base capitalize">{section}</h1>
            <p className="text-white/30 text-xs">Lyra Admin · {new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {SEARCH_SECTIONS.includes(section) && (
              <div className="relative">
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${section}...`}
                  className="w-56 bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-violet-500/50 transition-all" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">⌕</span>
              </div>
            )}
            <div className="relative w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
              <span className="text-white/50 text-lg">🔔</span>
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{pendingOrders}</span>
              )}
            </div>
          </div>
        </header>

        {/* Toast */}
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-6">
          {section === "dashboard" && (
            <AdminDashboard
              orders={orders} products={products} customers={customers}
              analytics={analytics} loading={loading} errors={errors}
              onRetry={handleRetry} onNavigate={changeSection}
            />
          )}
          {section === "orders" && (
            <AdminOrders
              orders={orders} setOrders={setOrders}
              loading={loading.orders} errors={errors}
              onRetry={() => fetchOrders()} notify={notify}
              searchQuery={searchQuery}
            />
          )}
          {section === "products" && (
            <AdminProducts
              products={products} setProducts={setProducts}
              loading={loading.products} errors={errors}
              onRetry={() => fetchProducts()} notify={notify}
              searchQuery={searchQuery}
            />
          )}
          {section === "customers" && (
            <AdminCustomers
              customers={customers}
              loading={loading.customers} errors={errors}
              onRetry={() => fetchCustomers()}
              searchQuery={searchQuery}
            />
          )}
          {section === "analytics" && (
            <AdminAnalytics
              analytics={analytics}
              loading={loading.analytics} errors={errors}
              onRetry={fetchAnalytics}
            />
          )}
          {section === "banners" && (
            <AdminBanners notify={notify} />
          )}
          {section === "settings" && (
            <AdminSettings notify={notify} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;