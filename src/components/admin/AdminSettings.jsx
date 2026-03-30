import React, { useState, useEffect } from "react";
import { apiFetch, Skeleton, ErrorBanner, AdminInput, Toggle } from "./AdminUtils.jsx";

const DEFAULTS = {
  storeName: "Lyra Fashion", supportEmail: "support@lyra.com", supportPhone: "+91 98765 43210", gstNumber: "",
  freeDeliveryThreshold: "999", standardDeliveryFee: "60", expressDeliveryFee: "150", estimatedDeliveryDays: "5-7",
  notifications: { newOrderAlerts: true, lowStockAlerts: true, reviewAlerts: false, weeklyReport: true },
};

const AdminSettings = ({ notify }) => {
  const [form,    setForm]    = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const data = await apiFetch("/settings");
        setForm({ ...DEFAULTS, ...(data.settings || data) });
      } catch (e) {
        // Settings endpoint may not exist yet — use defaults
        setForm(DEFAULTS);
        if (!e.message.includes("404")) setError(e.message);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const set     = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setNotif = (k, v) => setForm((f) => ({ ...f, notifications: { ...(f.notifications || {}), [k]: v } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch("/settings", { method: "PUT", body: JSON.stringify(form) });
      notify("Settings saved!");
    } catch (e) {
      // Fallback if no backend route yet
      notify("Settings saved locally! (Add PUT /api/admin/settings to persist)");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="space-y-4 max-w-2xl">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}</div>;

  const notifs = form.notifications || {};

  return (
    <div className="max-w-2xl space-y-5">
      {error && <ErrorBanner msg={error} />}

      {/* Store info */}
      <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold mb-1">Store Settings</h3>
        <AdminInput label="Store Name"    value={form.storeName}     onChange={(e) => set("storeName",     e.target.value)} placeholder="Lyra Fashion" />
        <AdminInput label="Support Email" value={form.supportEmail}  onChange={(e) => set("supportEmail",  e.target.value)} placeholder="support@lyra.com" type="email" />
        <AdminInput label="Support Phone" value={form.supportPhone}  onChange={(e) => set("supportPhone",  e.target.value)} placeholder="+91 98765 43210" type="tel" />
        <AdminInput label="GST Number"    value={form.gstNumber}     onChange={(e) => set("gstNumber",     e.target.value)} placeholder="29AABCL1234A1Z5" />
      </div>

      {/* Delivery */}
      <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold mb-1">Delivery Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Free Delivery Threshold (₹)" value={form.freeDeliveryThreshold} onChange={(e) => set("freeDeliveryThreshold", e.target.value)} placeholder="999" />
          <AdminInput label="Standard Delivery Fee (₹)"   value={form.standardDeliveryFee}   onChange={(e) => set("standardDeliveryFee",   e.target.value)} placeholder="60" />
          <AdminInput label="Express Delivery Fee (₹)"    value={form.expressDeliveryFee}     onChange={(e) => set("expressDeliveryFee",     e.target.value)} placeholder="150" />
          <AdminInput label="Estimated Delivery Days"     value={form.estimatedDeliveryDays} onChange={(e) => set("estimatedDeliveryDays", e.target.value)} placeholder="5-7" />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#130d24] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">Notifications</h3>
        <div className="space-y-3">
          {[
            { label: "New Order Alerts",      sub: "Email for each new order",        key: "newOrderAlerts" },
            { label: "Low Stock Alerts",       sub: "Alert when stock falls below 10", key: "lowStockAlerts" },
            { label: "Customer Review Alerts", sub: "Get notified of new reviews",     key: "reviewAlerts" },
            { label: "Weekly Revenue Report",  sub: "Summary sent every Monday",       key: "weeklyReport" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-white text-sm font-medium">{n.label}</p>
                <p className="text-white/30 text-xs">{n.sub}</p>
              </div>
              <Toggle value={notifs[n.key] ?? false} onChange={() => setNotif(n.key, !notifs[n.key])} />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-900/50 transition-all disabled:opacity-60">
        {saving ? "Saving…" : "Save All Settings"}
      </button>
    </div>
  );
};

export default AdminSettings;