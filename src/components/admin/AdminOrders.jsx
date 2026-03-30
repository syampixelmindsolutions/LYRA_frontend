import React, { useState } from "react";
import { Skeleton, ErrorBanner, STATUS_STYLES, apiFetch } from "./AdminUtils.jsx";

const AdminOrders = ({ orders, setOrders, loading, errors, onRetry, notify, searchQuery }) => {
  const [orderFilter,  setOrderFilter]  = useState("All");
  const [editingOrder, setEditingOrder] = useState(null);

  const filtered = (() => {
    let o = orders;
    if (orderFilter !== "All") o = o.filter((x) => x.status === orderFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      o = o.filter((x) =>
        (x.customer || x.customerName || x.address?.fullName || "").toLowerCase().includes(q) ||
        (x._id || x.id || "").toLowerCase().includes(q)
      );
    }
    return o;
  })();

  // PUT /api/admin/orders/:id  { status }
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await apiFetch(`/orders/${orderId}`, { method: "PUT", body: JSON.stringify({ status }) });
      setOrders((prev) => prev.map((o) => (o._id || o.id) === orderId ? { ...o, status } : o));
      setEditingOrder(null);
      notify(`Order status → ${status}`);
    } catch (e) {
      notify(e.message, "error");
    }
  };

  return (
    <div className="space-y-4">
      {errors.orders && <ErrorBanner msg={errors.orders} onRetry={onRetry} />}

      <div className="flex items-center gap-2 flex-wrap">
        {["All","Pending","Processing","Shipped","Delivered","Cancelled"].map((f) => (
          <button key={f} onClick={() => setOrderFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              orderFilter === f
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white/5 text-white/50 border-white/10 hover:border-violet-500/30 hover:text-white/70"
            }`}>
            {f} ({f === "All" ? orders.length : orders.filter((o) => o.status === f).length})
          </button>
        ))}
        <button onClick={onRetry}
          className="ml-auto text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-full border border-violet-500/20 hover:border-violet-500/40 transition-all">
          ↻ Refresh
        </button>
      </div>

      <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5">
                  {["Order ID","Customer","Date","Items","Total","Payment","Status","Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((order) => {
                  const id   = order._id || order.id;
                  const name = order.customer || order.customerName || order.address?.fullName || "Unknown";
                  return (
                    <tr key={id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-violet-400 text-xs font-bold">{String(id).slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white text-xs font-medium">{name}</p>
                        <p className="text-white/30 text-xs">{order.address?.city || order.city || order.email || ""}</p>
                      </td>
                      <td className="px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">
                        {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—")}
                      </td>
                      <td className="px-4 py-3.5 text-white/60 text-xs">
                        {order.itemCount ?? (Array.isArray(order.items) ? order.items.length : "—")}
                      </td>
                      <td className="px-4 py-3.5 text-white text-xs font-bold">₹{(order.total || 0).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-white/50 text-xs capitalize">
                        {order.paymentMethod === "cod" ? "COD" : order.paymentMethod || order.payment || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        {editingOrder === id ? (
                          <select onChange={(e) => handleUpdateStatus(id, e.target.value)} defaultValue={order.status}
                            className="bg-[#1e0a3c] border border-violet-500/30 text-white text-xs rounded-lg px-2 py-1 outline-none">
                            {["Pending","Processing","Shipped","Delivered","Cancelled"].map((s) => <option key={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}>
                            {order.status || "Pending"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => setEditingOrder(editingOrder === id ? null : id)}
                          className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                          {editingOrder === id ? "Cancel" : "Edit"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center py-12 text-white/30 text-sm">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;