import React, { useState, useEffect, useCallback } from "react";
import { apiFetch, Skeleton, ErrorBanner } from "./AdminUtils.jsx";

// ── Gradient presets ──────────────────────────────────────────────
const GRADIENTS = [
  { label: "Cosmic Purple", from: "#1e0a3c", via: "#4c1d95", to: "#7c3aed", preview: "linear-gradient(135deg,#1e0a3c,#4c1d95,#7c3aed)" },
  { label: "Midnight Blue", from: "#0f172a", via: "#1e3a5f", to: "#2563eb", preview: "linear-gradient(135deg,#0f172a,#1e3a5f,#2563eb)" },
  { label: "Amber Glow",    from: "#1c0a00", via: "#92400e", to: "#d97706", preview: "linear-gradient(135deg,#1c0a00,#92400e,#d97706)" },
  { label: "Rose Bloom",    from: "#1a0010", via: "#9f1239", to: "#ec4899", preview: "linear-gradient(135deg,#1a0010,#9f1239,#ec4899)" },
  { label: "Emerald Night", from: "#022c22", via: "#064e3b", to: "#059669", preview: "linear-gradient(135deg,#022c22,#064e3b,#059669)" },
  { label: "Slate Storm",   from: "#0f172a", via: "#334155", to: "#64748b", preview: "linear-gradient(135deg,#0f172a,#334155,#64748b)" },
  { label: "Golden Hour",   from: "#1c1300", via: "#854d0e", to: "#eab308", preview: "linear-gradient(135deg,#1c1300,#854d0e,#eab308)" },
  { label: "Ocean Depth",   from: "#001a2e", via: "#0c4a6e", to: "#0891b2", preview: "linear-gradient(135deg,#001a2e,#0c4a6e,#0891b2)" },
];

// ── Default empty banner ──────────────────────────────────────────
const EMPTY = {
  title: "", subtitle: "", cta: "Shop Now", image: "",
  gradientFrom: "#1e0a3c", gradientVia: "#4c1d95", gradientTo: "#7c3aed",
  gradientLabel: "Cosmic Purple", active: true, order: 0,
};

// ── Live banner preview ───────────────────────────────────────────
const BannerPreview = ({ form }) => (
  <div className="rounded-xl overflow-hidden h-32 relative flex"
    style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientVia || form.gradientFrom}, ${form.gradientTo})` }}>
    <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 80% 20%, white, transparent 60%)" }} />
    <div className="relative z-10 flex flex-col justify-center px-6 w-2/3">
      <p className="text-white/60 text-xs tracking-widest uppercase mb-1">✦ Lyra Exclusive</p>
      <p className="text-white font-bold text-lg leading-tight mb-1">{form.title || "Banner Title"}</p>
      <p className="text-white/70 text-xs mb-3">{form.subtitle || "Banner subtitle text"}</p>
      <span className="text-xs font-semibold bg-white text-gray-900 px-3 py-1 rounded-lg w-fit">{form.cta || "Shop Now"} →</span>
    </div>
    {form.image && (
      <div className="w-1/3 relative overflow-hidden">
        <img src={form.image} alt="banner" className="absolute inset-0 w-full h-full object-cover"
          style={{ maskImage: "linear-gradient(to right, transparent, black 40%)", WebkitMaskImage: "linear-gradient(to right, transparent, black 40%)" }}
          onError={(e) => { e.target.style.display = "none"; }} />
      </div>
    )}
  </div>
);

// ── Banner modal ──────────────────────────────────────────────────
const BannerModal = ({ banner, onSave, onClose }) => {
  const [form,   setForm]   = useState(banner ? { ...banner } : { ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [tab,    setTab]    = useState("basic"); // basic | gradient

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const applyPreset = (preset) => {
    setForm((f) => ({ ...f, gradientFrom: preset.from, gradientVia: preset.via, gradientTo: preset.to, gradientLabel: preset.label }));
  };

  const handleSave = async () => {
    if (!form.title) { alert("Title is required"); return; }
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const inputCls = "w-full bg-[#0f0a1a] border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/50 transition-all";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#130d24] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 z-10">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 sticky top-0 bg-[#130d24] z-10">
          <div>
            <h2 className="text-white font-semibold text-lg">{banner ? "Edit Banner" : "Add New Banner"}</h2>
            <p className="text-white/30 text-xs mt-0.5">Live preview updates as you type</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 text-sm">✕</button>
        </div>

        {/* Live preview */}
        <div className="px-6 pt-5">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-3 font-semibold">Live Preview</p>
          <BannerPreview form={form} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 mt-5">
          {[["basic","📝 Content"],["gradient","🎨 Colours"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${tab === id ? "bg-violet-600 text-white" : "bg-white/5 text-white/50 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {tab === "basic" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">Title *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. New Season Arrivals" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="e.g. Up to 50% OFF on Premium Fashion" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">CTA Button Text</label>
                  <input value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Shop Now" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">Display Order</label>
                  <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} placeholder="0" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">Image URL (right side)</label>
                <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://images.unsplash.com/..." className={inputCls} />
                {form.image && (
                  <img src={form.image} alt="preview" className="mt-2 h-16 w-24 object-cover rounded-lg border border-white/10"
                    onError={(e) => { e.target.style.display = "none"; }} />
                )}
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <div>
                  <p className="text-white text-sm font-medium">Active</p>
                  <p className="text-white/30 text-xs">Show this banner on the homepage</p>
                </div>
                <div onClick={() => set("active", !form.active)}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${form.active ? "bg-violet-600" : "bg-white/10"}`}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: form.active ? "calc(100% - 22px)" : "2px" }} />
                </div>
              </div>
            </>
          )}

          {tab === "gradient" && (
            <>
              {/* Presets */}
              <div>
                <p className="text-white/30 text-xs uppercase tracking-wider mb-3 font-semibold">Gradient Presets</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {GRADIENTS.map((g) => (
                    <button key={g.label} onClick={() => applyPreset(g)}
                      className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${form.gradientLabel === g.label ? "border-white shadow-lg scale-105" : "border-transparent"}`}
                      style={{ background: g.preview }}>
                      <p className="absolute bottom-1 left-0 right-0 text-white text-xs font-semibold text-center drop-shadow">{g.label}</p>
                      {form.gradientLabel === g.label && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <span className="text-violet-700 text-xs font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom colour pickers */}
              <div>
                <p className="text-white/30 text-xs uppercase tracking-wider mb-3 font-semibold">Custom Colours</p>
                <div className="grid grid-cols-3 gap-4">
                  {[["From (left)", "gradientFrom"], ["Via (middle)", "gradientVia"], ["To (right)", "gradientTo"]].map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs text-white/30 mb-2">{label}</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={form[key] || "#000000"} onChange={(e) => { set(key, e.target.value); set("gradientLabel", "Custom"); }}
                          className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                        <input value={form[key] || ""} onChange={(e) => { set(key, e.target.value); set("gradientLabel", "Custom"); }}
                          placeholder="#1e0a3c" className="flex-1 bg-[#0f0a1a] border border-white/10 text-white text-xs rounded-lg px-2 py-2 outline-none font-mono" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Angle selector */}
              <div>
                <label className="block text-xs text-white/30 mb-2">Gradient Direction</label>
                <div className="flex gap-2 flex-wrap">
                  {["to right","to bottom right","to bottom","135deg","45deg","90deg"].map((dir) => (
                    <button key={dir} onClick={() => set("gradientDir", dir)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.gradientDir === dir ? "bg-violet-600 text-white border-violet-600" : "bg-white/5 text-white/40 border-white/10 hover:text-white"}`}>
                      {dir}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-white/5 sticky bottom-0 bg-[#130d24]">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg disabled:opacity-60 transition-all">
            {saving ? "Saving…" : banner ? "Save Changes" : "Create Banner"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ══ MAIN ══════════════════════════════════════════════════════════
const AdminBanners = ({ notify }) => {
  const [banners,  setBanners]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [modal,    setModal]    = useState(null);  // null | "new" | bannerObj
  const [deleting, setDeleting] = useState(null);

  // GET /api/admin/banners
  const loadBanners = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiFetch("/banners");
      setBanners(Array.isArray(data) ? data : data.banners || []);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadBanners(); }, [loadBanners]);

  // POST / PUT
  const handleSave = async (form) => {
    try {
      if (form._id || form.id) {
        const id  = form._id || form.id;
        const res = await apiFetch(`/banners/${id}`, { method: "PUT", body: JSON.stringify(form) });
        setBanners((prev) => prev.map((b) => (b._id || b.id) === id ? (res.banner || res) : b));
        notify("Banner updated!");
      } else {
        const res = await apiFetch("/banners", { method: "POST", body: JSON.stringify(form) });
        setBanners((prev) => [...prev, res.banner || res]);
        notify("Banner created!");
      }
      setModal(null);
    } catch (e) {
      notify(e.message, "error");
    }
  };

  // DELETE /api/admin/banners/:id
  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await apiFetch(`/banners/${id}`, { method: "DELETE" });
      setBanners((prev) => prev.filter((b) => (b._id || b.id) !== id));
      notify("Banner deleted.");
    } catch (e) {
      notify(e.message, "error");
    } finally { setDeleting(null); }
  };

  // PATCH toggle active
  const handleToggle = async (banner) => {
    const id = banner._id || banner.id;
    try {
      const res = await apiFetch(`/banners/${id}/toggle`, { method: "PATCH" });
      const updated = res.banner || { ...banner, active: !banner.active };
      setBanners((prev) => prev.map((b) => (b._id || b.id) === id ? updated : b));
      notify(`Banner ${updated.active ? "activated" : "deactivated"}.`);
    } catch (e) {
      notify(e.message, "error");
    }
  };

  // PATCH reorder
  const moveOrder = async (banner, dir) => {
    const id      = banner._id || banner.id;
    const newOrder = (banner.order || 0) + dir;
    try {
      await apiFetch(`/banners/${id}`, { method: "PUT", body: JSON.stringify({ ...banner, order: newOrder }) });
      setBanners((prev) => prev.map((b) => (b._id || b.id) === id ? { ...b, order: newOrder } : b));
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const sorted = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-4">
      {error && <ErrorBanner msg={error} onRetry={loadBanners} />}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Homepage Banners</p>
          <p className="text-white/30 text-xs mt-0.5">{banners.length} banners · {banners.filter((b) => b.active).length} active</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadBanners} className="text-xs text-violet-400 hover:text-violet-300 px-3 py-2 rounded-xl border border-violet-500/20 transition-all">↻ Refresh</button>
          <button onClick={() => setModal("new")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-900/50 transition-all">
            + Add Banner
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36" />)}</div>
      ) : sorted.length === 0 ? (
        <div className="bg-[#130d24] border border-white/5 rounded-2xl p-16 text-center">
          <p className="text-4xl mb-4">🖼</p>
          <p className="text-white font-semibold text-lg mb-2">No banners yet</p>
          <p className="text-white/30 text-sm mb-5">Create your first homepage banner to get started.</p>
          <button onClick={() => setModal("new")} className="px-6 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">+ Create Banner</button>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((banner, idx) => {
            const id        = banner._id || banner.id;
            const gradDir   = banner.gradientDir || "135deg";
            const bg        = `linear-gradient(${gradDir}, ${banner.gradientFrom || "#1e0a3c"}, ${banner.gradientVia || banner.gradientFrom || "#4c1d95"}, ${banner.gradientTo || "#7c3aed"})`;

            return (
              <div key={id} className={`bg-[#130d24] border rounded-2xl overflow-hidden transition-all ${banner.active ? "border-violet-500/20" : "border-white/5 opacity-60"}`}>
                {/* Mini preview strip */}
                <div className="relative h-24 overflow-hidden" style={{ background: bg }}>
                  <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 80% 20%, white, transparent 60%)" }} />
                  <div className="relative z-10 flex flex-col justify-center h-full px-6 w-2/3">
                    <p className="text-white/60 text-xs tracking-widest uppercase mb-1">✦ Lyra Exclusive</p>
                    <p className="text-white font-bold text-base leading-tight mb-1">{banner.title}</p>
                    <p className="text-white/70 text-xs">{banner.subtitle}</p>
                  </div>
                  {banner.image && (
                    <div className="absolute right-0 top-0 bottom-0 w-1/3">
                      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover"
                        style={{ maskImage: "linear-gradient(to right, transparent, black 40%)", WebkitMaskImage: "linear-gradient(to right, transparent, black 40%)" }}
                        onError={(e) => { e.target.style.display = "none"; }} />
                    </div>
                  )}
                  {/* Colour swatch badges */}
                  <div className="absolute bottom-2 left-6 flex items-center gap-2">
                    {[banner.gradientFrom, banner.gradientVia, banner.gradientTo].filter(Boolean).map((color, i) => (
                      <span key={i} className="w-4 h-4 rounded-full border border-white/30 shadow" style={{ background: color }} title={color} />
                    ))}
                    {banner.gradientLabel && (
                      <span className="text-xs text-white/50 ml-1">{banner.gradientLabel}</span>
                    )}
                  </div>
                </div>

                {/* Control row */}
                <div className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${banner.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20"}`}>
                        {banner.active ? "● Active" : "○ Inactive"}
                      </span>
                      <span className="text-white/30 text-xs">Order: {banner.order ?? idx}</span>
                      <span className="text-white/30 text-xs">CTA: {banner.cta || "Shop Now"}</span>
                    </div>
                  </div>

                  {/* Reorder */}
                  <div className="flex gap-1">
                    <button onClick={() => moveOrder(banner, -1)} disabled={idx === 0}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 text-xs transition-all">↑</button>
                    <button onClick={() => moveOrder(banner, 1)} disabled={idx === sorted.length - 1}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 text-xs transition-all">↓</button>
                  </div>

                  {/* Toggle active */}
                  <div onClick={() => handleToggle(banner)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all flex-shrink-0 ${banner.active ? "bg-violet-600" : "bg-white/10"}`}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: banner.active ? "calc(100% - 18px)" : "2px" }} />
                  </div>

                  {/* Actions */}
                  <button onClick={() => setModal(banner)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-violet-500/20 hover:text-violet-300 transition-all border border-white/5">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(id)} disabled={deleting === id}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5 disabled:opacity-50">
                    {deleting === id ? "…" : "🗑 Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <BannerModal
          banner={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default AdminBanners;