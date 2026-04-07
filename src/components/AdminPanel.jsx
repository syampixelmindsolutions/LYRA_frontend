import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "./admin/AdminUtils.jsx";
import AdminDashboard  from "./admin/AdminDashboard.jsx";
import AdminOrders     from "./admin/AdminOrders.jsx";
import AdminProducts   from "./admin/AdminProducts.jsx";
import AdminCustomers  from "./admin/AdminCustomers.jsx";
import AdminAnalytics  from "./admin/AdminAnalytics.jsx";
import AdminBanners    from "./admin/AdminBanners.jsx";
import AdminHeroSlides from "./admin/AdminHeroSlides.jsx";
import AdminSettings   from "./admin/AdminSettings.jsx";
import AdminCategories from "./admin/AdminCategories.jsx";

// ── Toast ─────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-[300] px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 ${
    type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
  }`}>
    {type === "error" ? "⚠" : "✓"} {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">✕</button>
  </div>
);

// ── Sidebar nav items (HeroSlides added) ─────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",  icon: "◈",  label: "Dashboard"   },
  { id: "orders",     icon: "◉",  label: "Orders"      },
  { id: "categories", icon: "📂", label: "Categories" },
  { id: "products",   icon: "▦",  label: "Products"    },
  { id: "customers",  icon: "◎",  label: "Customers"   },
  { id: "analytics",  icon: "◈",  label: "Analytics"   },
  { id: "heroslides", icon: "🎞", label: "Hero Slides" },
  { id: "banners",    icon: "🖼", label: "Banners"     },
  { id: "settings",   icon: "◍",  label: "Settings"    },
];

// ══════════════════════════════════════════════════════════════════
// ADMIN PANEL SHELL
// ══════════════════════════════════════════════════════════════════
const AdminPanel = () => {
  const [section,     setSection]     = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast,       setToast]       = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Shared data
  const [products,  setProducts]  = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState({});
  const [errors,    setErrors]    = useState({});

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

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }, [fetchOrders, fetchProducts, fetchCustomers]);

  useEffect(() => {
    if (section === "analytics" && !analytics && !loading.analytics) fetchAnalytics();
  }, [section]); // eslint-disable-line

  const pendingOrders = orders.filter((o) => ["Pending","Processing"].includes(o.status)).length;

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
              item.id === "orders"   ? pendingOrders   :
              item.id === "products" ? products.length : 0;
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
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        section === item.id ? "bg-violet-500 text-white" : "bg-white/10 text-white/50"
                      }`}>{badge}</span>
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
            <h1 className="text-white font-bold text-base capitalize">{
              section === "heroslides" ? "Hero Slides" : section
            }</h1>
            <p className="text-white/30 text-xs">
              Lyra Admin · {new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
            </p>
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
          
          {section === "categories" && (
            <AdminCategories notify={notify} />
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
          {section === "heroslides" && (
            <AdminHeroSlides notify={notify} />
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