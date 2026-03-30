import React from "react";
import { Skeleton, ErrorBanner } from "./AdminUtils.jsx";

const AdminAnalytics = ({ analytics, loading, errors, onRetry }) => {
  const revenueData = analytics?.revenue || [];

  return (
    <div className="space-y-6">
      {errors.analytics && <ErrorBanner msg={errors.analytics} onRetry={onRetry} />}

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : analytics?.metrics ? (
          [
            { label: "Conversion Rate",    value: analytics.metrics.conversionRate   || "—", trend: analytics.metrics.conversionRateTrend },
            { label: "Avg Order Value",    value: analytics.metrics.avgOrderValue    || "—", trend: analytics.metrics.avgOrderValueTrend },
            { label: "Return Rate",        value: analytics.metrics.returnRate       || "—", trend: analytics.metrics.returnRateTrend },
            { label: "Customer Sat Score", value: analytics.metrics.customerSatScore || "—", trend: analytics.metrics.customerSatTrend },
          ].map((m) => (
            <div key={m.label} className="bg-[#130d24] border border-white/5 rounded-2xl p-5">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-2">{m.label}</p>
              <p className="text-white text-2xl font-bold">{m.value}</p>
              {m.trend && <p className="text-xs font-semibold mt-1 text-emerald-400">{m.trend} vs last month</p>}
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center text-white/20 text-sm py-8">Analytics metrics not available from API</div>
        )}
      </div>

      {/* Category performance */}
      <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">Category Performance</h3>
        {loading ? (
          <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6" />)}</div>
        ) : analytics?.categories?.length > 0 ? (
          <div className="space-y-4">
            {analytics.categories.map((item, idx) => {
              const COLORS = ["#7c3aed","#2563eb","#d97706","#db2777","#059669","#dc2626","#0891b2","#7c3aed"];
              const pct    = item.pct || item.percentage || 0;
              return (
                <div key={item.cat || item.category || idx} className="flex items-center gap-4">
                  <span className="text-white/60 text-xs w-28 flex-shrink-0">{item.cat || item.category}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: COLORS[idx % COLORS.length] }} />
                  </div>
                  <span className="text-white/40 text-xs w-16 text-right flex-shrink-0">₹{((item.revenue || 0) / 1000).toFixed(1)}K</span>
                  <span className="text-white/20 text-xs w-8 text-right flex-shrink-0">{pct}%</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-white/20 text-sm text-center py-4">No category data available</p>
        )}
      </div>

      {/* Monthly summary table */}
      <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-semibold">Monthly Summary</h3>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
        ) : revenueData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Month","Orders","Revenue","Avg Order","Growth"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {revenueData.map((d, i) => {
                  const prev   = revenueData[i - 1];
                  const growth = prev && prev.revenue > 0 ? (((d.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : null;
                  const isLast = i === revenueData.length - 1;
                  return (
                    <tr key={d.month || i} className={`hover:bg-white/3 transition-colors ${isLast ? "bg-violet-500/5" : ""}`}>
                      <td className="px-6 py-3 text-white text-sm font-medium">{d.month}</td>
                      <td className="px-6 py-3 text-white/60 text-sm">{d.orders ?? "—"}</td>
                      <td className="px-6 py-3 text-white text-sm font-bold">₹{(d.revenue || 0).toLocaleString()}</td>
                      <td className="px-6 py-3 text-white/60 text-sm">
                        {d.orders > 0 ? `₹${Math.round(d.revenue / d.orders).toLocaleString()}` : "—"}
                      </td>
                      <td className="px-6 py-3">
                        {growth != null ? (
                          <span className={`text-sm font-semibold ${Number(growth) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {Number(growth) >= 0 ? "+" : ""}{growth}%
                          </span>
                        ) : <span className="text-white/20 text-sm">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/20 text-sm text-center py-8">No monthly data from API</p>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;