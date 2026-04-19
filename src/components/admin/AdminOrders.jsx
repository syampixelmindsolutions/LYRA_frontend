
import React, { useState } from "react";
import { Skeleton } from "./AdminUtils.jsx";

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Delivered:  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Shipped:    "bg-blue-500/15    text-blue-400    border border-blue-500/25",
  Processing: "bg-amber-500/15   text-amber-400   border border-amber-500/25",
  Pending:    "bg-gray-500/15    text-gray-400    border border-gray-500/25",
  Cancelled:  "bg-red-500/15     text-red-400     border border-red-500/25",
};

const PAYMENT_STYLES = {
  paid:     "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  pending:  "bg-amber-500/15   text-amber-400   border border-amber-500/25",
  failed:   "bg-red-500/15     text-red-400     border border-red-500/25",
  refunded: "bg-violet-500/15  text-violet-400  border border-violet-500/25",
};

const PAYMENT_LABELS = {
  cod: "Cash on Delivery", upi: "UPI", card: "Card",
  netbanking: "Net Banking", wallet: "Wallet",
};

const DELIVERY_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

// ─────────────────────────────────────────────────────────────────
// apiFetch inline (uses sessionStorage token)
// ─────────────────────────────────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  const u = JSON.parse(sessionStorage.getItem("user") || "{}");
  const res = await fetch(`https://lyra-backend-gilt.vercel.app/api/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(u.token ? { Authorization: `Bearer ${u.token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

const DeliveryProgress = ({ status }) => {
  const cancelled = status === "Cancelled";
  const activeIdx = cancelled ? -1 : DELIVERY_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 my-4">
      {DELIVERY_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              cancelled             ? "bg-white/5 border-white/10 text-white/20"
              : i < activeIdx       ? "bg-emerald-500 border-emerald-500 text-white"
              : i === activeIdx     ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/40"
              :                       "bg-white/5 border-white/10 text-white/25"
            }`}>
              {!cancelled && i < activeIdx ? "✓" : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium whitespace-nowrap ${
              cancelled         ? "text-white/20"
              : i === activeIdx  ? "text-violet-300"
              : i < activeIdx    ? "text-emerald-400"
              :                    "text-white/25"
            }`} style={{ fontSize: "9px" }}>{step}</span>
          </div>
          {i < DELIVERY_STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 mb-5 transition-all ${
              cancelled ? "bg-white/5" : i < activeIdx ? "bg-emerald-500" : "bg-white/8"
            }`} />
          )}
        </React.Fragment>
      ))}
      {cancelled && (
        <div className="ml-3 flex-shrink-0 text-xs text-red-400 font-bold bg-red-500/15 px-2 py-1 rounded-lg border border-red-500/25">
          ✕ Cancelled
        </div>
      )}
    </div>
  );
};
const resolveName = (order) =>
  order.userName
  || order.customerName
  || order.address?.fullName
  || order.user?.fullName
  || order.user?.name
  || "—";

const resolveEmail = (order) =>
  order.userEmail
  || order.customerEmail
  || order.user?.email
  || "—";

const resolveUserId = (order) =>
  String(order.userId || order.user?._id || order.user?.id || "—");

// ══════════════════════════════════════════════════════════════════
// ADMIN ORDERS
// ══════════════════════════════════════════════════════════════════
const AdminOrders = ({ orders, setOrders, loading, errors, onRetry, notify, searchQuery }) => {
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editStatus,    setEditStatus]    = useState(null);
  const [editPayment,   setEditPayment]   = useState(null);
  const [updatingId,    setUpdatingId]    = useState(null);

  // ── Filter ────────────────────────────────────────────────────
  const filtered = (() => {
    let o = orders;
    if (statusFilter !== "All") o = o.filter((x) => x.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      o = o.filter((x) =>
        resolveName(x).toLowerCase().includes(q) ||
        resolveEmail(x).toLowerCase().includes(q) ||
        String(x._id || "").toLowerCase().includes(q) ||
        (x.orderNumber || "").toLowerCase().includes(q) ||
        resolveUserId(x).toLowerCase().includes(q)
      );
    }
    return o;
  })();

  // ── Update delivery status — PUT /api/admin/orders/:id ────────
  const handleUpdateDelivery = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const data = await apiFetch(`/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((o) => String(o._id || o.id) === orderId
          ? {
              ...o, status,
              statusTimeline: data.order?.statusTimeline || o.statusTimeline,
              paymentStatus:  data.order?.paymentStatus  || o.paymentStatus,
            }
          : o
        )
      );
      setEditStatus(null);
      notify?.(`✓ Delivery → ${status}`);
    } catch (e) { notify?.(`Failed: ${e.message}`, "error"); }
    finally { setUpdatingId(null); }
  };

  // ── Update payment status — PATCH /api/admin/orders/:id/payment ──
  const handleUpdatePayment = async (orderId, paymentStatus) => {
    setUpdatingId(orderId);
    try {
      const data = await apiFetch(`/orders/${orderId}/payment`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => String(o._id || o.id) === orderId
          ? { ...o, paymentStatus, statusTimeline: data.order?.statusTimeline || o.statusTimeline }
          : o
        )
      );
      setEditPayment(null);
      notify?.(`✓ Payment → ${paymentStatus}`);
    } catch (e) { notify?.(`Failed: ${e.message}`, "error"); }
    finally { setUpdatingId(null); }
  };

  const toggleExpand = (id) => setExpandedOrder((p) => (p === id ? null : id));

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-4">

      {errors?.orders && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          ⚠ {errors.orders}
          {onRetry && <button onClick={onRetry} className="ml-auto text-xs underline">Retry</button>}
        </div>
      )}

      {/* Status filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All","Pending","Processing","Shipped","Delivered","Cancelled"].map((f) => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              statusFilter === f
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white/5 text-white/50 border-white/10 hover:border-violet-500/30 hover:text-white/70"
            }`}>
            {f}
            <span className="ml-1.5 opacity-60">({f === "All" ? orders.length : (counts[f] || 0)})</span>
          </button>
        ))}
        <button onClick={onRetry}
          className="ml-auto text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-full border border-violet-500/20 hover:border-violet-500/40 transition-all">
          ↻ Refresh
        </button>
      </div>

      {/* Orders table */}
      <div className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="w-8 px-4 py-3.5" />
                  {["Order ID","User","Date","Items","Total","Payment","Delivery","Actions"].map((h) => (
                    <th key={h} className="text-left px-3 py-3.5 text-white/30 text-xs font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((order) => {
                  const id         = String(order._id || order.id);
                  const isExpanded = expandedOrder === id;
                  const isUpdating = updatingId === id;
                  const customerName = resolveName(order);

                  return (
                    <React.Fragment key={id}>
                      {/* ── Summary row ── */}
                      <tr
                        className={`cursor-pointer transition-colors ${isExpanded ? "bg-violet-900/10" : "hover:bg-white/[0.02]"}`}
                        onClick={() => toggleExpand(id)}
                      >
                        {/* Expand toggle */}
                        <td className="px-4 py-3.5">
                          <span className={`text-white/30 text-xs transition-transform inline-block ${isExpanded ? "rotate-90" : ""}`}>▶</span>
                        </td>

                        {/* Order ID */}
                        <td className="px-3 py-3.5">
                          <p className="font-mono text-violet-400 text-xs font-bold">
                            {order.orderNumber || id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-white/20 text-[9px] font-mono mt-0.5">…{id.slice(-12)}</p>
                        </td>

                        {/* Customer */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-xs font-medium">{customerName}</p>
                              <p className="text-white/30 text-[9px]">{resolveEmail(order)}</p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-3 py-3.5 text-white/40 text-xs whitespace-nowrap">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"2-digit" })
                            : "—"}
                          <br />
                          <span className="text-white/20" style={{ fontSize: "10px" }}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }) : ""}
                          </span>
                        </td>

                        {/* Items thumbnails */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-1">
                            {(order.items || []).slice(0, 3).map((item, i) => (
                              <div key={i} className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                {item.image
                                  ? <img src={item.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                                  : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">?</div>
                                }
                              </div>
                            ))}
                            {(order.itemCount || (order.items || []).length || 0) > 3 && (
                              <span className="text-white/30 text-xs">+{(order.itemCount || (order.items || []).length) - 3}</span>
                            )}
                            {!(order.items || []).length && (
                              <span className="text-white/20 text-xs">—</span>
                            )}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-3 py-3.5">
                          <p className="text-white text-xs font-bold">₹{(order.total || 0).toLocaleString()}</p>
                          <p className="text-white/30 text-[9px]">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || "—"}</p>
                        </td>

                        {/* Payment status inline edit */}
                        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                          {editPayment === id ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                defaultValue={order.paymentStatus || "pending"}
                                disabled={isUpdating}
                                onChange={(e) => handleUpdatePayment(id, e.target.value)}
                                className="bg-[#1e0a3c] border border-violet-500/30 text-white text-xs rounded-lg px-2 py-1 outline-none"
                              >
                                {["pending","paid","failed","refunded"].map((s) => (
                                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                              </select>
                              <button onClick={() => setEditPayment(null)} className="text-white/30 text-xs hover:text-white/60">✕</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${PAYMENT_STYLES[order.paymentStatus || "pending"]}`}>
                                {order.paymentStatus || "pending"}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditPayment(id); setEditStatus(null); }}
                                className="text-white/20 hover:text-violet-400 text-xs transition-colors" title="Edit">✏</button>
                            </div>
                          )}
                        </td>

                        {/* Delivery status inline edit */}
                        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                          {editStatus === id ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                defaultValue={order.status}
                                disabled={isUpdating}
                                onChange={(e) => handleUpdateDelivery(id, e.target.value)}
                                className="bg-[#1e0a3c] border border-violet-500/30 text-white text-xs rounded-lg px-2 py-1 outline-none"
                              >
                                {["Pending","Processing","Shipped","Delivered","Cancelled"].map((s) => (
                                  <option key={s}>{s}</option>
                                ))}
                              </select>
                              <button onClick={() => setEditStatus(null)} className="text-white/30 text-xs hover:text-white/60">✕</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}>
                                {order.status || "Pending"}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditStatus(id); setEditPayment(null); }}
                                className="text-white/20 hover:text-violet-400 text-xs transition-colors" title="Edit">✏</button>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleExpand(id)}
                            className="text-xs text-violet-400 hover:text-violet-300 font-semibold px-2 py-1 rounded-lg hover:bg-violet-500/10 transition-colors">
                            {isExpanded ? "Close" : "Details"}
                          </button>
                        </td>
                      </tr>

                      {/* ── Expanded details ── */}
                      {isExpanded && (
                        <tr className="bg-[#0a0618]">
                          <td colSpan={9} className="px-6 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                              {/* ── LEFT col: Items + Progress + Timeline ── */}
                              <div className="lg:col-span-2 space-y-4">

                                {/* Order & User IDs */}
                                <div className="bg-[#130d24] border border-white/5 rounded-2xl p-4">
                                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">IDs</p>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-white/25 text-[9px] uppercase tracking-widest mb-0.5">Order ID (Full)</p>
                                      <p className="font-mono text-violet-400 text-xs font-bold break-all">{id}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/25 text-[9px] uppercase tracking-widest mb-0.5">Order Number</p>
                                      <p className="font-mono text-violet-300 text-xs font-bold">
                                        {order.orderNumber || id.slice(-8).toUpperCase()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-white/25 text-[9px] uppercase tracking-widest mb-0.5">User ID (Full)</p>
                                      <p className="font-mono text-pink-400 text-xs font-bold break-all">{resolveUserId(order)}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/25 text-[9px] uppercase tracking-widest mb-0.5">Short User ID</p>
                                      <p className="font-mono text-pink-300 text-xs font-bold">
                                        {resolveUserId(order) !== "—" ? resolveUserId(order).slice(-10).toUpperCase() : "—"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Items */}
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                                  Order Items ({(order.items || []).length})
                                </p>
                                {(order.items || []).map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-4 bg-[#130d24] rounded-2xl p-3 border border-white/5">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/8 flex-shrink-0">
                                      {item.image
                                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = "none"; }} />
                                        : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">📦</div>
                                      }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-violet-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">{item.brand || "—"}</p>
                                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="bg-white/8 text-white/50 text-xs px-2 py-0.5 rounded-lg border border-white/8">
                                          Size: {item.size || "—"}
                                        </span>
                                        <span className="bg-white/8 text-white/50 text-xs px-2 py-0.5 rounded-lg border border-white/8 flex items-center gap-1.5">
                                          <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                                            style={{ background: (item.color || "").toLowerCase() === "white" ? "#f5f5f5" : (item.color?.toLowerCase() || "#aaa") }} />
                                          {item.color || "—"}
                                        </span>
                                        <span className="text-white/30 text-xs">Qty: {item.quantity}</span>
                                      </div>
                                      {item.product && (
                                        <p className="text-white/20 text-[9px] font-mono mt-1">
                                          Product ID: {String(item.product).slice(-12).toUpperCase()}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-white font-bold text-sm">
                                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                      </p>
                                      {item.quantity > 1 && (
                                        <p className="text-white/30 text-xs mt-0.5">₹{(item.price || 0).toLocaleString()} each</p>
                                      )}
                                      {item.originalPrice && item.originalPrice > item.price && (
                                        <p className="text-emerald-400 text-xs">
                                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}

                                {/* Delivery progress */}
                                <div className="bg-[#130d24] rounded-2xl p-4 border border-white/5">
                                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Delivery Progress</p>
                                  <DeliveryProgress status={order.status} />
                                  {order.estimatedDelivery && order.status !== "Delivered" && order.status !== "Cancelled" && (
                                    <p className="text-white/30 text-xs">
                                      Estimated: {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
                                    </p>
                                  )}
                                </div>

                                {/* Status timeline — full tracking history */}
                                {Array.isArray(order.statusTimeline) && order.statusTimeline.length > 0 && (
                                  <div className="bg-[#130d24] rounded-2xl p-4 border border-white/5">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">
                                      Tracking History ({order.statusTimeline.length} events)
                                    </p>
                                    <div className="relative">
                                      {/* Vertical line */}
                                      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/8" />
                                      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                                        {[...order.statusTimeline].reverse().map((ev, i, arr) => {
                                          const isFirst = i === 0;
                                          const statusColor =
                                            ev.status === "Delivered" ? "#10b981"
                                            : ev.status === "Cancelled" ? "#ef4444"
                                            : ev.status === "Shipped" ? "#3b82f6"
                                            : ev.status === "Processing" ? "#f59e0b"
                                            : "#8b5cf6";
                                          return (
                                            <div key={i} className="flex items-start gap-4 pl-1">
                                              {/* Dot */}
                                              <div className="relative flex-shrink-0 mt-0.5">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 relative ${isFirst ? "border-white/30 bg-[#0a0618]" : "border-white/10 bg-[#0a0618]"}`}
                                                  style={{ borderColor: isFirst ? statusColor : undefined }}>
                                                  <div className="w-2 h-2 rounded-full" style={{ background: statusColor, opacity: isFirst ? 1 : 0.4 }} />
                                                </div>
                                              </div>
                                              {/* Content */}
                                              <div className="flex-1 min-w-0 pb-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[ev.status] || STATUS_STYLES.Pending}`}>
                                                    {ev.status}
                                                  </span>
                                                  {isFirst && (
                                                    <span className="text-[9px] font-bold text-white/25 bg-white/5 px-2 py-0.5 rounded-full">LATEST</span>
                                                  )}
                                                </div>
                                                {ev.message && (
                                                  <p className="text-white/55 text-xs mt-1 leading-relaxed">{ev.message}</p>
                                                )}
                                                {ev.note && (
                                                  <p className="text-white/35 text-xs mt-0.5 italic">Note: {ev.note}</p>
                                                )}
                                                <p className="text-white/25 text-[10px] mt-1 font-mono">
                                                  {ev.timestamp
                                                    ? new Date(ev.timestamp).toLocaleString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                        hour: "2-digit", minute: "2-digit", second: "2-digit",
                                                      })
                                                    : ev.createdAt
                                                    ? new Date(ev.createdAt).toLocaleString("en-IN")
                                                    : "Time not recorded"}
                                                </p>
                                                {ev.updatedBy && (
                                                  <p className="text-white/20 text-[9px] mt-0.5">Updated by: {ev.updatedBy}</p>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Empty timeline message */}
                                {(!order.statusTimeline || order.statusTimeline.length === 0) && (
                                  <div className="bg-[#130d24] rounded-2xl p-4 border border-white/5 text-center">
                                    <p className="text-white/20 text-sm">No tracking history recorded yet</p>
                                    <p className="text-white/15 text-xs mt-0.5">Timeline entries are added when order status changes</p>
                                  </div>
                                )}
                              </div>

                              {/* ── RIGHT col: Customer + Address + Financials + Edit ── */}
                              <div className="space-y-4">

                                {/* Customer card */}
                                <div className="bg-[#130d24] rounded-2xl p-4 border border-white/5">
                                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Customer</p>
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                      {resolveName(order).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-white text-sm font-semibold truncate">{resolveName(order)}</p>
                                      <p className="text-white/40 text-xs truncate">{resolveEmail(order)}</p>
                                    </div>
                                  </div>
                                  {(order.userPhone || order.user?.phone || order.address?.phone) && (
                                    <p className="text-white/40 text-xs mb-2">
                                      📞 {order.userPhone || order.user?.phone || order.address?.phone}
                                    </p>
                                  )}
                                  {/* User ID always shown */}
                                  <div className="bg-white/3 rounded-xl p-3 border border-white/5 mt-2">
                                    <p className="text-white/25 text-[9px] uppercase tracking-widest mb-1">User ID</p>
                                    <p className="font-mono text-pink-400 text-[10px] font-bold break-all">{resolveUserId(order)}</p>
                                    <p className="text-white/25 text-[9px] uppercase tracking-widest mt-2 mb-1">Order ID</p>
                                    <p className="font-mono text-violet-400 text-[10px] font-bold break-all">{id}</p>
                                  </div>
                                </div>

                                {/* Delivery address */}
                                {order.address && (
                                  <div className="bg-[#130d24] rounded-2xl p-4 border border-white/5">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">📍 Delivery Address</p>
                                    <p className="text-white/80 text-xs font-semibold">{order.address.fullName}</p>
                                    <p className="text-white/40 text-xs mt-0.5">{order.address.phone}</p>
                                    <p className="text-white/40 text-xs mt-1.5 leading-relaxed">
                                      {order.address.street}, {order.address.city},<br />
                                      {order.address.state} — {order.address.pincode}
                                    </p>
                                    {order.address.label && (
                                      <span className="inline-block mt-2 bg-violet-500/15 text-violet-400 text-xs px-2 py-0.5 rounded-lg border border-violet-500/20">
                                        {order.address.label}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Price breakdown */}
                                <div className="bg-[#130d24] rounded-2xl p-4 border border-white/5">
                                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Price Breakdown</p>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-white/40">Subtotal ({order.itemCount || (order.items || []).length} items)</span>
                                      <span className="text-white/70">₹{(order.subtotal || order.total || 0).toLocaleString()}</span>
                                    </div>
                                    {(order.discount || 0) > 0 && (
                                      <div className="flex justify-between text-xs">
                                        <span className="text-emerald-400">Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                                        <span className="text-emerald-400">− ₹{order.discount.toLocaleString()}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between text-xs">
                                      <span className="text-white/40">Shipping</span>
                                      <span className={(order.shippingFee || 0) === 0 ? "text-emerald-400" : "text-white/70"}>
                                        {(order.shippingFee || 0) === 0 ? "FREE" : `₹${order.shippingFee}`}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/8">
                                      <span className="text-white">Total</span>
                                      <span className="text-white">₹{(order.total || 0).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment & status edit */}
                                <div className="bg-[#130d24] rounded-2xl p-4 border border-white/5">
                                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Update Status</p>
                                  <div className="space-y-3">

                                    {/* Payment */}
                                    <div>
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-white/40 text-xs">Payment Status</span>
                                        <button onClick={() => setEditPayment(editPayment === id ? null : id)}
                                          className="text-white/20 hover:text-violet-400 text-xs transition-colors">✏ Edit</button>
                                      </div>
                                      {editPayment === id ? (
                                        <div className="grid grid-cols-2 gap-2">
                                          {["pending","paid","failed","refunded"].map((ps) => (
                                            <button key={ps} disabled={isUpdating}
                                              onClick={() => handleUpdatePayment(id, ps)}
                                              className={`py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                                                (order.paymentStatus || "pending") === ps
                                                  ? "bg-violet-600 text-white"
                                                  : "bg-white/5 text-white/50 hover:bg-violet-500/20 hover:text-violet-300"
                                              }`}>
                                              {ps.charAt(0).toUpperCase() + ps.slice(1)}
                                            </button>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${PAYMENT_STYLES[order.paymentStatus || "pending"]}`}>
                                          {order.paymentStatus || "pending"}
                                        </span>
                                      )}
                                    </div>

                                    {/* Delivery */}
                                    <div className="border-t border-white/5 pt-3">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-white/40 text-xs">Delivery Status</span>
                                        <button onClick={() => setEditStatus(editStatus === id ? null : id)}
                                          className="text-white/20 hover:text-violet-400 text-xs transition-colors">✏ Edit</button>
                                      </div>
                                      {editStatus === id ? (
                                        <div className="grid grid-cols-2 gap-2">
                                          {["Pending","Processing","Shipped","Delivered","Cancelled"].map((s) => (
                                            <button key={s} disabled={isUpdating}
                                              onClick={() => handleUpdateDelivery(id, s)}
                                              className={`py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                                                order.status === s ? "bg-violet-600 text-white" : "bg-white/5 text-white/50 hover:bg-violet-500/20 hover:text-violet-300"
                                              }`}>
                                              {s}
                                            </button>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}>
                                          {order.status || "Pending"}
                                        </span>
                                      )}
                                    </div>

                                    {isUpdating && (
                                      <p className="text-violet-400 text-xs text-center animate-pulse mt-2">Updating…</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/20 text-4xl mb-3">📦</p>
            <p className="text-white/30 text-sm">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;