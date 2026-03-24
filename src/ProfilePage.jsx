import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./components/CartContext";
import { useWishlist } from "./components/WishlistContext";
import AddToCartModal from "./components/AddToCartModal";

// ── Mock past orders ──────────────────────────
const MOCK_ORDERS = [
  {
    id: "LYRX4K9A",
    date: "18 Mar 2026",
    status: "Delivered",
    statusColor: "text-green-600 bg-green-50",
    total: 8499,
    items: [
      { name: "Silk Noir Dress", brand: "Lyra Studio", size: "M", color: "Black", price: 4999, qty: 1, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=200&q=80" },
      { name: "Pearl Drop Earrings", brand: "JewelCo", size: "One Size", color: "Gold", price: 1299, qty: 1, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=80" },
    ],
  },
  {
    id: "LYRMQ2B7",
    date: "05 Mar 2026",
    status: "Shipped",
    statusColor: "text-blue-600 bg-blue-50",
    total: 12999,
    items: [
      { name: "Chronograph Watch", brand: "TimeLux", size: "One Size", color: "Silver", price: 12999, qty: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" },
    ],
  },
  {
    id: "LYRP7Z3C",
    date: "20 Feb 2026",
    status: "Cancelled",
    statusColor: "text-red-500 bg-red-50",
    total: 3999,
    items: [
      { name: "Minimal White Sneaker", brand: "StepUp", size: "8", color: "White", price: 3999, qty: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" },
    ],
  },
];

const TABS = [
  { id: "profile",   label: "My Profile",  icon: "👤" },
  { id: "orders",    label: "My Orders",   icon: "📦" },
  { id: "wishlist",  label: "Wishlist",    icon: "♥" },
  { id: "addresses", label: "Addresses",   icon: "📍" },
];

const ProfilePage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { cartCount } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const [activeTab,    setActiveTab]    = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "profile";
  });
  const [user,         setUser]         = useState({});
  const [editMode,     setEditMode]     = useState(false);
  const [editForm,     setEditForm]     = useState({});
  const [savedMsg,     setSavedMsg]     = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [addresses,    setAddresses]    = useState([
    { id: 1, label: "Home", fullName: "Syam Kumar", phone: "9876543210", street: "12 Banjara Hills", city: "Hyderabad", state: "Telangana", pincode: "500034", default: true },
  ]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm,     setAddrForm]     = useState({ label: "Home", fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) { navigate("/"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    setEditForm({ fullName: u.fullName || "", email: u.email || "", phone: u.phone || "", gender: u.gender || "" });
  }, [navigate]);

  const handleLogout = () => { sessionStorage.removeItem("user"); navigate("/"); };

  const handleSaveProfile = () => {
    const updated = { ...user, ...editForm };
    sessionStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    setEditMode(false);
    setSavedMsg("Profile updated successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const handleDeleteAddress = (id) => setAddresses((p) => p.filter((a) => a.id !== id));
  const handleSetDefault    = (id) => setAddresses((p) => p.map((a) => ({ ...a, default: a.id === id })));

  const handleSaveAddr = () => {
    if (!addrForm.fullName || !addrForm.street || !addrForm.city || !addrForm.pincode) return;
    setAddresses((p) => [...p, { ...addrForm, id: Date.now(), default: p.length === 0 }]);
    setAddrForm({ label: "Home", fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });
    setShowAddrForm(false);
  };

  const initials = (user.fullName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
          ← Back
        </button>
        <span className="font-serif text-base text-purple-200 tracking-wide">My Account</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => navigate("/wishlist")} className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
            ♡
          </button>
          <button onClick={() => navigate("/cart")} className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">My Account</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-6 items-start flex-col lg:flex-row">

        {/* ══ LEFT SIDEBAR ══ */}
        <aside className="w-full lg:w-72 flex-shrink-0">

          {/* Profile card */}
          <div className="bg-gradient-to-br from-[#1e0a3c] to-violet-700 rounded-2xl p-6 mb-4 text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white font-serif border-2 border-white/30">
              {initials}
            </div>
            <p className="text-white font-semibold text-base">{user.fullName || "Guest"}</p>
            <p className="text-purple-300 text-xs mt-1">{user.email || ""}</p>
            {user.phone && <p className="text-purple-300 text-xs">{user.phone}</p>}
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{MOCK_ORDERS.length}</p>
                <p className="text-purple-300 text-xs">Orders</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="text-white font-bold text-lg">{wishlistItems.length}</p>
                <p className="text-purple-300 text-xs">Wishlist</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="text-white font-bold text-lg">{addresses.length}</p>
                <p className="text-purple-300 text-xs">Addresses</p>
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all border-b border-purple-50 last:border-0 ${activeTab === tab.id ? "bg-violet-50 text-violet-700 font-semibold border-l-4 border-l-violet-600" : "text-gray-600 hover:bg-gray-50 hover:text-violet-600 border-l-4 border-l-transparent"}`}>
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
                {tab.id === "wishlist" && wishlistItems.length > 0 && (
                  <span className="ml-auto bg-pink-100 text-pink-600 text-xs font-bold px-2 py-0.5 rounded-full">{wishlistItems.length}</span>
                )}
                {tab.id === "orders" && (
                  <span className="ml-auto bg-violet-100 text-violet-600 text-xs font-bold px-2 py-0.5 rounded-full">{MOCK_ORDERS.length}</span>
                )}
              </button>
            ))}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-all border-t border-purple-50 border-l-4 border-l-transparent">
              <span className="text-lg">🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* ══ MAIN CONTENT ══ */}
        <main className="flex-1 min-w-0">

          {/* ════ PROFILE TAB ════ */}
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
                    <button onClick={handleSaveProfile} className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors">Save</button>
                    <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
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
                    { label: "Full Name",    key: "fullName", type: "text",  placeholder: "Your full name" },
                    { label: "Email",        key: "email",    type: "email", placeholder: "your@email.com" },
                    { label: "Phone",        key: "phone",    type: "tel",   placeholder: "10-digit number" },
                    { label: "Gender",       key: "gender",   type: "select", options: ["", "Male", "Female", "Other", "Prefer not to say"] },
                  ].map(({ label, key, type, placeholder, options }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                      {!editMode ? (
                        <p className="text-sm font-medium text-gray-900 py-2.5 px-4 bg-gray-50 rounded-xl">{editForm[key] || <span className="text-gray-400 italic">Not set</span>}</p>
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

              {/* Account stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "📦", label: "Total Orders",   value: MOCK_ORDERS.length, color: "bg-violet-50 border-violet-100" },
                  { icon: "♥",  label: "Wishlist Items",  value: wishlistItems.length, color: "bg-pink-50 border-pink-100" },
                  { icon: "💰", label: "Total Spent",    value: `₹${MOCK_ORDERS.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0).toLocaleString()}`, color: "bg-green-50 border-green-100" },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} border rounded-2xl p-5 text-center`}>
                    <p className="text-3xl mb-2">{s.icon}</p>
                    <p className="font-bold text-gray-900 text-xl">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-2xl border border-purple-100 p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: "📦", label: "My Orders",   action: () => setActiveTab("orders") },
                    { icon: "♥",  label: "Wishlist",    action: () => setActiveTab("wishlist") },
                    { icon: "📍", label: "Addresses",   action: () => setActiveTab("addresses") },
                    { icon: "🛒", label: "Go to Cart",  action: () => navigate("/cart") },
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

          {/* ════ ORDERS TAB ════ */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Orders</span></h2>

              {MOCK_ORDERS.length === 0 ? (
                <div className="bg-white rounded-2xl border border-purple-100 p-16 text-center">
                  <p className="text-5xl mb-4">📦</p>
                  <p className="font-serif text-xl text-gray-700 mb-2">No orders yet</p>
                  <p className="text-gray-400 text-sm mb-5">Start shopping to see your orders here.</p>
                  <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Browse Products →</button>
                </div>
              ) : MOCK_ORDERS.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
                  {/* Order header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50 cursor-pointer hover:bg-violet-50/30 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-mono font-bold text-violet-600 text-sm">{order.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                      </div>
                      <span className={`text-gray-400 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}>▾</span>
                    </div>
                  </div>

                  {/* Order items (expanded) */}
                  {expandedOrder === order.id && (
                    <div className="p-5 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-purple-50 flex-shrink-0"
                            onError={(e) => { e.target.src = "https://placehold.co/64x64/f3f4f6/9ca3af?text=L"; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">{item.brand}</p>
                            <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs bg-purple-50 text-violet-600 px-2 py-0.5 rounded-lg border border-purple-100">Size: {item.size}</span>
                              <span className="text-xs bg-purple-50 text-violet-600 px-2 py-0.5 rounded-lg border border-purple-100">{item.color}</span>
                              <span className="text-xs text-gray-400">Qty: {item.qty}</span>
                            </div>
                          </div>
                          <p className="font-bold text-gray-900 flex-shrink-0">₹{item.price.toLocaleString()}</p>
                        </div>
                      ))}

                      {/* Order actions */}
                      <div className="flex gap-3 pt-3 border-t border-purple-50">
                        {order.status === "Delivered" && (
                          <button className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">Rate & Review</button>
                        )}
                        {order.status === "Shipped" && (
                          <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">Track Order</button>
                        )}
                        {order.status !== "Cancelled" && (
                          <button className="flex-1 py-2.5 rounded-xl border border-purple-100 text-violet-600 text-sm font-semibold hover:bg-violet-50 transition-colors">View Invoice</button>
                        )}
                        {order.status === "Delivered" && (
                          <button className="flex-1 py-2.5 rounded-xl border border-purple-100 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">Buy Again</button>
                        )}
                        {order.status === "Cancelled" && (
                          <button onClick={() => navigate("/dashboard")} className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">Shop Again</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ════ WISHLIST TAB ════ */}
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
                  <p className="text-gray-400 text-sm mb-5">Save products you love by clicking the ♡ icon.</p>
                  <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Explore Products →</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {wishlistItems.map((product) => {
                    const disc = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                    return (
                      <div key={product.id} className="bg-white rounded-2xl border border-purple-100 overflow-hidden group hover:border-violet-300 hover:shadow-lg hover:shadow-purple-50 hover:-translate-y-1 transition-all duration-300 relative">
                        <button onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg text-pink-500 hover:text-red-500 hover:scale-110 transition-all">♥</button>
                        <div className="h-44 overflow-hidden bg-purple-50 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                          <img src={product.images?.[0] || product.image} alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = "https://placehold.co/300x300/f3f4f6/9ca3af?text=L"; }} />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{product.brand}</p>
                          <p className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-violet-600" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{disc}% off</span>
                          </div>
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

          {/* ════ ADDRESSES TAB ════ */}
          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-gray-900">My <span className="text-violet-600">Addresses</span></h2>
                <button onClick={() => setShowAddrForm((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                  {showAddrForm ? "✕ Cancel" : "+ Add Address"}
                </button>
              </div>

              {/* Add address form */}
              {showAddrForm && (
                <div className="bg-white rounded-2xl border border-purple-100 p-6">
                  <p className="font-serif text-lg text-gray-900 mb-4">New Address</p>
                  <div className="flex gap-2 mb-4">
                    {["Home", "Work", "Other"].map((l) => (
                      <button key={l} onClick={() => setAddrForm((f) => ({ ...f, label: l }))}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${addrForm.label === l ? "border-violet-600 bg-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300"}`}>
                        {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      {[["Full Name", "fullName", "text"], ["Phone", "phone", "tel"]].map(([lbl, key, type]) => (
                        <div key={key} className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{lbl}</label>
                          <input type={type} value={addrForm[key]} onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Street / Flat / Area</label>
                      <input type="text" value={addrForm.street} onChange={(e) => setAddrForm((f) => ({ ...f, street: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                    </div>
                    <div className="flex gap-3">
                      {[["City", "city"], ["State", "state"], ["Pincode", "pincode"]].map(([lbl, key]) => (
                        <div key={key} className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{lbl}</label>
                          <input type="text" value={addrForm[key]} onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                        </div>
                      ))}
                    </div>
                    <button onClick={handleSaveAddr} className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all">
                      Save Address
                    </button>
                  </div>
                </div>
              )}

              {/* Address list */}
              {addresses.length === 0 && !showAddrForm ? (
                <div className="bg-white rounded-2xl border border-purple-100 p-16 text-center">
                  <p className="text-5xl mb-4">📍</p>
                  <p className="font-serif text-xl text-gray-700 mb-2">No addresses saved</p>
                  <button onClick={() => setShowAddrForm(true)} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">+ Add Address</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${addr.default ? "border-violet-400 shadow-md shadow-violet-100" : "border-purple-100"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg">{addr.label}</span>
                            {addr.default && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-lg">✓ Default</span>}
                            <span className="font-semibold text-gray-900 text-sm">{addr.fullName}</span>
                            <span className="text-xs text-gray-500">{addr.phone}</span>
                          </div>
                          <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          {!addr.default && (
                            <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-violet-600 hover:underline font-semibold px-2 py-1 text-left">Set Default</button>
                          )}
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-red-400 hover:underline font-semibold px-2 py-1 text-left">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Add to Cart Modal */}
      {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </div>
  );
};

export default ProfilePage;