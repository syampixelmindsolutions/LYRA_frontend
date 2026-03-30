import React from "react";
import { SparkBar, Skeleton, ErrorBanner, STATUS_STYLES } from "./AdminUtils.jsx";

const AdminDashboard = ({ orders, products, customers, analytics, loading, errors, onRetry, onNavigate }) => {
  const totalRevenue  = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders   = orders.length;
  const totalProducts = products.length;
  const revenueData   = analytics?.revenue || [];

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading.orders || loading.products || loading.customers ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)
        ) : [
          { label: "Total Revenue",  value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: "from non-cancelled orders", icon: "💰", color: "from-violet-600 to-purple-600", chart: orders.slice(-8).map((o) => o.total || 0) },
          { label: "Total Orders",   value: totalOrders,    sub: `${orders.filter((o) => ["Pending","Processing"].includes(o.status)).length} pending`, icon: "📦", color: "from-blue-600 to-cyan-600", chart: orders.slice(-8).map((_, i) => i + 1) },
          { label: "Total Products", value: totalProducts,  sub: "across all categories", icon: "🛍", color: "from-emerald-600 to-teal-600", chart: products.slice(-8).map((_, i) => i + 1) },
          { label: "Customers",      value: customers.length, sub: "registered users",   icon: "👥", color: "from-pink-600 to-rose-600",    chart: customers.slice(-8).map((_, i) => i + 1) },
        ].map((kpi) => (
          <div key={kpi.label} className={`bg-gradient-to-br ${kpi.color} p-5 rounded-2xl relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 20%, white, transparent 60%)" }} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{kpi.label}</p>
                <span className="text-2xl">{kpi.icon}</span>
              </div>
              <p className="text-white text-3xl font-bold mb-1">{kpi.value}</p>
              <p className="text-white/60 text-xs mb-3">{kpi.sub}</p>
              <SparkBar data={kpi.chart} color="rgba(255,255,255,0.7)" />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold">Revenue Overview</h3>
            <p className="text-white/30 text-xs mt-0.5">Monthly performance</p>
          </div>
          <span className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/20">
            Last {revenueData.length || "—"} months
          </span>
        </div>
        {loading.analytics ? (
          <Skeleton className="h-40" />
        ) : revenueData.length > 0 ? (
          <div className="flex items-end gap-3 h-40">
            {revenueData.map((d, i) => {
              const max = Math.max(...revenueData.map((r) => r.revenue), 1);
              const h   = (d.revenue / max) * 100;
              const isLast = i === revenueData.length - 1;
              return (
                <div key={d.month || i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative rounded-lg overflow-hidden" style={{ height: "120px", background: "rgba(255,255,255,0.04)" }}>
                    <div className="absolute bottom-0 w-full rounded-lg transition-all duration-500"
                      style={{ height: `${h}%`, background: isLast ? "linear-gradient(to top, #7c3aed, #a855f7)" : "linear-gradient(to top, #3b0764, #6d28d9)" }} />
                  </div>
                  <span className="text-white/30 text-xs">{d.month}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center">
            {errors.analytics
              ? <ErrorBanner msg={errors.analytics} onRetry={() => onRetry("analytics")} />
              : <p className="text-white/20 text-sm">No revenue data available from API</p>
            }
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
            <button onClick={() => onNavigate("orders")} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</button>
          </div>
          {loading.orders ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : errors.orders ? (
            <ErrorBanner msg={errors.orders} onRetry={() => onRetry("orders")} />
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => {
                const name = o.customer || o.customerName || o.address?.fullName || "Unknown";
                const id   = o._id || o.id;
                return (
                  <div key={id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{name}</p>
                      <p className="text-white/30 text-xs">{String(id).slice(-8).toUpperCase()} · {o.date || o.createdAt?.slice(0, 10)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-xs font-bold">₹{(o.total || 0).toLocaleString()}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status] || STATUS_STYLES.Pending}`}>{o.status}</span>
                    </div>
                  </div>
                );
              })}
              {orders.length === 0 && <p className="text-white/20 text-xs text-center py-4">No orders yet</p>}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Top Products</h3>
            <button onClick={() => onNavigate("products")} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</button>
          </div>
          {loading.products ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : errors.products ? (
            <ErrorBanner msg={errors.products} onRetry={() => onRetry("products")} />
          ) : (
            <div className="space-y-3">
              {[...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5).map((p) => {
                const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                return (
                  <div key={p._id || p.id} className="flex items-center gap-3">
                    <img src={p.image || p.images?.[0]} alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover bg-white/5 flex-shrink-0"
                      onError={(e) => { e.target.src = "https://placehold.co/40x40/1e0a3c/a855f7?text=L"; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{p.name}</p>
                      <p className="text-white/30 text-xs">{p.category} · {(p.reviews || 0).toLocaleString()} reviews</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-xs font-bold">₹{(p.price || 0).toLocaleString()}</p>
                      {disc > 0 && <p className="text-emerald-400 text-xs">{disc}% off</p>}
                    </div>
                  </div>
                );
              })}
              {products.length === 0 && <p className="text-white/20 text-xs text-center py-4">No products yet</p>}
            </div>
          )}
        </div>
      </div>

      {/* Order status distribution */}
      <div className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Order Status Distribution</h3>
        {loading.orders ? (
          <div className="grid grid-cols-5 gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : (
          <div className="grid grid-cols-5 gap-3">
            {["Pending","Processing","Shipped","Delivered","Cancelled"].map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              return (
                <div key={status} className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-violet-500/20 transition-all">
                  <p className="text-white font-bold text-xl mb-1">{count}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>{status}</span>
                </div>
              );
            })}
          </div>
        )}
        {!loading.orders && orders.length === 0 && <p className="text-white/20 text-xs text-center py-4">No order data</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;