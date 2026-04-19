// import React from "react";
// import { SparkBar, Skeleton, ErrorBanner, STATUS_STYLES } from "./AdminUtils.jsx";

// const AdminDashboard = ({ orders, products, customers, analytics, loading, errors, onRetry, onNavigate }) => {
//   const totalRevenue  = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + (o.total || 0), 0);
//   const totalOrders   = orders.length;
//   const totalProducts = products.length;
//   const revenueData   = analytics?.revenue || [];

//   return (
//     <div className="space-y-6">

//       {/* KPI Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {loading.orders || loading.products || loading.customers ? (
//           Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)
//         ) : [
//           { label: "Total Revenue",  value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: "from non-cancelled orders", icon: "💰", color: "from-violet-600 to-purple-600", chart: orders.slice(-8).map((o) => o.total || 0) },
//           { label: "Total Orders",   value: totalOrders,    sub: `${orders.filter((o) => ["Pending","Processing"].includes(o.status)).length} pending`, icon: "📦", color: "from-blue-600 to-cyan-600", chart: orders.slice(-8).map((_, i) => i + 1) },
//           { label: "Total Products", value: totalProducts,  sub: "across all categories", icon: "🛍", color: "from-emerald-600 to-teal-600", chart: products.slice(-8).map((_, i) => i + 1) },
//           { label: "Customers",      value: customers.length, sub: "registered users",   icon: "👥", color: "from-pink-600 to-rose-600",    chart: customers.slice(-8).map((_, i) => i + 1) },
//         ].map((kpi) => (
//           <div key={kpi.label} className={`bg-gradient-to-br ${kpi.color} p-5 rounded-2xl relative overflow-hidden`}>
//             <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 20%, white, transparent 60%)" }} />
//             <div className="relative">
//               <div className="flex items-start justify-between mb-3">
//                 <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{kpi.label}</p>
//                 <span className="text-2xl">{kpi.icon}</span>
//               </div>
//               <p className="text-white text-3xl font-bold mb-1">{kpi.value}</p>
//               <p className="text-white/60 text-xs mb-3">{kpi.sub}</p>
//               <SparkBar data={kpi.chart} color="rgba(255,255,255,0.7)" />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Revenue Chart */}
//       <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="text-white font-semibold">Revenue Overview</h3>
//             <p className="text-white/30 text-xs mt-0.5">Monthly performance</p>
//           </div>
//           <span className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/20">
//             Last {revenueData.length || "—"} months
//           </span>
//         </div>
//         {loading.analytics ? (
//           <Skeleton className="h-40" />
//         ) : revenueData.length > 0 ? (
//           <div className="flex items-end gap-3 h-40">
//             {revenueData.map((d, i) => {
//               const max = Math.max(...revenueData.map((r) => r.revenue), 1);
//               const h   = (d.revenue / max) * 100;
//               const isLast = i === revenueData.length - 1;
//               return (
//                 <div key={d.month || i} className="flex-1 flex flex-col items-center gap-2 group">
//                   <div className="w-full relative rounded-lg overflow-hidden" style={{ height: "120px", background: "rgba(255,255,255,0.04)" }}>
//                     <div className="absolute bottom-0 w-full rounded-lg transition-all duration-500"
//                       style={{ height: `${h}%`, background: isLast ? "linear-gradient(to top, #7c3aed, #a855f7)" : "linear-gradient(to top, #3b0764, #6d28d9)" }} />
//                   </div>
//                   <span className="text-white/30 text-xs">{d.month}</span>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="h-40 flex items-center justify-center">
//             {errors.analytics
//               ? <ErrorBanner msg={errors.analytics} onRetry={() => onRetry("analytics")} />
//               : <p className="text-white/20 text-sm">No revenue data available from API</p>
//             }
//           </div>
//         )}
//       </div>

//       {/* Bottom row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {/* Recent orders */}
//         <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
//             <button onClick={() => onNavigate("orders")} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</button>
//           </div>
//           {loading.orders ? (
//             <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
//           ) : errors.orders ? (
//             <ErrorBanner msg={errors.orders} onRetry={() => onRetry("orders")} />
//           ) : (
//             <div className="space-y-3">
//               {orders.slice(0, 5).map((o) => {
//                 const name = o.customer || o.customerName || o.address?.fullName || "Unknown";
//                 const id   = o._id || o.id;
//                 return (
//                   <div key={id} className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0">
//                       {name.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-white text-xs font-medium truncate">{name}</p>
//                       <p className="text-white/30 text-xs">{String(id).slice(-8).toUpperCase()} · {o.date || o.createdAt?.slice(0, 10)}</p>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                       <p className="text-white text-xs font-bold">₹{(o.total || 0).toLocaleString()}</p>
//                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status] || STATUS_STYLES.Pending}`}>{o.status}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//               {orders.length === 0 && <p className="text-white/20 text-xs text-center py-4">No orders yet</p>}
//             </div>
//           )}
//         </div>

//         {/* Top products */}
//         <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-white font-semibold text-sm">Top Products</h3>
//             <button onClick={() => onNavigate("products")} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</button>
//           </div>
//           {loading.products ? (
//             <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
//           ) : errors.products ? (
//             <ErrorBanner msg={errors.products} onRetry={() => onRetry("products")} />
//           ) : (
//             <div className="space-y-3">
//               {[...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5).map((p) => {
//                 const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
//                 return (
//                   <div key={p._id || p.id} className="flex items-center gap-3">
//                     <img src={p.image || p.images?.[0]} alt={p.name}
//                       className="w-10 h-10 rounded-xl object-cover bg-white/5 flex-shrink-0"
//                       onError={(e) => { e.target.src = "https://placehold.co/40x40/1e0a3c/a855f7?text=L"; }} />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-white text-xs font-medium truncate">{p.name}</p>
//                       <p className="text-white/30 text-xs">{p.category} · {(p.reviews || 0).toLocaleString()} reviews</p>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                       <p className="text-white text-xs font-bold">₹{(p.price || 0).toLocaleString()}</p>
//                       {disc > 0 && <p className="text-emerald-400 text-xs">{disc}% off</p>}
//                     </div>
//                   </div>
//                 );
//               })}
//               {products.length === 0 && <p className="text-white/20 text-xs text-center py-4">No products yet</p>}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Order status distribution */}
//       <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
//         <h3 className="text-white font-semibold text-sm mb-4">Order Status Distribution</h3>
//         {loading.orders ? (
//           <div className="grid grid-cols-5 gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
//         ) : (
//           <div className="grid grid-cols-5 gap-3">
//             {["Pending","Processing","Shipped","Delivered","Cancelled"].map((status) => {
//               const count = orders.filter((o) => o.status === status).length;
//               return (
//                 <div key={status} className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-violet-500/20 transition-all">
//                   <p className="text-white font-bold text-xl mb-1">{count}</p>
//                   <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>{status}</span>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//         {!loading.orders && orders.length === 0 && <p className="text-white/20 text-xs text-center py-4">No order data</p>}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────
// API helper
// ─────────────────────────────────────────────────────────────────
const apiFetch = async (path) => {
  const u   = JSON.parse(sessionStorage.getItem("user") || "{}");
  const res = await fetch(`https://lyra-backend-gilt.vercel.app/api/admin${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(u.token ? { Authorization: `Bearer ${u.token}` } : {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
};

// ─────────────────────────────────────────────────────────────────
// Tiny animated number
// ─────────────────────────────────────────────────────────────────
const AnimatedNumber = ({ value, prefix = "", suffix = "", duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const target = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
    const start  = Date.now();
    const step   = () => {
      const elapsed = Date.now() - start;
      const prog    = Math.min(elapsed / duration, 1);
      const ease    = 1 - Math.pow(1 - prog, 3);
      setDisplay(Math.round(target * ease));
      if (prog < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
};

// ─────────────────────────────────────────────────────────────────
// Mini sparkline bar chart
// ─────────────────────────────────────────────────────────────────
const SparkLine = ({ data = [], color = "#a855f7", height = 32 }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: "2px 2px 0 0",
          background: color,
          height: `${Math.max((v / max) * 100, 4)}%`,
          opacity: i === data.length - 1 ? 1 : 0.45 + (i / data.length) * 0.5,
          transition: "height 0.6s ease",
        }} />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Full-height bar chart
// ─────────────────────────────────────────────────────────────────
const BarChart = ({ data = [], valueKey = "revenue", labelKey = "month", color = "#7c3aed", height = 180 }) => {
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  const [hover, setHover] = useState(null);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height, position: "relative" }}>
      {data.map((d, i) => {
        const h    = ((d[valueKey] || 0) / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            {hover === i && (
              <div style={{
                position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
                background: "#1e0a3c", border: "1px solid rgba(168,85,247,0.3)",
                padding: "4px 8px", borderRadius: "8px", whiteSpace: "nowrap", zIndex: 10, marginBottom: "4px",
              }}>
                <p style={{ color: "#e9d5ff", fontSize: "10px", fontWeight: 700 }}>
                  ₹{(d[valueKey] || 0).toLocaleString()}
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>{d[labelKey]}</p>
              </div>
            )}
            <div style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              background: isLast
                ? "linear-gradient(to top, #7c3aed, #a855f7)"
                : hover === i
                ? "linear-gradient(to top, #4c1d95, #7c3aed)"
                : "rgba(124,58,237,0.3)",
              height: `${Math.max(h, 3)}%`,
              transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              transitionDelay: `${i * 30}ms`,
              cursor: "pointer",
            }} />
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Donut chart (CSS only)
// ─────────────────────────────────────────────────────────────────
const DonutChart = ({ segments = [], size = 120 }) => {
  const COLORS = ["#7c3aed","#2563eb","#d97706","#db2777","#059669","#dc2626","#0891b2"];
  const total  = segments.reduce((s, seg) => s + (seg.value || 0), 0) || 1;
  let cumulative = 0;
  const paths = segments.map((seg, i) => {
    const pct   = (seg.value || 0) / total;
    const start = cumulative;
    cumulative += pct;
    const r      = size / 2 - 12;
    const cx     = size / 2;
    const cy     = size / 2;
    const a1     = (start * 2 * Math.PI) - Math.PI / 2;
    const a2     = (cumulative * 2 * Math.PI) - Math.PI / 2;
    const x1     = cx + r * Math.cos(a1);
    const y1     = cy + r * Math.sin(a1);
    const x2     = cx + r * Math.cos(a2);
    const y2     = cy + r * Math.sin(a2);
    const large  = pct > 0.5 ? 1 : 0;
    const d      = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { d, color: COLORS[i % COLORS.length], label: seg.label, value: seg.value, pct: Math.round(pct * 100) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <circle cx={size/2} cy={size/2} r={size/2-12} fill="rgba(255,255,255,0.03)" />
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity={0.8}
          style={{ transition: `opacity 0.2s`, cursor: "pointer" }}
          onMouseEnter={(e) => e.target.setAttribute("opacity","1")}
          onMouseLeave={(e) => e.target.setAttribute("opacity","0.8")}>
          <title>{p.label}: {p.pct}%</title>
        </path>
      ))}
      <circle cx={size/2} cy={size/2} r={size/2-30} fill="#0a0618" />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────
// Status badge
// ─────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Delivered:  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Shipped:    "bg-blue-500/15    text-blue-400    border border-blue-500/25",
  Processing: "bg-amber-500/15   text-amber-400   border border-amber-500/25",
  Pending:    "bg-gray-500/15    text-gray-400    border border-gray-500/25",
  Cancelled:  "bg-red-500/15     text-red-400     border border-red-500/25",
};
const StatusBadge = ({ status }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}>{status || "Pending"}</span>
);

// ─────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────
const Sk = ({ h = 20, w = "100%", r = 12 }) => (
  <div style={{
    height: h, width: w, borderRadius: r,
    background: "linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite linear",
  }} />
);

// ─────────────────────────────────────────────────────────────────
// Trend pill
// ─────────────────────────────────────────────────────────────────
const Trend = ({ value }) => {
  if (!value) return null;
  const num = parseFloat(value);
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
      background: num >= 0 ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
      color: num >= 0 ? "#10b981" : "#ef4444",
      border: `1px solid ${num >= 0 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
    }}>
      {num >= 0 ? "↑" : "↓"} {Math.abs(num)}%
    </span>
  );
};

// ══════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════
const AdminDashboard = ({ orders = [], products = [], customers = [], onNavigate }) => {
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [revenueTab,setRevenueTab]= useState("monthly"); // monthly | daily
  const [visible,   setVisible]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const overview = await apiFetch("/analytics/overview");
      setData(overview);
      setTimeout(() => setVisible(true), 100);
    } catch (e) {
      setError(e.message);
      // Fallback: build from props
      const totalRevenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + (o.total || 0), 0);
      setData({
        totalRevenue, totalOrders: orders.length,
        totalProducts: products.length, totalCustomers: customers.length,
        pendingCount:   orders.filter((o) => o.status === "Pending").length,
        deliveredCount: orders.filter((o) => o.status === "Delivered").length,
        cancelledCount: orders.filter((o) => o.status === "Cancelled").length,
        revenueByMonth: [], dailyRevenue: [], categoryRevenue: [],
        topProducts: [...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5),
        recentActivity: orders.slice(0, 8).map((o) => ({
          id: String(o._id), type: "order", label: `Order #${String(o._id).slice(-6).toUpperCase()}`,
          customer: o.address?.fullName || "Customer", status: o.status, amount: o.total || 0, time: o.createdAt,
        })),
        metrics: { conversionRate: "—", avgOrderValue: "—", returnRate: "—", customerSatScore: "—" },
        avgRating: "—",
      });
      setTimeout(() => setVisible(true), 100);
    } finally {
      setLoading(false);
    }
  }, [orders, products, customers]);

  useEffect(() => { load(); }, []);

  const kpiCards = data ? [
    {
      label: "Total Revenue", icon: "₹",
      value: data.totalRevenue || 0,
      prefix: "₹", suffix: "",
      display: `₹${((data.totalRevenue || 0) / 100000).toFixed(1)}L`,
      sub: `₹${(data.thisMonthRevenue || 0).toLocaleString()} this month`,
      trend: data.revenueGrowth,
      color1: "#7c3aed", color2: "#a855f7",
      chart: (data.revenueByMonth || []).slice(-8).map((d) => d.revenue),
      nav: "analytics",
    },
    {
      label: "Total Orders", icon: "📦",
      value: data.totalOrders || 0,
      display: (data.totalOrders || 0).toLocaleString(),
      sub: `${(data.pendingCount || 0) + (data.processingCount || 0)} active`,
      trend: null,
      color1: "#0891b2", color2: "#06b6d4",
      chart: (data.dailyRevenue || []).slice(-8).map((d) => d.orders),
      nav: "orders",
    },
    {
      label: "Products", icon: "🛍",
      value: data.totalProducts || 0,
      display: (data.totalProducts || 0).toLocaleString(),
      sub: `${data.outOfStock || 0} out of stock`,
      trend: null,
      color1: "#059669", color2: "#10b981",
      chart: Array.from({ length: 8 }, (_, i) => i + 1),
      nav: "products",
    },
    {
      label: "Customers", icon: "👥",
      value: data.totalCustomers || 0,
      display: (data.totalCustomers || 0).toLocaleString(),
      sub: `${data.newThisMonth || 0} new this month`,
      trend: data.customerGrowth,
      color1: "#db2777", color2: "#ec4899",
      chart: Array.from({ length: 8 }, (_, i) => i + 1),
      nav: "customers",
    },
  ] : [];

  const chartData = revenueTab === "monthly"
    ? (data?.revenueByMonth || [])
    : (data?.dailyRevenue || []).slice(-30);

  return (
    <>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .adm-fade{animation:fadeUp 0.5s ease forwards;}
        .adm-scale{animation:scaleIn 0.4s ease forwards;}
        .adm-card{background:#130d24;border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden;}
        .adm-card:hover{border-color:rgba(168,85,247,0.2);transition:border-color 0.2s;}
        .adm-label{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);}
        .adm-hover-row:hover{background:rgba(255,255,255,0.025);}
        .adm-stat-grid{display:grid;gap:16px;grid-template-columns:repeat(2,1fr);}
        @media(min-width:1024px){.adm-stat-grid{grid-template-columns:repeat(4,1fr);}}
        .adm-two-col{display:grid;gap:16px;grid-template-columns:1fr;}
        @media(min-width:1024px){.adm-two-col{grid-template-columns:1fr 1fr;}}
        .adm-three-col{display:grid;gap:16px;grid-template-columns:1fr;}
        @media(min-width:1024px){.adm-three-col{grid-template-columns:2fr 1fr;}}
        .adm-activity-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
        .adm-progress-bar{height:6px;border-radius:3px;background:rgba(255,255,255,0.06);overflow:hidden;}
        .adm-progress-fill{height:100%;border-radius:3px;transition:width 1s cubic-bezier(0.16,1,0.3,1);}
        .adm-tab{padding:6px 14px;border-radius:10px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;border:none;}
        .adm-tab.active{background:rgba(124,58,237,0.3);color:#e9d5ff;border:1px solid rgba(168,85,247,0.3);}
        .adm-tab:not(.active){background:transparent;color:rgba(255,255,255,0.3);}
        .adm-tab:not(.active):hover{color:rgba(255,255,255,0.6);}
      `}</style>

      <div style={{ space: "24px", opacity: visible ? 1 : 0, transition: "opacity 0.4s" }} className={visible ? "adm-scale" : ""} >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Error banner ── */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#f87171", fontSize: 12 }}>⚠ {error} — showing fallback data.</span>
              <button onClick={load} style={{ marginLeft: "auto", fontSize: 11, color: "#a78bfa", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>Retry</button>
            </div>
          )}

          {/* ── KPI CARDS ── */}
          <div className="adm-stat-grid">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="adm-card" style={{ padding: 20, minHeight: 130 }}><Sk h={12} w="60%" /><br/><Sk h={32} w="50%" /><br/><Sk h={10} w="80%" /></div>)
              : kpiCards.map((kpi, idx) => (
                <div key={kpi.label}
                  className="adm-card"
                  style={{
                    padding: 20, cursor: "pointer", position: "relative", overflow: "hidden",
                    animation: `fadeUp 0.5s ease ${idx * 80}ms both`,
                  }}
                  onClick={() => onNavigate?.(kpi.nav)}>
                  {/* Gradient glow */}
                  <div style={{
                    position: "absolute", top: -30, right: -30, width: 100, height: 100,
                    borderRadius: "50%", opacity: 0.12,
                    background: `radial-gradient(circle, ${kpi.color1}, transparent)`,
                  }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <p className="adm-label">{kpi.label}</p>
                      <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: `linear-gradient(135deg,${kpi.color1}22,${kpi.color2}22)`, border: `1px solid ${kpi.color1}30` }}>
                        {kpi.icon}
                      </div>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1, marginBottom: 4 }}>
                      {loading ? <Sk h={28} w={80} /> : kpi.display}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{kpi.sub}</p>
                      <Trend value={kpi.trend} />
                    </div>
                    <SparkLine data={kpi.chart} color={kpi.color1} height={28} />
                  </div>
                </div>
              ))
            }
          </div>

          {/* ── ORDER STATUS ROW ── */}
          {!loading && data && (
            <div className="adm-card" style={{ padding: "16px 20px", animation: "fadeUp 0.5s ease 320ms both" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p className="adm-label">Order Status Distribution</p>
                <button onClick={() => onNavigate?.("orders")} style={{ fontSize: 11, color: "#a855f7", background: "none", border: "none", cursor: "pointer" }}>View all →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                {[
                  { label: "Pending",    count: data.pendingCount || 0,    color: "#6b7280" },
                  { label: "Processing", count: data.processingCount || 0, color: "#f59e0b" },
                  { label: "Shipped",    count: data.shippedCount || 0,    color: "#3b82f6" },
                  { label: "Delivered",  count: data.deliveredCount || 0,  color: "#10b981" },
                  { label: "Cancelled",  count: data.cancelledCount || 0,  color: "#ef4444" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: `${s.color}12`, border: `1px solid ${s.color}22`,
                    borderRadius: 14, padding: "12px 8px", textAlign: "center",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = `${s.color}20`}
                    onMouseLeave={(e) => e.currentTarget.style.background = `${s.color}12`}>
                    <p style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>
                      <AnimatedNumber value={s.count} />
                    </p>
                    <p style={{ fontSize: 10, fontWeight: 700, color: `${s.color}cc` }}>{s.label}</p>
                    <div className="adm-progress-bar" style={{ marginTop: 8 }}>
                      <div className="adm-progress-fill" style={{
                        width: `${(s.count / Math.max(data.totalOrders, 1)) * 100}%`,
                        background: s.color,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REVENUE CHART ── */}
          <div className="adm-card" style={{ padding: 24, animation: "fadeUp 0.5s ease 400ms both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Revenue Overview</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>
                  {data ? `₹${((data.totalRevenue || 0) / 100000).toFixed(2)}L total` : "Loading…"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={`adm-tab ${revenueTab === "monthly" ? "active" : ""}`} onClick={() => setRevenueTab("monthly")}>Monthly</button>
                <button className={`adm-tab ${revenueTab === "daily" ? "active" : ""}`} onClick={() => setRevenueTab("daily")}>Daily (30d)</button>
              </div>
            </div>
            {loading
              ? <Sk h={180} />
              : chartData.length > 0
              ? <>
                  <BarChart
                    data={chartData}
                    valueKey="revenue"
                    labelKey={revenueTab === "monthly" ? "month" : "date"}
                    height={180}
                  />
                  {/* X-axis labels */}
                  <div style={{ display: "flex", gap: "4px", marginTop: 8 }}>
                    {chartData.filter((_, i) => chartData.length <= 12 || i % 3 === 0).map((d, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
                          {revenueTab === "monthly" ? d.month : d.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              : <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>No revenue data yet</p>
                </div>
            }
          </div>

          {/* ── TWO-COLUMN ROW: Recent + Top Products ── */}
          <div className="adm-two-col">

            {/* Recent Activity */}
            <div className="adm-card" style={{ padding: 20, animation: "fadeUp 0.5s ease 480ms both" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ color: "white", fontWeight: 700, fontSize: 14 }}>Recent Activity</p>
                <button onClick={() => onNavigate?.("orders")} style={{ fontSize: 11, color: "#a855f7", background: "none", border: "none", cursor: "pointer" }}>View all →</button>
              </div>
              {loading
                ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{Array.from({ length: 5 }).map((_, i) => <Sk key={i} h={44} />)}</div>
                : (data?.recentActivity || []).map((item, i) => (
                  <div key={item.id} className="adm-hover-row"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", animation: `fadeUp 0.4s ease ${i * 50}ms both` }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: "linear-gradient(135deg,#7c3aed33,#ec489933)",
                      border: "1px solid rgba(124,58,237,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, color: "#c084fc", fontWeight: 800,
                    }}>
                      {(item.customer || "?").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.customer}
                      </p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                        {item.label} · {item.time ? new Date(item.time).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "white" }}>₹{(item.amount || 0).toLocaleString()}</p>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Top Products */}
            <div className="adm-card" style={{ padding: 20, animation: "fadeUp 0.5s ease 560ms both" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ color: "white", fontWeight: 700, fontSize: 14 }}>Top Products</p>
                <button onClick={() => onNavigate?.("products")} style={{ fontSize: 11, color: "#a855f7", background: "none", border: "none", cursor: "pointer" }}>View all →</button>
              </div>
              {loading
                ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{Array.from({ length: 5 }).map((_, i) => <Sk key={i} h={52} />)}</div>
                : (data?.topProducts || []).map((p, i) => {
                  const disc = p.originalPrice && p.originalPrice > p.price
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                  return (
                    <div key={String(p._id)} className="adm-hover-row"
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", animation: `fadeUp 0.4s ease ${i * 60}ms both` }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, overflow: "hidden",
                        background: "rgba(255,255,255,0.05)", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)",
                      }}>
                        <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://placehold.co/40x40/1e0a3c/a855f7?text=L"; }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{p.category} · ⭐{p.rating || "—"}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "white" }}>₹{(p.price || 0).toLocaleString()}</p>
                        {disc > 0 && <p style={{ fontSize: 10, color: "#10b981" }}>{disc}% off</p>}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>

          {/* ── THREE-COLUMN ROW: Category Revenue + Donut ── */}
          <div className="adm-three-col">
            {/* Category performance */}
            <div className="adm-card" style={{ padding: 24, animation: "fadeUp 0.5s ease 640ms both" }}>
              <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Revenue by Category</p>
              {loading
                ? <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{Array.from({ length: 6 }).map((_, i) => <Sk key={i} h={20} />)}</div>
                : (data?.categoryRevenue || []).length > 0
                ? (data.categoryRevenue || []).map((item, i) => {
                  const COLORS = ["#7c3aed","#2563eb","#d97706","#db2777","#059669","#dc2626","#0891b2","#8b5cf6"];
                  return (
                    <div key={item.cat} style={{ marginBottom: 14, animation: `fadeUp 0.4s ease ${i * 60}ms both` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{item.cat}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>₹{((item.revenue || 0) / 1000).toFixed(0)}K · {item.pct}%</span>
                      </div>
                      <div className="adm-progress-bar">
                        <div className="adm-progress-fill" style={{ width: `${item.pct}%`, background: COLORS[i % COLORS.length] }} />
                      </div>
                    </div>
                  );
                })
                : <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, textAlign: "center", paddingTop: 20 }}>No category revenue data</p>
              }
            </div>

            {/* Donut + legend */}
            <div className="adm-card" style={{ padding: 24, animation: "fadeUp 0.5s ease 700ms both" }}>
              <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Product Mix</p>
              {!loading && data?.categories?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                  <DonutChart segments={(data.categories || []).map((c) => ({ label: c.name, value: c.count }))} size={140} />
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                    {(data.categories || []).slice(0, 5).map((c, i) => {
                      const COLORS = ["#7c3aed","#2563eb","#d97706","#db2777","#059669"];
                      return (
                        <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", flex: 1 }}>{c.name}</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{c.pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : loading
                ? <Sk h={160} />
                : <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, textAlign: "center", paddingTop: 40 }}>No data</p>
              }
            </div>
          </div>

          {/* ── METRICS ROW ── */}
          {!loading && data?.metrics && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, animation: "fadeUp 0.5s ease 760ms both" }}>
              {[
                { label: "Conversion Rate",  value: data.metrics.conversionRate,   trend: data.metrics.conversionRateTrend,  icon: "🎯", color: "#7c3aed" },
                { label: "Avg Order Value",  value: data.metrics.avgOrderValue,    trend: data.metrics.avgOrderValueTrend,   icon: "💳", color: "#0891b2" },
                { label: "Cancellation Rate",value: data.metrics.returnRate,       trend: data.metrics.returnRateTrend,      icon: "↩", color: "#f59e0b" },
                { label: "Customer Rating",  value: data.metrics.customerSatScore, trend: data.metrics.customerSatTrend,     icon: "⭐", color: "#db2777" },
              ].map((m) => (
                <div key={m.label} className="adm-card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p className="adm-label" style={{ marginBottom: 6 }}>{m.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1 }}>{m.value}</p>
                      {m.trend && <Trend value={m.trend} />}
                    </div>
                    <div style={{ fontSize: 24, opacity: 0.7 }}>{m.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── INVENTORY ALERTS ── */}
          {!loading && (data?.outOfStock > 0 || data?.lowStock > 0) && (
            <div className="adm-card" style={{ padding: 20, borderColor: "rgba(245,158,11,0.2)", animation: "fadeUp 0.5s ease 820ms both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <p style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14 }}>Inventory Alerts</p>
                <button onClick={() => onNavigate?.("products")} style={{ marginLeft: "auto", fontSize: 11, color: "#a855f7", background: "none", border: "none", cursor: "pointer" }}>Fix →</button>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {data.outOfStock > 0 && (
                  <div style={{ flex: 1, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#ef4444" }}><AnimatedNumber value={data.outOfStock} /></p>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(239,68,68,0.7)", marginTop: 2 }}>OUT OF STOCK</p>
                  </div>
                )}
                {data.lowStock > 0 && (
                  <div style={{ flex: 1, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}><AnimatedNumber value={data.lowStock} /></p>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,158,11,0.7)", marginTop: 2 }}>LOW STOCK (≤10)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── REFRESH BUTTON ── */}
          <div style={{ textAlign: "center", paddingTop: 4 }}>
            <button onClick={load}
              style={{
                background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
                color: "#a78bfa", fontSize: 12, fontWeight: 600, padding: "8px 20px",
                borderRadius: 20, cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(124,58,237,0.2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(124,58,237,0.1)"}>
              ↻ Refresh Dashboard
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;