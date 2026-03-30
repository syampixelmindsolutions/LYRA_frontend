import React from "react";
import { Skeleton, ErrorBanner } from "./AdminUtils.jsx";

const AdminCustomers = ({ customers, loading, errors, onRetry, searchQuery }) => {
  const filtered = searchQuery
    ? customers.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (c.name || c.fullName || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q);
      })
    : customers;

  return (
    <div className="space-y-4">
      {errors.customers && <ErrorBanner msg={errors.customers} onRetry={onRetry} />}

      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">{filtered.length} customers</p>
        <button onClick={onRetry} className="text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-full border border-violet-500/20 hover:border-violet-500/40 transition-all">
          ↻ Refresh
        </button>
      </div>

      <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5">
                  {["Customer","Email","Phone","City","Orders","Total Spent","Joined","Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => {
                  const name = c.name || c.fullName || "Unknown";
                  return (
                    <tr key={c._id || c.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white text-xs font-medium">{name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-white/40 text-xs">{c.email || "—"}</td>
                      <td className="px-4 py-3.5 text-white/40 text-xs">{c.phone || c.mobileNumber || "—"}</td>
                      <td className="px-4 py-3.5 text-white/40 text-xs">{c.city || "—"}</td>
                      <td className="px-4 py-3.5 text-white text-xs font-bold">{c.orders || c.orderCount || 0}</td>
                      <td className="px-4 py-3.5 text-emerald-400 text-xs font-bold">₹{(c.spent || c.totalSpent || 0).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-white/30 text-xs">
                        {c.joined || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { month:"short", year:"numeric" }) : "—")}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          c.status === "New"    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                  "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}>{c.status || "Active"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && <p className="text-center py-12 text-white/30 text-sm">No customers found</p>}
      </div>
    </div>
  );
};

export default AdminCustomers;